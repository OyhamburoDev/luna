import { useState, useEffect, useRef, useCallback } from "react";
import { WebView } from "react-native-webview";
import * as Location from "expo-location";
import { PetPin } from "../types/mapTypes";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

export const useMapLogic = () => {
  // Estados principales
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [selected, setSelected] = useState<PetPin | null>(null);
  const [markedIds, setMarkedIds] = useState<Set<string>>(new Set());
  const [query, setQuery] = useState("");
  const [isLocating, setIsLocating] = useState(false);

  // Ref del WebView
  const webRef = useRef<WebView | null>(null);

  // Coordenadas por defecto (Buenos Aires)
  const defaultLat = -34.6037;
  const defaultLng = -58.3816;

  // Coordenadas actuales (ubicación del usuario o por defecto)
  const currentLat = location ? location.coords.latitude : defaultLat;
  const currentLng = location ? location.coords.longitude : defaultLng;

  const [currentUserId, setCurrentUserId] = useState<string | undefined>(
    undefined
  );
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [nearbyPetsCount, setNearbyPetsCount] = useState(8);

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
    // Si ya tenemos ubicación guardada, usarla inmediatamente
    if (location) {
      const { latitude, longitude } = location.coords;
      webRef.current?.injectJavaScript(
        `window._centerAndRegeneratePins(${latitude}, ${longitude}); true;`
      );
      return; // ¡Salir aquí! No pedir GPS de nuevo
    }

    // Solo si NO tenemos ubicación, pedir GPS nuevo
    setIsLocating(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setIsLocating(false);
        return;
      }

      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      setLocation(loc); // Guardar nueva ubicación
      const { latitude, longitude } = loc.coords;
      webRef.current?.injectJavaScript(
        `window._centerAndRegeneratePins(${latitude}, ${longitude}); true;`
      );
    } catch (error) {
      console.log("Error obteniendo ubicación:", error);
    } finally {
      setIsLocating(false);
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

  const loadUserData = useCallback(async () => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      const isLoggedIn = await AsyncStorage.getItem("isLoggedIn");

      if (userId && isLoggedIn === "true") {
        setCurrentUserId(userId);
        setIsUserLoggedIn(true);
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  }, []);

  const onReportNewPet = useCallback(() => {
    Alert.alert("Crear reporte", "Función de reportar mascota");
  }, []);

  const onLogin = useCallback(() => {
    Alert.alert("Login", "Función de login");
  }, []);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  return {
    // Estados
    location,
    selected,
    markedIds,
    query,
    setQuery,
    isLocating,

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

    currentUserId,
    isUserLoggedIn,
    nearbyPetsCount,
    onReportNewPet,
    onLogin,

    // Helpers
    isMarked: (id: string) => markedIds.has(id),
  };
};
