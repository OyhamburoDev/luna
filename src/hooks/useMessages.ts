import { useState, useEffect } from "react";
import { AdoptionService } from "../api/adoptionServiceApplication";
import { AdoptionFormDataWithId } from "../types/forms";

export const useMessages = () => {
  const [adoptionRequests, setAdoptionRequests] = useState<
    AdoptionFormDataWithId[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ Función que agrega tipo y color automáticamente
  const addMessageType = (messages: any[], type: string) => {
    const colorMap: { [key: string]: string } = {
      adoption: "#4CAF50",
      lost_pet: "#ff6b6b",
      system: "#2196F3",
    };

    return messages.map((msg: any) => ({
      ...msg,
      type,
      color: colorMap[type],
    }));
  };

  const fetchAdoptionRequests = async () => {
    try {
      const realRequests = await AdoptionService.getAdoptionRequests();
      setAdoptionRequests(realRequests);
    } catch (err) {
      console.error("Error loading adoption requests:", err);
    }
  };

  // ✅ Solo solicitudes de adopción por ahora
  const allMessages = addMessageType(adoptionRequests, "adoption");

  const fetchAllMessages = async () => {
    try {
      setLoading(true);
      await fetchAdoptionRequests();
    } catch (err) {
      setError("Error al cargar mensajes");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllMessages();
  }, []);

  return {
    messages: allMessages,
    adoptionRequests,
    loading,
    error,
    refetch: fetchAllMessages,
  };
};
