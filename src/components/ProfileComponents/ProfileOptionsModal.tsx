import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  StyleSheet as RNStyleSheet,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { textStyles } from "../../theme/textStyles";

type Props = {
  visible: boolean;
  onClose: () => void; // cierra el modal (Cancelar o backdrop)
  onEditProfile: () => void; // tu lógica ya existente
  onCloseAccount: () => void; // tu lógica ya existente
};

export const ProfileOptionsModal = ({
  visible,
  onClose,
  onEditProfile,
  onCloseAccount,
}: Props) => {
  const insets = useSafeAreaInsets();
  const bottomPad = Math.max(insets.bottom, 16);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        {/* Backdrop */}
        <Pressable style={styles.backdrop} onPress={onClose} />

        {/* Sheet */}
        <View style={[styles.sheet, { paddingBottom: bottomPad }]}>
          {/* Editar perfil */}
          <TouchableOpacity style={styles.option} onPress={onEditProfile}>
            <Text style={[styles.optionText, textStyles.modal]}>
              Editar perfil
            </Text>
          </TouchableOpacity>

          <View style={styles.separatorBtn} />

          {/* Cerrar cuenta */}
          <TouchableOpacity style={styles.option} onPress={onCloseAccount}>
            <Text
              style={[styles.optionText, styles.dangerText, textStyles.modal]}
            >
              Cerrar cuenta
            </Text>
          </TouchableOpacity>

          <View style={styles.separator} />

          {/* Cancelar */}
          <TouchableOpacity style={styles.cancelOption} onPress={onClose}>
            <Text style={[textStyles.modal, styles.cancelText]}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "transparent",
  },
  backdrop: {
    ...RNStyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  sheet: {
    width: "100%",
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden",
    borderRadius: 20,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    // Removido paddingBottom: 24 porque ahora es dinámico
  },
  option: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  optionText: {
    fontSize: 16,
    color: "#000000ff",
    fontWeight: "500",
  },
  dangerText: {
    color: "#ff6b6b", // rojo sutil para "Cerrar cuenta"
  },
  separatorBtn: {
    height: 1,
    backgroundColor: "#0000000b",
  },
  separator: {
    height: 8,
    backgroundColor: "#0000000b",
  },
  cancelOption: {
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelText: {
    fontSize: 16,
    color: "#00000080",
    fontWeight: "500",
  },
});
