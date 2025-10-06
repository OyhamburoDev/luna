import React from "react";
import { FlatList, View, Dimensions, ActivityIndicator } from "react-native";
import {
  NavigationContainer,
  NavigationIndependentTree,
} from "@react-navigation/native";
import TabsNavigator from "./TabsNavigator";
import FullScreenStack from "../screens/FullScreenStack";
// import { mockPets } from "../data/mockPetsData";
import { useState, useRef, useEffect, useMemo } from "react";
import AdoptionConfirmModal from "../components/AdoptionConfirmModal";
import { useInitializeMessages } from "../hooks/useInitializeMessages";
import { AuthModalProvider } from "../contexts/AuthModalContext";
import { AuthModal } from "../components/AuthModal";
import { useFirebasePosts } from "../hooks/useFirebasePosts";

const SCREEN_WIDTH = Dimensions.get("window").width;

export default function SwipeNavigator() {
  const [activeTab, setActiveTab] = useState<
    "Inicio" | "Mapa" | "Crear" | "Mensajes" | "Perfil"
  >("Inicio"); // para saber que tabs esta sellecionada?

  const scrollEnabled = activeTab === "Inicio"; // si esta activa , hacer scroll horizontal

  const flatListRef = useRef<FlatList>(null); // no se

  const [selectedPetIndex, setSelectedPetIndex] = useState<number | null>(null); // seleccionamos el index

  const [modalVisible, setModalVisible] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(0);

  useInitializeMessages();
  const { firebasePosts, loading, error, loadMore, hasMore, loadingMore } =
    useFirebasePosts();

  // 👇 Combinar mockPets (arriba) con firebasePosts (abajo)
  const allPets = useMemo(() => {
    return firebasePosts || [];
  }, [firebasePosts]);

  // Para saber que tabbar esta activa
  const handleTabChange = (
    tabName: "Inicio" | "Mapa" | "Crear" | "Mensajes" | "Perfil"
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

  if (loading || !firebasePosts || firebasePosts.length === 0) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "black",
        }}
      >
        <ActivityIndicator size="large" color="#667eea" />
      </View>
    );
  }

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
                    pets={allPets}
                    onSelectPet={setSelectedPetIndex}
                    isScreenActive={
                      currentIndex === 0 && activeTab === "Inicio"
                    }
                    onPressDiscoverMore={goToDetailScreen}
                    loadMore={loadMore}
                    loadingMore={loadingMore}
                    hasMore={hasMore}
                  />
                ) : activeTab === "Inicio" && selectedPetIndex !== null ? (
                  <FullScreenStack
                    pet={allPets[selectedPetIndex]}
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
        pet={selectedPetIndex !== null ? allPets[selectedPetIndex] : null}
        onConfirm={() => {
          setModalVisible(false);
        }}
      />
    </>
  );
}
