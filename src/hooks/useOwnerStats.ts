import { useState, useEffect, useCallback } from "react";
import { postService } from "../api/postService";

interface UseOwnerStatsReturn {
  postsCount: number;
  totalLikes: number;
  loading: boolean;
  error: string | null;
  refreshStats: () => Promise<void>;
}

const useOwnerStats = (ownerId: string): UseOwnerStatsReturn => {
  const [postsCount, setPostsCount] = useState(0);
  const [totalLikes, setTotalLikes] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    // ← ENVOLVER EN useCallback
    if (!ownerId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const [count, likes] = await Promise.all([
        postService.getOwnerPostsCount(ownerId),
        postService.getOwnerTotalLikes(ownerId),
      ]);

      setPostsCount(count);
      setTotalLikes(likes);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al cargar estadísticas";
      setError(errorMessage);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [ownerId]); // ← DEPENDENCIA: solo se recrea si cambia ownerId

  useEffect(() => {
    fetchStats();
  }, [fetchStats]); // ← Ahora esta dependencia es estable

  return {
    postsCount,
    totalLikes,
    loading,
    error,
    refreshStats: fetchStats,
  };
};

export default useOwnerStats;
