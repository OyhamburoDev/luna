import { useState, useCallback } from "react";
import { useAuthStore } from "../store/auth";
import { useEffect } from "react";

export type AuthModalType = "login" | "register";

export const useAuthModal = () => {
  // Estado para controlar si el modal está visible o no
  const [isVisible, setIsVisible] = useState(false);

  // CAMBIO CLAVE: Ahora el estado inicial es "register"
  const [modalType, setModalType] = useState<AuthModalType>("login");
  const [currentScreenColor, setCurrentScreenColor] = useState("#000000");

  // Obtenemos el estado de autenticación actual
  const { isAuthenticated } = useAuthStore();

  // FUNCIÓN PRINCIPAL: Esta es la magia 🎩
  const requireAuth = useCallback(
    (
      action: () => void,
      defaultModalType: AuthModalType = "login",
      screenColor?: string
    ) => {
      if (isAuthenticated) {
        action();
      } else {
        if (screenColor) setCurrentScreenColor(screenColor); // ← AGREGAR ESTO
        setModalType(defaultModalType);
        setIsVisible(true);
      }
    },
    [isAuthenticated]
  );

  // Función para abrir el modal manualmente - CAMBIÉ DEFAULT A "register"
  const openModal = useCallback(
    (type: AuthModalType = "login", screenColor?: string) => {
      if (screenColor) setCurrentScreenColor(screenColor);
      setModalType(type);
      setIsVisible(true);
    },
    []
  );

  // Función para cerrar el modal
  const closeModal = useCallback(() => {
    setIsVisible(false);
  }, []);

  // Función para cambiar entre login y register SIN cerrar el modal
  const switchModalType = useCallback(() => {
    setModalType((prev) => {
      return prev === "login" ? "register" : "login";
    });
  }, [modalType]);

  return {
    isVisible, // ¿Está el modal visible?
    modalType, // ¿Es login o register?
    requireAuth, // La función mágica
    openModal, // Abrir modal manualmente
    closeModal, // Cerrar modal
    switchModalType, // Cambiar entre login/register
    currentScreenColor,
  };
};
