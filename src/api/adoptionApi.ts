import api from "./axiosInstance";
import { AdoptionFormData } from "../store/adoptionRequestStore";

export const adoptionApi = {
  submit: async (data: Partial<AdoptionFormData>) => {
    const response = await api.post("/adoption-request", {
      ...data,
      status: "pendiente",
      createdAt: new Date().toISOString(),
    });
    return response.data;
  },
};
