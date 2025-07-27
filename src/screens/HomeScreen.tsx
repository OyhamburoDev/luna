"use client";

import {
  FlatList,
  View,
  StyleSheet,
  type ViewToken,
  type LayoutChangeEvent,
  ActivityIndicator,
} from "react-native";
import { useCallback, useState, useRef, useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

import CustomHeaderTop from "../components/CustomHeaderTop"; // Asegúrate de que la ruta sea correcta
import PetCardVertical from "../components/PetCardVertical"; // Asegúrate de que la ruta sea correcta
import { setBackgroundColorAsync } from "expo-system-ui";

// Define el tipo PetPost si no está en un archivo separado o si no se puede importar
// Si está en un archivo separado, asegúrate de que la importación sea correcta.
export type PetPost = {
  id: string;
  petName: string;
  description: string;
  videoUri?: any; // Ajusta el tipo según tu uso real (e.g., string para URI)
  imageUris?: any[]; // Ajusta el tipo según tu uso real (e.g., string[] para URIs)
};

type Props = {
  pets: PetPost[];
  onSelectPet: (index: number) => void;
  route: any;
  onTabChange?: (tab: "Inicio" | "Mapa" | "Perfil") => void;
  isScreenActive?: boolean;
  onPressDiscoverMore: () => void;
};

export default function HomeScreen({
  pets,
  onSelectPet,
  route,
  onTabChange,
  isScreenActive,
  onPressDiscoverMore,
}: Props) {
  // --- TODOS LOS HOOKS DEBEN IR AQUÍ, ANTES DE CUALQUIER RETURN CONDICIONAL ---
  const [activeIndex, setActiveIndex] = useState(0);
  const [displayedPets, setDisplayedPets] = useState<PetPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Estado para almacenar la altura calculada para cada tarjeta
  const [cardHeight, setCardHeight] = useState(0);

  useEffect(() => {
    setBackgroundColorAsync("black"); // 🔲 Cambia la navigation bar abajo
  }, []);

  // Función para medir la altura del contenedor del FlatList
  // Se mueve aquí para que siempre se llame.
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
      const initialPets = pets.slice(0, pageSize);
      setDisplayedPets(initialPets);
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
  // --- FIN DE LOS HOOKS ---

  // Ahora, el return condicional para el estado de carga
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
    // Usa SafeAreaView para asegurar que el contenido respete las áreas seguras del sistema
    <SafeAreaView style={styles.fullScreenContainer} edges={["left", "right"]}>
      <CustomHeaderTop currentPage={0} onPressArrow={onPressDiscoverMore} />
      {/* Este View tomará el espacio vertical restante y su altura será medida */}
      <View style={styles.flatListWrapper} onLayout={onLayoutFlatListContainer}>
        {/* El FlatList siempre se renderiza. Si cardHeight es 0 inicialmente,
            las tarjetas tendrán altura 0 hasta que se mida el layout. */}
        <FlatList
          data={displayedPets}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <PetCardVertical
              pet={item}
              isActive={index === activeIndex && (isScreenActive ?? true)}
              alturaCard={cardHeight} // Pasa la altura medida dinámicamente
            />
          )}
          decelerationRate="fast"
          showsVerticalScrollIndicator={false}
          pagingEnabled
          // Asegura que snapToInterval no sea 0 para evitar errores
          snapToInterval={cardHeight > 0 ? cardHeight : 1}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          onEndReached={loadMorePets}
          onEndReachedThreshold={0.5}
          initialNumToRender={3}
          maxToRenderPerBatch={5}
          windowSize={5}
          removeClippedSubviews={true}
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
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1, // Hace que SafeAreaView ocupe todo el espacio de pantalla disponible
    backgroundColor: "black", // Establece un color de fondo para la pantalla
  },
  flatListWrapper: {
    flex: 1, // Este View ocupa todo el espacio restante después de CustomHeaderTop
    backgroundColor: "black",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
  },
});
