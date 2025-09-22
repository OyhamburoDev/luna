import React from "react";
import { View, Text } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import MapScreen from "../screens/MapScreen";
import ChatsScreen from "../screens/ChatsScreen";
import CreatePostScreen from "../screens/CreatePostScreen"; // 👈 Agregar import
import { PetPost } from "../types/petPots";
import { useMessageStore } from "../store/messageStore";
import { textStyles } from "../theme/textStyles";
import { useAuthModalContext } from "../contexts/AuthModalContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTabsStore } from "../store/tabsStore";
import CameraScreen from "../screens/CamaraScreen";

const Tab = createBottomTabNavigator();

type Props = {
  onTabChange?: (
    tab: "Inicio" | "Mapa" | "Crear" | "Mensajes" | "Perfil"
  ) => void; // 👈 Agregar "Crear"
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
  const hideBottomTabs = useTabsStore((state) => state.hideBottomTabs);
  const insets = useSafeAreaInsets();
  const bottomPad = Math.max(insets.bottom, 16);
  const unreadCount = useMessageStore((state) => state.unreadCount);
  const { isVisible } = useAuthModalContext();

  return (
    <Tab.Navigator
      screenListeners={{
        state: (e) => {
          const tabName = e.data.state.routeNames[e.data.state.index];
          onTabChange?.(
            tabName as "Inicio" | "Mapa" | "Crear" | "Mensajes" | "Perfil"
          ); // 👈 Actualizar
        },
      }}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = "help";

          if (route.name === "Inicio")
            iconName = focused ? "home" : "home-outline";
          else if (route.name === "Mapa")
            iconName = focused ? "map" : "map-outline";
          if (route.name === "Crear") {
            return (
              <View
                style={{
                  width: 40,
                  height: 30,
                  borderRadius: 6, // Bordes ligeramente redondeados como TikTok
                  backgroundColor: "white",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Ionicons name="add" size={26} color="black" />
              </View>
            );
          } else if (route.name === "Mensajes")
            iconName = focused ? "chatbubbles" : "chatbubbles-outline";
          else if (route.name === "Perfil")
            iconName = focused ? "person" : "person-outline";

          // Badge para Mensajes
          if (route.name === "Mensajes" && unreadCount > 0) {
            return (
              <View>
                <Ionicons name={iconName as any} size={24} color={color} />
                <View
                  style={{
                    position: "absolute",
                    right: -8,
                    top: -8,
                    backgroundColor: "#FE2C55",
                    borderRadius: 10,
                    width: 20,
                    height: 20,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={textStyles.badge}>{unreadCount}</Text>
                </View>
              </View>
            );
          }

          return <Ionicons name={iconName as any} size={23} color={color} />;
        },
        tabBarActiveTintColor: "white",
        tabBarInactiveTintColor: isVisible ? "white" : "#888",

        tabBarStyle: hideBottomTabs
          ? { display: "none" }
          : {
              backgroundColor: "black",
              borderTopWidth: 0,
              paddingTop: 4,
              paddingBottom: bottomPad,
            },
        tabBarLabelStyle: {
          ...textStyles.tabLabel,
          marginTop: -4,
          fontSize: 12,
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
        name="Crear" // 👈 Cambiar nombre
        component={CameraScreen}
        initialParams={{ onTabChange }}
        options={{
          tabBarLabel: () => null, // 👈 Retornar null
        }}
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
