import { MessageType } from "../types/messageType";

export const MOCK_MESSAGES: MessageType[] = [
  {
    id: "2",
    type: "Perdidos",
    title: "Nueva alerta: mascota perdida cerca tuyo",
    date: "5 ago",
    pet: "Zona: Av. Córdoba",
    color: "#ff6b6b", // Rojo
    icon: "alert-circle",
    isNew: true,
    isRead: false,
  },
  {
    id: "3",
    type: "Perdidos",
    title: "Usuario X te envió un mensaje",
    date: "4 ago",
    pet: "Mishi",
    color: "#667eea", // Azul
    icon: "chatbubble-ellipses",
    isNew: false,
    isRead: false,
  },
  {
    id: "4",
    type: "Sistema",
    title: "Tu publicación fue aprobada",
    date: "2 ago",
    pet: "Coco",
    color: "#43e97b", // Verde
    icon: "checkmark-done-circle",
    isNew: false,
    isRead: false,
  },
  {
    id: "5",
    type: "Sistema",
    title: "María respondió a tu mensaje",
    date: "1 ago",
    pet: "Luna",
    color: "#4facfe", // Azul claro
    icon: "chatbubble-ellipses",
    isNew: false,
    isRead: false,
  },
];
