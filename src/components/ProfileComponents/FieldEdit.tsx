"use client";

import { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { textStyles } from "../../theme/textStyles";
import type { KeyboardTypeOptions } from "react-native";
import { useFieldEdit } from "../../hooks/useFieldEdit";
import { StatusBar } from "expo-status-bar";
import { useIsFocused } from "@react-navigation/native";

type Props = {
  title: string;
  value: string;
  placeholder: string;
  maxLength?: number;
  multiline?: boolean;
  keyboardType?: KeyboardTypeOptions;
  showCounter?: boolean;
  description?: string;
  fieldType: "firstName" | "lastName" | "phone" | "bio";
  onSave: (value: string) => void;
  onCancel: () => void;
};

export default function FieldEdit({
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
  const isFocused = useIsFocused();
  const {
    inputValue,
    error,
    hasChanges,
    handleInputChange,
    handleSave,
    handleCancel,
  } = useFieldEdit(fieldType);

  const onSavePress = async () => {
    const ok = await handleSave(); // 👈 ahora esperamos
    if (ok) {
      onCancel(); // Cierra el modal si guardó correctamente
    }
  };

  const onCancelPress = () => {
    handleCancel();
    onCancel();
  };

  return (
    <>
      {isFocused && (
        <StatusBar style="dark" translucent backgroundColor="transparent" />
      )}
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onCancelPress} style={styles.cancelButton}>
            <Text style={[textStyles.subtitle, styles.cancelText]}>
              Cancelar
            </Text>
          </TouchableOpacity>

          <Text style={[textStyles.title, styles.headerTitle]}>{title}</Text>

          <TouchableOpacity
            onPress={onSavePress}
            disabled={!hasChanges || !!error}
            style={[
              styles.saveButton,
              (!hasChanges || !!error) && styles.saveButtonDisabled,
            ]}
          >
            <Text
              style={[
                textStyles.subtitle,
                styles.saveText,
                !hasChanges || !!error
                  ? styles.saveTextDisabled
                  : styles.saveTextActive,
              ]}
            >
              Guardar
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.inputContainer}>
            <Text style={[textStyles.subtitle, styles.inputLabel]}>
              {title}
            </Text>

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
              <Text style={[styles.counter]}>
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
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ffffffff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#00000012",
  },
  cancelButton: { padding: 8 },
  cancelText: { fontSize: 16, color: "#2d3436", fontWeight: "400" },
  headerTitle: { fontSize: 18 },
  saveButton: { padding: 8 },
  // 🔧 estilos visibles para activo / deshabilitado
  saveButtonActive: { opacity: 1 },
  saveButtonDisabled: { opacity: 0.4 },
  saveText: { fontSize: 16, fontWeight: "600" },
  saveTextActive: { color: "#FE2C55" },
  saveTextDisabled: { color: "#ccc" },

  content: { flex: 1, padding: 10, paddingTop: 5, backgroundColor: "white" },
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
  counterWithError: { marginTop: 4 },
  description: { fontSize: 12, color: "#666", marginTop: 12, lineHeight: 16 },
});
