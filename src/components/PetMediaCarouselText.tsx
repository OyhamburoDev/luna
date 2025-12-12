"use client";

import { useState, useEffect, useRef } from "react";
import { Dimensions, View, Image, StyleSheet } from "react-native";
import { Animated } from "react-native";
import Carousel from "react-native-reanimated-carousel";
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
    setIsLoadingMedia(true);
    setVideoThumbnail(null);
    if (pet.thumbnailUri) {
      setVideoThumbnail(pet.thumbnailUri);
    }
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
                  onError={(error) => {
                    console.log("❌ ERROR cargando imagen:", item.uri);
                    console.log("Error details:", error.nativeEvent.error);
                    setIsLoadingMedia(false);
                  }}
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
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#667eea" />
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
  loadingContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#f5f5f5", // Mismo color que el fondo
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
});
