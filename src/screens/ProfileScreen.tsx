import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { navigate } from "../navigation/NavigationService";
import { useAuthStore } from "../store/auth";
import { useAuthModalContext } from "../contexts/AuthModalContext";
import { useFocusEffect } from "@react-navigation/native";

type Props = {
  onTabChange?: (tab: "Inicio" | "Mapa" | "Perfil") => void;
};

// 👇 Componente para mostrar cuando no está autenticado
const AuthRequiredView = () => {
  const { openModal } = useAuthModalContext();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.authRequiredContainer}>
        <View style={styles.authRequiredContent}>
          <Ionicons name="person-circle" size={80} color="#667eea" />
          <Text style={styles.authRequiredTitle}>Inicia sesión</Text>
          <Text style={styles.authRequiredSubtitle}>
            Accede a tu perfil y gestiona tus mascotas registradas
          </Text>

          <Pressable
            style={styles.authRequiredButton}
            onPress={() => openModal("login")}
          >
            <Text style={styles.authRequiredButtonText}>Iniciar sesión</Text>
          </Pressable>

          <Pressable
            style={styles.authRequiredButtonSecondary}
            onPress={() => openModal("register")}
          >
            <Text style={styles.authRequiredButtonTextSecondary}>
              Crear cuenta
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default function ProfileScreen({ onTabChange }: Props) {
  const { isAuthenticated } = useAuthStore();
  const { openModal, requireAuth } = useAuthModalContext();

  // 👇 Abrir modal automáticamente cuando entra sin autenticación
  useFocusEffect(
    React.useCallback(() => {
      if (!isAuthenticated) {
        // Pequeño delay para que la pantalla se renderice primero
        setTimeout(() => {
          openModal("login");
        }, 100);
      }
    }, [isAuthenticated, openModal])
  );

  const goToFormAdoption = () => {
    // 👇 Ahora también requiere autenticación para registrar mascota
    requireAuth(() => {
      navigate("PetRegister");
    });
  };

  // 👇 Si no está autenticado, mostrar vista especial
  if (!isAuthenticated) {
    return <AuthRequiredView />;
  }

  // 👇 Si está autenticado, mostrar contenido normal del perfil
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="person-circle" size={40} color="#667eea" />
        <Text style={styles.headerTitle}>Mi Perfil</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.welcomeText}>¡Bienvenido/a!</Text>
        <Text style={styles.subtitle}>Gestiona tu perfil y mascotas</Text>

        <TouchableOpacity style={styles.adoptButton} onPress={goToFormAdoption}>
          <View style={styles.adoptButtonGradient}>
            <Ionicons
              name="add-circle"
              size={20}
              color="white"
              style={styles.adoptIcon}
            />
            <Text style={styles.adoptButtonText}>Registrar mascota</Text>
          </View>
        </TouchableOpacity>

        {/* Aquí puedes agregar más opciones del perfil */}
        <View style={styles.optionsContainer}>
          <TouchableOpacity style={styles.option}>
            <Ionicons name="settings-outline" size={24} color="#667eea" />
            <Text style={styles.optionText}>Configuración</Text>
            <Ionicons name="chevron-forward" size={20} color="#ddd" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.option}>
            <Ionicons name="heart-outline" size={24} color="#667eea" />
            <Text style={styles.optionText}>Mis favoritos</Text>
            <Ionicons name="chevron-forward" size={20} color="#ddd" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.option}>
            <Ionicons name="help-circle-outline" size={24} color="#667eea" />
            <Text style={styles.optionText}>Ayuda</Text>
            <Ionicons name="chevron-forward" size={20} color="#ddd" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#2d3436",
    marginLeft: 12,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2d3436",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#636e72",
    marginBottom: 40,
  },
  // 👇 Estilos para la vista de autenticación requerida
  authRequiredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  authRequiredContent: {
    alignItems: "center",
    maxWidth: 300,
  },
  authRequiredTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#2d3436",
    textAlign: "center",
    marginTop: 20,
    marginBottom: 12,
  },
  authRequiredSubtitle: {
    fontSize: 16,
    color: "#636e72",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 32,
  },
  authRequiredButton: {
    backgroundColor: "#667eea",
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 12,
    marginBottom: 16,
    width: "100%",
    shadowColor: "#667eea",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  authRequiredButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
  },
  authRequiredButtonSecondary: {
    borderWidth: 2,
    borderColor: "#667eea",
    paddingVertical: 14,
    paddingHorizontal: 48,
    borderRadius: 12,
    width: "100%",
  },
  authRequiredButtonTextSecondary: {
    color: "#667eea",
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
  },
  // Estilos existentes mejorados
  adoptButton: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#667eea",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
    marginBottom: 40,
  },
  adoptButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    paddingHorizontal: 30,
    backgroundColor: "#667eea",
  },
  adoptIcon: {
    marginRight: 10,
  },
  adoptButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
  },
  optionsContainer: {
    flex: 1,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: "#2d3436",
    marginLeft: 16,
  },
});
