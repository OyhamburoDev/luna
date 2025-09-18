import * as FileSystem from "expo-file-system/legacy";

const MB = 1024 * 1024;

// CONSTANTES
export const MAX_VIDEO_MB = 40; // ajustable
export const MAX_PHOTO_MB = 10; // ajustable

// TIPOS
export type VideoValidationResult = {
  isValid: boolean;
  error?: string;
  sizeMB?: number;
  durationSec?: number | null;
  durationUnknown?: boolean;
};

export type PhotoValidationResult = {
  isValid: boolean;
  error?: string;
  sizeMB?: number;
};

// FUNCIONES
/**
 * Valida un video usando solo el tamaño de archivo.
 *
 * @param uri uri local del archivo (file://...)
 * @param durationSec ignorado - mantenido para compatibilidad
 */
export async function validateVideoMedia(
  uri: string,
  durationSec?: number | null // ignorado - solo por compatibilidad
): Promise<VideoValidationResult> {
  try {
    const info = await FileSystem.getInfoAsync(uri);
    if (!info || !info.exists) {
      return { isValid: false, error: "Archivo no encontrado" };
    }

    const sizeMB = (info.size || 0) / MB;
    if (sizeMB > MAX_VIDEO_MB) {
      return {
        isValid: false,
        error: `Video muy pesado (${sizeMB.toFixed(
          1
        )} MB). Debe pesar menos de ${MAX_VIDEO_MB} MB. Grabá uno más corto.`,
        sizeMB,
      };
    }

    // SOLO validar tamaño - NO duración
    return { isValid: true, sizeMB };
  } catch (e) {
    console.warn("validateVideoMedia error:", e);
    return { isValid: false, error: "Error al validar el video" };
  }
}

/**
 * Valida una foto usando solo el tamaño de archivo.
 *
 * @param uri uri local del archivo (file://...)
 */
export async function validatePhotoMedia(
  uri: string
): Promise<PhotoValidationResult> {
  try {
    const info = await FileSystem.getInfoAsync(uri);
    if (!info || !info.exists) {
      return { isValid: false, error: "Archivo no encontrado" };
    }

    const sizeMB = (info.size || 0) / MB;
    if (sizeMB > MAX_PHOTO_MB) {
      return {
        isValid: false,
        error: `Foto muy pesada (${sizeMB.toFixed(
          1
        )} MB). Debe pesar menos de ${MAX_PHOTO_MB} MB.`,
        sizeMB,
      };
    }

    return { isValid: true, sizeMB };
  } catch (e) {
    console.warn("validatePhotoMedia error:", e);
    return { isValid: false, error: "Error al validar la foto" };
  }
}
