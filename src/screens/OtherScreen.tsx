import { View, Text, StyleSheet } from "react-native";

export default function OtherScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Pantalla sin tabs</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  text: { fontSize: 24 },
});
