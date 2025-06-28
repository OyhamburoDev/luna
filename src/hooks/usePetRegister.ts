import { petRegisterApi } from "../api/petRegisterApi"; // tu servicio que hace el POST
import { usePetRegisterStore } from "../store/petRegisterStore";

export const usePetRegister = () => {
  const { form, setFormField, resetForm } = usePetRegisterStore();

  const submitPet = async () => {
    if (!form.petName || !form.userId)
      throw new Error("Faltan campos obligatorios");

    const result = await petRegisterApi.submit(form);
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
