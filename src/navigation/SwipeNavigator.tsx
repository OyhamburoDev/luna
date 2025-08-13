import React from "react";
import { FlatList, View, Dimensions } from "react-native";
import {
  NavigationContainer,
  NavigationIndependentTree,
} from "@react-navigation/native";
import TabsNavigator from "./TabsNavigator";
import FullScreenStack from "../screens/FullScreenStack";
import { mockPets } from "../data/mockPetsData";
import { useState, useRef, useEffect } from "react";
import AdoptionConfirmModal from "../components/AdoptionConfirmModal";
import { useInitializeMessages } from "../hooks/useInitializeMessages";

const SCREEN_WIDTH = Dimensions.get("window").width;

export default function SwipeNavigator() {
  const [activeTab, setActiveTab] = useState<
    "Inicio" | "Mapa" | "Mensajes" | "Perfil"
  >("Inicio"); // para saber que tabs esta sellecionada?

  const scrollEnabled = activeTab === "Inicio"; // si esta activa , hacer scroll horizontal

  const flatListRef = useRef<FlatList>(null); // no se

  const [selectedPetIndex, setSelectedPetIndex] = useState<number | null>(null); // seleccionamos el index

  const [modalVisible, setModalVisible] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(0);

  useInitializeMessages();

  // Para saber que tabbar esta activa
  const handleTabChange = (
    tabName: "Inicio" | "Mapa" | "Mensajes" | "Perfil"
  ) => {
    console.log("🔥 Tab activa desde FeedTabs:", tabName);
    setActiveTab(tabName);
  };

  // es un scroll si el mapa esta activo / debe ser por el scroll que tienen las fotos de petDetail
  useEffect(() => {
    if (activeTab === "Mapa") {
      flatListRef.current?.scrollToIndex({ index: 0, animated: true });
    }
  }, [activeTab]);

  // debe ser para el boton que va a PetDetail
  const goToDetailScreen = () => {
    flatListRef.current?.scrollToIndex({ index: 1, animated: true });
  };

  // debe ser para volver a la page principal
  const goToPage0 = () => {
    flatListRef.current?.scrollToIndex({ index: 0, animated: true });
  };

  return (
    <>
      <FlatList
        ref={flatListRef}
        data={[0, 1]}
        horizontal
        pagingEnabled
        scrollEnabled={scrollEnabled}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.toString()}
        renderItem={({ item }) => (
          <View style={{ width: SCREEN_WIDTH, flex: 1 }}>
            <NavigationIndependentTree>
              <NavigationContainer>
                {item === 0 ? (
                  <TabsNavigator
                    onTabChange={handleTabChange}
                    pets={mockPets}
                    onSelectPet={setSelectedPetIndex}
                    isScreenActive={
                      currentIndex === 0 && activeTab === "Inicio"
                    }
                    onPressDiscoverMore={goToDetailScreen}
                  />
                ) : activeTab === "Inicio" && selectedPetIndex !== null ? (
                  <FullScreenStack
                    pet={mockPets[selectedPetIndex]}
                    onGoBackToFeed={goToPage0}
                    setModalVisible={setModalVisible}
                  />
                ) : (
                  <View style={{ flex: 1 }} />
                )}
              </NavigationContainer>
            </NavigationIndependentTree>
          </View>
        )}
        onMomentumScrollEnd={(e) => {
          const newIndex = Math.round(
            e.nativeEvent.contentOffset.x / SCREEN_WIDTH
          );
          setCurrentIndex(newIndex);
        }}
      />
      <AdoptionConfirmModal
        onCancel={() => setModalVisible(false)}
        visible={modalVisible}
        pet={selectedPetIndex !== null ? mockPets[selectedPetIndex] : null}
        onConfirm={() => {
          setModalVisible(false);
        }}
      />
    </>
  );
}
