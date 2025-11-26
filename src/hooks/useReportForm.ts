// hooks/useReportForm.ts
import { useState, useRef } from "react";
import { View } from "react-native";
import { pickAndProcessImage, generatePinImage } from "../utils/imageProcessor";

export const useReportForm = () => {
  // Estados del formulario
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

  // Función para seleccionar y procesar la foto
  const handleSelectPhoto = async () => {
    if (!selectedType) {
      console.warn("Debe seleccionar un tipo primero");
      return;
    }

    // Calcular color del borde según el tipo
    const borderColor =
      selectedType === "PERDIDO"
        ? "#ef4444"
        : selectedType === "AVISTADO"
        ? "#3b82f6"
        : "#10b981";

    // Seleccionar y procesar imagen
    const uri = await pickAndProcessImage(borderColor);

    if (uri) {
      setSelectedImageUri(uri);

      // Generar pin después de un delay
      setTimeout(async () => {
        const pinUri = await generatePinImage(uri, borderColor, pinRef);
        if (pinUri) {
          setGeneratedPinUri(pinUri);
          console.log("✅ Pin generado:", pinUri);
        }
      }, 1000);
    }
  };

  // Limpiar todos los campos del formulario
  const resetForm = () => {
    setSelectedType(null);
    setSelectedImageUri(null);
    setGeneratedPinUri(null);
    setDescription("");
    setSelectedLocation(null);
  };

  return {
    // Estados
    selectedType,
    selectedImageUri,
    generatedPinUri,
    description,
    selectedLocation,
    pinRef,

    // Setters
    setSelectedType,
    setDescription,
    setSelectedLocation,

    // Funciones
    handleSelectPhoto,
    resetForm,
  };
};
