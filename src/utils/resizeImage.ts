import * as ImageManipulator from "expo-image-manipulator";

/**
 * Redimensiona una imagen para que no pese demasiado.
 * maxWidth y maxHeight son opcionales, por defecto 1080x1080.
 */
export async function resizeImage(
  uri: string,
  maxWidth = 1080,
  maxHeight = 1080
) {
  try {
    const result = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: maxWidth, height: maxHeight } }],
      { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
    );
    return result.uri;
  } catch (e) {
    console.warn("Error al redimensionar imagen:", e);
    return uri; // fallback
  }
}
