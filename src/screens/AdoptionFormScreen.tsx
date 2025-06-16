import React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useAdoptionRequest } from "../hooks/useAdoptionRequest";
import { useAuthStore } from "../store/auth";

export default function AdoptionFormScreen({ route }: any) {
  const { form, setFormField, submitRequest } = useAdoptionRequest();
  const { user } = useAuthStore();
  const { petName, petId } = route.params;

  const handleSubmit = async () => {
    try {
      setFormField("userId", user.uid);
      setFormField("petName", petName);
      if (petId) setFormField("petId", petId);

      await submitRequest();
      Alert.alert("Solicitud enviada", `Gracias por postularte para adoptar a ${petName}`);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Hubo un problema al enviar la solicitud");
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 32 }}>
      <Text style={styles.title}>Formulario de adopción para {petName}</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre completo"
        value={form.fullName || ""}
        onChangeText={(text) => setFormField("fullName", text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        value={form.email || ""}
        onChangeText={(text) => setFormField("email", text)}
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Teléfono"
        value={form.phone || ""}
        onChangeText={(text) => setFormField("phone", text)}
        keyboardType="phone-pad"
      />

      <TextInput
        style={styles.input}
        placeholder="Dirección"
        value={form.address || ""}
        onChangeText={(text) => setFormField("address", text)}
      />

      <TextInput
        style={styles.input}
        placeholder="¿Tenés otras mascotas? (sí / no)"
        value={form.hasPets || ""}
        onChangeText={(text) => setFormField("hasPets", text)}
      />

      {form.hasPets?.toLowerCase() === "sí" && (
        <TextInput
          style={styles.input}
          placeholder="¿Qué tipo de mascotas?"
          value={form.petTypes || ""}
          onChangeText={(text) => setFormField("petTypes", text)}
        />
      )}

      <TextInput
        style={styles.input}
        placeholder="¿Vivís en casa o departamento?"
        value={form.housingType || ""}
        onChangeText={(text) => setFormField("housingType", text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Detalles (ej: casa con patio / dpto con balcón)"
        value={form.housingDetails || ""}
        onChangeText={(text) => setFormField("housingDetails", text)}
      />

      <TextInput
        style={styles.input}
        placeholder="¿Tenés patio o espacio exterior?"
        value={form.hasYard || ""}
        onChangeText={(text) => setFormField("hasYard", text)}
      />

      <TextInput
        style={styles.input}
        placeholder="¿Tenés hijos o niños en casa?"
        value={form.hasChildren || ""}
        onChangeText={(text) => setFormField("hasChildren", text)}
      />

      <TextInput
        style={styles.input}
        placeholder="¿Cuánto tiempo libre tenés por día para la mascota?"
        value={form.availableTime || ""}
        onChangeText={(text) => setFormField("availableTime", text)}
      />

      <TextInput
        style={[styles.input, { height: 100 }]}
        placeholder="¿Por qué querés adoptar?"
        value={form.reason || ""}
        onChangeText={(text) => setFormField("reason", text)}
        multiline
      />

      <TextInput
        style={[styles.input, { height: 80 }]}
        placeholder="Comentarios adicionales"
        value={form.comments || ""}
        onChangeText={(text) => setFormField("comments", text)}
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
