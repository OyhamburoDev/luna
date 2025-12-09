"use client";

import { useRef, useCallback } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  LayoutAnimation,
  findNodeHandle,
  StatusBar,
  Alert,
} from "react-native";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  Switch,
} from "react-native";
import { useAdoptionRequest } from "../hooks/useAdoptionRequest";
import type { RouteProp } from "@react-navigation/native";
import type { RootStackParamList } from "../navigation/types";
import { SafeAreaView } from "react-native-safe-area-context";
import { LocalAuthModal } from "../components/LocalAuthModal";
import Ionicons from "react-native-vector-icons/Ionicons";
import { fonts } from "../theme/fonts";
import ToastMessage from "../components/ToastMessage";
import { useAuthModalContext } from "../contexts/AuthModalContext";

type AdoptionFormRouteProp = RouteProp<RootStackParamList, "AdoptionFormPet">;

export default function AdoptionFormScreen() {
  const route = useRoute<AdoptionFormRouteProp>();
  const { petId, petName, ownerId, ownerName, ownerEmail } = route.params;

  const { requireAuth } = useAuthModalContext();

  const {
    form,
    handleChange,
    handleSubmit,
    errors,
    setErrors,
    setShowLocalModal,
    showLocalModal,
    showSuccess,
    setShowSuccess,
    toastMessage,
    toastType,
  } = useAdoptionRequest(petId, petName, ownerId, ownerName, ownerEmail);

  const handleSubmitWithAuth = () => {
    requireAuth(async () => {
      handleSubmit(); // ← que el hook maneje TODAS las validaciones
    });
  };

  const navigation = useNavigation();
  const scrollRef = useRef<ScrollView>(null);

  const handleInputFocus = useCallback((event: any) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    const target = event.target;
    const inputNode = findNodeHandle(target);

    setTimeout(() => {
      if (scrollRef.current && inputNode) {
        scrollRef.current.scrollResponderScrollNativeHandleToKeyboard(
          inputNode,
          100,
          true
        );
      }
    }, 100);
  }, []);

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <SafeAreaView
        style={styles.safe}
        edges={["top", "left", "right", "bottom"]}
      >
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
              style={styles.container}
              ref={scrollRef}
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="on-drag"
              showsVerticalScrollIndicator={false}
            >
              {/* Header */}
              <View style={styles.header}>
                <TouchableOpacity
                  onPress={() => navigation.goBack()}
                  style={styles.backButton}
                >
                  <Ionicons name="arrow-back" size={24} color="#000000" />
                </TouchableOpacity>
                <Text style={[{ fontFamily: fonts.bold }, styles.headerTitle]}>
                  Solicitar adopción
                </Text>
                <View style={styles.headerRight} />
              </View>

              <View style={styles.formContent}>
                {/* Sección: Información personal */}
                <Text style={[{ fontFamily: fonts.bold }, styles.sectionTitle]}>
                  Tu información
                </Text>

                {/* Nombre del adoptante */}
                <View
                  style={[
                    styles.fieldContainer,
                    errors.name && styles.fieldContainerError,
                  ]}
                >
                  <Ionicons
                    name="person-outline"
                    size={20}
                    color={errors.name ? "#f58695ff" : "#878988ff"}
                    style={styles.fieldIcon}
                  />
                  <TextInput
                    style={[
                      { fontFamily: fonts.semiBold },
                      styles.fieldInput,
                      errors.name && styles.fieldInputError, // <-- rojo si hay error
                    ]}
                    placeholder="Tu nombre *"
                    placeholderTextColor={errors.name ? "#f58695ff" : "#999999"}
                    value={form.name}
                    onFocus={handleInputFocus}
                    onChangeText={(text) => handleChange("name", text)}
                  />
                </View>
                {errors.name && (
                  <Text
                    style={[{ fontFamily: fonts.regular }, styles.errorText]}
                  >
                    Nombre obligatorio
                  </Text>
                )}
                <View style={styles.divider} />

                {/* Sección: Métodos de contacto */}
                <Text style={[{ fontFamily: fonts.bold }, styles.sectionTitle]}>
                  ¿Cómo pueden contactarte?
                </Text>
                <Text
                  style={[
                    { fontFamily: fonts.semiBold },
                    styles.sectionSubtitle,
                  ]}
                >
                  Proporciona al menos un método de contacto
                </Text>
                <View
                  style={[errors.contactRequired && styles.fieldContainerError]}
                >
                  {/* WhatsApp */}
                  <View style={[styles.fieldContainer]}>
                    <Ionicons
                      name="logo-whatsapp"
                      size={20}
                      color={errors.contactRequired ? "#f58695ff" : "#878988ff"} // <- NUEVO
                      style={styles.fieldIcon}
                    />
                    <TextInput
                      style={[
                        { fontFamily: fonts.semiBold },
                        styles.fieldInput,
                      ]}
                      placeholder="WhatsApp (ej: +549111234567)"
                      placeholderTextColor={
                        errors.contactRequired ? "#f58695ff" : "#999999"
                      }
                      value={form.whatsapp}
                      onFocus={handleInputFocus}
                      onChangeText={(text) => handleChange("whatsapp", text)}
                      keyboardType="phone-pad"
                    />
                  </View>
                  {errors.whatsappMessage && (
                    <Text style={styles.errorText}>
                      {errors.whatsappMessage}
                    </Text>
                  )}
                  <View style={styles.divider} />

                  {/* Instagram */}
                  <View style={[styles.fieldContainer]}>
                    <Ionicons
                      name="logo-instagram"
                      size={20}
                      color={errors.contactRequired ? "#f58695ff" : "#878988ff"} // <- NUEVO
                      style={styles.fieldIcon}
                    />
                    <TextInput
                      style={[
                        { fontFamily: fonts.semiBold },
                        styles.fieldInput,
                      ]}
                      placeholder="Tu usuario de Instagram"
                      placeholderTextColor={
                        errors.contactRequired ? "#f58695ff" : "#999999"
                      }
                      value={form.instagram}
                      onFocus={handleInputFocus}
                      onChangeText={(text) => handleChange("instagram", text)}
                      autoCapitalize="none"
                    />
                  </View>

                  <View style={styles.divider} />

                  {/* Email */}
                  <View style={styles.fieldContainer}>
                    <Ionicons
                      name="mail-outline"
                      size={20}
                      color={errors.contactRequired ? "#f58695ff" : "#878988ff"}
                      style={styles.fieldIcon}
                    />
                    <TextInput
                      style={[
                        { fontFamily: fonts.semiBold },
                        styles.fieldInput,
                      ]}
                      placeholder="Email"
                      placeholderTextColor={
                        errors.contactRequired ? "#f58695ff" : "#999999"
                      }
                      value={form.email}
                      onFocus={handleInputFocus}
                      onChangeText={(text) => handleChange("email", text)}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </View>
                  {errors.emailMessage && (
                    <Text style={styles.errorText}>{errors.emailMessage}</Text>
                  )}
                  <View style={styles.divider} />

                  {/* Facebook */}
                  <View style={styles.fieldContainer}>
                    <Ionicons
                      name="logo-facebook"
                      size={20}
                      color={errors.contactRequired ? "#f58695ff" : "#878988ff"}
                      style={styles.fieldIcon}
                    />
                    <TextInput
                      style={[
                        { fontFamily: fonts.semiBold },
                        styles.fieldInput,
                      ]}
                      placeholder="Facebook (nombre de usuario)"
                      placeholderTextColor={
                        errors.contactRequired ? "#f58695ff" : "#999999"
                      }
                      value={form.facebook}
                      onFocus={handleInputFocus}
                      onChangeText={(text) => handleChange("facebook", text)}
                      autoCapitalize="none"
                    />
                  </View>
                </View>

                {/* LINEA ROJA Y MENSAJE DE ERROR - IMPORTANTE */}

                {errors.contactRequired && (
                  <Text
                    style={[{ fontFamily: fonts.regular }, styles.errorText]}
                  >
                    Completa al menos 1 campo de contacto
                  </Text>
                )}
                <View style={[styles.divider]} />

                {/* Sección: Tu hogar */}
                <Text style={[{ fontFamily: fonts.bold }, styles.sectionTitle]}>
                  Sobre tu hogar
                </Text>

                {/* Tipo de vivienda */}
                <View
                  style={[
                    styles.fieldContainer,
                    errors.housingType && styles.fieldContainerError, // <- NUEVO: Estilo de error
                  ]}
                >
                  <Ionicons
                    name="home-outline"
                    size={20}
                    color={errors.housingType ? "#f58695ff" : "#000000"}
                    style={styles.fieldIcon}
                  />
                  <View style={styles.pickerContainer}>
                    <Text
                      style={[
                        { fontFamily: fonts.semiBold },
                        {
                          color: errors.housingType ? "#f58695ff" : "#000000",
                        },
                        ,
                        styles.pickerLabel,
                      ]}
                    >
                      Tipo de vivienda
                    </Text>
                    <View style={styles.pickerOptions}>
                      <TouchableOpacity
                        style={[
                          styles.pickerOption,
                          form.housingType === "house" &&
                            styles.pickerOptionActive,
                          errors.housingType && styles.pickerOptionError, // <- NUEVO: Estilo de error
                        ]}
                        onPress={() => {
                          handleChange("housingType", "house");
                          // Limpiar error cuando se seleccione una opción
                          if (errors.housingType) {
                            setErrors((prev) => ({
                              ...prev,
                              housingType: false,
                            }));
                          }
                        }}
                      >
                        <Text
                          style={[
                            { fontFamily: fonts.semiBold },
                            styles.pickerOptionText,
                            form.housingType === "house" &&
                              styles.pickerOptionTextActive,
                            errors.housingType && styles.pickerOptionTextError,
                          ]}
                        >
                          Casa
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.pickerOption,
                          form.housingType === "apartment" &&
                            styles.pickerOptionActive,
                          errors.housingType && styles.pickerOptionError, // <- NUEVO: Estilo de error
                        ]}
                        onPress={() => {
                          handleChange("housingType", "apartment");
                          // Limpiar error cuando se seleccione una opción
                          if (errors.housingType) {
                            setErrors((prev) => ({
                              ...prev,
                              housingType: false,
                            }));
                          }
                        }}
                      >
                        <Text
                          style={[
                            { fontFamily: fonts.semiBold },
                            styles.pickerOptionText,
                            form.housingType === "apartment" &&
                              styles.pickerOptionTextActive,
                            errors.housingType && styles.pickerOptionTextError, // <- NUEVO: Color de error en texto
                          ]}
                        >
                          Depto
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.pickerOption,
                          form.housingType === "other" &&
                            styles.pickerOptionActive,
                          errors.housingType && styles.pickerOptionError, // <- NUEVO: Estilo de error
                        ]}
                        onPress={() => {
                          handleChange("housingType", "other");
                          // Limpiar error cuando se seleccione una opción
                          if (errors.housingType) {
                            setErrors((prev) => ({
                              ...prev,
                              housingType: false,
                            }));
                          }
                        }}
                      >
                        <Text
                          style={[
                            { fontFamily: fonts.semiBold },
                            styles.pickerOptionText,
                            form.housingType === "other" &&
                              styles.pickerOptionTextActive,
                            errors.housingType && styles.pickerOptionTextError, // <- NUEVO: Color de error en texto
                          ]}
                        >
                          Otro
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
                {/* MENSAJE DE ERROR PARA TIPO DE VIVIENDA */}
                {errors.housingType && (
                  <Text
                    style={[{ fontFamily: fonts.regular }, styles.errorText]}
                  >
                    Selecciona el tipo de vivienda
                  </Text>
                )}
                <View style={styles.divider} />

                {/* Detalles de vivienda */}
                <View style={styles.fieldContainer}>
                  <Ionicons
                    name="information-circle-outline"
                    size={20}
                    color="#000000"
                    style={styles.fieldIcon}
                  />
                  <TextInput
                    style={[{ fontFamily: fonts.semiBold }, styles.fieldInput]}
                    placeholder="Detalles de tu vivienda (opcional)"
                    placeholderTextColor="#999999"
                    value={form.housingDetails}
                    onFocus={handleInputFocus}
                    onChangeText={(text) =>
                      handleChange("housingDetails", text)
                    }
                  />
                </View>
                <View style={styles.divider} />

                {/* Tiene patio - Switch */}
                <View style={[styles.switchContainer]}>
                  <View style={styles.switchLeft}>
                    <Ionicons
                      name="leaf-outline"
                      size={20}
                      color="#000000"
                      style={styles.fieldIcon}
                    />
                    <Text
                      style={[
                        { fontFamily: fonts.semiBold },
                        styles.switchLabel,
                      ]}
                    >
                      ¿Tenés patio o balcón?
                    </Text>
                  </View>
                  <Switch
                    value={form.hasYard}
                    onValueChange={(value) => {
                      console.log("🟢 Switch onValueChange:", value);
                      handleChange("hasYard", value);
                    }}
                    trackColor={{
                      false: "#e8e8e8", // <- NUEVO: Color de error
                      true: "#667eea",
                    }}
                    thumbColor="#ffffff"
                  />
                </View>

                <View style={styles.divider} />

                {/* Sección: Tu experiencia */}
                <Text style={[{ fontFamily: fonts.bold }, styles.sectionTitle]}>
                  Tu experiencia con mascotas
                </Text>

                {/* Tiene mascotas - Switch */}
                <View style={styles.switchContainer}>
                  <View style={styles.switchLeft}>
                    <Ionicons
                      name="paw"
                      size={20}
                      color="#878988ff"
                      style={styles.fieldIcon}
                    />
                    <Text
                      style={[
                        { fontFamily: fonts.semiBold },
                        styles.switchLabel,
                      ]}
                    >
                      ¿Tenés otras mascotas?
                    </Text>
                  </View>
                  <Switch
                    value={form.hasPets}
                    onValueChange={(value) => handleChange("hasPets", value)}
                    trackColor={{ false: "#e8e8e8", true: "#667eea" }}
                    thumbColor="#ffffff"
                  />
                </View>

                {/* Si tiene mascotas, mostrar campo para especificar */}
                {form.hasPets && (
                  <>
                    <View style={styles.divider} />
                    <View style={styles.fieldContainer}>
                      <View style={{ width: 32 }} />
                      <TextInput
                        style={[
                          { fontFamily: fonts.semiBold },
                          styles.fieldInput,
                        ]}
                        placeholder="¿Qué mascotas tenés?"
                        placeholderTextColor="#999999"
                        value={form.petTypes}
                        onFocus={handleInputFocus}
                        onChangeText={(text) => handleChange("petTypes", text)}
                      />
                    </View>
                  </>
                )}
                <View style={styles.divider} />

                {/* Tiene niños - Switch */}
                <View style={styles.switchContainer}>
                  <View style={styles.switchLeft}>
                    <Ionicons
                      name="people-outline"
                      size={20}
                      color="#000000"
                      style={styles.fieldIcon}
                    />
                    <Text
                      style={[
                        { fontFamily: fonts.semiBold },
                        styles.switchLabel,
                      ]}
                    >
                      ¿Hay niños en casa?
                    </Text>
                  </View>
                  <Switch
                    value={form.hasChildren}
                    onValueChange={(value) =>
                      handleChange("hasChildren", value)
                    }
                    trackColor={{ false: "#e8e8e8", true: "#667eea" }}
                    thumbColor="#ffffff"
                  />
                </View>
                <View style={styles.divider} />

                {/* Tiempo disponible */}
                <View
                  style={[
                    styles.fieldContainer,
                    errors.availableTime && styles.fieldContainerError,
                  ]}
                >
                  <Ionicons
                    name="time-outline"
                    size={20}
                    color={errors.availableTime ? "#f58695ff" : "#000000"}
                    style={styles.fieldIcon}
                  />
                  <TextInput
                    style={[{ fontFamily: fonts.semiBold }, styles.fieldInput]}
                    placeholder="¿Cuánto tiempo al día podrás dedicarle?"
                    placeholderTextColor={
                      errors.availableTime ? "#f58695ff" : "#999999"
                    }
                    value={form.availableTime}
                    onFocus={handleInputFocus}
                    onChangeText={(text) => handleChange("availableTime", text)}
                  />
                </View>
                {errors.availableTime && (
                  <Text
                    style={[{ fontFamily: fonts.regular }, styles.errorText]}
                  >
                    Tiempo disponible obligatorio
                  </Text>
                )}
                <View style={styles.divider} />

                {/* Sección: Tu motivación */}
                <Text style={[{ fontFamily: fonts.bold }, styles.sectionTitle]}>
                  Tu motivación
                </Text>

                {/* Razón para adoptar */}
                <View
                  style={[
                    styles.textAreaContainer,
                    errors.reason && styles.fieldContainerError,
                  ]}
                >
                  <TextInput
                    style={[
                      { fontFamily: fonts.semiBold },
                      styles.textArea,
                      errors.reason && styles.fieldInputError,
                    ]}
                    placeholder="¿Por qué querés adoptar a esta mascota? *"
                    placeholderTextColor={
                      errors.reason ? "#f58695ff" : "#999999"
                    }
                    value={form.reason}
                    onFocus={handleInputFocus}
                    onChangeText={(text) => handleChange("reason", text)}
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                  />
                </View>
                {errors.reason && (
                  <Text
                    style={[{ fontFamily: fonts.regular }, styles.errorText]}
                  >
                    Este campo es obligatorio
                  </Text>
                )}
                <View style={styles.divider} />

                {/* Comentarios adicionales */}
                <View style={styles.textAreaContainer}>
                  <TextInput
                    style={[{ fontFamily: fonts.semiBold }, styles.textArea]}
                    placeholder="Comentarios adicionales (opcional)"
                    placeholderTextColor="#999999"
                    value={form.comments}
                    onFocus={handleInputFocus}
                    onChangeText={(text) => handleChange("comments", text)}
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                  />
                </View>

                {/* Botón de enviar */}
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={handleSubmitWithAuth}
                  >
                    <Text
                      style={[
                        { fontFamily: fonts.semiBold },
                        styles.buttonText,
                      ]}
                    >
                      Enviar solicitud
                    </Text>
                  </TouchableOpacity>

                  <Text
                    style={[{ fontFamily: fonts.semiBold }, styles.disclaimer]}
                  >
                    Tu información será compartida únicamente con el dueño de{" "}
                    {petName}
                  </Text>
                </View>
              </View>
            </ScrollView>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </SafeAreaView>

      <ToastMessage
        visible={showSuccess}
        onClose={() => setShowSuccess(false)}
        message={toastMessage}
        type={toastType}
      />
    </>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#ffffff",
    borderBottomWidth: 0.5,
    borderBottomColor: "#e0e0e0",
  },
  backButton: {
    padding: 4,
    width: 40,
  },
  headerTitle: {
    fontSize: 17,
    color: "#000000",
  },
  errorText: {
    color: "#f58695ff",
    fontSize: 12,
    marginLeft: 52, // para alinearlo con el input
    marginTop: 4,
  },
  contactErrorText: {
    color: "#f58695ff",
    fontSize: 12,
    marginLeft: 16,
    marginTop: 8,
    marginBottom: 8,
    fontFamily: fonts.semiBold,
  },
  dividerError: {
    backgroundColor: "#f58695ff",
    opacity: 0.5,
  },
  headerRight: {
    width: 40,
  },
  petInfoCard: {
    backgroundColor: "#f8f9fa",
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  petInfoText: {
    marginLeft: 12,
  },
  petInfoLabel: {
    fontSize: 12,
    color: "#666666",
  },
  petInfoName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000000",
    marginTop: 2,
  },
  formContent: {
    flex: 1,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 15,
    color: "#000000",
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 12,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: "#666666",
    paddingHorizontal: 16,
    paddingBottom: 12,
    marginTop: -8,
  },
  fieldContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#ffffff",
  },
  fieldIcon: {
    marginRight: 12,
    width: 24,
  },
  whatsappIcon: {
    marginRight: 12,
    width: 24,
    color: "#25D366",
  },
  instagramIcon: {
    marginRight: 12,
    width: 24,
    color: "#f58695ff",
  },
  facebookIcon: {
    marginRight: 12,
    width: 24,
    color: "#1877F2",
  },
  fieldInput: {
    flex: 1,
    fontSize: 16,
    color: "#000000",
    padding: 0,
    margin: 0,
  },
  fieldInputError: {
    color: "#f58695ff",
  },
  fieldContainerError: {
    borderBottomWidth: 1,
    borderBottomColor: "#f58695ff",
    marginBottom: 4,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#ffffff",
  },

  switchLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  switchLabel: {
    fontSize: 16,
    color: "#000000",
  },
  pickerContainer: {
    flex: 1,
  },
  pickerLabel: {
    fontSize: 16,

    marginBottom: 8,
  },
  pickerOptions: {
    flexDirection: "row",
    gap: 8,
  },
  pickerOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  pickerOptionActive: {
    backgroundColor: "#667eea",
    borderColor: "#667eea",
  },
  pickerOptionError: {
    borderColor: "#f58695ff",
    borderWidth: 1,
  },
  pickerOptionTextError: {
    color: "#f58695ff",
  },
  pickerOptionText: {
    fontSize: 14,
    color: "#666666",
  },
  pickerOptionTextActive: {
    color: "#ffffff",
    fontWeight: "500",
  },
  textAreaContainer: {
    marginHorizontal: 16,
    marginTop: 8,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 12,
  },
  textArea: {
    fontSize: 16,
    color: "#000000",
    minHeight: 80,
  },
  divider: {
    height: 0.5,
    backgroundColor: "#e8e8e8",
    marginLeft: 52,
  },
  buttonContainer: {
    paddingHorizontal: 16,
    paddingTop: 32,
    paddingBottom: 24,
  },
  button: {
    backgroundColor: "#667eea",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    letterSpacing: 0.3,
  },
  disclaimer: {
    fontSize: 12,
    color: "#999999",
    textAlign: "center",
    marginTop: 12,
    paddingHorizontal: 20,
  },
});
