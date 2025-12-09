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
import { Video, ResizeMode, type AVPlaybackStatus } from "expo-av";
import { useRef, useEffect, useState } from "react";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { PetPost } from "../types/petPots";
import { textStyles } from "../theme/textStyles";
import { fonts } from "../theme/fonts";
import HeartIcon from "../components/HeartIcon";
import { SoundOffIcon } from "./SoundOnIcon";
import { SoundOnIcon } from "./SoundOnIcon";
import { Ionicons } from "@expo/vector-icons";
import { useMute } from "../contexts/MuteContext";
import { useLike } from "../hooks/useLike";
import DoubleTapHeart from "./DoubleTapHeart";
import { useAuthModalContext } from "../contexts/AuthModalContext";
import { useConfettiStore } from "../store/useConfettiStore";
import LottieView from "lottie-react-native";

type Props = {
  pet: PetPost;
  isActive: boolean;
  alturaCard: number;
  onPressArrow?: () => void;
  index?: number;
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
  index = -1,
}: Props) {
  const videoRef = useRef<Video>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const controlTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const insets = useSafeAreaInsets();
  const { openModal, requireAuth } = useAuthModalContext();
  const [mediaLoaded, setMediaLoaded] = useState(false);
  const { mostrarConfetti, resetConfetti } = useConfettiStore();
  const confettiRef = useRef<LottieView>(null);

  // Estados para la barra de progreso del video
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);

  // Activar o desactivar sonido
  const { isMuted, toggleMute } = useMute();
  // Hook de likes
  const { isLiked, likesCount, toggleLike, isLoading, userId } = useLike({
    postId: pet.id,
    initialLikesCount: pet.likes || 0,
  });

  const [showHeartAnimation, setShowHeartAnimation] = useState(false);
  const lastTapRef = useRef<number>(0);

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
      } catch (error: unknown) {
        console.warn(
          "Error controlando video:",
          error instanceof Error ? error.message : String(error)
        );
      }
    };

    controlPlayback();

    return () => {
      if (controlTimeoutRef.current) {
        clearTimeout(controlTimeoutRef.current);
      }
    };
  }, [isActive]);

  useEffect(() => {
    if (mediaLoaded && mostrarConfetti && index === 0 && confettiRef.current) {
      confettiRef.current.play();
      setTimeout(() => {
        resetConfetti();
      }, 3000);
    }
  }, [mediaLoaded, mostrarConfetti, index]);

  // 🔍 LOG: Función de video press con debugging
  const handleVideoPress = async () => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300; // 300ms para detectar doble tap

    // Detectar doble tap
    if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
      if (!userId) {
        openModal("login", "#000000");
        return;
      }

      // Dar like si no está likeado
      if (!isLoading) {
        setShowHeartAnimation(true);
        toggleLike();
      }

      lastTapRef.current = 0; // Reset
      return; // No ejecutar el play/pause
    }

    // Guardar timestamp del tap
    lastTapRef.current = now;

    // Esperar para ver si viene otro tap
    setTimeout(async () => {
      // Si pasó el tiempo y no hubo doble tap, ejecutar play/pause
      if (now === lastTapRef.current) {
        try {
          if (!videoRef.current) {
            return;
          }

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
        } catch (error: unknown) {
          console.error("💥 ERROR en handleVideoPress:", {
            error: error instanceof Error ? error.message : String(error),
            isPlaying,
            videoUri: pet.videoUri,
            petId: pet.id || pet.petName,
          });
        }
      }
    }, DOUBLE_TAP_DELAY);
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

  const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    // Loop manual cuando termina el video
    if (
      status.isLoaded &&
      status.didJustFinish &&
      typeof pet.videoUri === "object" &&
      isActive
    ) {
      videoRef.current?.replayAsync().catch((error: unknown) => {
        console.warn("💥 Error en loop manual:", {
          error: error instanceof Error ? error.message : String(error),
          petId: pet.id || pet.petName,
        });
      });
    }

    // Manejo de errores
    if (!status.isLoaded && status.error) {
      console.warn("💥 VIDEO ERROR:", {
        error: status.error,
        uri: pet.videoUri,
        petId: pet.id || pet.petName,
      });
    }

    // Actualizar barra de progreso
    if (status.isLoaded) {
      const currentPosition = status.positionMillis || 0;
      const totalDuration = status.durationMillis || 0;

      if (duration === 0 && totalDuration > 0) {
        setDuration(totalDuration);
      }

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
      setMediaLoaded(true);
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
          {!mediaLoaded && (
            <LinearGradient
              colors={["rgba(102, 126, 234, 0.4)", "#000000"]}
              locations={[0, 0.5]}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
              }}
            />
          )}
          {pet.videoUri ? (
            <View style={{ flex: 1 }}>
              <Video
                source={pet.videoUri}
                style={styles.video}
                resizeMode={ResizeMode.COVER}
                isLooping={typeof pet.videoUri === "number"}
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
            <Image
              source={pet.imageUris[0]}
              style={styles.image}
              onLoad={() => setMediaLoaded(true)}
            />
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
            onPress={() => {
              if (!userId) {
                openModal("login", "#000000");
                return;
              }
              toggleLike();
            }}
            disabled={isLoading}
          >
            <HeartIcon
              size={34}
              color={isLiked ? "#E91E63" : "rgba(255, 255, 255, 0.91)"}
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
              <Text
                style={[{ fontFamily: fonts.semiBold }, styles.detalleText]}
              >
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

        <DoubleTapHeart
          isVisible={showHeartAnimation}
          onAnimationComplete={() => setShowHeartAnimation(false)}
          isLiked={isLiked}
        />

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
                  { fontFamily: fonts.semiBold },
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
                <Text
                  style={[{ fontFamily: fonts.semiBold }, styles.moreButton]}
                >
                  {isExpanded ? "menos" : "más"}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
      {mostrarConfetti && (
        <LottieView
          ref={confettiRef}
          source={require("../../assets/animations/confetti.json")}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1000,
            pointerEvents: "none",
            transform: [{ scale: 2 }],
          }}
          autoPlay={false}
          loop={false}
        />
      )}
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
    paddingLeft: 11,
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
    fontSize: 15,
    color: "rgba(255, 255, 255, 0.9)",
    marginTop: 2,
    marginBottom: 0,
    letterSpacing: -0.2,
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
    width: "89%",
  },
  descriptionWithButton: {
    paddingRight: 2,
  },
  moreButtonContainer: {
    justifyContent: "flex-end",
    marginBottom: 0,
  },
  moreButton: {
    fontSize: 15,
    color: "rgba(255, 255, 255, 0.7)",
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
    fontSize: 13,
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
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    width: "50%",
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  link: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  linkText: {
    color: "#ffffffe7",
    textAlign: "center",
    fontSize: 15,
  },
  linkTextTwo: {
    color: "#FE2C55",
    fontSize: 15,
  },
});
