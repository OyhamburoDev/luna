import { useState, useEffect } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  QuerySnapshot,
  DocumentData,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { PetPost } from "../types/petPots";

export function useFirebasePosts() {
  const [firebasePosts, setFirebasePosts] = useState<PetPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      // Query para obtener posts ordenados por fecha (más recientes primero)
      const postsQuery = query(
        collection(db, "posts"),
        orderBy("createdAt", "desc")
      );

      // Listener en tiempo real
      const unsubscribe = onSnapshot(
        postsQuery,
        (snapshot: QuerySnapshot<DocumentData>) => {
          const posts: PetPost[] = snapshot.docs.map((doc) => {
            const data = doc.data();

            // Transformar datos de Firebase al formato PetPost según tu contrato
            const post: PetPost = {
              // Campos requeridos
              id: doc.id,
              petName: data.petName || "",
              description: data.description || "",
              createdAt:
                data.createdAt?.toDate?.()?.toISOString() ||
                new Date().toISOString(),
              age: data.age || 0,
              gender: data.gender || "",
              size: data.size || "",
              species: data.species || "dog",

              // Owner info (requerido)
              ownerId: data.userId || data.ownerId || "",
              ownerName: data.ownerName || "Usuario",

              // Media - separar videos de imágenes
              videoUri: data.mediaUrls?.find((url: string) =>
                url.includes(".mp4")
              )
                ? {
                    uri: data.mediaUrls.find((url: string) =>
                      url.includes(".mp4")
                    ),
                  }
                : undefined,
              imageUris: data.mediaUrls
                ? data.mediaUrls
                    .filter((url: string) => !url.includes(".mp4"))
                    .map((url: string) => ({ uri: url }))
                : undefined,

              // Campos opcionales del contrato
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

            return post;
          });

          setFirebasePosts(posts);
          setLoading(false);
        },
        (err) => {
          console.error("Error listening to posts:", err);
          setError(err as Error);
          setLoading(false);
        }
      );

      // Cleanup al desmontar
      return () => unsubscribe();
    } catch (err) {
      console.error("Error setting up posts listener:", err);
      setError(err as Error);
      setLoading(false);
    }
  }, []);

  return { firebasePosts, loading, error };
}
