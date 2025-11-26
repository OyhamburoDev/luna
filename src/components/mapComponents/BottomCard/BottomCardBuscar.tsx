import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Search } from "lucide-react-native";
import { Ionicons } from "@expo/vector-icons";
import { fonts } from "../../../theme/fonts";

interface BottomCardBuscarProps {
  onLocationSelect: (lat: number, lng: number, name: string) => void;
  onBack: () => void;
}

export const BottomCardBuscar: React.FC<BottomCardBuscarProps> = ({
  onLocationSelect,
  onBack,
}) => {
  const [searchText, setSearchText] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);

  // Función de búsqueda con debounce
  const handleSearch = (text: string) => {
    setSearchText(text);

    // Si está vacío, limpiamos
    if (text.trim() === "") {
      setSuggestions([]);
      if (searchTimeout) clearTimeout(searchTimeout);
      setIsLoading(false);
      return;
    }

    // Esperamos al menos 3 caracteres
    if (text.length < 3) {
      setSuggestions([]);
      if (searchTimeout) clearTimeout(searchTimeout);
      setIsLoading(false);
      return;
    }

    // Cancelamos la búsqueda anterior si existe
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    setIsLoading(true);

    // Esperamos 1 segundo después de que el usuario deje de escribir
    const timeout = setTimeout(async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?` +
            `q=${encodeURIComponent(text)}, Buenos Aires, Argentina&` +
            `format=json&` +
            `addressdetails=1&` +
            `limit=5`,
          {
            headers: {
              "User-Agent": "PetRescueApp/1.0",
              Referer: "https://petrescueapp.com",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseText = await response.text();
        const data = JSON.parse(responseText);
        setSuggestions(data);
      } catch (error) {
        console.error("Error buscando dirección:", error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 1000);

    setSearchTimeout(timeout);
  };

  return (
    <View style={styles.containerSearch}>
      <View style={styles.headerWithBackCentered}>
        <View style={styles.titleContainerWithBack}>
          <TouchableOpacity onPress={onBack} style={styles.backButtonLeft}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>

          <Text style={styles.titleCentered}>Buscá por zona</Text>
        </View>

        <Text style={styles.subtitleCentered}>
          Encontrá mascotas perdidas o avistadas
        </Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar dirección o barrio"
          placeholderTextColor="#999"
          autoFocus
          value={searchText}
          onChangeText={handleSearch}
          onBlur={() => {
            setTimeout(() => {
              if (searchText === "") {
                onBack();
              }
            }, 200);
          }}
        />
        <Search size={18} color="#999" style={{ marginRight: 10 }} />
      </View>

      {/* Loading */}
      {isLoading && (
        <View style={styles.suggestionsContainer}>
          <Text style={styles.loadingText}>Buscando...</Text>
        </View>
      )}

      {/* Lista de sugerencias */}
      {!isLoading && suggestions.length > 0 && (
        <ScrollView style={styles.suggestionsContainer}>
          {suggestions.map((suggestion, index) => (
            <TouchableOpacity
              key={index}
              style={styles.suggestionItem}
              onPress={() => {
                const lat = parseFloat(suggestion.lat);
                const lng = parseFloat(suggestion.lon);
                const name = suggestion.display_name;

                console.log("Seleccionaste:", name);
                console.log("Moviendo a:", lat, lng);

                onLocationSelect(lat, lng, name);
              }}
            >
              <Text style={styles.suggestionText}>
                📍 {suggestion.display_name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Sin resultados */}
      {!isLoading && searchText.length >= 3 && suggestions.length === 0 && (
        <View style={styles.suggestionsContainer}>
          <Text style={styles.noResultsText}>No se encontraron resultados</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  containerSearch: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "80%",
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 15,
  },
  headerWithBackCentered: {
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  titleContainerWithBack: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    position: "relative",
  },
  backButtonLeft: {
    position: "absolute",
    left: -30,
    padding: 8,
    marginTop: 2,
  },
  titleCentered: {
    fontFamily: fonts.bold,
    fontSize: 22,
    fontWeight: "700",
    color: "#000",
    textAlign: "center",
  },
  subtitleCentered: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: "#666",
    marginTop: 4,
    textAlign: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginBottom: 0,
  },
  searchInput: {
    flex: 1,
    fontFamily: fonts.semiBold,
    fontSize: 14,
    color: "#000",
  },
  suggestionsContainer: {
    marginTop: 16,
    maxHeight: 300,
  },
  suggestionItem: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    marginBottom: 8,
  },
  suggestionText: {
    fontSize: 14,
    color: "#000",
    fontFamily: fonts.regular,
  },
  loadingText: {
    textAlign: "center",
    fontSize: 14,
    color: "#666",
    paddingVertical: 20,
  },
  noResultsText: {
    textAlign: "center",
    fontSize: 14,
    color: "#666",
    paddingVertical: 20,
  },
});
