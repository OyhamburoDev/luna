import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { fonts } from "../../theme/fonts";
import { AppNotification } from "../../types/notifications";

type Props = {
  notification: AppNotification;
  onGoBack: () => void;
};

export const LikeNotificationDetail = ({ notification, onGoBack }: Props) => {
  return (
    <View style={styles.content}>
      {notification.userPhoto && (
        <Image
          source={{ uri: notification.userPhoto }}
          style={styles.userPhoto}
        />
      )}
      <View style={styles.iconContainer}>
        <Ionicons name="heart" size={48} color="#FF6B9D" />
      </View>
      <Text style={styles.title}>¡Nueva actividad!</Text>
      <Text style={styles.subtitle}>{notification.subtitle}</Text>

      <TouchableOpacity style={styles.button} onPress={() => onGoBack()}>
        <Text style={styles.buttonText}>Volver</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  userPhoto: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 16,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 24,
    color: "#000000",
    textAlign: "center",
    marginBottom: 12,
  },
  subtitle: {
    fontFamily: fonts.regular,
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 32,
  },
  infoBox: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 16,
    marginBottom: 32,
    width: "100%",
  },
  infoText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: "#666666",
    textAlign: "center",
    lineHeight: 20,
  },
  button: {
    backgroundColor: "#000000",
    paddingVertical: 14,
    paddingHorizontal: 48,
    borderRadius: 24,
  },
  buttonText: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: "#FFFFFF",
  },
});
