import { petRegisterApi } from "../api/petRegisterApi"; // tu servicio que hace el POST
import {
  PetRegisterApiData,
  usePetRegisterStore,
} from "../store/petRegisterStore";

export const usePetRegister = () => {
  const { form, setFormField, resetForm } = usePetRegisterStore();

  const submitPet = async () => {
    console.log("pet register-->", form)
    const apiData: PetRegisterApiData = {
      ...form,
      age: form.age ? parseInt(form.age) : 0,
      name:form.petName,
      isNeutered: form.isNeutered === "si" ? true : false,
      isVaccinated: form.isVaccinated === "si" ? true : false,
      goodWithKids: form.goodWithKids === "si" ? true : false,
      goodWithOtherPets: form.goodWithOtherPets === "si" ? true : false,
      hasMedicalConditions: form.hasMedicalConditions === "si" ? true : false
    } as PetRegisterApiData;
    console.log("pet register-->", apiData)

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
