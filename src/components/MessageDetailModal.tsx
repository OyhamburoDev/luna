import React from "react";
import {
  Modal,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AdoptionFormDataWithId } from "../types/forms";

interface Props {
  visible: boolean;
  onClose: () => void;
  messageData: any;
}

export default function MessageDetailModal({
  visible,
  onClose,
  messageData,
}: Props) {
  if (!messageData) return null;

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "Fecha no disponible";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "approved":
        return "#4CAF50";
      case "rejected":
        return "#F44336";
      default:
        return "#FF9800";
    }
  };

  const getStatusText = (status?: string) => {
    switch (status) {
      case "approved":
        return "Aprobada";
      case "rejected":
        return "Rechazada";
      default:
        return "Pendiente";
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>Detalle del Mensaje</Text>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(messageData.status) },
              ]}
            >
              <Text style={styles.statusText}>
                {getStatusText(messageData.status)}
              </Text>
            </View>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Info de la mascota */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="paw" size={20} color="#4CAF50" />
              <Text style={styles.sectionTitle}>Mascota</Text>
            </View>
            <Text style={styles.petName}>{messageData.petName}</Text>
            <Text style={styles.submittedDate}>
              Solicitud enviada: {formatDate(messageData.submittedAt)}
            </Text>
          </View>

          {/* Datos personales */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="person" size={20} color="#2196F3" />
              <Text style={styles.sectionTitle}>Datos Personales</Text>
            </View>

            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>Nombre completo:</Text>
              <Text style={styles.fieldValue}>{messageData.fullName}</Text>
            </View>

            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>Email:</Text>
              <Text style={styles.fieldValue}>{messageData.email}</Text>
            </View>

            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>Teléfono:</Text>
              <Text style={styles.fieldValue}>{messageData.phone}</Text>
            </View>

            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>Dirección:</Text>
              <Text style={styles.fieldValue}>{messageData.address}</Text>
            </View>
          </View>

          {/* Situación familiar */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="home" size={20} color="#FF9800" />
              <Text style={styles.sectionTitle}>Situación Familiar</Text>
            </View>

            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>¿Tiene hijos?</Text>
              <Text style={styles.fieldValue}>{messageData.hasChildren}</Text>
            </View>

            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>¿Tiene mascotas?</Text>
              <Text style={styles.fieldValue}>{messageData.hasPets}</Text>
            </View>

            {messageData.petTypes && (
              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Tipos de mascotas:</Text>
                <Text style={styles.fieldValue}>{messageData.petTypes}</Text>
              </View>
            )}
          </View>

          {/* Vivienda */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="business" size={20} color="#9C27B0" />
              <Text style={styles.sectionTitle}>Vivienda</Text>
            </View>

            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>Tipo de vivienda:</Text>
              <Text style={styles.fieldValue}>{messageData.housingType}</Text>
            </View>

            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>Detalles:</Text>
              <Text style={styles.fieldValue}>
                {messageData.housingDetails}
              </Text>
            </View>

            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>¿Tiene patio?</Text>
              <Text style={styles.fieldValue}>{messageData.hasYard}</Text>
            </View>

            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>Tiempo disponible:</Text>
              <Text style={styles.fieldValue}>{messageData.availableTime}</Text>
            </View>
          </View>

          {/* Motivación */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="heart" size={20} color="#E91E63" />
              <Text style={styles.sectionTitle}>Motivación</Text>
            </View>

            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>¿Por qué quiere adoptar?</Text>
              <Text style={styles.fieldValueLong}>{messageData.reason}</Text>
            </View>

            {messageData.comments && (
              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Comentarios adicionales:</Text>
                <Text style={styles.fieldValueLong}>
                  {messageData.comments}
                </Text>
              </View>
            )}
          </View>

          {/* Botones de acción */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.approveButton}>
              <Ionicons name="checkmark-circle" size={20} color="white" />
              <Text style={styles.buttonText}>Aprobar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.rejectButton}>
              <Ionicons name="close-circle" size={20} color="white" />
              <Text style={styles.buttonText}>Rechazar</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.bottomSpacer} />
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: 20,
    paddingTop: 60,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2d3436",
    marginBottom: 8,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  statusText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2d3436",
    marginLeft: 8,
  },
  petName: {
    fontSize: 28,
    fontWeight: "800",
    color: "#4CAF50",
    marginBottom: 4,
  },
  submittedDate: {
    fontSize: 14,
    color: "#74b9ff",
    fontWeight: "500",
  },
  fieldRow: {
    marginBottom: 12,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#636e72",
    marginBottom: 4,
  },
  fieldValue: {
    fontSize: 16,
    color: "#2d3436",
    fontWeight: "500",
  },
  fieldValueLong: {
    fontSize: 16,
    color: "#2d3436",
    lineHeight: 22,
    fontWeight: "400",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
  },
  approveButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#4CAF50",
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  rejectButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F44336",
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
  bottomSpacer: {
    height: 40,
  },
});
