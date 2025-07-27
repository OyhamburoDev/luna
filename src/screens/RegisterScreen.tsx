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
import { navigate } from "../navigation/NavigationService";

export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { register, isLoading, error } = useAuth();

  const handleRegister = async () => {
    const success = await register(email, password);
    if (success) {
      Alert.alert("Cuenta creada", "Ya podés iniciar sesión");
      navigate("Swipe");
    } else {
      Alert.alert("Error", "No se pudo crear la cuenta");
    }
  };

  const goToLogin = () => {
    navigate("Login");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear cuenta</Text>

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
        onPress={handleRegister}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>Registrarme</Text>
      </Pressable>

      <Pressable onPress={goToLogin} style={styles.link}>
        <Text style={styles.linkText}>¿Ya tenés cuenta? Iniciar sesión</Text>
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
