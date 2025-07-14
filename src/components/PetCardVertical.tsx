import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  Pressable,
} from "react-native";
import { Video, ResizeMode } from "expo-av";
import { PetPost } from "../types/petPots";
import { useRef, useEffect, useState } from "react";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { LinearGradient } from "expo-linear-gradient";

type Props = {
  pet: PetPost;
  isActive: boolean;
};

const { width, height } = Dimensions.get("window");

export default function PetCardVertical({ pet, isActive }: Props) {
  const videoRef = useRef<Video>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const controlTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [isExpanded, setIsExpanded] = useState(false);

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

  return (
    <View style={styles.container}>
      <View style={styles.contentWrapper}>
        <View style={styles.mediaContainer}>
          {pet.videoUri ? (
            <Pressable onPress={handleVideoPress} style={{ flex: 1 }}>
              <Video
                source={pet.videoUri}
                style={styles.video}
                resizeMode={ResizeMode.COVER}
                isLooping
                isMuted={false}
                ref={videoRef}
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

        <View style={[styles.overlay, { height: overlayHeight }]}>
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
    width: width,
    height: height,
    backgroundColor: "black",
  },
  contentWrapper: {
    flex: 1,

    paddingBottom: 120,
    backgroundColor: "black",
  },
  mediaContainer: {
    flex: 1, // ocupa todo el espacio disponible de la card
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
    bottom: 65,
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
    width: "90%",
  },
  descriptionWithButton: {
    paddingRight: 15,
  },
  moreButtonContainer: {
    justifyContent: "flex-end",
    alignItems: "flex-end",
    paddingLeft: 3,
  },
  moreButton: {
    fontSize: 14,
    color: "#ccc",
    fontWeight: "500",
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
});
