import { useState, useRef, useEffect } from "react";
import { Alert } from "react-native";
import type { AdoptionFormData } from "../types/forms";
import { useAdoptionFormStore } from "../store/adoptionFormStore";
import { useAuthStore } from "../store/auth";
import { AdoptionService } from "../api/adoptionServiceApplication";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/RootNavigator";

type AdoptionFormErrors = {
  name: boolean;
  whatsapp: boolean;
  whatsappMessage?: string;
  instagram: boolean;
  email: boolean;
  emailMessage?: string;
  facebook: boolean;
  housingType: boolean;
  availableTime: boolean;
  reason: boolean;
  contactRequired: boolean;
};

const isValidInstagram = (instagram: string): boolean => {
  if (!instagram?.trim()) return true;

  const username = instagram.trim().replace(/^@/, ""); // Remover @ inicial si existe

  // 1. Validar longitud
  if (username.length < 1 || username.length > 30) {
    return false;
  }

  // 2. Bloquear caracteres potencialmente peligrosos
  const dangerousChars = /[<>{}\[\]\\|&;`$'"\x00-\x1F\x7F]/;
  if (dangerousChars.test(username)) {
    return false;
  }

  return true;
};

const isValidFacebook = (facebook: string): boolean => {
  if (!facebook?.trim()) return true;

  const username = facebook.trim();

  // Validar longitud
  if (username.length < 5) {
    return false;
  }

  // Bloquear caracteres peligrosos
  const dangerousChars = /[<>{}\[\]\\|&;`$'"\x00-\x1F\x7F]/;
  if (dangerousChars.test(username)) {
    return false;
  }

  return true;
};

const isValidWhatsApp = (whatsapp: string): boolean => {
  if (!whatsapp?.trim()) return true;

  const number = whatsapp.trim();

  // Verificar que solo tenga caracteres permitidos
  const whatsappRegex = /^[\d\s+\-()]{10,20}$/;
  if (!whatsappRegex.test(number)) {
    return false;
  }

  // Contar dígitos reales (excluyendo espacios, +, -, etc.)
  const digitCount = (number.match(/\d/g) || []).length;

  // WhatsApp necesita al menos 10 dígitos (números nacionales/internacionales)
  return digitCount >= 10;
};

const isValidEmail = (email: string): boolean => {
  if (!email?.trim()) return true;

  const emailValue = email.trim();

  // Bloquear caracteres peligrosos además de la validación de email
  const dangerousChars = /[<>{}\[\]\\|&;`$'"\x00-\x1F\x7F]/;
  if (dangerousChars.test(emailValue)) {
    return false;
  }

  return /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(emailValue);
};

export function useAdoptionRequest(
  petId: string,
  petName: string,
  ownerId: string,
  ownerName: string,
  ownerEmail?: string
) {
  const { form, setFormField, resetForm } = useAdoptionFormStore();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [showLocalModal, setShowLocalModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
  const navigation = useNavigation<NavigationProp>();

  const [errors, setErrors] = useState<AdoptionFormErrors>({
    name: false,
    whatsapp: false,
    instagram: false,
    email: false,
    facebook: false,
    housingType: false,
    availableTime: false,
    reason: false,
    contactRequired: false,
  });

  const pendingSubmission = useRef<boolean>(false);

  useEffect(() => {
    if (isAuthenticated && pendingSubmission.current) {
      pendingSubmission.current = false;
      handleSubmit();
    }
  }, [isAuthenticated]);

  const handleChange = (field: keyof typeof form, value: string | boolean) => {
    console.log("🔴 handleChange llamado:", field, "valor:", value);
    setFormField(field, value);

    // Limpiar error específico cuando el usuario interactúe con el campo
    setErrors((prev) => ({
      ...prev,
      [field]: false,
      ...(field === "whatsapp" ||
      field === "instagram" ||
      field === "email" ||
      field === "facebook"
        ? { contactRequired: false }
        : {}),
    }));
  };

  const validateForm = (): boolean => {
    const hasAtLeastOneContact =
      !!form.whatsapp?.trim() ||
      !!form.instagram?.trim() ||
      !!form.email?.trim() ||
      !!form.facebook?.trim();

    const newErrors: AdoptionFormErrors = {
      name: !form.name?.trim() || /\d/.test(form.name),
      whatsapp: !isValidWhatsApp(form.whatsapp || ""),
      whatsappMessage:
        form.whatsapp && !isValidWhatsApp(form.whatsapp)
          ? "El WhatsApp debe tener al menos 10 números"
          : undefined,
      instagram: !isValidInstagram(form.instagram || ""),
      email: !isValidEmail(form.email || ""),
      emailMessage:
        form.email && !isValidEmail(form.email)
          ? "Email inválido. Asegurate de incluir @ y un dominio válido (ej: .com)"
          : undefined,
      facebook: !isValidFacebook(form.facebook || ""),
      housingType: !form.housingType,
      availableTime: !form.availableTime?.trim(),
      reason: !form.reason?.trim(),
      contactRequired: !hasAtLeastOneContact,
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some((e) => e);
  };

  const handleSubmit = async () => {
    const isValid = validateForm();

    if (!isValid) {
      return;
    }

    if (isAuthenticated) {
      try {
        // Crear una copia del form y ELIMINAR campos vacíos
        const cleanedForm = { ...form };

        // Campos que pueden ser opcionales - ELIMINAR si están vacíos
        const optionalFields: (keyof typeof cleanedForm)[] = [
          "whatsapp",
          "instagram",
          "email",
          "facebook",
          "housingDetails",
          "petTypes",
          "comments",
        ];

        optionalFields.forEach((field) => {
          if (cleanedForm[field] === "") {
            delete cleanedForm[field]; // ← ELIMINAR el campo
          }
        });

        const payload: AdoptionFormData = {
          ...(cleanedForm as AdoptionFormData),
          petId,
          petName,
          ownerId,
          applicantId: useAuthStore.getState().user?.uid!,
        };

        await AdoptionService.submitAdoptionRequest(payload);
        setShowSuccess(true);
        resetForm();
        setTimeout(() => {
          navigation.navigate("Swipe"); // o el nombre real de tu ruta
        }, 2500); // espera a que el toast desaparezca
      } catch (error) {
        console.error("Error submitting adoption:", error);
        Alert.alert("Error", "No se pudo enviar tu solicitud");
      }
    } else {
      pendingSubmission.current = true;
      setShowLocalModal(true);
    }
  };

  return {
    form,
    handleChange,
    handleSubmit,
    errors,
    setErrors,
    setShowLocalModal,
    showLocalModal,
    showSuccess,
    setShowSuccess,
  };
}
