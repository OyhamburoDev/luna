// hooks/useCardNavigation.ts
import { useState } from "react";

type CardState = "MINI" | "CREAR" | "BUSCAR" | "RUTA" | "BUSCAR_UBICACION";

export const useCardNavigation = () => {
  const [cardState, setCardState] = useState<CardState>("MINI");

  // Funciones de navegación con nombres semánticos
  const goToMini = () => setCardState("MINI");
  const goToSearch = () => setCardState("BUSCAR");
  const goToCreate = () => setCardState("CREAR");
  const goToRoute = () => setCardState("RUTA");
  const goToSearchLocation = () => setCardState("BUSCAR_UBICACION");

  return {
    // Estado
    cardState,

    // Navegación
    goToMini,
    goToSearch,
    goToCreate,
    goToRoute,
    goToSearchLocation,

    // Exponemos setCardState por si lo necesitan (BottomCard lo usa)
    setCardState,
  };
};
