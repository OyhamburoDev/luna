import { useState, useEffect } from "react";
import { createPinService } from "../api/createPinService";
import { getRelativeTime } from "../utils/timeUtils";
import { preloadImages } from "../utils/imagePreloader";

export const usePinsManager = () => {
  const [userPins, setUserPins] = useState<any[]>([]);
  const [selectedPin, setSelectedPin] = useState<any>(null);
  const [showDetailCard, setShowDetailCard] = useState(false);
  const [isLoadingPins, setIsLoadingPins] = useState(false);
  const [pinsError, setPinsError] = useState<string | null>(null);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  useEffect(() => {
    loadPins();
  }, []);

  // Función para cargar todos los pins
  const loadPins = async () => {
    setIsLoadingPins(true);
    setPinsError(null);
    setImagesLoaded(false);

    try {
      // PASO 1: Obtener datos de Firebase
      const pins = await createPinService.getAllPins();

      // PASO 2: Transformar los pins al formato del mapa
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

      // PASO 3: Actualizar el estado con los datos
      setUserPins(formattedPins);

      //  4.  Precargar las imágenes de los pines
      const imageUris = formattedPins
        .map((pin) => pin.image) // Extraer las URIs de las imágenes
        .filter(
          (uri) => uri && typeof uri === "string" && uri.startsWith("http")
        ); // Solo URIs válidas

      console.log(`📥 Precargando ${imageUris.length} imágenes de pines...`);

      if (imageUris.length > 0) {
        await preloadImages(imageUris);
      }

      //  5 Marcar imágenes como cargadas
      setImagesLoaded(true);
      console.log("✅ Pines e imágenes listos para mostrar");
    } catch (error) {
      console.error("Error loading pins:", error);
      setPinsError("No se pudieron cargar los reportes");
      setImagesLoaded(true); //  6. Marcar como listo incluso si falla
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

    //  7. OPCIONAL: Precargar la imagen del nuevo pin
    if (
      newPin.image &&
      typeof newPin.image === "string" &&
      newPin.image.startsWith("http")
    ) {
      preloadImages([newPin.image]).catch((err) =>
        console.warn("Error precargando imagen del nuevo pin:", err)
      );
    }

    return newPin;
  };

  return {
    // Estados
    userPins,
    selectedPin,
    showDetailCard,
    isLoadingPins,
    imagesLoaded, // ← 8 Exportar el estado
    pinsError,

    // Funciones
    selectPin,
    closeDetailCard,
    addPin,
    loadPins,
  };
};
