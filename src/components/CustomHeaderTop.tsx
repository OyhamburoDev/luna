import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

type Props = {
  currentPage?: number;
  onPressArrow?: () => void;
};

export default function CustomHeaderTop({ currentPage, onPressArrow }: Props) {
  if (currentPage === 1) return null;

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPressArrow} activeOpacity={0.7}>
        <Text style={styles.text}>
          Descubrí más <Text style={styles.arrow}>→</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 35,
    right: 20,
    zIndex: 50,
  },
  text: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textShadowColor: "rgba(0,0,0,0.6)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  arrow: {
    fontSize: 16,
  },
});
