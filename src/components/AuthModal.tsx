import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useAuth } from "../hooks/useAuth";
import { useAuthModalContext } from "../contexts/AuthModalContext";

export const AuthModal: React.FC = () => {
  const { isVisible, modalType, closeModal, switchModalType } =
    useAuthModalContext();
  const { login, register, isLoading, error } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleAuth = async () => {
    if (modalType === "login") {
      const success = await login(email, password);
      if (success) {
        closeModal();
        setEmail("");
        setPassword("");
      } else {
        Alert.alert("Error", "No se pudo iniciar sesión");
      }
    } else {
      const success = await register(email, password);
      if (success) {
        Alert.alert("Cuenta creada", "Ya podés iniciar sesión");
        switchModalType();
        setPassword("");
      } else {
        Alert.alert("Error", "No se pudo crear la cuenta");
      }
    }
  };

  const handleClose = () => {
    closeModal();
    setEmail("");
    setPassword("");
  };

  const handleSwitchMode = () => {
    switchModalType();
    setPassword("");
  };

  const isLogin = modalType === "login";

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardView}
        >
          <View style={styles.modalContainer}>
            <View style={styles.header}>
              <Text style={styles.title}>
                {isLogin ? "Iniciar Sesión" : "Crear cuenta"}
              </Text>
              <Pressable onPress={handleClose} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>✕</Text>
              </Pressable>
            </View>

            <ScrollView
              style={styles.content}
              showsVerticalScrollIndicator={false}
            >
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
                style={[styles.button, isLoading && styles.buttonDisabled]}
                onPress={handleAuth}
                disabled={isLoading}
              >
                <Text style={styles.buttonText}>
                  {isLogin ? "Iniciar sesión" : "Registrarme"}
                </Text>
              </Pressable>

              <Pressable onPress={handleSwitchMode} style={styles.link}>
                <Text style={styles.linkText}>
                  {isLogin
                    ? "¿No tenés cuenta? Registrate"
                    : "¿Ya tenés cuenta? Iniciar sesión"}
                </Text>
              </Pressable>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  keyboardView: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
    minHeight: "50%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  closeButton: {
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 18,
    color: "#666",
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 20,
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
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  link: {
    marginTop: 20,
    alignItems: "center",
    paddingVertical: 10,
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
