import { useEffect } from "react";
import { useMessageStore } from "../store/messageStore";
import { useAuthStore } from "../store/auth";
import { AdoptionService } from "../api/adoptionServiceApplication";
import { MOCK_MESSAGES } from "../data/mockMessages"; // Importar los mocks
import { MessageType } from "../types/messageType";

export const useInitializeMessages = () => {
  // Obtener funciones del store
  const setRealRequests = useMessageStore((state) => state.setRealRequests);
  const setOriginalData = useMessageStore((state) => state.setOriginalData);
  const updateUnreadCount = useMessageStore((state) => state.updateUnreadCount);
  const setLoading = useMessageStore((state) => state.setLoading);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const removeMessage = useMessageStore((state) => state.removeMessage);

  useEffect(() => {
    if (!isAuthenticated) return;

    const loadMessages = async () => {
      try {
        console.log("🔄 Inicializando mensajes...");
        setLoading(true);

        // 1️⃣ Traer datos de Firebase
        const adoptionResponse = await AdoptionService.getAdoptionRequests();
        console.log("📥 Datos de Firebase:", adoptionResponse);
        console.log("Cantidad de objetos:", adoptionResponse.length);

        // 2️⃣ Guardar datos originales para el modal
        setOriginalData(adoptionResponse);

        // 3️⃣ Transformar datos de Firebase a formato UI
        const adoptionMessages: MessageType[] = adoptionResponse.map(
          (req: any) => ({
            id: req.id,
            title: `${req.fullName} te envió una solicitud de adopción `,
            pet: req.petName,
            date: "Hace 2h",
            color: "#f093fb",
            icon: "paw",
            isNew: true,
            isRead: false,
            type: "Adopciones",
          })
        );

        // 4️⃣ Guardar mensajes en el store (esto auto-actualiza el contador)
        setRealRequests(adoptionMessages);

        // 5️⃣ Actualizar contador con mock incluido
        updateUnreadCount(MOCK_MESSAGES);

        console.log("✅ Mensajes inicializados correctamente");
      } catch (error) {
        console.error("❌ Error inicializando mensajes:", error);
        // En caso de error, resetear todo
        setRealRequests([]);
        setOriginalData([]);
        updateUnreadCount(MOCK_MESSAGES);
      } finally {
        setLoading(false);
      }
    };

    loadMessages();
  }, [isAuthenticated]); // Dependencia del estado de auth

  const deleteMessage = async (messageId: string) => {
    try {
      console.log("🗑️ Eliminando mensaje:", messageId);

      // 1. Eliminar de Firebase
      await AdoptionService.deleteAdoptionRequest(messageId);

      // 2. Actualizar store (quitar de la lista local)
      removeMessage(messageId); // ← USAR la función del store

      console.log("✅ Mensaje eliminado");
    } catch (error) {
      console.error("❌ Error eliminando mensaje:", error);
    }
  };

  return { deleteMessage };
};
