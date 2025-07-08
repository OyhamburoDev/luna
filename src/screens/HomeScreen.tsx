import { useNavigation } from "@react-navigation/native";
import { View, FlatList, StatusBar } from "react-native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/types";
import PetCardFullScreen from "../components/PetCardFullScreen";
import { mockPets } from "../data/mockPetsData";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();

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
        renderItem={({ item }) => <PetCardFullScreen pet={item} />}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToAlignment="start"
        decelerationRate="fast"
      />
    </View>
  );
}
