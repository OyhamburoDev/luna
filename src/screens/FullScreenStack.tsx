"use client";

import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  Animated,
  ScrollView,
} from "react-native";

import type { PetPost } from "../types/petPots";

import { useEffect, useState, useRef } from "react"; // Importar useRef
import Ionicons from "react-native-vector-icons/Ionicons";
import PetMediaCarousel from "../components/PetMediaCarousel";

import { StatusBar } from "react-native"; // 👈 importá StatusBar
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { navigate } from "../navigation/NavigationService";

const { width, height } = Dimensions.get("window");

type Props = {
  pet: PetPost;
  onGoBackToFeed: () => void;
  setModalVisible: (visible: boolean) => void;
};

export default function FullScreenStack({
  pet,
  onGoBackToFeed,
  setModalVisible,
}: Props) {
  const [showMore, setShowMore] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null); // Crear una referencia para el ScrollView
  const [showFullText, setShowFullText] = useState(false);
  const [textWasTruncated, setTextWasTruncated] = useState(false);
  const [textLineCount, setTextLineCount] = useState(0);

  const insets = useSafeAreaInsets();

  useEffect(() => {
    console.log("🔎 PetDetailScreen: Mascota recibida:", pet);
  }, [pet]);

  const mandatoryFields = ["age", "gender", "size", "species"];
  const petFields = Object.keys(pet);
  const extraFields = petFields.filter(
    (key) =>
      !mandatoryFields.includes(key) &&
      ![
        "id",
        "petName",
        "description",
        "createdAt",
        "videoUri",
        "imageUris",
      ].includes(key)
  );
  const hasExtraFields = extraFields.length > 0;

  const fieldLabels: Record<string, string> = {
    breed: "Raza",
    healthInfo: "Salud",
    isVaccinated: "Vacunado",
    isNeutered: "Castrado",
    hasMedicalConditions: "Condiciones médicas",
    medicalDetails: "Detalles médicos",
    goodWithKids: "Se lleva bien con niños",
    goodWithOtherPets: "Se lleva bien con otras mascotas",
    friendlyWithStrangers: "Amigable con desconocidos",
    needsWalks: "Necesita paseos",
    energyLevel: "Nivel de energía",
  };
  const fieldIcons: Record<string, string> = {
    breed: "paw-outline",
    healthInfo: "medkit-outline",
    isVaccinated: "shield-checkmark-outline",
    isNeutered: "cut-outline",
    hasMedicalConditions: "alert-circle-outline",
    medicalDetails: "document-text-outline",
    goodWithKids: "happy-outline",
    goodWithOtherPets: "people-outline",
    friendlyWithStrangers: "hand-left-outline",
    needsWalks: "walk-outline", // opcional, si no existe podés usar "footsteps-outline"
    energyLevel: "battery-half-outline", // o battery-full-outline si preferís
  };

  // Paleta de colores para los campos extra
  const extraFieldColors = [
    "#fdcb6e",
    "#00cec9",
    "#a29bfe",
    "#ffeaa7",
    "#fab1a0",
  ];

  const handleToggleMore = () => {
    if (showMore) {
      // Si se va a "Ver menos", desplazar hacia arriba
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    }
    setShowMore((prev) => !prev);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setTextLineCount(0);
      setTextWasTruncated(false);
      setShowFullText(false);
    }, 50); // Le da margen para montarse bien el texto

    return () => clearTimeout(timeout);
  }, [pet.id]);

  useEffect(() => {
    if (textLineCount > 2) {
      setTextWasTruncated(true);
    }
  }, [textLineCount]);

  const goToFormAdoption = () => {
    navigate("AdoptionFormPet", {
      petId: pet.id,
      petName: pet.petName,
      ownerId: pet.ownerId,
      ownerName: pet.ownerName,
      ownerEmail: pet.ownerEmail,
    });
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="black" />

      <View style={styles.container}>
        {/* Header */}
        <View
          style={[
            styles.headerGradient,
            { paddingTop: insets.top, height: 72 + insets.top },
          ]}
        >
          <TouchableOpacity
            onPress={onGoBackToFeed}
            style={[styles.backButton, { marginTop: 20 }]}
          >
            <View style={styles.backButtonCircle}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Overlay en la parte inferior del media */}
        <PetMediaCarousel pet={pet} />
        <View style={styles.mediaOverlay} />
        {/* </View> */}

        {/* Content Container - Ahora posicionado absolutamente */}
        <Animated.View
          style={[
            styles.contentContainerAbsolute,
            showMore && styles.contentContainerExpanded,
          ]}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 80 }}
            ref={scrollViewRef}
          >
            {/* Pet Name con estilo hero */}
            <View style={styles.heroSection}>
              <Text style={styles.petName}>{pet.petName}</Text>
              <View style={styles.heartContainer}>
                <TouchableOpacity style={styles.heartButton}>
                  <Ionicons name="heart-outline" size={28} color="#ff6b6b" />
                </TouchableOpacity>
              </View>
            </View>
            {/* Info Cards con nuevo diseño */}
            <View style={styles.infoCardsGrid}>
              {[
                {
                  label: "Edad",
                  value: pet.age,
                  icon: "time-outline",
                  color: "#667eea",
                },
                {
                  label: "Sexo",
                  value: pet.gender,
                  icon: "male-female-outline",
                  color: "#f093fb",
                },
                {
                  label: "Tamaño",
                  value: pet.size,
                  icon: "resize-outline",
                  color: "#4facfe",
                },
                {
                  label: "Especie",
                  value: pet.species,
                  icon: "paw-outline",
                  color: "#43e97b",
                },
              ].map((item, index) => (
                <View
                  key={index}
                  style={[
                    styles.infoCardCompact,
                    { borderTopColor: item.color },
                  ]}
                >
                  <Ionicons name={item.icon} size={16} color={item.color} />
                  <Text style={styles.infoLabelCompact}>{item.label}</Text>
                  <Text style={styles.infoValueCompact}>{item.value}</Text>
                </View>
              ))}
            </View>
            {showMore && (
              <View style={styles.infoCardsGrid2}>
                {extraFields.map((key, index) => {
                  const color =
                    extraFieldColors[index % extraFieldColors.length]; // Asigna color cíclicamente
                  return (
                    <View
                      key={index}
                      style={[
                        styles.infoCardCompact2,
                        { borderTopColor: color },
                      ]}
                    >
                      <Ionicons
                        name={fieldIcons[key] ?? "information-circle-outline"}
                        size={16}
                        color={color}
                      />
                      <Text style={styles.infoLabelCompact2}>
                        {fieldLabels[key] ?? key}
                      </Text>
                      <Text style={styles.infoValueCompact2}>
                        {String(pet[key as keyof PetPost])}
                      </Text>
                    </View>
                  );
                })}
              </View>
            )}
            {/* Botón ver más */}
            {hasExtraFields && (
              <TouchableOpacity
                onPress={handleToggleMore}
                style={styles.toggleMoreButton}
              >
                <Text
                  style={[
                    styles.toggleMoreButtonText,
                    showMore && styles.toggleMoreButtonTextUnderlined,
                  ]}
                >
                  {showMore ? "Ver menos" : "Ver más"}
                </Text>
              </TouchableOpacity>
            )}
            {/* Owner Section con diseño mejorado */}
            <View style={styles.ownerSection}>
              <View style={styles.ownerCard}>
                <View style={styles.ownerImageContainer}>
                  <Image
                    source={require("../../assets/media/images/user-photo.jpg")}
                    style={styles.ownerImage}
                  />
                  <View style={styles.onlineIndicator} />
                </View>
                <View style={styles.ownerInfo}>
                  <Text style={styles.ownerName}>María García</Text>
                  <Text style={styles.ownerRole}>Dueña verificada</Text>
                  <View style={styles.locationContainer}>
                    <Ionicons name="location" size={14} color="#ff6b6b" />
                    <Text style={styles.locationText}>2,5 km de distancia</Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.messageButton}>
                  <Ionicons
                    name="chatbubble-outline"
                    size={20}
                    color="#667eea"
                  />
                </TouchableOpacity>
              </View>
            </View>
            {/* Description con mejor formato */}
            <View style={styles.descriptionSection}>
              <Text style={styles.descriptionTitle}>Sobre {pet.petName}</Text>
              <Text
                key={pet.id + "-" + textLineCount}
                style={styles.description}
                numberOfLines={showFullText ? undefined : 2}
                onTextLayout={(e) => {
                  const lines = e.nativeEvent.lines.length;
                  console.log("Líneas reales de descripción:", lines); // 👈 Acá va el log
                  setTextLineCount(lines);
                  setTextWasTruncated(lines > 2);
                }}
              >
                {pet.description}
              </Text>

              {textWasTruncated && (
                <TouchableOpacity
                  onPress={() => setShowFullText((prev) => !prev)}
                  style={{ marginTop: 4 }}
                >
                  <Text style={styles.readMoreButton}>
                    {showFullText ? "Ver menos" : "Leer más"}
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Action Button mejorado */}
            <View style={styles.actionSection}>
              <TouchableOpacity
                style={styles.adoptButton}
                onPress={() => {
                  setModalVisible(true);
                }}
              >
                <View style={styles.adoptButtonGradient}>
                  <Ionicons
                    name="heart"
                    size={20}
                    color="white"
                    style={styles.adoptIcon}
                  />
                  <Text style={styles.adoptButtonText}>
                    Adoptar a {pet.petName}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </ScrollView>
          <View style={{ height: insets.bottom, backgroundColor: "black" }} />
        </Animated.View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    position: "relative",
  },
  headerGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 62,
    zIndex: 100,
  },
  backButton: {
    marginTop: 0,
    marginLeft: 20,
  },
  backButtonCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  mediaContainer: {
    position: "relative",
  },
  media: {
    width,
    height: height * 0.35, // Altura del media
  },
  mediaOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  contentContainerAbsolute: {
    position: "absolute",
    top: height * 0.37 - 30, // Inicia 30px antes del final del media
    left: 0,
    right: 0,
    bottom: 0, // Se extiende hasta el final de la pantalla
    backgroundColor: "white",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 15,
    paddingHorizontal: 0,
  },
  safeTop: {
    backgroundColor: "black",
  },
  contentContainerExpanded: {
    // No se necesita un estilo específico aquí para el scroll
  },
  heroSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    paddingHorizontal: 16,
  },
  petName: {
    fontSize: 28,
    fontWeight: "800",
    color: "#2d3436",
    flex: 1,
  },
  heartContainer: {
    marginLeft: 15,
  },
  heartButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#fff5f5",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#ff6b6b",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  infoCardsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 10,
    columnGap: 6,
    marginBottom: 15,
    paddingHorizontal: 16,
  },
  infoCardCompact: {
    alignItems: "center",
    backgroundColor: "white",
    padding: 12,
    borderRadius: 12,
    borderTopWidth: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    flex: 1,
    marginHorizontal: 4,
    width: "48%",
  },
  infoLabelCompact: {
    fontSize: 10,
    color: "#74b9ff",
    fontWeight: "600",
    textTransform: "uppercase",
    marginTop: 4,
  },
  infoValueCompact: {
    fontSize: 14,
    fontWeight: "700",
    color: "#2d3436",
    marginTop: 2,
  },
  infoCardsContainer: {
    marginBottom: 15,
  },
  infoCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 12,
    marginBottom: 8,
    borderRadius: 16,
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: "#74b9ff",
    fontWeight: "600",
    textTransform: "uppercase",
  },
  infoValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2d3436",
    marginTop: 2,
  },
  infoCardsGrid2: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 15,
    paddingHorizontal: 17,
  },
  infoCardCompact2: {
    width: "48%",
    marginBottom: 10,
    alignItems: "center",
    backgroundColor: "white",
    padding: 12,
    borderRadius: 12,
    borderTopWidth: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  infoLabelCompact2: {
    fontSize: 10,
    color: "#74b9ff",
    fontWeight: "600",
    textTransform: "uppercase",
    marginTop: 4,
  },
  infoValueCompact2: {
    fontSize: 14,
    fontWeight: "700",
    color: "#2d3436",
    marginTop: 2,
  },
  toggleMoreButton: {
    alignSelf: "center",
    marginTop: 5,
    marginBottom: 15,
  },
  toggleMoreButtonText: {
    color: "#999",
    fontWeight: "bold",
    fontSize: 14,
    textDecorationLine: "underline",
  },
  toggleMoreButtonTextUnderlined: {
    textDecorationLine: "underline",
  },
  ownerSection: {
    marginBottom: 15,
    paddingHorizontal: 16,
  },
  ownerCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 16,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  ownerImageContainer: {
    position: "relative",
    marginRight: 15,
  },
  ownerImage: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    borderWidth: 3,
    borderColor: "#667eea",
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#00b894",
    borderWidth: 2,
    borderColor: "white",
  },
  ownerInfo: {
    flex: 1,
  },
  ownerName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2d3436",
    marginBottom: 2,
  },
  ownerRole: {
    fontSize: 13,
    color: "#00b894",
    fontWeight: "600",
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationText: {
    fontSize: 12,
    color: "#636e72",
    marginLeft: 4,
  },
  messageButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#f1f3f4",
    justifyContent: "center",
    alignItems: "center",
  },
  descriptionSection: {
    marginBottom: 15,
    paddingHorizontal: 16,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2d3436",
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 20,
    color: "#636e72",
  },

  readMoreButton: {
    fontSize: 14,
    color: "#888",
    marginTop: 4,
    textDecorationLine: "underline",
  },
  actionSection: {
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
  adoptButton: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#667eea",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  adoptButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    paddingHorizontal: 30,
    backgroundColor: "#667eea",
  },
  adoptIcon: {
    marginRight: 10,
  },
  adoptButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
  },
});
