import api from "./axiosInstance";
import { PetRegisterFormData } from "../store/petRegisterStore";

export const petRegisterApi = {
  submit: async (data: Partial<PetRegisterFormData>) => {
    const response = await api.post("/pets", {
      ...data,
      createdAt: new Date().toISOString(),
    });
    return response.data;
  },
};
