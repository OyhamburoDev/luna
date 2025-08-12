import { useState } from "react";
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

  const [errors, setErrors] = useState<AdoptionFormErrors>({
    fullName: false,
    email: false,
    phone: false,
    address: false,
    hasPets: false,
    housingType: false,
    reason: false,
  });

  const handleChange = (field: keyof typeof form, value: string) => {
    setFormField(field, value); // ✅ usamos los dos argumentos correctamente
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

    // No continuar si el usuario no esta registrado. llevarlo a la screen register

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

        // ✅ Reemplazar fetch por Firebase
        await AdoptionService.submitAdoptionRequest(payload);

        Alert.alert("Éxito", "Tu solicitud fue enviada");
        resetForm();
      } catch (error) {
        Alert.alert("Error", "No se pudo enviar tu solicitud");
      }
    } else {
      Alert.alert(
        "Iniciá sesión",
        "Debés estar registrado para enviar la solicitud."
      );
      // Aca va la navegacion
      navigate("Login");
      return;
    }
  };

  return { form, handleChange, handleSubmit, errors };
}
