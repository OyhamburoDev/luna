import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TabsNavigator from "./TabsNavigator";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import RedirectScreen from "../screens/RedirectScreen";
import AdoptionFormScreen from "../screens/AdoptionFormScreen";
import PetRegisterFormScreen from "../screens/PetRegisterFormScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Login" // 👈 Esto es lo clave
      screenOptions={{
        headerShown: false,
        headerStyle: {
          backgroundColor: "black",
        },
        headerTintColor: "#fff",
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
        name="Tabs"
        component={TabsNavigator}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
