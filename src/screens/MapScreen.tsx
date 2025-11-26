import React, { useState, useRef } from "react";
import {
  StatusBar,
  View,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import { useMapLogic } from "../hooks/useMapLogic";
import { useMapDetails } from "../hooks/useMapDetails";
import { PetMapDetailCard } from "../components/mapComponents/PetMapDetailCard";
import { BottomCard } from "../components/mapComponents/BottomCard";
import { MapNative, MapNativeRef } from "../components/mapComponents/MapNative";

export default function MapScreen() {
  const [cardState, setCardState] = useState<
    "MINI" | "CREAR" | "BUSCAR" | "RUTA" | "BUSCAR_UBICACION"
  >("MINI");
  const [selectedPin, setSelectedPin] = useState<any>(null);
  const [showDetailCard, setShowDetailCard] = useState(false);

  // Guardar la ubicación buscada
  const [searchedLocation, setSearchedLocation] = useState<{
    lat: number;
    lng: number;
    name: string;
  } | null>(null);

  // Estado para la ruta
  const [routeDestination, setRouteDestination] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  //  Info de la ruta
  const [routeInfo, setRouteInfo] = useState<{
    distance: number;
    duration: number;
    destinationName: string;
  } | null>(null);

  // Ubicación para el reporte
  const [reportLocation, setReportLocation] = useState<{
    lat: number;
    lng: number;
    name: string;
  } | null>(null);

  // Estado para dark mode
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Estados para el FAB menu
  const [isFabOpen, setIsFabOpen] = useState(false);
  const fabAnimation = useRef(new Animated.Value(0)).current;

  //  Estado para pins creados por el usuario
  const [userPins, setUserPins] = useState<any[]>([]);

  //  Ref para controlar el mapa
  const mapRef = useRef<MapNativeRef>(null);

  // Obtener la API Key
  const googleMapsApiKey =
    Constants.expoConfig?.extra?.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || "";

  // Hooks personalizados con toda la lógica
  const mapLogic = useMapLogic();

  // Nuevo hook para manejar detalles y modal
  const mapDetails = useMapDetails(mapLogic.currentUserId);

  const handleClearSearchLocation = () => {
    setSearchedLocation(null);
  };

  // Funciones para el modal de detalles
  const handleContactPress = (contactInfo: any) => {
    mapDetails.handleContact(contactInfo);
  };

  const handleMarkerPress = (marker: any) => {
    setSelectedPin(marker);
    setShowDetailCard(true);
  };

  // Función para limpiar el pin de reporte
  const handleClearReportLocation = () => {
    setReportLocation(null);
  };

  // Función que se llama cuando seleccionas una ubicación
  const handleLocationSelect = (lat: number, lng: number, name: string) => {
    console.log("Moviendo mapa a:", lat, lng);

    // Si estamos en BUSCAR_UBICACION, guardar como reportLocation
    if (cardState === "BUSCAR_UBICACION") {
      setReportLocation({ lat, lng, name });
    }
    // Si estamos en BUSCAR, guardar como searchedLocation
    else if (cardState === "BUSCAR") {
      setSearchedLocation({ lat, lng, name });
      setCardState("MINI");
    }

    mapRef.current?.animateToLocation(lat, lng);
  };

  // Función para mostrar ruta
  const handleShowRoute = () => {
    if (selectedPin) {
      console.log("Mostrando ruta a:", selectedPin.calle);
      setRouteDestination({
        lat: selectedPin.lat,
        lng: selectedPin.lng,
      });
      setRouteInfo({
        distance: 0, // Se actualizará cuando la ruta esté lista
        duration: 0,
        destinationName: selectedPin.calle,
      });
      setCardState("RUTA"); // ← Cambiar a estado RUTA
      setShowDetailCard(false);
    }
  };

  // Función para recibir info de la ruta
  const handleRouteReady = (distance: number, duration: number) => {
    console.log("Ruta calculada:", distance, "km", duration, "min");
    if (routeInfo) {
      setRouteInfo({
        ...routeInfo,
        distance,
        duration,
      });
    }
  };

  //  Función para cerrar la ruta
  const handleCloseRoute = () => {
    setRouteDestination(null);
    setRouteInfo(null);
    setCardState("MINI");
  };

  // Función para centrar el mapa
  const handleCenterMap = () => {
    if (mapLogic.location) {
      const { latitude, longitude } = mapLogic.location.coords;
      mapRef.current?.animateToLocation(latitude, longitude);
    } else {
      // Si no hay ubicación, usar la función del hook
      mapLogic.onPressLocate();
    }
  };

  //  Toggle dark mode
  const handleToggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Función para publicar un nuevo reporte
  const handlePublishReport = (reportData: {
    type: "PERDIDO" | "AVISTADO" | "ENCONTRADO";
    pinImageUri: string;
    photoUri: string;
    description: string;
    location: { lat: number; lng: number; address: string };
  }) => {
    const newPin = {
      id: Date.now().toString(),
      lat: reportData.location.lat,
      lng: reportData.location.lng,
      image: reportData.pinImageUri, // Para el marker
      photo: reportData.photoUri, // Para la detail card
      label: reportData.type,
      calle: reportData.location.address,
      description: reportData.description,
      dia: "Ahora",
      hora: new Date().toLocaleTimeString("es-AR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    // Agregar el nuevo pin
    setUserPins([...userPins, newPin]);

    // Cerrar la card
    setCardState("MINI");

    //  Limpiar el pin de búsqueda
    setSearchedLocation(null);
    setReportLocation(null);

    // Centrar el mapa en el nuevo pin
    mapRef.current?.animateToLocation(
      reportData.location.lat,
      reportData.location.lng
    );
  };

  // Toggle del menú FAB con animación
  const toggleFabMenu = () => {
    const toValue = isFabOpen ? 0 : 1;

    Animated.spring(fabAnimation, {
      toValue,
      friction: 8,
      tension: 40,
      useNativeDriver: false,
    }).start();

    setIsFabOpen(!isFabOpen);
  };

  // Función para ejecutar acción y cerrar menú
  const handleFabAction = (action: () => void) => {
    action();
    toggleFabMenu();
  };

  // Calcular rotación y posiciones
  const fabRotation = fabAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "90deg"], // Rota 45 grados cuando se abre
  });

  const darkModeButtonTranslate = fabAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 60], // Se mueve 60px hacia abajo
  });

  const centerButtonTranslate = fabAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 120], // Se mueve 120px hacia abajo
  });

  const buttonScale = fabAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1], // Aparece con efecto scale
  });

  const buttonOpacity = fabAnimation.interpolate({
    inputRange: [0, 0.8, 1],
    outputRange: [0, 1, 1], // Aparece rápido, se mantiene visible
  });

  return (
    <>
      <StatusBar barStyle="default" />
      <View
        style={{
          flex: 1,
          paddingTop: StatusBar.currentHeight || 0,
          backgroundColor: "black",
        }}
      >
        {/* Header con flecha back (solo cuando hay ruta) */}
        {routeDestination && (
          <TouchableOpacity
            onPress={handleCloseRoute}
            style={mapScreenStyles.backButtonFloating}
          >
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
        )}
        {/*  FAB Menu expandible */}
        {cardState === "MINI" && (
          <View style={mapScreenStyles.fabContainer}>
            {/* Botón Dark Mode */}
            <Animated.View
              pointerEvents={isFabOpen ? "auto" : "none"}
              style={[
                mapScreenStyles.fabOption,
                {
                  transform: [
                    { translateY: darkModeButtonTranslate },
                    { scale: buttonScale },
                  ],
                  opacity: buttonOpacity,
                },
              ]}
            >
              <TouchableOpacity
                onPress={() => handleFabAction(handleToggleDarkMode)}
                style={mapScreenStyles.fabButton}
              >
                <Ionicons
                  name={isDarkMode ? "sunny" : "moon"}
                  size={20}
                  color="#000"
                />
              </TouchableOpacity>
            </Animated.View>

            {/* Botón Centrar */}
            <Animated.View
              pointerEvents={isFabOpen ? "auto" : "none"}
              style={[
                mapScreenStyles.fabOption,
                {
                  transform: [
                    { translateY: centerButtonTranslate },
                    { scale: buttonScale },
                  ],
                  opacity: buttonOpacity,
                },
              ]}
            >
              <TouchableOpacity
                onPress={() => handleFabAction(handleCenterMap)}
                style={mapScreenStyles.fabButton}
              >
                <Ionicons name="locate" size={20} color="#000" />
              </TouchableOpacity>
            </Animated.View>

            {/* Botón Principal FAB */}
            <Animated.View style={{ transform: [{ rotate: fabRotation }] }}>
              <TouchableOpacity
                onPress={toggleFabMenu}
                style={mapScreenStyles.fabMainButton}
              >
                <Ionicons
                  name={isFabOpen ? "close" : "settings-outline"}
                  size={22}
                  color="#000"
                />
              </TouchableOpacity>
            </Animated.View>
          </View>
        )}

        <MapNative
          ref={mapRef}
          currentLat={mapLogic.currentLat}
          currentLng={mapLogic.currentLng}
          onMarkerPress={handleMarkerPress}
          searchedLocation={searchedLocation}
          reportLocation={reportLocation}
          routeDestination={routeDestination}
          googleMapsApiKey={googleMapsApiKey}
          onRouteReady={handleRouteReady}
          isDarkMode={isDarkMode}
          userPins={userPins}
        />

        <BottomCard
          state={cardState}
          onChangeState={setCardState}
          selectedPin={null}
          onLocationSelect={handleLocationSelect}
          onClearSearchLocation={handleClearSearchLocation}
          onClearReportLocation={handleClearReportLocation}
          routeInfo={routeInfo}
          onPublishReport={handlePublishReport}
          currentLocation={{
            // ← NUEVO
            lat: mapLogic.currentLat,
            lng: mapLogic.currentLng,
          }}
        />

        {/* Detail card para mostrar detalles de mascota */}
        <PetMapDetailCard
          visible={showDetailCard}
          petData={selectedPin}
          onClose={() => setShowDetailCard(false)}
          onContact={(type, value) => {
            console.log(`Contactar por ${type}: ${value}`);
            handleContactPress({ type, value, petId: selectedPin?.id });
          }}
          onShowRoute={handleShowRoute}
        />
      </View>
    </>
  );
}
const mapScreenStyles = StyleSheet.create({
  backButtonFloating: {
    position: "absolute",
    top: (StatusBar.currentHeight || 0) + 16,
    left: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  // ← NUEVOS: Estilos del FAB Menu
  fabContainer: {
    position: "absolute",
    top: (StatusBar.currentHeight || 0) + 16,
    right: 16,
    alignItems: "center",
    zIndex: 10,
  },
  fabMainButton: {
    width: 44, // ← Reducido de 56 a 44
    height: 44, // ← Reducido de 56 a 44
    borderRadius: 22, // ← Reducido de 28 a 22
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 }, // ← Sombra más sutil
    shadowOpacity: 0.2, // ← Más suave
    shadowRadius: 8,
    elevation: 8,
  },
  fabOption: {
    position: "absolute",
  },
  fabButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
});
