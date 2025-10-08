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

export const useCreatePost = (addNewPostLocally?: (post: PetPost) => void) => {
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

      // 1. CREAR POST LOCAL TEMPORAL
      const tempPostId = `temp-${Date.now()}`;
      const localPost: PetPost = {
        id: tempPostId,
        petName: postData.petName || "",
        description: postData.description || "",
        createdAt: new Date(),
        age: postData.age || 0,
        gender: postData.gender || "",
        size: postData.size || "",
        species: postData.species || "dog",
        ownerId: userId,
        ownerName:
          `${userInfo.firstName} ${userInfo.lastName}`.trim() || "Usuario",
        ownerAvatar: userInfo.photoUrl || null,
        videoUri: undefined,
        imageUris: undefined,
        breed: postData.breed,
        healthInfo: postData.healthInfo,
        isVaccinated: postData.isVaccinated,
        isNeutered: postData.isNeutered,
        hasMedicalConditions: postData.hasMedicalConditions,
        medicalDetails: postData.medicalDetails,
        goodWithKids: postData.goodWithKids,
        goodWithOtherPets: postData.goodWithOtherPets,
        friendlyWithStrangers: postData.friendlyWithStrangers,
        needsWalks: postData.needsWalks,
        energyLevel: postData.energyLevel,
      };

      // 2. AGREGAR AL ESTADO LOCAL INMEDIATAMENTE
      if (addNewPostLocally) {
        addNewPostLocally(localPost);
      }

      // 3. SUBIR A FIREBASE
      const completePostData = {
        ...postData,
        ownerName:
          `${userInfo.firstName} ${userInfo.lastName}`.trim() || "Usuario",
        ownerAvatar: userInfo.photoUrl || null,
      };

      await postService.createPost(completePostData, mediaList, userId);

      onSuccess?.();
      return true;
    } catch (error) {
      console.log("Error al publicar:", error);
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
    ...validation,
  };
};
