"use client";

import { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import {
  useRoute,
  useNavigation,
  type RouteProp,
} from "@react-navigation/native";
import type { RootStackParamList } from "../navigation/RootNavigator";
import { fonts } from "../theme/fonts";
import { useNotificationsStore } from "../store/notificationsStore";
import { AdoptionRequestDetail } from "../components/notificationComponents/AdoptionRequestDetail";
import { LikeNotificationDetail } from "../components/notificationComponents/LikeNotificationDetail";
import { SystemNotificationDetail } from "../components/notificationComponents/SystemNotificationDetail";

type NotificationDetailRouteProp = RouteProp<
  RootStackParamList,
  "NotificationDetail"
>;

export default function NotificationDetailScreen() {
  const route = useRoute<NotificationDetailRouteProp>();
  const navigation = useNavigation();
  const { notification } = route.params;

  const markAsRead = useNotificationsStore((state) => state.markAsRead);

  useEffect(() => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
  }, []);

  useEffect(() => {
    console.log("📋 Datos de la notificación:", notification);
  }, []);

  const renderContent = () => {
    switch (notification.type) {
      case "adoption_request":
        return (
          <AdoptionRequestDetail
            notification={notification}
            onGoBack={() => navigation.goBack()}
          />
        );

      case "like":
        return (
          <LikeNotificationDetail
            notification={notification}
            onGoBack={() => navigation.goBack()}
          />
        );

      case "system":
        return (
          <SystemNotificationDetail
            notification={notification}
            onGoBack={() => navigation.goBack()}
          />
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView
      style={styles.container}
      edges={["top", "left", "right", "bottom"]}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalle</Text>
        <View style={{ width: 40 }} />
      </View>

      {notification.type === "adoption_request" ? (
        renderContent()
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {renderContent()}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "#E5E5E5",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontFamily: fonts.bold,
    fontSize: 18,
    color: "#000000",
  },
  moreButton: {
    padding: 4,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
});
