import { useState, useEffect, useRef } from "react";
import { WebView } from "react-native-webview";
import * as Location from "expo-location";
import { PetPin } from "../types/mapTypes";

export const useMapLogic = () => {
  // Estados principales
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [selected, setSelected] = useState<PetPin | null>(null);
  const [markedIds, setMarkedIds] = useState<Set<string>>(new Set());
  const [query, setQuery] = useState("");

  // Ref del WebView
  const webRef = useRef<WebView | null>(null);

  // Coordenadas por defecto (Buenos Aires)
  const defaultLat = -34.6037;
  const defaultLng = -58.3816;

  // Coordenadas actuales (ubicación del usuario o por defecto)
  const currentLat = location ? location.coords.latitude : defaultLat;
  const currentLng = location ? location.coords.longitude : defaultLng;

  // Solicitar permisos y obtener ubicación al montar el componente
  useEffect(() => {
    const getLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") return;

        const userLocation = await Location.getCurrentPositionAsync({});
        setLocation(userLocation);
      } catch (error) {
        console.log("Error getting location:", error);
      }
    };

    getLocation();
  }, []);

  // Función para centrar el mapa en la ubicación actual
  const onPressLocate = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;

      const loc = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = loc.coords;

      webRef.current?.injectJavaScript(
        `window._recenter(${latitude}, ${longitude}); true;`
      );
    } catch (error) {
      console.log("Error relocating:", error);
    }
  };

  // Manejar mensajes del WebView
  const handleWebViewMessage = (event: any) => {
    try {
      const message = JSON.parse(event?.nativeEvent?.data);
      if (message?.type === "pin_tap") {
        setSelected(message.pin);
      }
    } catch (error) {
      console.log("Error parsing WebView message:", error);
    }
  };

  // Marcar/desmarcar un pin
  const onMarkPin = () => {
    if (!selected) return;

    const id = String(selected.id);
    const nextMarkedIds = new Set(markedIds);
    const willMark = !nextMarkedIds.has(id);

    if (willMark) {
      nextMarkedIds.add(id);
    } else {
      nextMarkedIds.delete(id);
    }

    setMarkedIds(nextMarkedIds);

    // Actualizar el pin en el mapa
    webRef.current?.injectJavaScript(
      `window._markPin(${JSON.stringify(id)}, ${willMark}); true;`
    );
  };

  // Cerrar la selección actual
  const onCloseSelection = () => {
    setSelected(null);
  };

  // Función para navegar a detalles (placeholder por ahora)
  const onViewMore = () => {
    if (selected) {
      console.log("Ver más detalles para:", selected.id);
      // Aquí irá la navegación: navigation.navigate("Detalle", { id: selected.id });
    }
  };

  return {
    // Estados
    location,
    selected,
    markedIds,
    query,
    setQuery,

    // Coordenadas
    currentLat,
    currentLng,

    // Ref del WebView
    webRef,

    // Funciones
    onPressLocate,
    handleWebViewMessage,
    onMarkPin,
    onCloseSelection,
    onViewMore,

    // Helpers
    isMarked: (id: string) => markedIds.has(id),
  };
};
