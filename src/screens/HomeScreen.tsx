"use client";
import { useNavigation } from "@react-navigation/native";
import { useRef, useState, useEffect } from "react";
import { View, FlatList, StatusBar } from "react-native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/types";
import { mockPets } from "../data/mockPetsData";
import PetSwipeScreen from "./PetSwipeScreen";
import type { ViewToken } from "react-native";
import type { BottomTabNavigationOptions } from "@react-navigation/bottom-tabs";
import { SafeAreaView } from "react-native-safe-area-context";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type Props = {
  setShowTabs: (value: boolean) => void;
};

export default function HomeScreen({ setShowTabs }: Props) {
  const navigation = useNavigation<NavigationProp>();
  const [visibleIndex, setVisibleIndex] = useState(0);
  const [isDetailVisible, setIsDetailVisible] = useState(false);

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
    <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <FlatList
        data={mockPets}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <PetSwipeScreen
            pet={item}
            isActive={index === visibleIndex}
            onDetailToggle={setIsDetailVisible}
            setShowTabs={setShowTabs}
          />
        )}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToAlignment="start"
        decelerationRate="fast"
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        scrollEnabled={!isDetailVisible}
      />
    </SafeAreaView>
  );
}
