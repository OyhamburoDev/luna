"use client";

import { useAuthModalContext } from "../contexts/AuthModalContext";
import { useFocusEffect } from "@react-navigation/native";
import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import { MOCK_MESSAGES } from "../data/mockMessages";
import type { MessageType } from "../types/messageType";
import { useAuthStore } from "../store/auth";
import AdoptionModalMessage from "../components/AdoptionModalMessage";
import { Pressable } from "react-native";
import { useMessageStore } from "../store/messageStore";
import { useInitializeMessages } from "../hooks/useInitializeMessages";
import { AuthRequiredView } from "../components/ProfileComponents/AuthRequiredView";
import { StatusBar } from "expo-status-bar";
import { useIsFocused } from "@react-navigation/native";

const { width } = Dimensions.get("window");

const FILTERS = ["Todos", "Adopciones", "Perdidos", "Sistema"];

export default function ChatsScreen() {
  const isFocused = useIsFocused();
  const { isAuthenticated } = useAuthStore();
  const { openModal } = useAuthModalContext();

  const [selectedFilter, setSelectedFilter] = useState("Todos");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<any>(null);

  // 🔥 TODO desde el store
  const realRequests = useMessageStore((state) => state.realRequests);
  const originalData = useMessageStore((state) => state.originalData);
  const loading = useMessageStore((state) => state.loading);
  const markAsRead = useMessageStore((state) => state.markAsRead);
  const getAllMessages = useMessageStore((state) => state.getAllMessages);

  // 🔥 Usar el hook para inicializar (solo al entrar a la pantalla)
  useInitializeMessages();

  // 👇 Abrir modal automáticamente cuando entra sin autenticación
  useFocusEffect(
    React.useCallback(() => {
      if (!isAuthenticated) {
        setTimeout(() => {
          openModal();
        }, 100);
      }
    }, [isAuthenticated, openModal])
  );

  // 👇 Si no está autenticado, mostrar vista especial
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

  const handleMessagePress = (item: MessageType) => {
    if (item.type === "Adopciones") {
      // Buscar datos originales en el store
      const realData = originalData.find((req: any) => req.id === item.id);

      const dataWithReadStatus = {
        ...realData,
        isRead: item.isRead,
      };

      setSelectedMessage(dataWithReadStatus);
      setModalVisible(true);
    }
  };

  const closeModal = () => {
    if (selectedMessage) {
      // 🔥 Marcar como leído usando el store Y pasar MOCK_MESSAGES
      markAsRead(selectedMessage.id, MOCK_MESSAGES);
    }

    setModalVisible(false);
    setSelectedMessage(null);
  };

  // 🔥 Obtener todos los mensajes del store
  const allMessages = getAllMessages(MOCK_MESSAGES);

  // Filtrar usando la lista combinada
  const filteredMessages =
    selectedFilter === "Todos"
      ? allMessages
      : allMessages.filter((msg) => msg.type === selectedFilter);

  const renderMessage = ({ item }: { item: MessageType }) => {
    return (
      <View style={{ backgroundColor: "white", margin: 2 }}>
        <Pressable
          style={({ pressed }) => [
            styles.messageCard,
            item.isNew && styles.messageCardNew,
            pressed && { opacity: 0.8 },
          ]}
          onPress={() => handleMessagePress(item)}
        >
          {item.isNew && <View style={styles.newIndicator} />}

          <View style={styles.messageHeader}>
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: `${item.color}15` },
              ]}
            >
              <Ionicons name={item.icon as any} size={20} color={item.color} />
            </View>
            <View style={styles.messageContent}>
              <Text style={styles.messageTitle} numberOfLines={2}>
                {item.title}
              </Text>
              <View style={styles.messageFooter}>
                <Ionicons name="time-outline" size={12} color="#74b9ff" />
                <Text style={styles.messageDate}>{item.date}</Text>
                <View style={styles.petContainer}>
                  <Ionicons name="paw-outline" size={12} color="#43e97b" />
                  <Text style={styles.petName}>{item.pet}</Text>
                </View>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#ddd" />
          </View>
        </Pressable>
      </View>
    );
  };

  return (
    <>
      {isFocused && (
        <StatusBar style="dark" translucent backgroundColor="transparent" />
      )}
      <SafeAreaView style={styles.container}>
        {/* Header igual */}
        <View style={styles.header}>
          <View style={styles.headerBackground} />
          <View style={styles.titleContainer}>
            <View style={styles.titleIconContainer}>
              <Ionicons name="notifications" size={24} color="white" />
            </View>
            <Text style={styles.title}>Notificaciones</Text>
          </View>
        </View>

        {/* Filtros igual */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContainer}
          style={styles.filtersScroll}
        >
          {FILTERS.map((filter, index) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterButton,
                selectedFilter === filter && styles.filterButtonActive,
                index === 0 && styles.filterButtonFirst,
              ]}
              onPress={() => setSelectedFilter(filter)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.filterText,
                  selectedFilter === filter && styles.filterTextActive,
                ]}
              >
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Lista de mensajes */}
        <FlatList
          data={filteredMessages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />

        <AdoptionModalMessage
          visible={modalVisible}
          onClose={closeModal}
          messageData={selectedMessage}
        />
      </SafeAreaView>
    </>
  );
}

