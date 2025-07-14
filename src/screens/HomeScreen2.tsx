import { View, StyleSheet } from "react-native";
import PetSwipe from "../components/PetSwipe";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen2() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "black" }} edges={["top"]}>
      <PetSwipe />
    </SafeAreaView>
  );
}
