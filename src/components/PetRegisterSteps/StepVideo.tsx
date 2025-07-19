// components/PetRegisterSteps/StepVideo.tsx
import { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import Ionicons from "react-native-vector-icons/Ionicons";
import { usePetRegisterStore } from "../../store/petRegisterStore";

export default function StepVideo() {
  const { form, setFormField } = usePetRegisterStore();
  const [videoPicked, setVideoPicked] = useState(!!form.videoUri);

  const pickVideo = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      setFormField("videoUri", uri);
      setVideoPicked(true);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎥 Video de la mascota</Text>
      <Text style={styles.subtitle}>Subí un video que muestre su personalidad</Text>

      <TouchableOpacity style={styles.button} onPress={pickVideo}>
        <Ionicons name="videocam" size={22} color="#FFFFFF" />
        <Text style={styles.buttonText}>
          {videoPicked ? "Cambiar video" : "Seleccionar video"}
        </Text>
      </TouchableOpacity>

      {videoPicked && (
        <Text style={styles.successText}>✅ Video seleccionado correctamente</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    padding: 12,
    backgroundColor: "#F9FAFB",
    borderRadius: 10,
    borderColor: "#D1D5DB",
    borderWidth: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
    color: "#1F2937",
  },
  subtitle: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 12,
  },
  button: {
    flexDirection: "row",
    backgroundColor: "#6366F1",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: "center",
    gap: 8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  successText: {
    marginTop: 8,
    color: "#059669",
    fontWeight: "500",
  },
});
