import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import TabsNavigator from "./TabsNavigator";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import RedirectScreen from "../screens/RedirectScreen";
import AdoptionFormScreen from "../screens/AdoptionFormScreen";
import PetRegisterFormScreen from "../screens/PetRegisterFormScreen";
import PetSwipeScreen from "../screens/PetSwipeScreen";
import HomeScreen from "../screens/HomeScreen";

import { useAuthStore } from "../store/auth";

export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Register: undefined;
  Redirect: undefined;
  Adoption: undefined;
  PetRegister: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <Stack.Navigator
      initialRouteName={isAuthenticated ? "Home" : "Login"}
      screenOptions={{
        headerShown: false,
        headerStyle: {
          backgroundColor: "blue",
        },
        headerTintColor: "pink",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Redirect" component={RedirectScreen} />
      <Stack.Screen name="Adoption" component={AdoptionFormScreen} />
      <Stack.Screen name="PetRegister" component={PetRegisterFormScreen} />
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
