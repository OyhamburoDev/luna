import { useState } from "react";

export const usePinsManager = () => {
  // Estados para gestionar pins
  const [userPins, setUserPins] = useState<any[]>([]);
  const [selectedPin, setSelectedPin] = useState<any>(null);
  const [showDetailCard, setShowDetailCard] = useState(false);

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
      calle: reportData.location.address,
      description: reportData.detailedDescription,
      animalName: reportData.animalName,
      shortDescription: reportData.shortDescription,
      species: reportData.animalName,
      color: reportData.shortDescription,
      dia: "Ahora",
      hora: new Date().toLocaleTimeString("es-AR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
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

    // Funciones
    selectPin,
    closeDetailCard,
    addPin,
  };
};
