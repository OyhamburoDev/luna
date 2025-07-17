import { petRegisterApi } from "../api/petRegisterApi";
import { usePetRegisterStore } from "../store/petRegisterStore";

export const usePetRegister = () => {
  const { form, setFormField, resetForm } = usePetRegisterStore();

  const submitPet = async () => {
    const { form, resetForm } = usePetRegisterStore.getState();
    console.log("Enviando datos del formulario:", form);
    const apiData = {
      ...form,
      age: form.age ? form.age : 0,
    };

    // ✅ Lista de campos obligatorios que coinciden con schema Zod
    const requiredFields = [
      "name",
      "species",
      "age",
      "gender",
      "size",
      "description",
      "photoUrls",
    ];

    for (const field of requiredFields) {
      const value = apiData[field as keyof typeof apiData];

      if (
        value === undefined ||
        value === null ||
        (typeof value === "string" && value.trim() === "") ||
        (Array.isArray(value) && value.length === 0)
      ) {
        throw new Error(`Falta el campo obligatorio: ${field}`);
      }
    }
    console.log("----------------------:", form);

    const result = await petRegisterApi.submit(apiData);
    resetForm();
    return result;
  };

  return {
    form,
    setFormField,
    resetForm,
    submitPet,
  };
};
