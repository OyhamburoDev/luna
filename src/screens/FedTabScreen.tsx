// FeedTabScreen.tsx
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  ViewToken,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState, useRef, useEffect } from "react";
import { PetPost } from "../types/petPots";
import PetCardVertical from "../components/PetCardVertical";
import CustomHeaderTop from "../components/CustomHeaderTop";
import { ActivityIndicator } from "react-native";

type Props = {
  pets: PetPost[];
  onSelectPet: (index: number) => void;
  route: any;
  onTabChange?: (tab: "Inicio" | "Mapa" | "Perfil") => void;
  isScreenActive?: boolean;
  onPressDiscoverMore: () => void;
};

const { width, height } = Dimensions.get("window");

export default function FeedTabScreen({
  pets,
  onSelectPet,
  route,
  onTabChange,
  isScreenActive,
  onPressDiscoverMore,
}: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [displayedPets, setDisplayedPets] = useState<PetPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useFocusEffect(
    useCallback(() => {
      route.params?.onTabChange?.("Inicio");
    }, [])
  );

  useEffect(() => {
    if (pets.length > 0) {
      const initialPets = pets.slice(0, pageSize);
      setDisplayedPets(initialPets);
      setIsLoading(false);
    }
  }, [pets]);

  useEffect(() => {
    if (isScreenActive) {
      console.log("🐶 Mascota visible en FeedTabScreen:", activeIndex);
      onSelectPet(activeIndex);
    }
  }, [activeIndex, isScreenActive]);

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

  if (isLoading || displayedPets.length === 0) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#667eea" />
      </View>
    );
  }

  const loadMorePets = () => {
    if (isLoadingMore) return;

    setIsLoadingMore(true);

    setTimeout(() => {
      const nextPage = page + 1;
      const newPets = pets.slice(0, nextPage * pageSize);
      setDisplayedPets(newPets);
      setPage(nextPage);
      setIsLoadingMore(false);
    }, 1000);
  };

  return (
    <>
      <CustomHeaderTop currentPage={0} onPressArrow={onPressDiscoverMore} />
      <FlatList
        style={{ flex: 1 }}
        data={displayedPets}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <PetCardVertical
            pet={item}
            isActive={index === activeIndex && (isScreenActive ?? true)}
          />
        )}
        snapToInterval={height}
        decelerationRate="fast"
        showsVerticalScrollIndicator={false}
        pagingEnabled
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        onEndReached={loadMorePets}
        onEndReachedThreshold={0.5}
        initialNumToRender={3} // Cuántas cards se renderizan inicialmente
        maxToRenderPerBatch={5} // Cuántas se renderizan por batch
        windowSize={5} // Cuántas quedan "vivas" (alrededor del viewport)
        removeClippedSubviews={true} // Limpia las cards fuera de la pantalla (solo Android)
        ListFooterComponent={
          isLoadingMore ? (
            <View
              style={{
                paddingVertical: 20,
                backgroundColor: "black",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ActivityIndicator size="small" color="#f093fb" />
            </View>
          ) : null
        }
      />
    </>
  );
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
  },
});
