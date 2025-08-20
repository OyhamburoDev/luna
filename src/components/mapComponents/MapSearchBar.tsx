import React from "react";
import { View, TouchableOpacity, TextInput, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface MapSearchBarProps {
  query: string;
  onQueryChange: (text: string) => void;
  onPressLocate: () => void;
}

export const MapSearchBar: React.FC<MapSearchBarProps> = ({
  query,
  onQueryChange,
  onPressLocate,
}) => {
  return (
    <View style={styles.searchRow}>
      <View style={styles.searchInputWrap}>
        <Ionicons
          name="search"
          size={18}
          color="#fff"
          style={{ marginRight: 8 }}
        />
        <TextInput
          placeholder="search for something"
          placeholderTextColor="#bbb"
          value={query}
          onChangeText={onQueryChange}
          style={styles.searchInput}
          autoCapitalize="none"
        />
      </View>

      <TouchableOpacity style={styles.locateBtn} onPress={onPressLocate}>
        <Ionicons name="navigate" size={18} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  searchRow: {
    position: "absolute",
    top: 52,
    left: 12,
    right: 12,
    zIndex: 6,
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
    // sombra suave
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
    // misma sombra que el input
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
});
