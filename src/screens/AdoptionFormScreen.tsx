import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";

export default function AdoptionFormScreen({ route }: any) {
  const { petName } = route.params;

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    hasPets: "",
    petTypes: "",
    housingType: "",
    housingDetails: "",
    hasYard: "",
    hasChildren: "",
    availableTime: "",
    reason: "",
    comments: "",
  });

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    Alert.alert(
      "Solicitud enviada",
      `Gracias por postularte para adoptar a ${petName}`
    );
    console.log("Formulario enviado:", form);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 32 }}
    >
      <Text style={styles.title}>Formulario de adopción para {petName}</Text>

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

      <TextInput
        style={styles.input}
        placeholder="¿Tenés otras mascotas? (sí / no)"
        value={form.hasPets}
        onChangeText={(text) => handleChange("hasPets", text)}
      />

      {form.hasPets.toLowerCase() === "sí" && (
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
        placeholder="Detalles (ej: casa con patio / dpto con balcón)"
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

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Enviar solicitud</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#FAFAFA",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    backgroundColor: "#FFF",
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 12,
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
});
