import React from "react";
import { View, Image, StyleSheet } from "react-native";

interface PinImageRendererProps {
  imageUri: string;
  borderColor: string; // "#ef4444" | "#3b82f6" | "#10b981"
}

export const PinImageRenderer: React.FC<PinImageRendererProps> = ({
  imageUri,
  borderColor,
}) => {
  return (
    <View style={styles.container}>
      {/* Círculo con foto */}
      <View style={[styles.circle, { borderColor }]}>
        <Image source={{ uri: imageUri }} style={styles.image} />
      </View>

      {/* Piquito/triángulo */}
      <View style={[styles.triangle, { borderTopColor: borderColor }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    width: 70,
    height: 90,
  },
  circle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 4,
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderTopWidth: 15,
    borderRightWidth: 10,
    borderBottomWidth: 0,
    borderLeftWidth: 10,
    borderRightColor: "transparent",
    borderBottomColor: "transparent",
    borderLeftColor: "transparent",
    marginTop: -2, // Para que se pegue al círculo
  },
});
