import React, { useState, useRef } from "react";
import { View } from "react-native";
import { BottomCardMini } from "./BottomCard/BottomCardMini";
import { BottomCardRuta } from "./BottomCard/BottomCardRuta";
import { BottomCardBuscar } from "./BottomCard/BottomCardBuscar";
import { BottomCardBuscarUbicacion } from "./BottomCard/BottomCardBuscarUbicacion";
import { BottomCardCrear } from "./BottomCard/BottomCardCrear";
import {
  pickAndProcessImage,
  generatePinImage,
} from "../../utils/imageProcessor";
import { useReportForm } from "../../hooks/useReportForm";

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
  onPublishReport?: (reportData: {
    type: "PERDIDO" | "AVISTADO" | "ENCONTRADO";
    pinImageUri: string;
    photoUri: string;
    description: string;
    location: { lat: number; lng: number; address: string };
  }) => void;
  currentLocation?: { lat: number; lng: number };
  onClearSearchLocation?: () => void;
  onClearReportLocation?: () => void;
}

export const BottomCard: React.FC<BottomCardProps> = ({
  state,
  onChangeState,
  onLocationSelect,
  routeInfo,
  onPublishReport,
  currentLocation,
  onClearReportLocation,
}) => {
  // Hook para manejar el formulario de reporte
  const reportForm = useReportForm();

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
      <BottomCardCrear
        currentLocation={currentLocation}
        selectedLocation={reportForm.selectedLocation}
        selectedType={reportForm.selectedType}
        onTypeChange={reportForm.setSelectedType}
        selectedImageUri={reportForm.selectedImageUri}
        generatedPinUri={reportForm.generatedPinUri}
        onSelectPhoto={reportForm.handleSelectPhoto}
        description={reportForm.description}
        onDescriptionChange={reportForm.setDescription}
        pinRef={reportForm.pinRef}
        onClose={() => {
          reportForm.resetForm();
          onClearReportLocation?.();
          onChangeState("MINI");
        }}
        onSearchLocationPress={() => onChangeState("BUSCAR_UBICACION")}
        onPublishReport={onPublishReport!}
      />
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
    />
  );
};
