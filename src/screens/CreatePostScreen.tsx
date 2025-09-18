import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import PostMediaManager from "../components/PostMediaManager";
import { fonts } from "../theme/fonts";
import PetBasicInfo from "../components/PetBasicInfo";
import PetHealthInfo from "../components/PetHealthInfo";
import PetBehaviorInfo from "../components/PetBehaviorInfo";
import HealthModal from "../components/HealthModal";
import BehaviorModal from "../components/BehaviorModal";

type MediaItem = {
  uri: string;
  type: "photo" | "video";
  width?: number;
  height?: number;
};

type PetFormData = {
  petName: string;
  species: string;
  breed: string;
  age: string;
  gender: string;
  size: string;
  description: string;
};

type PetHealthData = {
  isVaccinated: string;
  isNeutered: string;
  hasMedicalConditions: string;
  medicalDetails: string;
  healthInfo: string;
};

type PetBehaviorData = {
  goodWithKids: string;
  goodWithOtherPets: string;
  friendlyWithStrangers: string;
  needsWalks: string;
  energyLevel: string;
};

type CreatePostScreenProps = {
  route?: {
    params?: {
      media?: {
        uri: string;
        width?: number;
        height?: number;
      };
      type?: "photo" | "video";
    };
  };
};

export default function CreatePostScreen({ route }: CreatePostScreenProps) {
  const navigation = useNavigation();
  const initialMedia = route?.params?.media;
  const initialType = route?.params?.type;
  const [healthModalVisible, setHealthModalVisible] = useState(false);
  const [behaviorModalVisible, setBehaviorModalVisible] = useState(false);

  // Estado para múltiples media
  const [mediaList, setMediaList] = useState<MediaItem[]>(
    initialMedia && initialType
      ? [
          {
            uri: initialMedia.uri,
            type: initialType,
            width: initialMedia.width,
            height: initialMedia.height,
          },
        ]
      : []
  );

  const [petFormData, setPetFormData] = useState<PetFormData>({
    petName: "",
    species: "",
    breed: "",
    age: "",
    gender: "",
    size: "",
    description: "",
  });

  const handlePetFormChange = (field: keyof PetFormData, value: string) => {
    setPetFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFieldEdit = (fieldType: string) => {
    // Por ahora solo un console.log, después implementamos la navegación
    console.log("Editar campo:", fieldType);
  };

  const [petHealthData, setPetHealthData] = useState<PetHealthData>({
    isVaccinated: "",
    isNeutered: "",
    hasMedicalConditions: "",
    medicalDetails: "",
    healthInfo: "",
  });

  const handleHealthChange = (field: keyof PetHealthData, value: string) => {
    setPetHealthData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const [petBehaviorData, setPetBehaviorData] = useState<PetBehaviorData>({
    goodWithKids: "",
    goodWithOtherPets: "",
    friendlyWithStrangers: "",
    needsWalks: "",
    energyLevel: "",
  });

  const handleBehaviorChange = (
    field: keyof PetBehaviorData,
    value: string
  ) => {
    setPetBehaviorData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePublish = async () => {
    if (mediaList.length === 0) {
      Alert.alert("Error", "No hay media para publicar");
      return;
    }

    try {
      setLoading(true);
      // Tu lógica de upload aquí
      Alert.alert("Éxito!", "Publicación creada correctamente");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", "No se pudo crear la publicación");
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    navigation.goBack();
  };

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <SafeAreaView style={styles.container}>
        {/* Header simple como TikTok */}
        <View style={styles.header}>
          <TouchableOpacity onPress={goBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={[{ fontFamily: fonts.bold }, styles.headerTitle]}>
            Publicar adopción
          </Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Componente para manejo de media */}
          <PostMediaManager
            mediaList={mediaList}
            onMediaListChange={setMediaList}
          />

          {/* Descripción */}
          {/* Desde aca  */}
          {/* <View style={styles.section}>
            <TextInput
              style={styles.descriptionInput}
              placeholder="Añade un título llamativo"
              placeholderTextColor="#999"
              value={description}
              onChangeText={setDescription}
              multiline
              maxLength={150}
            />
            <Text style={styles.subtitle}>
              Si escribes una descripción larga, puedes conseguir el triple de
              visualizaciones de media.
            </Text>
          </View> */}
          <PetBasicInfo
            formData={petFormData}
            onFormChange={handlePetFormChange}
            onFieldEdit={handleFieldEdit}
          />

          {/* Botones para secciones opcionales */}
          <TouchableOpacity
            style={styles.optionRow}
            onPress={() => setHealthModalVisible(true)}
          >
            <Ionicons name="medical-outline" size={24} color="#333" />
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>Información de salud</Text>
              <Text style={styles.optionSubtitle}>Opcional</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionRow}
            onPress={() => setBehaviorModalVisible(true)}
          >
            <Ionicons name="heart-outline" size={24} color="#333" />
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>
                Comportamiento y convivencia
              </Text>
              <Text style={styles.optionSubtitle}>Opcional</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>

          {/* <PetHealthInfo
            healthData={petHealthData}
            onHealthChange={handleHealthChange}
            onFieldEdit={handleFieldEdit}
          />

          <PetBehaviorInfo
            behaviorData={petBehaviorData}
            onBehaviorChange={handleBehaviorChange}
            onFieldEdit={handleFieldEdit}
          /> */}

          {/* Hashtags y menciones */}
          {/* <View style={styles.section}>
            <View style={styles.tagsContainer}>
              <TouchableOpacity style={styles.tagButton}>
                <Text style={styles.tagText}># Hashtags</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.tagButton}>
                <Text style={styles.tagText}>@ Mencionar</Text>
              </TouchableOpacity>
            </View>
          </View> */}

          {/* Ubicación */}
          {/* <TouchableOpacity style={styles.optionRow}>
            <Ionicons name="location-outline" size={24} color="#333" />
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>Ubicación</Text>
              <Text style={styles.optionSubtitle}>Añadir ubicación</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity> */}

          {/* Etiquetar personas */}
          {/* <TouchableOpacity style={styles.optionRow}>
            <Ionicons name="people-outline" size={24} color="#333" />
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>Etiquetar personas</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity> */}

          {/* Añadir enlace */}
          {/* <TouchableOpacity style={styles.optionRow}>
            <Ionicons name="link-outline" size={24} color="#333" />
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>Añadir enlace</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity> */}

          {/* Privacidad */}
          {/* <TouchableOpacity style={styles.optionRow}>
            <Ionicons name="globe-outline" size={24} color="#333" />
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>
                Todo el mundo puede ver esta publicación
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity> */}

          {/* Más opciones */}
          {/* <TouchableOpacity style={styles.optionRow}>
            <Ionicons name="ellipsis-horizontal" size={24} color="#333" />
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>Más opciones</Text>
              <Text style={styles.optionSubtitle}>
                La privacidad y otros ajustes se han trasladado aquí.
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity> */}
        </ScrollView>

        {/* Footer con botones como Instagram */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.publishButtonCentered,
              loading && styles.publishButtonDisabled,
            ]}
            onPress={handlePublish}
            disabled={loading}
          >
            <Text style={styles.publishButtonText}>
              {loading ? "Publicando..." : "Compartir"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Loading overlay */}
        {loading && (
          <View style={styles.loadingOverlay}>
            <View style={styles.loadingContainer}>
              <Ionicons name="cloud-upload" size={24} color="#fff" />
              <Text style={styles.loadingText}>Publicando...</Text>
            </View>
          </View>
        )}

        <HealthModal
          visible={healthModalVisible}
          onClose={() => setHealthModalVisible(false)}
          healthData={petHealthData}
          onHealthChange={handleHealthChange}
          onFieldEdit={handleFieldEdit}
        />

        <BehaviorModal
          visible={behaviorModalVisible}
          onClose={() => setBehaviorModalVisible(false)}
          behaviorData={petBehaviorData}
          onBehaviorChange={handleBehaviorChange}
          onFieldEdit={handleFieldEdit}
        />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  placeholder: {
    width: 32,
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 16,
  },
  descriptionInput: {
    fontSize: 16,
    color: "#000",
    minHeight: 50,
    textAlignVertical: "top",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 13,
    color: "#666",
    lineHeight: 18,
  },
  tagsContainer: {
    flexDirection: "row",
    gap: 12,
  },
  tagButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#f5f5f5",
    borderRadius: 20,
  },
  tagText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
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

  draftButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
  },
  draftButtonText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  publishButton: {
    flex: 2,
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: "#6366F1",
    alignItems: "center",
  },
  publishButtonDisabled: {
    backgroundColor: "#ffaaaa",
  },
  publishButtonText: {
    fontSize: 16,
    color: "white",
    fontWeight: "600",
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.8)",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  loadingText: {
    color: "white",
    fontSize: 16,
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    alignItems: "center", // Esto centra el contenido
  },
  publishButtonCentered: {
    paddingVertical: 14,
    paddingHorizontal: 70,
    borderRadius: 10,
    backgroundColor: "#6366F1",
    alignItems: "center",
  },
});
