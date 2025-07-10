"use client";

import { useNavigation } from "@react-navigation/native";
import { useRef, useState } from "react";
import { View, FlatList, StatusBar } from "react-native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/types";
import { mockPets } from "../data/mockPetsData";
import PetSwipeScreen from "./PetSwipeScreen";
import type { ViewToken } from "react-native";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [visibleIndex, setVisibleIndex] = useState(0);

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: Array<ViewToken> }) => {
      if (viewableItems.length > 0) {
        setVisibleIndex(viewableItems[0].index ?? 0);
      }
    }
  ).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 80,
  }).current;

  return (
    <View style={{ flex: 1, backgroundColor: "black" }}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <FlatList
        data={mockPets}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <PetSwipeScreen pet={item} isActive={index === visibleIndex} />
        )}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToAlignment="start"
        decelerationRate="fast"
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
      />
    </View>
  );
}
