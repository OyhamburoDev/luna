import api from "./axiosInstance";
import { auth } from "../config/auth"; // <-- usamos el auth con persistencia nativa/web
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

type LoginPayload = {
  email: string;
  password: string;
};

export const authApi = {
  // Devuelve el mismo shape en login y register: { user: { uid, email }, token }
  login: async ({ email, password }: LoginPayload) => {
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await user.getIdToken();

      return { user: { uid: user.uid, email: user.email }, token: idToken };
    } catch (error: any) {
      // Traducir el error de contraseña incorrecta
      if (
        error.code === "auth/wrong-password" ||
        error.code === "auth/invalid-credential"
      ) {
        throw new Error("Email o contraseña incorrectos");
      }
      if (error.code === "auth/missing-password") {
        throw new Error("Por favor ingresá tu contraseña");
      }
      if (error.code === "auth/user-not-found") {
        throw new Error("No existe una cuenta con ese email");
      }

      // Si es otro error, lo dejamos pasar por ahora
      throw error;
    }
  },

  register: async (email: string, password: string) => {
    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const idToken = await user.getIdToken();

      return { user: { uid: user.uid, email: user.email }, token: idToken };
    } catch (error: any) {
      if (error.code === "auth/email-already-in-use") {
        throw new Error("Este email ya está registrado");
      }
      if (error.code === "auth/weak-password") {
        throw new Error("La contraseña debe tener al menos 6 caracteres");
      }

      throw error;
    }
  },

  logout: async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error durante logout:", error);
      throw error; // Re-lanzar para que useAuth pueda manejarlo
    }
  },
};
