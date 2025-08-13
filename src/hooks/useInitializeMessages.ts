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

  useEffect(() => {
    if (!isAuthenticated) return;

    const loadMessages = async () => {
      try {
        console.log("🔄 Inicializando mensajes...");
        setLoading(true);

        // 1️⃣ Traer datos de Firebase
        const adoptionResponse = await AdoptionService.getAdoptionRequests();
        console.log("📥 Datos de Firebase:", adoptionResponse);

        // 2️⃣ Guardar datos originales para el modal
        setOriginalData(adoptionResponse);

        // 3️⃣ Transformar datos de Firebase a formato UI
        const adoptionMessages: MessageType[] = adoptionResponse.map(
          (req: any) => ({
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

  // Este hook no retorna nada, solo inicializa datos en background
};
