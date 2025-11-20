import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
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
      {/* Foto con badge de corazón */}
      <View style={styles.photoContainer}>
        {notification.userPhoto ? (
          <Image
            source={{ uri: notification.userPhoto }}
            style={styles.userPhoto}
          />
        ) : (
          <View style={styles.userPhotoPlaceholder}>
            <Ionicons name="person" size={48} color="#999" />
          </View>
        )}

        {/* Badge de corazón en la esquina */}
        <View style={styles.heartBadge}>
          <Ionicons name="heart" size={24} color="#FFFFFF" />
        </View>
      </View>

      {/* Textos */}
      <Text style={styles.title}>¡Nueva actividad!</Text>
      <Text style={styles.subtitle}>{notification.subtitle}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  photoContainer: {
    position: "relative",
    marginBottom: 24,
  },
  userPhoto: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: "#F5F5F5",
  },
  userPhotoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
  },
  heartBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FF6B9D",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 24,
    color: "#000000",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: fonts.regular,
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 20,
  },
});
