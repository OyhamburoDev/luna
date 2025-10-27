import { create } from "zustand";
import { AppNotification } from "../types/notifications";

interface NotificationsStore {
  // Estado
  notifications: AppNotification[];
  unreadCount: number;
  loading: boolean;

  // Acciones
  setNotifications: (notifications: AppNotification[]) => void;
  markAsRead: (notificationId: string) => void;
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
  markAsRead: (notificationId) => {
    set((state) => ({
      notifications: state.notifications.map((notif) =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      ),
    }));
    // Actualizar contador
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
