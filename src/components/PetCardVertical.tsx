"use client";

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Pressable,
  AppState,
} from "react-native";
import { Video, ResizeMode, AVPlaybackStatus } from "expo-av";
import { useRef, useEffect, useState } from "react";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { PetPost } from "../types/petPots";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { textStyles } from "../theme/textStyles";
import { fonts } from "../theme/fonts";
import HeartIcon from "../components/HeartIcon";
import { SoundOffIcon } from "./SoundOnIcon";
import { SoundOnIcon } from "./SoundOnIcon";
import ArrowBigRightIcon from "./ChevronsRightIcon";
import PrimaryCTA from "../components/PrimaryCTA";
import { Ionicons } from "@expo/vector-icons";
import { useMute } from "../contexts/MuteContext";
import { useLike } from "../hooks/useLike";

type Props = {
  pet: PetPost;
  isActive: boolean;
  alturaCard: number;
  onPressArrow?: () => void;
};

const AVATAR_SIZE = 45;
const RING = 2;
const GAP = 1;
const INNER = AVATAR_SIZE - RING * 2;
const IMG = INNER - GAP * 2;

export default function PetCardVertical({
  pet,
  isActive,
  alturaCard,
  onPressArrow,
}: Props) {
  console.log("🔧 PetCardVertical props:", {
    hasPet: !!pet,
    hasImageUris: !!pet.imageUris?.length,
    hasVideoUri: !!pet.videoUri,
    petId: pet.id,
    renderTime: Date.now(),
  });
  const videoRef = useRef<Video>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const controlTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const insets = useSafeAreaInsets();

  // Estados para la barra de progreso del video
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);

  // Activar o desactivar sonido
  const { isMuted, toggleMute } = useMute();
  // Hook de likes
  const { isLiked, likesCount, toggleLike, isLoading } = useLike({
    postId: pet.id,
    initialLikesCount: pet.likes || 0,
  });

  // 🔍 LOG: Validación inicial del componente
  useEffect(() => {
    console.log("🔍 PetCardVertical Mount/Update:", {
      petId: pet.id || pet.petName,
      hasVideoUri: !!pet.videoUri,
      videoUri: pet.videoUri,
      videoUriType: typeof pet.videoUri,
      isLocalAsset: typeof pet.videoUri === "number",
      isFirebaseUrl:
        typeof pet.videoUri === "string" && pet.videoUri.includes("firebase"),
      isValidUrl:
        typeof pet.videoUri === "string" &&
        (pet.videoUri.startsWith("http") || pet.videoUri.startsWith("file")),
      alturaCard,
      isActive,
    });

    // 🔍 Verificar si es una URL de Firebase válida
    if (typeof pet.videoUri === "string" && pet.videoUri.includes("firebase")) {
      try {
        const url = new URL(pet.videoUri);
        console.log("🔍 Firebase URL Analysis:", {
          protocol: url.protocol,
          hostname: url.hostname,
          pathname: url.pathname,
          hasToken: url.searchParams.has("token"),
          tokenLength: url.searchParams.get("token")?.length,
          fullUrl: pet.videoUri,
        });
      } catch (urlError: unknown) {
        console.error("💥 INVALID FIREBASE URL:", {
          uri: pet.videoUri,
          error:
            urlError instanceof Error ? urlError.message : String(urlError),
        });
      }
    }
  }, [pet.videoUri, isActive, alturaCard]);

  // 🔍 LOG: Monitoreo de memoria
  useEffect(() => {
    const handleMemoryWarning = () => {
      console.warn("⚠️ MEMORY WARNING - Video might be too large:", {
        petId: pet.id || pet.petName,
        videoUri: pet.videoUri,
        isActive,
        currentTime: Date.now(),
      });
    };

    const subscription = AppState.addEventListener(
      "memoryWarning",
      handleMemoryWarning
    );

    return () => {
      subscription?.remove();
    };
  }, [pet.videoUri, isActive]);

  // 🔍 LOG: Detectar tipo de media al renderizar
  useEffect(() => {
    if (pet.videoUri) {
      console.log("📹 Renderizando video:", pet.videoUri);
    } else if (pet.imageUris?.length) {
      console.log("🖼️ No video URI, mostrando imagen de fallback");
    } else {
      console.log("⚠️ No hay media disponible para:", pet.petName);
    }
  }, [pet.videoUri, pet.imageUris, pet.petName]);

  // 🔍 LOG: Control principal de reproducción con debugging completo
  useEffect(() => {
    const controlPlayback = async () => {
      // 🔍 LOG: Estado inicial
      console.log("🎬 CONTROL PLAYBACK:", {
        isActive,
        hasVideoRef: !!videoRef.current,
        videoUri: pet.videoUri,
        videoUriType: typeof pet.videoUri,
        isLocalAsset: typeof pet.videoUri === "number",
        isFirebaseUrl:
          typeof pet.videoUri === "string" && pet.videoUri.includes("firebase"),
        petId: pet.id || pet.petName,
        timestamp: Date.now(),
      });

      if (!videoRef.current) {
        console.log("❌ No video ref available");
        return;
      }

      try {
        if (isActive) {
          // 🔍 LOG: Intentando reproducir
          console.log("▶️ Intentando PLAY:", {
            currentTime: Date.now(),
            videoUri: pet.videoUri,
            isMuted,
          });

          await videoRef.current.playAsync();
          setIsPlaying(true);

          // 🔍 LOG: Play exitoso
          console.log("✅ PLAY exitoso para:", pet.petName);
        } else {
          // 🔍 LOG: Pausando video
          console.log("⏸️ Pausando video:", pet.petName);

          await videoRef.current.pauseAsync();
          setIsPlaying(false);
          setShowControls(false);

          console.log("✅ PAUSE exitoso");
        }
      } catch (error: unknown) {
        // 🔍 LOG: Error detallado
        console.error("💥 ERROR controlando reproducción:", {
          error: error instanceof Error ? error.message : String(error),
          errorCode:
            error instanceof Error && "code" in error
              ? (error as any).code
              : "unknown",
          errorStack: error instanceof Error ? error.stack : undefined,
          isActive,
          videoUri: pet.videoUri,
          petId: pet.id || pet.petName,
          timestamp: Date.now(),
        });
      }
    };

    controlPlayback();

    return () => {
      console.log("🧹 Cleanup PetCardVertical:", pet.petName);
      if (controlTimeoutRef.current) {
        clearTimeout(controlTimeoutRef.current);
      }
    };
  }, [isActive]);

  // 🔍 LOG: Función de video press con debugging
  const handleVideoPress = async () => {
    console.log("👆 Video pressed:", {
      isPlaying,
      hasVideoRef: !!videoRef.current,
      videoUri: pet.videoUri,
      petId: pet.id || pet.petName,
    });

    try {
      if (!videoRef.current) {
        console.log("❌ No video ref on press");
        return;
      }

      if (isPlaying) {
        console.log("⏸️ Manual pause...");
        await videoRef.current.pauseAsync();
        setIsPlaying(false);
        setShowControls(true);
        console.log("✅ Manual pause success");
      } else {
        console.log("▶️ Manual play...");
        await videoRef.current.playAsync();
        setIsPlaying(true);
        setShowControls(true);
        console.log("✅ Manual play success");

        controlTimeoutRef.current = setTimeout(() => {
          setShowControls(false);
        }, 500);
      }
    } catch (error: unknown) {
      console.error("💥 ERROR en handleVideoPress:", {
        error: error instanceof Error ? error.message : String(error),
        errorCode:
          error instanceof Error && "code" in error
            ? (error as any).code
            : "unknown",
        isPlaying,
        videoUri: pet.videoUri,
        petId: pet.id || pet.petName,
        timestamp: Date.now(),
      });
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

  // 🔍 LOG: Callback de progreso con más detalles
  const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    // Log solo cada 2 segundos para no saturar
    const shouldLog = status.isLoaded
      ? Math.floor((status.positionMillis || 0) / 2000) !==
        Math.floor((currentTime || 0) / 2000)
      : true;

    // 🔍 DEBUGGING: Ver si se reporta didJustFinish cerca del final
    if (status.isLoaded && status.positionMillis && status.durationMillis) {
      const timeRemaining = status.durationMillis - status.positionMillis;
      if (timeRemaining < 1000) {
        // Último segundo
        console.log("🔚 Video cerca del final:", {
          positionMillis: status.positionMillis,
          durationMillis: status.durationMillis,
          timeRemaining,
          didJustFinish: status.didJustFinish,
          petId: pet.id || pet.petName,
        });
      }
    }

    if (shouldLog || !status.isLoaded) {
      console.log("📊 Video Status:", {
        isLoaded: status.isLoaded,
        ...(status.isLoaded && {
          isPlaying: status.isPlaying,
          positionMillis: status.positionMillis,
          durationMillis: status.durationMillis,
          isBuffering: status.isBuffering,
          playableDurationMillis: status.playableDurationMillis,
          didJustFinish: status.didJustFinish,
        }),
        ...(!status.isLoaded && {
          error: status.error,
        }),
        uri: pet.videoUri,
        petId: pet.id || pet.petName,
      });
    }

    // Tu loop manual existente (no cambiar)
    if (
      status.isLoaded &&
      status.didJustFinish &&
      typeof pet.videoUri === "object" &&
      isActive
    ) {
      console.log("🔄 Iniciando LOOP MANUAL para Firebase video:", {
        petId: pet.id || pet.petName,
        uri: pet.videoUri,
        timestamp: Date.now(),
      });

      videoRef.current
        ?.replayAsync()
        .then(() => {
          console.log("✅ Loop manual exitoso");
        })
        .catch((error: unknown) => {
          console.error("💥 Error en loop manual:", {
            error: error instanceof Error ? error.message : String(error),
            petId: pet.id || pet.petName,
          });
        });
    }

    // Resto del código igual...
    if (!status.isLoaded && status.error) {
      console.error("💥 VIDEO STATUS ERROR:", {
        error: status.error,
        errorString: status.error?.toString(),
        uri: pet.videoUri,
        petId: pet.id || pet.petName,
        timestamp: Date.now(),
      });
    }

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
      console.log("🔇 Toggling mute:", { from: isMuted, to: !isMuted });
      toggleMute();
      await videoRef.current.setIsMutedAsync(!isMuted);
    } catch (error: unknown) {
      console.log(
        "Error al cambiar mute:",
        error instanceof Error ? error.message : String(error)
      );
    }
  };

  // Funciones de callback para Video component
  const handleVideoLoad = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      console.log("✅ Video LOADED:", {
        uri: pet.videoUri,
        duration: status.durationMillis,
        isLoaded: status.isLoaded,
        petId: pet.id || pet.petName,
      });
    }
  };

  const handleVideoError = (error: string) => {
    console.error("💥 VIDEO ERROR:", {
      error: error,
      errorString: error?.toString(),
      uri: pet.videoUri,
      petId: pet.id || pet.petName,
      timestamp: Date.now(),
    });
  };

  const handleVideoLoadStart = () => {
    console.log("🔄 Video LOAD START:", {
      uri: pet.videoUri,
      petId: pet.id || pet.petName,
    });
  };

  return (
    <Pressable
      style={[styles.container, { height: alturaCard }]}
      onPress={handleVideoPress}
    >
      <View style={styles.contentWrapper}>
        <View style={styles.mediaContainer}>
          {pet.videoUri ? (
            <View style={{ flex: 1 }}>
              <Video
                source={pet.videoUri}
                style={styles.video}
                resizeMode={ResizeMode.COVER}
                isLooping={typeof pet.videoUri === "number"} // Solo loop para mock videos
                isMuted={isMuted}
                ref={videoRef}
                onPlaybackStatusUpdate={onPlaybackStatusUpdate}
                onLoad={handleVideoLoad}
                onError={handleVideoError}
                onLoadStart={handleVideoLoadStart}
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
            </View>
          ) : pet.imageUris?.length ? (
            <Image source={pet.imageUris[0]} style={styles.image} />
          ) : null}
        </View>

        <View>
          <LinearGradient
            colors={["rgba(0,0,0,0)", "rgba(0, 0, 0, 0.77)"]}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              height: 260,
            }}
          />
          <TouchableOpacity style={styles.profileContainer}>
            <LinearGradient
              colors={["#41D1FF", "#22D3EE", "#10B981"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.avatarRing}
            >
              <View style={styles.avatarGap}>
                <Image
                  source={
                    pet.ownerAvatar
                      ? typeof pet.ownerAvatar === "string" &&
                        pet.ownerAvatar.startsWith("http")
                        ? { uri: pet.ownerAvatar }
                        : pet.ownerAvatar
                      : require("../../assets/media/avatars/default-avatar.jpg")
                  }
                  style={styles.profileImageInner}
                />
              </View>
            </LinearGradient>
            <View style={styles.onlineIndicator} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.likeButton}
            onPress={toggleLike}
            disabled={isLoading}
          >
            <HeartIcon
              size={34}
              color={isLiked ? "#FF3040" : "rgba(255, 255, 255, 0.91)"}
              filled={true}
            />
            <Text style={[{ fontFamily: fonts.bold }, styles.detalleText]}>
              {likesCount > 0 ? likesCount : "Me g..."}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.detalleButton} onPress={onPressArrow}>
            <View style={styles.detalleBackground}>
              <Ionicons
                name="information-circle"
                size={32}
                color="rgba(255, 255, 255, 0.82)"
              />
              <Text style={[textStyles.subtitle, styles.detalleText]}>
                Info
              </Text>
            </View>
          </TouchableOpacity>

          {pet.videoUri && (
            <TouchableOpacity
              style={styles.muteButton}
              onPress={handleMuteToggle}
            >
              <View style={styles.muteButtonBackground}>
                {isMuted ? (
                  <SoundOffIcon size={30} color="rgba(255, 255, 255, 0.82)" />
                ) : (
                  <SoundOnIcon size={30} color="rgba(255, 255, 255, 0.82)" />
                )}
              </View>
            </TouchableOpacity>
          )}
        </View>

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
          <Text style={[{ fontFamily: fonts.bold }, styles.name]}>
            {pet.petName}
          </Text>

          <View style={styles.btnScroll}>
            <Pressable
              onPress={onPressArrow}
              style={({ pressed }) => [
                styles.link,
                pressed && { opacity: 0.6 },
              ]}
            >
              <Text style={[{ fontFamily: fonts.semiBold }, styles.linkText]}>
                Más información
              </Text>
              <Ionicons
                name="chevron-forward"
                size={18}
                color="#fff"
                style={{ marginLeft: 6 }}
              />
            </Pressable>
          </View>

          <View style={styles.descriptionContainer}>
            <View style={{ flex: 1 }}>
              <Text
                style={[
                  styles.description,
                  textStyles.body,
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
                <Text style={[textStyles.body, styles.moreButton]}>
                  {isExpanded ? "menos" : "más"}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "black",
    paddingTop: 33,
  },
  contentWrapper: {
    flex: 1,
    backgroundColor: "black",
  },
  mediaContainer: {
    flex: 1,
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
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    paddingLeft: 17,
    paddingBottom: 10,
  },
  name: {
    fontSize: 22,
    color: "white",
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  description: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 2,
    marginBottom: 0,
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
    marginTop: 0,
    width: "85%",
  },
  descriptionWithButton: {
    paddingRight: 10,
  },
  moreButtonContainer: {
    justifyContent: "flex-end",
    alignItems: "flex-end",
    marginBottom: 0,
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
    bottom: 236,
    right: 6,
    zIndex: 10,
  },
  avatarRing: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    padding: RING,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarGap: {
    width: INNER,
    height: INNER,
    borderRadius: INNER / 2,
    backgroundColor: "#fff",
    padding: GAP,
    alignItems: "center",
    justifyContent: "center",
  },
  profileImageInner: {
    width: IMG,
    height: IMG,
    borderRadius: IMG / 2,
  },
  profileImage: {
    width: 45,
    height: 45,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.82)",
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#43e97b",
    borderWidth: 2,
    borderColor: "white",
  },
  likeButton: {
    position: "absolute",
    bottom: 172,
    right: 10,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
    borderRadius: 20,
  },
  detalleButton: {
    position: "absolute",
    bottom: 113,
    right: 12,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  detalleBackground: {
    alignItems: "center",
    justifyContent: "center",
  },
  detalleText: {
    fontSize: 11,
    color: "rgba(255, 255, 255, 0.87)",
    textShadowRadius: 1,
  },
  detalleIcon: {
    width: 34,
    height: 34,
    resizeMode: "contain",
    tintColor: "rgba(255, 255, 255, 0.82)",
  },
  muteButton: {
    position: "absolute",
    bottom: 63,
    right: 3,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  muteButtonBackground: {
    borderRadius: 20,
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
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
    backgroundColor: "#667eea",
    borderRadius: 1.5,
  },
  cntVerDetalle: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#667eea",
    width: 130,
    height: 40,
  },
  detailButton: {
    position: "absolute",
    top: 20,
    right: 20,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: 25,
    padding: 10,
    zIndex: 10,
    borderWidth: 1,
    borderColor: "rgba(102, 126, 234, 0.3)",
  },
  text: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textShadowColor: "rgba(0,0,0,0.6)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  arrow: {
    fontSize: 16,
  },
  btnScroll: {
    backgroundColor: "#a3a2a26c",
    width: "50%",
    paddingVertical: 10,
    borderRadius: 10,
  },
  link: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  linkText: {
    color: "#ffffffe7",
    textAlign: "center",
    fontSize: 14,
  },
  linkTextTwo: {
    color: "#FE2C55",
    fontSize: 14,
  },
});
