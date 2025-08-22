import React from "react";
import { View, TouchableOpacity, Text, Image, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { PetPin } from "../../types/mapTypes";

const BOTTOM_CARD_HEIGHT = 180;

interface MapBottomCardProps {
  selected: PetPin | null;
  isMarked: boolean;
  onViewMore: () => void;
  onMark: () => void;
  onClose: () => void;
  // Nuevas props para estado vacío
  nearbyPetsCount?: number;
  isUserLoggedIn?: boolean;
  onReportPet?: () => void;
  onLogin?: () => void;
}

export const MapBottomCard: React.FC<MapBottomCardProps> = ({
  selected,
  isMarked,
  onViewMore,
  onMark,
  onClose,
  nearbyPetsCount = 8,
  isUserLoggedIn = false,
  onReportPet,
  onLogin,
}) => {
  // Función helper para mostrar tiempo transcurrido
  const getTimeAgo = (label: string) => {
    // Simulamos tiempo - en app real vendría del backend
    const times = [
      "Hace 1 hora",
      "Hace 3 horas",
      "Ayer",
      "Hace 2 días",
      "Hace 1 semana",
    ];
    return times[Math.floor(Math.random() * times.length)];
  };

  // Función helper para mostrar ubicación aproximada
  const getApproximateLocation = () => {
    const locations = [
      "Av. Santa Fe 1234",
      "Palermo Soho",
      "Plaza San Martín",
      "Microcentro",
      "Puerto Madero",
    ];
    return locations[Math.floor(Math.random() * locations.length)];
  };

  return (
    <View style={[styles.bottomCard, { height: BOTTOM_CARD_HEIGHT }]}>
      {selected ? (
        // Estado con mascota seleccionada
        <>
          <Image source={{ uri: selected.image }} style={styles.bottomImg} />
          <View style={{ flex: 1 }}>
            <View style={styles.headerRow}>
              <Text style={styles.bottomTitle}>
                {selected.label === "PERDIDO" ? "Perdido" : "Avistamiento"}
              </Text>
              <View
                style={[
                  styles.statusBadge,
                  selected.label === "PERDIDO"
                    ? styles.lostBadge
                    : styles.sightingBadge,
                ]}
              >
                <Text style={styles.statusText}>
                  {selected.label === "PERDIDO" ? "URGENTE" : "VISTO"}
                </Text>
              </View>
            </View>

            <Text style={styles.petDetails}>
              {selected.species} • {getTimeAgo(selected.label)}
            </Text>
            <Text style={styles.locationText}>
              📍 Cerca de {getApproximateLocation()}
            </Text>

            <View style={styles.actionsRow}>
              <TouchableOpacity onPress={onViewMore} style={styles.btnPrimary}>
                <Text style={styles.btnPrimaryText}>Ver detalles</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={onMark} style={styles.btnOutline}>
                <Ionicons
                  name={isMarked ? "heart" : "heart-outline"}
                  size={16}
                  color={isMarked ? "#ff4757" : "#333"}
                />
                <Text
                  style={[
                    styles.btnOutlineText,
                    isMarked && { color: "#ff4757" },
                  ]}
                >
                  {isMarked ? "Guardado" : "Guardar"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={20} color="#666" />
          </TouchableOpacity>
        </>
      ) : (
        // Estado vacío mejorado
        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}>
            <Ionicons name="paw-outline" size={32} color="#6366f1" />
          </View>
          <View style={styles.emptyContent}>
            <Text style={styles.emptyTitle}>Explora el mapa</Text>
            <Text style={styles.emptySubtitle}>
              {nearbyPetsCount} mascotas cerca necesitan ayuda
            </Text>
            <Text style={styles.emptyHint}>
              Toca cualquier pin para ver detalles
            </Text>
          </View>
          <View style={styles.emptyActions}>
            {isUserLoggedIn ? (
              <TouchableOpacity
                style={styles.reportButton}
                onPress={onReportPet}
              >
                <Ionicons name="add-circle" size={16} color="#fff" />
                <Text style={styles.reportButtonText}>Reportar</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.loginPrompt} onPress={onLogin}>
                <Text style={styles.loginPromptText}>Iniciar sesión</Text>
                <Ionicons name="arrow-forward" size={14} color="#6366f1" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  bottomCard: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 14,
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
    zIndex: 3,
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: -2 },
  },
  bottomImg: {
    width: 84,
    height: 84,
    borderRadius: 12,
    backgroundColor: "#eee",
  },

  // Estilos para estado con selección
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  bottomTitle: {
    fontWeight: "800",
    fontSize: 16,
    color: "#1f2937",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  lostBadge: {
    backgroundColor: "#fee2e2",
  },
  sightingBadge: {
    backgroundColor: "#dbeafe",
  },
  statusText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#374151",
  },
  petDetails: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 2,
  },
  locationText: {
    fontSize: 12,
    color: "#9ca3af",
    marginBottom: 8,
  },
  actionsRow: {
    flexDirection: "row",
    gap: 8,
  },
  btnPrimary: {
    backgroundColor: "#6366f1",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    flex: 1,
  },
  btnPrimaryText: {
    color: "#fff",
    fontWeight: "600",
    textAlign: "center",
    fontSize: 14,
  },
  btnOutline: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  btnOutlineText: {
    color: "#374151",
    fontWeight: "600",
    fontSize: 14,
  },
  closeButton: {
    padding: 4,
  },

  // Estilos para estado vacío
  emptyState: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  emptyIcon: {
    width: 60,
    height: 60,
    backgroundColor: "#f3f4f6",
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyContent: {
    flex: 1,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 2,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 2,
  },
  emptyHint: {
    fontSize: 12,
    color: "#9ca3af",
  },
  emptyActions: {
    alignItems: "flex-end",
  },
  reportButton: {
    backgroundColor: "#6366f1",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  reportButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  loginPrompt: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  loginPromptText: {
    color: "#6366f1",
    fontWeight: "600",
    fontSize: 14,
  },
});
