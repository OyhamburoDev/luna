// TabsNavigator.tsx
"use client";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useState } from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import HomeScreen from "../screens/HomeScreen";
import MapScreen from "../screens/MapScreen";
import ProfileScreen from "../screens/ProfileScreen";
import RedirectScreen from "../screens/RedirectScreen";
import { useAuthStore } from "../store/auth";
import { View } from "react-native";

const Tab = createBottomTabNavigator();

export default function TabsNavigator() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [showTabs, setShowTabs] = useState(true);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarStyle: showTabs
          ? {
              backgroundColor: "black",
              borderTopWidth: 0,
              height: 65,
            }
          : { display: "none" },
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
        children={() => <HomeScreen setShowTabs={setShowTabs} />}
      />
      <Tab.Screen
        name="Mapa"
        component={isAuthenticated ? MapScreen : RedirectScreen}
      />
      <Tab.Screen
        name="Perfil"
        component={isAuthenticated ? ProfileScreen : RedirectScreen}
      />
    </Tab.Navigator>
  );
}
