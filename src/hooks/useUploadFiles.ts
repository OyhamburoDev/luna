import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import uuid from "react-native-uuid"; // Para IDs únicos

export const useUploadFiles = () => {
  // Obtener instancia de Storage y Auth
  const storage = getStorage(getApp());
  const auth = getAuth(getApp());

  const uploadFile = async (uri: string) => {
    try {
      // Verificar que el usuario esté autenticado en Firebase
      if (!auth.currentUser) {
        throw new Error("El usuario no está autenticado en Firebase.");
      }

      // Convertir URI local a blob
      const response = await fetch(uri);
      const blob = await response.blob();

      // Crear referencia en carpeta pets con un UUID único
      const fileName = `pets/${uuid.v4()}.jpg`;
      const storageRef = ref(storage, fileName);

      // Subir
      await uploadBytes(storageRef, blob);

      // Obtener URL pública
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      console.error("Error al subir archivo:", error);
      throw error;
    }
  };

  return { uploadFile };
};
