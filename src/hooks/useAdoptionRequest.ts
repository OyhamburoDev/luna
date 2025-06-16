import { adoptionApi } from "../api/adoptionApi";
import { useAdoptionRequestStore } from "../store/adoptionRequestStore";

export const useAdoptionRequest = () => {
  const { form, setFormField, resetForm } = useAdoptionRequestStore();

  const submitRequest = async () => {
    if (!form.petId || !form.userId) throw new Error("Faltan campos obligatorios");
    const result = await adoptionApi.submit(form);
    resetForm();
    return result;
  };

  return {
    form,
    setFormField,
    resetForm,
    submitRequest,
  };
};
