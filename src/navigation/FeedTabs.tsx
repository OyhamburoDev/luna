import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import FeedTabScreen from "../screens/FedTabScreen";
import FavoritesTabScreen from "../screens/FavoritesTabScreen";
import ProfileScreen from "../screens/ProfileScreen";
import { PetPost } from "../types/petPots";
import Ionicons from "react-native-vector-icons/Ionicons";

const Tab = createBottomTabNavigator();

type Props = {
  onTabChange?: (tab: "Inicio" | "Mapa" | "Perfil") => void;
  pets: PetPost[];
  onSelectPet: (index: number) => void;
  isScreenActive?: boolean;
  onPressDiscoverMore: () => void;
};

export default function FeedTabs({
  onTabChange,
  pets,
  onSelectPet,
  isScreenActive,
  onPressDiscoverMore,
}: Props) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarStyle: {
          backgroundColor: "black",
          borderTopWidth: 0,
          height: 65,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = "help";

          if (route.name === "Inicio")
            iconName = focused ? "home" : "home-outline";
          else if (route.name === "Mapa")
            iconName = focused ? "map" : "map-outline";
          else if (route.name === "Perfil")
            iconName = focused ? "person" : "person-outline";

          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
        tabBarActiveTintColor: "white",
        tabBarInactiveTintColor: "#999",
        tabBarLabelStyle: {
          fontSize: 10,
          marginBottom: 0,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="Inicio"
        children={({ route }) => (
          <FeedTabScreen
            pets={pets}
            onSelectPet={onSelectPet}
            route={route}
            isScreenActive={isScreenActive}
            onPressDiscoverMore={onPressDiscoverMore}
          />
        )}
        initialParams={{ onTabChange }}
      />
      <Tab.Screen
        name="Mapa"
        component={FavoritesTabScreen}
        initialParams={{ onTabChange }}
      />
      <Tab.Screen
        name="Perfil"
        component={ProfileScreen}
        initialParams={{ onTabChange }}
      />
    </Tab.Navigator>
  );
}
