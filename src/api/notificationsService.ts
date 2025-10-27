import { getAuth } from "firebase/auth";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { AdoptionFormDataWithId } from "../types/forms";
import { AppNotification } from "../types/notifications";
import {
  getUserImage,
  getUserProfile,
  isProfileComplete,
} from "./userProfileService";

class NotificationsService {
  /**
   * Obtiene el userId esperando autenticación
   */
  private async getCurrentUserId(): Promise<string> {
    const auth = getAuth();

    // Esperar a que el estado de autenticación esté listo
    await new Promise((resolve, reject) => {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        unsubscribe(); // Limpiar el listener inmediatamente
        resolve(user);
      }, reject);
    });

    if (!auth.currentUser) {
      throw new Error("Usuario no autenticado");
    }

    return auth.currentUser.uid;
  }

  /* Obtener las notificaciones del sistema del usaurio */
  async getSystemNotifications(userId: string): Promise<AppNotification[]> {
    try {
      // 1. Traer notificaciones guardadas en Firebase
      const q = query(
        collection(db, "system_notifications"),
        where("userId", "==", userId)
      );

      const snapshot = await getDocs(q);

      // Mapear con Promise.all para obtener fotos de usuarios
      const savedNotifications: AppNotification[] = await Promise.all(
        snapshot.docs.map(async (doc) => {
          const data = doc.data();

          // Si es un like, obtener la foto del usuario que dio like
          let userPhoto: string | undefined = undefined;

          if (data.type === "like" && data.likerUserId) {
            console.log(
              "🔍 Obteniendo foto para likerUserId:",
              data.likerUserId
            );
            userPhoto = (await getUserImage(data.likerUserId)) || undefined;
            console.log("📸 Foto obtenida:", userPhoto);
          }

          return {
            id: doc.id,
            type: data.type || "system",
            title: data.title || "",
            subtitle: data.subtitle || "",
            userPhoto: userPhoto,
            icon: data.icon || "notifications",
            color: data.color || "#A78BFA",
            createdAt: data.createdAt?.toDate?.() || new Date(),
            read: data.read || false,
          };
        })
      );

      // 2. Generar notificaciones dinámicas
      const dynamicNotifications: AppNotification[] = [];

      // Verificar si el perfil está incompleto
      const userProfile = await getUserProfile(userId);

      if (userProfile && !isProfileComplete(userProfile)) {
        dynamicNotifications.push({
          id: "dynamic_incomplete_profile",
          type: "system",
          title: "Completa tu perfil 📝",
          subtitle:
            "Agrega tu foto, nombre completo y biografía para recibir más solicitudes",
          userPhoto: undefined,
          icon: "person-circle",
          color: "#A78BFA",
          createdAt: new Date(),
          read: false,
        });
      }

      // 3. Unir ambas
      return [...savedNotifications, ...dynamicNotifications];
    } catch (error) {
      console.log("Error obteniendo notificaciones del sistema:", error);
      return [];
    }
  }

  async getUserNotification(): Promise<AppNotification[]> {
    const userId = await this.getCurrentUserId();

    // 1. Traer notificaciones de adopción
    const adoptionQuery = query(
      collection(db, "adoption_requests"),
      where("ownerId", "==", userId),
      orderBy("submittedAt", "desc")
    );

    const adoptionSnapshot = await getDocs(adoptionQuery);

    const adoptionNotifications: AppNotification[] = await Promise.all(
      adoptionSnapshot.docs.map(async (doc) => {
        const data = doc.data() as AdoptionFormDataWithId;
        const applicantPhoto = await getUserImage(data.applicantId);

        return {
          id: doc.id,
          type: "adoption_request",
          title: "Nueva solicitud de adopción",
          subtitle: `${data.name} quiere adoptar a ${data.petName}`,
          userPhoto: applicantPhoto || undefined,
          icon: "paw",
          color: "#4ECDC4",
          createdAt: data.submittedAt?.toDate?.() || new Date(),
          read: false,
        };
      })
    );

    // 2. Traer notificaciones del sistema

    const systemNotifications = await this.getSystemNotifications(userId);

    // 3. Unir ambas y ordenar por fecha
    const allNotifications = [
      ...adoptionNotifications,
      ...systemNotifications,
    ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    return allNotifications;
  }

  /* Crear una notificación de "Primera publicación" */
  async createFirstPetNotification(
    userId: string,
    petName: string
  ): Promise<void> {
    try {
      // Crear la notificación
      const notification = {
        type: "system",
        title: "¡Tu primera publicación!",
        subtitle: `${petName} ya está visible para adopción. Te avisaremos cuando recibas solicitudes`,
        icon: "checkmark-circle",
        color: "#4ECDC4",
        createdAt: serverTimestamp(),
        read: false,
      };

      // Guardar en Firestore
      await addDoc(collection(db, "system_notifications"), {
        ...notification,
        userId: userId, // ← Agregamos el userId como campo
      });
    } catch (error) {
      console.log("Error creando notificación:", error);
      // No lanzamos error para que no afecte la creación del post
    }
  }

  /* Crea una notificación de bienvenida cuando el usuario se registra  */
  async createWelcomeNotification(userId: string): Promise<void> {
    try {
      const notification = {
        userId: userId,
        type: "system",
        title: "¡Bienvenido a la comunidad!",
        subtitle:
          "Empieza publicando tu primera mascota o busca un nuevo compañero",
        icon: "heart",
        color: "#FF6B9D",
        createdAt: serverTimestamp(),
        read: false,
      };

      await addDoc(collection(db, "system_notifications"), notification);
    } catch (error) {
      console.log("❌ Error creando notificación de bienvenida:", error);
    }
  }

  /* Crear una notificación de perfil incompleto */
  async createIncompleteProfileNotification(userId: string): Promise<void> {
    try {
      const notification = {
        userId: userId,
        type: "system",
        title: "Completa tu perfil 📝",
        subtitle:
          "Agrega tu foto, nombre completo y biografía para recibir más solicitudes",
        icon: "person-circle",
        color: "#A78BFA",
        createdAt: serverTimestamp(),
        read: false,
      };

      await addDoc(collection(db, "system_notifications"), notification);
    } catch (error) {
      console.log("❌ Error creando notificación de perfil incompleto:", error);
    }
  }

  /* Notificación para cuando alguien da like a un post */
  async createLikeNotification(
    postOwnerId: string,
    likerUserId: string,
    likerName: string,
    postId: string,
    petName: string
  ): Promise<void> {
    try {
      // No crear notificación si el usuario se da like a sí mismo
      if (postOwnerId === likerUserId) {
        return;
      }

      // Verificar si ya existe una notificación de este usuario para este post
      const q = query(
        collection(db, "system_notifications"),
        where("userId", "==", postOwnerId),
        where("type", "==", "like"),
        where("postId", "==", postId),
        where("likerUserId", "==", likerUserId)
      );

      const snapshot = await getDocs(q);

      // Si ya existe, no crear otra
      if (!snapshot.empty) {
        console.log("⚠️ Ya existe notificación de like, no se crea duplicada");
        return;
      }

      const notification = {
        userId: postOwnerId, // El dueño del post recibe la notificación
        type: "like",
        title: "Nueva actividad",
        subtitle: `A ${likerName} le gustó tu publicación de ${petName}`,
        icon: "heart",
        color: "#FF6B9D",
        createdAt: serverTimestamp(),
        read: false,
        postId: postId, // Para poder abrir el post cuando haga click
        likerUserId: likerUserId, // Para obtener la foto del que dio like
      };

      await addDoc(collection(db, "system_notifications"), notification);

      console.log("✅ Notificación de like creada");
    } catch (error) {
      console.log("❌ Error creando notificación de like:", error);
    }
  }
}

export const notificationsService = new NotificationsService();
