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
} from "react-native";
import { useAuth } from "../hooks/useAuth";
import { useAuthModalContext } from "../contexts/AuthModalContext";
import { fonts } from "../theme/fonts";
import { textStyles } from "../theme/textStyles";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const AuthModal: React.FC = () => {
  const insets = useSafeAreaInsets();
  const bottomPad = Math.max(insets.bottom, 16);

  const { isVisible, modalType, closeModal, switchModalType } =
    useAuthModalContext();
  const { login, register, isLoading, error } = useAuth();

  const { height, width } = useWindowDimensions();
  const pagerRef = useRef<ScrollView>(null);

  const modalHeight = Math.max(320, height * 0.85);
  const slideY = useRef(new Animated.Value(modalHeight)).current;

  const [mounted, setMounted] = useState(isVisible);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // CAMBIO CLAVE: Ahora isRegister es true cuando modalType es "register"
  const isRegister = modalType === "register";

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
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else if (mounted) {
      Animated.timing(slideY, {
        toValue: modalHeight,
        duration: 240,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) setMounted(false);
      });
    }
  }, [isVisible, modalHeight, mounted, slideY]);

  // LÓGICA DEL SCROLL - ESTO ES LO IMPORTANTE:
  // - Si modalType = "register" → scroll a x=0 (primera página)
  // - Si modalType = "login" → scroll a x=width (segunda página)
  const prevModalType = useRef(modalType);
  useEffect(() => {
    if (!pagerRef.current || !isVisible) {
      return;
    }
    if (prevModalType.current !== modalType) {
      const x = modalType === "register" ? 0 : width;

      pagerRef.current.scrollTo({ x, y: 0, animated: true });
    }
    prevModalType.current = modalType;
  }, [modalType, width, isVisible]);

  const handleAuth = async () => {
    if (modalType === "register") {
      const success = await register(email, password);
      if (success) {
        handleClose(); // Cerrar primero
        setPassword(""); // Limpiar después
      } else {
        Alert.alert("Error", "No se pudo crear la cuenta");
      }
    } else {
      const success = await login(email, password);
      if (success) {
        handleClose();
      } else {
        Alert.alert("Error", "No se pudo iniciar sesión");
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
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={56}
          style={{ flex: 1 }}
        >
          <View style={styles.header}>
            <Pressable onPress={handleClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </Pressable>
          </View>

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
            style={{ flex: 1 }}
          >
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
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                <TextInput
                  style={styles.input}
                  placeholder="Contraseña"
                  placeholderTextColor="#888888"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />

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

              <View style={styles.btnScroll}>
                <Pressable onPress={handleSwitchMode} style={styles.link}>
                  <Text
                    style={[{ fontFamily: fonts.semiBold }, styles.linkText]}
                  >
                    ¿Ya tienes una cuenta?{" "}
                    <Text
                      style={[{ fontFamily: fonts.bold }, styles.linkTextTwo]}
                    >
                      Iniciar sesión
                    </Text>
                  </Text>
                </Pressable>
              </View>
            </View>

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
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                <TextInput
                  style={styles.input}
                  placeholder="Contraseña"
                  placeholderTextColor="#888888"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />

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

              <View style={styles.btnScroll}>
                <Pressable onPress={handleSwitchMode} style={styles.link}>
                  <Text
                    style={[{ fontFamily: fonts.semiBold }, styles.linkText]}
                  >
                    ¿No tenés cuenta?{" "}
                    <Text
                      style={[{ fontFamily: fonts.bold }, styles.linkTextTwo]}
                    >
                      Regístrate
                    </Text>
                  </Text>
                </Pressable>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Animated.View>
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
  closeButtonText: {
    fontSize: 18,
    color: "#666",
  },
  page: {
    flex: 1,
    marginTop: 30,
    justifyContent: "space-between",
  },
  body: {
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 30,
    color: "black",
    marginBottom: 12,
    textAlign: "center",
    paddingBottom: 30,
  },
  input: {
    width: "100%",
    backgroundColor: "#0000000c",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontFamily: fonts.regular,
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
    fontSize: 16,
  },
  link: {
    alignItems: "center",
    paddingVertical: 10,
  },
  error: {
    color: "red",
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
    fontSize: 15,
  },
  linkTextTwo: {
    color: "#FE2C55",
    fontSize: 15,
  },
});
