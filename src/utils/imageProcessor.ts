import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import { captureRef } from "react-native-view-shot";

export const pickAndProcessImage = async (
  borderColor: string
): Promise<string | null> => {
  try {
    // 1. Pedir permisos
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Necesitamos permisos para acceder a tus fotos");
      return null;
    }

    // 2. Elegir imagen
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1], // Cuadrada
      quality: 0.8,
    });

    if (result.canceled) return null;

    // 3. Redimensionar y hacer circular
    const manipulatedImage = await ImageManipulator.manipulateAsync(
      result.assets[0].uri,
      [
        { resize: { width: 200, height: 200 } }, // Tamaño ideal para markers
      ],
      { compress: 0.8, format: ImageManipulator.SaveFormat.PNG }
    );

    return manipulatedImage.uri;
  } catch (error) {
    console.error("Error procesando imagen:", error);
    return null;
  }
};

export const takePictureAndProcess = async (
  borderColor: string
): Promise<string | null> => {
  try {
    // 1. Pedir permisos de cámara
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      alert("Necesitamos permisos para acceder a la cámara");
      return null;
    }

    // 2. Tomar foto
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (result.canceled) return null;

    // 3. Redimensionar
    const manipulatedImage = await ImageManipulator.manipulateAsync(
      result.assets[0].uri,
      [{ resize: { width: 200, height: 200 } }],
      { compress: 0.8, format: ImageManipulator.SaveFormat.PNG }
    );

    return manipulatedImage.uri;
  } catch (error) {
    console.error("Error tomando foto:", error);
    return null;
  }
};
export const generatePinImage = async (
  imageUri: string,
  borderColor: string,
  viewRef: any
): Promise<string | null> => {
  try {
    // Capturar el componente como imagen
    const uri = await captureRef(viewRef, {
      format: "png",
      quality: 1,
      result: "tmpfile",
    });

    return uri;
  } catch (error) {
    console.error("Error generando pin:", error);
    return null;
  }
};
