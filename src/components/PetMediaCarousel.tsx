import React, { useState, useEffect } from "react";
import { Dimensions, View, Image, StyleSheet, Text } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import Ionicons from "react-native-vector-icons/Ionicons";

import Props from "react-native-paper";
import { PetPost } from "../types/petPots";
import * as VideoThumbnails from "expo-video-thumbnails";
import { useMemo } from "react";

const { width } = Dimensions.get("window");
const { height: screenHeight } = Dimensions.get("window");

const carouselHeight = screenHeight * 0.4; // 30% de la altura de la pantalla
const dotsPosition = carouselHeight * 0.75; // los dots a 60% de esa altura

type Props = {
  pet: PetPost;
};

export default function PetMediaCarousel({ pet }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [videoThumbnail, setVideoThumbnail] = useState(null);
  const [isLoadingMedia, setIsLoadingMedia] = useState(true);

  if (!pet) return null;

  console.log("esteee", pet.thumbnailUri);

  useEffect(() => {
    setIsLoadingMedia(true);
    setVideoThumbnail(null); // Limpiamos el estado anterior
    if (pet.thumbnailUri) {
      setVideoThumbnail(pet.thumbnailUri);
    }
    setIsLoadingMedia(false);
  }, [pet.id]);

  useEffect(() => {
    // Siempre que cambia la mascota, reiniciamos el índice del carrusel
    setCurrentIndex(0);
  }, [pet.id]);

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

  if (isLoadingMedia) {
    return (
      <View
        style={{ height: 300, justifyContent: "center", alignItems: "center" }}
      >
        <Ionicons name="reload" size={32} color="#f093fb" />
      </View>
    );
  }

  if (mediaItems.length === 0) {
    return (
      <View
        style={{ height: 300, justifyContent: "center", alignItems: "center" }}
      >
        <Ionicons name="image-outline" size={32} color="#ccc" />
        <Text style={{ color: "#999", marginTop: 8 }}>
          Sin contenido multimedia
        </Text>
      </View>
    );
  }

  return (
    <View style={{ height: carouselHeight, position: "relative" }}>
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

      {/* Dots superpuestos */}
      <View style={styles.paginationDots}>
        {mediaItems.map((_, index) => (
          <View
            key={index}
            style={[styles.dot, currentIndex === index && styles.dotActive]}
          />
        ))}
      </View>
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
  },
  paginationDots: {
    position: "absolute",
    top: dotsPosition,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
    zIndex: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.3)", // blanco translúcido
  },
  dotActive: {
    backgroundColor: "#ffffff", // blanco puro
  },
});
