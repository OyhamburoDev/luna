import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function CustomHeaderTop() {
  return (
    <View style={styles.container}>
      <TouchableOpacity>
        <Text style={styles.link}>Inicio</Text>
      </TouchableOpacity>
      <TouchableOpacity>
        <Text style={styles.link}>Adopción</Text>
      </TouchableOpacity>
      <TouchableOpacity>
        <Text style={styles.link}>Buscar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 30, // ajuste según el status bar
    left: 20,
    right: 20,
    zIndex: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "transparent",
  },
  link: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textShadowColor: "rgba(0, 0, 0, 0.7)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});
