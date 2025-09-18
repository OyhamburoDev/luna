import React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

type PetFormData = {
  petName: string;
  species: string;
  breed: string;
  age: string;
  gender: string;
  size: string;
  description: string;
};

type PetBasicInfoProps = {
  formData: PetFormData;
  onFormChange: (field: keyof PetFormData, value: string) => void;
  onFieldEdit?: (fieldType: string) => void;
};

const PetBasicInfo: React.FC<PetBasicInfoProps> = ({
  formData,
  onFormChange,
  onFieldEdit,
}) => {
  return (
    <View style={styles.container}>
      {/* Inputs reales */}
      <View style={styles.sectionOne}>
        <TextInput
          style={styles.input}
          placeholder="Nombre de la mascota"
          placeholderTextColor="#999"
          value={formData.petName}
          onChangeText={(text) => onFormChange("petName", text)}
        />
      </View>

      <View style={styles.sectionTwo}>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Descripción de la mascota. Las publicaciones con descripciones detalladas consiguen hasta 3 veces más visualizaciones."
          placeholderTextColor="#999"
          value={formData.description}
          onChangeText={(text) => onFormChange("description", text)}
          multiline
          maxLength={300}
          textAlignVertical="top"
        />
        <Text style={styles.charCount}>{formData.description.length}/300</Text>
      </View>

      {/* Botones estilo opciones */}
      <TouchableOpacity
        style={styles.optionRow}
        onPress={() => onFieldEdit?.("species")}
      >
        <Ionicons name="paw-outline" size={24} color="#333" />
        <View style={styles.optionContent}>
          <Text style={styles.optionTitle}>Especie</Text>
          <Text style={styles.optionSubtitle}>
            {formData.species || "Seleccionar especie"}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#999" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.optionRow}
        onPress={() => onFieldEdit?.("breed")}
      >
        <Ionicons name="heart-outline" size={24} color="#333" />
        <View style={styles.optionContent}>
          <Text style={styles.optionTitle}>Raza</Text>
          <Text style={styles.optionSubtitle}>
            {formData.breed || "Añadir raza"}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#999" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.optionRow}
        onPress={() => onFieldEdit?.("age")}
      >
        <Ionicons name="time-outline" size={24} color="#333" />
        <View style={styles.optionContent}>
          <Text style={styles.optionTitle}>Edad</Text>
          <Text style={styles.optionSubtitle}>
            {formData.age || "Añadir edad"}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#999" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.optionRow}
        onPress={() => onFieldEdit?.("gender")}
      >
        <Ionicons name="male-female-outline" size={24} color="#333" />
        <View style={styles.optionContent}>
          <Text style={styles.optionTitle}>Sexo</Text>
          <Text style={styles.optionSubtitle}>
            {formData.gender || "Seleccionar sexo"}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#999" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.optionRow}
        onPress={() => onFieldEdit?.("size")}
      >
        <Ionicons name="resize-outline" size={24} color="#333" />
        <View style={styles.optionContent}>
          <Text style={styles.optionTitle}>Tamaño</Text>
          <Text style={styles.optionSubtitle}>
            {formData.size || "Seleccionar tamaño"}
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
    borderBottomWidth: 1,
    borderColor: "#0000001e",
  },
  sectionOne: {
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: "#0000001e",
  },
  sectionTwo: {
    paddingHorizontal: 16,
  },
  input: {
    fontSize: 16,
    color: "#000",
    minHeight: 50,
    textAlignVertical: "top",
    paddingVertical: 12,
  },
  textArea: {
    minHeight: 80,
    marginBottom: 8,
  },
  charCount: {
    fontSize: 12,
    color: "#666",
    textAlign: "right",
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

export default PetBasicInfo;
