import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useIsFocused, useFocusEffect } from "@react-navigation/native";
import { fonts } from "../theme/fonts";
import { useAuthModalContext } from "../contexts/AuthModalContext";
import { useAuthStore } from "../store/auth";
import { AuthRequiredView } from "../components/ProfileComponents/AuthRequiredView";
import { useEffect, useMemo, useCallback } from "react";
import { notificationsService } from "../api/notificationsService"; // ajusta la ruta
import { useUserNotifications } from "../hooks/useUserNotifications";
import { AdoptionNotificationsList } from "../components/AdoptionNotificationsList";
import { useNotificationsStore } from "../store/notificationsStore";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/RootNavigator";
import { navigationRef } from "../navigation/NavigationService";

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "NotificationDetail"
>;

// Mock data para las notificaciones
// const MOCK_NOTIFICATIONS = [
//   {
//     id: "1",
//     type: "adoption_request",
//     icon: "heart-circle",
//     iconColor: "#FF6B9D",
//     title: "Solicitudes de adopción",
//     message: "Carlos Mendez ha solicitado adoptar a Luna",
//     timestamp: "5 min",
//     userImage: "https://i.pravatar.cc/150?img=12",
//     unread: true,
//   },
//   {
//     id: "2",
//     type: "adoption_request",
//     icon: "heart-circle",
//     iconColor: "#FF6B9D",
//     title: "Solicitudes de adopción",
//     message: "María González ha solicitado adoptar a Max",
//     timestamp: "1 h",
//     userImage: "https://i.pravatar.cc/150?img=45",
//     unread: true,
//   },
//   {
//     id: "3",
//     type: "lost_pet_alert",
//     icon: "location",
//     iconColor: "#FF8C42",
//     title: "Alerta de mascota perdida",
//     message: "Tu mascota fue vista cerca de Av. Córdoba",
//     timestamp: "2 h",
//     userImage: null,
//     unread: true,
//   },
//   {
//     id: "4",
//     type: "lost_pet_found",
//     icon: "paw",
//     iconColor: "#4ECDC4",
//     title: "Mascota encontrada",
//     message: "Ana Torres cree haber encontrado tu mascota",
//     timestamp: "3 h",
//     userImage: "https://i.pravatar.cc/150?img=32",
//     unread: false,
//   },
//   {
//     id: "5",
//     type: "like",
//     icon: "heart",
//     iconColor: "#FF6B9D",
//     title: "Actividad",
//     message: "A Pedro y 12 personas más les gustó tu publicación de Rocky",
//     timestamp: "5 h",
//     userImage: "https://i.pravatar.cc/150?img=8",
//     unread: false,
//   },
//   {
//     id: "6",
//     type: "system",
//     icon: "notifications",
//     iconColor: "#A78BFA",
//     title: "Notificaciones del sistema",
//     message: "Actualización: Nuevas funciones disponibles",
//     timestamp: "1 d",
//     userImage: null,
//     unread: false,
//   },
//   {
//     id: "7",
//     type: "adoption_request",
//     icon: "heart-circle",
//     iconColor: "#FF6B9D",
//     title: "Solicitudes de adopción",
//     message: "Luis Ramírez ha solicitado adoptar a Bella",
//     timestamp: "2 d",
//     userImage: "https://i.pravatar.cc/150?img=15",
//     unread: false,
//   },
//   {
//     id: "8",
//     type: "lost_pet_alert",
//     icon: "location",
//     iconColor: "#FF8C42",
//     title: "Alerta de mascota perdida",
//     message: "Usuario reportó haber visto a Milo en Parque Centenario",
//     timestamp: "3 d",
//     userImage: "https://i.pravatar.cc/150?img=25",
//     unread: false,
//   },
// ];

