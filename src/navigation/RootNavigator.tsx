import React, { useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import ProfileScreen from "../screens/ProfileScreen";
import CreatePostScreen from "../screens/CreatePostScreen";

import SwipeNavigator from "./SwipeNavigator";
import PetRegisterScreen from "../screens/PetRegisterFormScreen";
import AdoptionFormScreen from "../screens/AdoptionFormScreen";

import ChatsScreen from "../screens/ChatsScreen";
import { useNavigation } from "@react-navigation/native";

export type RootStackParamList = {
  Swipe: undefined;
  PetRegister: undefined;
  CreatePost: {
    media: {
      uri: string;
      width?: number;
      height?: number;
    };
    type: "photo" | "video";
  };
  AdoptionFormPet: undefined;
  ChatsList: undefined; // ← Agregar
  Perfil: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator
      initialRouteName={"Swipe"}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Swipe" component={SwipeNavigator} />
      {/* <Stack.Screen name="PetRegister" component={PetRegisterScreen} /> */}
      <Stack.Screen
        name="CreatePost"
        component={CreatePostScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="AdoptionFormPet" component={AdoptionFormScreen} />
      <Stack.Screen name="ChatsList" component={ChatsScreen} />
      <Stack.Screen name="Perfil" component={ProfileScreen} />
    </Stack.Navigator>
  );
}
