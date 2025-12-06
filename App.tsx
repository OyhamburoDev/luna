import React, { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";

import RootNavigator from "./src/navigation/RootNavigator";
import { navigationRef } from "./src/navigation/NavigationService";

import {
  useFonts,
  Nunito_400Regular,
  Nunito_600SemiBold,
  Nunito_700Bold,
} from "@expo-google-fonts/nunito";

import { AuthModalProvider } from "./src/contexts/AuthModalContext";
import { AuthModal } from "./src/components/AuthModal";
import { MuteProvider } from "./src/contexts/MuteContext";

/**  imports para sincronizar sesión */
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./src/config/auth";
import { useAuthStore } from "./src/store/auth";
import { useUserStore } from "./src/store/userStore";
import { ensureUserDoc } from "./src/api/userProfileService";

export default function App() {
  const [fontsLoaded] = useFonts({
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold,
  });

  /**  al montar la app, Firebase es la verdad → sincronizamos stores */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      const loginStore = useAuthStore.getState().login;
      const logoutStore = useAuthStore.getState().logout;
      const updateUser = useUserStore.getState().updateUserInfo;
      const resetUserInfo = useUserStore.getState().resetUserInfo;

      if (fbUser) {
        const token = await fbUser.getIdToken().catch(() => null);
        const user = { uid: fbUser.uid, email: fbUser.email ?? "" };

        loginStore(user, token ?? "");
        updateUser({ uid: user.uid, email: user.email });

        await ensureUserDoc(user.uid, user.email);
      } else {
        logoutStore();
        resetUserInfo();
      }
    });
    return () => unsub();
  }, []);

  if (!fontsLoaded) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "black",
        }}
      >
        <ActivityIndicator size="large" color="#667eea" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthModalProvider>
          <MuteProvider>
            <NavigationContainer ref={navigationRef}>
              <>
                <RootNavigator />
                <AuthModal />
              </>
            </NavigationContainer>
          </MuteProvider>
        </AuthModalProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
