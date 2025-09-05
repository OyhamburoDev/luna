// components/PrimaryCTA.tsx
import React from "react";
import {
  Pressable,
  Text,
  StyleSheet,
  ViewStyle,
  StyleProp,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  onPress: () => void;
  /** "verMas" | "verDetalles" o un string personalizado */
  label?: "verMas" | "verDetalles" | string;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  fullWidth?: boolean; // si querés que ocupe todo el ancho
};

export default function PrimaryCTA({
  onPress,
  label = "verMas",
  style,
  disabled = false,
  fullWidth = false,
}: Props) {
  const title =
    label === "verMas"
      ? "Ver más"
      : label === "verDetalles"
      ? "Ver detalles"
      : label;

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.btn,
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
        pressed && styles.pressed,
        style,
      ]}
    >
      <Text style={styles.text}>{title}</Text>
      <Ionicons
        name="chevron-forward"
        size={18}
        color="#fff"
        style={styles.icon}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#667eea",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    // Sombra ligera
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  text: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  icon: { marginLeft: 6 },
  pressed: { opacity: 0.9 },
  disabled: { opacity: 0.6 },
  fullWidth: { alignSelf: "stretch" },
});
