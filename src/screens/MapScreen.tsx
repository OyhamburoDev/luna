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
import { useFabMenu } from "../hooks/useFabMenu";
import { usePinsManager } from "../hooks/usePinsManager";
import { useCardNavigation } from "../hooks/useCardNavigation";
import { useRouteManager } from "../hooks/useRouteManager";

export default function MapScreen() {
  const cardNav = useCardNavigation();
  const pinsManager = usePinsManager();

  const fabMenu = useFabMenu();

  // Guardar la ubicación buscada
  const [searchedLocation, setSearchedLocation] = useState<{
    lat: number;
    lng: number;
    name: string;
  } | null>(null);

  // Hook para gestionar rutas
  const routeManager = useRouteManager();

  // Ubicación para el reporte
  const [reportLocation, setReportLocation] = useState<{
    lat: number;
    lng: number;
    name: string;
  } | null>(null);

  // Estado para dark mode
  const [isDarkMode, setIsDarkMode] = useState(false);

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

  // Función para limpiar el pin de reporte
  const handleClearReportLocation = () => {
    setReportLocation(null);
  };

  // Función que se llama cuando seleccionas una ubicación
  const handleLocationSelect = (lat: number, lng: number, name: string) => {
    console.log("Moviendo mapa a:", lat, lng);

    // Si estamos en BUSCAR_UBICACION, guardar como reportLocation
    if (cardNav.cardState === "BUSCAR_UBICACION") {
      setReportLocation({ lat, lng, name });
    }
    // Si estamos en BUSCAR, guardar como searchedLocation
    else if (cardNav.cardState === "BUSCAR") {
      setSearchedLocation({ lat, lng, name });
      cardNav.goToMini();
    }

    mapRef.current?.animateToLocation(lat, lng);
  };

  // Mostrar ruta - coordina entre hooks
  const handleShowRoute = () => {
    routeManager.startRoute(pinsManager.selectedPin);
    cardNav.goToRoute();
    pinsManager.closeDetailCard();
  };

  // Actualizar info cuando la ruta está lista
  const handleRouteReady = (distance: number, duration: number) => {
    routeManager.updateRouteInfo(distance, duration);
  };

  // Cerrar ruta - coordina entre hooks
  const handleCloseRoute = () => {
    routeManager.clearRoute();
    cardNav.goToMini();
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
    // El manager crea y agrega el pin
    const newPin = pinsManager.addPin(reportData);

    // Coordinación (MapScreen se encarga de esto)
    cardNav.goToMini();
    setSearchedLocation(null);
    setReportLocation(null);

    // Centrar el mapa en el nuevo pin
    mapRef.current?.animateToLocation(newPin.lat, newPin.lng);
  };

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
        {routeManager.routeDestination && (
          <TouchableOpacity
            onPress={handleCloseRoute}
            style={mapScreenStyles.backButtonFloating}
          >
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
        )}

        {/*  FAB Menu expandible */}
        {cardNav.cardState === "MINI" && (
          <View style={mapScreenStyles.fabContainer}>
            {/* Botón Dark Mode */}
            <Animated.View
              pointerEvents={fabMenu.isFabOpen ? "auto" : "none"}
              style={[
                mapScreenStyles.fabOption,
                {
                  transform: [
                    { translateY: fabMenu.darkModeButtonTranslate },
                    { scale: fabMenu.buttonScale },
                  ],
                  opacity: fabMenu.buttonOpacity,
                },
              ]}
            >
              <TouchableOpacity
                onPress={() => fabMenu.handleFabAction(handleToggleDarkMode)}
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
              pointerEvents={fabMenu.isFabOpen ? "auto" : "none"}
              style={[
                mapScreenStyles.fabOption,
                {
                  transform: [
                    { translateY: fabMenu.centerButtonTranslate },
                    { scale: fabMenu.buttonScale },
                  ],
                  opacity: fabMenu.buttonOpacity,
                },
              ]}
            >
              <TouchableOpacity
                onPress={() => fabMenu.handleFabAction(handleCenterMap)}
                style={mapScreenStyles.fabButton}
              >
                <Ionicons name="locate" size={20} color="#000" />
              </TouchableOpacity>
            </Animated.View>

            {/* Botón Principal FAB */}
            <Animated.View
              style={{ transform: [{ rotate: fabMenu.fabRotation }] }}
            >
              <TouchableOpacity
                onPress={fabMenu.toggleFabMenu}
                style={mapScreenStyles.fabMainButton}
              >
                <Ionicons
                  name={fabMenu.isFabOpen ? "close" : "settings-outline"}
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
          onMarkerPress={pinsManager.selectPin}
          searchedLocation={searchedLocation}
          reportLocation={reportLocation}
          routeDestination={routeManager.routeDestination}
          googleMapsApiKey={googleMapsApiKey}
          onRouteReady={handleRouteReady}
          isDarkMode={isDarkMode}
          userPins={pinsManager.userPins}
        />
        <BottomCard
          state={cardNav.cardState}
          onChangeState={cardNav.setCardState}
          selectedPin={null}
          onLocationSelect={handleLocationSelect}
          onClearSearchLocation={handleClearSearchLocation}
          onClearReportLocation={handleClearReportLocation}
          routeInfo={routeManager.routeInfo}
          onPublishReport={handlePublishReport}
          currentLocation={{
            lat: mapLogic.currentLat,
            lng: mapLogic.currentLng,
          }}
          searchedLocation={searchedLocation}
        />

        {/* Detail card para mostrar detalles de mascota */}
        <PetMapDetailCard
          visible={pinsManager.showDetailCard}
          petData={pinsManager.selectedPin}
          onClose={pinsManager.closeDetailCard}
          onContact={(type, value) => {
            console.log(`Contactar por ${type}: ${value}`);
            handleContactPress({
              type,
              value,
              petId: pinsManager.selectedPin?.id,
            });
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
