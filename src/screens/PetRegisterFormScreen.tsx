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

export default function PetRegisterFormScreen() {
  const [form, setForm] = useState({
    petName: "",
    species: "",
    breed: "",
    age: "",
    size: "",
    gender: "",
    healthInfo: "",
    isVaccinated: "",
    isNeutered: "",
    hasMedicalConditions: "",
    medicalDetails: "",
    goodWithKids: "",
    goodWithOtherPets: "",
    friendlyWithStrangers: "",
    needsWalks: "",
    energyLevel: "",
    description: "",
    ownerContact: "",
    photoUrl: "",
  });

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    Alert.alert(
      "Mascota registrada",
      `¡${form.petName} fue publicada para adopción!`
    );
    console.log("Mascota registrada:", form);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 32 }}
    >
      <Text style={styles.title}>Registrar mascota para adopción</Text>

      {/* DATOS BÁSICOS */}
      <Text style={styles.section}>Datos básicos</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={form.petName}
        onChangeText={(text) => handleChange("petName", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Especie (ej: perro, gato)"
        value={form.species}
        onChangeText={(text) => handleChange("species", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Raza"
        value={form.breed}
        onChangeText={(text) => handleChange("breed", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Edad"
        value={form.age}
        onChangeText={(text) => handleChange("age", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Tamaño (chico, mediano, grande)"
        value={form.size}
        onChangeText={(text) => handleChange("size", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Sexo"
        value={form.gender}
        onChangeText={(text) => handleChange("gender", text)}
      />

      {/* SALUD */}
      <Text style={styles.section}>Información de salud</Text>

      <TextInput
        style={styles.input}
        placeholder="Información médica (vacunas, castración...)"
        value={form.healthInfo}
        onChangeText={(text) => handleChange("healthInfo", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="¿Está vacunado? (sí/no)"
        value={form.isVaccinated}
        onChangeText={(text) => handleChange("isVaccinated", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="¿Está castrado/a? (sí/no)"
        value={form.isNeutered}
        onChangeText={(text) => handleChange("isNeutered", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="¿Tiene condiciones médicas? (sí/no)"
        value={form.hasMedicalConditions}
        onChangeText={(text) => handleChange("hasMedicalConditions", text)}
      />
      {form.hasMedicalConditions.toLowerCase() === "sí" && (
        <TextInput
          style={styles.input}
          placeholder="Detalles médicos"
          value={form.medicalDetails}
          onChangeText={(text) => handleChange("medicalDetails", text)}
        />
      )}

      {/* CONVIVENCIA */}
      <Text style={styles.section}>Convivencia y comportamiento</Text>

      <TextInput
        style={styles.input}
        placeholder="¿Se lleva bien con niños? (sí/no)"
        value={form.goodWithKids}
        onChangeText={(text) => handleChange("goodWithKids", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="¿Se lleva bien con otras mascotas? (sí/no)"
        value={form.goodWithOtherPets}
        onChangeText={(text) => handleChange("goodWithOtherPets", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="¿Es sociable con extraños? (sí/no)"
        value={form.friendlyWithStrangers}
        onChangeText={(text) => handleChange("friendlyWithStrangers", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="¿Necesita paseos diarios? (sí/no)"
        value={form.needsWalks}
        onChangeText={(text) => handleChange("needsWalks", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Nivel de energía (bajo / medio / alto)"
        value={form.energyLevel}
        onChangeText={(text) => handleChange("energyLevel", text)}
      />

      {/* EXTRA */}
      <Text style={styles.section}>Información adicional</Text>

      <TextInput
        style={[styles.input, { height: 100 }]}
        placeholder="Descripción general"
        value={form.description}
        onChangeText={(text) => handleChange("description", text)}
        multiline
      />
      <TextInput
        style={styles.input}
        placeholder="Teléfono o correo de contacto"
        value={form.ownerContact}
        onChangeText={(text) => handleChange("ownerContact", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="URL de foto (opcional)"
        value={form.photoUrl}
        onChangeText={(text) => handleChange("photoUrl", text)}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Publicar mascota</Text>
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
    fontWeight: "700",
    marginBottom: 16,
    textAlign: "center",
  },
  section: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 10,
    color: "#333",
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
    backgroundColor: "#2196F3",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
});
