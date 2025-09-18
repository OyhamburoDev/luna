"use client";
import React, { useState } from "react";
import { useAuthStore } from "../store/auth";
import { useAuthModalContext } from "../contexts/AuthModalContext";
import { useFocusEffect } from "@react-navigation/native";
import { AuthRequiredView } from "../components/ProfileComponents/AuthRequiredView";
import { useUserStore } from "../store/userStore";
import { getUserProfile } from "../api/userProfileService"; // ajustá la ruta exacta si difiere
import FieldEdit from "../components/ProfileComponents/FieldEdit";
import ProfileEdit from "../components/ProfileComponents/ProfileEdit";
import ProfileView from "../components/ProfileComponents/ProfileView";
import PetRegisterFormScreen from "./PetRegisterFormScreen";
import { useNavigation } from "@react-navigation/native";
import { useTabsStore } from "../store/tabsStore";

type Props = {
  onTabChange?: (tab: "Inicio" | "Mapa" | "Perfil") => void;
};

export default function ProfileScreen({ onTabChange }: Props) {
  const navigation = useNavigation();
  const setHideBottomTabs = useTabsStore((state) => state.setHideBottomTabs);
  const { isAuthenticated } = useAuthStore();
  const { openModal, requireAuth } = useAuthModalContext();
  const [isEditing, setIsEditing] = useState(false);
  const [fieldEditConfig, setFieldEditConfig] = useState(null as any);
  const [showPetRegister, setShowPetRegister] = useState(false);

  // 👇 Abrir modal automáticamente cuando entra sin autenticación
  useFocusEffect(
    React.useCallback(() => {
      if (!isAuthenticated) {
        setTimeout(() => {
          openModal();
        }, 100);
      }
    }, [isAuthenticated, openModal])
  );

  // 🔄 Refrescar perfil desde Firestore cuando la pantalla gana foco (si hay sesión)
  useFocusEffect(
    React.useCallback(() => {
      let active = true;
      const doFetch = async () => {
        try {
          // uid desde tu authStore
          const authUser = useAuthStore.getState().user; // evita re-render
          const uid = authUser?.uid;
          if (!uid || !isAuthenticated) return;

          const profile = await getUserProfile(uid);
          if (active && profile) {
            // pisa el store de perfil con datos reales
            useUserStore.getState().updateUserInfo(profile);
          }
        } catch (e) {
          console.log("No se pudo refrescar el perfil:", e);
        }
      };

      doFetch();
      return () => {
        active = false;
      };
    }, [isAuthenticated])
  );

  // Controlar tabs basado en showPetRegister
  React.useEffect(() => {
    setHideBottomTabs(showPetRegister);
  }, [showPetRegister, setHideBottomTabs]);

  // 👇 Si no está autenticado, mostrar vista especial
  if (!isAuthenticated) {
    return (
      <AuthRequiredView
        title="Perfil"
        icon="person-outline"
        description="Inicia sesión para acceder a todas las funciones"
        buttonLabel="Iniciar sesión"
      />
    );
  }

  if (showPetRegister) {
    return <PetRegisterFormScreen onBack={() => setShowPetRegister(false)} />;
  }

  if (fieldEditConfig) {
    return (
      <FieldEdit
        {...fieldEditConfig}
        onCancel={() => setFieldEditConfig(null)}
      />
    );
  }

  if (isEditing) {
    return (
      <ProfileEdit
        onBackPress={() => setIsEditing(false)}
        onFieldEdit={setFieldEditConfig}
      />
    );
  }

  // 👇 Si está autenticado, mostrar contenido del perfil moderno
  return (
    <ProfileView
      onTabChange={onTabChange}
      onEditPress={() => setIsEditing(true)}
      onPublishPress={() => setShowPetRegister(true)}
    />
  );
}
