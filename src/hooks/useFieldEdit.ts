import { useState, useEffect } from "react";
import { useUserStore } from "../store/userStore";
import { useAuthStore } from "../store/auth";
import { updateUserProfile } from "../api/userProfileService";
import type { UserInfo } from "../types/user";

type EditableField = "firstName" | "lastName" | "phone" | "bio";

export function useFieldEdit(fieldType: EditableField) {
  const { userInfo, updateField } = useUserStore();
  const authUser = useAuthStore((s) => s.user);
  const uid = authUser?.uid ?? "";

  const originalValue = (userInfo[fieldType] ?? "").toString();
  const [inputValue, setInputValue] = useState(originalValue);
  const [error, setError] = useState<string | null>(null);

  const hasChanges = inputValue !== originalValue;

  // Sincronizar cuando el store cambie
  useEffect(() => {
    const newValue = (userInfo[fieldType] ?? "").toString();
    setInputValue(newValue);
  }, [userInfo[fieldType]]);

  const validateField = (value: string): string | null => {
    const textValue = value.trim();

    switch (fieldType) {
      case "firstName":
        if (!textValue) return "Nombre es requerido";
        if (textValue.length < 2) return "Debe tener al menos 2 caracteres";
        if (textValue.length > 30) return "Máximo 30 caracteres";
        break;

      case "lastName":
        if (textValue && textValue.length < 2)
          return "Debe tener al menos 2 caracteres";
        if (textValue.length > 30) return "Máximo 30 caracteres";
        break;

      case "phone":
        if (!textValue) return "Teléfono es requerido";
        // básica: +, dígitos, espacios, guiones, paréntesis
        if (!/^[+]?[\d\s\-()]+$/.test(textValue))
          return "Formato de teléfono inválido";
        if (textValue.length > 20) return "Máximo 20 caracteres";
        break;

      case "bio":
        if (textValue.length > 80) return "Máximo 80 caracteres";
        break;
    }
    return null;
  };

  const handleInputChange = (text: string) => {
    setInputValue(text);
    setError(validateField(text));
  };

  /**
   * Guarda en Firestore y después refleja el cambio en el store local.
   * Devuelve true si todo salió bien (para que el modal pueda cerrarse).
   */
  const handleSave = async (): Promise<boolean> => {
    // Validaciones
    const finalError = validateField(inputValue);
    if (finalError) {
      setError(finalError);
      return false;
    }
    if (!uid) {
      setError("No hay sesión activa");
      return false;
    }

    // Normalizar valor (string vacío -> null en bio, string en otros)
    const trimmed = inputValue.trim();
    const valueToSave = trimmed === "" ? null : trimmed;
    try {
      // 1) Guardar remotamente (Firestore)
      await updateUserProfile(uid, {
        [fieldType]: valueToSave,
      } as Partial<UserInfo>);

      // 2) Reflejar localmente (Zustand)
      updateField(fieldType, valueToSave);

      return true;
    } catch (e) {
      console.error("Error al guardar en Firestore:", e);
      setError("No se pudo guardar el cambio");
      return false;
    }
  };

  const handleCancel = () => {
    setInputValue(originalValue);
    setError(null);
  };

  return {
    inputValue,
    error,
    hasChanges,
    handleInputChange,
    handleSave, // ahora es async Promise<boolean>
    handleCancel,
  };
}
