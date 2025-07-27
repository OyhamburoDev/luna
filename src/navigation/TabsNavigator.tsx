import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons"; // ✅ corregido para Expo
import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import MapScreen from "../screens/MapScreen";
import { PetPost } from "../types/petPots";

const Tab = createBottomTabNavigator();

type Props = {
  onTabChange?: (tab: "Inicio" | "Mapa" | "Perfil") => void;
  pets: PetPost[];
  onSelectPet: (index: number) => void;
  isScreenActive?: boolean;
  onPressDiscoverMore: () => void;
};

export default function TabsNavigator({
  onTabChange,
  pets,
  onSelectPet,
  isScreenActive,
  onPressDiscoverMore,
}: Props) {
  return (
    <Tab.Navigator
      screenListeners={{
        state: (e) => {
          const tabName = e.data.state.routeNames[e.data.state.index];
          onTabChange?.(tabName as "Inicio" | "Mapa" | "Perfil");
        },
      }}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = "help";

          if (route.name === "Inicio")
            iconName = focused ? "home" : "home-outline";
          else if (route.name === "Mapa")
            iconName = focused ? "map" : "map-outline";
          else if (route.name === "Perfil")
            iconName = focused ? "person" : "person-outline";

          return <Ionicons name={iconName as any} size={24} color={color} />;
        },
        tabBarActiveTintColor: "white",
        tabBarInactiveTintColor: "#888",
        tabBarStyle: {
          backgroundColor: "black",
          borderTopWidth: 0,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="Inicio"
        children={({ route }) => (
          <HomeScreen
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
        component={MapScreen}
        initialParams={{ onTabChange }}
      />
      <Tab.Screen name="Perfil">
        {(props) => <ProfileScreen {...props} onTabChange={onTabChange} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
