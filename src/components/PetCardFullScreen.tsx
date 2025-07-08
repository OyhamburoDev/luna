"use client";

import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Video, ResizeMode } from "expo-av";
import { useState } from "react";
import type { PetPost } from "../types/petPots";
import { LinearGradient } from "expo-linear-gradient";

const { height, width } = Dimensions.get("window");

type Props = {
  pet: PetPost;
};

export default function PetCardFullScreen({ pet }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Lógica para detectar si necesita botón "más"
  const shouldShowMoreButton = pet.description && pet.description.length > 80;

  // TU ALTURA ORIGINAL - NO LA CAMBIO
  const availableHeight = height - 70;

  // Cálculo dinámico de altura del overlay basado en el contenido
  const baseOverlayHeight = 30; // MÁS ALTURA BASE para que siempre haya espacio para el botón
  const lineHeight = 30; // Altura aproximada por línea de texto
  const charactersPerLine = 50; // Caracteres aproximados por línea

  let overlayHeight = baseOverlayHeight;

  if (isExpanded && pet.description) {
    // Calcular líneas necesarias para todo el texto
    const estimatedLines = Math.ceil(
      pet.description.length / charactersPerLine
    );
    overlayHeight = baseOverlayHeight + estimatedLines * lineHeight + 40; // +20 padding extra
  } else {
    // Altura para 2 líneas cuando está colapsado - AHORA MÁS GRANDE
    overlayHeight = baseOverlayHeight + 2 * lineHeight;
  }

  return (
    <View style={styles.container}>
      {pet.videoUri ? (
        <Video
          source={pet.videoUri}
          style={[styles.videoMedia, { height: availableHeight }]}
          resizeMode={ResizeMode.COVER}
          shouldPlay
          isLooping
          isMuted
        />
      ) : pet.imageUris && pet.imageUris.length > 0 ? (
        <View style={[styles.imageContainer, { height: availableHeight }]}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.imageScrollContainer}
          >
            {pet.imageUris.map((img, index) => (
              <View key={index} style={styles.imageWrapper}>
                <Image
                  source={img}
                  style={styles.imageMedia}
                  resizeMode="contain"
                />
              </View>
            ))}
          </ScrollView>
        </View>
      ) : (
        <View style={[styles.media, { height: availableHeight }]} />
      )}

      {/* Overlay con altura dinámica basada en contenido */}
      <View style={[styles.overlay, { height: overlayHeight }]}>
        <LinearGradient
          colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.8)"]}
          style={styles.gradientOverlay}
        />
        <Text style={styles.name}>{pet.petName}</Text>
        <View style={[styles.descriptionContainer, { flexDirection: "row" }]}>
          <View
            style={{
              width: "75%", // CAMBIÉ DE 75% A 70% para dar más espacio al botón
              flex: 1,
            }}
          >
            <Text
              style={[
                styles.description,
                shouldShowMoreButton && !isExpanded
                  ? styles.descriptionWithButton
                  : null,
              ]}
              numberOfLines={isExpanded ? undefined : 2}
            >
              {pet.description}
            </Text>
          </View>
          <View
            style={{
              alignItems: "flex-start",
              justifyContent: "flex-start",

              width: "25%", // CAMBIÉ DE 25% A 30% para más espacio
            }}
          >
            {shouldShowMoreButton && (
              <TouchableOpacity
                onPress={() => setIsExpanded(!isExpanded)}
                style={styles.moreButtonContainer}
              >
                <Text style={styles.moreButton}>
                  {isExpanded ? "menos" : "más"}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
      <View style={styles.bottomSpacer} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: height,
    width: width,
    backgroundColor: "black",
    justifyContent: "center",
  },
  media: {
    width: width,
    backgroundColor: "black",
  },
  videoMedia: {
    width: width,
    backgroundColor: "black",
  },
  imageContainer: {
    width: width,
    backgroundColor: "black",
    justifyContent: "center",
  },
  imageScrollContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  imageWrapper: {
    width: width,
    justifyContent: "center",
    alignItems: "center",
  },
  imageMedia: {
    maxWidth: width,
    maxHeight: "80%",
    aspectRatio: undefined,
  },
  overlay: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 10,
    zIndex: 10, // ← AGREGAR ESTO
  },
  gradientOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    zIndex: 1,
  },
  descriptionContainer: {
    flexDirection: "row",
    marginTop: 2,
    flex: 1,
  },
  description: {
    fontSize: 14,
    color: "white",
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    zIndex: 1,
    flex: 1,
  },
  descriptionWithButton: {
    paddingRight: 15,
  },
  moreButtonContainer: {
    position: "absolute",
    right: 0,
    bottom: 0,
    justifyContent: "center",

    width: "100%",
    height: "100%",
  },
  moreButton: {
    fontSize: 14,
    color: "#999",
    fontWeight: "600",
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    marginTop: 13, // ← AGREGAR ESTO
    zIndex: 1,
  },
  bottomSpacer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: "black",
  },
});
