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

    // 👇 NORMALIZAR createdAt A STRING ISO
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

    const initialQuery = query(
      collection(db, "posts"),
      orderBy("createdAt", "desc"),
      limit(5)
    );

    const unsubscribe = onSnapshot(
      initialQuery,
      (snapshot: QuerySnapshot<DocumentData>) => {
        console.log("📥 Posts recibidos de Firebase (NORMALIZADOS):");
        snapshot.docs.forEach((doc, index) => {
          const data = doc.data();
          const transformed = transformFirebaseDoc(doc);
          console.log(`Post ${index}:`, {
            id: doc.id,
            name: data.petName,
            originalCreatedAt: data.createdAt,
            normalizedCreatedAt: transformed.createdAt,
            normalizedType: typeof transformed.createdAt,
            isDate: transformed.createdAt instanceof Date,
          });
        });
        console.log("📥 Recibidos posts iniciales:", snapshot.docs.length);

        const posts: PetPost[] = snapshot.docs.map(transformFirebaseDoc);

        // 👇 AGREGAR ESTO - ORDENAR MANUALMENTE
        const orderedPosts = posts.sort((a, b) => {
          const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return timeB - timeA; // Más reciente primero
        });

        console.log("✅ ORDEN FINAL:");
        orderedPosts.forEach((post, index) => {
          console.log(`${index}: ${post.petName} - ${post.createdAt}`);
        });

        console.log(
          posts.map((p) => ({
            name: p.petName,
            createdAt: p.createdAt,
            originalTimestamp: snapshot.docs.find((d) => d.id === p.id)?.data()
              .createdAt,
          }))
        );

        console.log(
          "📊 Orden detallado:",
          posts.map((p, index) => ({
            posicion: index,
            name: p.petName,
            id: p.id.substring(0, 8),
            createdAt: p.createdAt,
            timestamp: p.createdAt ? new Date(p.createdAt).getTime() : 0,
          }))
        );

        console.log(
          "🔥 SNAPSHOT TRIGGER - Razón del cambio:",
          snapshot.docChanges().map((change) => ({
            type: change.type, // 'added', 'modified', 'removed'
            doc: change.doc.id.substring(0, 8),
            name: change.doc.data().petName,
          }))
        );
        // Guardar el último documento para paginación

        setFirebasePosts(orderedPosts);
        const lastDoc = snapshot.docs[snapshot.docs.length - 1];
        setLastVisible(lastDoc);

        setCurrentPage(0);
        setHasMore(snapshot.docs.length === 5);
        setLoading(false);
      },
      (err) => {
        console.error("💥 Error en carga inicial:", err);
        setError(err as Error);
        setLoading(false);
      }
    );

    return () => {
      console.log("🧹 Limpiando listener inicial");
      unsubscribe();
    };
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
      const nextQuery = query(
        collection(db, "posts"),
        orderBy("createdAt", "desc"),
        startAfter(lastVisible),
        limit(5)
      );

      const snapshot = await getDocs(nextQuery);
      console.log("📥 Próximos posts recibidos:", snapshot.docs.length);

      if (snapshot.docs.length > 0) {
        const newPosts: PetPost[] = snapshot.docs.map(transformFirebaseDoc);

        console.log(
          "✨ Agregando posts:",
          newPosts.map((p) => p.petName)
        );

        // AGREGAR al final del array existente (scroll infinito)
        setFirebasePosts((prevPosts) => [...prevPosts, ...newPosts]);

        // Actualizar paginación
        const newLastVisible = snapshot.docs[snapshot.docs.length - 1];
        setLastVisible(newLastVisible);
        setCurrentPage((prev) => prev + 1);
        setHasMore(snapshot.docs.length === 5);

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
