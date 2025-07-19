import { petRegisterApi } from "../api/petRegisterApi"; // tu servicio que hace el POST
import {
  PetRegisterApiData,
  PetRegisterFormData,
  usePetRegisterStore,
} from "../store/petRegisterStore";

export const usePetRegister = () => {
  const { form, setFormField, resetForm } = usePetRegisterStore();

  const submitPet = async (formToSubmit: Partial<PetRegisterFormData>) => {
    const apiData: PetRegisterApiData = {
      ...formToSubmit,
      age: formToSubmit.age ? parseInt(formToSubmit.age) : 0,
      name: formToSubmit.petName,
      isNeutered: formToSubmit.isNeutered === "si",
      isVaccinated: formToSubmit.isVaccinated === "si",
      goodWithKids: formToSubmit.goodWithKids === "si",
      goodWithOtherPets: formToSubmit.goodWithOtherPets === "si",
      hasMedicalConditions: formToSubmit.hasMedicalConditions === "si",
    } as PetRegisterApiData;

    console.log("✅ Enviando a la API:", apiData);

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
