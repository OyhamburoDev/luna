"use client";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { Video, ResizeMode } from "expo-av";
import { useState, useRef, useEffect } from "react";
import type { PetPost } from "../types/petPots";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/types";
// @ts-ignore
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const { height, width } = Dimensions.get("window");

type Props = {
  pet: PetPost;
  onPressArrow?: () => void;
  isActive: boolean;
};

export default function PetCardFullScreen({
  pet,
  onPressArrow,
  isActive,
}: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigation = useNavigation<NavigationProp>();
  const videoRef = useRef<Video>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const controlTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Lógica para detectar si necesita botón "más"
  const shouldShowMoreButton = pet.description && pet.description.length > 80;

  // TU ALTURA ORIGINAL - NO LA CAMBIO
  const availableHeight = height - 70;

  // Cálculo dinámico de altura del overlay basado en el contenido
  const baseOverlayHeight = 30;
  const lineHeight = 30;
  const charactersPerLine = 50;
  let overlayHeight = baseOverlayHeight;

  if (isExpanded && pet.description) {
    const estimatedLines = Math.ceil(
      pet.description.length / charactersPerLine
    );
    overlayHeight = baseOverlayHeight + estimatedLines * lineHeight + 40;
  } else {
    overlayHeight = baseOverlayHeight + 2 * lineHeight;
  }

  const handleVideoPress = async () => {
    // Directamente controlar la reproducción al tocar la pantalla
    try {
      if (isPlaying) {
        // PAUSAR: mostrar ícono y mantenerlo visible
        await videoRef.current?.pauseAsync();
        setIsPlaying(false);
        setShowControls(true);

        // Limpiar cualquier timeout previo
        if (controlTimeoutRef.current) {
          clearTimeout(controlTimeoutRef.current);
        }
        // NO establecer timeout - el ícono se queda visible
      } else {
        // REPRODUCIR: ocultar ícono después de 1 segundo
        await videoRef.current?.playAsync();
        setIsPlaying(true);
        setShowControls(true);

        // Limpiar timeout previo
        if (controlTimeoutRef.current) {
          clearTimeout(controlTimeoutRef.current);
        }

        // Ocultar después de 1 segundo cuando se reproduce
        controlTimeoutRef.current = setTimeout(() => {
          setShowControls(false);
        }, 500);
      }
    } catch (error) {
      console.log("Error toggling video playback:", error);
    }
  };

  // ✅ Mejorar el useEffect para manejar mejor la reproducción
  useEffect(() => {
    const handleVideoPlayback = async () => {
      if (videoRef.current) {
        try {
          if (isActive) {
            await videoRef.current.playAsync();
            setIsPlaying(true);
          } else {
            await videoRef.current.pauseAsync();
            setIsPlaying(false);
            // ✅ También ocultar controles cuando no está activo
            setShowControls(false);
          }
        } catch (error) {
          console.log("Error handling video playback:", error);
        }
      }
    };

    handleVideoPlayback();

    // ✅ Cleanup cuando el componente se desmonta o cambia isActive
    return () => {
      if (controlTimeoutRef.current) {
        clearTimeout(controlTimeoutRef.current);
      }
    };
  }, [isActive]);

  // ✅ Limpiar timeout cuando el componente se desmonta
  useEffect(() => {
    return () => {
      if (controlTimeoutRef.current) {
        clearTimeout(controlTimeoutRef.current);
      }
    };
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={onPressArrow}
        style={styles.discoverMoreContainer}
        activeOpacity={0.6}
      >
        <Text style={styles.discoverMoreText}>
          Descubrí más <Text style={styles.arrow}>→</Text>
        </Text>
      </TouchableOpacity>

      {pet.videoUri ? (
        <View style={styles.mediaContainer}>
          <TouchableWithoutFeedback onPress={handleVideoPress}>
            <Video
              source={pet.videoUri}
              style={[styles.videoMedia, { height: availableHeight }]}
              resizeMode={ResizeMode.COVER}
              ref={videoRef}
              isLooping
              shouldPlay={isActive && isPlaying}
              // ✅ Asegurar que el video esté muteado por defecto para evitar conflictos de audio
              isMuted={false}
            />
          </TouchableWithoutFeedback>

          {showControls && isActive && (
            <View style={styles.playButton} pointerEvents="none">
              <MaterialIcons
                name="play-arrow"
                size={100}
                color="rgba(255, 255, 255, 0.36)"
              />
            </View>
          )}
        </View>
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

      <View style={[styles.overlay, { height: overlayHeight }]}>
        <LinearGradient
          colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.8)"]}
          style={styles.gradientOverlay}
        />
        <Text style={styles.name}>{pet.petName}</Text>
        <View style={[styles.descriptionContainer, { flexDirection: "row" }]}>
          <View
            style={{
              width: "75%",
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
              width: "25%",
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
    height: height * 0.4,
  },
  imageContainer: {
    width: width,
    backgroundColor: "black",
    justifyContent: "center",
  },
  discoverMoreContainer: {
    position: "absolute",
    top: 60,
    right: 20,
    zIndex: 10,
  },
  mediaContainer: {
    position: "relative",
  },
  playButton: {
    position: "absolute",
    top: "45%",
    left: "38%",
    width: 90,
    height: 90,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
    // ✅ Removido: borderRadius y backgroundColor
  },
  discoverMoreText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textShadowColor: "rgba(0, 0, 0, 0.7)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  arrow: {
    fontSize: 20,
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
    zIndex: 10,
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
    marginTop: 13,
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
