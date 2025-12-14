import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  Platform,
  ScrollView,
  useWindowDimensions,
  Animated,
  KeyboardAvoidingView,
  StyleSheet as RNStyleSheet,
  Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../hooks/useAuth";
import { useAuthModalContext } from "../contexts/AuthModalContext";
import { fonts } from "../theme/fonts";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ToastModal from "./ToastMessage";
import * as NavigationBar from "expo-navigation-bar";
import { normalizeFont } from "../utils/normalizeFont";

export const AuthModal: React.FC = () => {
  const insets = useSafeAreaInsets();
  const bottomPad = Math.max(insets.bottom, 16);

  const {
    isVisible,
    modalType,
    closeModal,
    switchModalType,
    currentScreenColor,
  } = useAuthModalContext();
  const { login, register, isLoading, error, clearError } = useAuth();

  const { height, width } = useWindowDimensions();
  const pagerRef = useRef<ScrollView>(null);

  const modalHeight = Math.max(320, height * 0.9);
  const slideY = useRef(new Animated.Value(modalHeight)).current;

  const [mounted, setMounted] = useState(isVisible);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [showErrorToast, setShowErrorToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Animación de apertura/cierre
  useEffect(() => {
    if (isVisible) {
      setMounted(true);
      slideY.setValue(modalHeight);

      setTimeout(() => {
        if (pagerRef.current) {
          pagerRef.current.scrollTo({ x: 0, y: 0, animated: false });
        }
      }, 50);

      Animated.timing(slideY, {
        toValue: 0,
        duration: 350,
        useNativeDriver: true,
      }).start();
    } else if (mounted) {
      Animated.timing(slideY, {
        toValue: modalHeight,
        duration: 300,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) setMounted(false);
      });
    }
  }, [isVisible, modalHeight, mounted, slideY]);

  useEffect(() => {
    if (isVisible) {
      NavigationBar.setBackgroundColorAsync("#ffffff");
      NavigationBar.setButtonStyleAsync("dark");
    } else {
      NavigationBar.setBackgroundColorAsync(currentScreenColor);
      NavigationBar.setButtonStyleAsync(
        currentScreenColor === "#ffffff" ? "dark" : "light"
      );
    }
  }, [isVisible, currentScreenColor]);

  // LÓGICA DEL SCROLL - ESTO ES LO IMPORTANTE:
  // - Si modalType = "register" → scroll a x=0 (primera página)
  // - Si modalType = "login" → scroll a x=width (segunda página)
  const prevModalType = useRef(modalType);
  useEffect(() => {
    if (!pagerRef.current || !isVisible) {
      return;
    }
    if (prevModalType.current !== modalType) {
      const x = modalType === "login" ? 0 : width;

      pagerRef.current.scrollTo({ x, y: 0, animated: true });
    }
    prevModalType.current = modalType;
  }, [modalType, width, isVisible]);

  const handleAuth = async () => {
    Keyboard.dismiss();

    setTimeout(async () => {
      // ← VALIDACIONES ACÁ:
      // 1. Email vacío
      if (!email.trim()) {
        setErrorMessage("Por favor ingresá tu email");
        setShowErrorToast(true);
        return; // No continuar
      }

      // 2. Email mal formado (regex simple)
      if (!email.includes("@")) {
        setErrorMessage("El email debe contener @");
        setShowErrorToast(true);
        return;
      }

      // 2. Contraseña vacía
      if (!password) {
        setErrorMessage("Por favor ingresá tu contraseña");
        setShowErrorToast(true);
        return; // No continuar
      }

      if (modalType === "register") {
        const result = await register(email, password); // ← Cambio: guardar resultado
        if (result.success) {
          // ← Cambio: usar .success
          handleClose();
          setPassword("");
        } else {
          // Usar el error que devolvió register
          setErrorMessage(result.error || "No se pudo crear la cuenta");
          setShowErrorToast(true);
        }
      } else {
        const result = await login(email, password); // ← Cambio: guardar resultado
        if (result.success) {
          // ← Cambio: usar .success
          handleClose();
        } else {
          // Usar el error que devolvió login
          setErrorMessage(result.error || "No se pudo iniciar sesión");
          setShowErrorToast(true);
        }
      }
    }, 150); // Delay para que cierre el teclado primero
  };

  const handleClose = () => {
    Keyboard.dismiss();
    setTimeout(() => {
      closeModal();
      setEmail("");
      setPassword("");
    }, 100); // Pequeño delay para que el teclado se cierre primero
  };

  const handleSwitchMode = () => {
    switchModalType();
    setPassword("");
  };

  if (!mounted) return null;

  return (
    <View style={styles.overlay}>
      <Pressable style={styles.backdrop} onPress={handleClose} />

      <Animated.View
        style={[
          styles.modalContainer,
          {
            height: modalHeight,
            transform: [{ translateY: slideY }],
            paddingBottom: bottomPad,
          },
        ]}
      >
        <View style={styles.header}>
          <Pressable onPress={handleClose} style={styles.closeButton}>
            <Ionicons name="close" size={26} color="#666" />
          </Pressable>
        </View>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={56}
          style={{ flex: 1 }}
        >
          {/* SCROLL VIEW - contentOffset inicial basado en modalType */}
          <ScrollView
            ref={pagerRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            bounces={false}
            scrollEnabled={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ width: width * 2 }}
            contentOffset={{ x: 0, y: 0 }}
            style={{ flex: 1, minHeight: 200 }}
          >
            {/* PÁGINA 2 (x=width): LOGIN */}
            <View style={[styles.page, { width }]}>
              <View style={styles.body}>
                <Text style={[{ fontFamily: fonts.bold }, styles.title]}>
                  Inicio de sesión
                </Text>

                <TextInput
                  style={styles.input}
                  placeholder="Correo electrónico"
                  placeholderTextColor="#888888"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (error) clearError();
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={styles.passwordInput}
                    placeholder="Contraseña"
                    placeholderTextColor="#888888"
                    value={password}
                    onChangeText={(text) => {
                      setPassword(text);
                      if (error) clearError();
                    }}
                    secureTextEntry={!showPassword}
                  />
                  <Pressable onPress={() => setShowPassword(!showPassword)}>
                    <Ionicons
                      name={showPassword ? "eye-off-outline" : "eye-outline"}
                      size={22}
                      color="#888"
                    />
                  </Pressable>
                </View>
                {error && <Text style={styles.error}>{error}</Text>}

                <View style={styles.line} />

                <Pressable
                  style={[styles.button, isLoading && styles.buttonDisabled]}
                  onPress={handleAuth}
                  disabled={isLoading}
                >
                  <Text style={[{ fontFamily: fonts.bold }, styles.buttonText]}>
                    Iniciar sesión
                  </Text>
                </Pressable>
              </View>
            </View>

            {/* PÁGINA 1 (x=0): REGISTER */}
            <View style={[styles.page, { width }]}>
              <View style={styles.body}>
                <Text style={[{ fontFamily: fonts.bold }, styles.title]}>
                  Regístrate en Refugio
                </Text>

                <TextInput
                  style={styles.input}
                  placeholder="Correo electrónico"
                  placeholderTextColor="#888888"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (error) clearError();
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={styles.passwordInput}
                    placeholder="Contraseña"
                    placeholderTextColor="#888888"
                    value={password}
                    onChangeText={(text) => {
                      // ← Igual que en login
                      setPassword(text);
                      if (error) clearError();
                    }}
                    secureTextEntry={!showPassword}
                  />
                  <Pressable onPress={() => setShowPassword(!showPassword)}>
                    <Ionicons
                      name={showPassword ? "eye-off-outline" : "eye-outline"}
                      size={22}
                      color="#888"
                    />
                  </Pressable>
                </View>

                {error && <Text style={styles.error}>{error}</Text>}

                <View style={styles.line} />

                <Pressable
                  style={[styles.button, isLoading && styles.buttonDisabled]}
                  onPress={handleAuth}
                  disabled={isLoading}
                >
                  <Text style={[{ fontFamily: fonts.bold }, styles.buttonText]}>
                    Registrarme
                  </Text>
                </Pressable>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
        {/* 👇 NUEVO FOOTER - Agregar acá */}
        <View style={[styles.footerFixed, { paddingBottom: bottomPad + 15 }]}>
          <Pressable onPress={handleSwitchMode} style={styles.link}>
            <Text style={[{ fontFamily: fonts.semiBold }, styles.linkText]}>
              {modalType === "login"
                ? "¿No tenés cuenta? "
                : "¿Ya tienes una cuenta? "}
              <Text style={[{ fontFamily: fonts.bold }, styles.linkTextTwo]}>
                {modalType === "login" ? "Regístrate" : "Iniciar sesión"}
              </Text>
            </Text>
          </Pressable>
        </View>
      </Animated.View>
      <ToastModal
        visible={showErrorToast}
        onClose={() => setShowErrorToast(false)}
        message={errorMessage}
        type="error"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...RNStyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    zIndex: 1000,
  },
  backdrop: {
    ...RNStyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden",
  },
  header: {
    height: 56,
    justifyContent: "center",
    alignItems: "flex-end",
    paddingHorizontal: 12,
  },
  closeButton: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  page: {
    flex: 1,
    marginTop: 30,
  },
  body: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: normalizeFont(30),
    color: "black",
    marginBottom: 12,
    textAlign: "center",
    paddingBottom: 30,
  },

  passwordContainer: {
    width: "100%",
    backgroundColor: "#0000000c",
    borderRadius: 8,
    marginBottom: 15,
    flexDirection: "row", // ← Para poner input e ícono en fila
    alignItems: "center", // ← Centra verticalmente
    paddingRight: 12, // ← Espacio para el ícono
  },
  passwordInput: {
    flex: 1, // ← Ocupa todo el espacio disponible
    padding: 12,
    paddingVertical: 15,
    fontFamily: fonts.regular,
    fontSize: normalizeFont(15),
    color: "#000000",
  },
  input: {
    width: "100%",
    backgroundColor: "#0000000c",
    borderRadius: 8,
    padding: 12,
    paddingVertical: 15,
    marginBottom: 15,
    fontFamily: fonts.regular,
    fontSize: normalizeFont(15),
    color: "#000000",
  },
  line: {
    borderBottomWidth: 2,
    borderBottomColor: "#00000012",
    width: "100%",
    marginVertical: 10,
  },
  button: {
    width: "100%",
    backgroundColor: "#667eea",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontSize: normalizeFont(16),
  },
  link: {
    alignItems: "center",
    paddingVertical: 10,
  },
  error: {
    fontFamily: fonts.semiBold,
    color:
      "#FF3B3\
    ",
    textAlign: "center",
    marginBottom: 10,
  },
  btnScroll: {
    backgroundColor: "#0000000c",
    width: "100%",
    paddingVertical: 15,
  },
  linkText: {
    color: "#000000c7",
    textAlign: "center",
    fontSize: normalizeFont(15),
  },
  linkTextTwo: {
    color: "#FE2C55",
    fontSize: normalizeFont(15),
  },
  footerFixed: {
    backgroundColor: "#0000000c",
    width: "100%",
    paddingTop: 15,
    position: "absolute", // ← Esto lo hace fijo
    bottom: 0, // ← Siempre abajo
    left: 0,
    right: 0,
  },
});
