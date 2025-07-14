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
  useFocusEffect(
    useCallback(() => {
      route.params?.onTabChange?.("Inicio");
    }, [])
  );

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

  return (
    <>
      <CustomHeaderTop currentPage={0} onPressArrow={onPressDiscoverMore} />
      <FlatList
        style={{ flex: 1 }}
        data={pets}
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
        contentContainerStyle={{ paddingBottom: 90 }}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
      />
    </>
  );
}
