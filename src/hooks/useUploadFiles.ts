import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import app, { auth } from "../config/firebase"; // ajustá ruta si cambia
import { getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import uuid from "react-native-uuid"; // Para generar IDs únicos

export const useUploadFiles = () => {
  const storage = getStorage(app);
  const auth = getAuth(getApp());

  const uploadFile = async (
    uri: string,
    pathPrefix: string
  ): Promise<string> => {
    if (!auth.currentUser)
      throw new Error("El usuario no está autenticado en Firebase.");

    const response = await fetch(uri);
    const blob = await response.blob();

    const extension = uri.split(".").pop() || "jpg";
    const fileName = `${pathPrefix}/${uuid.v4()}.${extension}`;
    const storageRef = ref(storage, fileName);

    await uploadBytes(storageRef, blob);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  };

  const uploadPetImage = (uri: string) => {
    return uploadFile(uri, `pets/${auth.currentUser?.uid}/images`);
  };

  const uploadPetVideo = (uri: string) => {
    return uploadFile(uri, `pets/${auth.currentUser?.uid}/videos`);
  };

  const uploadUserAvatar = (uri: string) => {
    return uploadFile(uri, `avatars/${auth.currentUser?.uid}`);
  };

  return {
    uploadPetImage,
    uploadPetVideo,
    uploadUserAvatar,
  };
};
