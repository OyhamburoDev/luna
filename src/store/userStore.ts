import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserInfo } from "../types/user";

interface UserStore {
  userInfo: UserInfo;
  updateUserInfo: (info: Partial<UserInfo>) => void;
  updateField: (field: keyof UserInfo, value: string | null) => void;
  resetUserInfo: () => void;
}

const initialUserInfo: UserInfo = {
  uid: "", // Se llenará cuando el usuario se registre/loguee
  firstName: "",
  lastName: "",
  email: "",
  location: "",
  phone: "",
  bio: null, // Puede ser null según tu tipo
  photoUrl: null, // Opcional y puede ser null
  createdAt: new Date(), // Fecha actual por defecto
  active: true, // Asumiendo que por defecto está activo
};

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      userInfo: initialUserInfo,

      updateUserInfo: (info) =>
        set((state) => ({
          userInfo: { ...state.userInfo, ...info },
        })),

      updateField: (field, value) =>
        set((state) => ({
          userInfo: { ...state.userInfo, [field]: value as any },
        })),

      resetUserInfo: () => set({ userInfo: initialUserInfo }),
    }),
    {
      name: "user-profile-storage",
      storage: createJSONStorage(() => AsyncStorage),
      // opcional: versionado/migraciones si más adelante cambiás el shape
    }
  )
);
