import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";
import { useState, useRef, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import type { PetPost } from "../types/petPots";
import { StatusBar } from "react-native"; // 👈 importá StatusBar
import { fonts } from "../theme/fonts";
import PetMediaCarouselTest from "../components/PetMediaCarouselText";
import HealthModalStackScreen from "../components/HealthModalStackScreen";
import BehaviorModalStackScreen from "../components/BehaviorModalStackScreen";
import useOwnerStats from "../hooks/useOwnerStats";
import { useFocusEffect } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  pet: PetPost;
  onGoBackToFeed: () => void;
  setModalVisible: (visible: boolean) => void;
};

export default function FullScreenStackTest({
  pet,
  onGoBackToFeed,
  setModalVisible,
}: Props) {
  const {
    postsCount,
    totalLikes,
    loading: statsLoading,
    refreshStats,
  } = useOwnerStats(pet?.ownerId || "");
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [healthModalVisible, setHealthModalVisible] = useState(false);
  const [behaviorModalVisible, setBehaviorModalVisible] = useState(false);

  const insets = useSafeAreaInsets();

  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: false });
  }, [pet.id]);

  useFocusEffect(
    React.useCallback(() => {
      console.log("🔄 Refrescando stats del owner...");
      refreshStats();
    }, [refreshStats])
  );

  // Verificar si hay datos de salud
  const hasHealthInfo =
    pet.isVaccinated ||
    pet.isNeutered ||
    pet.hasMedicalConditions ||
    pet.medicalDetails;

  // Verificar si hay datos de comportamiento
  const hasBehaviorInfo =
    pet.goodWithKids ||
    pet.goodWithOtherPets ||
    pet.friendlyWithStrangers ||
    pet.needsWalks ||
    pet.energyLevel;

  return (
    <>
      <SafeAreaView
        style={{ flex: 1, backgroundColor: "#f5f5f5" }}
        edges={["bottom"]}
      >
        <StatusBar barStyle="light-content" backgroundColor="black" />
        <ScrollView
          ref={scrollViewRef}
          showsVerticalScrollIndicator={false}
          style={styles.container}
        >
          <View>
            <View
              style={[
                styles.headerGradient,
                { paddingTop: insets.top, height: 72 + insets.top },
              ]}
            >
              <TouchableOpacity
                onPress={onGoBackToFeed}
                style={[styles.backButton, { marginTop: 15 }]}
              >
                <View style={styles.backButtonCircle}>
                  <Ionicons name="arrow-back" size={26} color="white" />
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.headerBackground}>
              <PetMediaCarouselTest pet={pet} />
            </View>
            <View style={styles.contentContainer}>
              <View style={styles.card}>
                <Text style={styles.petName}>{pet.petName}</Text>
                <Text style={styles.petSubtitle}>
                  {pet.age} años • {pet.size} • Disponible
                </Text>
                <Text
                  style={styles.bioText}
                  numberOfLines={isDescriptionExpanded ? undefined : 2}
                >
                  {pet.description}
                </Text>
                {pet.description.length > 50 && (
                  <TouchableOpacity
                    onPress={() =>
                      setIsDescriptionExpanded(!isDescriptionExpanded)
                    }
                    style={styles.readMoreButton}
                  >
                    <Text style={styles.readMoreText}>
                      {isDescriptionExpanded ? "Ver menos" : "Ver más"}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
              <View style={styles.card}>
                <View style={styles.infoRow}>
                  <View style={styles.infoItem}>
                    <Ionicons
                      name="male-female-outline"
                      size={28}
                      color="#1F2937"
                    />
                    <Text style={styles.infoLabel}>Género</Text>
                  </View>
                  <Text style={styles.infoValue}>{pet.gender}</Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.infoRow}>
                  <View style={styles.infoItem}>
                    <Ionicons name="resize-outline" size={28} color="#1F2937" />
                    <Text style={styles.infoLabel}>Tamaño</Text>
                  </View>
                  <Text style={styles.infoValue}>{pet.size}</Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.infoRow}>
                  <View style={styles.infoItem}>
                    <Ionicons name="paw-outline" size={28} color="#1F2937" />
                    <Text style={styles.infoLabel}>Especie</Text>
                  </View>
                  <Text style={styles.infoValue}>{pet.species}</Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.infoRow}>
                  <View style={styles.infoItem}>
                    <Ionicons name="heart-outline" size={28} color="#1F2937" />
                    <Text style={styles.infoLabel}>Raza</Text>
                  </View>
                  <Text style={styles.infoValue}>{pet.breed}</Text>
                </View>
              </View>
              <View style={styles.card}>
                <View style={styles.shelterHeader}>
                  <View style={styles.shelterAvatarContainer}>
                    <View style={styles.shelterAvatar}>
                      <Image
                        source={
                          pet.ownerAvatar &&
                          typeof pet.ownerAvatar === "string" &&
                          pet.ownerAvatar.startsWith("http")
                            ? { uri: pet.ownerAvatar }
                            : pet.ownerAvatar
                            ? pet.ownerAvatar
                            : require("../../assets/media/avatars/default-avatar.jpg")
                        }
                        style={styles.shelterAvatarImage}
                      />
                    </View>
                    <View style={styles.shelterOnlineIndicator} />
                  </View>
                  <View style={styles.shelterInfo}>
                    <Text style={styles.shelterName}>{pet.ownerName}</Text>
                    <Text style={styles.shelterLocation}>
                      {pet.ownerLocation || "Buenos Aires, Argentina"}
                    </Text>
                  </View>
                </View>
                <View style={styles.shelterStats}>
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>
                      {statsLoading ? "..." : postsCount}
                    </Text>
                    <Text style={styles.statLabel}>Publicaciones</Text>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>
                      {statsLoading ? "..." : totalLikes}
                    </Text>
                    <Text style={styles.statLabel}>Likes</Text>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>
                      {pet.ownerCreatedAt
                        ? new Date(pet.ownerCreatedAt).getFullYear()
                        : "..."}
                    </Text>
                    <Text style={styles.statLabel}>Miembro</Text>
                  </View>
                </View>
              </View>
              {/* INFORMACION DE SALUD */}
              {hasHealthInfo && (
                <TouchableOpacity
                  style={[styles.card, styles.interactiveCard]}
                  onPress={() => setHealthModalVisible(true)}
                >
                  <View style={styles.cardHeader}>
                    <View style={styles.cardHeaderLeft}>
                      <Ionicons
                        name="medical-outline"
                        size={32}
                        color="#1F2937"
                      />
                      <View style={styles.cardTextContainer}>
                        <Text style={styles.cardTitle}>
                          Información de salud
                        </Text>
                        <Text style={styles.cardSubtitle}>
                          Vacunas, esterilización y más
                        </Text>
                      </View>
                    </View>
                    <Ionicons
                      name="chevron-forward"
                      size={24}
                      color="#9CA3AF"
                    />
                  </View>
                </TouchableOpacity>
              )}
              {/* modal para la informacion de salud: */}
              <HealthModalStackScreen
                visible={healthModalVisible}
                onClose={() => setHealthModalVisible(false)}
                pet={pet}
              />
              {/* INFORMACION DE CONVIVENCIA  */}
              {hasBehaviorInfo && (
                <TouchableOpacity
                  style={[styles.card, styles.interactiveCard]}
                  onPress={() => setBehaviorModalVisible(true)}
                >
                  <View style={styles.cardHeader}>
                    <View style={styles.cardHeaderLeft}>
                      <Ionicons
                        name="happy-outline"
                        size={32}
                        color="#1F2937"
                      />
                      <View style={styles.cardTextContainer}>
                        <Text style={styles.cardTitle}>
                          Comportamiento y convivencia
                        </Text>
                        <Text style={styles.cardSubtitle}>
                          Personalidad, energía y compatibilidad
                        </Text>
                      </View>
                    </View>
                    <Ionicons
                      name="chevron-forward"
                      size={24}
                      color="#9CA3AF"
                    />
                  </View>
                </TouchableOpacity>
              )}
              {/* Modal para la información de convivencia */}
              <BehaviorModalStackScreen
                visible={behaviorModalVisible}
                onClose={() => setBehaviorModalVisible(false)}
                pet={pet}
              />
            </View>
          </View>
        </ScrollView>
        <View style={styles.footer}>
          <TouchableOpacity style={styles.adoptButton} onPress={() => {}}>
            <Text style={styles.adoptButtonText}>Adoptar a {pet.petName}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
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
    marginLeft: 15,
  },
  backButtonCircle: {
    width: 40,
    height: 40,
    // borderRadius: 20,
    // backgroundColor: "rgba(0, 0, 0, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerBackground: {},
  contentContainer: {
    padding: 16,
    gap: 16,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 0,
  },
  petName: {
    fontSize: 20,
    fontFamily: fonts.bold,
    color: "#111827",
    marginBottom: 6,
  },
  petSubtitle: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: "#6B7280",
    marginBottom: 16,
  },
  bioText: {
    fontSize: 15,
    fontFamily: fonts.regular,
    color: "#6B7280",
    lineHeight: 22,
  },
  readMoreButton: {
    marginTop: 8,
    alignSelf: "flex-start",
  },
  readMoreText: {
    fontSize: 14,
    fontFamily: fonts.semiBold,
    color: "#667eea",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  infoLabel: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: "#6B7280",
  },
  infoValue: {
    fontFamily: fonts.bold,

    fontSize: 15,
    color: "#2d3436",
  },
  divider: {
    height: 1,
    backgroundColor: "#F3F4F6",
  },
  shelterHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginBottom: 20,
  },
  shelterAvatarContainer: {
    position: "relative",
    marginRight: 12,
  },
  shelterAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden", // Importante para que la imagen respete el borderRadius
  },
  shelterAvatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: 25,
  },
  shelterOnlineIndicator: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#00b894",
    borderWidth: 2,
    borderColor: "white",
  },
  shelterInfo: {
    flex: 1,
  },
  shelterName: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: "#111827",
  },
  shelterLocation: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: "#6B7280",
    marginTop: 2,
  },
  shelterStats: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontFamily: fonts.bold,
    color: "#667eea",
  },
  statLabel: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: "#9CA3AF",
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: "#F3F4F6",
  },
  interactiveCard: {
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    flex: 1,
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 15,
    fontFamily: fonts.bold,
    color: "#111827",
  },
  cardSubtitle: {
    fontSize: 13,
    fontFamily: fonts.regular,
    color: "#9CA3AF",
    marginTop: 4,
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    backgroundColor: "white",
  },
  adoptButton: {
    paddingVertical: 15,
    borderRadius: 14,
    backgroundColor: "#667eea",
    alignItems: "center",
    justifyContent: "center",
  },
  adoptButtonText: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: "white",
  },
});
