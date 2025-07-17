import api from "./axiosInstance";
import { PetRegisterApiData } from "../store/petRegisterStore";

export const petRegisterApi = {
  submit: async (data: Partial<PetRegisterApiData>) => {
    try {
      console.log("Enviando datos a la API:", data);
      const response = await api.post("/pets", {
        ...data,
        createdAt: new Date().toISOString(),
      });
      return response.data;
    } catch (error) {
      console.error("Error al enviar datos a la API:", error);
    }
  },
};
