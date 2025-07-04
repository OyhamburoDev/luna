import { useState } from "react";
import { authApi } from "../api/auth.api";
import { useAuthStore } from "../store/auth";

export function useAuth() {
  const loginStore = useAuthStore((state) => state.login);
  const logoutStore = useAuthStore((state) => state.logout);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const { user, token } = await authApi.login({ email, password });
      loginStore(user, token);
      return true;
    } catch (err: any) {
      console.error("Login error:", err);
      setError("Credenciales incorrectas o error de red");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const { user, token } = await authApi.register({ email, password });
      loginStore(user, token);
      return true;
    } catch (err: any) {
      console.error("Register error:", err);
      setError("No se pudo registrar el usuario");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    logoutStore();
  };

  return {
    login,
    register,
    logout,
    isLoading,
    error,
  };
}
