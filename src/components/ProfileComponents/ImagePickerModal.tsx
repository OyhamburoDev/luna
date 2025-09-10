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
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { textStyles } from "../../theme/textStyles";

type Props = {
  visible: boolean;
  onClose: () => void;
  onTakePhoto: () => void;
  onPickFromGallery: () => void;
  onViewPhoto: () => void;
  hasPhoto: boolean;
};

export const ImagePickerModal = ({
  visible,
  onClose,
  onTakePhoto,
  onPickFromGallery,
  onViewPhoto,
  hasPhoto,
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
        {/* Backdrop absoluto para que no afecte el layout */}
        <Pressable style={styles.backdrop} onPress={onClose} />

        {/* ESTE es el ÚNICO contenedor que pinta el fondo y tiene el radius */}
        <View style={[styles.sheet, { paddingBottom: bottomPad }]}>
          <TouchableOpacity style={styles.option} onPress={onTakePhoto}>
            <Text style={[styles.optionText, textStyles.modal]}>
              Hacer una foto
            </Text>
          </TouchableOpacity>

          <View style={styles.separatorBtn} />

          <TouchableOpacity style={styles.option} onPress={onPickFromGallery}>
            <Text style={[styles.optionText, textStyles.modal]}>
              Seleccionar de la galería
            </Text>
          </TouchableOpacity>

          <View style={styles.separatorBtn} />

          {hasPhoto && (
            <TouchableOpacity style={styles.option} onPress={onViewPhoto}>
              <Text style={[styles.optionText, textStyles.modal]}>
                Ver foto
              </Text>
            </TouchableOpacity>
          )}

          <View style={styles.separator} />

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
  // ÚNICO contenedor con fondo + radios + overflow
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
