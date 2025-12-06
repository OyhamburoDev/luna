import { useState } from "react";
import { authApi } from "../api/auth.api";
import { useAuthStore } from "../store/auth";
import { ensureUserDoc, getUserProfile } from "../api/userProfileService";
import { useUserStore } from "../store/userStore";
import { useMessageStore } from "../store/messageStore";
import { notificationsService } from "../api/notificationsService";

type AuthResult = {
  success: boolean;
  error?: string;
};

export function useAuth() {
  const loginStore = useAuthStore((state) => state.login);
  const logoutStore = useAuthStore((state) => state.logout);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateUserInfo = useUserStore((s) => s.updateUserInfo);
  const resetUserInfo = useUserStore((s) => s.resetUserInfo);

  const login = async (
    email: string,
    password: string
  ): Promise<AuthResult> => {
    setIsLoading(true);
    setError(null);

    try {
      const { user, token } = await authApi.login({ email, password });

      // 1) Garantizar doc en Firestore
      await ensureUserDoc(user.uid, user.email ?? "");

      // 2) Guardar credenciales en auth store
      loginStore(user, token);

      // 3) CARGAR PERFIL COMPLETO DESDE FIRESTORE
      const profile = await getUserProfile(user.uid);
      if (profile) {
        updateUserInfo(profile); // Ahora guarda photoUrl, location, etc.
      } else {
        // Fallback si por alguna razón no existe
        updateUserInfo({ uid: user.uid, email: user.email ?? "" });
      }

      return { success: true };
    } catch (err: any) {
      const errorMsg = err.message || "Error al iniciar sesión";
      setError(errorMsg);
      return { success: false, error: errorMsg }; // ← CAMBIO: devolver error también
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    email: string,
    password: string
  ): Promise<AuthResult> => {
    setIsLoading(true);
    setError(null);

    try {
      const { user, token } = await authApi.register(email, password);

      await ensureUserDoc(user.uid, user.email ?? "");

      // Crear notificación de bienvenida
      await notificationsService.createWelcomeNotification(user.uid);

      // auth store
      loginStore(user, token);

      // CARGAR PERFIL COMPLETO (aunque esté vacío al principio)
      const profile = await getUserProfile(user.uid);
      if (profile) {
        updateUserInfo(profile);
      } else {
        updateUserInfo({ uid: user.uid, email: user.email ?? "" });
      }

      return { success: true }; // ← CAMBIO: objeto en lugar de true
    } catch (err: any) {
      const errorMsg = err.message || "No se pudo registrar el usuario";
      setError(errorMsg);
      return { success: false, error: errorMsg }; // ← CAMBIO: objeto con error
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

  const clearError = () => {
    setError(null);
  };

  return {
    login,
    register,
    logout,
    isLoading,
    error,
    clearError,
  };
}
