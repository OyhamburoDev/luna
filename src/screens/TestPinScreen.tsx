import React, { useRef, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
  Alert,
} from "react-native";
import { PinImageRenderer } from "../components/PinImageRenderer";
import {
  pickAndProcessImage,
  takePictureAndProcess,
  generatePinImage,
} from "../utils/imageProcessor";

export const TestPinScreen = () => {
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);
  const [finalPinUri, setFinalPinUri] = useState<string | null>(null);
  const [borderColor] = useState("#ef4444"); // Rojo para prueba
  const pinRef = useRef<View>(null);

  const handlePickImage = async () => {
    const uri = await pickAndProcessImage(borderColor);
    if (uri) {
      setSelectedImageUri(uri);
      setFinalPinUri(null);
    }
  };

  const handleTakePicture = async () => {
    const uri = await takePictureAndProcess(borderColor);
    if (uri) {
      setSelectedImageUri(uri);
      setFinalPinUri(null);
    }
  };

  const handleGeneratePin = async () => {
    if (!selectedImageUri) {
      Alert.alert("Error", "Primero seleccioná una imagen");
      return;
    }

    // Esperar un momento para que el componente se renderice
    setTimeout(async () => {
      const pinUri = await generatePinImage(
        selectedImageUri,
        borderColor,
        pinRef
      );
      if (pinUri) {
        setFinalPinUri(pinUri);
        Alert.alert("¡Listo!", "Pin generado correctamente");
      }
    }, 100);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Generador de Pins</Text>

      {/* Botones */}
      <TouchableOpacity style={styles.button} onPress={handlePickImage}>
        <Text style={styles.buttonText}>📷 Elegir de Galería</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleTakePicture}>
        <Text style={styles.buttonText}>📸 Tomar Foto</Text>
      </TouchableOpacity>

      {/* Preview de la imagen seleccionada */}
      {selectedImageUri && (
        <View style={styles.previewContainer}>
          <Text style={styles.subtitle}>Imagen seleccionada:</Text>
          <Image source={{ uri: selectedImageUri }} style={styles.preview} />

          <TouchableOpacity
            style={styles.generateButton}
            onPress={handleGeneratePin}
          >
            <Text style={styles.buttonText}>✨ Generar Pin</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Componente que se va a capturar (invisible hasta que generes) */}
      {selectedImageUri && (
        <View style={styles.renderContainer}>
          <Text style={styles.subtitle}>Vista del pin:</Text>
          <View ref={pinRef} collapsable={false}>
            <PinImageRenderer
              imageUri={selectedImageUri}
              borderColor={borderColor}
            />
          </View>
        </View>
      )}

      {/* Resultado final */}
      {finalPinUri && (
        <View style={styles.resultContainer}>
          <Text style={styles.subtitle}>Pin final generado:</Text>
          <Image source={{ uri: finalPinUri }} style={styles.finalPin} />
          <Text style={styles.success}>
            ✅ Esta imagen se subiría a Firebase
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    marginTop: 20,
  },
  button: {
    backgroundColor: "#000",
    padding: 16,
    borderRadius: 10,
    marginBottom: 10,
  },
  generateButton: {
    backgroundColor: "#10b981",
    padding: 16,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },
  previewContainer: {
    alignItems: "center",
  },
  preview: {
    width: 150,
    height: 150,
    borderRadius: 10,
  },
  renderContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  resultContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  finalPin: {
    width: 70,
    height: 90,
  },
  success: {
    color: "#10b981",
    fontWeight: "600",
    marginTop: 10,
  },
});
