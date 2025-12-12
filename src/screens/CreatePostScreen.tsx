import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import PostMediaManager from "../components/PostMediaManager";
import { fonts } from "../theme/fonts";
import PetBasicInfo from "../components/PetBasicInfo";
import HealthModal from "../components/HealthModal";
import BehaviorModal from "../components/BehaviorModal";
import { navigate } from "../navigation/NavigationService";
import PetFieldEdit from "../components/PetFieldEdit";
import { PetPost } from "../types/petPots";
import { useCreatePost } from "../hooks/useCreatePost"; // HOOK LIMPIO
import { useFirebasePosts } from "../hooks/useFirebasePosts";
import type { KeyboardTypeOptions } from "react-native";
import { useAuthModalContext } from "../contexts/AuthModalContext";
import { useConfettiStore } from "../store/useConfettiStore";
import * as NavigationBar from "expo-navigation-bar";
import { useNavigation } from "@react-navigation/native";

type MediaItem = {
  uri: string;
  type: "photo" | "video";
  width?: number;
  height?: number;
};

type CreatePostScreenProps = {
  route?: {
    params?: {
      media?: { uri: string; width?: number; height?: number };
      type?: "photo" | "video";
    };
  };
  onBack?: () => void;
};

export default function CreatePostScreen({
  route,
  onBack,
}: CreatePostScreenProps) {
  const initialMedia = route?.params?.media;
  const initialType = route?.params?.type;
  const { marcarNuevoPost } = useConfettiStore();

  const { requireAuth } = useAuthModalContext();
  const navigation = useNavigation();

  //  OBTENER LA FUNCIÓN PARA AGREGAR POSTS LOCALMENTE
  const { addNewPostLocally } = useFirebasePosts();

  //  PASAR LA FUNCIÓN AL HOOK DE CREACIÓN
  const { createPost, loading, updateFieldError, touchField, hasError } =
    useCreatePost(addNewPostLocally);

  const [healthModalVisible, setHealthModalVisible] = useState(false);
  const [behaviorModalVisible, setBehaviorModalVisible] = useState(false);

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

  const [postData, setPostData] = useState<Partial<PetPost>>({
    petName: "",
    species: "",
    breed: "",
    age: 0,
    gender: "",
    size: "",
    description: "",
  });

  const [fieldEditConfig, setFieldEditConfig] = useState<{
    title: string;
    fieldType: keyof PetPost;
    value: string;
    placeholder: string;
    maxLength: number;
    multiline: boolean;
    keyboardType?: KeyboardTypeOptions;
  } | null>(null);

  React.useEffect(() => {
    // Configurar barra de navegación al entrar
    NavigationBar.setBackgroundColorAsync("#ffffff");
    NavigationBar.setButtonStyleAsync("dark");

    // Cleanup: restaurar al salir
    return () => {
      NavigationBar.setBackgroundColorAsync("#000000");
      NavigationBar.setButtonStyleAsync("light");
    };
  }, []);

  const updateField = (field: keyof PetPost, value: any) => {
    setPostData((prev) => ({ ...prev, [field]: value }));
    updateFieldError(field, value);
  };

  const handleFieldBlur = (field: keyof PetPost) => {
    touchField(field);
    updateFieldError(field, postData[field]);
  };

  const handleFieldEdit = (fieldType: string) => {
    const fieldConfig: Record<
      string,
      { title: string; placeholder: string; modalTitle?: string }
    > = {
      petName: { title: "Nombre", placeholder: "Ej: Max, Luna..." },
      species: { title: "Especie", placeholder: "Ej: Perro, Gato..." },
      breed: {
        title: "Raza",
        placeholder: "Ej: mestizo, Callejero, Labrador, Persa...",
      },
      age: {
        title: "Edad",
        modalTitle: "Edad aproximada", // Título diferente para el modal
        placeholder: "Edad en años (0-25)",
      },
      gender: { title: "Sexo", placeholder: "Macho o Hembra" },
      size: { title: "Tamaño", placeholder: "Pequeño, Mediano, Grande" },
      description: {
        title: "Descripción",
        placeholder: "Describe a tu mascota...",
      },

      isVaccinated: {
        title: "¿Está vacunado/a?",
        placeholder: "Seleccionar",
      },
      isNeutered: {
        title: "¿Está castrado/a?",
        placeholder: "Seleccionar",
      },
      hasMedicalConditions: {
        title: "¿Condiciones médicas?",
        placeholder: "Seleccionar",
        modalTitle: "Condiciones médicas",
      },
      healthInfo: {
        title: "Información adicional",
        placeholder: "Añade detalles sobre la salud de tu mascota...",
        modalTitle: "Info adicional",
      },
      goodWithKids: {
        title: "Bueno con niños",
        placeholder: "Seleccionar",
      },
      goodWithOtherPets: {
        title: "Bueno con mascotas",
        placeholder: "Seleccionar",
      },
      friendlyWithStrangers: {
        title: "Sociable con extraños",
        placeholder: "Seleccionar",
      },
      needsWalks: {
        title: "Necesita paseos",
        placeholder: "Seleccionar",
      },
    };

    const config = fieldConfig[fieldType];
    if (config) {
      // Cerrar el modal de salud si está abierto
      setHealthModalVisible(false);
      setBehaviorModalVisible(false);

      setFieldEditConfig({
        title: (config as any).modalTitle || config.title, // Usa modalTitle si existe
        fieldType: fieldType as keyof PetPost,
        value: String(postData[fieldType as keyof PetPost] || ""),
        placeholder: config.placeholder,
        maxLength:
          fieldType === "description"
            ? 500
            : fieldType === "breed"
            ? 40
            : fieldType === "age"
            ? 2
            : 50,
        multiline: fieldType === "description",
        keyboardType: fieldType === "age" ? "numeric" : "default", // AGREGAR ESTA LÍNEA
      });
    }
  };

  const saveField = (fieldType: keyof PetPost, value: string) => {
    updateField(fieldType, value);
    setFieldEditConfig(null);

    // Si venía del modal de salud, volver a abrirlo
    const healthFields = [
      "isVaccinated",
      "isNeutered",
      "hasMedicalConditions",
      "healthInfo",
    ];
    // Si venía del modal de comportamiento, volver a abrirlo
    const behaviorFields = [
      "goodWithKids",
      "goodWithOtherPets",
      "friendlyWithStrangers",
      "needsWalks",
    ];
    if (behaviorFields.includes(fieldType)) {
      setBehaviorModalVisible(true);
    }
    if (healthFields.includes(fieldType)) {
      setHealthModalVisible(true);
    }
  };

  // FUNCIÓN SUPER LIMPIA
  const handlePublish = async () => {
    requireAuth(async () => {
      const success = await createPost(postData, mediaList);

      if (success) {
        marcarNuevoPost();
        navigate("Swipe");
      }
    });
  };

  const goBack = () => {
    navigation.goBack();
  };

  if (fieldEditConfig) {
    return (
      <PetFieldEdit
        title={fieldEditConfig.title}
        value={fieldEditConfig.value}
        placeholder={fieldEditConfig.placeholder}
        maxLength={fieldEditConfig.maxLength}
        multiline={fieldEditConfig.multiline}
        fieldType={fieldEditConfig.fieldType}
        keyboardType={fieldEditConfig.keyboardType} // AGREGAR ESTA LÍNEA
        onSave={(value) => saveField(fieldEditConfig.fieldType, value)}
        onCancel={() => setFieldEditConfig(null)}
      />
    );
  }

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <SafeAreaView style={styles.container}>
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
          <PostMediaManager
            mediaList={mediaList}
            onMediaListChange={setMediaList}
          />

          <PetBasicInfo
            formData={{
              petName: postData.petName || "",
              species: postData.species || "",
              breed: postData.breed || "",
              age: String(postData.age || ""),
              gender: postData.gender || "",
              size: postData.size || "",
              description: postData.description || "",
            }}
            onFormChange={(field, value) =>
              updateField(field as keyof PetPost, value)
            }
            onFieldEdit={handleFieldEdit}
            errors={{
              petName: hasError("petName"),
              species: hasError("species"),
              breed: hasError("breed"),
              age: hasError("age"),
              gender: hasError("gender"),
              size: hasError("size"),
              description: hasError("description"),
            }}
            onBlur={handleFieldBlur}
          />

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
        </ScrollView>

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
          healthData={{
            isVaccinated: postData.isVaccinated || "",
            isNeutered: postData.isNeutered || "",
            hasMedicalConditions: postData.hasMedicalConditions || "",
            medicalDetails: postData.medicalDetails || "",
            healthInfo: postData.healthInfo || "",
          }}
          onHealthChange={(field, value) =>
            updateField(field as keyof PetPost, value)
          }
          onFieldEdit={handleFieldEdit}
        />

        <BehaviorModal
          visible={behaviorModalVisible}
          onClose={() => setBehaviorModalVisible(false)}
          behaviorData={{
            goodWithKids: postData.goodWithKids || "",
            goodWithOtherPets: postData.goodWithOtherPets || "",
            friendlyWithStrangers: postData.friendlyWithStrangers || "",
            needsWalks: postData.needsWalks || "",
            energyLevel: postData.energyLevel || "",
          }}
          onBehaviorChange={(field, value) =>
            updateField(field as keyof PetPost, value)
          }
          onFieldEdit={handleFieldEdit}
        />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: "600", color: "#000" },
  placeholder: { width: 32 },
  content: { flex: 1 },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  optionContent: { flex: 1, marginLeft: 12 },
  optionTitle: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
    color: "#000",
    fontWeight: "400",
  },
  optionSubtitle: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: "#666",
    marginTop: 2,
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    alignItems: "center",
  },
  publishButtonCentered: {
    paddingVertical: 14,
    paddingHorizontal: 70,
    borderRadius: 10,
    backgroundColor: "#667eea",
    alignItems: "center",
  },
  publishButtonDisabled: { backgroundColor: "#ffaaaa" },
  publishButtonText: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: "white",
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
  loadingText: { color: "white", fontSize: 16 },
});
