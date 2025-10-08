import { useState, useEffect } from "react";
import { postService } from "../api/postService";
import { PetPost } from "../types/petPots";

interface UseProfilePostsReturn {
  posts: PetPost[];
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  handleDeletePost: (
    postId: string,
    mediaUrls: string[],
    thumbnailUri?: string
  ) => Promise<void>;
  handleRefresh: () => void;
}

const useProfilePosts = (): UseProfilePostsReturn => {
  const [posts, setPosts] = useState<PetPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = async () => {
    try {
      setError(null);
      const userPosts = await postService.getUserPosts();
      setPosts(userPosts);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al cargar publicaciones";
      setError(errorMessage);
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleDeletePost = async (
    postId: string,
    mediaUrls: string[],
    thumbnailUri?: string
  ) => {
    try {
      await postService.deletePost(postId, mediaUrls, thumbnailUri);
      setPosts((prev) => prev.filter((post) => post.id !== postId));
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al eliminar";
      setError(errorMessage);
      console.error(err);
      throw err;
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchPosts();
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return {
    posts,
    loading,
    refreshing,
    error,
    handleDeletePost,
    handleRefresh,
  };
};

export default useProfilePosts;
