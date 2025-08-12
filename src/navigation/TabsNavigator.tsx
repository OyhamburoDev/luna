import React from "react";
import { View, Text } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons"; // ✅ corregido para Expo
import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import MapScreen from "../screens/MapScreen";
import ChatsScreen from "../screens/ChatsScreen";
import { PetPost } from "../types/petPots";
import { useMessageStore } from "../store/messageStore";

const Tab = createBottomTabNavigator();

type Props = {
  onTabChange?: (tab: "Inicio" | "Mapa" | "Mensajes" | "Perfil") => void;
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
  const unreadCount = useMessageStore((state) => state.unreadCount);
  return (
    <Tab.Navigator
      screenListeners={{
        state: (e) => {
          const tabName = e.data.state.routeNames[e.data.state.index];
          onTabChange?.(tabName as "Inicio" | "Mapa" | "Mensajes" | "Perfil");
        },
      }}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = "help";

          if (route.name === "Inicio")
            iconName = focused ? "home" : "home-outline";
          else if (route.name === "Mapa")
            iconName = focused ? "map" : "map-outline";
          else if (route.name === "Mensajes")
            iconName = focused ? "chatbubbles" : "chatbubbles-outline";
          else if (route.name === "Perfil")
            iconName = focused ? "person" : "person-outline";

          // ✅ Badge SOLO para Mensajes
          if (route.name === "Mensajes" && unreadCount > 0) {
            return (
              <View>
                <Ionicons name={iconName as any} size={24} color={color} />
                <View
                  style={{
                    position: "absolute",
                    right: -8,
                    top: -8,
                    backgroundColor: "red",
                    borderRadius: 10,
                    width: 20,
                    height: 20,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ color: "white", fontSize: 12 }}>
                    {unreadCount}
                  </Text>
                </View>
              </View>
            );
          }

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
      <Tab.Screen
        name="Mensajes"
        component={ChatsScreen}
        initialParams={{ onTabChange }}
      />
      <Tab.Screen name="Perfil">
        {(props) => <ProfileScreen {...props} onTabChange={onTabChange} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
