import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppNotification } from "../types/notifications";
import { fonts } from "../theme/fonts";
import DefaultAvatar from "../../assets/media/avatars/default-avatar.jpg";

type Props = {
  notifications: AppNotification[];
  onPressItem?: (notification: AppNotification) => void;
};

export const AdoptionNotificationsList = ({
  notifications,
  onPressItem,
}: Props) => {
  return (
    <>
      {notifications.map((notification) => (
        <TouchableOpacity
          key={notification.id}
          style={[
            styles.notificationItem,
            !notification.read && styles.notificationItemUnread,
          ]}
          activeOpacity={0.7}
          onPress={() => onPressItem?.(notification)}
        >
          <View style={styles.notificationContent}>
            {/* Avatar o icono */}
            <View style={styles.avatarContainer}>
              {notification.userImage ? (
                <Image
                  source={
                    notification.userImage
                      ? { uri: notification.userImage }
                      : DefaultAvatar
                  }
                  style={styles.avatar}
                />
              ) : (
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: `${notification.color}20` },
                  ]}
                >
                  <Ionicons
                    name={notification.icon as any}
                    size={24}
                    color={notification.color}
                  />
                </View>
              )}
              {/* Badge de tipo de notificación */}
              <View
                style={[
                  styles.typeBadge,
                  { backgroundColor: notification.color },
                ]}
              >
                <Ionicons
                  name={notification.icon as any}
                  size={12}
                  color="#FFFFFF"
                />
              </View>
            </View>

            {/* Texto */}
            <View style={styles.textContainer}>
              <Text style={styles.notificationTitle} numberOfLines={1}>
                {notification.title}
              </Text>
              <Text style={styles.notificationMessage} numberOfLines={2}>
                {notification.subtitle}
              </Text>
            </View>

            {/* Timestamp y dot no leído */}
            <View style={styles.rightContainer}>
              <Text style={styles.timestamp}>
                {notification.createdAt.toLocaleTimeString()}
              </Text>
              {!notification.read && <View style={styles.unreadDot} />}
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </>
  );
};

const styles = StyleSheet.create({
  notificationItem: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
  },
  notificationItemUnread: {
    backgroundColor: "#F9FAFB",
  },
  notificationContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarContainer: {
    position: "relative",
    marginRight: 12,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#E5E5E5",
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: "center",
    alignItems: "center",
  },
  typeBadge: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  textContainer: {
    flex: 1,
    marginRight: 8,
  },
  notificationTitle: {
    fontFamily: fonts.bold,
    fontSize: 13,
    color: "#8E8E93",
    marginBottom: 2,
  },
  notificationMessage: {
    fontFamily: fonts.semiBold,
    fontSize: 14,
    color: "#000000b4",
    lineHeight: 20,
  },
  rightContainer: {
    alignItems: "flex-end",
    justifyContent: "flex-start",
    minWidth: 40,
  },
  timestamp: {
    fontFamily: fonts.semiBold,
    fontSize: 13,
    fontWeight: "400",
    color: "#8E8E93",
    marginBottom: 4,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FF6B9D",
    marginTop: 4,
  },
});