// ✅ Estilos quedan exactamente iguales
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff", // Changed from gray to clean white background
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 10,
    backgroundColor: "transparent",
    position: "relative",
  },
  headerBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#667eea", // Removed opacity for cleaner look
    opacity: 0.08, // Much more subtle background
    borderBottomLeftRadius: 16, // Reduced border radius for less dramatic effect
    borderBottomRightRadius: 16,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    zIndex: 1,
  },
  titleIconContainer: {
    width: 40, // Slightly smaller icon container
    height: 40,
    borderRadius: 20,
    backgroundColor: "#667eea", // Solid color instead of transparent overlay
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    shadowColor: "#667eea",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 26, // Slightly smaller title
    fontWeight: "700", // Less bold for more professional look
    color: "#2d3436", // Dark text instead of white for better readability
  },
  filtersScroll: {
    minHeight: 80, // Reduced height for more compact design
    maxHeight: 80,
    paddingBottom: 15,
    paddingTop: 10,
  },
  filtersContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  filterButton: {
    backgroundColor: "white",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginRight: 12,
    borderWidth: 1,
    borderColor: "#e9ecef",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    alignSelf: "center",
  },
  filterButtonFirst: {
    marginLeft: 4,
  },
  filterButtonActive: {
    backgroundColor: "#667eea",
    borderColor: "#667eea",
    shadowColor: "#667eea",
    shadowOpacity: 0.25,
    transform: [{ scale: 1.05 }],
  },
  filterText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#636e72",
  },
  filterTextActive: {
    color: "white",
    fontWeight: "700",
  },
  messagesList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  messageCard: {
    backgroundColor: "white",
    borderRadius: 16, // Slightly less rounded for more professional look
    padding: 16, // Reduced padding for more compact cards
    borderLeftWidth: 3, // Thinner accent border
    borderLeftColor: "transparent",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 }, // Reduced shadow for subtlety
    shadowOpacity: 0.06, // Much lighter shadow
    shadowRadius: 8,
    elevation: 2, // Lower elevation for less dramatic effect
    position: "relative",
    borderWidth: 1,
    borderColor: "#f1f3f4",
  },
  messageCardNew: {
    borderLeftWidth: 4,
    borderLeftColor: "#ff6b6b",
    shadowColor: "#ff6b6b",
    shadowOpacity: 0.15,
    borderColor: "#ff6b6b20",
  },
  newIndicator: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#ff6b6b",
    shadowColor: "#ff6b6b",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  messageHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  messageContent: {
    flex: 1,
  },
  messageTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2d3436",
    lineHeight: 22,
    marginBottom: 10,
  },
  messageFooter: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginTop: 4,
  },
  messageDate: {
    fontSize: 12,
    color: "#74b9ff",
    fontWeight: "600",
    marginLeft: 4,
    marginRight: 12,
  },
  petContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  petName: {
    fontSize: 12,
    color: "#43e97b",
    fontWeight: "600",
    marginLeft: 4,
  },
  separator: {
    height: 16,
  },
  // 👇 Estilos para la vista de autenticación requerida
  authRequiredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    backgroundColor: "#ffffff", // White background instead of gray
  },
  authRequiredContent: {
    alignItems: "center",
    maxWidth: 300,
    backgroundColor: "white",
    padding: 28, // Slightly reduced padding
    borderRadius: 20, // Less rounded for professional look
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 }, // Reduced shadow
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4, // Lower elevation
    borderWidth: 1, // Added subtle border
    borderColor: "#f1f3f4",
  },
  authRequiredTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2d3436",
    textAlign: "center",
    marginTop: 24,
    marginBottom: 12,
  },
  authRequiredSubtitle: {
    fontSize: 16,
    color: "#636e72",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 32,
  },
  authRequiredButton: {
    backgroundColor: "#667eea",
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 16,
    shadowColor: "#667eea",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  authRequiredButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
  },
});
