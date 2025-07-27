import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { navigate } from "../navigation/NavigationService";

type Props = {
  onTabChange?: (tab: "Inicio" | "Mapa" | "Perfil") => void;
};

export default function ProfileScreen({ onTabChange }: Props) {
  const goToFormAdoption = () => {
    navigate("PetRegister");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Pantalla de Perfil</Text>
      <TouchableOpacity
        style={styles.adoptButton}
        onPress={() => {
          goToFormAdoption();
        }}
      >
        <View style={styles.adoptButtonGradient}>
          <Text style={styles.adoptButtonText}>Registrar mascota</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 40,
  },
  text: { fontSize: 24 },
  adoptButton: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#667eea",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  adoptButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    paddingHorizontal: 30,
    backgroundColor: "#667eea",
  },
  adoptIcon: {
    marginRight: 10,
  },
  adoptButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
  },
});
