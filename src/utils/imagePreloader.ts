import { Image } from "react-native";

/**
 * Precarga una imagen y retorna una promesa
 */
export const preloadImage = (uri: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    Image.prefetch(uri)
      .then(() => {
        console.log("✅ Imagen precargada:", uri);
        resolve();
      })
      .catch((error) => {
        console.warn("⚠️ Error precargando imagen:", uri, error);
        // Resolvemos igual para no bloquear
        resolve();
      });
  });
};

/**
 * Precarga múltiples imágenes en paralelo
 */
export const preloadImages = async (uris: string[]): Promise<void> => {
  const promises = uris.map((uri) => preloadImage(uri));
  await Promise.all(promises);
  console.log("✅ Todas las imágenes precargadas");
};
