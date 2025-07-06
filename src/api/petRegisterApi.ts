import api from "./axiosInstance";
import { PetRegisterApiData } from "../store/petRegisterStore";

export const petRegisterApi = {
  submit: async (data: Partial<PetRegisterApiData>) => {
    const response = await api.post("/pets", {
      ...data,
      createdAt: new Date().toISOString(),
    });
    return response.data;
  },
};
