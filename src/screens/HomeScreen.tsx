import React from "react";
import { useNavigation } from "@react-navigation/native";
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
  Button,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const { width } = Dimensions.get("window");

const data = [
  {
    id: "1",
    name: "Luna",
    image: "https://placekitten.com/200/200",
  },
  {
    id: "2",
    name: "Max",
    image: "https://placekitten.com/201/201",
  },
  {
    id: "3",
    name: "Milo",
    image: "https://placekitten.com/202/202",
  },
];

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <Text style={styles.name}>{item.name}</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Adoption", { name: item.name })}
      >
        <Text style={styles.buttonText}>Solicitar adopción</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
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
    backgroundColor: "#FAFAFA",
  },
  list: {
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    alignItems: "center",
    width: width - 32,
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: 160,
    height: 160,
    borderRadius: 12,
    marginBottom: 12,
  },
  name: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 12,
    color: "#333",
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
