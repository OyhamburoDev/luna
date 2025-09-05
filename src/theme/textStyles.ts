import { StyleSheet } from "react-native";
import { fonts } from "./fonts";

export const textStyles = StyleSheet.create({
  title: {
    fontFamily: fonts.bold,
    fontSize: 24,
  },
  subtitle: {
    fontFamily: fonts.semiBold,
    fontSize: 18,
  },
  body: {
    fontFamily: fonts.regular,
    fontSize: 16,
  },
  // Para los bottomtabs
  tabLabel: {
    fontFamily: "Nunito_600SemiBold", // 👈 fuente para las tabs
    fontSize: 11,
  },
  badge: {
    fontFamily: "Nunito_700Bold", // 👈 fuente más fuerte para el número
    fontSize: 12,
    color: "white",
  },
  // Para el modal
  modal: {
    fontFamily: fonts.bold,
    fontSize: 16,
  },
});
