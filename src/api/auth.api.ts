import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";
import api from "./axiosInstance";

type LoginPayload = {
  email: string;
  password: string;
};

type RegisterPayload = {
  email: string;
  password: string;
  nombre?: string; // si tu backend lo usa
};

export const authApi = {
  login: async ({ email, password }: LoginPayload) => {
    const response = await api.post("/login", {
      email,
      password,
    });

    // Esperamos que el backend devuelva algo como:
    // { token: string, user: { uid: string, email: string } }
    return response.data;
  },

  register: async (email: string, password: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  },

  logout: async () => {
    // Solo si tu backend tiene endpoint para logout (algunos no lo necesitan)
    const response = await api.post("/logout");
    return response.data;
  },
};



