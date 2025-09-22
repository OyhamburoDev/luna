import { useState } from "react";
import { Alert } from "react-native";
import { PetPost } from "../types/petPots";
import { postService } from "../api/postService";
import { auth } from "../config/auth";
import { usePostValidation } from "./usePostValidation";
import { useUserStore } from "../store/userStore";

type MediaItem = {
  uri: string;
  type: "photo" | "video";
  width?: number;
  height?: number;
};

export const useCreatePost = () => {
  const [loading, setLoading] = useState(false);
  const validation = usePostValidation();
  const { userInfo } = useUserStore();

  const createPost = async (
    postData: Partial<PetPost>,
    mediaList: MediaItem[],
    onSuccess?: () => void
  ): Promise<boolean> => {
    // Validar media
    if (mediaList.length === 0) {
      Alert.alert("Error", "Debes agregar al menos una foto o video");
      return false;
    }

    // Validar formulario
    const isValid = validation.validateForm(postData);

    if (!isValid) {
      Alert.alert(
        "Campos incompletos",
        "Por favor completa todos los campos obligatorios marcados con *"
      );
      return false;
    }

    try {
      setLoading(true);

      const userId = auth.currentUser?.uid;
      if (!userId) {
        throw new Error("Usuario no autenticado");
      }

      // 👇 AGREGAR: Combinar datos del post con info del usuario
      const completePostData = {
        ...postData,
        ownerName:
          `${userInfo.firstName} ${userInfo.lastName}`.trim() || "Usuario",
        ownerAvatar: userInfo.photoUrl || undefined,
        ownerEmail: userInfo.email || undefined,
      };

      await postService.createPost(completePostData, mediaList, userId);

      Alert.alert("Éxito!", "Publicación creada correctamente");
      onSuccess?.();
      return true;
    } catch (error) {
      console.error("Error al publicar:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "No se pudo crear la publicación";
      Alert.alert("Error", errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    createPost,
    loading,
    ...validation, // Incluye todas las funciones de validación
  };
};
