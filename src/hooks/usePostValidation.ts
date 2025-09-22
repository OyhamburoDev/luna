import { useState } from "react";
import { PetPost } from "../types/petPots";

type ValidationErrors = {
  [K in keyof PetPost]?: boolean;
};

type RequiredFields = {
  [K in keyof PetPost]?: boolean;
};

export const usePostValidation = () => {
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<ValidationErrors>({});

  // Define qué campos son obligatorios
  const requiredFields: RequiredFields = {
    petName: true,
    species: true,
    breed: true,
    age: true,
    gender: true,
    size: true,
    description: true,
  };

  const VALID_SPECIES = ["Perro", "Gato", "Conejo", "Otro"];

  const validateField = (field: keyof PetPost, value: any): boolean => {
    if (!requiredFields[field]) {
      return true;
    }

    // Validación específica para species
    if (field === "species") {
      return VALID_SPECIES.includes(value);
    }

    // Validación específica para petName
    if (field === "petName") {
      if (!value || value.trim() === "") return false;
      const validNamePattern = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s'-]+$/;
      if (!validNamePattern.test(value)) return false;
      if (value.trim().length < 2 || value.trim().length > 30) return false;
      return true;
    }

    // Validación específica para breed (NUEVO)
    if (field === "breed") {
      if (!value || value.trim() === "") return false;

      // Solo letras, espacios, guiones y apóstrofes
      const validBreedPattern = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s'-]+$/;
      if (!validBreedPattern.test(value)) return false;

      // Entre 2 y 50 caracteres (CAMBIADO de 30 a 50)
      if (value.trim().length < 2 || value.trim().length > 40) return false;

      return true;
    }

    if (field === "age") {
      const ageNum = parseInt(value);
      if (!value || value.trim() === "") return false;
      if (isNaN(ageNum) || ageNum < 0) return false;
      if (ageNum > 25) return false;
      return true;
    }

    if (field === "gender") {
      const validGenders = ["Macho", "Hembra", "No sé"];
      return validGenders.includes(value);
    }

    if (field === "size") {
      const validSizes = ["Pequeño", "Mediano", "Grande"];
      return validSizes.includes(value);
    }

    // Validación genérica para otros campos obligatorios
    const isEmpty =
      !value || (typeof value === "string" && value.trim() === "");
    return !isEmpty;
  };

  // Valida todo el formulario
  const validateForm = (postData: Partial<PetPost>): boolean => {
    const newErrors: ValidationErrors = {};
    let isValid = true;

    Object.keys(requiredFields).forEach((key) => {
      const field = key as keyof PetPost;
      if (requiredFields[field]) {
        const fieldIsValid = validateField(field, postData[field]);
        if (!fieldIsValid) {
          newErrors[field] = true;
          isValid = false;
        }
      }
    });

    setErrors(newErrors);
    setTouched(
      Object.keys(requiredFields).reduce(
        (acc, key) => ({
          ...acc,
          [key]: true,
        }),
        {}
      )
    );

    return isValid;
  };

  // Marca un campo como "tocado"
  const touchField = (field: keyof PetPost) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  // Actualiza el error de un campo específico
  const updateFieldError = (field: keyof PetPost, value: any) => {
    const isValid = validateField(field, value);
    setErrors((prev) => ({
      ...prev,
      [field]: !isValid,
    }));
  };

  // Resetea validaciones
  const resetValidation = () => {
    setErrors({});
    setTouched({});
  };

  // Verifica si un campo tiene error Y ha sido tocado
  const hasError = (field: keyof PetPost): boolean => {
    return !!errors[field] && !!touched[field];
  };

  return {
    errors,
    touched,
    validateForm,
    validateField,
    touchField,
    updateFieldError,
    resetValidation,
    hasError,
    requiredFields,
  };
};
