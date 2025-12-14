import { StyleSheet } from "react-native";
import { fonts } from "./fonts";
import { normalizeFont } from "../utils/normalizeFont";

export const textStyles = StyleSheet.create({
  title: {
    fontFamily: fonts.bold,
    fontSize: normalizeFont(24),
  },
  subtitle: {
    fontFamily: fonts.semiBold,
    fontSize: normalizeFont(18),
  },
  body: {
    fontFamily: fonts.regular,
    fontSize: normalizeFont(16),
  },
  // Para los bottomtabs
  tabLabel: {
    fontFamily: "Nunito_600SemiBold", // 👈 fuente para las tabs
    fontSize: normalizeFont(11),
  },
  badge: {
    fontFamily: "Nunito_700Bold", // 👈 fuente más fuerte para el número
    fontSize: normalizeFont(12),
    color: "white",
  },
  // Para el modal
  modal: {
    fontFamily: fonts.bold,
    fontSize: normalizeFont(16),
  },
});
