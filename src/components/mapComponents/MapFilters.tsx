import type React from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";
import type { FilterType } from "../../types/mapTypes";

const BOTTOM_CARD_HEIGHT = 180;

interface MapFiltersProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

export const MapFilters: React.FC<MapFiltersProps> = ({
  activeFilter,
  onFilterChange,
}) => {
  // Función helper para obtener el estilo del chip
  const getChipStyle = (filterType: FilterType) => [
    styles.chip,
    styles.chipSpacing,
    activeFilter === filterType && styles.chipActive,
  ];

  // Función helper para obtener el estilo del texto
  const getChipTextStyle = (filterType: FilterType) => [
    styles.chipText,
    activeFilter === filterType && { color: "white" },
  ];

  return (
    <View style={[styles.filtersWrap, { bottom: BOTTOM_CARD_HEIGHT + 16 }]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersRow}
      >
        <TouchableOpacity
          onPress={() => onFilterChange("all")}
          style={getChipStyle("all")}
        >
          <Text style={getChipTextStyle("all")}>Todos</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onFilterChange("perdidos")}
          style={getChipStyle("perdidos")}
        >
          <Text style={getChipTextStyle("perdidos")}>Perdidos</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onFilterChange("avistamientos")}
          style={getChipStyle("avistamientos")}
        >
          <Text style={getChipTextStyle("avistamientos")}>Avistamientos</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onFilterChange("perros")}
          style={getChipStyle("perros")}
        >
          <Text style={getChipTextStyle("perros")}>Perros</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onFilterChange("gatos")}
          style={getChipStyle("gatos")}
        >
          <Text style={getChipTextStyle("gatos")}>Gatos</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  filtersWrap: {
    position: "absolute",
    left: 14,
    right: 14,
    zIndex: 4,
  },
  filtersRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 8,
  },
  chipSpacing: {
    marginRight: 8,
  },
  chip: {
    backgroundColor: "#ffffffff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(102, 126, 234, 0.2)",
  },
  chipActive: {
    backgroundColor: "#667eea",
  },
  chipText: {
    fontSize: 14,
    fontWeight: "600",
  },
});
