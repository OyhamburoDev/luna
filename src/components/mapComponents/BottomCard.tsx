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
  // ========== ESTADOS PARA EL FORMULARIO DE CREAR ==========
  const [selectedType, setSelectedType] = useState<
    "PERDIDO" | "AVISTADO" | "ENCONTRADO" | null
  >(null);

  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);
  const [generatedPinUri, setGeneratedPinUri] = useState<string | null>(null);
  const [description, setDescription] = useState("");

  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
    address: string;
  } | null>(null);

  const pinRef = useRef<View>(null);

  // ========== ESTADO RUTA ==========
  if (state === "RUTA") {
    return <BottomCardRuta routeInfo={routeInfo} />;
  }

  // ========== ESTADO BUSCAR_UBICACION ==========
  if (state === "BUSCAR_UBICACION") {
    return (
      <BottomCardBuscarUbicacion
        onLocationSelect={(lat, lng, address) => {
          setSelectedLocation({ lat, lng, address });
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
        selectedLocation={selectedLocation}
        selectedType={selectedType}
        onTypeChange={setSelectedType}
        selectedImageUri={selectedImageUri}
        generatedPinUri={generatedPinUri}
        onSelectPhoto={async () => {
          const borderColor =
            selectedType === "PERDIDO"
              ? "#ef4444"
              : selectedType === "AVISTADO"
              ? "#3b82f6"
              : "#10b981";

          const uri = await pickAndProcessImage(borderColor);
          if (uri) {
            setSelectedImageUri(uri);

            setTimeout(async () => {
              const pinUri = await generatePinImage(uri, borderColor, pinRef);
              if (pinUri) {
                setGeneratedPinUri(pinUri);
                console.log("✅ Pin generado:", pinUri);
              }
            }, 1000);
          }
        }}
        description={description}
        onDescriptionChange={setDescription}
        pinRef={pinRef}
        onClose={() => {
          setSelectedType(null);
          setSelectedImageUri(null);
          setGeneratedPinUri(null);
          setDescription("");
          setSelectedLocation(null);
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
