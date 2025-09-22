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

type Props = {
  pet: PetPost;
  isActive: boolean;
  alturaCard: number; // Esto ahora será la altura medida dinámicamente
  onPressArrow?: () => void;
};

const AVATAR_SIZE = 45; // tamaño exterior = el mismo que ya tenías
const RING = 2; // grosor del degradé
const GAP = 1; // separación blanca
const INNER = AVATAR_SIZE - RING * 2; // después del ring
const IMG = INNER - GAP * 2; // después del gap

export default function PetCardVertical({
  pet,
  isActive,
  alturaCard,
  onPressArrow,
}: Props) {
  const videoRef = useRef<Video>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const controlTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const insets = useSafeAreaInsets(); // Se mantiene por si es útil para afinar la posición del overlay

  // Estados para la barra de progreso del video
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);

  // Activar o desactivar sonido
  const [isMuted, setIsMuted] = useState(false);

  const [isLiked, setIsLiked] = useState(false);

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
            </View>
          ) : pet.imageUris?.length ? (
            <Image source={pet.imageUris[0]} style={styles.image} />
          ) : null}
        </View>

        {/* <TouchableOpacity style={styles.detailButton}>
          <MaterialIcons name="info-outline" size={20} "rgba(0, 0, 0, 0.77)" color="white" />
        </TouchableOpacity> */}

        {/* Círculo de perfil */}
        <View>
          <LinearGradient
            colors={["rgba(0,0,0,0)", "rgba(0, 0, 0, 0.77)"]}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              height: 260, // ajustá según necesites
            }}
          />
          <TouchableOpacity style={styles.profileContainer}>
            {/* Ring degradé, mismo tamaño exterior: 45x45 */}
            <LinearGradient
              colors={["#41D1FF", "#22D3EE", "#10B981"]} // celeste → verde
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.avatarRing}
            >
              {/* Gap blanco para separar ring e imagen (1–2px) */}
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

            {/* Tu indicador online queda igual */}
            <View style={styles.onlineIndicator} />
          </TouchableOpacity>

          {/* Botón de like */}
          <TouchableOpacity
            style={styles.likeButton}
            onPress={() => setIsLiked(!isLiked)}
          >
            <HeartIcon
              size={34}
              color={isLiked ? "#FF3040" : "rgba(255, 255, 255, 0.91)"}
              filled={true}
            />
            <Text style={[{ fontFamily: fonts.bold }, styles.detalleText]}>
              Me g...
            </Text>
          </TouchableOpacity>

          {/*Botón de ver detalle */}
          <TouchableOpacity style={styles.detalleButton} onPress={onPressArrow}>
            <View style={styles.detalleBackground}>
              {/* <ArrowBigRightIcon size={35} color="white" /> */}
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

          {/* Botón de mute/unmute */}
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

        {/* ver detalle prueba */}
        {/* <View style={styles.btnScroll}>
          <Pressable onPress={() => {}} style={styles.link}>
            <Text style={[{ fontFamily: fonts.semiBold }, styles.linkText]}>
              ¿Ya tienes una cuenta?{" "}
              <Text style={[{ fontFamily: fonts.bold }, styles.linkTextTwo]}>
                Iniciar sesión
              </Text>
            </Text>
          </Pressable>
        </View> */}

        <View style={[styles.overlay]}>
          <LinearGradient
            colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.8)"]}
            style={StyleSheet.absoluteFill}
          />
          <Text style={[{ fontFamily: fonts.bold }, styles.name]}>
            {pet.petName}
          </Text>

          <View style={styles.btnScroll}>
            <Pressable onPress={() => {}} style={styles.link}>
              <Text style={[{ fontFamily: fonts.semiBold }, styles.linkText]}>
                Más información
              </Text>
              <Ionicons
                name="chevron-forward" // 👈 flecha como en WhatsApp
                size={18}
                color="#fff" // podés cambiarlo si querés más parecido
                style={{ marginLeft: 6 }}
              />
            </Pressable>
          </View>

          {/* <PrimaryCTA
            label="verMas"
            style={{ width: 180, height: 40 }}
            onPress={() => console.log("Ver más")}
          /> */}
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
          {/*Botón de ver detalle */}
          {/* <View style={styles.cntVerDetalle}>
            <TouchableOpacity onPress={() => {}} activeOpacity={0.7} style={{}}>
              <Text style={styles.text}>
                Ver detalle{" "}
                <MaterialIcons name="chevron-right" size={20} color="white" />
              </Text>
            </TouchableOpacity>
          </View> */}
        </View>
      </View>
    </Pressable>
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
    paddingBottom: 10, // Added more bottom padding to separate from bottomTabs
  },
  name: {
    fontSize: 22, // Increased font size for better prominence
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
    marginTop: 0, // Removed marginTop since we added marginBottom to name
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
    width: 34, // 👈 ajustá tamaño
    height: 34,
    resizeMode: "contain", // evita que se deforme
    tintColor: "rgba(255, 255, 255, 0.82)", // 👈 así le cambiás el color desde código
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
    // backgroundColor: "rgba(0, 0, 0, 0.4)",
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
    backgroundColor: "#667eea", // Using app color for progress bar
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
    backgroundColor: "rgba(0, 0, 0, 0.6)", // Improved button design with app color accent
    borderRadius: 25,
    padding: 10,
    zIndex: 10,
    borderWidth: 1, // Added subtle border with app color
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
    flexDirection: "row", // 👈 importante para que texto + icono estén alineados
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
