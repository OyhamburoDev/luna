"use client";

import { useRef } from "react";
import { useState } from "react";
import { View, FlatList, Dimensions, StyleSheet } from "react-native";
import type { PetPost } from "../types/petPots";
import PetCardFullScreen from "../components/PetCardFullScreen";
import PetDetailInfo from "../components/PetDetailInfo";

const { width, height } = Dimensions.get("window");

type Props = {
  pet: PetPost;
  isActive: boolean;
};

export default function PetSwipeScreen({ pet, isActive }: Props) {
  const [visibleItemIndex, setVisibleItemIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const goToDetail = () => {
    flatListRef.current?.scrollToIndex({ index: 1 });
  };

  const goBackToCard = () => {
    flatListRef.current?.scrollToIndex({ index: 0 });
  };

  const renderItem = ({ item }: { item: { key: string } }) => {
    if (item.key === "card") {
      return (
        <View style={styles.page}>
          <PetCardFullScreen
            pet={pet}
            onPressArrow={goToDetail}
            // ✅ Combinar ambas condiciones: debe estar activo Y en la primera página
            isActive={isActive && visibleItemIndex === 0}
          />
        </View>
      );
    } else {
      return (
        <View style={styles.page}>
          <PetDetailInfo pet={pet} onBack={goBackToCard} />
        </View>
      );
    }
  };

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setVisibleItemIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 80,
  }).current;

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={[{ key: "card" }, { key: "detail" }]}
        keyExtractor={(item) => item.key}
        horizontal
        pagingEnabled
        renderItem={renderItem}
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width,
    height,
  },
  page: {
    width,
    height,
  },
});
