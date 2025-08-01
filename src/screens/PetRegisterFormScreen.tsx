"use client";

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  StatusBar,
  LayoutAnimation,
  findNodeHandle,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Platform,
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useRef, useCallback } from "react";
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
  const [loading, setLoading] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [validationErrors, setValidationErrors] = useState({
    petName: false,
    species: false,
    age: false,
    gender: false,
    size: false,
  });
  const [descriptionError, setDescriptionError] = useState(false);
  const { uploadPetImage, uploadPetVideo } = useUploadFiles();

  const scrollRef = useRef<ScrollView>(null);

  const handleInputFocus = useCallback((event: any) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    const target = event.target;
    const inputNode = findNodeHandle(target);

    setTimeout(() => {
      if (scrollRef.current && inputNode) {
        scrollRef.current.scrollResponderScrollNativeHandleToKeyboard(
          inputNode,
          100, // offset adicional
          true
        );
      }
    }, 100);
  }, []);

  const steps = [
    <StepBasicInfo
      key="basic"
      validationErrors={validationErrors}
      setValidationErrors={setValidationErrors}
      handleInputFocus={handleInputFocus}
    />,
    <StepHealthInfo key="health" handleInputFocus={handleInputFocus} />,
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

      if (!form.videoUri) {
        Alert.alert("Debes agregar un video.");
        return;
      }

      setLoading(true); // 🔹 MOSTRAR LOADER

      // 🔹 Subir imágenes
      const uploadedImages = await Promise.all(
        form.photoUrls.map(async (item) => {
          const url = await uploadPetImage(item.uri);
          return { uri: url, offsetY: item.offsetY ?? 0.5 };
        })
      );

      // 🔹 Subir video
      const uploadedVideoUrl = await uploadPetVideo(form.videoUri);

      // 🔹 Crear objeto actualizado del form
      const updatedForm = {
        ...form,
        photoUrls: uploadedImages,
        videoUri: uploadedVideoUrl,
      };

      // 🔹 Enviar formulario actualizado
      await submitPet(updatedForm);

      Alert.alert("¡Éxito!", "Mascota registrada correctamente");
      navigation.goBack();
    } catch (error: any) {
      console.error("Error en handleSubmit:", error);
      Alert.alert(
        "Error",
        error.message || "Hubo un problema al registrar la mascota"
      );
    } finally {
      setLoading(false); // 🔹 OCULTAR LOADER
    }
  };

  return (
    <>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#FFFFFF"
        translucent={false}
      />
      <SafeAreaView
        style={styles.container}
        edges={["top", "left", "right", "bottom"]}
      >
        {loading && (
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.3)",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 99,
            }}
          >
            <View
              style={{
                backgroundColor: "#FFF",
                padding: 20,
                borderRadius: 12,
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
              }}
            >
              <Ionicons name="cloud-upload" size={24} color="#6366F1" />
              <Text style={{ fontSize: 16, color: "#374151" }}>
                Subiendo archivos...
              </Text>
            </View>
          </View>
        )}
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.select({
            ios: 0,
            android: 0,
          })}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView
              ref={scrollRef}
              style={styles.scrollView}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="on-drag"
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
                  <TouchableOpacity
                    style={styles.nextButton}
                    onPress={handleNext}
                  >
                    <Text style={styles.nextButtonText}>Continuar</Text>
                    <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.submitButton}
                    onPress={handleSubmit}
                  >
                    <Ionicons name="heart" size={18} color="#FFFFFF" />
                    <Text style={styles.submitButtonText}>
                      Publicar Mascota
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </ScrollView>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
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
