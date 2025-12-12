import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/types";
import { navigate } from "../navigation/NavigationService";
import {
  validateVideoMedia,
  validatePhotoMedia,
} from "../utils/mediaValidation";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type CameraScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const navigation = useNavigation<CameraScreenNavigationProp>();
  const insets = useSafeAreaInsets();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCameraNativeOpen, setIsCameraNativeOpen] = useState(false);

  React.useEffect(() => {
    if (permission && !permission.granted) {
      requestPermission();
    }
  }, [permission]);

  useFocusEffect(
    React.useCallback(() => {
      setIsProcessing(false);
      setIsCameraNativeOpen(false);
    }, [])
  );

  const takePhoto = async () => {
    try {
      setIsCameraNativeOpen(true);
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 5],
        quality: 0.8,
      });

      if (!result.canceled && result.assets?.length > 0) {
        setIsProcessing(true);
        const photo = result.assets[0];

        // VALIDAR FOTO ANTES DE CONTINUAR
        const validation = await validatePhotoMedia(photo.uri);

        if (!validation.isValid) {
          Alert.alert("Foto muy pesada", validation.error);
          return;
        }
        // closeModal();

        navigate("CreatePost", {
          media: { uri: photo.uri, width: photo.width, height: photo.height },
          type: "photo",
        });
      }
    } catch (error) {
      console.log("Error:", error);
      Alert.alert("Error", "No se pudo tomar la foto");
    } finally {
      setIsCameraNativeOpen(false);
    }
  };

  const recordVideo = async () => {
    try {
      setIsCameraNativeOpen(true);
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        aspect: [4, 5],
        quality: 0.8,
        // videoMaxDuration removido - no funciona en Android
      });

      if (!result.canceled && result.assets?.length > 0) {
        setIsProcessing(true);
        const video = result.assets[0];

        // VALIDAR VIDEO ANTES DE CONTINUAR (solo peso, no duración)
        const validation = await validateVideoMedia(video.uri, video.duration);
        if (!validation.isValid) {
          Alert.alert("Video muy pesado", validation.error);
          return; // No continuar si el video no es válido
        }
        // closeModal();

        navigate("CreatePost", {
          media: { uri: video.uri, width: video.width, height: video.height },
          type: "video",
        });
      } else {
        setIsCameraNativeOpen(false);
        console.log("=== GRABACIÓN CANCELADA ===");
        setIsCameraNativeOpen(false);
      }
    } catch (error) {
      console.log("=== ERROR EN GRABACIÓN ===", error);
      Alert.alert("Error", "No se pudo grabar el video");
    } finally {
      setIsCameraNativeOpen(false); // ← AGREGAR
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

        // closeModal();

        navigate("CreatePost", {
          media: { uri: media.uri, width: media.width, height: media.height },
          type,
        });
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo seleccionar el archivo");
    }
  };

  // const closeModal = () => {
  //   setModalVisible(false);
  // };

  const exitCameraScreen = () => {
    navigation.goBack();
  };

  if (!permission) {
    return <View style={{ flex: 1, backgroundColor: "black" }} />;
  }
  // Mostrar loading SOLO cuando está procesando (no al abrir cámara)
  if (isProcessing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#667eea" />
        <Text style={styles.loadingText}>Procesando...</Text>
      </View>
    );
  }

  // Ocultar el CameraScreen mientras la cámara nativa está abierta
  if (isCameraNativeOpen) {
    return <View style={{ flex: 1, backgroundColor: "black" }} />;
  }

  return (
    <View style={styles.container}>
      {/* Visor de la cámara */}
      <View style={styles.cameraContainer}>
        <CameraView style={styles.camera} facing="back" />
        {/* Overlay oscuro sobre el visor */}
        <View style={styles.cameraOverlay} />
      </View>

      {/* Panel inferior con bordes redondeados */}
      <View style={[styles.panel, { paddingBottom: insets.bottom + 20 }]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={exitCameraScreen}
            style={styles.closeButton}
          >
            <Ionicons name="arrow-back" size={26} color="white" />
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Publicar adopción</Text>
            <Text style={styles.subtitle}>Elige una opción</Text>
          </View>
          <View style={{ width: 26 }} />
        </View>

        {/* Opciones */}
        <View style={styles.optionsContainer}>
          <TouchableOpacity style={styles.option} onPress={takePhoto}>
            <View style={styles.optionIconContainer}>
              <Ionicons name="camera" size={32} color="white" />
            </View>
            <Text style={styles.optionTitle}>Cámara</Text>
            <Text style={styles.optionSubtitle}>Tomar foto</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.option} onPress={recordVideo}>
            <View style={styles.optionIconContainer}>
              <Ionicons name="videocam" size={32} color="white" />
            </View>
            <Text style={styles.optionTitle}>Video</Text>
            <Text style={styles.optionSubtitle}>Máx 40 MB</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.option} onPress={pickFromLibrary}>
            <View style={styles.optionIconContainer}>
              <Ionicons name="images" size={32} color="white" />
            </View>
            <Text style={styles.optionTitle}>Galería</Text>
            <Text style={styles.optionSubtitle}>Elegir existente</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  cameraContainer: {
    flex: 0.65, // 65% para el visor
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.7)", // Ajusta la opacidad si querés (0.3 - 0.7)
  },
  panel: {
    flex: 0.35, // 35% para el panel
    backgroundColor: "#1a1a1a",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24, // Superposición para mostrar bordes redondeados
    paddingTop: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  closeButton: {
    padding: 4,
  },
  titleContainer: {
    alignItems: "center",
    flex: 1,
  },
  title: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  subtitle: {
    color: "#888",
    fontSize: 14,
    marginTop: 2,
  },
  optionsContainer: {
    paddingHorizontal: 20,
    paddingTop: 25,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  option: {
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
  loadingContainer: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "white",
    fontSize: 16,
    marginTop: 12,
  },
});
