import { useState, useEffect } from "react";
import { likesService } from "../api/likesService";
import { useAuthStore } from "../store/auth";

type UseLikeProps = {
  postId: string;
  initialLikesCount: number;
};

export const useLike = ({ postId, initialLikesCount }: UseLikeProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(initialLikesCount);
  const [isLoading, setIsLoading] = useState(false);

  // Obtener el userId del store de auth
  const userId = useAuthStore((state) => state.user?.uid);

  // Al montar el componente, verificar si el usuario ya dio like
  useEffect(() => {
    const checkLikeStatus = async () => {
      if (!userId) return;

      try {
        const liked = await likesService.checkIfUserLikedPost(userId, postId);
        setIsLiked(liked);
      } catch (error) {
        console.log("Error checking like status:", error);
      }
    };

    checkLikeStatus();
  }, [postId, userId]);

  const toggleLike = async () => {
    if (!userId) {
      console.warn("Usuario no autenticad ");

      return;
    }

    if (isLoading) return; // Prevenir múltiples clicks

    setIsLoading(true);

    // Guardar estado previo para revertir si falla
    const previousIsLiked = isLiked;
    const previousCount = likesCount;

    // ✅ OPTIMISTIC UPDATE: Actualizar UI inmediatamente
    setIsLiked(!isLiked);
    setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));

    try {
      // Llamar al servicio de Firebase
      const success = await likesService.toggleLike(
        userId,
        postId,
        previousIsLiked
      );

      if (!success) {
        // Si el servicio retorna false, revertir
        setIsLiked(previousIsLiked);
        setLikesCount(previousCount);
      }
    } catch (error) {
      console.error("Error toggling like:", error);

      // ❌ Revertir cambios si hubo error
      setIsLiked(previousIsLiked);
      setLikesCount(previousCount);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLiked,
    likesCount,
    toggleLike,
    isLoading,
    userId,
  };
};
