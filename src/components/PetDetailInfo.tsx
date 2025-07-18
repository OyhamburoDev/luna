import React from "react";
import { StatusBar } from "react-native";
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

const { width, height } = Dimensions.get("window");

type Props = {
  pet: PetPost;
  onBack: () => void; // Para volver a la card
};

export default function PetDetailInfo({ pet, onBack }: Props) {
  return (
    <View style={styles.container}>
      {/* Media arriba */}
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

      {/* Info debajo */}
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

        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Text style={styles.backBtnText}>⬅ Volver</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width,
    height,
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
  backBtn: {
    alignItems: "center",
  },
  backBtnText: {
    color: "#888",
    fontSize: 14,
  },
});
