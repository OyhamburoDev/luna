import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
  Timestamp,
  orderBy,
  deleteDoc,
  doc,
  documentId,
  updateDoc,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { getAuth } from "firebase/auth"; // ✅ NUEVO
import { db, storage } from "../config/firebase";
import { PetPost } from "../types/petPots";
import * as VideoThumbnails from "expo-video-thumbnails";
import { notificationsService } from "./notificationsService";
import { getFunctions, httpsCallable } from "firebase/functions";

type MediaItem = {
  uri: string;
  type: "photo" | "video";
  width?: number;
  height?: number;
};

class PostService {
  /**
   * ✅ NUEVO - Obtiene el userId del usuario autenticado
   */
  private getCurrentUserId(): string {
    const auth = getAuth();
    if (!auth.currentUser) {
      throw new Error("Usuario no autenticado");
    }
    return auth.currentUser.uid;
  }

  /**
   * Sube una imagen/video a Firebase Storage
   */
  private async uploadMedia(
    uri: string,
    userId: string,
    index: number,
    type: "photo" | "video"
  ): Promise<string> {
    try {
      // Convertir URI a Blob
      const response = await fetch(uri);
      const blob = await response.blob();

      // Crear referencia en Storage
      const fileExtension = type === "photo" ? "jpg" : "mp4";
      const fileName = `${Date.now()}_${index}.${fileExtension}`;
      const storageRef = ref(storage, `posts/${userId}/${fileName}`);

      // Subir archivo
      await uploadBytes(storageRef, blob);

      // Obtener URL de descarga
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      console.log("Error uploading media:", error);
      throw new Error("Error al subir el archivo");
    }
  }

  /**
   * Genera un thumbnail de un video y lo sube a Storage
   */
  private async generateAndUploadThumbnail(
    videoUri: string,
    userId: string,
    index: number
  ): Promise<string> {
    try {
      // Generar thumbnail del video
      const { uri: thumbnailUri } = await VideoThumbnails.getThumbnailAsync(
        videoUri,
        {
          time: 0, // Toma el frame en el segundo 0
        }
      );

      // Convertir thumbnail a Blob
      const response = await fetch(thumbnailUri);
      const blob = await response.blob();

      // Crear referencia en Storage
      const fileName = `${Date.now()}_${index}_thumb.jpg`;
      const storageRef = ref(storage, `posts/${userId}/${fileName}`);

      // Subir thumbnail
      await uploadBytes(storageRef, blob);

      // Obtener URL de descarga
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      console.log("Error generating thumbnail:", error);
      throw new Error("Error al generar miniatura del video");
    }
  }

  /**
   * Crea un nuevo post usando Cloud Functions para validación segura
   */
  async createPost(
    postData: Partial<PetPost>,
    mediaList: MediaItem[],
    userId: string
  ): Promise<string> {
    try {
      // 1. Subir todas las imágenes/videos PRIMERO
      const uploadPromises = mediaList.map((media, index) =>
        this.uploadMedia(media.uri, userId, index, media.type)
      );

      const mediaUrls = await Promise.all(uploadPromises);

      // 2. Buscar si hay video y generar thumbnail
      let thumbnailUri: string | undefined;
      const videoMedia = mediaList.find((media) => media.type === "video");

      if (videoMedia) {
        const videoIndex = mediaList.indexOf(videoMedia);
        thumbnailUri = await this.generateAndUploadThumbnail(
          videoMedia.uri,
          userId,
          videoIndex
        );
      }

      // 3. 🔥 LLAMAR A CLOUD FUNCTION (validación segura en servidor)
      const functions = getFunctions();

      const dataToSend = {
        postData: {
          ...postData,
          mediaUrls,
          thumbnailUri,
          likes: 0,
          views: 0,
        },
      };

      console.log(
        "📤 Enviando a Cloud Function:",
        JSON.stringify(dataToSend, null, 2)
      );

      const createPostFn = httpsCallable(functions, "createPost");
      const result = await createPostFn(dataToSend); // ✅ Usamos dataToSend

      const { postId, remainingPosts } = result.data as {
        success: boolean;
        postId: string;
        remainingPosts: number;
      };

      console.log(
        `✅ Post creado: ${postId}, quedan ${remainingPosts} posts hoy`
      );

      // 4. Crear notificación si es su primera publicación
      const userPostsCount = await this.getOwnerPostsCount(userId);
      if (userPostsCount === 1) {
        await notificationsService.createFirstPetNotification(
          userId,
          postData.petName || "tu mascota"
        );
      }

      return postId;
    } catch (error) {
      console.error("Error en createPost:", error);

      // Manejar errores específicos de Cloud Functions
      if (error instanceof Error) {
        if (error.message.includes("límite")) {
          throw new Error("Has alcanzado el límite de publicaciones por hoy");
        }
        if (error.message.includes("conexión")) {
          throw new Error("Demasiadas publicaciones desde esta conexión hoy");
        }
        throw error;
      }

      throw new Error("Error al crear la publicación");
    }
  }

