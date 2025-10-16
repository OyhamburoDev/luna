"use client";

import { useState, useEffect } from "react";
import { Dimensions, View, Image, StyleSheet, Text } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import Ionicons from "react-native-vector-icons/Ionicons";
import type { PetPost } from "../types/petPots";
import { useMemo } from "react";

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

  useEffect(() => {
    if (!pet) return;

    console.log("esteee", pet.thumbnailUri);

    setIsLoadingMedia(true);
    setVideoThumbnail(null); // Limpiamos el estado anterior
    if (pet.thumbnailUri) {
      setVideoThumbnail(pet.thumbnailUri);
    }
    setIsLoadingMedia(false);
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

  if (isLoadingMedia) {
    return (
      <View
        style={{
          height: carouselHeight,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f5f5f5",
        }}
      >
        <Ionicons name="reload" size={48} color="#666" />
        <Text style={{ color: "#666", marginTop: 12, fontSize: 14 }}>
          Cargando...
        </Text>
      </View>
    );
  }

  if (mediaItems.length === 0) {
    return (
      <View
        style={{
          height: carouselHeight,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f5f5f5",
        }}
      >
        <Ionicons name="image-outline" size={64} color="#999" />
        <Text
          style={{
            color: "#666",
            marginTop: 16,
            fontSize: 16,
            fontWeight: "600",
          }}
        >
          Sin contenido multimedia
        </Text>
      </View>
    );
  }

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
                />
              </>
            ) : (
              <Image
                source={
                  typeof item.uri === "string" ? { uri: item.uri } : item.uri
                }
                style={styles.image}
              />
            )}
          </View>
        )}
      />

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
