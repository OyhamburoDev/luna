"use client";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import { RadioButton, Card } from "react-native-paper";
import { usePetRegister } from "../hooks/usePetRegister";
import { useAuthStore } from "../store/auth";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/types";
import * as ImagePicker from "expo-image-picker";

export default function PetRegisterFormScreen() {
  const { form, setFormField, submitPet } = usePetRegister();
  const { user } = useAuthStore();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleSubmit = async () => {
    try {
      if (!user) {
        Alert.alert("Error", "No se encontró el usuario.");
        navigation.navigate("Login");
        return;
      }

      if (!form.photoUrl || form.photoUrl.trim() === "") {
        Alert.alert(
          "Falta la foto",
          "Por favor agregá una foto de la mascota."
        );
        return;
      }

      setFormField("userId", user.uid);
      await submitPet();
      Alert.alert("¡Éxito!", "Mascota registrada correctamente");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Hubo un problema al registrar la mascota");
    }
  };

  const renderRadioGroup = (
    label: string,
    value: string,
    onValueChange: (value: string) => void,
    options: { label: string; value: string }[]
  ) => (
    <View style={styles.radioContainer}>
      <Text style={styles.radioLabel}>{label}</Text>
      <RadioButton.Group onValueChange={onValueChange} value={value}>
        <View style={styles.radioRow}>
          {options.map((option) => (
            <View key={option.value} style={styles.radioItem}>
              <RadioButton.Item
                label={option.label}
                value={option.value}
                labelStyle={styles.radioItemLabel}
                color="#6366F1"
              />
            </View>
          ))}
        </View>
      </RadioButton.Group>
    </View>
  );

  const pickImageFromLibrary = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,

      // aspect: [3, 4],
      quality: 0.8,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setFormField("photoUrl", uri);
    }
  };

  const takePhotoWithCamera = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (permission.status !== "granted") {
      Alert.alert("Permiso denegado", "Necesitamos acceso a la cámara.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.8,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setFormField("photoUrl", uri);
    }
  };

  const handleChoosePhoto = () => {
    Alert.alert(
      "Seleccionar imagen",
      "¿Qué querés hacer?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Elegir de la galería",
          onPress: pickImageFromLibrary,
        },
        {
          text: "Tomar foto",
          onPress: takePhotoWithCamera,
        },
      ],
      { cancelable: true }
    );
  };

  const handleDeletePhoto = () => {
    Alert.alert(
      "Eliminar imagen",
      "¿Querés eliminar la foto actual?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          onPress: () => setFormField("photoUrl", ""),
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>🐾 Registro de Mascota</Text>
        <Text style={styles.subtitle}>Ayuda a encontrar un hogar amoroso</Text>
      </View>

      {/* Datos Básicos */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.sectionTitle}>📋 Información Básica</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Nombre de la mascota</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: Max, Luna, Toby..."
              value={form.petName}
              onChangeText={(text) => setFormField("petName", text)}
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.inputLabel}>Especie</Text>
              <TextInput
                style={styles.input}
                placeholder="Perro, Gato, etc."
                value={form.species}
                onChangeText={(text) => setFormField("species", text)}
                placeholderTextColor="#9CA3AF"
              />
            </View>
            <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.inputLabel}>Raza</Text>
              <TextInput
                style={styles.input}
                placeholder="Mestizo, Labrador..."
                value={form.breed}
                onChangeText={(text) => setFormField("breed", text)}
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.inputLabel}>Edad</Text>
              <TextInput
                style={styles.input}
                placeholder="2 años, 6 meses..."
                value={form.age}
                onChangeText={(text) => setFormField("age", text)}
                placeholderTextColor="#9CA3AF"
              />
            </View>
            <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
              {renderRadioGroup(
                "Sexo",
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
            "Tamaño",
            form.size ?? "",
            (value) => setFormField("size", value),
            [
              { label: "Pequeño", value: "pequeño" },
              { label: "Mediano", value: "mediano" },
              { label: "Grande", value: "grande" },
            ]
          )}
        </Card.Content>
      </Card>

      {/* Información de Salud */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.sectionTitle}>🏥 Información de Salud</Text>

          {renderRadioGroup(
            "¿Está vacunado/a?",
            form.isVaccinated ?? "",
            (value) => setFormField("isVaccinated", value),
            [
              { label: "Sí", value: "sí" },
              { label: "No", value: "no" },
              { label: "Parcialmente", value: "parcialmente" },
            ]
          )}

          {renderRadioGroup(
            "¿Está castrado/a?",
            form.isNeutered ?? "",
            (value) => setFormField("isNeutered", value),
            [
              { label: "Sí", value: "sí" },
              { label: "No", value: "no" },
            ]
          )}

          {renderRadioGroup(
            "¿Tiene condiciones médicas especiales?",
            form.hasMedicalConditions ?? "",
            (value) => setFormField("hasMedicalConditions", value),
            [
              { label: "Sí", value: "sí" },
              { label: "No", value: "no" },
            ]
          )}

          {form.hasMedicalConditions === "sí" && (
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Detalles médicos</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Describe las condiciones médicas..."
                value={form.medicalDetails}
                onChangeText={(text) => setFormField("medicalDetails", text)}
                multiline
                numberOfLines={3}
                placeholderTextColor="#9CA3AF"
              />
            </View>
          )}

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Información médica adicional</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Vacunas, tratamientos, medicamentos..."
              value={form.healthInfo}
              onChangeText={(text) => setFormField("healthInfo", text)}
              multiline
              numberOfLines={2}
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </Card.Content>
      </Card>

      {/* Comportamiento y Convivencia */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.sectionTitle}>
            🤝 Comportamiento y Convivencia
          </Text>

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

          {renderRadioGroup(
            "¿Es sociable con extraños?",
            form.friendlyWithStrangers ?? "",
            (value) => setFormField("friendlyWithStrangers", value),
            [
              { label: "Muy sociable", value: "muy_sociable" },
              { label: "Moderadamente", value: "moderado" },
              { label: "Tímido/a", value: "timido" },
              { label: "Desconfiado/a", value: "desconfiado" },
            ]
          )}

          {renderRadioGroup(
            "¿Necesita paseos diarios?",
            form.needsWalks ?? "",
            (value) => setFormField("needsWalks", value),
            [
              { label: "Sí, mucho ejercicio", value: "mucho" },
              { label: "Moderadamente", value: "moderado" },
              { label: "Poco ejercicio", value: "poco" },
            ]
          )}

          {renderRadioGroup(
            "Nivel de energía",
            form.energyLevel ?? "",
            (value) => setFormField("energyLevel", value),
            [
              { label: "Bajo", value: "bajo" },
              { label: "Medio", value: "medio" },
              { label: "Alto", value: "alto" },
            ]
          )}
        </Card.Content>
      </Card>

      {/* Información Adicional */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.sectionTitle}>📝 Información Adicional</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Descripción general</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Cuéntanos sobre la personalidad, gustos y características especiales de tu mascota..."
              value={form.description}
              onChangeText={(text) => setFormField("description", text)}
              multiline
              numberOfLines={4}
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Foto</Text>

            {form.photoUrl ? (
              <View style={styles.imageContainer}>
                <Text style={styles.previewLabel}>Vista previa:</Text>
                <View style={styles.imagePreviewBox}>
                  <Image
                    source={{ uri: form.photoUrl }}
                    style={styles.image}
                    resizeMode="cover"
                  />
                </View>

                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={styles.imageButton}
                    onPress={handleChoosePhoto}
                  >
                    <Text style={styles.imageButtonText}>Cambiar foto</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.imageButton, styles.deleteButton]}
                    onPress={handleDeletePhoto}
                  >
                    <Text
                      style={[styles.imageButtonText, styles.deleteButtonText]}
                    >
                      Eliminar
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={styles.imageUploadButton}
                  onPress={handleChoosePhoto}
                >
                  <Text style={styles.imageUploadText}>
                    📸 Tomar o subir foto
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </Card.Content>
      </Card>

      {/* Botón de Envío */}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>🐾 Publicar Mascota</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  contentContainer: {
    paddingBottom: 32,
  },
  header: {
    backgroundColor: "#6366F1",
    paddingTop: 60,
    paddingBottom: 32,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#E0E7FF",
    textAlign: "center",
    fontWeight: "500",
  },
  card: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    backgroundColor: "#FFFFFF",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 20,
    paddingBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: "#E5E7EB",
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1.5,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: "#FFFFFF",
    color: "#1F2937",
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  radioContainer: {
    marginBottom: 16,
  },
  radioLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 12,
  },
  radioRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  radioItem: {
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    minWidth: "48%",
  },
  radioItemLabel: {
    fontSize: 14,
    color: "#374151",
  },
  submitButton: {
    backgroundColor: "#10B981",
    marginHorizontal: 16,
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 8,
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 18,
  },
  imageContainer: {
    marginTop: 8,
  },

  previewLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6B7280",
    marginBottom: 4,
  },

  previewText: {
    color: "#374151",
    fontSize: 14,
    fontStyle: "italic",
  },

  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8, //
  },

  imageButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: "#6366F1",
    borderRadius: 12,
    marginRight: 8,
  },

  deleteButton: {
    backgroundColor: "#EF4444",
    marginRight: 0,
    marginLeft: 8,
  },

  imageButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    textAlign: "center",
  },

  deleteButtonText: {
    color: "#FFF",
  },

  imageUploadButton: {
    backgroundColor: "#6366F1",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },

  imageUploadText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  imagePreviewBox: {
    width: "100%", // Ocupa todo el ancho disponible de la card
    aspectRatio: 1, // Mantiene proporción cuadrada automáticamente
    alignSelf: "center",
    backgroundColor: "#E5E7EB",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 12,
  },

  image: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },
});
