// SE OCUPA DE FIRESTORE DATABASE (COLECCIÓN USER) Y STORAGE (FOTO)

import { db, storage } from "../config/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import * as ImageManipulator from "expo-image-manipulator";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { UserInfo } from "../types/user"; // ajustá ruta
import { postService } from "./postService";

// Lee users/{uid}. Si no existe, devuelve null.
export async function getUserProfile(uid: string): Promise<UserInfo | null> {
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;

  const data = snap.data() as any;

  // Aseguramos que createdAt sea Date (Firestore suele devolver Timestamp)
  const createdAtValue =
    data.createdAt && typeof data.createdAt.toDate === "function"
      ? data.createdAt.toDate()
      : data.createdAt instanceof Date
      ? data.createdAt
      : new Date(); // fallback por si viniera vacío

  const perfil: UserInfo = {
    uid: data.uid,
    firstName: data.firstName ?? "",
    lastName: data.lastName ?? "",
    email: data.email ?? "",
    location: data.location ?? "",
    phone: data.phone ?? "",
    bio: data.bio ?? null,
    photoUrl: data.photoUrl ?? null,
    createdAt: createdAtValue,
    active: data.active ?? true,
  };

  return perfil;
}

// Crea users/{uid} si no existe (idempotente)
export async function ensureUserDoc(uid: string, email: string) {
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    const nuevo: UserInfo = {
      uid,
      firstName: "",
      lastName: "",
      email,
      location: "", // <- requerido por tu tipo
      phone: "", // <- requerido por tu tipo
      bio: null,
      photoUrl: null, // opcional en el tipo; setear null es válido
      createdAt: new Date(), // usamos Date para no romper tu tipo
      active: true,
    };
    await setDoc(ref, nuevo);
  }
}

// Actualiza campos del perfil
type Updatable = Partial<Omit<UserInfo, "uid" | "email" | "createdAt">>;
export async function updateUserProfile(uid: string, patch: Updatable) {
  // 1. Actualizar el perfil del usuario en Firestore
  await updateDoc(doc(db, "users", uid), patch);

  // 2. Si cambió firstName, lastName o photoUrl → actualizar sus posts
  if (
    patch.firstName !== undefined ||
    patch.lastName !== undefined ||
    patch.photoUrl !== undefined
  ) {
    try {
      // Obtener el perfil completo actualizado para tener firstName y lastName
      const updatedProfile = await getUserProfile(uid);

      if (updatedProfile) {
        const displayName =
          `${updatedProfile.firstName} ${updatedProfile.lastName}`.trim() ||
          "Usuario";

        await postService.updateUserDataInAllPosts(uid, {
          displayName: displayName,
          photoUrl:
            patch.photoUrl !== undefined
              ? patch.photoUrl
              : updatedProfile.photoUrl,
          location: patch.location,
        });

        console.log("✅ Posts actualizados con los nuevos datos del usuario");
      }
    } catch (error) {
      console.error("⚠️ Error actualizando posts del usuario:", error);
      // No lanzamos el error para que el update del perfil no falle
    }
  }
}

// Subir imagen de perfil a Firebase Storage
export async function uploadProfileImage(
  imageUri: string,
  uid: string
): Promise<string> {
  try {
    // 1. Reducir resolución de la imagen
    const resizedImage = await ImageManipulator.manipulateAsync(
      imageUri,
      [{ resize: { width: 400, height: 400 } }],
      {
        compress: 0.8,
        format: ImageManipulator.SaveFormat.JPEG,
      }
    );

    // 2. Convertir a blob
    const response = await fetch(resizedImage.uri);
    const blob = await response.blob();

    // 3. Crear referencia en Storage
    const storageRef = ref(storage, `profile-images/${uid}/profile.jpg`);

    // 4. Subir imagen
    await uploadBytes(storageRef, blob);

    // 5. Obtener URL de descarga
    const downloadURL = await getDownloadURL(storageRef);

    return downloadURL;
  } catch (error: any) {
    throw new Error(`Error subiendo imagen: ${error.message}`);
  }
}

// Obtener solo la imagen del usuario
export async function getUserImage(userId: string): Promise<string | null> {
  try {
    const userProfile = await getUserProfile(userId);
    return userProfile?.photoUrl || null;
  } catch (error) {
    console.error("Error obteniendo imagen del usuario:", error);
    return null;
  }
}

// Verificar si el perfil sel usuario está completo
export function isProfileComplete(profile: UserInfo): boolean {
  return !!(
    profile.firstName &&
    profile.lastName &&
    profile.bio &&
    profile.photoUrl
  );
}
