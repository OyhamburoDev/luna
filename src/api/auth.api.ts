import api from "./axiosInstance";
import { auth } from "../config/auth"; // <-- usamos el auth con persistencia nativa/web
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  // signOut, // si querés también cerrar sesión local en Firebase
} from "firebase/auth";

type LoginPayload = {
  email: string;
  password: string;
};

export const authApi = {
  // Devuelve el mismo shape en login y register: { user: { uid, email }, token }
  login: async ({ email, password }: LoginPayload) => {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    const idToken = await user.getIdToken();

    return { user: { uid: user.uid, email: user.email }, token: idToken };
  },

  register: async (email: string, password: string) => {
    const { user } = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const idToken = await user.getIdToken();

    return { user: { uid: user.uid, email: user.email }, token: idToken };
  },

  logout: async () => {
    // Si usás backend:
    await api.post("/logout").catch(() => {});
    // Si además querés cerrar sesión local en Firebase:
    // await signOut(auth);
  },
};
