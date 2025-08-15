import { useState, useCallback } from "react";
import { useAuthStore } from "../store/auth";

export type AuthModalType = "login" | "register";

export const useAuthModal = () => {
  // Estado para controlar si el modal está visible o no
  const [isVisible, setIsVisible] = useState(false);

  // Estado para saber si mostrar login o register
  const [modalType, setModalType] = useState<AuthModalType>("login");

  // Obtenemos el estado de autenticación actual
  const { isAuthenticated } = useAuthStore();

  // FUNCIÓN PRINCIPAL: Esta es la magia 🎩
  const requireAuth = useCallback(
    (action: () => void, defaultModalType: AuthModalType = "login") => {
      // Si el usuario YA está logueado...
      if (isAuthenticated) {
        // Ejecuta la acción directamente (ej: navegar a mensajes)
        action();
      } else {
        // Si NO está logueado...
        // 1. Define qué tipo de modal mostrar (login o register)
        setModalType(defaultModalType);
        // 2. Abre el modal
        setIsVisible(true);
        // La acción NO se ejecuta hasta que se loguee
      }
    },
    [isAuthenticated]
  );

  // Función para abrir el modal manualmente
  const openModal = useCallback((type: AuthModalType = "login") => {
    setModalType(type);
    setIsVisible(true);
  }, []);

  // Función para cerrar el modal
  const closeModal = useCallback(() => {
    setIsVisible(false);
  }, []);

  // Función para cambiar entre login y register SIN cerrar el modal
  const switchModalType = useCallback(() => {
    setModalType((prev) => (prev === "login" ? "register" : "login"));
  }, []);

  return {
    isVisible, // ¿Está el modal visible?
    modalType, // ¿Es login o register?
    requireAuth, // La función mágica
    openModal, // Abrir modal manualmente
    closeModal, // Cerrar modal
    switchModalType, // Cambiar entre login/register
  };
};
