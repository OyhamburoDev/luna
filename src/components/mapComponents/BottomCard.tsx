import React, { useState, useRef } from "react";
import { View } from "react-native";
import { BottomCardMini } from "./BottomCard/BottomCardMini";
import { BottomCardRuta } from "./BottomCard/BottomCardRuta";
import { BottomCardBuscar } from "./BottomCard/BottomCardBuscar";
import { BottomCardBuscarUbicacion } from "./BottomCard/BottomCardBuscarUbicacion";
import { BottomCardCrear } from "./BottomCard/BottomCardCrear";
import { useReportForm } from "../../hooks/useReportForm";
import { useAuthModal } from "../../hooks/useAuthModal";
import { PinForm } from "../../types/mapTypes";
import ToastMessage from "../ToastMessage";
import { createPinService } from "../../api/createPinService";
import { useAuthModalContext } from "../../contexts/AuthModalContext";
import { useAuthStore } from "../../store/auth";

type CardState = "MINI" | "CREAR" | "BUSCAR" | "RUTA" | "BUSCAR_UBICACION";

interface BottomCardProps {
  state: CardState;
  onChangeState: (newState: CardState) => void;
  selectedPin?: any;
  onLocationSelect?: (lat: number, lng: number, name: string) => void;
  routeInfo?: {
    distance: number;
    duration: number;
    destinationName: string;
  } | null;
  onPublishReport?: (reportData: PinForm) => void;
  currentLocation?: { lat: number; lng: number; address: string };
  onClearSearchLocation?: () => void;
  onClearReportLocation?: () => void;
  searchedLocation?: { lat: number; lng: number; name: string } | null;
  currentUserId?: string;
}

export const BottomCard: React.FC<BottomCardProps> = ({
  state,
  onChangeState,
  onLocationSelect,
  routeInfo,
  onPublishReport,
  currentLocation,
  onClearReportLocation,
  onClearSearchLocation,
  searchedLocation,
  currentUserId,
}) => {
  // Hook para manejar el formulario de reporte
  const reportForm = useReportForm(currentLocation);

  // Hook para manejar autenticación
  const authModal = useAuthModal();
  const { requireAuth } = useAuthModalContext();

  // Estado para el toast de errores
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [showErrorToast, setShowErrorToast] = useState(false);

  const handlePublish = async () => {
    requireAuth(async () => {
      const resultado = reportForm.submitForm();

      if (resultado.success && resultado.data) {
        try {
          const userId = useAuthStore.getState().user?.uid;

          if (!userId) {
            throw new Error("No se pudo obtener el ID del usuario");
          }

          // Validar límite diario
          const canCreate = await createPinService.canUserCreatePin(userId);
          if (!canCreate) {
            setErrorMessage("Ya creaste un pin hoy. Podés crear otro mañana.");
            setShowErrorToast(true);
            return;
          }

          await createPinService.createPin({
            ...resultado.data,
            userId: userId,
          });

          onPublishReport?.(resultado.data);
          reportForm.resetForm();
          onChangeState("MINI");
        } catch (error) {
          setErrorMessage("Error al guardar el reporte.");
          setShowErrorToast(true);
        }
      } else if (!resultado.success && resultado.error) {
        setErrorMessage(resultado.error);
        setShowErrorToast(true);
      }
    });
  };

  // ========== ESTADO RUTA ==========
  if (state === "RUTA") {
    return <BottomCardRuta routeInfo={routeInfo} />;
  }

  // ========== ESTADO BUSCAR_UBICACION ==========
  if (state === "BUSCAR_UBICACION") {
    return (
      <BottomCardBuscarUbicacion
        onLocationSelect={(lat, lng, address) => {
          reportForm.setSelectedLocation({ lat, lng, address });
          onLocationSelect?.(lat, lng, address);
        }}
        onBack={() => onChangeState("CREAR")}
        onConfirm={() => onChangeState("CREAR")}
      />
    );
  }

  // ========== ESTADO CREAR ==========
  if (state === "CREAR") {
    return (
      <>
        <BottomCardCrear
          currentLocation={currentLocation}
          selectedLocation={reportForm.selectedLocation}
          selectedType={reportForm.selectedType}
          onTypeChange={reportForm.setSelectedType}
          selectedImageUri={reportForm.selectedImageUri}
          generatedPinUri={reportForm.generatedPinUri}
          onSelectPhoto={reportForm.handleSelectPhoto}
          description={reportForm.detailedDescription}
          onDescriptionChange={reportForm.setDetailedDescription}
          pinRef={reportForm.pinRef}
          onClose={() => {
            reportForm.resetForm();
            onClearReportLocation?.();
            onChangeState("MINI");
          }}
          onSearchLocationPress={() => onChangeState("BUSCAR_UBICACION")}
          onPublishReport={onPublishReport!}
          animalName={reportForm.animalName}
          onAnimalNameChange={reportForm.setAnimalName}
          shortDescription={reportForm.shortDescription}
          onShortDescriptionChange={reportForm.setShortDescription}
          handlePublish={handlePublish}
        />
        <ToastMessage
          visible={showErrorToast}
          onClose={() => setShowErrorToast(false)}
          message={errorMessage}
          type="error"
        />
      </>
    );
  }

  // ========== ESTADO BUSCAR ==========
  if (state === "BUSCAR") {
    return (
      <BottomCardBuscar
        onLocationSelect={onLocationSelect!}
        onBack={() => onChangeState("MINI")}
      />
    );
  }

  // ========== ESTADO MINI ==========
  return (
    <BottomCardMini
      onSearchFocus={() => onChangeState("BUSCAR")}
      onReportPress={() => onChangeState("CREAR")}
      searchedLocation={searchedLocation}
      onClearSearchLocation={onClearSearchLocation}
    />
  );
};
