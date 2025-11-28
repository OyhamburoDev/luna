import { useState, useEffect } from "react";
import { createPinService } from "../api/createPinService";
import { getRelativeTime } from "../utils/timeUtils";

export const usePinsManager = () => {
  // Estados para gestionar pins
  const [userPins, setUserPins] = useState<any[]>([]);
  const [selectedPin, setSelectedPin] = useState<any>(null);
  const [showDetailCard, setShowDetailCard] = useState(false);
  const [isLoadingPins, setIsLoadingPins] = useState(false);
  const [pinsError, setPinsError] = useState<string | null>(null);

  useEffect(() => {
    loadPins();
  }, []);

  // Función para cargar todos los pins
  const loadPins = async () => {
    setIsLoadingPins(true);
    setPinsError(null);

    try {
      const pins = await createPinService.getAllPins();

      // Transformar los pins de Firebase al formato del mapa
      const formattedPins = pins.map((pin) => ({
        id: pin.id,
        lat: pin.location.lat,
        lng: pin.location.lng,
        image: pin.pinImageUri,
        photo: pin.photoUri,
        label: pin.type,
        address: pin.location.address,
        description: pin.detailedDescription,
        animalName: pin.animalName,
        shortDescription: pin.shortDescription,
        time: getRelativeTime(pin.createdAt),
      }));

      setUserPins(formattedPins);
    } catch (error) {
      console.error("Error loading pins:", error);
      setPinsError("No se pudieron cargar los reportes");
    } finally {
      setIsLoadingPins(false);
    }
  };

  // Seleccionar un pin y mostrar su detalle
  const selectPin = (marker: any) => {
    setSelectedPin(marker);
    setShowDetailCard(true);
  };

  // Cerrar el modal de detalle
  const closeDetailCard = () => {
    setShowDetailCard(false);
  };

  // Agregar un nuevo pin al mapa
  const addPin = (reportData: {
    type: "PERDIDO" | "AVISTADO" | "ENCONTRADO";
    animalName: string;
    shortDescription: string;
    detailedDescription: string;
    pinImageUri: string;
    photoUri: string;
    location: { lat: number; lng: number; address: string };
  }) => {
    // Crear el objeto del pin con todos sus datos
    // Extraer species y color PRIMERO
    const newPin = {
      id: Date.now().toString(),
      lat: reportData.location.lat,
      lng: reportData.location.lng,
      image: reportData.pinImageUri,
      photo: reportData.photoUri,
      label: reportData.type,
      address: reportData.location.address,
      description: reportData.detailedDescription,
      animalName: reportData.animalName,
      shortDescription: reportData.shortDescription,
      time: "Ahora",
    };

    // Agregar el nuevo pin al array
    setUserPins((prevPins) => [...prevPins, newPin]);

    // Retornar el pin creado
    return newPin;
  };

  return {
    // Estados
    userPins,
    selectedPin,
    showDetailCard,
    isLoadingPins,
    pinsError,

    // Funciones
    selectPin,
    closeDetailCard,
    addPin,
    loadPins,
  };
};
