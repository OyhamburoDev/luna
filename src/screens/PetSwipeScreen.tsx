"use client";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRef, useState } from "react";
import {
  View,
  FlatList,
  Dimensions,
  StyleSheet,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import type { PetPost } from "../types/petPots";
import PetCardFullScreen from "../components/PetCardFullScreen";
import PetDetailInfo from "../components/PetDetailInfo";

const { width, height } = Dimensions.get("window");

type Props = {
  pet: PetPost;
  isActive: boolean;
  onDetailToggle?: (isVisible: boolean) => void;
  setShowTabs: (value: boolean) => void;
};

export default function PetSwipeScreen({
  pet,
  isActive,
  onDetailToggle,
  setShowTabs,
}: Props) {
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Control manual del scroll
  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollPosition = e.nativeEvent.contentOffset.x;
    const threshold = width * 0.0; // Ajusta este valor (0.3 = 30% del ancho)

    // Lógica para tabs
    if (scrollPosition > threshold) {
      setShowTabs(false);
      onDetailToggle?.(true);
      setCurrentIndex(1);
    } else {
      setShowTabs(true);
      onDetailToggle?.(false);
      setCurrentIndex(0);
    }
  };

  const goToDetail = () => {
    flatListRef.current?.scrollToIndex({ index: 1 });
    setShowTabs(false);
  };

  const goBackToCard = () => {
    flatListRef.current?.scrollToIndex({ index: 0 });
    setShowTabs(true);
  };

  const renderItem = ({ item }: { item: { key: string } }) => {
    if (item.key === "card") {
      return (
        <View style={styles.page}>
          <PetCardFullScreen
            pet={pet}
            onPressArrow={goToDetail}
            isActive={isActive && currentIndex === 0}
          />
        </View>
      );
    }
    return (
      <View style={styles.page}>
        <PetDetailInfo pet={pet} onBack={goBackToCard} />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <FlatList
        ref={flatListRef}
        data={[{ key: "card" }, { key: "detail" }]}
        keyExtractor={(item) => item.key}
        horizontal
        pagingEnabled
        renderItem={renderItem}
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll} // Usamos onScroll en lugar de onViewableItemsChanged
        scrollEventThrottle={16} // Para mayor precisión (16ms)
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
      />
    </SafeAreaView>
  );
}

// Tus estilos permanecen igual
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "blue",
  },
  page: {
    width,
    height,
    overflow: "hidden",
  },
});
