"use client";

import type React from "react";
import { useState } from "react";
import {
  Modal,
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { PetDetailData } from "../../types/mapTypes";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

interface PetDetailsModalProps {
  visible: boolean;
  petData: PetDetailData | null;
  onClose: () => void;
  onContact: (contactInfo: ContactInfo) => void;
  onReport: (reportData: ReportData) => void;
  isOwner?: boolean;
  currentUserId?: string;
}

interface ContactInfo {
  type: "phone" | "whatsapp" | "message";
  value: string;
  petId: string;
}

interface ReportData {
  petId: string;
  reportType: "inappropriate" | "spam" | "fake" | "resolved";
  description?: string;
}

export const PetMapModal: React.FC<PetDetailsModalProps> = ({
  visible,
  petData,
  onClose,
  onContact,
  onReport,
  isOwner = false,
  currentUserId,
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showContactOptions, setShowContactOptions] = useState(false);

  if (!petData) return null;

  const handleContactPress = (
    type: "phone" | "whatsapp" | "message",
    value: string
  ) => {
    onContact({ type, value, petId: petData.id });
    setShowContactOptions(false);
  };

  const handleReportPress = (reportType: ReportData["reportType"]) => {
    Alert.alert(
      "Reportar publicación",
      "¿Estás seguro de que quieres reportar esta publicación?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Reportar",
          style: "destructive",
          onPress: () => onReport({ petId: petData.id, reportType }),
        },
      ]
    );
  };

  const getStatusColor = () => {
    return petData.status === "PERDIDO" ? "#ef4444" : "#3b82f6";
  };

  const getStatusText = () => {
    return petData.status === "PERDIDO" ? "PERDIDO - URGENTE" : "AVISTAMIENTO";
  };

  const formatTimeAgo = (date: string) => {
    // Implementar lógica de tiempo transcurrido
    return "Hace 2 horas";
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#374151" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Detalles</Text>
          <TouchableOpacity onPress={() => Alert.alert("Más opciones")}>
            <Ionicons name="ellipsis-horizontal" size={24} color="#374151" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Galería de imágenes */}
          <View style={styles.imageGallery}>
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={(e) => {
                const index = Math.round(
                  e.nativeEvent.contentOffset.x / SCREEN_WIDTH
                );
                setActiveImageIndex(index);
              }}
            >
              {petData.images.map((image, index) => (
                <Image
                  key={index}
                  source={{ uri: image }}
                  style={styles.image}
                />
              ))}
            </ScrollView>

            {/* Indicadores de imagen */}
            {petData.images.length > 1 && (
              <View style={styles.imageIndicators}>
                {petData.images.map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.indicator,
                      activeImageIndex === index && styles.activeIndicator,
                    ]}
                  />
                ))}
              </View>
            )}
          </View>

          {/* Status y información básica */}
          <View style={styles.infoSection}>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor() },
              ]}
            >
              <Text style={styles.statusText}>{getStatusText()}</Text>
            </View>

            <Text style={styles.petName}>
              {petData.name || "Mascota sin nombre"}
            </Text>
            <Text style={styles.petBasics}>
              {petData.species} • {petData.breed || "Raza mixta"} •{" "}
              {petData.gender}
            </Text>
            <Text style={styles.timeLocation}>
              {formatTimeAgo(petData.reportedAt)} • {petData.location}
            </Text>
          </View>

          {/* Descripción */}
          {petData.description && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Descripción</Text>
              <Text style={styles.description}>{petData.description}</Text>
            </View>
          )}

          {/* Características */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Características</Text>
            <View style={styles.characteristicsGrid}>
              <View style={styles.characteristic}>
                <Text style={styles.charLabel}>Tamaño</Text>
                <Text style={styles.charValue}>
                  {petData.size || "No especificado"}
                </Text>
              </View>
              <View style={styles.characteristic}>
                <Text style={styles.charLabel}>Color</Text>
                <Text style={styles.charValue}>
                  {petData.color || "No especificado"}
                </Text>
              </View>
              <View style={styles.characteristic}>
                <Text style={styles.charLabel}>Edad aprox.</Text>
                <Text style={styles.charValue}>
                  {petData.age || "No especificada"}
                </Text>
              </View>
              <View style={styles.characteristic}>
                <Text style={styles.charLabel}>Collar</Text>
                <Text style={styles.charValue}>
                  {petData.hasCollar ? "Sí" : "No"}
                </Text>
              </View>
            </View>
          </View>

          {/* Ubicación detallada */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ubicación del reporte</Text>
            <View style={styles.locationInfo}>
              <Ionicons name="location" size={16} color="#6b7280" />
              <Text style={styles.locationText}>
                {petData.detailedLocation}
              </Text>
            </View>
            <Text style={styles.locationNote}>
              Ubicación aproximada por privacidad
            </Text>
          </View>

          {/* Información del reportador */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Reportado por</Text>
            <View style={styles.reporterInfo}>
              <Image
                source={{
                  uri:
                    petData.reporter.avatar || "https://via.placeholder.com/40",
                }}
                style={styles.reporterAvatar}
              />
              <View style={styles.reporterDetails}>
                <Text style={styles.reporterName}>{petData.reporter.name}</Text>
                <Text style={styles.reporterStats}>
                  {petData.reporter.reportsCount} reportes • Se unió en{" "}
                  {petData.reporter.joinedDate}
                </Text>
              </View>
            </View>
          </View>

          {/* Botones de acción */}
          <View style={styles.actions}>
            {!isOwner && (
              <>
                <TouchableOpacity
                  style={styles.contactButton}
                  onPress={() => setShowContactOptions(true)}
                >
                  <Ionicons name="chatbubble" size={20} color="#fff" />
                  <Text style={styles.contactButtonText}>Contactar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.reportButton}
                  onPress={() => handleReportPress("inappropriate")}
                >
                  <Ionicons name="flag" size={16} color="#6b7280" />
                  <Text style={styles.reportButtonText}>Reportar</Text>
                </TouchableOpacity>
              </>
            )}

            {isOwner && (
              <TouchableOpacity style={styles.editButton}>
                <Ionicons name="create" size={20} color="#6366f1" />
                <Text style={styles.editButtonText}>Editar publicación</Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>

        {/* Modal de opciones de contacto */}
        {showContactOptions && (
          <View style={styles.contactModal}>
            <View style={styles.contactModalContent}>
              <Text style={styles.contactModalTitle}>
                ¿Cómo quieres contactar?
              </Text>

              {petData.contactInfo.phone && (
                <TouchableOpacity
                  style={styles.contactOption}
                  onPress={() =>
                    handleContactPress("phone", petData.contactInfo.phone!)
                  }
                >
                  <Ionicons name="call" size={24} color="#10b981" />
                  <Text style={styles.contactOptionText}>Llamar</Text>
                </TouchableOpacity>
              )}

              {petData.contactInfo.whatsapp && (
                <TouchableOpacity
                  style={styles.contactOption}
                  onPress={() =>
                    handleContactPress(
                      "whatsapp",
                      petData.contactInfo.whatsapp!
                    )
                  }
                >
                  <Ionicons name="logo-whatsapp" size={24} color="#25d366" />
                  <Text style={styles.contactOptionText}>WhatsApp</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={styles.contactOption}
                onPress={() =>
                  handleContactPress("message", petData.reporter.id)
                }
              >
                <Ionicons name="mail" size={24} color="#6366f1" />
                <Text style={styles.contactOptionText}>Mensaje interno</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.contactCancel}
                onPress={() => setShowContactOptions(false)}
              >
                <Text style={styles.contactCancelText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
    backgroundColor: "#667eea08",
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "#f9fafb",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
  },
  content: {
    flex: 1,
  },
  imageGallery: {
    position: "relative",
  },
  image: {
    width: SCREEN_WIDTH,
    height: 280,
    backgroundColor: "#f3f4f6",
  },
  imageIndicators: {
    position: "absolute",
    bottom: 16,
    alignSelf: "center",
    flexDirection: "row",
    gap: 8,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.5)",
  },
  activeIndicator: {
    backgroundColor: "#667eea",
  },
  infoSection: {
    padding: 16,
    backgroundColor: "#667eea05",
  },
  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
  petName: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1f2937",
    marginBottom: 4,
  },
  petBasics: {
    fontSize: 16,
    color: "#6b7280",
    marginBottom: 4,
  },
  timeLocation: {
    fontSize: 14,
    color: "#9ca3af",
  },
  section: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#f9fafb",
    marginHorizontal: 8,
    marginVertical: 4,
    borderRadius: 12,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: "#4b5563",
  },
  characteristicsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  characteristic: {
    width: "45%",
    padding: 12,
    backgroundColor: "#f9fafb",
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: "#667eea",
  },
  charLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6b7280",
    marginBottom: 4,
  },
  charValue: {
    fontSize: 16,
    color: "#1f2937",
    fontWeight: "500",
  },
  locationInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
    padding: 12,
    backgroundColor: "#f9fafb",
    borderRadius: 8,
  },
  locationText: {
    fontSize: 16,
    color: "#4b5563",
  },
  locationNote: {
    fontSize: 12,
    color: "#9ca3af",
    fontStyle: "italic",
    marginTop: 8,
  },
  reporterInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    backgroundColor: "#f9fafb",
    borderRadius: 8,
  },
  reporterAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f3f4f6",
    borderWidth: 2,
    borderColor: "#667eea20",
  },
  reporterDetails: {
    flex: 1,
  },
  reporterName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 2,
  },
  reporterStats: {
    fontSize: 12,
    color: "#6b7280",
  },
  actions: {
    padding: 16,
    gap: 12,
    backgroundColor: "#f9fafb",
  },
  contactButton: {
    backgroundColor: "#667eea",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: "#667eea",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  contactButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  reportButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#fff",
  },
  reportButtonText: {
    color: "#6b7280",
    fontSize: 14,
    fontWeight: "500",
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#667eea",
    backgroundColor: "#667eea08",
  },
  editButtonText: {
    color: "#667eea",
    fontSize: 16,
    fontWeight: "600",
  },
  contactModal: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  contactModalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  contactModalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1f2937",
    textAlign: "center",
    marginBottom: 20,
  },
  contactOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: "#f9fafb",
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: "#667eea20",
  },
  contactOptionText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1f2937",
  },
  contactCancel: {
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
  },
  contactCancelText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#6b7280",
  },
});
