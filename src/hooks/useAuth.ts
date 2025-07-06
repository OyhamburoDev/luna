import { use, useState } from "react";
import { authApi } from "../api/auth.api";
import { useAuthStore } from "../store/auth";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>

export function useAuth() {
  const loginStore = useAuthStore((state) => state.login);
  const logoutStore = useAuthStore((state) => state.logout);
  const navigation = useNavigation<NavigationProp>();

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
      console.log("Registering user with email:", email);
      const user = await authApi.register( email, password );
      const idToken = await user.getIdToken();
      loginStore(user, idToken);
      navigation.navigate("Tabs"); 
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
