import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Pressable,
} from "react-native";
import { navigate } from "../navigation/NavigationService";
import type { PetPost } from "../types/petPots";
import { fonts } from "../theme/fonts";

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
      ownerId: pet.ownerId,
      ownerName: pet.ownerName,
    });
  };

  return (
    <View style={styles.overlay}>
      <Pressable style={styles.overlayPressable} onPress={onCancel}>
        <View style={styles.modal}>
          <Text style={[{ fontFamily: fonts.bold }, styles.title]}>
            ¿Querés adoptar a {pet.petName}?
          </Text>

          <Text style={[{ fontFamily: fonts.semiBold }, styles.description]}>
            Estás a punto de iniciar una solicitud de adopción.
          </Text>

          <View style={styles.buttons}>
            <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
              <Text style={[{ fontFamily: fonts.semiBold }, styles.cancelText]}>
                Cancelar
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.confirmButton}
              onPress={goToFormAdoption}
            >
              <Text
                style={[{ fontFamily: fonts.semiBold }, styles.confirmText]}
              >
                Confirmar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Pressable>
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
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  overlayPressable: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    width: "75%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
  },
  title: {
    fontSize: 17,
    color: "#2d3436",
    textAlign: "center",
    marginBottom: 6,
  },
  description: {
    fontSize: 13,
    color: "#636e72",
    textAlign: "center",
    marginBottom: 20,
  },
  buttons: {
    flexDirection: "row",
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "#f1f3f4",
    alignItems: "center",
  },
  cancelText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#636e72",
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "#667eea", // Color azul conservado
    alignItems: "center",
  },
  confirmText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#fff",
  },
});
