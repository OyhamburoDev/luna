import { useState, useEffect, useCallback } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  QuerySnapshot,
  DocumentData,
  limit,
  startAfter,
  getDocs,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { PetPost } from "../types/petPots";
import { getFunctions, httpsCallable } from "firebase/functions";

export function useFirebasePosts() {
  const [firebasePosts, setFirebasePosts] = useState<PetPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastVisible, setLastVisible] = useState<any>(null);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);

  // Función para convertir documento Firebase a PetPost
  const transformFirebaseDoc = (doc: any): PetPost => {
    const data = doc.data();

    // NORMALIZAR createdAt A STRING ISO
    let createdAt: string | Date | null;

    if (data.createdAt?.toDate) {
      // Si es Firestore Timestamp, convertir a Date
      createdAt = data.createdAt.toDate();
    } else if (data.createdAt instanceof Date) {
      // Si ya es Date
      createdAt = data.createdAt;
    } else if (typeof data.createdAt === "string") {
      // Si es string, convertir a Date
      createdAt = new Date(data.createdAt);
    } else {
      // Fallback
      createdAt = new Date();
    }

    return {
      id: doc.id,
      petName: data.petName || "",
      description: data.description || "",
      createdAt: createdAt,

      age: data.age || 0,
      gender: data.gender || "",
      size: data.size || "",
      species: data.species || "dog",
      ownerId: data.userId || data.ownerId || "",
      ownerName: data.ownerName || "Usuario",
      likes: data.likes || 0,
      videoUri: data.mediaUrls?.find((url: string) => url.includes(".mp4"))
        ? { uri: data.mediaUrls.find((url: string) => url.includes(".mp4")) }
        : undefined,
      imageUris: data.mediaUrls
        ? data.mediaUrls
            .filter((url: string) => !url.includes(".mp4"))
            .map((url: string) => ({ uri: url }))
        : undefined,
      breed: data.breed,
      ownerAvatar: data.ownerAvatar,
      ownerLocation: data.ownerLocation || null,
      ownerCreatedAt: data.ownerCreatedAt || null,
      thumbnailUri: data.thumbnailUri,
      healthInfo: data.healthInfo,
      isVaccinated: data.isVaccinated,
      isNeutered: data.isNeutered,
      hasMedicalConditions: data.hasMedicalConditions,
      medicalDetails: data.medicalDetails,
      goodWithKids: data.goodWithKids,
      goodWithOtherPets: data.goodWithOtherPets,
      friendlyWithStrangers: data.friendlyWithStrangers,
      needsWalks: data.needsWalks,
      energyLevel: data.energyLevel,
    };
  };

  // Carga inicial - primeros 5 posts
  useEffect(() => {
    console.log("🔥 Iniciando carga inicial de posts");

    const loadInitialPosts = async () => {
      try {
        const functions = getFunctions();
        const getPostsFn = httpsCallable(functions, "getPosts");

        const result = await getPostsFn({ limitCount: 5, lastDocId: null });
        const data = result.data as {
          success: boolean;
          posts: any[];
          hasMore: boolean;
          lastDocId: string | null;
        };

        console.log("📥 Posts recibidos de Cloud Function:", data.posts.length);

        const posts: PetPost[] = data.posts.map((post) =>
          transformFirebaseDoc({ id: post.id, data: () => post })
        );

        const orderedPosts = posts.sort((a, b) => {
          const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return timeB - timeA;
        });

        console.log("✅ ORDEN FINAL:");
        orderedPosts.forEach((post, index) => {
          console.log(`${index}: ${post.petName} - ${post.createdAt}`);
        });

        setFirebasePosts(orderedPosts);
        setLastVisible(data.lastDocId); // Ahora es un string, no un documento
        setCurrentPage(0);
        setHasMore(data.hasMore);
        setLoading(false);
      } catch (error) {
        console.error("💥 Error en carga inicial:", error);
        setError(error as Error);
        setLoading(false);
      }
    };

    loadInitialPosts();
  }, []);

  // Función para cargar próximos 5 posts (AGREGAR al final)
  const loadMore = useCallback(async () => {
    if (!hasMore || loadingMore || !lastVisible) {
      console.log("❌ No se puede cargar más:", {
        hasMore,
        loadingMore,
        hasLastVisible: !!lastVisible,
      });
      return;
    }

    console.log("🔄 Cargando próximos 5 posts, página:", currentPage + 1);
    setLoadingMore(true);

    try {
      const functions = getFunctions();
      const getPostsFn = httpsCallable(functions, "getPosts");

      const result = await getPostsFn({
        limitCount: 5,
        lastDocId: lastVisible, // Ahora es un string
      });

      const data = result.data as {
        success: boolean;
        posts: any[];
        hasMore: boolean;
        lastDocId: string | null;
      };

      console.log("📥 Próximos posts recibidos:", data.posts.length);

      if (data.posts.length > 0) {
        const newPosts: PetPost[] = data.posts.map((post) =>
          transformFirebaseDoc({ id: post.id, data: () => post })
        );

        console.log(
          "✨ Agregando posts:",
          newPosts.map((p) => p.petName)
        );

        setFirebasePosts((prevPosts) => [...prevPosts, ...newPosts]);
        setLastVisible(data.lastDocId);
        setCurrentPage((prev) => prev + 1);
        setHasMore(data.hasMore);

        console.log("✅ Posts agregados correctamente");
      } else {
        console.log("🏁 No hay más posts disponibles");
        setHasMore(false);
      }
    } catch (error) {
      console.error("💥 Error cargando más posts:", error);
      setError(error as Error);
    } finally {
      setLoadingMore(false);
    }
  }, [hasMore, loadingMore, lastVisible, currentPage]);

  // En useFirebasePosts.js - AGREGAR ESTA FUNCIÓN
  const addNewPostLocally = useCallback((newPost: PetPost) => {
    setFirebasePosts((prevPosts) => {
      // Función para normalizar cualquier fecha a timestamp
      const normalizeDate = (date: any): number => {
        if (!date) return new Date().getTime();
        if (date instanceof Date) return date.getTime();
        if (typeof date === "string") return new Date(date).getTime();
        if (typeof date === "number") return date;
        return new Date().getTime();
      };

      // Clonar y normalizar el nuevo post
      const clonedNewPost = JSON.parse(
        JSON.stringify({
          ...newPost,
          createdAt: newPost.createdAt || new Date(),
        })
      );

      // Clonar y normalizar posts existentes
      const clonedExistingPosts = prevPosts.map((post) =>
        JSON.parse(
          JSON.stringify({
            ...post,
            createdAt: post.createdAt, // Mantener el valor original pero clonado
          })
        )
      );

      // Ordenar usando fechas normalizadas
      const allPosts = [clonedNewPost, ...clonedExistingPosts];
      return allPosts.sort((a, b) => {
        const timeA = normalizeDate(a.createdAt);
        const timeB = normalizeDate(b.createdAt);
        return timeB - timeA; // Más reciente primero
      });
    });
  }, []);

  return {
    firebasePosts,
    loading,
    loadingMore,
    error,
    loadMore,
    hasMore,
    currentPage,
    addNewPostLocally,
  };
}
