"use client";

import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Modal,
  Dimensions,
} from "react-native";
import { usePetRegisterStore } from "../../store/petRegisterStore";
import * as ImagePicker from "expo-image-picker";
// @ts-ignore
import Ionicons from "react-native-vector-icons/Ionicons";

export default function StepPhotos() {
  const [modalVisible, setModalVisible] = useState(false);
  const { form, setFormField } = usePetRegisterStore();
  const photoUrls: { uri: string; offsetY: number }[] = form.photoUrls || [];
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showFullScreen, setShowFullScreen] = useState(false);

  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);

  const handleAddPhoto = (uri: string) => {
    const newPhoto = { uri, offsetY: 0.5 };
    setFormField("photoUrls", [...photoUrls, newPhoto]);
  };

  const pickImageFromLibrary = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled && result.assets?.length > 0) {
      handleAddPhoto(result.assets[0].uri);
      closeModal();
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      alert("Necesitás dar permiso para usar la cámara.");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled && result.assets?.length > 0) {
      handleAddPhoto(result.assets[0].uri);
      closeModal();
    }
  };

  const handleRemovePhoto = (index: number) => {
    const updated = [...photoUrls];
    updated.splice(index, 1);
    setFormField("photoUrls", updated);
  };

  const max = 5;
  const combined = [
    ...photoUrls.map((p) => ({ tipo: "imagen", uri: p.uri })),
    ...Array.from({ length: max - photoUrls.length }).map(() => ({
      tipo: "vacío",
    })),
  ];

  return (
    <View style={styles.container}>
      {/* Card wrapper */}
      <View style={styles.card}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📸 Fotos de la Mascota</Text>
          <Text style={styles.sectionDescription}>
            Agregá fotos que muestren su personalidad
          </Text>
        </View>

        <View style={styles.form}>
          {/* Carousel principal */}
          <View style={styles.carouselSection}>
            <Text style={styles.label}>Vista principal</Text>
            <View style={styles.carouselContainer}>
              {photoUrls.length === 0 ? (
                <View style={styles.carouselPlaceholder}>
                  <Ionicons name="camera-outline" size={48} color="#9CA3AF" />
                  <Text style={styles.placeholderText}>Sin imágenes</Text>
                  <Text style={styles.placeholderSubtext}>
                    Agregá tu primera foto
                  </Text>
                </View>
              ) : (
                <FlatList
                  data={photoUrls.map((p, index) => ({
                    id: index.toString(),
                    uri: p.uri,
                  }))}
                  horizontal
                  keyExtractor={(item) => item.id}
                  renderItem={({ item, index }) => (
                    <TouchableOpacity
                      onPress={() => {
                        setSelectedIndex(index);
                        setShowFullScreen(true);
                      }}
                    >
                      <Image
                        source={{ uri: item.uri }}
                        style={styles.carouselImage}
                      />
                    </TouchableOpacity>
                  )}
                  showsHorizontalScrollIndicator={false}
                />
              )}
            </View>
          </View>

          {/* Grid de thumbnails */}
          <View style={styles.gridSection}>
            <Text style={styles.label}>
              Fotos ({photoUrls.length}/{max}) *
            </Text>
            <View style={styles.grid}>
              {combined.map((item, index) => {
                if (item.tipo === "imagen") {
                  const uri = (item as { tipo: "imagen"; uri: string }).uri;
                  return (
                    <View key={index} style={styles.photoBox}>
                      <Image source={{ uri }} style={styles.imageThumb} />
                      <TouchableOpacity
                        style={styles.removeButton}
                        onPress={() => handleRemovePhoto(index)}
                      >
                        <Ionicons name="close" size={16} color="#FFFFFF" />
                      </TouchableOpacity>
                    </View>
                  );
                }
                return (
                  <TouchableOpacity
                    key={index}
                    style={styles.addPhotoBox}
                    onPress={openModal}
                  >
                    <Ionicons name="add" size={32} color="#6366F1" />
                    <Text style={styles.addPhotoText}>Agregar</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Consejos */}
          <View style={styles.tipsSection}>
            <Text style={styles.tipsTitle}>
              💡 Consejos para mejores fotos:
            </Text>
            <View style={styles.tipsList}>
              <Text style={styles.tip}>• Usá buena iluminación natural</Text>
              <Text style={styles.tip}>
                • Mostrá la cara y el cuerpo completo
              </Text>
              <Text style={styles.tip}>
                • Incluí fotos jugando o interactuando
              </Text>
              <Text style={styles.tip}>
                • Evitá fotos borrosas o muy oscuras
              </Text>
            </View>
          </View>

          {/* Modal para elegir fuente */}
          <Modal visible={modalVisible} transparent animationType="fade">
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Agregar foto</Text>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={takePhoto}
                >
                  <Ionicons name="camera" size={24} color="#374151" />
                  <Text style={styles.modalButtonText}>Tomar foto</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={pickImageFromLibrary}
                >
                  <Ionicons name="images" size={24} color="#374151" />
                  <Text style={styles.modalButtonText}>Elegir de galería</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={closeModal}
                >
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          {/* Modal pantalla completa */}
          <Modal
            visible={showFullScreen}
            transparent
            animationType="fade"
            onRequestClose={() => setShowFullScreen(false)}
          >
            <View style={styles.fullImageOverlay}>
              <TouchableOpacity
                style={styles.closeFullImageButton}
                onPress={() => {
                  setShowFullScreen(false);
                  setSelectedIndex(null);
                }}
              >
                <Ionicons name="close" size={24} color="#FFFFFF" />
              </TouchableOpacity>
              {selectedIndex !== null && (
                <FlatList
                  data={photoUrls}
                  horizontal
                  pagingEnabled
                  snapToAlignment="center"
                  decelerationRate="fast"
                  initialScrollIndex={selectedIndex}
                  keyExtractor={(_, i) => i.toString()}
                  getItemLayout={(_, index) => ({
                    length: Dimensions.get("window").width,
                    offset: Dimensions.get("window").width * index,
                    index,
                  })}
                  renderItem={({ item }) => (
                    <View
                      style={{
                        width: Dimensions.get("window").width,
                        paddingHorizontal: 12,
                        flex: 1,
                      }}
                    >
                      <Image
                        source={{ uri: item.uri }}
                        style={styles.fullImage}
                        resizeMode="contain"
                      />
                    </View>
                  )}
                />
              )}
            </View>
          </Modal>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  // Card wrapper igual que StepBasicInfo
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 6,
  },
  sectionDescription: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  form: {
    gap: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 6,
  },
  carouselSection: {
    gap: 6,
  },
  carouselContainer: {
    height: 180,
    borderRadius: 10,
    overflow: "hidden",
  },
  carouselPlaceholder: {
    height: "100%",
    borderRadius: 10,
    backgroundColor: "#F9FAFB",
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
  placeholderText: {
    color: "#6B7280",
    fontSize: 14,
    fontWeight: "500",
  },
  placeholderSubtext: {
    color: "#9CA3AF",
    fontSize: 12,
  },
  carouselImage: {
    width: 250,
    height: 180,
    borderRadius: 10,
    marginRight: 10,
  },
  gridSection: {
    gap: 6,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  photoBox: {
    width: 90,
    height: 90,
    borderRadius: 10,
    position: "relative",
    overflow: "hidden",
  },
  imageThumb: {
    width: "100%",
    height: "100%",
  },
  removeButton: {
    position: "absolute",
    top: 3,
    right: 3,
    backgroundColor: "rgba(0,0,0,0.7)",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  addPhotoBox: {
    width: 90,
    height: 90,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#6366F1",
    borderStyle: "dashed",
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
    gap: 3,
  },
  addPhotoText: {
    fontSize: 11,
    color: "#6366F1",
    fontWeight: "500",
  },
  tipsSection: {
    backgroundColor: "#F0F9FF",
    padding: 14,
    borderRadius: 10,
    borderLeftWidth: 3,
    borderLeftColor: "#0EA5E9",
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0C4A6E",
    marginBottom: 6,
  },
  tipsList: {
    gap: 3,
  },
  tip: {
    fontSize: 13,
    color: "#0C4A6E",
    lineHeight: 18,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    gap: 14,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 6,
  },
  modalButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    width: "100%",
    gap: 10,
  },
  modalButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
  },
  cancelButton: {
    paddingVertical: 10,
    width: "100%",
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#EF4444",
    fontWeight: "600",
    fontSize: 14,
  },
  fullImageOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.95)",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 40,
  },
  fullImage: {
    flex: 1,
    borderRadius: 10,
  },
  closeFullImageButton: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 2,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
});
