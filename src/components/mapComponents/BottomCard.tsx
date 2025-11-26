import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Linking,
  Platform,
} from "react-native";
import { fonts } from "../../theme/fonts";
import { Search } from "lucide-react-native";
import { PinImageRenderer } from "../PinImageRenderer";
import {
  pickAndProcessImage,
  generatePinImage,
} from "../../utils/imageProcessor";
import { useRef } from "react";
import { Ionicons } from "@expo/vector-icons";

type CardState = "MINI" | "CREAR" | "BUSCAR" | "RUTA" | "BUSCAR_UBICACION";

interface BottomCardProps {
  state: CardState;
  onChangeState: (newState: CardState) => void;
  selectedPin?: any;
  onLocationSelect?: (lat: number, lng: number, name: string) => void;
  routeInfo?: {
    distance: number;
    duration: number;
    destinationName: string;
  } | null;
  onPublishReport?: (reportData: {
    type: "PERDIDO" | "AVISTADO" | "ENCONTRADO";
    pinImageUri: string;
    photoUri: string;
    description: string;
    location: { lat: number; lng: number; address: string };
  }) => void;
  currentLocation?: { lat: number; lng: number };
  onClearSearchLocation?: () => void;
  onClearReportLocation?: () => void;
}

export const BottomCard: React.FC<BottomCardProps> = ({
  state,
  onChangeState,
  selectedPin,
  onLocationSelect,
  onClearSearchLocation,
  routeInfo,
  onPublishReport,
  currentLocation,
  onClearReportLocation,
}) => {
  const [selectedType, setSelectedType] = useState<
    "PERDIDO" | "AVISTADO" | "ENCONTRADO" | null
  >(null);

  // ========== NUEVOS ESTADOS PARA BÚSQUEDA ==========
  const [searchText, setSearchText] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);

  // Estados para el buscador de ubicación
  const [locationSearchTimeout, setLocationSearchTimeout] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);
  const [locationSearchText, setLocationSearchText] = useState("");
  const [locationSuggestions, setLocationSuggestions] = useState<any[]>([]);
  const [isLocationSearching, setIsLocationSearching] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
    address: string;
  } | null>(null);

  // Estados para manejar la foto
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);
  const [generatedPinUri, setGeneratedPinUri] = useState<string | null>(null);
  const pinRef = useRef<View>(null);

  //  Estado para descripción
  const [description, setDescription] = useState("");

  // ========== FUNCIÓN DE BÚSQUEDA CON DEBOUNCE ==========
  const handleSearch = (text: string) => {
    setSearchText(text);

    // Si está vacío, limpiamos
    if (text.trim() === "") {
      setSuggestions([]);
      if (searchTimeout) clearTimeout(searchTimeout);
      setIsLoading(false);
      onClearSearchLocation?.();
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
    }, 1000); // ← Aumentado a 1 segundo

    setSearchTimeout(timeout);
  };

  // ========== FUNCIÓN DE BÚSQUEDA DE UBICACIÓN ==========
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

  // ========== FUNCIÓN PARA ABRIR GOOGLE MAPS ==========
  const openInMaps = () => {
    if (!routeInfo) return;

    const destination = encodeURIComponent(routeInfo.destinationName);
    const url = Platform.select({
      ios: `maps://app?daddr=${destination}`,
      android: `google.navigation:q=${destination}`,
    });

    if (url) {
      Linking.canOpenURL(url).then((supported) => {
        if (supported) {
          Linking.openURL(url);
        } else {
          // Fallback a Google Maps web
          Linking.openURL(
            `https://www.google.com/maps/dir/?api=1&destination=${destination}`
          );
        }
      });
    }
  };
  const handleSelectPhoto = async () => {
    const borderColor =
      selectedType === "PERDIDO"
        ? "#ef4444"
        : selectedType === "AVISTADO"
        ? "#3b82f6"
        : "#10b981";

    const uri = await pickAndProcessImage(borderColor);
    if (uri) {
      setSelectedImageUri(uri);

      // Esperar más tiempo para que la imagen se cargue completamente
      setTimeout(async () => {
        const pinUri = await generatePinImage(uri, borderColor, pinRef);
        if (pinUri) {
          setGeneratedPinUri(pinUri);
          console.log("✅ Pin generado:", pinUri);
        }
      }, 1000); // ← Cambiado de 100ms a 1000ms (1 segundo)
    }
  };

  // ========== ESTADO RUTA ==========
  if (state === "RUTA") {
    return (
      <View style={styles.containerRoute}>
        {/* Handle para deslizar */}
        <View style={styles.handleBarContainer}>
          <View style={styles.handleBar} />
        </View>
        <View style={styles.routeMainTitleCnt}>
          <Text style={styles.routeMainTitle}>Ruta a la mascota</Text>
          <Text style={styles.routeAddress}>
            {routeInfo?.destinationName || "Cargando..."}
          </Text>
        </View>
        {/* Info de la ruta */}
        <View style={styles.routeInfoContainer}>
          <View style={styles.routeInfoItem}>
            <Text style={styles.routeInfoLabel}>Distancia</Text>
            <Text style={styles.routeInfoValue}>
              {routeInfo?.distance
                ? `${routeInfo.distance.toFixed(1)} km`
                : "Calculando..."}
            </Text>
          </View>
          <View style={styles.routeInfoDivider} />
          <View style={styles.routeInfoItem}>
            <Text style={styles.routeInfoLabel}>Tiempo estimado</Text>
            <Text style={styles.routeInfoValue}>
              {routeInfo?.duration
                ? `${Math.round(routeInfo.duration)} min`
                : "Calculando..."}
            </Text>
          </View>
        </View>

        {/* Botón grande para abrir en Maps */}
        <TouchableOpacity style={styles.openMapsButton} onPress={openInMaps}>
          <Text style={styles.openMapsButtonText}>Iniciar navegación</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ========== ESTADO BUSCAR_UBICACION ==========
  if (state === "BUSCAR_UBICACION") {
    return (
      <View
        style={
          selectedLocation
            ? styles.containerSearchSmall
            : styles.containerSearch
        }
      >
        {/* Header con flecha atrás */}
        <View style={styles.headerWithBackCentered}>
          <TouchableOpacity
            onPress={() => onChangeState("CREAR")}
            style={styles.backButtonAbsolute}
          >
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

                  // ⭐ Mover el mapa a esa ubicación
                  onLocationSelect?.(lat, lng, address);

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
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={() => {
                // Volver a CREAR con la ubicación guardada
                onChangeState("CREAR");
              }}
            >
              <Text style={styles.confirmButtonText}>Confirmar ubicación</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }

  // ========== ESTADO CREAR ==========
  if (state === "CREAR") {
    return (
      <View style={styles.containerExpanded}>
        {/* Header con título y botón cerrar */}
        <View style={styles.header}>
          <Text style={styles.titleLarge}>Reportar mascota</Text>
          <TouchableOpacity
            onPress={() => {
              setSelectedType(null);
              setSelectedImageUri(null);
              setGeneratedPinUri(null);
              setDescription("");
              setSelectedLocation(null);
              onClearReportLocation?.();
              onChangeState("MINI");
            }}
            style={styles.closeButtonAbsolute}
          >
            <Ionicons name="close" size={26} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Contenido scrolleable */}
        <ScrollView
          style={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContentContainer}
        >
          {/* Selector de tipo */}
          <Text style={styles.label}>¿Qué pasó?</Text>
          <View style={styles.typeSelector}>
            <TouchableOpacity
              style={[
                styles.typeButton,
                selectedType === "PERDIDO" && styles.typeButtonActive,
              ]}
              onPress={() => setSelectedType("PERDIDO")}
            >
              <View style={[styles.typeDot, { backgroundColor: "#ef4444" }]} />
              <Text style={styles.typeText}>Perdido</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.typeButton,
                selectedType === "AVISTADO" && styles.typeButtonActive,
              ]}
              onPress={() => setSelectedType("AVISTADO")}
            >
              <View style={[styles.typeDot, { backgroundColor: "#3b82f6" }]} />
              <Text style={styles.typeText}>Avistado</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.typeButton,
                selectedType === "ENCONTRADO" && styles.typeButtonActive,
              ]}
              onPress={() => setSelectedType("ENCONTRADO")}
            >
              <View style={[styles.typeDot, { backgroundColor: "#10b981" }]} />
              <Text style={styles.typeText}>Encontrado</Text>
            </TouchableOpacity>
          </View>

          {/* Botón subir foto */}
          <TouchableOpacity
            style={styles.photoButton}
            onPress={handleSelectPhoto}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              <Ionicons
                name={selectedImageUri ? "checkmark-circle" : "camera"}
                size={20}
                color={selectedImageUri ? "#10b981" : "#000"}
              />
              <Text style={styles.photoButtonText}>
                {selectedImageUri ? "Foto seleccionada" : "Subir foto"}
              </Text>
            </View>
          </TouchableOpacity>

          {/* Preview de la foto seleccionada */}
          {selectedImageUri && (
            <View style={styles.photoPreviewContainer}>
              <Image
                source={{ uri: selectedImageUri }}
                style={styles.photoPreview}
              />
            </View>
          )}

          {/* Componente oculto para generar el pin */}
          {selectedImageUri && (
            <View style={{ position: "absolute", left: -1000 }}>
              <View ref={pinRef} collapsable={false}>
                <PinImageRenderer
                  imageUri={selectedImageUri}
                  borderColor={
                    selectedType === "PERDIDO"
                      ? "#ef4444"
                      : selectedType === "AVISTADO"
                      ? "#3b82f6"
                      : "#10b981"
                  }
                />
              </View>
            </View>
          )}

          {/* Descripción */}
          <Text style={styles.label}>Descripción</Text>
          <TextInput
            style={styles.descriptionInput}
            placeholder="Ej: Perro golden, collar rojo..."
            placeholderTextColor="#999"
            multiline
            numberOfLines={3}
            value={description} // ← NUEVO
            onChangeText={setDescription} // ← NUEVO
          />

          {/* Ubicación */}
          <Text style={styles.label}>Ubicación</Text>
          <View style={styles.locationContainer}>
            <View style={styles.locationInfo}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 6,
                  marginBottom: 4,
                }}
              >
                <Ionicons name="location" size={16} color="#666" />
                <Text style={styles.locationLabel}>Tu ubicación actual</Text>
              </View>
              <Text style={styles.locationAddress}>
                {selectedLocation
                  ? selectedLocation.address
                  : "Tu ubicación actual"}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.adjustButton}
              onPress={() => {
                setSelectedLocation(null);
                onChangeState("BUSCAR_UBICACION");
              }}
            >
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
              >
                <Ionicons name="search" size={16} color="#000" />
                <Text style={styles.adjustButtonText}>
                  Elegir otra ubicación
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Botón FIJO abajo */}
        <View style={styles.fixedButtonContainer}>
          <TouchableOpacity
            style={styles.publishButton}
            onPress={() => {
              // Validaciones
              if (!selectedType) {
                alert("Por favor seleccioná el tipo de reporte");
                return;
              }
              if (!generatedPinUri) {
                alert("Por favor subí una foto");
                return;
              }
              if (!selectedImageUri) {
                // ← NUEVO
                alert("Error procesando la foto");
                return;
              }
              if (!description.trim()) {
                alert("Por favor agregá una descripción");
                return;
              }
              if (!currentLocation) {
                alert("No se pudo obtener tu ubicación");
                return;
              }

              // Determinar qué ubicación usar
              const finalLocation = selectedLocation || {
                lat: currentLocation.lat,
                lng: currentLocation.lng,
                address: "Tu ubicación actual",
              };

              onPublishReport?.({
                type: selectedType,
                pinImageUri: generatedPinUri,
                photoUri: selectedImageUri,
                description: description,
                location: finalLocation,
              });

              // Limpiar el formulario
              setSelectedType(null);
              setSelectedImageUri(null);
              setGeneratedPinUri(null);
              setDescription("");
            }}
          >
            <Text style={styles.publishButtonText}>Publicar reporte</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // ========== ESTADO BUSCAR ==========
  if (state === "BUSCAR") {
    return (
      <View style={styles.containerSearch}>
        <View style={styles.headerWithBackCentered}>
          <View style={styles.titleContainerWithBack}>
            <TouchableOpacity
              onPress={() => onChangeState("MINI")}
              style={styles.backButtonLeft}
            >
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
                  onChangeState("MINI");
                }
              }, 200);
            }}
          />
          <Search size={18} color="#999" style={{ marginRight: 10 }} />
        </View>

        {/* ========== LISTA DE SUGERENCIAS ========== */}
        {isLoading && (
          <View style={styles.suggestionsContainer}>
            <Text style={styles.loadingText}>Buscando...</Text>
          </View>
        )}

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

                  onLocationSelect?.(lat, lng, name);
                }}
              >
                <Text style={styles.suggestionText}>
                  📍 {suggestion.display_name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {!isLoading && searchText.length >= 3 && suggestions.length === 0 && (
          <View style={styles.suggestionsContainer}>
            <Text style={styles.noResultsText}>
              No se encontraron resultados
            </Text>
          </View>
        )}
      </View>
    );
  }

  // ========== ESTADO MINI ==========
  return (
    <View style={styles.container}>
      <Text style={styles.title}>¿Dónde buscás?</Text>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar dirección o barrio"
          placeholderTextColor="#999"
          onFocus={() => onChangeState("BUSCAR")}
        />
        <Search size={18} color="#999" style={{ marginRight: 10 }} />
      </View>

      {/* Botón para reportar */}
      <TouchableOpacity
        style={styles.reportButton}
        onPress={() => onChangeState("CREAR")}
      >
        <Text style={styles.reportButtonText}>+ Reportar mascota</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  // ========== ESTADO MINI ==========
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  // ========== ESTADO BUSCAR ==========
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
  handle: {
    width: 50,
    height: 4,
    backgroundColor: "#dddddd84",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 8,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 22,
    fontWeight: "700",
    color: "#000",
    marginBottom: 16,
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
  reportButton: {
    backgroundColor: "#000",
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 12,
    marginBottom: 0,
  },
  reportButtonText: {
    fontFamily: fonts.bold,
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
  // ========== ESTADO CREAR ==========
  containerExpanded: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "90%",
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  header: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    paddingHorizontal: 20,
    position: "relative",
  },
  titleLarge: {
    fontFamily: fonts.bold,
    fontSize: 22,
    fontWeight: "700",
    color: "#000",
    textAlign: "center",
  },
  closeButtonAbsolute: {
    position: "absolute",
    right: 20,
    padding: 8,
  },

  scrollContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollContentContainer: {
    paddingBottom: 20,
  },
  label: {
    fontFamily: fonts.bold,
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 12,
    marginTop: 8,
  },
  typeSelector: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  typeButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "transparent",
  },
  typeButtonActive: {
    backgroundColor: "#fff",
    borderColor: "#000",
  },
  typeDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  typeText: {
    fontFamily: fonts.bold,
    fontSize: 12,
    fontWeight: "600",
    color: "#000",
  },
  photoButton: {
    backgroundColor: "#F5F5F5",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 16,
  },
  photoButtonText: {
    fontFamily: fonts.semiBold,
    fontSize: 14,
    color: "#000",
  },
  descriptionInput: {
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#000",
    minHeight: 80,
    textAlignVertical: "top",
    marginBottom: 16,
    fontFamily: fonts.regular,
  },
  locationContainer: {
    backgroundColor: "#F5F5F5",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  locationInfo: {
    marginBottom: 12,
  },
  locationLabel: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  locationAddress: {
    fontFamily: fonts.bold,
    fontSize: 15,
    fontWeight: "600",
    color: "#000",
  },
  adjustButton: {
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  adjustButtonText: {
    fontFamily: fonts.bold,
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
  },
  fixedButtonContainer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  publishButton: {
    backgroundColor: "#000",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  publishButtonText: {
    fontFamily: fonts.bold,
    fontSize: 15,
    fontWeight: "600",
    color: "#fff",
  },
  subtitle: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
    textAlign: "center",
    marginTop: -8,
  },
  headerWithBackLeft: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  titleLeft: {
    fontFamily: fonts.bold,
    fontSize: 22,
    fontWeight: "700",
    color: "#000",
    marginBottom: 4,
  },
  // ========== ESTILOS PARA SUGERENCIAS ==========
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

  // ========== ESTILOS PARA ESTADO RUTA ==========
  containerRoute: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 15,
  },
  handleBarContainer: {
    alignItems: "center",
    marginBottom: 12,
  },
  routeMainTitleCnt: {
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
    paddingBottom: 12, // Espacio antes de la línea
    marginBottom: 16, // Espacio después de la línea
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: "#E0E0E0",
    borderRadius: 2,
  },
  routeMainTitle: {
    fontFamily: fonts.bold,
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
    marginBottom: 6,
    textAlign: "center",
  },
  routeAddress: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: "#666",

    textAlign: "center",
  },
  routeInfoContainer: {
    flexDirection: "row",
    backgroundColor: "#F5F5F5",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  routeInfoItem: {
    flex: 1,
    alignItems: "center",
  },
  routeInfoDivider: {
    width: 1,
    backgroundColor: "#DDD",
    marginHorizontal: 16,
  },
  routeInfoLabel: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: "#666",
    marginBottom: 8,
  },
  routeInfoValue: {
    fontFamily: fonts.bold,
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
  },
  openMapsButton: {
    backgroundColor: "#000",
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: "center",
  },
  openMapsButtonText: {
    fontFamily: fonts.bold,
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },

  photoPreviewContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  photoPreview: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#ddd",
  },
  // ========== ESTILOS PARA BUSCAR_UBICACION ==========
  headerWithBack: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  backButton: {
    padding: 8,
    marginRight: 12,
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

  backButtonAbsolute: {
    position: "absolute",
    left: 0,
    padding: 8,
    zIndex: 1,
  },
  titleContainer: {
    alignItems: "center",
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
});
