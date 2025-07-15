import { FlatList, View, Dimensions } from "react-native";
import { useState, useRef, useEffect } from "react";
import FeedTabs from "../navigation/FeedTabs";
import PetDetailScreen from "../screens/PetDetailScreen";
import { mockPets } from "../data/mockPetsData";

const { width, height } = Dimensions.get("window");

export default function PetSwipe() {
  const [activeTab, setActiveTab] = useState<"Inicio" | "Mapa" | "Perfil">(
    "Inicio"
  );
  const flatListRef = useRef<FlatList>(null);
  const scrollEnabled = activeTab === "Inicio";
  const [selectedPetIndex, setSelectedPetIndex] = useState<number | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleTabChange = (tabName: "Inicio" | "Mapa" | "Perfil") => {
    console.log("🔥 Tab activa desde FeedTabs:", tabName);
    setActiveTab(tabName);
  };

  // 🔁 Si se cambia a Favorites, volvemos al slide 0
  useEffect(() => {
    if (activeTab === "Mapa") {
      flatListRef.current?.scrollToIndex({ index: 0, animated: true });
    }
  }, [activeTab]);

  const goToDetailScreen = () => {
    flatListRef.current?.scrollToIndex({ index: 1, animated: true });
  };

  const goToPage0 = () => {
    flatListRef.current?.scrollToIndex({ index: 0, animated: true });
  };

  const screens = [
    {
      key: "tabs",
      render: () => (
        <FeedTabs
          onTabChange={handleTabChange}
          pets={mockPets}
          onSelectPet={setSelectedPetIndex}
          isScreenActive={currentIndex === 0 && activeTab === "Inicio"}
          onPressDiscoverMore={goToDetailScreen}
        />
      ),
    },
    {
      key: "detail",
      render: () =>
        activeTab === "Inicio" && selectedPetIndex !== null ? (
          <PetDetailScreen
            pet={mockPets[selectedPetIndex]}
            onGoBackToFeed={goToPage0}
          />
        ) : (
          <View style={{ flex: 1 }} />
        ),
    },
  ];

  return (
    <FlatList
      ref={flatListRef}
      data={screens}
      horizontal
      pagingEnabled
      scrollEnabled={scrollEnabled}
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item) => item.key}
      renderItem={({ item }) => (
        <View style={{ width, height }}>{item.render()}</View>
      )}
      onMomentumScrollEnd={(e) => {
        const newIndex = Math.round(e.nativeEvent.contentOffset.x / width);
        setCurrentIndex(newIndex);
      }}
    />
  );
}
