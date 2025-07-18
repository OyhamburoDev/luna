import api from "./axiosInstance";
import { PetRegisterApiData } from "../store/petRegisterStore";

export const petRegisterApi = {
  submit: async (data: Partial<PetRegisterApiData>) => {
    try {
      const response = await api.post("/pets",
        data
      );
      return response.data;
    } catch (error) {
      console.debug("ERROR JERE PET REGISTER API")
      console.error(error)  
    }
    },
};
