// services/adoptionService.ts
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { AdoptionFormDataWithId } from "../types/forms";
import { AdoptionFormData } from "../types/forms";
import { useAuthStore } from "../store/auth";

export class AdoptionService {
  // ✅ Para ENVIAR: usa AdoptionFormData (sin id)
  static async submitAdoptionRequest(
    formData: AdoptionFormData
  ): Promise<void> {
    try {
      const requestsRef = collection(db, "adoption_requests");
      await addDoc(requestsRef, {
        ...formData,
        submittedAt: serverTimestamp(),
        status: "pending",
      });
    } catch (error) {
      console.error("Error submitting adoption request:", error);
      throw error;
    }
  }

  // ✅ Para TRAER: usa AdoptionFormDataWithId (con id)
  static async getAdoptionRequests(): Promise<AdoptionFormDataWithId[]> {
    try {
      // 1️⃣ Obtener mi ID de usuario
      const currentUserId = useAuthStore.getState().user?.uid;

      if (!currentUserId) {
        throw new Error("Usuario no autenticado");
      }

      // 2️⃣ Crear query con filtro
      const requestsRef = collection(db, "adoption_requests");
      const q = query(
        requestsRef,
        where("ownerId", "==", currentUserId) // ← FILTRO: solo donde YO soy el dueño
      );

      const snapshot = await getDocs(q);

      // 4️⃣ Convertir a array
      const myRequests = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as AdoptionFormDataWithId[];

      return myRequests;
    } catch (error) {
      console.error("Error fetching adoption requests:", error);
      throw error;
    }
  }
}
