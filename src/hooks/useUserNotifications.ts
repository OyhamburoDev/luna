// hooks/useUserNotifications.js
import { useState, useEffect } from "react";
import { notificationsService } from "../api/notificationsService";
import { AdoptionFormData } from "../types/forms";
import { AppNotification } from "../types/notifications";
import { useNotificationsStore } from "../store/notificationsStore";

export const useUserNotifications = () => {
  const setNotifications = useNotificationsStore(
    (state) => state.setNotifications
  );
  const notifications = useNotificationsStore((state) => state.notifications);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);

      const userNotifications =
        await notificationsService.getUserNotification();

      setNotifications(userNotifications);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(String(err));
      }
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return {
    notifications,
    loading,
    error,
    refetch: fetchNotifications, // Opcional: para recargar
  };
};
