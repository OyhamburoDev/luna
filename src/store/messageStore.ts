import { create } from "zustand";
import { MessageType } from "../types/messageType"; // ← Importar el tipo original

interface MessageStore {
  // Estados
  realRequests: MessageType[];
  originalData: any[]; // Para el modal (datos crudos de Firebase)
  unreadCount: number;
  loading: boolean;

  // Acciones
  setRealRequests: (messages: MessageType[]) => void;
  setOriginalData: (data: any[]) => void;
  setUnreadCount: (count: number) => void;
  setLoading: (loading: boolean) => void;

  // Acción para marcar como leído (ahora recibe mockMessages)
  markAsRead: (messageId: string, mockMessages: MessageType[]) => void;

  // Acción para obtener todos los mensajes (reales + mock)
  getAllMessages: (mockMessages: MessageType[]) => MessageType[];

  // Acción para actualizar contador automáticamente
  updateUnreadCount: (mockMessages: MessageType[]) => void;
}

export const useMessageStore = create<MessageStore>((set, get) => ({
  // Estados iniciales
  realRequests: [],
  originalData: [],
  unreadCount: 0,
  loading: false,

  // Setters básicos
  setRealRequests: (messages) => {
    set({ realRequests: messages });
    // NO auto-actualizar aquí, lo haremos desde el componente
  },

  setOriginalData: (data) => set({ originalData: data }),
  setUnreadCount: (count) => set({ unreadCount: count }),
  setLoading: (loading) => set({ loading }),

  // Marcar mensaje como leído
  markAsRead: (messageId, mockMessages: MessageType[]) => {
    set((state) => ({
      realRequests: state.realRequests.map((msg) =>
        msg.id === messageId ? { ...msg, isRead: true, isNew: false } : msg
      ),
    }));

    // Auto-actualizar contador con los mockMessages reales
    const state = get();
    const allMessages = [...state.realRequests, ...mockMessages];
    const unread = allMessages.filter((msg) => !msg.isRead).length;
    set({ unreadCount: unread });
  },

  // Obtener todos los mensajes combinados
  getAllMessages: (mockMessages) => {
    const state = get();
    return [...state.realRequests, ...mockMessages];
  },

  // Actualizar contador de no leídos
  updateUnreadCount: (mockMessages) => {
    const state = get();
    const allMessages = [...state.realRequests, ...mockMessages];
    const unread = allMessages.filter((msg) => !msg.isRead).length;
    set({ unreadCount: unread });
  },
}));
