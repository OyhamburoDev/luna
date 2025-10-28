import { create } from "zustand";
import { AppNotification } from "../types/notifications";
import { notificationsService } from "../api/notificationsService";

interface NotificationsStore {
  // Estado
  notifications: AppNotification[];
  unreadCount: number;
  loading: boolean;

  // Acciones
  setNotifications: (notifications: AppNotification[]) => void;
  markAsRead: (notificationId: string) => void;
  removeNotification: (notificationId: string) => void;
  updateUnreadCount: () => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
}

export const useNotificationsStore = create<NotificationsStore>((set, get) => ({
  // Estado inicial
  notifications: [],
  unreadCount: 0,
  loading: false,

  // Setear notificaciones y actualizar contador automáticamente
  setNotifications: (notifications) => {
    set({ notifications });
    const unread = notifications.filter((n) => !n.read).length;
    set({ unreadCount: unread });
  },

  // Marcar como leída
  markAsRead: async (notificationId) => {
    try {
      // 1. Actualizar localmente
      set((state) => ({
        notifications: state.notifications.map((notif) =>
          notif.id === notificationId ? { ...notif, read: true } : notif
        ),
      }));

      // 2. Actualizar en Firebase
      await notificationsService.markAsRead(notificationId);

      // 3. Actualizar contador
      get().updateUnreadCount();
    } catch (error) {
      console.error("Error marcando como leída:", error);
    }
  },

  // Eliminar notificación
  removeNotification: (notificationId) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== notificationId),
    }));
    get().updateUnreadCount();
  },

  // Actualizar contador de no leídas
  updateUnreadCount: () => {
    const state = get();
    const unread = state.notifications.filter((n) => !n.read).length;
    set({ unreadCount: unread });
  },

  // Loading
  setLoading: (loading) => set({ loading }),

  // Reset (al hacer logout)
  reset: () =>
    set({
      notifications: [],
      unreadCount: 0,
      loading: false,
    }),
}));
