import { useAuthModalContext } from "../contexts/AuthModalContext";
import { useFocusEffect } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
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
import { StatusBar } from "react-native";
import { MOCK_MESSAGES } from "../data/mockMessages";
import { MessageType } from "../types/messageType";
import { AdoptionService } from "../api/adoptionServiceApplication";
import { useAuthStore } from "../store/auth";
import AdoptionModalMessage from "../components/AdoptionModalMessage";
import { Pressable } from "react-native";
import { useMessageStore } from "../store/messageStore";
import { useInitializeMessages } from "../hooks/useInitializeMessages";

const { width } = Dimensions.get("window");

const FILTERS = ["Todos", "Adopciones", "Perdidos", "Sistema"];

// 👇 Componente para mostrar cuando no está autenticado
const AuthRequiredView = () => {
  const { openModal } = useAuthModalContext();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffffff" />

      {/* Header igual que el original */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <View style={styles.titleIconContainer}>
            <Ionicons name="mail" size={24} color="#667eea" />
          </View>
          <Text style={styles.title}>Mensajes</Text>
        </View>
      </View>

      {/* Vista de autenticación requerida */}
      <View style={styles.authRequiredContainer}>
        <View style={styles.authRequiredContent}>
          <Ionicons name="lock-closed" size={64} color="#667eea" />
          <Text style={styles.authRequiredTitle}>
            Inicia sesión para ver tus mensajes
          </Text>
          <Text style={styles.authRequiredSubtitle}>
            Conecta con personas que quieren adoptar o dar en adopción mascotas
          </Text>

          <Pressable
            style={styles.authRequiredButton}
            onPress={() => openModal("login")}
          >
            <Text style={styles.authRequiredButtonText}>Iniciar sesión</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default function ChatsScreen() {
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
          openModal("login");
        }, 100);
      }
    }, [isAuthenticated, openModal])
  );

  // 👇 Si no está autenticado, mostrar vista especial
  if (!isAuthenticated) {
    return <AuthRequiredView />;
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
      <StatusBar barStyle="dark-content" backgroundColor="#ffffffff" />
      <SafeAreaView style={styles.container}>
        {/* Header igual */}
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <View style={styles.titleIconContainer}>
              <Ionicons name="mail" size={24} color="#667eea" />
            </View>
            <Text style={styles.title}>Mensajes</Text>
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
    backgroundColor: "white",
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 15,
    backgroundColor: "#ffffffff",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  titleIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#667eea15",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#2d3436",
  },
  filtersScroll: {
    minHeight: 80,
    maxHeight: 80,
    paddingBottom: 20,
  },
  filtersContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  filterButton: {
    backgroundColor: "white",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: "#ffffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    alignSelf: "center",
  },
  filterButtonFirst: {
    marginLeft: 4,
  },
  filterButtonActive: {
    backgroundColor: "#667eea",
    borderColor: "#667eea",
    shadowColor: "#667eea",
    shadowOpacity: 0.3,
  },
  filterText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#636e72",
  },
  filterTextActive: {
    color: "white",
  },
  messagesList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  messageCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    borderLeftWidth: 4, // ← AGREGAR SIEMPRE
    borderLeftColor: "transparent", // ← TRANSPARENTE por defecto
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    position: "relative",
  },
  messageCardNew: {
    borderLeftWidth: 4,
    borderLeftColor: "#f093fb",
    shadowColor: "#f093fb",
    shadowOpacity: 0.1,
  },
  newIndicator: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#f093fb",
  },
  messageHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  messageContent: {
    flex: 1,
  },
  messageTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2d3436",
    lineHeight: 22,
    marginBottom: 8,
  },
  messageFooter: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
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
    color: "#f093fb",
    fontWeight: "600",
    marginLeft: 4,
  },
  separator: {
    height: 12,
  },
  // 👇 Estilos para la vista de autenticación requerida
  authRequiredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  authRequiredContent: {
    alignItems: "center",
    maxWidth: 300,
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
    borderRadius: 12,
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
