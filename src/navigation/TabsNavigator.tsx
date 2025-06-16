import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen";
import MapScreen from "../screens/MapScreen";
import ProfileScreen from "../screens/ProfileScreen";
import RedirectScreen from "../screens/RedirectScreen";
import { useAuthStore } from "../store/auth";

const Tab = createBottomTabNavigator();

export default function TabsNavigator() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Inicio" component={HomeScreen} />
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
