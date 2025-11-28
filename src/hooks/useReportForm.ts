// hooks/useReportForm.ts
import { useState, useRef } from "react";
import { View } from "react-native";
import { pickAndProcessImage, generatePinImage } from "../utils/imageProcessor";

export const useReportForm = (currentLocation?: { lat: number; lng: number }) => {
  // Estados del formulario
  const [selectedType, setSelectedType] = useState<
    "PERDIDO" | "AVISTADO" | "ENCONTRADO" | null
  >(null);

  const [animalName, setAnimalName] = useState<string>("");
  const [shortDescription, setShortDescription] = useState<string>("");
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);
  const [generatedPinUri, setGeneratedPinUri] = useState<string | null>(null);
  const [detailedDescription, setDetailedDescription] = useState("");

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
    setAnimalName("");
    setShortDescription("");
    setSelectedImageUri(null);
    setGeneratedPinUri(null);
    setDetailedDescription("");
    setSelectedLocation(null);
  };

  const submitForm = () => {
    // Validar selectedType
    if (!selectedType) {
      return {
        success: false,
        error: "Por favor seleccioná el tipo de reporte",
      };
    }

    // Validar animalName
    if (!animalName.trim()) {
      return {
        success: false,
        error: "Por favor completá el nombre o especie del animal",
      };
    }

    // Validar shortDescription
    if (!shortDescription.trim()) {
      return { success: false, error: "Por favor agregá un rasgo distintivo" };
    }

    // Validar description
    if (!detailedDescription.trim()) {
      return { success: false, error: "Por favor agregá una descripción" };
    }

    // Validar selectedImageUri
    if (!selectedImageUri) {
      return { success: false, error: "Por favor subí una foto" };
    }

    // Validar generatedPinUri
    if (!generatedPinUri) {
      return {
        success: false,
        error: "Error procesando la foto, intenta de nuevo",
      };
    }

    // Si todo está bien, retornar los datos
    return {
      success: true,
      data: {
        type: selectedType,
        animalName,
        shortDescription,
        detailedDescription,
        pinImageUri: generatedPinUri,
        photoUri: selectedImageUri,
        location: (selectedLocation || currentLocation) as {
          lat: number;
          lng: number;
          address: string;
        },
      },
    };
  };

  return {
    // Estados
    selectedType,
    selectedImageUri,
    generatedPinUri,
    detailedDescription,
    selectedLocation,
    pinRef,
    animalName,
    shortDescription,

    // Setters
    setSelectedType,
    setDetailedDescription,
    setSelectedLocation,
    setAnimalName,
    setShortDescription,

    // Funciones
    submitForm,
    handleSelectPhoto,
    resetForm,
  };
};