  /**
   * ✅ MODIFICADO - Obtiene los posts del usuario autenticado
   */
  async getUserPosts(): Promise<PetPost[]> {
    try {
      const userId = this.getCurrentUserId(); // ✅ Mantener esta verificación

      const postsQuery = query(
        collection(db, "posts"),
        where("userId", "==", userId),
        orderBy("createdAt", "desc") // ✅ Mantener el orden
      );

      const snapshot = await getDocs(postsQuery);

      return snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          petName: data.petName || "",
          description: data.description || "",
          createdAt: data.createdAt?.toDate
            ? data.createdAt.toDate()
            : new Date(data.createdAt),
          age: data.age || 0,
          gender: data.gender || "",
          size: data.size || "",
          species: data.species || "dog",
          ownerId: data.userId || data.ownerId || "",
          ownerName: data.ownerName || "Usuario",
          likes: data.likes || 0,
          // ✅ AGREGAR LA TRANSFORMACIÓN (igual que getPostsByIds):
          videoUri: data.mediaUrls?.find((url: string) => url.includes(".mp4"))
            ? {
                uri: data.mediaUrls.find((url: string) => url.includes(".mp4")),
              }
            : undefined,
          imageUris: data.mediaUrls
            ? data.mediaUrls
                .filter((url: string) => !url.includes(".mp4"))
                .map((url: string) => ({ uri: url }))
            : undefined,
          thumbnailUri: data.thumbnailUri,
        } as PetPost;
      });
    } catch (error) {
      console.log("Error getting user posts:", error);
      throw new Error("Error al obtener las publicaciones");
    }
  }

  /**
   * Actualiza un post existente
   */
  async updatePost(postId: string, updates: Partial<PetPost>) {
    try {
      // Implementar update
    } catch (error) {
      console.log("Error updating post:", error);
      throw error;
    }
  }

  /**
   * Elimina un post y sus medias asociados
   */
  async deletePost(postId: string, mediaUrls: string[], thumbnailUri?: string) {
    try {
      // 1. Eliminar todas las imágenes/videos del Storage
      const deletePromises = mediaUrls.map(async (url) => {
        try {
          const mediaRef = ref(storage, url);
          await deleteObject(mediaRef);
        } catch (error) {
          console.log("Error deleting media:", error);
          // Continuar aunque falle alguna imagen
        }
      });

      // 2. Eliminar thumbnail si existe
      if (thumbnailUri) {
        try {
          const thumbRef = ref(storage, thumbnailUri);
          await deleteObject(thumbRef);
        } catch (error) {
          console.log("Error deleting thumbnail:", error);
        }
      }

      await Promise.allSettled(deletePromises);

      // 3. Eliminar documento de Firestore
      await deleteDoc(doc(db, "posts", postId));

      console.log("Post deleted successfully");
    } catch (error) {
      console.log("Error deleting post:", error);
      throw new Error("Error al eliminar la publicación");
    }
  }

  /**
   * Obtiene posts por sus IDs (máximo 10)
   */
  async getPostsByIds(postIds: string[]): Promise<PetPost[]> {
    try {
      if (postIds.length === 0) return [];

      const limitedIds = postIds.slice(0, 10);

      const postsQuery = query(
        collection(db, "posts"),
        where(documentId(), "in", limitedIds)
      );

      const snapshot = await getDocs(postsQuery);

      return snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          petName: data.petName || "",
          description: data.description || "",
          createdAt: data.createdAt?.toDate
            ? data.createdAt.toDate()
            : new Date(data.createdAt),
          age: data.age || 0,
          gender: data.gender || "",
          size: data.size || "",
          species: data.species || "dog",
          ownerId: data.userId || data.ownerId || "",
          ownerName: data.ownerName || "Usuario",
          likes: data.likes || 0,
          videoUri: data.mediaUrls?.find((url: string) => url.includes(".mp4"))
            ? {
                uri: data.mediaUrls.find((url: string) => url.includes(".mp4")),
              }
            : undefined,
          imageUris: data.mediaUrls
            ? data.mediaUrls
                .filter((url: string) => !url.includes(".mp4"))
                .map((url: string) => ({ uri: url }))
            : undefined,
          thumbnailUri: data.thumbnailUri,
        } as PetPost;
      });
    } catch (error) {
      console.log("Error getting posts by IDs:", error);
      throw new Error("Error al obtener publicaciones");
    }
  }

  /**
   * Obtiene la cantidad de posts de un usuario
   */
  async getOwnerPostsCount(ownerId: string): Promise<number> {
    try {
      const postsQuery = query(
        collection(db, "posts"),
        where("userId", "==", ownerId)
      );

      const snapshot = await getDocs(postsQuery);
      return snapshot.size;
    } catch (error) {
      console.log("Error getting owner posts count:", error);
      throw new Error("Error al obtener cantidad de publicaciones");
    }
  }

  /**
   * Obtiene la suma total de likes de todos los posts de un usuario
   */
  async getOwnerTotalLikes(ownerId: string): Promise<number> {
    try {
      const postsQuery = query(
        collection(db, "posts"),
        where("userId", "==", ownerId)
      );

      const snapshot = await getDocs(postsQuery);

      const totalLikes = snapshot.docs.reduce((sum, doc) => {
        const data = doc.data();
        return sum + (data.likes || 0);
      }, 0);

      return totalLikes;
    } catch (error) {
      console.log("Error getting owner total likes:", error);
      throw new Error("Error al obtener likes totales");
    }
  }

  /**
   * Actualiza los datos del usuario en todos sus posts
   */
  async updateUserDataInAllPosts(
    userId: string,
    userData: {
      displayName?: string;
      photoUrl?: string | null;
      location?: string | null;
    }
  ): Promise<void> {
    try {
      // 1. Buscar todos los posts del usuario
      const postsQuery = query(
        collection(db, "posts"),
        where("userId", "==", userId)
      );

      const snapshot = await getDocs(postsQuery);

      // Si no tiene posts, no hacer nada
      if (snapshot.empty) {
        console.log("👤 Usuario no tiene posts para actualizar");
        return;
      }

      // 2. Preparar los updates
      const updatePromises = snapshot.docs.map(async (postDoc) => {
        const updateData: any = {
          updatedAt: serverTimestamp(),
        };

        // Solo actualizar los campos que cambiaron
        if (userData.displayName !== undefined) {
          updateData.ownerName = userData.displayName || "Usuario";
        }
        if (userData.photoUrl !== undefined) {
          updateData.ownerAvatar = userData.photoUrl;
        }
        if (userData.location !== undefined) {
          updateData.ownerLocation = userData.location;
        }

        // 3. Actualizar el post
        const postRef = doc(db, "posts", postDoc.id);
        return updateDoc(postRef, updateData);
      });

      // 4. Ejecutar todos los updates

      await Promise.all(updatePromises);

      console.log(`✅ Actualizados ${snapshot.size} posts del usuario`);
    } catch (error) {
      throw new Error("Error al actualizar datos en publicaciones");
    }
  }
}

export const postService = new PostService();
