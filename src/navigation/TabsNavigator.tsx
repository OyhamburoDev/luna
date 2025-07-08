import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "../screens/HomeScreen";
import MapScreen from "../screens/MapScreen";
import ProfileScreen from "../screens/ProfileScreen";
import RedirectScreen from "../screens/RedirectScreen";
import { useAuthStore } from "../store/auth";

const Tab = createBottomTabNavigator();

export default function TabsNavigator() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          if (route.name === "Inicio") {
            return (
              <Ionicons
                name={focused ? "home" : "home-outline"}
                size={size}
                color={color}
              />
            );
          } else if (route.name === "Mapa") {
            return (
              <Ionicons
                name={focused ? "map" : "map-outline"}
                size={size}
                color={color}
              />
            );
          } else if (route.name === "Perfil") {
            return (
              <Ionicons
                name={focused ? "person" : "person-outline"}
                size={size}
                color={color}
              />
            );
          }

          return null;
        },
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "black", // 👉 cambiá esto por el color que quieras
          borderTopWidth: 0,
          height: 65,
        },
        tabBarActiveTintColor: "white", // Color cuando está seleccionado
        tabBarInactiveTintColor: "#999", // Color cuando NO está seleccionado
        tabBarLabelStyle: {
          fontSize: 10,
          marginBottom: 0,
        },
      })}
    >
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