export default function NotificationsScreen() {
  // const renderNotificationItem = (
  //   notification: (typeof MOCK_NOTIFICATIONS)[0]
  // ) => {
  //   return (
  //     <TouchableOpacity
  //       key={notification.id}
  //       style={[
  //         styles.notificationItem,
  //         notification.unread && styles.notificationItemUnread,
  //       ]}
  //       activeOpacity={0.7}
  //     >
  //       <View style={styles.notificationContent}>
  //         {/* Avatar o Icono */}
  //         <View style={styles.avatarContainer}>
  //           {notification.userImage ? (
  //             <Image
  //               source={{ uri: notification.userImage }}
  //               style={styles.avatar}
  //             />
  //           ) : (
  //             <View
  //               style={[
  //                 styles.iconContainer,
  //                 { backgroundColor: `${notification.iconColor}20` },
  //               ]}
  //             >
  //               <Ionicons
  //                 name={notification.icon as any}
  //                 size={24}
  //                 color={notification.iconColor}
  //               />
  //             </View>
  //           )}
  //           {/* Badge de tipo de notificación */}
  //           <View
  //             style={[
  //               styles.typeBadge,
  //               { backgroundColor: notification.iconColor },
  //             ]}
  //           >
  //             <Ionicons
  //               name={notification.icon as any}
  //               size={12}
  //               color="#FFFFFF"
  //             />
  //           </View>
  //         </View>

  //         {/* Contenido de texto */}
  //         <View style={styles.textContainer}>
  //           <Text style={styles.notificationTitle} numberOfLines={1}>
  //             {notification.title}
  //           </Text>
  //           <Text style={styles.notificationMessage} numberOfLines={2}>
  //             {notification.message}
  //           </Text>
  //         </View>

  //         {/* Timestamp y indicador de no leído */}
  //         <View style={styles.rightContainer}>
  //           <Text style={styles.timestamp}>{notification.timestamp}</Text>
  //           {notification.unread && <View style={styles.unreadDot} />}
  //         </View>
  //       </View>
  //     </TouchableOpacity>
  //   );
  // };
  const { isAuthenticated } = useAuthStore();
  const { openModal } = useAuthModalContext();
  const { notifications, loading, error, refetch } = useUserNotifications();
  const isFocused = useIsFocused();
  const navigation = useNavigation<NavigationProp>();

  const [activeTab, setActiveTab] = useState<"all" | "adoptions" | "alerts">(
    "all"
  );

  const filteredNotifications = useMemo(() => {
    if (activeTab === "all") {
      return notifications;
    } else if (activeTab === "adoptions") {
      return notifications.filter((n) => n.type === "adoption_request");
    } else if (activeTab === "alerts") {
      return notifications.filter(
        (n) => n.type === "like" || n.type === "system"
      );
    }
    return notifications;
  }, [notifications, activeTab]);

  useFocusEffect(
    React.useCallback(() => {
      if (!isAuthenticated) {
        setTimeout(() => {
          openModal();
        }, 100);
      }
    }, [isAuthenticated, openModal])
  );

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [])
  );

  if (!isAuthenticated) {
    return (
      <AuthRequiredView
        title="Notificaciones"
        icon="lock-closed"
        description=" Inicia sesión para ver tus notificaciones"
        buttonLabel="Iniciar sesión"
      />
    );
  }

  return (
    <>
      {isFocused && (
        <StatusBar style="dark" translucent backgroundColor="transparent" />
      )}
      <SafeAreaView style={styles.container} edges={["top"]}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Notificaciones</Text>
          {/* <TouchableOpacity style={styles.searchButton}>
            <Ionicons name="search-outline" size={24} color="#ba4a4aff" />
          </TouchableOpacity> */}
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={activeTab === "all" ? styles.tabActive : styles.tab}
            onPress={() => setActiveTab("all")}
          >
            <Text
              style={
                activeTab === "all" ? styles.tabTextActive : styles.tabText
              }
            >
              Todas
            </Text>
            {activeTab === "all" && <View style={styles.tabIndicator} />}
          </TouchableOpacity>

          <TouchableOpacity
            style={activeTab === "adoptions" ? styles.tabActive : styles.tab}
            onPress={() => setActiveTab("adoptions")}
          >
            <Text
              style={
                activeTab === "adoptions"
                  ? styles.tabTextActive
                  : styles.tabText
              }
            >
              Adopciones
            </Text>
            {activeTab === "adoptions" && <View style={styles.tabIndicator} />}
          </TouchableOpacity>

          <TouchableOpacity
            style={activeTab === "alerts" ? styles.tabActive : styles.tab}
            onPress={() => setActiveTab("alerts")}
          >
            <Text
              style={
                activeTab === "alerts" ? styles.tabTextActive : styles.tabText
              }
            >
              Alertas
            </Text>
            {activeTab === "alerts" && <View style={styles.tabIndicator} />}
          </TouchableOpacity>
        </View>

        {/* Lista de notificaciones */}
        {/* <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {MOCK_NOTIFICATIONS.map((notification) =>
            renderNotificationItem(notification)
          )}
        </ScrollView> */}

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <AdoptionNotificationsList
            notifications={filteredNotifications}
            onPressItem={(notification) => {
              if (navigationRef.isReady()) {
                navigationRef.navigate("NotificationDetail", { notification });
              }
            }}
          />
        </ScrollView>
      </SafeAreaView>
    </>
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
  headerTitle: {
    fontFamily: fonts.bold,
    fontSize: 20,
    color: "#000000",
  },
  searchButton: {
    padding: 4,
  },
  tabsContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingTop: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  tab: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    marginRight: 8,
  },
  tabActive: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    marginRight: 8,
    position: "relative",
  },
  tabText: {
    fontFamily: fonts.bold,
    fontSize: 15,
    fontWeight: "500",
    color: "#8E8E93",
  },
  tabTextActive: {
    fontFamily: fonts.bold,
    fontSize: 15,

    color: "#000000",
  },
  tabIndicator: {
    position: "absolute",
    bottom: 0,
    left: 16,
    right: 16,
    height: 2,
    backgroundColor: "#000000",
    borderRadius: 1,
  },
  scrollView: {
    flex: 1,
  },
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
