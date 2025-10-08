import { doc, writeBatch, increment, getDoc, setDoc } from "firebase/firestore";
import { db } from "../config/firebase";

class LikesService {
  /**
   * Da o quita like a un post
   * @param userId - ID del usuario que da/quita like
   * @param postId - ID del post
   * @param isCurrentlyLiked - Si el usuario ya tiene like en este post
   */
  async toggleLike(userId: string, postId: string, isCurrentlyLiked: boolean) {
    try {
      const batch = writeBatch(db);

      // Referencias
      const postRef = doc(db, "posts", postId);
      const userLikesRef = doc(db, "userLikes", userId);

      if (isCurrentlyLiked) {
        // ❌ QUITAR LIKE

        // ✅ VALIDACIÓN EXTRA: Verificar que realmente tiene el like
        const userLikesDoc = await getDoc(userLikesRef);
        const likedPosts = userLikesDoc.data()?.likedPosts || {};

        if (!likedPosts[postId]) {
          console.warn("⚠️ El usuario no tiene like en este post");
          return false; // No hacer nada si no tiene like
        }

        // 1. Decrementar contador en post
        batch.update(postRef, {
          likes: increment(-1),
        });

        // 2. Remover de userLikes
        batch.update(userLikesRef, {
          [`likedPosts.${postId}`]: null,
        });
      } else {
        // ✅ DAR LIKE

        // Verificar si el documento del usuario existe
        const userLikesDoc = await getDoc(userLikesRef);

        if (!userLikesDoc.exists()) {
          // Si no existe, crear el documento
          batch.set(userLikesRef, {
            likedPosts: {
              [postId]: true,
            },
          });
        } else {
          // Si existe, solo agregar el nuevo like
          batch.update(userLikesRef, {
            [`likedPosts.${postId}`]: true,
          });
        }

        // Incrementar contador en post
        batch.update(postRef, {
          likes: increment(1),
        });
      }

      // Ejecutar todas las operaciones de forma atómica
      await batch.commit();

      console.log(
        `✅ Like ${isCurrentlyLiked ? "removed" : "added"} successfully`
      );
      return true;
    } catch (error) {
      console.error("Error toggling like:", error);
      throw error;
    }
  }

  /**
   * Verifica si un usuario dio like a un post
   * @param userId - ID del usuario
   * @param postId - ID del post
   * @returns true si el usuario dio like, false si no
   */
  async checkIfUserLikedPost(userId: string, postId: string): Promise<boolean> {
    try {
      const userLikesRef = doc(db, "userLikes", userId);
      const userLikesDoc = await getDoc(userLikesRef);

      if (!userLikesDoc.exists()) {
        return false;
      }

      const likedPosts = userLikesDoc.data()?.likedPosts || {};
      return !!likedPosts[postId];
    } catch (error) {
      console.error("Error checking like status:", error);
      return false;
    }
  }

  /**
   * Obtiene los IDs de los posts que el usuario likeó
   * @param userId - ID del usuario
   * @returns Array de postIds
   */
  async getLikedPostIds(userId: string): Promise<string[]> {
    try {
      const userLikesRef = doc(db, "userLikes", userId);
      const userLikesDoc = await getDoc(userLikesRef);

      if (!userLikesDoc.exists()) {
        return [];
      }

      const likedPosts = userLikesDoc.data()?.likedPosts || {};
      // Filtrar solo los que NO sean null
      return Object.keys(likedPosts).filter((key) => likedPosts[key] !== null);
    } catch (error) {
      console.error("Error getting liked post IDs:", error);
      return [];
    }
  }
}

export const likesService = new LikesService();
