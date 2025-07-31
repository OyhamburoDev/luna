import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { useAdoptionRequest } from "../hooks/useAdoptionRequest";
import { RouteProp, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "../navigation/types";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons"; // Asegurate de tenerlo instalado
import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";

type AdoptionFormRouteProp = RouteProp<RootStackParamList, "AdoptionFormPet">;

export default function AdoptionFormScreen() {
  const route = useRoute<AdoptionFormRouteProp>();
  const { petId, petName } = route.params;

  const { form, handleChange, handleSubmit } = useAdoptionRequest(petId);

  const navigation = useNavigation();

  return (
    <>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0} // Probar 100 o más
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView
              style={styles.container}
              contentContainerStyle={{ paddingBottom: 100 }}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <View style={styles.header}>
                <TouchableOpacity
                  onPress={() => navigation.goBack()}
                  style={styles.backButton}
                >
                  <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <View style={styles.headerTextContainer}>
                  <Text style={styles.headerTitle}>
                    Formulario para {petName}
                  </Text>
                  <Text style={styles.subtitle}>Completá la solicitud</Text>
                </View>
              </View>

              {/* SECCIÓN 1 */}
              <View style={styles.sectionTitleRow}>
                <Ionicons
                  name="person-circle-outline"
                  size={22}
                  color="#667eea"
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.sectionTitle}>Datos personales</Text>
              </View>
              <TextInput
                style={styles.input}
                placeholder="Nombre completo"
                value={form.fullName}
                onChangeText={(text) => handleChange("fullName", text)}
              />
              <TextInput
                style={styles.input}
                placeholder="Correo electrónico"
                value={form.email}
                onChangeText={(text) => handleChange("email", text)}
                keyboardType="email-address"
              />
              <TextInput
                style={styles.input}
                placeholder="Teléfono"
                value={form.phone}
                onChangeText={(text) => handleChange("phone", text)}
                keyboardType="phone-pad"
              />
              <TextInput
                style={styles.input}
                placeholder="Dirección"
                value={form.address}
                onChangeText={(text) => handleChange("address", text)}
              />

              {/* SECCIÓN 2 */}
              <View style={styles.sectionTitleRow}>
                <Ionicons
                  name="home-outline"
                  size={22}
                  color="#43e97b"
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.sectionTitle}>Sobre tu hogar</Text>
              </View>
              <TextInput
                style={styles.input}
                placeholder="¿Tenés otras mascotas? (sí / no)"
                value={form.hasPets}
                onChangeText={(text) => handleChange("hasPets", text)}
              />
              {form.hasPets?.toLowerCase() === "sí" && (
                <TextInput
                  style={styles.input}
                  placeholder="¿Qué tipo de mascotas?"
                  value={form.petTypes}
                  onChangeText={(text) => handleChange("petTypes", text)}
                />
              )}
              <TextInput
                style={styles.input}
                placeholder="¿Vivís en casa o departamento?"
                value={form.housingType}
                onChangeText={(text) => handleChange("housingType", text)}
              />
              <TextInput
                style={styles.input}
                placeholder="Detalles (ej: casa con patio)"
                value={form.housingDetails}
                onChangeText={(text) => handleChange("housingDetails", text)}
              />
              <TextInput
                style={styles.input}
                placeholder="¿Tenés patio o espacio exterior?"
                value={form.hasYard}
                onChangeText={(text) => handleChange("hasYard", text)}
              />
              <TextInput
                style={styles.input}
                placeholder="¿Tenés hijos o niños en casa?"
                value={form.hasChildren}
                onChangeText={(text) => handleChange("hasChildren", text)}
              />

              {/* SECCIÓN 3 */}
              <View style={styles.sectionTitleRow}>
                <Ionicons
                  name="heart-outline"
                  size={22}
                  color="#ff6b6b"
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.sectionTitle}>Motivaciones</Text>
              </View>
              <TextInput
                style={styles.input}
                placeholder="¿Cuánto tiempo libre tenés por día para la mascota?"
                value={form.availableTime}
                onChangeText={(text) => handleChange("availableTime", text)}
              />
              <TextInput
                style={[styles.input, { height: 100 }]}
                placeholder="¿Por qué querés adoptar?"
                value={form.reason}
                onChangeText={(text) => handleChange("reason", text)}
                multiline
              />
              <TextInput
                style={[styles.input, { height: 80 }]}
                placeholder="Comentarios adicionales"
                value={form.comments}
                onChangeText={(text) => handleChange("comments", text)}
                multiline
              />

              <View style={styles.fixedButtonContainer}>
                <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                  <Text style={styles.buttonText}>Enviar solicitud</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#ffffffff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: "#ffffffff",
  },
  headerTextContainer: {
    flex: 1,
    justifyContent: "center",
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
    textAlign: "center",
  },

  subtitle: {
    fontSize: 16,
    fontWeight: "400",
    color: "#666",
    textAlign: "center",
  },
  backButton: {
    marginRight: 0,
  },

  container: {
    flex: 1,
    backgroundColor: "#ffffffff",
    paddingHorizontal: 24,
    paddingTop: 0,
  },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 24, // ahora lo aplicamos al contenedor
    marginBottom: 12, // pequeño espacio entre título e input
  },
  sectionTitle: {
    fontSize: 18, // un pelín más grande para jerarquía visual
    fontWeight: "600",
    color: "#555",
    marginBottom: 0, // lo quitamos
    marginTop: 0, // lo quitamos
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  input: {
    backgroundColor: "white",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  fixedButtonContainer: {
    bottom: 5,
    left: 0,
    right: 0,
    backgroundColor: "#ffffffc4", // mismo fondo para que no se note corte
    borderTopWidth: 1,
    borderColor: "#ffffff75",
    paddingVertical: 20,
  },
  button: {
    backgroundColor: "#667eea",
    paddingVertical: 18,
    borderRadius: 18,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
