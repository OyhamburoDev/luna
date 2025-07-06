"use client";

import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { usePetRegister } from "../../hooks/usePetRegister";

export default function StepHealthInfo() {
  const { form, setFormField, submitPet } = usePetRegister();

  const renderRadioGroup = (
    label: string,
    value: string,
    onValueChange: (value: string) => void,
    options: { label: string; value: string }[]
  ) => (
    <View style={styles.radioGroup}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.radioOptions}>
        {options.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.radioOption,
              value === option.value && styles.radioOptionSelected,
            ]}
            onPress={() => onValueChange(option.value)}
          >
            <Text
              style={[
                styles.radioOptionText,
                value === option.value && styles.radioOptionTextSelected,
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Card wrapper */}
      <View style={styles.card}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🏥 Información de Salud</Text>
          <Text style={styles.sectionDescription}>
            Contanos sobre el estado de salud
          </Text>
        </View>

        <View style={styles.form}>
          {renderRadioGroup(
            "¿Está vacunado/a? *",
            form.isVaccinated ?? "",
            (value) => setFormField("isVaccinated", value),
            [
              { label: "Sí", value: "sí" },
              { label: "No", value: "no" },
              { label: "Parcialmente", value: "parcialmente" },
            ]
          )}

          {renderRadioGroup(
            "¿Está castrado/a? *",
            form.isNeutered ?? "",
            (value) => setFormField("isNeutered", value),
            [
              { label: "Sí", value: "sí" },
              { label: "No", value: "no" },
            ]
          )}

          {renderRadioGroup(
            "¿Tiene condiciones médicas especiales?",
            form.hasMedicalConditions ?? "",
            (value) => setFormField("hasMedicalConditions", value),
            [
              { label: "Sí", value: "sí" },
              { label: "No", value: "no" },
            ]
          )}

          {form.hasMedicalConditions === "sí" && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Detalles médicos *</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Describe las condiciones médicas..."
                value={form.medicalDetails}
                onChangeText={(text) => setFormField("medicalDetails", text)}
                multiline
                numberOfLines={3}
                placeholderTextColor="#9CA3AF"
              />
            </View>
          )}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Información médica adicional</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Vacunas, tratamientos, medicamentos..."
              value={form.healthInfo}
              onChangeText={(text) => setFormField("healthInfo", text)}
              multiline
              numberOfLines={2}
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  // Card wrapper igual que StepBasicInfo
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 6,
  },
  sectionDescription: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  form: {
    gap: 20,
  },
  inputGroup: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    padding: 14,
    fontSize: 15,
    backgroundColor: "#FFFFFF",
    color: "#1F2937",
    minHeight: 48,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  radioGroup: {
    gap: 10,
  },
  radioOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  radioOption: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
  },
  radioOptionSelected: {
    borderColor: "#6366F1",
    backgroundColor: "#6366F1",
  },
  radioOptionText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#374151",
  },
  radioOptionTextSelected: {
    color: "#FFFFFF",
  },
});
