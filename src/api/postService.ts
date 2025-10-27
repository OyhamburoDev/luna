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
   * Crea un nuevo post en Firestore con sus medias
   */
  async createPost(
    postData: Partial<PetPost>,
    mediaList: MediaItem[],
    userId: string
  ): Promise<string> {
    try {
      const today = new Date();

      // verificacion para un limite diario de posteos
      today.setHours(0, 0, 0, 0);

      const postsQuery = query(
        collection(db, "posts"),
        where("userId", "==", userId),
        where("createdAt", ">=", Timestamp.fromDate(today))
      );

      const snapshot = await getDocs(postsQuery);

      if (snapshot.size >= 3) {
        throw new Error("Alcanzaste el límite de 3 publicaciones por día");
      }

      // 1. Subir todas las imágenes/videos
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

      // 3. Preparar datos del post
      const completePostData = {
        ...postData,
        userId,
        mediaUrls,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        status: "available",
        likes: 0,
        views: 0,
      };

      if (thumbnailUri) {
        completePostData.thumbnailUri = thumbnailUri;
      }

      // 4. Guardar en Firestore
      const docRef = await addDoc(collection(db, "posts"), completePostData);

      console.log("Post created with ID:", docRef.id);

      const userPostsCount = await this.getOwnerPostsCount(userId);

      if (userPostsCount === 1) {
        // Es su primera publicación, crear notificación
        await notificationsService.createFirstPetNotification(
          userId,
          postData.petName || "tu mascota"
        );
      }

      return docRef.id;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }

      // Si no, lanzar error genérico
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
}

export const postService = new PostService();
