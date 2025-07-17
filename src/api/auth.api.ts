import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
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
    // Login en Firebase Auth cliente
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Obtener idToken de Firebase Auth
    const idToken = await user.getIdToken();

    // Opcional: enviar idToken a tu backend para validar sesión
    // const res = await api.post("/auth/login", { idToken });
    // return res.data;

    // Devuelve user y token para Zustand
    return { user: { uid: user.uid, email: user.email }, token: idToken };
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



