import React from "react";
import { useEffect } from "react";
import { View, Text } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import MapScreen from "../screens/MapScreen";
import NotificationsScreen from "../screens/NotificationsScreen";
import CameraScreen from "../screens/CamaraScreen";
import { PetPost } from "../types/petPots";
import * as NavigationBar from "expo-navigation-bar";
import { textStyles } from "../theme/textStyles";
import { useAuthModalContext } from "../contexts/AuthModalContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTabsStore } from "../store/tabsStore";
import { fonts } from "../theme/fonts";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNotificationsStore } from "../store/notificationsStore";

const Tab = createBottomTabNavigator();

type Props = {
  onTabChange?: (
    tab: "Inicio" | "Mapa" | "Crear" | "Mensajes" | "Perfil"
  ) => void;
  pets: PetPost[];
  onSelectPet: (index: number) => void;
  isScreenActive?: boolean;
  onPressDiscoverMore: () => void;
  loadMore?: () => void;
  loadingMore?: boolean;
  hasMore?: boolean;
};

export default function TabsNavigator({
  onTabChange,
  pets,
  onSelectPet,
  isScreenActive,
  onPressDiscoverMore,
  loadMore,
  loadingMore,
  hasMore,
}: Props) {
  const hideBottomTabs = useTabsStore((state) => state.hideBottomTabs);
  const insets = useSafeAreaInsets();
  const bottomPad = Math.max(insets.bottom, 16);
  const unreadCount = useNotificationsStore((state) => state.unreadCount);
  const { isVisible } = useAuthModalContext();

  // Estado para trackear la pantalla actual
  const [currentRoute, setCurrentRoute] = React.useState("Inicio");

  useEffect(() => {
    if (currentRoute === "Mensajes" || currentRoute === "Crear") {
      // Tabs con fondo blanco
      NavigationBar.setBackgroundColorAsync("#ffffff");
      NavigationBar.setButtonStyleAsync("dark");
    } else {
      // Tabs con fondo negro (Inicio, Mapa, Perfil)
      NavigationBar.setBackgroundColorAsync("#000000");
      NavigationBar.setButtonStyleAsync("light");
    }
  }, [currentRoute]);

  return (
    <Tab.Navigator
      screenListeners={{
        state: (e) => {
          const tabName = e.data.state.routeNames[e.data.state.index];
          setCurrentRoute(tabName); // Actualizar la ruta actual
          onTabChange?.(
            tabName as "Inicio" | "Mapa" | "Crear" | "Mensajes" | "Perfil"
          );
        },
      }}
      screenOptions={({ route }) => {
        // Fondo dinámico para el tabBar
        const isWhiteBackground =
          route.name === "Crear" || route.name === "Mensajes";

        return {
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

            // Botón central "Crear"
            if (route.name === "Crear") {
              // Cambiar colores solo cuando estamos en la pantalla de Mensajes
              const isNotificationsScreen = currentRoute === "Mensajes";

              return (
                <View
                  style={{
                    width: 37,
                    height: 29,
                    borderRadius: 6,
                    backgroundColor: isNotificationsScreen ? "black" : "white",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <MaterialCommunityIcons
                    name="plus"
                    size={23}
                    color={isNotificationsScreen ? "white" : "black"}
                  />
                </View>
              );
            }

            // Badge para Mensajes
            if (route.name === "Mensajes" && unreadCount > 0) {
              return (
                <View>
                  <Ionicons name={iconName as any} size={23} color={color} />
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

          // Colores activos/inactivos
          tabBarActiveTintColor: isWhiteBackground ? "black" : "white",
          tabBarInactiveTintColor: "gray",

          tabBarStyle: hideBottomTabs
            ? { display: "none" }
            : {
                backgroundColor: isWhiteBackground ? "white" : "black",
                borderTopWidth: 0,
                paddingTop: 4,
                paddingBottom: bottomPad,
              },

          tabBarLabelStyle: {
            marginTop: -4,
            fontSize: 10,
            fontFamily: fonts.bold,
          },
          headerShown: false,
        };
      }}
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
            loadMore={loadMore}
            loadingMore={loadingMore}
            hasMore={hasMore}
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
        name="Crear"
        component={CameraScreen}
        initialParams={{ onTabChange }}
        options={{ tabBarLabel: () => null }}
      />
      <Tab.Screen
        name="Mensajes"
        component={NotificationsScreen}
        initialParams={{ onTabChange }}
      />
      <Tab.Screen name="Perfil">
        {(props) => <ProfileScreen {...props} onTabChange={onTabChange} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
