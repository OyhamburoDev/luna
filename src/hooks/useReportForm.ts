// hooks/useReportForm.ts
import { useState, useRef } from "react";
import { View } from "react-native";
import { pickAndProcessImage, generatePinImage } from "../utils/imageProcessor";

const VALIDATIONS = {
  animalName: {
    minLength: 2,
    maxLength: 50,
    regex: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, // Solo letras y espacios
  },
  shortDescription: {
    minLength: 3,
    maxLength: 100,
  },
  detailedDescription: {
    minLength: 10,
    maxLength: 500,
  },
};

export const useReportForm = (currentLocation?: {
  lat: number;
  lng: number;
}) => {
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

  // Función helper para detectar spam
  const isSpam = (text: string): boolean => {
    // Detectar repetición excesiva del mismo carácter (ej: "aaaaaaa")
    const repeatedChar = /(.)\1{4,}/;
    if (repeatedChar.test(text)) return true;

    // Detectar palabras repetidas (ej: "si si si si si")
    const words = text.toLowerCase().trim().split(/\s+/);
    const uniqueWords = new Set(words);
    if (words.length > 3 && uniqueWords.size === 1) return true;

    return false;
  };

  // Función helper para sanitizar input (seguridad Firebase)
  const sanitizeInput = (text: string): string => {
    // Remover caracteres peligrosos que podrían romper Firebase
    return text
      .replace(/[<>{}[\]\\]/g, "") // Remover caracteres especiales
      .trim();
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
    const sanitizedAnimalName = sanitizeInput(animalName);

    if (!sanitizedAnimalName.trim()) {
      return {
        success: false,
        error: "Por favor completá el nombre o especie del animal",
      };
    }

    if (sanitizedAnimalName.length < VALIDATIONS.animalName.minLength) {
      return {
        success: false,
        error: `El nombre debe tener al menos ${VALIDATIONS.animalName.minLength} caracteres`,
      };
    }

    if (sanitizedAnimalName.length > VALIDATIONS.animalName.maxLength) {
      return {
        success: false,
        error: `El nombre no puede tener más de ${VALIDATIONS.animalName.maxLength} caracteres`,
      };
    }

    if (!VALIDATIONS.animalName.regex.test(sanitizedAnimalName)) {
      return {
        success: false,
        error: "El nombre solo puede contener letras y espacios",
      };
    }

    if (isSpam(sanitizedAnimalName)) {
      return {
        success: false,
        error: "Por favor ingresá un nombre válido",
      };
    }

    // Validar shortDescription
    const sanitizedShortDesc = sanitizeInput(shortDescription);

    if (!sanitizedShortDesc.trim()) {
      return { success: false, error: "Por favor agregá un rasgo distintivo" };
    }

    if (sanitizedShortDesc.length < VALIDATIONS.shortDescription.minLength) {
      return {
        success: false,
        error: `El rasgo distintivo debe tener al menos ${VALIDATIONS.shortDescription.minLength} caracteres`,
      };
    }

    if (sanitizedShortDesc.length > VALIDATIONS.shortDescription.maxLength) {
      return {
        success: false,
        error: `El rasgo distintivo no puede tener más de ${VALIDATIONS.shortDescription.maxLength} caracteres`,
      };
    }

    if (isSpam(sanitizedShortDesc)) {
      return {
        success: false,
        error: "Por favor ingresá un rasgo distintivo válido",
      };
    }

    // Validar detailedDescription
    const sanitizedDetailedDesc = sanitizeInput(detailedDescription);

    if (!sanitizedDetailedDesc.trim()) {
      return { success: false, error: "Por favor agregá una descripción" };
    }

    if (
      sanitizedDetailedDesc.length < VALIDATIONS.detailedDescription.minLength
    ) {
      return {
        success: false,
        error: `La descripción debe tener al menos ${VALIDATIONS.detailedDescription.minLength} caracteres`,
      };
    }

    if (
      sanitizedDetailedDesc.length > VALIDATIONS.detailedDescription.maxLength
    ) {
      return {
        success: false,
        error: `La descripción no puede tener más de ${VALIDATIONS.detailedDescription.maxLength} caracteres`,
      };
    }

    if (isSpam(sanitizedDetailedDesc)) {
      return {
        success: false,
        error: "Por favor ingresá una descripción válida",
      };
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

    // Si todo está bien, retornar los datos sanitizados
    return {
      success: true,
      data: {
        type: selectedType,
        animalName: sanitizedAnimalName,
        shortDescription: sanitizedShortDesc,
        detailedDescription: sanitizedDetailedDesc,
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
