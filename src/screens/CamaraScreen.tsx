import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/types";
import { useFocusEffect } from "@react-navigation/native";
import { navigate } from "../navigation/NavigationService";
import {
  validateVideoMedia,
  validatePhotoMedia,
} from "../utils/mediaValidation";

type CameraScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [modalVisible, setModalVisible] = useState(true);
  const navigation = useNavigation<CameraScreenNavigationProp>();

  // Resetear modal cada vez que la pantalla gana foco
  useFocusEffect(
    React.useCallback(() => {
      setModalVisible(true);
    }, [])
  );

  const takePhoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 5],
        quality: 0.8,
      });

      if (!result.canceled && result.assets?.length > 0) {
        const photo = result.assets[0];

        // VALIDAR FOTO ANTES DE CONTINUAR
        console.log("=== VALIDANDO FOTO ===");
        const validation = await validatePhotoMedia(photo.uri);

        console.log("Es válida:", validation.isValid);
        console.log("Tamaño MB:", validation.sizeMB);
        console.log("Error:", validation.error || "Ninguno");

        if (!validation.isValid) {
          console.log("=== FOTO RECHAZADA ===");
          Alert.alert("Foto muy pesada", validation.error);
          return;
        }

        console.log("Cerrando modal...");
        closeModal();

        console.log("Navegando a CreatePost...");
        navigate("CreatePost", {
          media: { uri: photo.uri, width: photo.width, height: photo.height },
          type: "photo",
        });
        console.log("Navigate ejecutado");
      }
    } catch (error) {
      console.log("Error:", error);
      Alert.alert("Error", "No se pudo tomar la foto");
    }
  };

  const recordVideo = async () => {
    console.log("=== CONFIGURACIÓN DE VIDEO ===");

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        aspect: [4, 5],
        quality: 0.8,
        // videoMaxDuration removido - no funciona en Android
      });

      console.log("=== RESULTADO DE CÁMARA ===", result.canceled);

      if (!result.canceled && result.assets?.length > 0) {
        const video = result.assets[0];
        console.log("=== VIDEO OBTENIDO ===", {
          duration: video.duration,
          uri: video.uri.substring(0, 50) + "...",
        });

        // VALIDAR VIDEO ANTES DE CONTINUAR (solo peso, no duración)
        console.log("=== INICIANDO VALIDACIÓN ===");
        const validation = await validateVideoMedia(video.uri, video.duration);

        console.log("=== RESULTADO VALIDACIÓN ===");
        console.log("Es válido:", validation.isValid);
        console.log("Tamaño MB:", validation.sizeMB);
        console.log("Error:", validation.error || "Ninguno");

        if (!validation.isValid) {
          console.log("=== VIDEO RECHAZADO ===");
          Alert.alert("Video muy pesado", validation.error);
          return; // No continuar si el video no es válido
        }

        console.log("=== VIDEO VÁLIDO, NAVEGANDO ===");
        closeModal();
        navigate("CreatePost", {
          media: { uri: video.uri, width: video.width, height: video.height },
          type: "video",
        });
      } else {
        console.log("=== GRABACIÓN CANCELADA ===");
      }
    } catch (error) {
      console.log("=== ERROR EN GRABACIÓN ===", error);
      Alert.alert("Error", "No se pudo grabar el video");
    }
  };

  const pickFromLibrary = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 5],
        quality: 0.8,
      });

      if (!result.canceled && result.assets?.length > 0) {
        const media = result.assets[0];
        const type = media.type === "video" ? "video" : "photo";

        if (type === "photo") {
          console.log("=== VALIDANDO FOTO DE GALERÍA ===");
          const validation = await validatePhotoMedia(media.uri);

          if (!validation.isValid) {
            Alert.alert("Foto muy pesada", validation.error);
            return;
          }
        }

        // Si es video, validar también desde la galería
        if (type === "video") {
          console.log("=== VALIDANDO VIDEO DE GALERÍA ===");
          const validation = await validateVideoMedia(
            media.uri,
            media.duration
          );

          if (!validation.isValid) {
            Alert.alert("Video muy pesado", validation.error);
            return;
          }
        }

        closeModal();
        navigate("CreatePost", {
          media: { uri: media.uri, width: media.width, height: media.height },
          type,
        });
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo seleccionar el archivo");
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    navigation.goBack();
  };

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>
          Necesitamos permisos de cámara
        </Text>
        <TouchableOpacity
          onPress={requestPermission}
          style={styles.permissionButton}
        >
          <Text style={styles.permissionButtonText}>Dar permisos</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing="back">
        <Modal visible={modalVisible} transparent onRequestClose={closeModal}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.header}>
                <TouchableOpacity onPress={closeModal}>
                  <Ionicons name="close" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.title}>Publicar adopción</Text>

                <View style={{ width: 24 }} />
              </View>

              <View style={styles.optionsContainer}>
                <TouchableOpacity style={styles.mainOption} onPress={takePhoto}>
                  <View style={styles.optionIconContainer}>
                    <Ionicons name="camera" size={32} color="white" />
                  </View>
                  <Text style={styles.optionTitle}>Cámara</Text>
                  <Text style={styles.optionSubtitle}>Tomar foto</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.mainOption}
                  onPress={recordVideo}
                >
                  <View style={styles.optionIconContainer}>
                    <Ionicons name="videocam" size={32} color="white" />
                  </View>
                  <Text style={styles.optionTitle}>Video</Text>
                  <Text style={styles.optionSubtitle}>Máx 40 MB</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.mainOption}
                  onPress={pickFromLibrary}
                >
                  <View style={styles.optionIconContainer}>
                    <Ionicons name="images" size={32} color="white" />
                  </View>
                  <Text style={styles.optionTitle}>Galería</Text>
                  <Text style={styles.optionSubtitle}>Elegir existente</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
  },
  permissionText: {
    color: "white",
    fontSize: 16,
    marginBottom: 20,
  },
  permissionButton: {
    backgroundColor: "#6366F1",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: "white",
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#1a1a1a",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 30,
    minHeight: "35%",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  title: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  optionsContainer: {
    paddingHorizontal: 20,
    paddingTop: 30,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  mainOption: {
    alignItems: "center",
    flex: 1,
  },
  optionIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  optionTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  optionSubtitle: {
    color: "#888",
    fontSize: 12,
    textAlign: "center",
  },
});
