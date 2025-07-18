import React from "react";
import { Text, View, StyleSheet, TouchableOpacity, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import { useCallback } from "react";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function ProfileScreen({ route }: any) {
  const navigation = useNavigation<NavigationProp>();
  useFocusEffect(
    useCallback(() => {
      route.params?.onTabChange?.("Perfil");
    }, [])
  );

  return (
    <View style={styles.container}>
      <Text>ProfileScreen</Text>
      <Button
        title="publicar"
        onPress={() => navigation.navigate("PetRegister")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    backgroundColor: "#FF6F61",
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
