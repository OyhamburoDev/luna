import React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Search } from "lucide-react-native";
import { fonts } from "../../../theme/fonts";

interface BottomCardMiniProps {
  onSearchFocus: () => void;
  onReportPress: () => void;
}

export const BottomCardMini: React.FC<BottomCardMiniProps> = ({
  onSearchFocus,
  onReportPress,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>¿Dónde buscás?</Text>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar dirección o barrio"
          placeholderTextColor="#999"
          onFocus={onSearchFocus}
        />
        <Search size={18} color="#999" style={{ marginRight: 10 }} />
      </View>

      {/* Botón para reportar */}
      <TouchableOpacity style={styles.reportButton} onPress={onReportPress}>
        <Text style={styles.reportButtonText}>+ Reportar mascota</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
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
});
