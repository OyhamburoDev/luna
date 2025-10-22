// services/adoptionService.ts
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
  doc,
  deleteDoc,
  setDoc,
  getDoc,
  updateDoc,
  increment,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { AdoptionFormDataWithId } from "../types/forms";
import { AdoptionFormData } from "../types/forms";
import { useAuthStore } from "../store/auth";

export class AdoptionService {
  // ✅ Enviar solicitud de adopción
  static async submitAdoptionRequest(
    formData: AdoptionFormData
  ): Promise<void> {
    try {
      const currentUserId = useAuthStore.getState().user?.uid;
      if (!currentUserId) throw new Error("Usuario no autenticado");

      const requestsRef = collection(db, "adoption_requests");

      // 🔹 1. Verificar si ya existe una solicitud para esta mascota
      const duplicateQuery = query(
        requestsRef,
        where("applicantId", "==", currentUserId),
        where("petId", "==", formData.petId)
      );
      const existing = await getDocs(duplicateQuery);
      if (!existing.empty) {
        throw new Error("Ya enviaste una solicitud para esta mascota.");
      }

      // 🔹 2. Verificar el contador del usuario
      const counterRef = doc(db, "adoption_requests_per_user", currentUserId);
      const counterSnap = await getDoc(counterRef);

      if (counterSnap.exists()) {
        const { count, lastUpdate } = counterSnap.data();

        // Reset diario si el último envío fue de otro día
        const today = new Date();
        const last = lastUpdate?.toDate?.() || new Date(0);
        const isSameDay =
          today.getFullYear() === last.getFullYear() &&
          today.getMonth() === last.getMonth() &&
          today.getDate() === last.getDate();

        if (!isSameDay) {
          await setDoc(counterRef, { count: 0, lastUpdate: serverTimestamp() });
        } else if (count >= 5) {
          throw new Error("Ya alcanzaste el límite diario de 5 solicitudes.");
        }
      }

      // 🔹 3. Crear la solicitud
      await addDoc(requestsRef, {
        ...formData,
        submittedAt: serverTimestamp(),
        status: "pending",
      });

      // 🔹 4. Actualizar o crear el contador
      if (counterSnap.exists()) {
        await updateDoc(counterRef, {
          count: increment(1),
          lastUpdate: serverTimestamp(),
        });
      } else {
        await setDoc(counterRef, {
          count: 1,
          lastUpdate: serverTimestamp(),
        });
      }

      console.log("✅ Solicitud enviada correctamente");
    } catch (error: any) {
      throw new Error(
        error.message || "Ocurrió un error al enviar la solicitud."
      );
    }
  }

  // ✅ Traer solicitudes donde soy dueño de la mascota
  static async getAdoptionRequests(): Promise<AdoptionFormDataWithId[]> {
    try {
      const currentUserId = useAuthStore.getState().user?.uid;
      if (!currentUserId) throw new Error("Usuario no autenticado");

      const requestsRef = collection(db, "adoption_requests");
      const q = query(requestsRef, where("ownerId", "==", currentUserId));

      const snapshot = await getDocs(q);

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

  // ✅ Eliminar solicitud
  static async deleteAdoptionRequest(requestId: string): Promise<void> {
    try {
      const docRef = doc(db, "adoption_requests", requestId);
      await deleteDoc(docRef);
      console.log("✅ Documento eliminado de Firebase");
    } catch (error) {
      console.error("❌ Error eliminando de Firebase:", error);
      throw error;
    }
  }
}
