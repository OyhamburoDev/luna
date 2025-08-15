import React, { createContext, useContext, ReactNode } from "react";
import { useAuthModal, AuthModalType } from "../hooks/useAuthModal";

interface AuthModalContextType {
  isVisible: boolean;
  modalType: AuthModalType;
  requireAuth: (action: () => void, defaultModalType?: AuthModalType) => void;
  openModal: (type?: AuthModalType) => void;
  closeModal: () => void;
  switchModalType: () => void;
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(
  undefined
);

interface AuthModalProviderProps {
  children: ReactNode;
}

export const AuthModalProvider: React.FC<AuthModalProviderProps> = ({
  children,
}) => {
  const authModal = useAuthModal();

  return (
    <AuthModalContext.Provider value={authModal}>
      {children}
    </AuthModalContext.Provider>
  );
};

export const useAuthModalContext = () => {
  const context = useContext(AuthModalContext);
  if (context === undefined) {
    throw new Error(
      "useAuthModalContext must be used within an AuthModalProvider"
    );
  }
  return context;
};
