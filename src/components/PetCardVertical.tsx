"use client";

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Pressable,
} from "react-native";
import { Video, ResizeMode } from "expo-av";
import { useRef, useEffect, useState } from "react";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PetPost } from "../types/petPots";

type Props = {
  pet: PetPost;
  isActive: boolean;
  alturaCard: number; // Esto ahora será la altura medida dinámicamente
};

export default function PetCardVertical({ pet, isActive, alturaCard }: Props) {
  const videoRef = useRef<Video>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const controlTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const insets = useSafeAreaInsets(); // Se mantiene por si es útil para afinar la posición del overlay

  // Estados para la barra de progreso del video
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);

  // Activar o desactivar sonido
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const controlPlayback = async () => {
      if (!videoRef.current) return;
      try {
        if (isActive) {
          await videoRef.current.playAsync();
          setIsPlaying(true);
        } else {
          await videoRef.current.pauseAsync();
          setIsPlaying(false);
          setShowControls(false);
        }
      } catch (error) {
        console.log("Error controlando reproducción:", error);
      }
    };
    controlPlayback();
    return () => {
      if (controlTimeoutRef.current) {
        clearTimeout(controlTimeoutRef.current);
      }
    };
  }, [isActive]);

  const handleVideoPress = async () => {
    try {
      if (!videoRef.current) return;
      if (isPlaying) {
        await videoRef.current.pauseAsync();
        setIsPlaying(false);
        setShowControls(true);
      } else {
        await videoRef.current.playAsync();
        setIsPlaying(true);
        setShowControls(true);
        controlTimeoutRef.current = setTimeout(() => {
          setShowControls(false);
        }, 500);
      }
    } catch (error) {
      console.log("Error al reproducir/pausar video:", error);
    }
  };

  const shouldShowMoreButton = pet.description && pet.description.length > 80;
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

  // Manejar callback apra el estado del progreso del video

  const onPlaybackStatusUpdate = (status: any) => {
    if (status.isLoaded) {
      const currentPosition = status.positionMillis || 0;
      const totalDuration = status.durationMillis || 0;

      setCurrentTime(currentPosition);
      setDuration(totalDuration);

      if (totalDuration > 0) {
        setProgress(currentPosition / totalDuration);
      }
    }
  };

  // Función para desactivar sonido
  const handleMuteToggle = async () => {
    try {
      if (!videoRef.current) return;
      await videoRef.current.setIsMutedAsync(!isMuted);
      setIsMuted(!isMuted);
    } catch (error) {
      console.log("Error al cambiar mute:", error);
    }
  };

  return (
    <View style={[styles.container, { height: alturaCard }]}>
      <View style={styles.contentWrapper}>
        <View style={styles.mediaContainer}>
          {pet.videoUri ? (
            <Pressable onPress={handleVideoPress} style={{ flex: 1 }}>
              <Video
                source={pet.videoUri}
                style={styles.video}
                resizeMode={ResizeMode.COVER}
                isLooping
                isMuted={isMuted}
                ref={videoRef}
                onPlaybackStatusUpdate={onPlaybackStatusUpdate}
              />
              {showControls && isActive && (
                <View style={styles.playButton} pointerEvents="none">
                  <MaterialIcons
                    name="play-arrow"
                    size={100}
                    color="rgba(255, 255, 255, 0.36)"
                  />
                </View>
              )}
            </Pressable>
          ) : pet.imageUris?.length ? (
            <Image source={pet.imageUris[0]} style={styles.image} />
          ) : null}
        </View>
        {/* Círculo de perfil */}
        <TouchableOpacity style={styles.profileContainer}>
          <Image
            source={
              pet.ownerAvatar ||
              require("../../assets/media/avatars/default-avatar.jpg")
            }
            style={styles.profileImage}
          />
        </TouchableOpacity>

        {/* Botón de mute/unmute */}
        {pet.videoUri && (
          <TouchableOpacity
            style={styles.muteButton}
            onPress={handleMuteToggle}
          >
            <MaterialIcons
              name={isMuted ? "volume-off" : "volume-up"}
              size={34}
              color="white"
            />
          </TouchableOpacity>
        )}

        {/* Barra de progreso */}
        {pet.videoUri && duration > 0 && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBackground}>
              <View
                style={[styles.progressBar, { width: `${progress * 100}%` }]}
              />
            </View>
          </View>
        )}

        <View style={[styles.overlay]}>
          <LinearGradient
            colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.8)"]}
            style={StyleSheet.absoluteFill}
          />
          <Text style={styles.name}>{pet.petName}</Text>
          <View style={styles.descriptionContainer}>
            <View style={{ flex: 1 }}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    // La altura se establece mediante la prop alturaCard
    backgroundColor: "black", // Para depuración, se puede eliminar
    paddingTop: 33,
  },
  contentWrapper: {
    flex: 1,
    backgroundColor: "black", // Para depuración, se puede eliminar
  },
  mediaContainer: {
    flex: 1, // Ocupa todo el espacio disponible de la tarjeta
    width: "100%",
    backgroundColor: "black",
  },
  video: {
    width: "100%",
    height: "100%",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  overlay: {
    position: "absolute",
    bottom: 0, // Se mantiene como estaba, es un offset desde la parte inferior de la tarjeta
    left: 0,
    right: 0,
    padding: 12,
    paddingLeft: 20,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  description: {
    fontSize: 14,
    color: "white",
    marginTop: 4,
    marginBottom: 5,
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
  },
  descriptionContainer: {
    flexDirection: "row",
    marginTop: 2,
    width: "85%",
  },
  descriptionWithButton: {
    paddingRight: 10,
  },
  moreButtonContainer: {
    justifyContent: "flex-end",
    alignItems: "flex-end",

    marginBottom: 3,
  },
  moreButton: {
    fontSize: 14,
    color: "#ccc",
    fontWeight: "500",
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  profileContainer: {
    position: "absolute",
    bottom: 160,
    right: 13,
    zIndex: 10,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "white",
  },
  muteButton: {
    position: "absolute",
    bottom: 100,
    right: 21,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  progressContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 5,
  },
  progressBackground: {
    height: 3,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 1.5,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "white",
    borderRadius: 1.5,
  },
});
