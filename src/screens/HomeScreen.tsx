"use client";

import {
  FlatList,
  View,
  StyleSheet,
  type ViewToken,
  type LayoutChangeEvent,
  ActivityIndicator,
  Text,
} from "react-native";
import { useCallback, useState, useRef, useEffect } from "react";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as NavigationBar from "expo-navigation-bar";
import { StatusBar } from "expo-status-bar";
import LottieView from "lottie-react-native";
import { useConfettiStore } from "../store/useConfettiStore";

import CustomHeaderTop from "../components/CustomHeaderTop";
import PetCardVertical from "../components/PetCardVertical";
import { setBackgroundColorAsync } from "expo-system-ui";
import type { PetPost } from "../types/petPots";

type Props = {
  pets: PetPost[];
  onSelectPet: (index: number) => void;
  route: any;
  onTabChange?: (tab: "Inicio" | "Mapa" | "Perfil") => void;
  isScreenActive?: boolean;
  onPressDiscoverMore: () => void;
  loadMore?: () => void;
  loadingMore?: boolean;
  hasMore?: boolean;
};

export default function HomeScreen({
  pets,
  onSelectPet,
  route,
  onTabChange,
  isScreenActive,
  onPressDiscoverMore,
  loadMore,
  loadingMore,
  hasMore,
}: Props) {
  const isFocused = useIsFocused();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [cardHeight, setCardHeight] = useState(0);

  const confettiRef = useRef<LottieView>(null);
  const { mostrarConfetti, resetConfetti } = useConfettiStore();

  useEffect(() => {
    setBackgroundColorAsync("black");
  }, []);

  // 🔥 Agregar NavigationBar control
  // useEffect(() => {
  //   if (isFocused) {
  //     console.log("🏠 HomeScreen focused - setting NavigationBar to black");
  //     NavigationBar.setBackgroundColorAsync("#000000");
  //     NavigationBar.setButtonStyleAsync("light");
  //   }
  // }, [isFocused]);

  const onLayoutFlatListContainer = useCallback((event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    setCardHeight(height);
  }, []);

  useFocusEffect(
    useCallback(() => {
      route.params?.onTabChange?.("Inicio");
    }, [route.params])
  );

  useEffect(() => {
    if (pets.length > 0) {
      setIsLoading(false);
    }
  }, [pets]);

  // useEffect para el confetti - esperar a que termine de cargar + delay
  useEffect(() => {
    if (mostrarConfetti && confettiRef.current && !isLoading) {
      console.log("🎊 Esperando 1.5s antes de lanzar confetti...");

      // Delay de 1.5 segundos para que cargue el media del primer post
      const delayTimer = setTimeout(() => {
        console.log("🎊 LANZANDO CONFETTI!");
        confettiRef.current?.play();

        // Resetear después de 3 segundos
        setTimeout(() => {
          resetConfetti();
        }, 3000);
      }, 1500);

      // Cleanup
      return () => clearTimeout(delayTimer);
    }
  }, [mostrarConfetti, isLoading, resetConfetti]);

  useEffect(() => {
    if (isScreenActive) {
      console.log("🐶 Mascota visible en HomeScreen:", activeIndex);
      onSelectPet(activeIndex);
    }
  }, [activeIndex, isScreenActive, onSelectPet]);

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: Array<ViewToken> }) => {
      if (viewableItems.length > 0) {
        const index = viewableItems[0].index ?? 0;
        setActiveIndex(index);
      }
    }
  ).current;

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 80,
  };

  const handleLoadMore = useCallback(() => {
    console.log("🎯 onEndReached ejecutado!");
    if (loadMore && hasMore && !loadingMore) {
      loadMore();
    }
  }, [loadMore, hasMore, loadingMore]);

  if (isLoading || pets.length === 0) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#667eea" />
      </View>
    );
  }

  return (
    <>
      {isFocused && (
        <StatusBar style="light" translucent backgroundColor="transparent" />
      )}
      <SafeAreaView
        style={styles.fullScreenContainer}
        edges={["left", "right"]}
      >
        {/* Confetti overlay */}
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
              zIndex: 99999, // ← MÁS ALTO
              elevation: 99999, // ← AGREGAR PARA ANDROID
              pointerEvents: "none",
              transform: [{ scale: 2 }],
            }}
            autoPlay={false}
            loop={false}
          />
        )}
        <CustomHeaderTop currentPage={0} onPressArrow={onPressDiscoverMore} />

        <View
          style={styles.flatListWrapper}
          onLayout={onLayoutFlatListContainer}
        >
          <FlatList
            data={pets}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
              <PetCardVertical
                pet={item}
                isActive={index === activeIndex && (isScreenActive ?? true)}
                alturaCard={cardHeight}
                onPressArrow={onPressDiscoverMore}
                index={index}
              />
            )}
            decelerationRate={0.8}
            overScrollMode="never"
            showsVerticalScrollIndicator={false}
            disableIntervalMomentum={true}
            snapToInterval={cardHeight > 0 ? cardHeight : 1}
            snapToAlignment="start"
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={viewabilityConfig}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            initialNumToRender={3}
            maxToRenderPerBatch={5}
            windowSize={5}
            removeClippedSubviews={true}
            ListFooterComponent={
              loadingMore ? (
                <View style={styles.footerLoader}>
                  <ActivityIndicator size="small" color="#f093fb" />
                </View>
              ) : !hasMore ? (
                <View style={styles.footerEnd}>
                  <Text style={{ color: "white", fontSize: 14 }}>
                    No hay más posts
                  </Text>
                </View>
              ) : null
            }
          />
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    backgroundColor: "black",
  },
  flatListWrapper: {
    flex: 1,
    backgroundColor: "black",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
  },
  footerLoader: {
    paddingVertical: 20,
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
  },
  footerEnd: {
    paddingVertical: 20,
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
  },
});
