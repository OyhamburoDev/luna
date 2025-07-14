import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { Video, ResizeMode } from "expo-av";
import { PetPost } from "../types/petPots";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect } from "react";

const { width, height } = Dimensions.get("window");

type Props = {
  pet: PetPost;
};

export default function PetDetailScreen({ pet }: Props) {
  useEffect(() => {
    console.log("🔎 PetDetailScreen: Mascota recibida:", pet);
  }, [pet]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Media */}
      {pet.videoUri ? (
        <Video
          source={pet.videoUri}
          style={styles.media}
          resizeMode={ResizeMode.COVER}
          shouldPlay={false}
          isLooping
          isMuted={false}
          useNativeControls
        />
      ) : pet.imageUris ? (
        <Image source={pet.imageUris[0]} style={styles.media} />
      ) : null}

      {/* Info */}
      <View style={styles.info}>
        <Text style={styles.name}>{pet.petName}</Text>
        <Text style={styles.description}>{pet.description}</Text>

        <View style={styles.ownerBox}>
          <Text style={styles.ownerTitle}>Datos del dueño</Text>
          <Text style={styles.ownerText}>Nombre: María García</Text>
          <Text style={styles.ownerText}>Ciudad: Buenos Aires</Text>
          <Text style={styles.ownerText}>Teléfono: +54 11 1234 5678</Text>
        </View>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Adoptar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // ✅ en vez de height
    backgroundColor: "white",
  },
  media: {
    width,
    height: height * 0.4,
  },
  info: {
    padding: 20,
  },
  name: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: "#555",
    marginBottom: 20,
  },
  ownerBox: {
    marginBottom: 20,
  },
  ownerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  ownerText: {
    fontSize: 14,
    color: "#666",
  },
  button: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
