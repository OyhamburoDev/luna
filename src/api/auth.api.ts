import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase"; // tu archivo donde inicializás Firebase
import api from "./axiosInstance";

type LoginPayload = {
  email: string;
  password: string;
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
    await api.post("/logout");
  },
};
