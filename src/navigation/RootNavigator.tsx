import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";

import SwipeNavigator from "./SwipeNavigator";
import PetRegisterScreen from "../screens/PetRegisterFormScreen";
import AdoptionFormScreen from "../screens/AdoptionFormScreen";

import ChatsScreen from "../screens/ChatsScreen";

import { useAuthStore } from "../store/auth";

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Swipe: undefined;
  PetRegister: undefined;
  AdoptionFormPet: undefined;
  ChatsList: undefined; // ← Agregar
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return (
    <Stack.Navigator
      initialRouteName={isAuthenticated ? "Swipe" : "Login"}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Swipe" component={SwipeNavigator} />
      <Stack.Screen name="PetRegister" component={PetRegisterScreen} />
      <Stack.Screen name="AdoptionFormPet" component={AdoptionFormScreen} />
      <Stack.Screen name="ChatsList" component={ChatsScreen} />
    </Stack.Navigator>
  );
}
