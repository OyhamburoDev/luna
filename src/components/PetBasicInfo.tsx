import React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { fonts } from "../theme/fonts";

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
  errors?: { [key: string]: boolean }; // NUEVO
  onBlur?: (field: keyof PetFormData) => void; // NUEVO
};

const PetBasicInfo: React.FC<PetBasicInfoProps> = ({
  formData,
  onFormChange,
  onFieldEdit,
  errors = {},
  onBlur,
}) => {
  return (
    <View style={styles.container}>
      {/* Input de nombre */}
      <View style={styles.sectionOne}>
        <TextInput
          style={[styles.input, errors.petName && styles.inputError]}
          placeholder="Nombre de la mascota *"
          placeholderTextColor={errors.petName ? "#EF4444" : "#999"}
          value={formData.petName}
          onChangeText={(text) => onFormChange("petName", text)}
          onBlur={() => onBlur?.("petName")}
        />
        {errors.petName && (
          <Text style={styles.errorText}>El nombre es obligatorio</Text>
        )}
      </View>

      {/* Descripción */}
      <View style={styles.sectionTwo}>
        <TextInput
          style={[
            styles.input,
            styles.textArea,
            errors.description && styles.inputError,
          ]}
          placeholder="Descripción de la mascota *. Las publicaciones con descripciones detalladas consiguen hasta 3 veces más visualizaciones."
          placeholderTextColor={errors.description ? "#EF4444" : "#999"}
          value={formData.description}
          onChangeText={(text) => onFormChange("description", text)}
          onBlur={() => onBlur?.("description")}
          multiline
          maxLength={300}
          textAlignVertical="top"
        />
        <View style={styles.descriptionFooter}>
          {errors.description && (
            <Text style={styles.errorText}>La descripción es obligatoria</Text>
          )}
          <Text style={styles.charCount}>
            {formData.description.length}/300
          </Text>
        </View>
      </View>

      {/* Especie */}
      <TouchableOpacity
        style={[styles.optionRow, errors.species && styles.optionRowError]}
        onPress={() => onFieldEdit?.("species")}
      >
        <Ionicons
          name="paw-outline"
          size={24}
          color={errors.species ? "#EF4444" : "#333"}
        />
        <View style={styles.optionContent}>
          <Text
            style={[
              styles.optionTitle,
              errors.species && styles.optionTitleError,
            ]}
          >
            Especie *
          </Text>
        </View>
        <Text
          style={[
            styles.optionSubtitle,
            errors.species && styles.optionSubtitleError,
          ]}
        >
          {formData.species || "Seleccionar especie"}
        </Text>
        <Ionicons name="chevron-forward" size={20} color="#999" />
      </TouchableOpacity>

      {/* Raza */}
      <TouchableOpacity
        style={[styles.optionRow, errors.breed && styles.optionRowError]}
        onPress={() => onFieldEdit?.("breed")}
      >
        <Ionicons
          name="heart-outline"
          size={24}
          color={errors.breed ? "#EF4444" : "#333"}
        />
        <View style={styles.optionContent}>
          <Text
            style={[
              styles.optionTitle,
              errors.breed && styles.optionTitleError,
            ]}
          >
            Raza *
          </Text>
        </View>
        <Text
          style={[
            styles.optionSubtitle,
            errors.breed && styles.optionSubtitleError,
          ]}
        >
          {formData.breed || "Añadir raza"}
        </Text>
        <Ionicons name="chevron-forward" size={20} color="#999" />
      </TouchableOpacity>

      {/* Edad */}
      <TouchableOpacity
        style={[styles.optionRow, errors.age && styles.optionRowError]}
        onPress={() => onFieldEdit?.("age")}
      >
        <Ionicons
          name="time-outline"
          size={24}
          color={errors.age ? "#EF4444" : "#333"}
        />
        <View style={styles.optionContent}>
          <Text
            style={[styles.optionTitle, errors.age && styles.optionTitleError]}
          >
            Edad *
          </Text>
        </View>
        <Text
          style={[
            styles.optionSubtitle,
            errors.age && styles.optionSubtitleError,
          ]}
        >
          {formData.age || "Añadir edad"}
        </Text>
        <Ionicons name="chevron-forward" size={20} color="#999" />
      </TouchableOpacity>

      {/* Sexo */}
      <TouchableOpacity
        style={[styles.optionRow, errors.gender && styles.optionRowError]}
        onPress={() => onFieldEdit?.("gender")}
      >
        <Ionicons
          name="male-female-outline"
          size={24}
          color={errors.gender ? "#EF4444" : "#333"}
        />
        <View style={styles.optionContent}>
          <Text
            style={[
              styles.optionTitle,
              errors.gender && styles.optionTitleError,
            ]}
          >
            Sexo *
          </Text>
        </View>
        <Text
          style={[
            styles.optionSubtitle,
            errors.gender && styles.optionSubtitleError,
          ]}
        >
          {formData.gender || "Seleccionar sexo"}
        </Text>
        <Ionicons name="chevron-forward" size={20} color="#999" />
      </TouchableOpacity>

      {/* Tamaño */}
      <TouchableOpacity
        style={[styles.optionRow, errors.size && styles.optionRowError]}
        onPress={() => onFieldEdit?.("size")}
      >
        <Ionicons
          name="resize-outline"
          size={24}
          color={errors.size ? "#EF4444" : "#333"}
        />
        <View style={styles.optionContent}>
          <Text
            style={[styles.optionTitle, errors.size && styles.optionTitleError]}
          >
            Tamaño *
          </Text>
        </View>
        <Text
          style={[
            styles.optionSubtitle,
            errors.size && styles.optionSubtitleError,
          ]}
        >
          {formData.size || "Seleccionar tamaño"}
        </Text>
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
    fontFamily: fonts.semiBold,
    fontSize: 16,
    color: "#000",
    minHeight: 50,
    textAlignVertical: "top",
    paddingVertical: 12,
  },
  inputError: {
    borderBottomWidth: 1,
    borderBottomColor: "#EF4444",
  },
  textArea: {
    minHeight: 80,
    marginBottom: 8,
  },
  descriptionFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  charCount: {
    fontSize: 12,
    color: "#666",
  },
  errorText: {
    fontSize: 12,
    color: "#EF4444",
    marginTop: 4,
    marginBottom: 8,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderLeftWidth: 3,
    borderLeftColor: "transparent",
  },
  optionRowError: {
    borderLeftColor: "#EF4444",
    backgroundColor: "#FEF2F2",
  },
  optionContent: {
    flex: 1,
    marginLeft: 12,
  },
  optionTitle: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
    color: "#000",
    fontWeight: "400",
  },
  optionTitleError: {
    color: "#EF4444",
  },
  optionSubtitle: {
    fontFamily: fonts.regular,
    paddingRight: 15,
    fontSize: 13,
    color: "#666",
    marginTop: 2,
  },
  optionSubtitleError: {
    color: "#EF4444",
  },
});

export default PetBasicInfo;
