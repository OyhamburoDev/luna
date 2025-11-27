import React, { useRef, useImperativeHandle, forwardRef } from "react";
import MapView, { Marker, PROVIDER_GOOGLE, Circle } from "react-native-maps";
import { StyleSheet, Image } from "react-native";
import MapViewDirections from "react-native-maps-directions";

interface MapNativeProps {
  currentLat: number;
  currentLng: number;
  onMarkerPress?: (marker: any) => void;
  searchedLocation?: {
    lat: number;
    lng: number;
    name: string;
  } | null;
  reportLocation?: {
    lat: number;
    lng: number;
    name: string;
  } | null;
  routeDestination?: {
    lat: number;
    lng: number;
  } | null;
  googleMapsApiKey: string;
  onRouteReady?: (distance: number, duration: number) => void;
  isDarkMode?: boolean;
  userPins?: any[];
}

// Interface para los métodos que exponemos
export interface MapNativeRef {
  animateToLocation: (lat: number, lng: number) => void;
}

const silverMapStyle = [
  {
    elementType: "geometry",
    stylers: [{ color: "#f0f0f0" }],
  },
  {
    elementType: "labels.icon",
    stylers: [{ visibility: "off" }],
  },
  {
    elementType: "labels.text.fill",
    stylers: [{ color: "#7a7a7a" }],
  },
  {
    elementType: "labels.text.stroke",
    stylers: [{ color: "#ffffff" }],
  },
  {
    featureType: "administrative",
    elementType: "geometry",
    stylers: [{ color: "#d6d6d6" }],
  },
  {
    featureType: "poi",
    elementType: "geometry",
    stylers: [{ color: "#e8e8e8" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#e8e8e8" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#ffffff" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#d6d6d6" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#d4e4f7" }],
  },
];

// Estilo modo oscuro
const darkMapStyle = [
  { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#38414e" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#9ca5b3" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#17263c" }],
  },
];

// Usamos forwardRef para poder usar ref desde afuera
export const MapNative = forwardRef<MapNativeRef, MapNativeProps>(
  (
    {
      currentLat,
      currentLng,
      onMarkerPress,
      searchedLocation,
      reportLocation,
      routeDestination,
      googleMapsApiKey,
      onRouteReady,
      isDarkMode,
      userPins,
    },
    ref
  ) => {
    const mapRef = useRef<MapView>(null);

    // Determinar los deltas según si estamos en coordenadas por defecto o reales
    const isDefaultLocation = currentLat === -34.75 && currentLng === -58.45;
    const latitudeDelta = isDefaultLocation ? 0.5 : 0.02;
    const longitudeDelta = isDefaultLocation ? 0.5 : 0.02;

    // Exponemos la función para mover el mapa
    useImperativeHandle(ref, () => ({
      animateToLocation: (lat: number, lng: number) => {
        mapRef.current?.animateToRegion(
          {
            latitude: lat,
            longitude: lng,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
          },
          1000 // ← Duración de la animación en ms
        );
      },
    }));

    return (
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        customMapStyle={isDarkMode ? darkMapStyle : silverMapStyle}
        region={{
          latitude: currentLat,
          longitude: currentLng,
          latitudeDelta,
          longitudeDelta,
        }}
        showsUserLocation={true}
        showsMyLocationButton={false}
        zoomControlEnabled={false}
      >
        {/* Renderizar pins creados por usuarios */}
        {(userPins || []).map((pin) => (
          <Marker
            key={pin.id}
            coordinate={{ latitude: pin.lat, longitude: pin.lng }}
            icon={{ uri: pin.image }}
            onPress={() => onMarkerPress?.(pin)}
          />
        ))}
        {/* Círculo de búsqueda normal */}
        {searchedLocation && (
          <Circle
            center={{
              latitude: searchedLocation.lat,
              longitude: searchedLocation.lng,
            }}
            radius={350}
            fillColor="rgba(59, 130, 246, 0.2)"
            strokeColor="rgba(59, 130, 246, 0.3)"
            strokeWidth={2}
          />
        )}

        {/* Pin de ubicación del reporte */}
        {reportLocation && (
          <Marker
            coordinate={{
              latitude: reportLocation.lat,
              longitude: reportLocation.lng,
            }}
          >
            <Image
              source={require("../../../assets/media/images/marker.png")}
              style={{
                width: 40,
                height: 40,
                resizeMode: "contain",
              }}
            />
          </Marker>
        )}

        {/*  Ruta desde tu ubicación hasta el destino */}
        {routeDestination && (
          <MapViewDirections
            origin={{
              latitude: currentLat,
              longitude: currentLng,
            }}
            destination={{
              latitude: routeDestination.lat,
              longitude: routeDestination.lng,
            }}
            apikey={googleMapsApiKey}
            strokeWidth={5}
            strokeColor="#667eea"
            optimizeWaypoints={true}
            onReady={(result) => {
              console.log(`Distancia: ${result.distance} km`);
              console.log(`Duración: ${result.duration} min`);

              //Pasar info al parent
              onRouteReady?.(result.distance, result.duration);

              // Ajustar el zoom para ver toda la ruta
              mapRef.current?.fitToCoordinates(result.coordinates, {
                edgePadding: {
                  top: 100,
                  right: 50,
                  bottom: 300,
                  left: 50,
                },
                animated: true,
              });
            }}
            onError={(errorMessage) => {
              console.error("Error al calcular ruta:", errorMessage);
            }}
          />
        )}
      </MapView>
    );
  }
);

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
});
