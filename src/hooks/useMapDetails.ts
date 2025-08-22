import { useState, useCallback } from "react";
import { Alert, Linking } from "react-native";
import { PetDetailData, ContactInfo, ReportData } from "../types/mapTypes";
import { petDetailMapService } from "../api/petDetailMapService";
import { contactService } from "../api/petDetailMapService";
import { reportService } from "../api/petDetailMapService";

export const useMapDetails = (currentUserId?: string) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState<PetDetailData | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar detalles completos de una mascota
  const loadPetDetails = useCallback(async (petId: string) => {
    try {
      setLoading(true);
      setError(null);

      // Simular delay de red
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Datos mock en lugar de fetch real
      const mockDetails = {
        id: petId,
        name: "Luna",
        species: "PERRO" as const,
        breed: "Golden Retriever",
        gender: "HEMBRA" as const,
        size: "GRANDE" as const,
        color: "Dorado",
        age: "3 años",
        hasCollar: true,
        description: "Muy cariñosa y juguetona. Se perdió cerca del parque.",
        images: [
          "https://images.unsplash.com/photo-1552053831-71594a27632d?w=400",
          "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400",
        ],
        status: "PERDIDO" as const,
        location: "Palermo, Buenos Aires",
        detailedLocation: "Cerca de Plaza Serrano",
        reportedAt: new Date().toISOString(),
        lastSeenAt: new Date().toISOString(),
        coordinates: { lat: -34.6037, lng: -58.3816 },
        contactInfo: {
          phone: "+5491122334455",
          whatsapp: "+5491122334455",
          preferredContact: "whatsapp" as const,
        },
        reporter: {
          id: "user123",
          name: "María González",
          joinedDate: "2023",
          reportsCount: 3,
          rating: 4.8,
          isVerified: true,
        },
        isActive: true,
        tags: ["urgente", "recompensa"],
        urgencyLevel: 4 as const,
      };

      setSelectedDetail(mockDetails);
      setModalVisible(true);
    } catch (err) {
      setError("Error al cargar los detalles");
      Alert.alert("Error", "No se pudieron cargar los detalles de la mascota");
    } finally {
      setLoading(false);
    }
  }, []);

  // Cerrar modal
  const closeModal = useCallback(() => {
    setModalVisible(false);
    setSelectedDetail(null);
    setError(null);
  }, []);

  // Manejar contacto con el reportador
  const handleContact = useCallback(
    async (contactInfo: ContactInfo) => {
      try {
        switch (contactInfo.type) {
          case "phone":
            const phoneUrl = `tel:${contactInfo.value}`;
            const canOpenPhone = await Linking.canOpenURL(phoneUrl);
            if (canOpenPhone) {
              await Linking.openURL(phoneUrl);
              // Registrar intento de contacto
              await contactService.logContactAttempt(contactInfo);
            } else {
              Alert.alert("Error", "No se puede realizar la llamada");
            }
            break;

          case "whatsapp":
            const whatsappUrl = `whatsapp://send?phone=${contactInfo.value}`;
            const canOpenWhatsApp = await Linking.canOpenURL(whatsappUrl);
            if (canOpenWhatsApp) {
              await Linking.openURL(whatsappUrl);
              await contactService.logContactAttempt(contactInfo);
            } else {
              Alert.alert("Error", "WhatsApp no está instalado");
            }
            break;

          case "message":
            // Abrir chat interno de la app
            await contactService.createContactRequest({
              petId: contactInfo.petId,
              toUserId: contactInfo.value,
              fromUserId: currentUserId!,
              message:
                "Hola, vi tu publicación sobre la mascota. ¿Podemos conversar?",
              contactType: contactInfo.type, // Usar el tipo que ya viene
            });
            Alert.alert(
              "Solicitud enviada",
              "Se ha enviado tu solicitud de contacto"
            );
            break;
        }
      } catch (error) {
        Alert.alert("Error", "No se pudo establecer el contacto");
      }
    },
    [currentUserId]
  );

  // Manejar reportes
  const handleReport = useCallback(
    async (reportData: ReportData) => {
      try {
        await reportService.createReport({
          ...reportData,
          reportedBy: currentUserId!,
          createdAt: new Date().toISOString(),
          status: "pending",
        });

        Alert.alert(
          "Reporte enviado",
          "Gracias por tu reporte. Nuestro equipo lo revisará pronto."
        );
      } catch (error) {
        Alert.alert("Error", "No se pudo enviar el reporte");
      }
    },
    [currentUserId]
  );

  // Verificar si el usuario actual es el dueño de la publicación
  const isOwner = useCallback(
    (petId: string): boolean => {
      return selectedDetail?.reporter.id === currentUserId;
    },
    [selectedDetail, currentUserId]
  );

  // Manejar compartir publicación
  const handleShare = useCallback(
    async (petId: string) => {
      try {
        const shareUrl = `https://tuapp.com/pet/${petId}`;
        const message = selectedDetail
          ? `${
              selectedDetail.status === "PERDIDO"
                ? "Mascota perdida"
                : "Avistamiento"
            }: ${selectedDetail.name || selectedDetail.species} en ${
              selectedDetail.location
            }`
          : "Mira esta publicación de mascota";

        // Usar Share API nativo o implementar modal personalizado
        Alert.alert("Compartir", "¿Cómo quieres compartir esta publicación?", [
          { text: "Cancelar", style: "cancel" },
          {
            text: "WhatsApp",
            onPress: () =>
              Linking.openURL(`whatsapp://send?text=${message} ${shareUrl}`),
          },
          {
            text: "Copiar enlace",
            onPress: () => {
              // Implementar copia al clipboard
              Alert.alert(
                "Enlace copiado",
                "El enlace se ha copiado al portapapeles"
              );
            },
          },
        ]);
      } catch (error) {
        Alert.alert("Error", "No se pudo compartir la publicación");
      }
    },
    [selectedDetail]
  );

  return {
    modalVisible,
    selectedDetail,
    loading,
    error,
    loadPetDetails,
    closeModal,
    handleContact,
    handleReport,
    handleShare,
    isOwner,
  };
};
