import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../hooks/useAuth";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import { useAuthStore } from "../store/auth";
import { navigate } from "../navigation/NavigationService";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation<NavigationProp>();
  const { login, isLoading, error } = useAuth();
  const { user, isAuthenticated } = useAuthStore();

  console.log("MY USUARIO--->", user);
  console.log("MY isAuthenticated--->", isAuthenticated);

  const handleLogin = async () => {
    const success = await login(email, password);
    if (success) {
      navigation.navigate("Home");
    } else {
      Alert.alert("Error", "No se pudo iniciar sesión");
    }
  };

  const goToRegister = () => {
    navigate("Register");
  };

  const continueWithoutLogin = () => {
    navigate("Swipe");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>

      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {error && <Text style={styles.error}>{error}</Text>}

      <Pressable
        style={styles.button}
        onPress={handleLogin}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>Iniciar sesión</Text>
      </Pressable>

      <Pressable onPress={goToRegister} style={styles.link}>
        <Text style={styles.linkText}>¿No tenés cuenta? Registrate</Text>
      </Pressable>

      <Pressable onPress={continueWithoutLogin} style={styles.link}>
        <Text style={styles.linkText}>Continuar sin iniciar sesión</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#00BFFF",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  link: {
    marginTop: 20,
    alignItems: "center",
  },
  linkText: {
    color: "#00BFFF",
    fontWeight: "bold",
  },
  error: {
    color: "red",
    textAlign: "center",
    marginBottom: 10,
  },
});
