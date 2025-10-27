import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../navigation/RootNavigator";
import { fonts } from "../theme/fonts";
import { useNotificationsStore } from "../store/notificationsStore";

type NotificationDetailRouteProp = RouteProp<
  RootStackParamList,
  "NotificationDetail"
>;

export default function NotificationDetailScreen() {
  const route = useRoute<NotificationDetailRouteProp>();
  const navigation = useNavigation();
  const { notification } = route.params;

  const markAsRead = useNotificationsStore((state) => state.markAsRead);

  // Marcar como leída al abrir
  useEffect(() => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
  }, []);

  const renderContent = () => {
    switch (notification.type) {
      case "adoption_request":
        return (
          <View style={styles.content}>
            <View style={styles.iconContainer}>
              <Ionicons name="paw" size={48} color="#4ECDC4" />
            </View>
            <Text style={styles.title}>Solicitud de Adopción</Text>
            <Text style={styles.subtitle}>{notification.subtitle}</Text>

            <View style={styles.infoBox}>
              <Text style={styles.infoText}>
                Esta solicitud está pendiente de revisión. Puedes aceptarla o
                rechazarla desde tu panel de solicitudes.
              </Text>
            </View>

            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.buttonText}>Volver</Text>
            </TouchableOpacity>
          </View>
        );

      case "like":
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

            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.buttonText}>Volver</Text>
            </TouchableOpacity>
          </View>
        );

      case "system":
        return (
          <View style={styles.content}>
            <View style={styles.iconContainer}>
              <Ionicons
                name={notification.icon as any}
                size={48}
                color={notification.color}
              />
            </View>
            <Text style={styles.title}>{notification.title}</Text>
            <Text style={styles.subtitle}>{notification.subtitle}</Text>

            <View style={styles.infoBox}>
              <Text style={styles.infoText}>
                Esta es una notificación del sistema para mantenerte informado.
              </Text>
            </View>

            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.buttonText}>Entendido</Text>
            </TouchableOpacity>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
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

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {renderContent()}
      </ScrollView>
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
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontFamily: fonts.bold,
    fontSize: 18,
    color: "#000000",
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
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
