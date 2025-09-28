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
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

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
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [cardHeight, setCardHeight] = useState(0);

  useEffect(() => {
    setBackgroundColorAsync("black");
  }, []);

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
    <SafeAreaView style={styles.fullScreenContainer} edges={["left", "right"]}>
      <CustomHeaderTop currentPage={0} onPressArrow={onPressDiscoverMore} />

      <View style={styles.flatListWrapper} onLayout={onLayoutFlatListContainer}>
        <FlatList
          data={pets}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <PetCardVertical
              pet={item}
              isActive={index === activeIndex && (isScreenActive ?? true)}
              alturaCard={cardHeight}
              onPressArrow={onPressDiscoverMore}
            />
          )}
          decelerationRate="fast"
          showsVerticalScrollIndicator={false}
          pagingEnabled
          snapToInterval={cardHeight > 0 ? cardHeight : 1}
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
