import { useState, useRef } from "react";
import { WebView } from "react-native-webview";
import { FilterType } from "../types/mapTypes";

export const useMapFilters = () => {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  // Función para cambiar filtros
  const handleFilterChange = (
    filter: FilterType,
    webRef: React.RefObject<WebView | null>
  ) => {
    // Si el filtro clickeado ya está activo, lo desactivamos (volvemos a 'all')
    const newFilter = activeFilter === filter ? "all" : filter;
    setActiveFilter(newFilter);

    // Aplicamos el filtro en el mapa
    webRef.current?.injectJavaScript(
      `window._applyFilter('${newFilter}'); true;`
    );
  };

  // Función helper para obtener el estilo del chip
  const getChipStyle = (filterType: FilterType, styles: any) => [
    styles.chip,
    styles.chipSpacing,
    activeFilter === filterType && styles.chipActive,
  ];

  // Función helper para obtener el estilo del texto
  const getChipTextStyle = (filterType: FilterType, styles: any) => [
    styles.chipText,
    activeFilter === filterType && { color: "white" },
  ];

  return {
    activeFilter,
    handleFilterChange,
    getChipStyle,
    getChipTextStyle,
  };
};
