import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
} from "react-native";
import { useState } from "react";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { fonts } from "../../theme/fonts";

interface PetMapDetailCardProps {
  petData: any;
  visible: boolean;
  onClose: () => void;
  onContact?: (type: string, value: any) => void;
  onShowRoute?: () => void;
}

export const PetMapDetailCard = ({
  petData,
  visible,
  onClose,
  onContact,
  onShowRoute,
}: PetMapDetailCardProps) => {
  if (!visible || !petData) return null;
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusStyles = (label: string) => {
    switch (label) {
      case "PERDIDO":
        return {
          color: "#FFEBEE",
          textColor: "#D32F2F",
          text: "PERDIDO",
        };
      case "AVISTADO":
        return {
          color: "#E3F2FD",
          textColor: "#1976D2",
          text: "AVISTADO",
        };
      case "ENCONTRADO":
        return {
          color: "#E8F5E9",
          textColor: "#2E7D32",
          text: "ENCONTRADO",
        };
      default:
        return {
          color: "#F5F5F5",
          textColor: "#666",
          text: "DESCONOCIDO",
        };
    }
  };

  const status = getStatusStyles(petData.label);
  const shouldShowExpandButton = petData.description?.length > 31;

  return (
    <View style={styles.cardContainer}>
      {/* Manillar para deslizar (visual) */}
      <View style={styles.handleBarContainer}>
        <View style={styles.handleBar} />
      </View>

      {/* Header: Título y Estado */}
      <View style={styles.headerRow}>
        <View style={{ flex: 1, flexDirection: "column" }}>
          <Text style={styles.petTitle}>
            {petData.animalName}
            <Text style={styles.petSubtitle}>
              {" "}
              - {petData.shortDescription}
            </Text>
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: status.color }]}>
          <Text style={[styles.statusText, { color: status.textColor }]}>
            {status.text}
          </Text>
        </View>
        {/* Botón cerrar discreto */}
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Ionicons name="close" size={20} color="#666" />
        </TouchableOpacity>
      </View>

      <View style={styles.divider} />

      {/* Cuerpo Principal: Imagen izquierda + Datos derecha */}
      <View style={styles.contentRow}>
        {/* Imagen cuadrada y fija */}
        <Image
          source={{ uri: petData.photo || petData.image }}
          style={styles.petImage}
          resizeMode="cover"
        />

        {/* Columna de detalles */}
        <View style={styles.detailsColumn}>
          {/* Ubicación */}
          <View style={styles.detailItem}>
            <MaterialCommunityIcons
              name="map-marker"
              size={18}
              color="#666"
              style={styles.detailIcon}
            />
            <Text style={styles.detailText} numberOfLines={2}>
              {petData.address}
            </Text>
          </View>

          {/* Horario */}
          <View style={styles.detailItem}>
            <MaterialCommunityIcons
              name="clock-outline"
              size={18}
              color="#666"
              style={styles.detailIcon}
            />
            <Text style={styles.detailText}>{petData.time}</Text>
          </View>

          {/* Descripción breve */}
          <View style={styles.detailItem}>
            <MaterialCommunityIcons
              name="text"
              size={18}
              color="#666"
              style={styles.detailIcon}
            />
            <Text
              style={styles.descriptionText}
              numberOfLines={isExpanded ? undefined : 1}
            >
              {petData.description}
            </Text>
          </View>
        </View>
      </View>

      {/* Botones de Acción - UNO DEBAJO DEL OTRO */}
      <View style={styles.buttonsWrapper}>
        {/* Botón Amarillo clarito */}
        {shouldShowExpandButton && (
          <TouchableOpacity
            style={styles.secondaryActionBtn}
            onPress={() => setIsExpanded(!isExpanded)}
          >
            <Text style={styles.secondaryActionText}>
              {isExpanded ? "Ver Menos" : "Ver Detalles Completos"}
            </Text>
          </TouchableOpacity>
        )}

        {/* Botón Principal Negro */}
        <TouchableOpacity style={styles.primaryActionBtn} onPress={onShowRoute}>
          <Ionicons
            name="navigate"
            size={20}
            color="#FFF"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.primaryActionText}>Ver Ruta</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === "ios" ? 34 : 20,
    paddingTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  handleBarContainer: {
    alignItems: "center",
    marginBottom: 15,
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: "#E0E0E0",
    borderRadius: 2,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  petTitle: {
    fontFamily: fonts.bold,
    fontSize: 17,
    fontWeight: "bold",
    color: "#222",
  },
  petSubtitle: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
    fontWeight: "400",
    color: "#666",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 10,
  },
  statusText: {
    fontFamily: fonts.bold,
    fontSize: 10,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  closeButton: {
    padding: 6,
    backgroundColor: "#F5F5F5",
    borderRadius: 20,
  },
  divider: {
    height: 1,
    backgroundColor: "#F0F0F0",
    marginBottom: 15,
  },
  contentRow: {
    flexDirection: "row",
    marginBottom: 20,
  },
  petImage: {
    width: 90,
    height: 90,
    borderRadius: 12,
    backgroundColor: "#F0F0F0",
  },
  detailsColumn: {
    flex: 1,
    marginLeft: 15,
    justifyContent: "center",
    gap: 8,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  detailIcon: {
    marginRight: 8,
    width: 20,
    textAlign: "center",
    marginTop: 1,
  },
  detailText: {
    fontFamily: fonts.semiBold,
    fontSize: 13,
    color: "#444",
    flex: 1,
    fontWeight: "500",
  },
  descriptionText: {
    fontFamily: fonts.semiBold,
    fontSize: 13,
    color: "#666",
    flex: 1,
  },
  buttonsWrapper: {
    gap: 10,
    marginTop: 5,
  },
  secondaryActionBtn: {
    backgroundColor: "rgba(102, 126, 234, 0.08)",
    paddingVertical: 8,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  secondaryActionText: {
    fontFamily: fonts.bold,
    color: "#667eea",
    fontSize: 14,
  },
  primaryActionBtn: {
    backgroundColor: "#000",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    borderRadius: 12,
  },
  primaryActionText: {
    fontFamily: fonts.bold,
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
