import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import SwipeNavigator from "./src/navigation/SwipeNavigator";
import { StatusBar } from "react-native"; // 👈 importá StatusBar
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import RootNavigator from "./src/navigation/RootNavigator";
import { navigationRef } from "./src/navigation/NavigationService";

import { AuthModalProvider } from "./src/contexts/AuthModalContext";
import { AuthModal } from "./src/components/AuthModal";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthModalProvider>
          <NavigationContainer ref={navigationRef}>
            <RootNavigator />
          </NavigationContainer>
          <AuthModal />
        </AuthModalProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
