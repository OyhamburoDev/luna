import { useState } from "react";
import { authApi } from "../api/auth.api";
import { useAuthStore } from "../store/auth";
import { navigate } from "../navigation/NavigationService";
import { ensureUserDoc } from "../api/userProfileService";
import { useUserStore } from "../store/userStore";
import { useMessageStore } from "../store/messageStore";

export function useAuth() {
  const loginStore = useAuthStore((state) => state.login);
  const logoutStore = useAuthStore((state) => state.logout);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateUserInfo = useUserStore((s) => s.updateUserInfo);
  const resetUserInfo = useUserStore((s) => s.resetUserInfo);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const { user, token } = await authApi.login({ email, password });

      // 1) Garantizar doc en Firestore
      await ensureUserDoc(user.uid, user.email ?? "");

      // 2) Guardar credenciales en auth store
      loginStore(user, token);

      // 3) Sembrar mínimos en userStore
      updateUserInfo({ uid: user.uid, email: user.email ?? "" });

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
      const { user, token } = await authApi.register(email, password);

      await ensureUserDoc(user.uid, user.email ?? "");

      // auth store
      loginStore(user, token);

      // user store (semilla mínima)
      updateUserInfo({ uid: user.uid, email: user.email ?? "" });

      return true;
    } catch (err: any) {
      console.error("Register error:", err);
      setError("No se pudo registrar el usuario");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    const resetMessages = useMessageStore.getState().resetAllMessages;

    await authApi.logout();
    logoutStore();
    resetUserInfo();
    resetMessages();
  };

  return {
    login,
    register,
    logout,
    isLoading,
    error,
  };
}
