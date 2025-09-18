import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type PetHealthData = {
  isVaccinated: string;
  isNeutered: string;
  hasMedicalConditions: string;
  medicalDetails: string;
  healthInfo: string;
};

type PetHealthInfoProps = {
  healthData: PetHealthData;
  onHealthChange: (field: keyof PetHealthData, value: string) => void;
  onFieldEdit?: (fieldType: string) => void;
};

const PetHealthInfo: React.FC<PetHealthInfoProps> = ({
  healthData,
  onHealthChange,
  onFieldEdit,
}) => {
  return (
    <View style={styles.container}>
      {/* Botones estilo opciones para preguntas de salud */}
      <TouchableOpacity
        style={styles.optionRow}
        onPress={() => onFieldEdit?.("isVaccinated")}
      >
        <Ionicons name="medical-outline" size={24} color="#333" />
        <View style={styles.optionContent}>
          <Text style={styles.optionTitle}>¿Está vacunado/a?</Text>
          <Text style={styles.optionSubtitle}>
            {healthData.isVaccinated || "Seleccionar"}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#999" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.optionRow}
        onPress={() => onFieldEdit?.("isNeutered")}
      >
        <Ionicons name="cut-outline" size={24} color="#333" />
        <View style={styles.optionContent}>
          <Text style={styles.optionTitle}>¿Está castrado/a?</Text>
          <Text style={styles.optionSubtitle}>
            {healthData.isNeutered || "Seleccionar"}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#999" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.optionRow}
        onPress={() => onFieldEdit?.("hasMedicalConditions")}
      >
        <Ionicons name="alert-circle-outline" size={24} color="#333" />
        <View style={styles.optionContent}>
          <Text style={styles.optionTitle}>
            ¿Tiene condiciones médicas especiales?
          </Text>
          <Text style={styles.optionSubtitle}>
            {healthData.hasMedicalConditions || "Seleccionar"}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#999" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.optionRow}
        onPress={() => onFieldEdit?.("healthInfo")}
      >
        <Ionicons name="document-text-outline" size={24} color="#333" />
        <View style={styles.optionContent}>
          <Text style={styles.optionTitle}>Información médica adicional</Text>
          <Text style={styles.optionSubtitle}>
            {healthData.healthInfo ? "Completado" : "Añadir información"}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#999" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  optionContent: {
    flex: 1,
    marginLeft: 12,
  },
  optionTitle: {
    fontSize: 16,
    color: "#000",
    fontWeight: "400",
  },
  optionSubtitle: {
    fontSize: 13,
    color: "#666",
    marginTop: 2,
  },
});

export default PetHealthInfo;
