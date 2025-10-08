import { useState, useEffect, useCallback } from "react";
import { likesService } from "../api/likesService";
import { postService } from "../api/postService";
import { PetPost } from "../types/petPots";
import { useAuthStore } from "../store/auth";

export function useProfileLikes() {
  const [posts, setPosts] = useState<PetPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const userId = useAuthStore((state) => state.user?.uid);

  const loadLikedPosts = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // 1. Obtener IDs de posts likeados
      console.log("📥 Obteniendo IDs de posts likeados...");
      const postIds = await likesService.getLikedPostIds(userId);
      console.log("📥 IDs obtenidos:", postIds);

      // 2. Obtener posts completos
      console.log("📥 Obteniendo posts completos...");
      const likedPosts = await postService.getPostsByIds(postIds);
      console.log("📥 Posts completos:", likedPosts.length);

      setPosts(likedPosts);
    } catch (err) {
      console.error("Error loading liked posts:", err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  return {
    posts,
    loading,
    error,
    refresh: loadLikedPosts,
  };
}
