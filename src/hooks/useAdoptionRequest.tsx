import { useState } from "react";
import { Alert } from "react-native";
import type { AdoptionFormData } from "../types/forms";
import { useAdoptionFormStore } from "../store/adoptionFormStore";

export function useAdoptionRequest(petId: string) {
  const { form, setFormField, resetForm } = useAdoptionFormStore();

  const handleChange = (field: keyof typeof form, value: string) => {
    setFormField(field, value); // ✅ usamos los dos argumentos correctamente
  };

  const handleSubmit = async () => {
    if (!form.fullName || !form.email || !form.phone || !form.reason) {
      Alert.alert("Faltan campos", "Completá los obligatorios.");
      return;
    }

    const payload: AdoptionFormData = {
      ...(form as AdoptionFormData), // casteamos porque el form es Partial
      petId,
    };

    try {
      const response = await fetch("https://tu-api.com/adoptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Algo salió mal");

      Alert.alert("Éxito", "Tu solicitud fue enviada");
      resetForm();
    } catch (error) {
      Alert.alert("Error", "No se pudo enviar tu solicitud");
    }
  };

  return { form, handleChange, handleSubmit };
}
