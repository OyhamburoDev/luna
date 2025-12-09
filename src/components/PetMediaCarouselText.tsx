"use client";

import { useState, useEffect, useRef } from "react";
import { Dimensions, View, Image, StyleSheet, Text } from "react-native";
import { BlurView } from "expo-blur";
import { Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Carousel from "react-native-reanimated-carousel";
import Ionicons from "react-native-vector-icons/Ionicons";
import type { PetPost } from "../types/petPots";
import { useMemo } from "react";
import { ActivityIndicator } from "react-native";

const { width } = Dimensions.get("window");
const { height: screenHeight } = Dimensions.get("window");

const carouselHeight = screenHeight * 0.4; // 30% de la altura de la pantalla
const dotsPosition = carouselHeight * 0.85; // los dots a 60% de esa altura

type CarouselProps = {
  pet: PetPost;
};

export default function PetMediaCarouselTest({ pet }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [videoThumbnail, setVideoThumbnail] = useState(null);
  const [isLoadingMedia, setIsLoadingMedia] = useState(true);
  const shimmerAnimation = useRef(new Animated.Value(0)).current;
  const fadeAnimation = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(shimmerAnimation, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      })
    ).start();
  }, [shimmerAnimation]);

  const handleImageLoad = () => {
    Animated.timing(fadeAnimation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setIsLoadingMedia(false);
      fadeAnimation.setValue(1);
    });
  };

  useEffect(() => {
    if (!pet) return;

    console.log("esteee", pet.thumbnailUri);

    setIsLoadingMedia(true); // ← Ahora sí queda en true
    setVideoThumbnail(null);
    if (pet.thumbnailUri) {
      setVideoThumbnail(pet.thumbnailUri);
    }
    // ❌ NO pongas setIsLoadingMedia(false) acá
  }, [pet]);

  useEffect(() => {
    // Siempre que cambia la mascota, reiniciamos el índice del carrusel
    setCurrentIndex(0);
  }, [pet]);

  const mediaItems = useMemo(() => {
    const items: { type: "image" | "video"; uri: string | number }[] = [];

    // Agregar thumbnail si existe
    if (videoThumbnail) {
      items.push({ type: "video", uri: videoThumbnail });
    }

    // Agregar imágenes si hay
    if (Array.isArray(pet.imageUris)) {
      pet.imageUris.forEach((item) => {
        // Si viene como objeto {uri: "..."}, extraer la uri
        const uri = typeof item === "object" && item?.uri ? item.uri : item;

        if (typeof uri === "string" || typeof uri === "number") {
          items.push({ type: "image", uri });
        } else {
          console.warn("URI inválida:", item);
        }
      });
    }

    return items;
  }, [videoThumbnail, pet.imageUris]);

  console.log("🧪 mediaItems:", mediaItems);

  return (
    <View
      style={{
        backgroundColor: "#f5f5f5",
        height: carouselHeight,
        position: "relative",
      }}
    >
      <Carousel
        key={pet.id}
        loop={mediaItems.length > 1}
        enabled={mediaItems.length > 1}
        width={width}
        height={carouselHeight}
        data={mediaItems}
        scrollAnimationDuration={400}
        onSnapToItem={(index) => setCurrentIndex(index)}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            {item.type === "video" ? (
              <>
                <Image
                  source={
                    typeof item.uri === "string" ? { uri: item.uri } : item.uri
                  }
                  style={styles.image}
                  onLoad={handleImageLoad}
                />
              </>
            ) : (
              <Image
                source={
                  typeof item.uri === "string" ? { uri: item.uri } : item.uri
                }
                style={styles.image}
                onLoad={handleImageLoad}
              />
            )}
          </View>
        )}
      />

      {isLoadingMedia && (
        <Animated.View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            overflow: "hidden",
            zIndex: 10,
            opacity: fadeAnimation,
          }}
        >
          {/* Fondo con degradado sutil */}
          <LinearGradient
            colors={["#EBEBEB", "#F5F5F5", "#EBEBEB"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={{ flex: 1 }}
          >
            {/* Efecto shimmer mejorado */}
            <Animated.View
              style={{
                width: width * 2.5,
                height: "100%",
                transform: [
                  {
                    translateX: shimmerAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-width * 2.5, width * 0.5],
                    }),
                  },
                ],
              }}
            >
              <LinearGradient
                colors={[
                  "rgba(255, 255, 255, 0)",
                  "rgba(255, 255, 255, 0.4)",
                  "rgba(255, 255, 255, 1)",
                  "rgba(255, 255, 255, 0.4)",
                  "rgba(255, 255, 255, 0)",
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ flex: 1 }}
                locations={[0, 0.35, 0.5, 0.65, 1]}
              />
            </Animated.View>
          </LinearGradient>
        </Animated.View>
      )}

      {mediaItems.length > 1 && (
        <View style={styles.imageCounter}>
          <Text style={styles.imageCounterText}>
            {currentIndex + 1}/{mediaItems.length}
          </Text>
        </View>
      )}

      {mediaItems.length > 1 && (
        <View style={styles.paginationDots}>
          {mediaItems.map((_, index) => (
            <View
              key={index}
              style={[styles.dot, currentIndex === index && styles.dotActive]}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  slide: {
    width,
    height: carouselHeight,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    overflow: "hidden",
  },
  imageCounter: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    zIndex: 10,
  },
  imageCounterText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
  paginationDots: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    zIndex: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  },
  dotActive: {
    backgroundColor: "#ffffff",
    width: 24,
  },
});
