import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from "react-native";
import { fonts } from "../theme/fonts";

type Props = {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  petName: string;
};

export default function DeletePostModal({
  visible,
  onClose,
  onConfirm,
  petName,
}: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.modal}>
          <Text style={[{ fontFamily: fonts.bold }, styles.title]}>
            ¿Eliminar publicación?
          </Text>

          <Text style={[{ fontFamily: fonts.semiBold }, styles.description]}>
            Se eliminará "{petName}" permanentemente
          </Text>

          <View style={styles.buttons}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={[{ fontFamily: fonts.semiBold }, styles.cancelText]}>
                Cancelar
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.deleteButton} onPress={onConfirm}>
              <Text style={[{ fontFamily: fonts.semiBold }, styles.deleteText]}>
                Eliminar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    width: "75%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
  },
  iconContainer: {
    alignSelf: "center",
    marginBottom: 16,
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
  deleteButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "#ff6b6b",
    alignItems: "center",
  },
  deleteText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#fff",
  },
});
