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

const { width } = Dimensions.get("window");

const FILTERS = ["Todos", "Adopciones", "Perdidos", "Sistema"];

export default function ChatsScreen() {
  const [selectedFilter, setSelectedFilter] = useState("Todos");
  const [realRequests, setRealRequests] = useState<MessageType[]>([]);
  const [loading, setLoading] = useState(false);

  // Para el modal
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [respAdoptionModal, setRespAdoptionModal] = useState<any[]>([]); // ← TIPAR

  // Para contar mensajes no leídos
  const setUnreadCount = useMessageStore((state) => state.setUnreadCount);

  useEffect(() => {
    const getObject = async () => {
      try {
        setLoading(true);
        const adoptionResponse = await AdoptionService.getAdoptionRequests();

        setRespAdoptionModal(adoptionResponse);

        // ✅ CONVERTIR a formato de mensaje para tu UI
        const adoptionMessages: MessageType[] = adoptionResponse.map(
          (req: any) => ({
            // ← AGREGAR TIPO
            id: req.id,
            title: `Solicitud para ${req.petName}`,
            pet: req.petName,
            date: "Hace 2h",
            color: "#4CAF50",
            icon: "heart",
            isNew: true,
            isRead: false,
            type: "Adopciones",
          })
        );

        console.log("Mensajes de adopción:", adoptionMessages); // ← AGREGAR ESTO

        // Solo adopciones por ahora
        setRealRequests(adoptionMessages);
      } catch (error) {
        console.error("Error al obtener datos:", error);
      } finally {
        setLoading(false);
      }
    };

    getObject();
  }, []);

  // ✅ Calcular mensajes no leídos
  useEffect(() => {
    const combined = [...realRequests, ...MOCK_MESSAGES];
    const unread = combined.filter((msg) => !msg.isRead).length;
    setUnreadCount(unread);
    console.log("🔴 Mensajes no leídos:", unread); // ← Para ver si funciona
  }, [realRequests]); // ← Se ejecuta cuando cambien los datos de Firebase

  const handleMessagePress = (item: MessageType) => {
    if (item.type === "Adopciones") {
      const realData = respAdoptionModal.find((req: any) => req.id === item.id);

      // ✅ AGREGAR isRead a los datos del modal
      const dataWithReadStatus = {
        ...realData,
        isRead: item.isRead,
      };

      setSelectedMessage(dataWithReadStatus);
      setModalVisible(true);
    }
    // Otros tipos comentados por ahora
  };

  const closeModal = () => {
    if (selectedMessage) {
      // ✅ MOVER la lógica acá:
      setRealRequests((prev) =>
        prev.map((msg) =>
          msg.id === selectedMessage.id
            ? { ...msg, isRead: true, isNew: false }
            : msg
        )
      );
    }

    setModalVisible(false);
    setSelectedMessage(null);
  };

  // ✅ COMBINAR datos reales + mock
  const allMessages = [...realRequests, ...MOCK_MESSAGES];

  // ✅ FILTRAR usando la lista combinada
  const filteredMessages =
    selectedFilter === "Todos"
      ? allMessages
      : allMessages.filter((msg) => msg.type === selectedFilter);

  const renderMessage = ({ item }: { item: MessageType }) => {
    console.log("Debug:", item.title, "isNew:", item.isNew);

    return (
      <View style={{ backgroundColor: "white", margin: 2 }}>
        <Pressable
          style={({ pressed }) => [
            styles.messageCard,
            item.isNew && styles.messageCardNew,
            pressed && { opacity: 0.8 },
            ,
          ]}
          onPress={() => handleMessagePress(item)}
        >
          {/* Resto del render igual */}
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
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <View style={styles.titleIconContainer}>
              <Ionicons name="mail" size={24} color="#667eea" />
            </View>
            <Text style={styles.title}>Mensajes</Text>
          </View>
        </View>

        {/* Filtros */}
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
});
