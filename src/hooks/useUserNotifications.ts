// hooks/useUserNotifications.js
import { useState, useEffect } from "react";
import { notificationsService } from "../api/notificationsService";
import { AdoptionFormData } from "../types/forms";
import { AppNotification } from "../types/notifications";

export const useUserNotifications = () => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);

      const userNotifications =
        await notificationsService.getUserNotification();
      console.log("Datos que devuelve el servicio:", userNotifications);
      setNotifications(userNotifications);
      console.log(
        "🔹 Estado notifications después de setNotifications:",
        userNotifications
      );
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

  console.log("🔹 Hook retorna notifications:", notifications);

  return {
    notifications,
    loading,
    error,
    refetch: fetchNotifications, // Opcional: para recargar
  };
};
