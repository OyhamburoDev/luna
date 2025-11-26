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

interface SelectedLocation {
  lat: number;
  lng: number;
  address: string;
}

interface BottomCardBuscarUbicacionProps {
  onLocationSelect: (lat: number, lng: number, name: string) => void;
  onBack: () => void;
  onConfirm: () => void;
}

export const BottomCardBuscarUbicacion: React.FC<
  BottomCardBuscarUbicacionProps
> = ({ onLocationSelect, onBack, onConfirm }) => {
  const [locationSearchText, setLocationSearchText] = useState("");
  const [locationSuggestions, setLocationSuggestions] = useState<any[]>([]);
  const [isLocationSearching, setIsLocationSearching] = useState(false);
  const [locationSearchTimeout, setLocationSearchTimeout] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);
  const [selectedLocation, setSelectedLocation] =
    useState<SelectedLocation | null>(null);

  // Función de búsqueda de ubicación con debounce
  const handleLocationSearch = (text: string) => {
    setLocationSearchText(text);

    // Si está vacío, limpiar
    if (text.trim() === "") {
      setLocationSuggestions([]);
      if (locationSearchTimeout) clearTimeout(locationSearchTimeout);
      setIsLocationSearching(false);
      return;
    }

    // Esperamos al menos 3 caracteres
    if (text.length < 3) {
      setLocationSuggestions([]);
      if (locationSearchTimeout) clearTimeout(locationSearchTimeout);
      setIsLocationSearching(false);
      return;
    }

    // Cancelar búsqueda anterior si existe
    if (locationSearchTimeout) {
      clearTimeout(locationSearchTimeout);
    }

    setIsLocationSearching(true);

    // Esperar 1 segundo después de que el usuario deje de escribir
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
          throw new Error(`Error: ${response.status}`);
        }

        const responseText = await response.text();
        const data = JSON.parse(responseText);
        setLocationSuggestions(data);
      } catch (error) {
        console.error("Error buscando ubicación:", error);
        setLocationSuggestions([]);
      } finally {
        setIsLocationSearching(false);
      }
    }, 1000);

    setLocationSearchTimeout(timeout);
  };

  const containerStyle = selectedLocation
    ? styles.containerSearchSmall
    : styles.containerSearch;

  return (
    <View style={containerStyle}>
      {/* Header con flecha atrás */}
      <View style={styles.headerWithBackCentered}>
        <TouchableOpacity onPress={onBack} style={styles.backButtonAbsolute}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>

        <Text style={styles.titleCentered}>Elegir ubicación</Text>
      </View>

      {/* Buscador o dirección seleccionada */}
      {!selectedLocation ? (
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar dirección..."
            placeholderTextColor="#999"
            value={locationSearchText}
            onChangeText={handleLocationSearch}
            autoFocus
          />
          <Search size={18} color="#999" style={{ marginRight: 10 }} />
        </View>
      ) : (
        <View style={styles.selectedAddressCompact}>
          <Text style={styles.selectedAddressCompactText} numberOfLines={1}>
            📍 {selectedLocation.address}
          </Text>
        </View>
      )}

      {/* Loading */}
      {isLocationSearching && (
        <View style={styles.suggestionsContainer}>
          <Text style={styles.loadingText}>Buscando...</Text>
        </View>
      )}

      {/* Sugerencias */}
      {!isLocationSearching && locationSuggestions.length > 0 && (
        <ScrollView style={styles.suggestionsContainer}>
          {locationSuggestions.map((suggestion, index) => (
            <TouchableOpacity
              key={index}
              style={styles.suggestionItem}
              onPress={() => {
                const lat = parseFloat(suggestion.lat);
                const lng = parseFloat(suggestion.lon);
                const address = suggestion.display_name;

                // Guardar la ubicación
                setSelectedLocation({ lat, lng, address });

                // Mover el mapa a esa ubicación
                onLocationSelect(lat, lng, address);

                // Limpiar búsqueda
                setLocationSearchText("");
                setLocationSuggestions([]);
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
      {!isLocationSearching &&
        locationSearchText.length >= 3 &&
        locationSuggestions.length === 0 && (
          <View style={styles.suggestionsContainer}>
            <Text style={styles.noResultsText}>
              No se encontraron resultados
            </Text>
          </View>
        )}

      {/* Botón confirmar (solo si hay ubicación seleccionada) */}
      {selectedLocation && (
        <View style={styles.fixedButtonContainer}>
          <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
            <Text style={styles.confirmButtonText}>Confirmar ubicación</Text>
          </TouchableOpacity>
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
  containerSearchSmall: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "35%",
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
  backButtonAbsolute: {
    position: "absolute",
    left: 0,
    padding: 8,
    zIndex: 1,
  },
  titleCentered: {
    fontFamily: fonts.bold,
    fontSize: 22,
    fontWeight: "700",
    color: "#000",
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
  selectedAddressCompact: {
    backgroundColor: "#F5F5F5",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  selectedAddressCompactText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
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
  fixedButtonContainer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  confirmButton: {
    backgroundColor: "#000",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },
});
