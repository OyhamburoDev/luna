import React from "react";
import {
  View,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Text,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SearchResult } from "../../hooks/useMapSearch";

interface MapSearchBarProps {
  query: string;
  onQueryChange: (text: string) => void;
  onPressLocate: () => void;
  isLocating: boolean;
  // Nuevas props para búsqueda
  suggestions: SearchResult[];
  isSearching: boolean;
  showSuggestions: boolean;
  noResults: boolean;
  onSelectSuggestion: (suggestion: SearchResult) => void;
  onCloseSuggestions: () => void;
}

export const MapSearchBar: React.FC<MapSearchBarProps> = ({
  query,
  onQueryChange,
  onPressLocate,
  suggestions,
  isSearching,
  showSuggestions,
  noResults,
  onSelectSuggestion,
  onCloseSuggestions,
  isLocating,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.searchRow}>
        <View style={styles.searchInputWrap}>
          <Ionicons
            name="search"
            size={18}
            color="#fff"
            style={{ marginRight: 8 }}
          />
          <TextInput
            placeholder="Buscar dirección o lugar..."
            placeholderTextColor="#bbb"
            value={query}
            onChangeText={onQueryChange}
            style={styles.searchInput}
            autoCapitalize="none"
          />
          {isSearching && (
            <ActivityIndicator
              size="small"
              color="#fff"
              style={{ marginLeft: 8 }}
            />
          )}
        </View>

        <TouchableOpacity style={styles.locateBtn} onPress={onPressLocate}>
          {isLocating ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Ionicons name="locate" size={18} color="#fff" />
          )}
        </TouchableOpacity>
      </View>

      {/* Dropdown de sugerencias */}
      {showSuggestions && (
        <View style={styles.suggestionsContainer}>
          <ScrollView
            style={styles.suggestionsList}
            keyboardShouldPersistTaps="handled"
          >
            {isSearching ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#666" />
                <Text style={styles.loadingText}>Buscando...</Text>
              </View>
            ) : noResults ? (
              <View style={styles.noResultsContainer}>
                <Ionicons name="location-outline" size={20} color="#666" />
                <Text style={styles.noResultsText}>
                  No se encontraron resultados para "{query}"
                </Text>
                <Text style={styles.noResultsSubtext}>
                  Intenta con una dirección más específica
                </Text>
              </View>
            ) : (
              suggestions.map((suggestion) => (
                <TouchableOpacity
                  key={suggestion.place_id}
                  style={styles.suggestionItem}
                  onPress={() => onSelectSuggestion(suggestion)}
                >
                  <Ionicons name="location-outline" size={20} color="#666" />
                  <View style={styles.suggestionTextContainer}>
                    <Text style={styles.suggestionText} numberOfLines={2}>
                      {suggestion.display_name}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>

          {/* Botón para cerrar sugerencias */}
          <TouchableOpacity
            style={styles.closeSuggestions}
            onPress={onCloseSuggestions}
          >
            <Ionicons name="close" size={16} color="#666" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 52,
    left: 12,
    right: 12,
    zIndex: 6,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  searchInputWrap: {
    flex: 1,
    backgroundColor: "#000",
    borderRadius: 24,
    height: 44,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  searchInput: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
    paddingVertical: 0,
  },
  locateBtn: {
    marginLeft: 8,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },

  // Estilos para sugerencias
  suggestionsContainer: {
    marginTop: 8,
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
    maxHeight: 200,
  },
  suggestionsList: {
    maxHeight: 180,
  },
  suggestionItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  suggestionTextContainer: {
    flex: 1,
    marginLeft: 8,
  },
  suggestionText: {
    fontSize: 14,
    color: "#333",
    lineHeight: 18,
  },
  closeSuggestions: {
    position: "absolute",
    top: 8,
    right: 8,
    padding: 4,
  },

  // Estados especiales
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#666",
  },
  noResultsContainer: {
    alignItems: "center",
    padding: 16,
  },
  noResultsText: {
    fontSize: 14,
    color: "#333",
    textAlign: "center",
    marginTop: 8,
    fontWeight: "600",
  },
  noResultsSubtext: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    marginTop: 4,
  },
});
