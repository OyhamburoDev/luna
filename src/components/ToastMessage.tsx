import React, { useEffect, useRef } from "react";
import { Animated, View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { fonts } from "../theme/fonts";

type Props = {
  visible: boolean;
  onClose: () => void;
  message: string;
  type?: "success" | "error";
};

export default function ToastModal({
  visible,
  onClose,
  message,
  type = "success",
}: Props) {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        setTimeout(() => {
          Animated.timing(opacity, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }).start(onClose);
        }, 2500);
      });
    }
  }, [visible]);

  if (!visible) return null;

  const isError = type === "error";

  return (
    <Animated.View style={[styles.overlay, { opacity }]}>
      <View
        style={[
          styles.toastContainer,
          { backgroundColor: isError ? "#C62828" : "rgba(0,0,0,0.8)" }, // rojo o negro
        ]}
      >
        <Ionicons
          name={isError ? "alert-circle" : "checkmark-circle"}
          size={22}
          color="#fff"
        />
        <Text style={[styles.text, { fontFamily: fonts.semiBold }]}>
          {message}
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    bottom: 100,
    alignSelf: "center",
    alignItems: "center",
    width: "100%",
  },
  toastContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.8)",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 30,
    gap: 8,
    maxWidth: "90%", // 🔹 evita tocar los bordes laterales
  },
  text: {
    color: "#fff",
    fontSize: 15,
  },
});
