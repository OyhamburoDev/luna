import { db, storage } from "../config/firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { PinForm, SavedPin } from "../types/mapTypes";

export interface CreatePinInput extends PinForm {
  userId: string;
}

export const createPinService = {
  // Subir imágenes a Storage
  async uploadPinImages(
    pinImageUri: string,
    photoUri: string,
    userId: string,
    pinId: string
  ): Promise<{ pinImageUrl: string; photoUrl: string }> {
    try {
      // Convertir URIs a blobs
      const pinImageBlob = await this.uriToBlob(pinImageUri);
      const photoBlob = await this.uriToBlob(photoUri);

      // Rutas en Storage
      const pinImageRef = ref(
        storage,
        `map-pins/${userId}/${pinId}/pin-image.jpg`
      );
      const photoRef = ref(storage, `map-pins/${userId}/${pinId}/photo.jpg`);

      // Subir imágenes
      await uploadBytes(pinImageRef, pinImageBlob);
      await uploadBytes(photoRef, photoBlob);

      // Obtener URLs
      const pinImageUrl = await getDownloadURL(pinImageRef);
      const photoUrl = await getDownloadURL(photoRef);

      return { pinImageUrl, photoUrl };
    } catch (error) {
      console.error("Error uploading pin images:", error);
      throw new Error("No se pudieron subir las imágenes.");
    }
  },

  // Convertir URI a Blob
  async uriToBlob(uri: string): Promise<Blob> {
    const response = await fetch(uri);
    return await response.blob();
  },

  // Crear un nuevo pin
  async createPin(pinData: CreatePinInput): Promise<SavedPin> {
    let pinId = "";
    try {
      // Generar ID temporal para Storage
      pinId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      // Subir imágenes
      const { pinImageUrl, photoUrl } = await this.uploadPinImages(
        pinData.pinImageUri,
        pinData.photoUri,
        pinData.userId,
        pinId
      );

      // Guardar en Firestore
      const docRef = await addDoc(collection(db, "map_pins"), {
        type: pinData.type,
        animalName: pinData.animalName,
        shortDescription: pinData.shortDescription,
        detailedDescription: pinData.detailedDescription,
        pinImageUri: pinImageUrl,
        photoUri: photoUrl,
        location: {
          lat: pinData.location.lat,
          lng: pinData.location.lng,
          address: pinData.location.address,
        },
        userId: pinData.userId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        reportCount: 0,
        isActive: true,
      });

      return {
        id: docRef.id,
        ...pinData,
        pinImageUri: pinImageUrl,
        photoUri: photoUrl,
        createdAt: new Date(),
        updatedAt: new Date(),
        reportCount: 0,
        isActive: true,
      };
    } catch (error) {
      console.error("Error creating pin:", error);
      throw new Error("No se pudo crear el pin. Intenta de nuevo.");
    }
  },

  // Validar que el usuario no haya creado un pin hoy
  async canUserCreatePin(userId: string): Promise<boolean> {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const q = query(
        collection(db, "map_pins"),
        where("userId", "==", userId),
        where("createdAt", ">=", today)
      );

      const snapshot = await getDocs(q);

      return snapshot.empty; // true si NO hay pins hoy
    } catch (error) {
      console.error("Error validating user pin creation:", error);
      return false;
    }
  },
};
