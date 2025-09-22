import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Video } from "expo-av";
import * as ImagePicker from "expo-image-picker";
import {
  validateVideoMedia,
  validatePhotoMedia,
} from "../utils/mediaValidation";

type MediaItem = {
  uri: string;
  type: "photo" | "video";
  width?: number;
  height?: number;
};

type PostMediaManagerProps = {
  mediaList: MediaItem[];
  onMediaListChange: (mediaList: MediaItem[]) => void;
};

const PostMediaManager: React.FC<PostMediaManagerProps> = ({
  mediaList,
  onMediaListChange,
}) => {
  const [showMediaModal, setShowMediaModal] = useState(false);

  // Contar fotos y videos
  const photoCount = mediaList.filter((item) => item.type === "photo").length;
  const videoCount = mediaList.filter((item) => item.type === "video").length;
  const canAddPhoto = photoCount < 5;
  const canAddVideo = videoCount < 1;

  const addMediaFromCamera = async (mediaType: "photo" | "video") => {
    console.log("=== 1. INICIANDO addMediaFromCamera ===", mediaType);

    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      console.log("=== 2. PERMISOS ===", status);

      if (status !== "granted") {
        Alert.alert(
          "Permisos necesarios",
          "Necesitás dar permiso para usar la cámara."
        );
        return;
      }

      const options: any = {
        allowsEditing: true,
        aspect: [4, 5],
        quality: 0.8,
      };

      if (mediaType === "video") {
        options.mediaTypes = ImagePicker.MediaTypeOptions.Videos;

        console.log("=== 3. CONFIGURANDO VIDEO ===", options);
      }

      console.log("=== 4. ABRIENDO CÁMARA ===");
      const result = await ImagePicker.launchCameraAsync(options);
      console.log(
        "=== 5. RESULTADO CÁMARA ===",
        result.canceled,
        "assets:",
        result.assets?.length
      );

      if (!result.canceled && result.assets?.length > 0) {
        const newMedia = result.assets[0];
        console.log("=== 6. MEDIA OBTENIDA ===", {
          type: newMedia.type,
          duration: newMedia.duration,
          uri: newMedia.uri.substring(0, 50) + "...",
        });

        const mediaItem: MediaItem = {
          uri: newMedia.uri,
          type: mediaType,
          width: newMedia.width,
          height: newMedia.height,
        };

        // Validar foto antes de agregar (igual que CameraScreen)
        if (mediaType === "photo") {
          console.log("=== VALIDANDO FOTO (CAMARA) ===");
          const photoValidation = await validatePhotoMedia(mediaItem.uri);
          console.log(
            "Foto válida?",
            photoValidation.isValid,
            "sizeMB:",
            photoValidation.sizeMB
          );

          if (!photoValidation.isValid) {
            Alert.alert("Foto muy pesada", photoValidation.error);
            // Mantener modal abierto (comportamiento consistente)
            return;
          }
        }

        // Validar video antes de agregar
        if (mediaType === "video") {
          console.log("=== 7. INICIANDO VALIDACIÓN VIDEO ===");
          console.log("Duración del video:", newMedia.duration);

          const validation = await validateVideoMedia(
            newMedia.uri,
            newMedia.duration
          );

          console.log("=== 8. RESULTADO VALIDACIÓN ===");
          console.log("¿Es válido?", validation.isValid);
          console.log("Error:", validation.error);

          if (!validation.isValid) {
            console.log("=== 9. VIDEO RECHAZADO ===");
            Alert.alert("Video no válido", validation.error);
            // Mantener modal abierto (consistente con CameraScreen)
            return;
          }
        }

        console.log("=== 10. AGREGANDO MEDIA A LA LISTA ===");
        onMediaListChange([...mediaList, mediaItem]);
        setShowMediaModal(false);
      } else {
        console.log("=== CÁMARA CANCELADA O SIN ASSETS ===");
      }
    } catch (error) {
      console.log("=== ERROR EN addMediaFromCamera ===", error);
      Alert.alert(
        "Error",
        `No se pudo ${
          mediaType === "photo" ? "tomar la foto" : "grabar el video"
        }`
      );
    }
  };

  const addMediaFromLibrary = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 5],
        quality: 0.8,
      });

      if (!result.canceled && result.assets?.length > 0) {
        const newMedia = result.assets[0];
        const type = newMedia.type === "video" ? "video" : "photo";

        // Verificar límites
        if (type === "photo" && !canAddPhoto) {
          Alert.alert("Límite alcanzado", "Solo puedes agregar hasta 5 fotos");
          return;
        }
        if (type === "video" && !canAddVideo) {
          Alert.alert("Límite alcanzado", "Solo puedes agregar 1 video");
          return;
        }

        const mediaItem: MediaItem = {
          uri: newMedia.uri,
          type,
          width: newMedia.width,
          height: newMedia.height,
        };

        // Validar foto (ahora lo hace igual que CameraScreen)
        if (type === "photo") {
          console.log("=== VALIDANDO FOTO (GALERIA) ===");
          const photoValidation = await validatePhotoMedia(mediaItem.uri);
          console.log(
            "Foto válida?",
            photoValidation.isValid,
            "sizeMB:",
            photoValidation.sizeMB
          );

          if (!photoValidation.isValid) {
            Alert.alert("Foto muy pesada", photoValidation.error);
            // Mantener modal abierto (consistente)
            return;
          }
        }

        // Validar video antes de agregar (igual que CameraScreen)
        if (type === "video") {
          console.log("Duración del video:", newMedia.duration);
          const validation = await validateVideoMedia(
            newMedia.uri,
            newMedia.duration
          );

          console.log("¿Es válido?", validation.isValid);
          console.log("Error:", validation.error);
          if (!validation.isValid) {
            Alert.alert("Video no válido", validation.error);
            // Mantener modal abierto (consistente)
            return;
          }
        }

        onMediaListChange([...mediaList, mediaItem]);
        setShowMediaModal(false);
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo seleccionar el archivo");
    }
  };

  const removeMedia = (index: number) => {
    const newMediaList = mediaList.filter((_, i) => i !== index);
    onMediaListChange(newMediaList);
  };

  const openMediaModal = () => {
    if (mediaList.length >= 6) {
      Alert.alert(
        "Límite alcanzado",
        "Solo puedes agregar hasta 6 archivos (5 fotos + 1 video)"
      );
      return;
    }
    setShowMediaModal(true);
  };

  return (
    <>
      {/* Carrusel de media horizontal */}
      {mediaList.length > 0 && (
        <View style={styles.mediaSection}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.mediaCarousel}
            contentContainerStyle={styles.mediaCarouselContent}
          >
            {mediaList.map((item, index) => {
              const isFirst = index === 0;

              return (
                <View
                  key={`${item.uri}-${index}`}
                  style={[
                    styles.mediaContainer,
                    isFirst && styles.firstMediaContainer,
                  ]}
                >
                  {item.type === "photo" ? (
                    <Image
                      source={{ uri: item.uri }}
                      style={styles.mediaPreview}
                    />
                  ) : (
                    <Video
                      source={{ uri: item.uri }}
                      style={styles.mediaPreview}
                      useNativeControls={false}
                      shouldPlay={false}
                    />
                  )}

                  {/* Botón para eliminar */}
                  <TouchableOpacity
                    style={styles.removeMediaButton}
                    onPress={() => removeMedia(index)}
                  >
                    <Ionicons name="close" size={16} color="white" />
                  </TouchableOpacity>

                  {/* Indicador de tipo */}
                  <View style={styles.mediaTypeIndicator}>
                    <Ionicons
                      name={item.type === "photo" ? "image" : "videocam"}
                      size={12}
                      color="white"
                    />
                  </View>
                </View>
              );
            })}

            {/* Botón para agregar más media */}
            {mediaList.length < 6 && (
              <TouchableOpacity
                style={styles.addMediaButton}
                onPress={openMediaModal}
              >
                <Ionicons name="add" size={24} color="#666" />
                <Text style={styles.addMediaText}>Agregar</Text>
              </TouchableOpacity>
            )}
          </ScrollView>

          {/* Contador y límites con nuevo diseño */}
          <View style={styles.mediaInfo}>
            <Text style={styles.mediaCounter}>
              {mediaList.length} archivos agregados (máx: 1 video + 5 fotos)
            </Text>
            <View style={styles.mediaLimitsRow}>
              <View style={styles.limitItem}>
                <Ionicons name="videocam" size={14} color="#666" />
                <Text style={styles.mediaLimits}>{videoCount}/1</Text>
              </View>
              <View style={styles.limitItem}>
                <Ionicons name="image" size={14} color="#666" />
                <Text style={styles.mediaLimits}>{photoCount}/5</Text>
              </View>
            </View>
          </View>
        </View>
      )}

      {/* Si no hay media, mostrar botón para agregar */}
      {mediaList.length === 0 && (
        <View style={styles.emptyMediaContainer}>
          <TouchableOpacity
            style={styles.addFirstMediaButton}
            onPress={openMediaModal}
          >
            <Ionicons name="camera" size={32} color="#666" />
            <Text style={styles.addFirstMediaText}>Agregar foto o video</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Modal para agregar media */}
      <Modal visible={showMediaModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setShowMediaModal(false)}>
                <Ionicons name="close" size={24} color="white" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Agregar contenido</Text>
              <View style={{ width: 24 }} />
            </View>

            <View style={styles.modalOptions}>
              {canAddPhoto && (
                <TouchableOpacity
                  style={styles.modalOption}
                  onPress={() => addMediaFromCamera("photo")}
                >
                  <Ionicons name="camera" size={32} color="white" />
                  <Text style={styles.modalOptionText}>Tomar foto</Text>
                  <Text style={styles.modalOptionSubtext}>
                    ({photoCount}/5)
                  </Text>
                </TouchableOpacity>
              )}

              {canAddVideo && (
                <TouchableOpacity
                  style={styles.modalOption}
                  onPress={() => addMediaFromCamera("video")}
                >
                  <Ionicons name="videocam" size={32} color="white" />
                  <Text style={styles.modalOptionText}>Grabar video</Text>
                  <Text style={styles.modalOptionSubtext}>
                    ({videoCount}/1)
                  </Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={styles.modalOption}
                onPress={addMediaFromLibrary}
              >
                <Ionicons name="images" size={32} color="white" />
                <Text style={styles.modalOptionText}>Galería</Text>
                <Text style={styles.modalOptionSubtext}>Elegir existente</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  mediaSection: {
    paddingVertical: 16,
  },
  mediaCarousel: {
    paddingHorizontal: 16,
  },
  mediaCarouselContent: {
    alignItems: "center",
    gap: 12,
  },
  mediaContainer: {
    position: "relative",
    height: 120,
    width: 90,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#f5f5f5",
  },
  firstMediaContainer: {
    height: 140,
    width: 110,
    borderWidth: 0,
  },
  mediaPreview: {
    width: "100%",
    height: "100%",
  },
  removeMediaButton: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  mediaTypeIndicator: {
    position: "absolute",
    bottom: 6,
    left: 6,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  coverBadge: {
    position: "absolute",
    top: 4,
    left: 4,
    backgroundColor: "rgba(0,0,0,0.8)",
    borderRadius: 8,
    width: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  addMediaButton: {
    height: 120,
    width: 90,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#ddd",
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fafafa",
  },
  addMediaText: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  mediaInfo: {
    alignItems: "center",
    marginTop: 19,
  },
  mediaCounter: {
    fontSize: 13,
    color: "#333",
    fontWeight: "500",
    marginBottom: 4,
  },
  mediaLimitsRow: {
    flexDirection: "row",
    gap: 16,
  },
  limitItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  mediaLimits: {
    fontSize: 12,
    color: "#666",
  },
  emptyMediaContainer: {
    padding: 16,
    alignItems: "center",
  },
  addFirstMediaButton: {
    height: 120,
    width: 200,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#ddd",
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fafafa",
  },
  addFirstMediaText: {
    fontSize: 14,
    color: "#666",
    marginTop: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#1a1a1a",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 30,
    minHeight: "40%",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  modalTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  modalOptions: {
    paddingHorizontal: 20,
    paddingTop: 20,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  modalOption: {
    alignItems: "center",
    flex: 1,
  },
  modalOptionText: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
    marginTop: 8,
  },
  modalOptionSubtext: {
    color: "#888",
    fontSize: 12,
    marginTop: 2,
  },
});

export default PostMediaManager;
