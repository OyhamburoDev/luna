import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  Platform,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { fonts } from "../../theme/fonts";

const { width } = Dimensions.get("window");

interface PetMapDetailCardProps {
  petData: any;
  visible: boolean;
  onClose: () => void;
  onContact?: (type: string, value: any) => void;
  onShowRoute?: () => void; // ← NUEVO
}

export const PetMapDetailCard = ({
  petData,
  visible,
  onClose,
  onContact,
  onShowRoute, // ← NUEVO
}: PetMapDetailCardProps) => {
  if (!visible || !petData) return null;

  const isLost = petData.label === "PERDIDO";
  const statusColor = isLost ? "#FFEBEE" : "#E8F5E9";
  const statusTextColor = isLost ? "#D32F2F" : "#2E7D32";
  const statusText = isLost ? "PERDIDO" : "ENCONTRADO";

  return (
    <View style={styles.cardContainer}>
      {/* Manillar para deslizar (visual) */}
      <View style={styles.handleBarContainer}>
        <View style={styles.handleBar} />
      </View>

      {/* Header: Título y Estado */}
      <View style={styles.headerRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.petTitle}>
            {petData.species || "Perro Golden Retriever"}{" "}
            <Text style={styles.petSubtitle}>
              - {petData.color || "Dorado con manchas blancas"}
            </Text>
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
          <Text style={[styles.statusText, { color: statusTextColor }]}>
            {statusText}
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
          source={{ uri: petData.photo || petData.image }} // ← Prioriza photo
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
              {petData.location ||
                "Palermo, Buenos Aires - Cerca del Parque Las Heras"}
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
            <Text style={styles.detailText}>
              {petData.time || "Hace 2 horas"}
            </Text>
          </View>

          {/* Descripción breve */}
          <View style={styles.detailItem}>
            <MaterialCommunityIcons
              name="text"
              size={18}
              color="#666"
              style={styles.detailIcon}
            />
            <Text style={styles.descriptionText} numberOfLines={2}>
              {petData.description ||
                "Se escapó esta mañana del patio. Muy dócil, responde a su nombre. Tiene collar rojo."}
            </Text>
          </View>
        </View>
      </View>

      {/* Botones de Acción - UNO DEBAJO DEL OTRO */}
      <View style={styles.buttonsWrapper}>
        {/* Botón Amarillo clarito */}
        <TouchableOpacity
          style={styles.secondaryActionBtn}
          onPress={() => onContact?.("details", petData.id)}
        >
          <Text style={styles.secondaryActionText}>Ver Detalles Completos</Text>
        </TouchableOpacity>

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
    // fontStyle: "italic",
  },
  buttonsWrapper: {
    gap: 10,
    marginTop: 5,
  },
  // Botón amarillo clarito
  secondaryActionBtn: {
    // backgroundColor: "#fcf6dbff",
    backgroundColor: "rgba(102, 126, 234, 0.08)",
    paddingVertical: 8,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",

    // borderWidth: 1,
    // borderColor: "#fdda72ff",
  },
  secondaryActionText: {
    fontFamily: fonts.bold,
    // color: "#333333ae",
    color: "#667eea",
    fontSize: 14,
    // fontWeight: "600",
  },
  // Botón principal negro
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
