import { useState, useEffect, useRef } from "react";
import { WebView } from "react-native-webview";

// Tipos para los resultados de búsqueda
export interface SearchResult {
  place_id: string;
  display_name: string;
  lat: string;
  lon: string;
  type: string;
}

export const useMapSearch = () => {
  const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [noResults, setNoResults] = useState(false);

  // Para debounce de búsqueda
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Función para buscar con Nominatim API
  const searchLocation = async (query: string): Promise<SearchResult[]> => {
    if (!query || query.length < 5) return [];

    try {
      // Nominatim API - gratuita para geocoding
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        query + ", Buenos Aires, Argentina"
      )}&limit=5&countrycodes=ar&addressdetails=1`;

      console.log("🌐 URL completa:", url);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "User-Agent": "Luna Pet App (Contact: your-email@example.com)",
          Accept: "application/json",
        },
      });
      console.log("📡 Response status:", response.status);

      if (!response.ok) throw new Error("Error en la búsqueda");

      const results: SearchResult[] = await response.json();
      console.log("🔍 Búsqueda:", query);
      console.log("📡 Response status:", response.status);
      console.log("📋 Results:", results);
      console.log("📊 Results length:", results.length);
      return results;
    } catch (error) {
      console.log("❌ Error específico:", error);
      console.log("❌ Error message:", (error as Error).message);
      console.log("❌ Error name:", (error as Error).name);
      return [];
    }
  };

  // Función principal de búsqueda con debounce
  const handleSearch = (query: string) => {
    // Limpiar timeout anterior
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Si la query está vacía, limpiar todo
    if (!query || query.length === 0) {
      setSuggestions([]);
      setShowSuggestions(false);
      setNoResults(false);
      setIsSearching(false);
      return;
    }

    // Si es muy corta, no buscar aún
    if (query.length < 5) {
      setSuggestions([]);
      setShowSuggestions(false);
      setNoResults(false);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    setShowSuggestions(true);

    // Debounce de 500ms
    searchTimeoutRef.current = setTimeout(async () => {
      console.log("🎯 Entrando al setTimeout con query:", query);
      try {
        const results = await searchLocation(query);

        if (results.length > 0) {
          setSuggestions(results);
          setNoResults(false);
        } else {
          setSuggestions([]);
          setNoResults(true);
        }
      } catch (error) {
        setSuggestions([]);
        setNoResults(true);
      } finally {
        setIsSearching(false);
      }
    }, 1200);
  };

  // Función para seleccionar una sugerencia
  const selectSuggestion = (
    suggestion: SearchResult,
    webRef: React.RefObject<WebView | null>
  ) => {
    const lat = parseFloat(suggestion.lat);
    const lng = parseFloat(suggestion.lon);

    // Centrar el mapa en la nueva ubicación
    webRef.current?.injectJavaScript(
      `window._centerAndRegeneratePins(${lat}, ${lng}); true;`
    );

    // Limpiar sugerencias
    setSuggestions([]);
    setShowSuggestions(false);
    setNoResults(false);
    setIsSearching(false);
  };

  // Función para cerrar sugerencias
  const closeSuggestions = () => {
    setShowSuggestions(false);
    setSuggestions([]);
    setNoResults(false);
    setIsSearching(false);
  };

  // Cleanup del timeout al desmontar
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  return {
    suggestions,
    isSearching,
    showSuggestions,
    noResults,
    handleSearch,
    selectSuggestion,
    closeSuggestions,
  };
};
