import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

type User = {
  uid: string;
  email: string;
};

type AuthStore = {
  user: User | null | any;
  token: string | null;
  isAuthenticated: boolean;
  login: (userData: User | any, token: string) => void;
  logout: () => void;
  setToken: (token: string) => void;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: (userData: User, token: string) =>
        set({
          user: userData,
          token,
          isAuthenticated: true,
        }),

      setToken: (token: string) => set({ token }),

      logout: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
