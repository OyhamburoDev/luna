"use client";

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  StatusBar,
} from "react-native";
import { useState } from "react";
import { usePetRegister } from "../hooks/usePetRegister";
import { useAuthStore } from "../store/auth";
import { useNavigation } from "@react-navigation/native";
// @ts-ignore
import Ionicons from "react-native-vector-icons/Ionicons";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/types";
import StepPhotos from "../components/PetRegisterSteps/StepPhotos";
import StepBasicInfo from "../components/PetRegisterSteps/StepBasicInfo";
import StepHealthInfo from "../components/PetRegisterSteps/StepHealthInfo";
import StepConductInfo from "../components/PetRegisterSteps/StepConductInfo";
import StepAdditionalInfo from "../components/PetRegisterSteps/StepAdditionalInfo";
import { useUploadFiles } from "../hooks/useUploadFiles";

export default function PetRegisterFormScreen() {
  const { form, submitPet, setFormField } = usePetRegister();
  const { user } = useAuthStore();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [stepIndex, setStepIndex] = useState(0);
  const [validationErrors, setValidationErrors] = useState({
    petName: false,
    species: false,
    age: false,
    gender: false,
    size: false,
  });
  const [descriptionError, setDescriptionError] = useState(false);
  const { uploadPetImage, uploadPetVideo } = useUploadFiles()
  const steps = [

    <StepBasicInfo
      key="basic"
      validationErrors={validationErrors}
      setValidationErrors={setValidationErrors}
    />,
    <StepHealthInfo key="health" />,
    <StepConductInfo key="conduct" />,
    <StepAdditionalInfo
      key="additional"
      descriptionError={descriptionError}
      setDescriptionError={setDescriptionError}
    />,
    <StepPhotos key="photos" />,
  ];

  const validateBasicInfo = () => {
    const errors = {
      petName: !form.petName || form.petName.trim() === "",
      species: !form.species || form.species.trim() === "",
      age:
        !form.age || (typeof form.age === "string" && form.age.trim() === ""),
      gender: !form.gender || form.gender.trim() === "",
      size: !form.size || form.size.trim() === "",
    };

    setValidationErrors(errors);
    return !Object.values(errors).some((error) => error === true);
  };

  const validateAdditionalInfo = () => {
    const vacio = !form.description || form.description.trim() === "";

    setDescriptionError(vacio);

    if (vacio) {
      Alert.alert("Debes hacer una descripción general para continuar");
      return false;
    }
    return true;
  };

  const isStepValid = () => {
    if (stepIndex === 0) {
      return validateBasicInfo();
    }
    if (stepIndex === 3) {
      return validateAdditionalInfo();
    }
    return true; // otros pasos no tienen validaciones por ahora
  };

  const handleNext = () => {
    if (!isStepValid()) {
      Alert.alert("Debes completar los campos faltantes!");
      return;
    }
    if (stepIndex < steps.length - 1) setStepIndex(stepIndex + 1);
  };

  const handleBack = () => {
    if (stepIndex > 0) setStepIndex(stepIndex - 1);
  };

  const handleGoBack = () => {
    Alert.alert(
      "¿Salir del registro?",
      "Podés continuar más tarde con el registro de la mascota.",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Salir",
          style: "destructive",
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };


  const handleSubmit = async () => {
    try {
      if (!user) {
        Alert.alert("Error", "No se encontró el usuario.");
        navigation.navigate("Login");
        return;
      }

      if (!form.photoUrls || form.photoUrls.length === 0) {
        Alert.alert("Debes agregar al menos 1 foto.");
        return;
      }

      // ✅ Subir imágenes
      const uploadedImages = await Promise.all(
        form.photoUrls.map(async (item) => {
          const url = await uploadPetImage(item.uri);
          return { uri: url, offsetY: item.offsetY ?? 0.5 };
        })
      );

      // ✅ Subir video (si hay)
      let videoUrl: string | null = null;
      if (form.videoUri) {
        videoUrl = await uploadPetVideo(form.videoUri);
      }

      // ✅ Guardar URLs subidas en el store antes de enviar
      setFormField("photoUrls", uploadedImages);
      if (videoUrl) {
        setFormField("videoUrl", videoUrl);
      }

      // ✅ Enviar el form completo
      await submitPet();

      Alert.alert("¡Éxito!", "Mascota registrada correctamente");
      navigation.goBack();
    } catch (error: any) {
      console.error("Error en handleSubmit:", error);
      Alert.alert("Error", error.message || "Hubo un problema al registrar la mascota");
    }
  };


  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#FFFFFF"
        translucent={false}
      />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header con padding suficiente */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={stepIndex === 0 ? handleGoBack : handleBack}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={22} color="#374151" />
          </TouchableOpacity>

          <View style={styles.headerContent}>
            <Text style={styles.title}>Registro de Mascota</Text>
            <Text style={styles.subtitle}>
              Paso {stepIndex + 1} de {steps.length}
            </Text>
          </View>
        </View>

        {/* Indicador de progreso */}
        <View style={styles.progressContainer}>
          <View style={styles.progressTrack}>
            {Array.from({ length: steps.length }).map((_, index) => (
              <View
                key={index}
                style={[
                  styles.progressDot,
                  index <= stepIndex
                    ? styles.progressDotActive
                    : styles.progressDotInactive,
                ]}
              />
            ))}
          </View>
        </View>

        {/* Contenido del paso */}
        <View style={styles.stepContent}>{steps[stepIndex]}</View>

        {/* Navegación */}
        <View style={styles.navigation}>
          {stepIndex < steps.length - 1 ? (
            <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
              <Text style={styles.nextButtonText}>Continuar</Text>
              <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
            >
              <Ionicons name="heart" size={18} color="#FFFFFF" />
              <Text style={styles.submitButtonText}>Publicar Mascota</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60, // Aumentado significativamente para evitar el status bar
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  headerContent: {
    flex: 1,
    paddingLeft: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "500",
    paddingLeft: 60,
  },
  progressContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
    alignItems: "center",
  },
  progressTrack: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  progressDotActive: {
    backgroundColor: "#6366F1",
  },
  progressDotInactive: {
    backgroundColor: "#E5E7EB",
  },
  stepContent: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  navigation: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  nextButton: {
    backgroundColor: "#6366F1",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
    shadowColor: "#6366F1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  nextButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
  submitButton: {
    backgroundColor: "#10B981",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
});
