import { petRegisterApi } from "../api/petRegisterApi"; // tu servicio que hace el POST
import {
  PetRegisterApiData,
  usePetRegisterStore,
} from "../store/petRegisterStore";

export const usePetRegister = () => {
  const { form, setFormField, resetForm } = usePetRegisterStore();

  const submitPet = async (userId: string) => {
    const { form, setFormField, resetForm } = usePetRegisterStore.getState();

    setFormField("userId", userId);

    const apiData: PetRegisterApiData = {
      ...form,
      userId,
      age: form.age ? parseInt(form.age) : 0,
    } as PetRegisterApiData;

    // ✅ Lista de campos obligatorios
    const requiredFields = [
      "petName",
      "userId",
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
