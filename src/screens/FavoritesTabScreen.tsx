// FavoritesTabScreen.tsx
import { View, Text, StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import PetMediaCarousel from "../components/PetMediaCarousel";

export default function FavoritesTabScreen({ route }: any) {
  useFocusEffect(
    useCallback(() => {
      route.params?.onTabChange?.("Mapa");
    }, [])
  );

  return (
    <View style={styles.container}>
      <Text>Favoritos</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
});
