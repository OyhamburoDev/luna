"use client";

import { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal } from "react-native";
import { usePetRegister } from "../../hooks/usePetRegister";
// @ts-ignore
import Ionicons from "react-native-vector-icons/Ionicons";

export default function StepConductInfo() {
  const { form, setFormField, submitPet } = usePetRegister();
  const [socialModalVisible, setSocialModalVisible] = useState(false);
  const [walksModalVisible, setWalksModalVisible] = useState(false);

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
          style={styles.dropdownButton}
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

  const renderEnergySlider = () => {
    const energyLevels = [
      { label: "Bajo", value: "bajo", icon: "battery-dead-outline" },
      { label: "Medio", value: "medio", icon: "battery-half-outline" },
      { label: "Alto", value: "alto", icon: "battery-full-outline" },
    ];

    return (
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Nivel de energía</Text>
        <View style={styles.sliderContainer}>
          {energyLevels.map((level, index) => (
            <TouchableOpacity
              key={level.value}
              style={[
                styles.sliderOption,
                form.energyLevel === level.value && styles.sliderOptionSelected,
                index === 0 && styles.sliderOptionFirst,
                index === energyLevels.length - 1 && styles.sliderOptionLast,
              ]}
              onPress={() => setFormField("energyLevel", level.value)}
            >
              <Ionicons
                name={level.icon}
                size={20}
                color={form.energyLevel === level.value ? "#FFFFFF" : "#6B7280"}
              />
              <Text
                style={[
                  styles.sliderOptionText,
                  form.energyLevel === level.value &&
                    styles.sliderOptionTextSelected,
                ]}
              >
                {level.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Card wrapper */}
      <View style={styles.card}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            🤝 Comportamiento y Convivencia
          </Text>
          <Text style={styles.sectionDescription}>
            Ayudanos a conocer su personalidad
          </Text>
        </View>

        <View style={styles.form}>
          {/* Radio groups para preguntas importantes */}
          {renderRadioGroup(
            "¿Se lleva bien con niños?",
            form.goodWithKids ?? "",
            (value) => setFormField("goodWithKids", value),
            [
              { label: "Sí", value: "sí" },
              { label: "No", value: "no" },
              { label: "No sabe", value: "no_sabe" },
            ]
          )}

          {renderRadioGroup(
            "¿Se lleva bien con otras mascotas?",
            form.goodWithOtherPets ?? "",
            (value) => setFormField("goodWithOtherPets", value),
            [
              { label: "Sí", value: "sí" },
              { label: "No", value: "no" },
              { label: "No sabe", value: "no_sabe" },
            ]
          )}

          {/* Dropdown personalizado para sociabilidad */}
          {renderDropdown(
            "¿Es sociable con extraños?",
            form.friendlyWithStrangers ?? "",
            [
              { label: "Muy sociable", value: "muy_sociable" },
              { label: "Moderadamente", value: "moderado" },
              { label: "Tímido/a", value: "timido" },
              { label: "Desconfiado/a", value: "desconfiado" },
            ],
            socialModalVisible,
            setSocialModalVisible,
            (value) => setFormField("friendlyWithStrangers", value)
          )}

          {/* Dropdown personalizado para ejercicio */}
          {renderDropdown(
            "¿Necesita paseos diarios?",
            form.needsWalks ?? "",
            [
              { label: "Sí, mucho ejercicio", value: "mucho" },
              { label: "Moderadamente", value: "moderado" },
              { label: "Poco ejercicio", value: "poco" },
            ],
            walksModalVisible,
            setWalksModalVisible,
            (value) => setFormField("needsWalks", value)
          )}

          {/* Slider para nivel de energía */}
          {renderEnergySlider()}
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
  radioGroup: {
    gap: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 6,
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
  // Estilos para slider de energía
  sliderContainer: {
    flexDirection: "row",
    borderRadius: 10,
    overflow: "hidden",
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
  },
  sliderOption: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    borderRightWidth: 1.5,
    borderRightColor: "#E5E7EB",
  },
  sliderOptionFirst: {
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  sliderOptionLast: {
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    borderRightWidth: 0,
  },
  sliderOptionSelected: {
    backgroundColor: "#6366F1",
  },
  sliderOptionText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#374151",
  },
  sliderOptionTextSelected: {
    color: "#FFFFFF",
  },
});
