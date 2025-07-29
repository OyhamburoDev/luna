import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { navigate } from "../navigation/NavigationService";
import type { PetPost } from "../types/petPots";

const { width, height } = Dimensions.get("window");

type Props = {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  pet: PetPost | null;
};

export default function AdoptionConfirmModal({
  visible,
  onCancel,
  onConfirm,
  pet,
}: Props) {
  if (!visible || !pet) return null;

  const goToFormAdoption = () => {
    onConfirm();
    navigate("AdoptionFormPet", {
      petId: pet.id,
      petName: pet.petName,
    });
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.modalContent}>
        <Text style={styles.title}>¿Querés adoptar a {pet.petName}?</Text>
        <Text style={styles.subtitle}>
          Estás a punto de iniciar una solicitud de adopción.
        </Text>

        <View style={styles.buttonsRow}>
          <TouchableOpacity onPress={onCancel} style={styles.cancelButton}>
            <Text style={styles.cancelText}>Cancelar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={goToFormAdoption}
            style={styles.confirmButton}
          >
            <Text style={styles.confirmText}>Confirmar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width,
    height,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  modalContent: {
    backgroundColor: "white",
    width: width * 0.8,
    padding: 24,
    borderRadius: 20,
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    color: "#2d3436",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#636e72",
    marginBottom: 24,
  },
  buttonsRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: "#f1f3f4",
  },
  cancelText: {
    color: "#636e72",
    fontWeight: "600",
  },
  confirmButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: "#667eea",
  },
  confirmText: {
    color: "white",
    fontWeight: "700",
  },
});
