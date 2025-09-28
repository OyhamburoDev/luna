import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../config/firebase"; // Ajusta la ruta según tu proyecto
import { PetPost } from "../types/petPots";
import * as VideoThumbnails from "expo-video-thumbnails";

type MediaItem = {
  uri: string;
  type: "photo" | "video";
  width?: number;
  height?: number;
};

class PostService {
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
      console.error("Error uploading media:", error);
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
      console.error("Error generating thumbnail:", error);
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
      return docRef.id;
    } catch (error) {
      console.error("Error creating post:", error);
      throw new Error("Error al crear la publicación");
    }
  }

  /**
   * Obtiene todos los posts disponibles
   */
  async getPosts() {
    try {
      // Implementar según necesites (con paginación, filtros, etc.)
    } catch (error) {
      console.error("Error getting posts:", error);
      throw error;
    }
  }

  /**
   * Actualiza un post existente
   */
  async updatePost(postId: string, updates: Partial<PetPost>) {
    try {
      // Implementar update
    } catch (error) {
      console.error("Error updating post:", error);
      throw error;
    }
  }

  /**
   * Elimina un post (soft delete cambiando status)
   */
  async deletePost(postId: string) {
    try {
      // Implementar delete
    } catch (error) {
      console.error("Error deleting post:", error);
      throw error;
    }
  }
}

export const postService = new PostService();
