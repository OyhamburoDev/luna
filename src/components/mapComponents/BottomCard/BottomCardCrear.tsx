import React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { fonts } from "../../../theme/fonts";
import { PinImageRenderer } from "../../PinImageRenderer";
import { PinForm } from "../../../types/mapTypes";

interface BottomCardCrearProps {
  currentLocation?: { lat: number; lng: number };
  selectedLocation: {
    lat: number;
    lng: number;
    address: string;
  } | null;

  // Estados controlados desde el padre
  selectedType: "PERDIDO" | "AVISTADO" | "ENCONTRADO" | null;
  onTypeChange: (type: "PERDIDO" | "AVISTADO" | "ENCONTRADO") => void;

  selectedImageUri: string | null;
  generatedPinUri: string | null;
  onSelectPhoto: () => void;

  description: string;
  onDescriptionChange: (text: string) => void;

  pinRef: React.RefObject<View | null>;

  onClose: () => void;
  onSearchLocationPress: () => void;
  onPublishReport?: (reportData: PinForm) => void;
  animalName: string;
  onAnimalNameChange: (text: string) => void;
  shortDescription: string;
  onShortDescriptionChange: (text: string) => void;
  handlePublish: () => Promise<void>;
}

export const BottomCardCrear: React.FC<BottomCardCrearProps> = ({
  currentLocation,
  selectedLocation,
  selectedType,
  onTypeChange,
  selectedImageUri,
  generatedPinUri,
  onSelectPhoto,
  description,
  onDescriptionChange,
  pinRef,
  onClose,
  onSearchLocationPress,
  onPublishReport,
  animalName,
  onAnimalNameChange,
  shortDescription,
  onShortDescriptionChange,
  handlePublish,
}) => {
  return (
    <View style={styles.containerExpanded}>
      {/* Header con título y botón cerrar */}
      <View style={styles.header}>
        <Text style={styles.titleLarge}>Reportar mascota</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButtonAbsolute}>
          <Ionicons name="close" size={26} color="#666" />
        </TouchableOpacity>
      </View>

      {/* Contenido scrolleable */}
      <ScrollView
        style={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContentContainer}
      >
        {/* Selector de tipo */}
        <Text style={styles.label}>¿Qué pasó?</Text>
        <View style={styles.typeSelector}>
          <TouchableOpacity
            style={[
              styles.typeButton,
              selectedType === "PERDIDO" && styles.typeButtonActive,
            ]}
            onPress={() => onTypeChange("PERDIDO")}
          >
            <View style={[styles.typeDot, { backgroundColor: "#ef4444" }]} />
            <Text style={styles.typeText}>Perdido</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.typeButton,
              selectedType === "AVISTADO" && styles.typeButtonActive,
            ]}
            onPress={() => onTypeChange("AVISTADO")}
          >
            <View style={[styles.typeDot, { backgroundColor: "#3b82f6" }]} />
            <Text style={styles.typeText}>Avistado</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.typeButton,
              selectedType === "ENCONTRADO" && styles.typeButtonActive,
            ]}
            onPress={() => onTypeChange("ENCONTRADO")}
          >
            <View style={[styles.typeDot, { backgroundColor: "#10b981" }]} />
            <Text style={styles.typeText}>Encontrado</Text>
          </TouchableOpacity>
        </View>

        {/* Nombre del animal */}
        <Text style={styles.label}>Nombre, especie o raza</Text>
        <TextInput
          style={styles.animalNameInput}
          placeholder="Ej: Perro, Gato atigrado, Perro caniche..."
          placeholderTextColor="#999"
          value={animalName}
          onChangeText={onAnimalNameChange}
        />

        {/* Descripción corta */}
        <Text style={styles.label}>Rasgo distintivo</Text>
        <TextInput
          style={styles.shortDescriptionInput}
          placeholder="Ej: collar rojo, mancha blanca..."
          placeholderTextColor="#999"
          numberOfLines={2}
          value={shortDescription}
          onChangeText={onShortDescriptionChange}
        />

        {/* Descripción */}
        <Text style={styles.label}>Descripción</Text>
        <TextInput
          style={styles.descriptionInput}
          placeholder="Ej: Se perdió el domingo en el parque, estaba asustado, llevaba collar rojo. Si lo ves avísame..."
          placeholderTextColor="#999"
          multiline
          numberOfLines={3}
          value={description}
          onChangeText={onDescriptionChange}
        />

        {/* Botón subir foto */}
        <TouchableOpacity style={styles.photoButton} onPress={onSelectPhoto}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Ionicons
              name={selectedImageUri ? "checkmark-circle" : "camera"}
              size={20}
              color={selectedImageUri ? "#10b981" : "#000"}
            />
            <Text style={styles.photoButtonText}>
              {selectedImageUri ? "Foto seleccionada" : "Subir foto"}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Preview de la foto seleccionada */}
        {selectedImageUri && (
          <View style={styles.photoPreviewContainer}>
            <Image
              source={{ uri: selectedImageUri }}
              style={styles.photoPreview}
            />
          </View>
        )}

        {/* Componente oculto para generar el pin */}
        {selectedImageUri && (
          <View style={{ position: "absolute", left: -1000 }}>
            <View ref={pinRef} collapsable={false}>
              <PinImageRenderer
                imageUri={selectedImageUri}
                borderColor={
                  selectedType === "PERDIDO"
                    ? "#ef4444"
                    : selectedType === "AVISTADO"
                    ? "#3b82f6"
                    : "#10b981"
                }
              />
            </View>
          </View>
        )}

        {/* Ubicación */}
        <Text style={styles.label}>Ubicación</Text>
        <View style={styles.locationContainer}>
          <View style={styles.locationInfo}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 6,
                marginBottom: 4,
              }}
            >
              <Ionicons name="location" size={16} color="#666" />
              <Text style={styles.locationLabel}>Tu ubicación actual</Text>
            </View>
            <Text style={styles.locationAddress}>
              {selectedLocation
                ? selectedLocation.address
                : "Tu ubicación actual"}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.adjustButton}
            onPress={onSearchLocationPress}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
            >
              <Ionicons name="search" size={16} color="#000" />
              <Text style={styles.adjustButtonText}>Elegir otra ubicación</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Botón FIJO abajo */}
      <View style={styles.fixedButtonContainer}>
        <TouchableOpacity style={styles.publishButton} onPress={handlePublish}>
          <Text style={styles.publishButtonText}>Publicar reporte</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  containerExpanded: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "75%",
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  header: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    paddingHorizontal: 20,
    position: "relative",
  },
  titleLarge: {
    fontFamily: fonts.bold,
    fontSize: 22,
    fontWeight: "700",
    color: "#000",
    textAlign: "center",
  },
  closeButtonAbsolute: {
    position: "absolute",
    right: 20,
    padding: 8,
  },
  scrollContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollContentContainer: {
    paddingBottom: 20,
  },
  label: {
    fontFamily: fonts.bold,
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 12,
    marginTop: 8,
  },
  typeSelector: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  typeButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "transparent",
  },
  typeButtonActive: {
    backgroundColor: "#fff",
    borderColor: "#000",
  },
  typeDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  typeText: {
    fontFamily: fonts.bold,
    fontSize: 12,
    fontWeight: "600",
    color: "#000",
  },
  animalNameInput: {
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 13,
    color: "#000",
    marginBottom: 16,
    fontFamily: fonts.regular,
  },
  shortDescriptionInput: {
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#000",
    minHeight: 50,
    marginBottom: 16,
    fontFamily: fonts.regular,
  },
  photoButton: {
    backgroundColor: "#F5F5F5",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 16,
  },
  photoButtonText: {
    fontFamily: fonts.semiBold,
    fontSize: 14,
    color: "#000",
  },
  photoPreviewContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  photoPreview: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#ddd",
  },
  descriptionInput: {
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#000",
    minHeight: 80,
    textAlignVertical: "top",
    marginBottom: 16,
    fontFamily: fonts.regular,
  },
  locationContainer: {
    backgroundColor: "#F5F5F5",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  locationInfo: {
    marginBottom: 12,
  },
  locationLabel: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  locationAddress: {
    fontFamily: fonts.bold,
    fontSize: 15,
    fontWeight: "600",
    color: "#000",
  },
  adjustButton: {
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  adjustButtonText: {
    fontFamily: fonts.bold,
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
  },
  fixedButtonContainer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  publishButton: {
    backgroundColor: "#000",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  publishButtonText: {
    fontFamily: fonts.bold,
    fontSize: 15,
    fontWeight: "600",
    color: "#fff",
  },
});
