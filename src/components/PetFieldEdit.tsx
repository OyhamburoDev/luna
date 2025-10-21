import { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { textStyles } from "../theme/textStyles";
import type { KeyboardTypeOptions } from "react-native";
import { PetPost } from "../types/petPots";
import { fonts } from "../theme/fonts";

type PetFieldType = keyof PetPost;

type Props = {
  title: string;
  value: string;
  placeholder: string;
  maxLength?: number;
  multiline?: boolean;
  keyboardType?: KeyboardTypeOptions;
  showCounter?: boolean;
  description?: string;
  fieldType: PetFieldType;
  onSave: (value: string) => void;
  onCancel: () => void;
};

// Opciones predefinidas para especies
const SPECIES_OPTIONS = [
  { label: "Perro", value: "Perro" },
  { label: "Gato", value: "Gato" },
  { label: "Conejo", value: "Conejo" },
  { label: "Otro", value: "Otro" },
];

// Opciones predefinidas para género/sexo
const GENDER_OPTIONS = [
  { label: "Macho", value: "Macho" },
  { label: "Hembra", value: "Hembra" },
  { label: "No sé", value: "No sé" },
];

// Opciones predefinidas para tamaño
const SIZE_OPTIONS = [
  { label: "Pequeño", value: "Pequeño" },
  { label: "Mediano", value: "Mediano" },
  { label: "Grande", value: "Grande" },
];

// Opciones para preguntas de salud (Sí/No/No sé)
const YES_NO_OPTIONS = [
  { label: "Sí", value: "Sí" },
  { label: "No", value: "No" },
  { label: "No sé", value: "No sé" },
];

export default function PetFieldEdit({
  title,
  value,
  placeholder,
  maxLength = 50,
  multiline = false,
  showCounter = true,
  keyboardType = "default",
  description,
  fieldType,
  onSave,
  onCancel,
}: Props) {
  const [inputValue, setInputValue] = useState(value);
  const [error, setError] = useState("");

  // Si es el campo de especies, mostrar selector
  if (fieldType === "species") {
    const [selectedSpecies, setSelectedSpecies] = useState(value);

    const hasChanges = selectedSpecies !== value;
    const canSave = hasChanges && selectedSpecies.trim().length > 0;

    const handleSave = () => {
      if (canSave) {
        onSave(selectedSpecies);
      }
    };

    const handleCancel = () => {
      setSelectedSpecies(value);
      onCancel();
    };

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
            <Text style={[textStyles.subtitle, styles.cancelText]}>
              Cancelar
            </Text>
          </TouchableOpacity>

          <Text style={[textStyles.title, styles.headerTitle]}>{title}</Text>

          <TouchableOpacity
            onPress={handleSave}
            disabled={!canSave}
            style={[styles.saveButton, !canSave && styles.saveButtonDisabled]}
          >
            <Text
              style={[
                textStyles.subtitle,
                styles.saveText,
                !canSave ? styles.saveTextDisabled : styles.saveTextActive,
              ]}
            >
              Guardar
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          <Text style={styles.selectorTitle}>Selecciona una especie</Text>

          {SPECIES_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.optionItem,
                selectedSpecies === option.value && styles.optionItemSelected,
              ]}
              onPress={() => setSelectedSpecies(option.value)}
            >
              <Text
                style={[
                  styles.optionText,
                  selectedSpecies === option.value && styles.optionTextSelected,
                ]}
              >
                {option.label}
              </Text>
              {selectedSpecies === option.value && (
                <Ionicons name="checkmark-circle" size={24} color="#FE2C55" />
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Si es el campo de género/sexo, mostrar selector
  if (fieldType === "gender") {
    const [selectedGender, setSelectedGender] = useState(value);

    const hasChanges = selectedGender !== value;
    const canSave = hasChanges && selectedGender.trim().length > 0;

    const handleSave = () => {
      if (canSave) {
        onSave(selectedGender);
      }
    };

    const handleCancel = () => {
      setSelectedGender(value);
      onCancel();
    };

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
            <Text style={[textStyles.subtitle, styles.cancelText]}>
              Cancelar
            </Text>
          </TouchableOpacity>

          <Text style={[textStyles.title, styles.headerTitle]}>{title}</Text>

          <TouchableOpacity
            onPress={handleSave}
            disabled={!canSave}
            style={[styles.saveButton, !canSave && styles.saveButtonDisabled]}
          >
            <Text
              style={[
                textStyles.subtitle,
                styles.saveText,
                !canSave ? styles.saveTextDisabled : styles.saveTextActive,
              ]}
            >
              Guardar
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          <Text style={styles.selectorTitle}>Selecciona el sexo</Text>

          {GENDER_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.optionItem,
                selectedGender === option.value && styles.optionItemSelected,
              ]}
              onPress={() => setSelectedGender(option.value)}
            >
              <Text
                style={[
                  styles.optionText,
                  selectedGender === option.value && styles.optionTextSelected,
                ]}
              >
                {option.label}
              </Text>
              {selectedGender === option.value && (
                <Ionicons name="checkmark-circle" size={24} color="#FE2C55" />
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Si es el campo de tamaño, mostrar selector
  if (fieldType === "size") {
    const [selectedSize, setSelectedSize] = useState(value);

    const hasChanges = selectedSize !== value;
    const canSave = hasChanges && selectedSize.trim().length > 0;

    const handleSave = () => {
      if (canSave) {
        onSave(selectedSize);
      }
    };

    const handleCancel = () => {
      setSelectedSize(value);
      onCancel();
    };

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
            <Text style={[textStyles.subtitle, styles.cancelText]}>
              Cancelar
            </Text>
          </TouchableOpacity>

          <Text style={[textStyles.title, styles.headerTitle]}>{title}</Text>

          <TouchableOpacity
            onPress={handleSave}
            disabled={!canSave}
            style={[styles.saveButton, !canSave && styles.saveButtonDisabled]}
          >
            <Text
              style={[
                textStyles.subtitle,
                styles.saveText,
                !canSave ? styles.saveTextDisabled : styles.saveTextActive,
              ]}
            >
              Guardar
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          <Text style={styles.selectorTitle}>Selecciona el tamaño</Text>

          {SIZE_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.optionItem,
                selectedSize === option.value && styles.optionItemSelected,
              ]}
              onPress={() => setSelectedSize(option.value)}
            >
              <Text
                style={[
                  styles.optionText,
                  selectedSize === option.value && styles.optionTextSelected,
                ]}
              >
                {option.label}
              </Text>
              {selectedSize === option.value && (
                <Ionicons name="checkmark-circle" size={24} color="#FE2C55" />
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Si es un campo de salud (vacunado, castrado, condiciones médicas)
  if (
    fieldType === "isVaccinated" ||
    fieldType === "isNeutered" ||
    fieldType === "hasMedicalConditions" ||
    fieldType === "goodWithKids" ||
    fieldType === "goodWithOtherPets" ||
    fieldType === "friendlyWithStrangers" ||
    fieldType === "needsWalks"
  ) {
    const [selectedValue, setSelectedValue] = useState(value);

    const hasChanges = selectedValue !== value;
    const canSave = hasChanges && selectedValue.trim().length > 0;

    const handleSave = () => {
      if (canSave) {
        onSave(selectedValue);
      }
    };

    const handleCancel = () => {
      setSelectedValue(value);
      onCancel();
    };

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
            <Text style={[textStyles.subtitle, styles.cancelText]}>
              Cancelar
            </Text>
          </TouchableOpacity>
          <Text style={[textStyles.title, styles.headerTitle]}>{title}</Text>
          <TouchableOpacity
            onPress={handleSave}
            disabled={!canSave}
            style={[styles.saveButton, !canSave && styles.saveButtonDisabled]}
          >
            <Text
              style={[
                textStyles.subtitle,
                styles.saveText,
                !canSave ? styles.saveTextDisabled : styles.saveTextActive,
              ]}
            >
              Guardar
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          <Text style={styles.selectorTitle}>Selecciona una opción</Text>

          {YES_NO_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.optionItem,
                selectedValue === option.value && styles.optionItemSelected,
              ]}
              onPress={() => setSelectedValue(option.value)}
            >
              <Text
                style={[
                  styles.optionText,
                  selectedValue === option.value && styles.optionTextSelected,
                ]}
              >
                {option.label}
              </Text>
              {selectedValue === option.value && (
                <Ionicons name="checkmark-circle" size={24} color="#FE2C55" />
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Para otros campos, continuar con el input de texto original
  const validateInput = (text: string) => {
    if (fieldType === "petName" && text.trim().length < 2) {
      return "El nombre debe tener al menos 2 caracteres";
    }
    if (fieldType === "breed") {
      if (text.trim().length < 2) {
        return "La raza debe tener al menos 2 caracteres";
      }
      if (text.trim().length > 40) {
        return "La raza no puede superar los 40 caracteres";
      }
      const validBreedPattern = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s'-]+$/;
      if (!validBreedPattern.test(text)) {
        return "Solo se permiten letras, espacios y guiones";
      }
    }
    if (fieldType === "age") {
      const ageNum = parseInt(text);
      if (text.trim().length === 0) {
        return "La edad es obligatoria";
      }
      if (isNaN(ageNum) || ageNum < 0) {
        return "La edad debe ser un número positivo";
      }
      if (ageNum > 25) {
        return "La edad no puede ser mayor a 25 años";
      }
    }
    return "";
  };

  const handleInputChange = (text: string) => {
    // Si es edad, solo permitir números
    if (fieldType === "age") {
      const numericValue = text.replace(/[^0-9]/g, "");
      setInputValue(numericValue);
      setError(validateInput(numericValue));
    } else {
      setInputValue(text);
      setError(validateInput(text));
    }
  };

  const handleSave = () => {
    const finalError = validateInput(inputValue);
    if (finalError) {
      setError(finalError);
      return;
    }
    onSave(inputValue);
  };

  const handleCancel = () => {
    setInputValue(value);
    setError("");
    onCancel();
  };

  const hasChanges = inputValue !== value;
  const canSave = hasChanges && !error && inputValue.trim().length > 0;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
          <Text style={[textStyles.subtitle, styles.cancelText]}>Cancelar</Text>
        </TouchableOpacity>

        <Text style={[textStyles.title, styles.headerTitle]}>{title}</Text>

        <TouchableOpacity
          onPress={handleSave}
          disabled={!canSave}
          style={[styles.saveButton, !canSave && styles.saveButtonDisabled]}
        >
          <Text
            style={[
              textStyles.subtitle,
              styles.saveText,
              !canSave ? styles.saveTextDisabled : styles.saveTextActive,
            ]}
          >
            Guardar
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.inputContainer}>
          <Text style={[textStyles.subtitle, styles.inputLabel]}>{title}</Text>

          <TextInput
            style={[
              textStyles.body,
              styles.textInput,
              multiline && styles.textInputMultiline,
              error && styles.textInputError,
            ]}
            value={inputValue}
            onChangeText={handleInputChange}
            placeholder={placeholder}
            placeholderTextColor="#00000094"
            keyboardType={keyboardType}
            maxLength={maxLength}
            multiline={multiline}
            numberOfLines={multiline ? 4 : 1}
            textAlignVertical={multiline ? "top" : "center"}
            autoFocus
          />

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {showCounter && (
            <Text style={styles.counter}>
              {inputValue.length}/{maxLength}
            </Text>
          )}

          {description && (
            <Text style={[textStyles.body, styles.description]}>
              {description}
            </Text>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ffffffff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#00000012",
  },
  cancelButton: { padding: 8 },
  cancelText: { fontSize: 16, color: "#2d3436", fontWeight: "400" },
  headerTitle: { fontSize: 18 },
  saveButton: { padding: 8 },
  saveButtonDisabled: { opacity: 0.4 },
  saveText: { fontSize: 16, fontWeight: "600" },
  saveTextActive: { color: "#FE2C55" },
  saveTextDisabled: { color: "#ccc" },

  content: { flex: 1, padding: 10, paddingTop: 5, backgroundColor: "white" },

  // Estilos para el selector de especies
  selectorTitle: {
    fontFamily: fonts.bold,
    fontSize: 14,

    color: "#00000094",
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#00000012",
    backgroundColor: "white",
  },
  optionItemSelected: {
    backgroundColor: "#FFF5F7",
  },
  optionText: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
    color: "#2d3436",
  },
  optionTextSelected: {
    color: "#FE2C55",
    fontWeight: "600",
  },

  // Estilos para el input de texto (otros campos)
  inputContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    paddingHorizontal: 0,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#00000094",
    marginBottom: 8,
  },
  textInput: {
    fontSize: 16,
    color: "#2d3436",
    paddingVertical: 8,
    borderWidth: 0,
    backgroundColor: "transparent",
    borderBottomWidth: 1,
    borderBottomColor: "#00000012",
  },
  textInputMultiline: { minHeight: 100, textAlignVertical: "top" },
  textInputError: { borderBottomColor: "#FF6B6B", borderBottomWidth: 2 },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    gap: 6,
  },
  errorText: { fontSize: 12, color: "#FF6B6B", flex: 1 },
  counter: { fontSize: 12, color: "#999", textAlign: "left", marginTop: 8 },
  description: { fontSize: 12, color: "#666", marginTop: 12, lineHeight: 16 },
});
