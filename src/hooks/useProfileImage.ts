"use client";

import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";
import { useUserStore } from "../store/userStore";
import {
  uploadProfileImage,
  updateUserProfile,
} from "../api/userProfileService";

export const useProfileImage = () => {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isViewerVisible, setIsViewerVisible] = useState(false);
  const updateUserInfo = useUserStore((state) => state.updateUserInfo);
  const { userInfo } = useUserStore();

  const requestPermissions = async (): Promise<boolean> => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Error", "Necesitamos permisos de cámara para esta función");
      return false;
    }
    return true;
  };

  const takePhoto = async (): Promise<void> => {
    setIsModalVisible(false);
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const uri = result.assets[0].uri;

        // Subir imagen a Firebase Storage
        const firebaseUrl = await uploadProfileImage(uri, userInfo.uid);

        // Actualizar store con URL de Firebase
        setProfileImage(firebaseUrl);
        updateUserInfo({ photoUrl: firebaseUrl });

        // Actualizar documento en Firestore
        await updateUserProfile(userInfo.uid, { photoUrl: firebaseUrl });
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo tomar la foto");
    }
  };

  const pickFromGallery = async (): Promise<void> => {
    setIsModalVisible(false);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const uri = result.assets[0].uri;

        // Subir imagen a Firebase Storage
        const firebaseUrl = await uploadProfileImage(uri, userInfo.uid);

        // Actualizar store y Firestore
        setProfileImage(firebaseUrl);
        updateUserInfo({ photoUrl: firebaseUrl });
        await updateUserProfile(userInfo.uid, { photoUrl: firebaseUrl });
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo seleccionar la imagen");
    }
  };

  const viewPhoto = (): void => {
    setIsModalVisible(false);
    if (userInfo.photoUrl) {
      setIsViewerVisible(true); // ← Abrir el visor
    }
  };

  const closeViewer = (): void => {
    setIsViewerVisible(false);
  };

  const showImageOptions = (): void => {
    setIsModalVisible(true);
  };

  const closeModal = (): void => {
    setIsModalVisible(false);
  };

  return {
    profileImage,
    setProfileImage,
    showImageOptions,
    isModalVisible,
    closeModal,
    takePhoto,
    pickFromGallery,
    viewPhoto,
    isViewerVisible,
    closeViewer,
  };
};
