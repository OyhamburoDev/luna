import { useState, useRef, useEffect } from "react";
import { Alert } from "react-native";
import type { AdoptionFormData } from "../types/forms";
import { useAdoptionFormStore } from "../store/adoptionFormStore";
import { useAuthStore } from "../store/auth";
import { navigate } from "../navigation/NavigationService";
import { AdoptionService } from "../api/adoptionServiceApplication";

type AdoptionFormErrors = {
  fullName: boolean;
  email: boolean;
  phone: boolean;
  address: boolean;
  hasPets: boolean;
  housingType: boolean;
  reason: boolean;
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

  const [errors, setErrors] = useState<AdoptionFormErrors>({
    fullName: false,
    email: false,
    phone: false,
    address: false,
    hasPets: false,
    housingType: false,
    reason: false,
  });

  const pendingSubmission = useRef<boolean>(false);

  // Detectar cuando el usuario se autentica y hay una intención pendiente
  useEffect(() => {
    if (isAuthenticated && pendingSubmission.current) {
      pendingSubmission.current = false;
      handleSubmit();
    }
  }, [isAuthenticated]);

  const handleChange = (field: keyof typeof form, value: string) => {
    setFormField(field, value);
  };

  // subir al servidor
  const handleSubmit = async () => {
    const errors: AdoptionFormErrors = {
      fullName: !form.fullName?.trim(),
      email: !form.email?.trim(),
      phone: !form.phone?.trim(),
      address: !form.address?.trim(),
      hasPets: !form.hasPets?.trim(),
      housingType: !form.housingType?.trim(),
      reason: !form.reason?.trim(),
    };

    setErrors(errors);

    const hasErrors = Object.values(errors).some((e) => e);

    // No continuar si faltan campos
    if (hasErrors) {
      Alert.alert("Faltan campos", "Completá los obligatorios.");
      return;
    }

    if (isAuthenticated) {
      try {
        const payload: AdoptionFormData = {
          ...(form as AdoptionFormData),
          petId,
          petName,
          ownerId,
          ownerName,
          ownerEmail,
          applicantId: useAuthStore.getState().user?.uid!,
        };

        await AdoptionService.submitAdoptionRequest(payload);
        Alert.alert("Éxito", "Tu solicitud fue enviada");
        resetForm();
      } catch (error) {
        Alert.alert("Error", "No se pudo enviar tu solicitud");
      }
    } else {
      setShowLocalModal(true);
      return;
    }
  };

  return {
    form,
    handleChange,
    handleSubmit,
    errors,
    setShowLocalModal,
    showLocalModal,
  };
}
