import { useState } from "react";

export const useRouteManager = () => {
  // Estados de la ruta
  const [routeDestination, setRouteDestination] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const [routeInfo, setRouteInfo] = useState<{
    distance: number;
    duration: number;
    destinationName: string;
  } | null>(null);

  // Iniciar una ruta hacia un pin
  const startRoute = (pin: any) => {
    if (!pin) return;

    console.log("Mostrando ruta a:", pin.calle);

    setRouteDestination({
      lat: pin.lat,
      lng: pin.lng,
    });

    setRouteInfo({
      distance: 0, // Se actualizará cuando la ruta esté lista
      duration: 0,
      destinationName: pin.calle,
    });
  };

  // Actualizar distancia y duración cuando la ruta esté calculada
  const updateRouteInfo = (distance: number, duration: number) => {
    console.log("Ruta calculada:", distance, "km", duration, "min");

    if (routeInfo) {
      setRouteInfo({
        ...routeInfo,
        distance,
        duration,
      });
    }
  };

  // Cerrar y limpiar la ruta
  const clearRoute = () => {
    setRouteDestination(null);
    setRouteInfo(null);
  };

  return {
    // Estados
    routeDestination,
    routeInfo,

    // Funciones
    startRoute,
    updateRouteInfo,
    clearRoute,
  };
};
