"use client";

import { View, Text, TextInput, StyleSheet } from "react-native";
import { usePetRegister } from "../../hooks/usePetRegister";

type Props = {
  descriptionError: boolean;
  setDescriptionError: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function StepAdditionalInfo({
  descriptionError,
  setDescriptionError,
}: Props) {
  const { form, setFormField, submitPet } = usePetRegister();

  return (
    <View style={styles.container}>
      {/* Card wrapper */}
      <View style={styles.card}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📝 Información Adicional</Text>
          <Text style={styles.sectionDescription}>
            Contanos más sobre tu mascota
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Descripción general *</Text>
            <TextInput
              style={[
                styles.input,
                styles.textArea,
                { borderColor: descriptionError ? "red" : "#E5E7EB" },
              ]}
              placeholder="Cuéntanos sobre la personalidad, gustos y características especiales de tu mascota..."
              value={form.description}
              onChangeText={(text) => setFormField("description", text)}
              multiline
              numberOfLines={4}
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.tipsSection}>
            <Text style={styles.tipsTitle}>
              💡 ¿Qué incluir en la descripción?
            </Text>
            <View style={styles.tipsList}>
              <Text style={styles.tip}>• Personalidad y temperamento</Text>
              <Text style={styles.tip}>• Juegos y actividades favoritas</Text>
              <Text style={styles.tip}>• Cómo se relaciona con personas</Text>
              <Text style={styles.tip}>• Hábitos y rutinas especiales</Text>
              <Text style={styles.tip}>• Lo que la hace única y especial</Text>
            </View>
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
    minHeight: 100,
    textAlignVertical: "top",
  },
  tipsSection: {
    backgroundColor: "#F0F9FF",
    padding: 14,
    borderRadius: 10,
    borderLeftWidth: 3,
    borderLeftColor: "#0EA5E9",
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0C4A6E",
    marginBottom: 6,
  },
  tipsList: {
    gap: 3,
  },
  tip: {
    fontSize: 13,
    color: "#0C4A6E",
    lineHeight: 18,
  },
});
