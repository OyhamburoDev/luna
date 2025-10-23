import { getAuth } from "firebase/auth";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "../config/firebase";
import { AdoptionFormDataWithId } from "../types/forms";
import { AppNotification } from "../types/notifications";

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

  async getUserNotification(): Promise<AppNotification[]> {
    const userId = await this.getCurrentUserId();
    console.log("UID actual:", userId);

    const q = query(
      collection(db, "adoption_requests"),
      where("ownerId", "==", userId),
      orderBy("submittedAt", "desc")
    );

    const snapshot = await getDocs(q);
    console.log(
      "docs snapshot:",
      snapshot.docs.map((doc) => doc.data())
    );

    const notifications: AppNotification[] = snapshot.docs.map((doc) => {
      const data = doc.data() as AdoptionFormDataWithId;

      return {
        id: doc.id,
        type: "adoption_request",
        title: "Nueva solicitud de adopción",
        subtitle: `${data.name} quiere adoptar a ${data.petName}`,
        icon: "paw",
        color: "#4CAF50",
        createdAt: data.submittedAt?.toDate?.() || new Date(),
        read: false,
      };
    });
    console.log("notifications creadas:", notifications);
    return notifications;
  }
}

export const notificationsService = new NotificationsService();
