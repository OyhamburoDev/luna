"use client";

import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from "react-native";
import { usePetRegister } from "../../hooks/usePetRegister";
import { useState } from "react";
// @ts-ignore
import Ionicons from "react-native-vector-icons/Ionicons";
import { fonts } from "../../theme/fonts";

type ValidationErrors = {
  petName: boolean;
  species: boolean;
  age: boolean;
  gender: boolean;
  size: boolean;
};

type Props = {
  validationErrors: ValidationErrors;
  setValidationErrors: React.Dispatch<React.SetStateAction<ValidationErrors>>;
  handleInputFocus: (event: any) => any;
};

export default function StepBasicInfo({
  validationErrors,
  setValidationErrors,
  handleInputFocus,
}: Props) {
  const { form, setFormField } = usePetRegister();
  const [speciesModalVisible, setSpeciesModalVisible] = useState(false);

  const renderRadioGroup = (
    name: keyof ValidationErrors,
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
              validationErrors[name] && { borderColor: "red" },
              value === option.value && styles.radioOptionSelected,
            ]}
            onPress={() => {
              onValueChange(option.value);
              if (validationErrors[name]) {
                setValidationErrors((prev) => ({
                  ...prev,
                  [name]: false,
                }));
              }
            }}
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

  const renderDropdown = (
    label: string,
    value: string,
    options: { label: string; value: string }[],
    modalVisible: boolean,
    setModalVisible: (visible: boolean) => void,
    onSelect: (value: string) => void
  ) => {
    const selectedOption = options.find((opt) => opt.value === value);

    return (
      <View style={styles.inputGroup}>
        <Text style={styles.label}>{label}</Text>
        <TouchableOpacity
          style={[
            styles.dropdownButton,
            validationErrors?.species &&
              label.includes("Especie") && { borderColor: "red" },
          ]}
          onPress={() => setModalVisible(true)}
        >
          <Text
            style={[
              styles.dropdownText,
              !selectedOption && styles.dropdownPlaceholder,
            ]}
          >
            {selectedOption ? selectedOption.label : "Seleccionar..."}
          </Text>
          <Ionicons name="chevron-down" size={20} color="#6B7280" />
        </TouchableOpacity>

        <Modal visible={modalVisible} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{label}</Text>
              {options.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.modalOption,
                    value === option.value && styles.modalOptionSelected,
                  ]}
                  onPress={() => {
                    onSelect(option.value);
                    setModalVisible(false);
                  }}
                >
                  <Text
                    style={[
                      styles.modalOptionText,
                      value === option.value && styles.modalOptionTextSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                  {value === option.value && (
                    <Ionicons name="checkmark" size={20} color="#6366F1" />
                  )}
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Card wrapper */}
      <View style={styles.card}>
        <View style={styles.section}>
          <Text style={[{ fontFamily: fonts.bold }, styles.sectionTitle]}>
            Información Básica
          </Text>
          <Text
            style={[{ fontFamily: fonts.semiBold }, styles.sectionDescription]}
          >
            Contanos sobre tu mascota
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={[{ fontFamily: fonts.bold }, styles.label]}>
              Nombre de la mascota *
            </Text>
            <TextInput
              onFocus={handleInputFocus}
              style={[
                { fontFamily: fonts.regular },
                styles.input,

                validationErrors.petName && {
                  borderColor: "red",
                  borderWidth: 1,
                },
              ]}
              placeholder="Ej: Max, Luna, Toby..."
              value={form.petName}
              onChangeText={(text) => {
                setFormField("petName", text);
                if (validationErrors.petName && text.trim() !== "") {
                  setValidationErrors((prev) => ({
                    ...prev,
                    petName: false,
                  }));
                }
              }}
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.row}>
            <View style={styles.halfInputGroup}>
              {renderDropdown(
                "Especie *",
                form.species ?? "",
                [
                  { label: "Perro", value: "perro" },
                  { label: "Gato", value: "gato" },
                  { label: "Conejo", value: "conejo" },
                  { label: "Otro", value: "otro" },
                ],
                speciesModalVisible,
                setSpeciesModalVisible,
                (value) => {
                  setFormField("species", value);
                  if (validationErrors.species && value.trim() !== "") {
                    setValidationErrors((prev) => ({
                      ...prev,
                      species: false,
                    }));
                  }
                }
              )}
            </View>

            <View style={styles.halfInputGroup}>
              <Text style={[{ fontFamily: fonts.bold }, styles.label]}>
                Raza
              </Text>
              <TextInput
                onFocus={handleInputFocus}
                style={styles.input}
                placeholder="Mestizo, Labrador..."
                value={form.breed}
                onChangeText={(text) => setFormField("breed", text)}
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.halfInputGroup}>
              <Text style={[{ fontFamily: fonts.bold }, styles.label]}>
                Edad *
              </Text>
              <TextInput
                onFocus={handleInputFocus}
                keyboardType="numeric"
                style={[
                  styles.input,
                  validationErrors.age && { borderColor: "red" },
                ]}
                placeholder="2 años, 6 meses..."
                value={form.age?.toString() ?? ""}
                onChangeText={(text) => {
                  setFormField("age", text);
                  if (validationErrors.age && text.trim() !== "") {
                    setValidationErrors((prev) => ({
                      ...prev,
                      age: false,
                    }));
                  }
                }}
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.halfInputGroup}>
              {renderRadioGroup(
                "gender",
                "Sexo *",
                form.gender ?? "",
                (value) => setFormField("gender", value),
                [
                  { label: "Macho", value: "macho" },
                  { label: "Hembra", value: "hembra" },
                ]
              )}
            </View>
          </View>

          {renderRadioGroup(
            "size",
            "Tamaño *",
            form.size ?? "",
            (value) => setFormField("size", value),
            [
              { label: "Pequeño", value: "pequeño" },
              { label: "Mediano", value: "mediano" },
              { label: "Grande", value: "grande" },
            ]
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  // Nuevo estilo para la card
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
    color: "#1F2937",
    marginBottom: 6,
  },
  sectionDescription: {
    fontSize: 14,
    color: "#6B7280",
  },
  form: {
    gap: 20,
  },
  inputGroup: {
    gap: 6,
  },
  halfInputGroup: {
    flex: 1,
    gap: 6,
  },
  label: {
    fontSize: 14,
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
  row: {
    flexDirection: "row",
    gap: 14,
    alignItems: "flex-start",
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
  // Estilos para dropdown personalizado
  dropdownButton: {
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    minHeight: 48,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dropdownText: {
    fontSize: 15,
    color: "#1F2937",
  },
  dropdownPlaceholder: {
    color: "#9CA3AF",
  },
  // Estilos para modal del dropdown
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 16,
    maxHeight: "70%",
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 16,
    textAlign: "center",
  },
  modalOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 8,
    backgroundColor: "#F9FAFB",
  },
  modalOptionSelected: {
    backgroundColor: "#EEF2FF",
    borderWidth: 1,
    borderColor: "#6366F1",
  },
  modalOptionText: {
    fontSize: 15,
    color: "#374151",
    fontWeight: "500",
  },
  modalOptionTextSelected: {
    color: "#6366F1",
    fontWeight: "600",
  },
  cancelButton: {
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 8,
  },
  cancelButtonText: {
    color: "#EF4444",
    fontWeight: "600",
    fontSize: 14,
  },
});
