import { initializeApp, getApps, getApp } from "firebase/app";
import { firebaseConfig } from "./firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FirebaseAuth from "firebase/auth";

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// 🔥 Declarar el tipo explícitamente
let auth: FirebaseAuth.Auth;

try {
  auth = (FirebaseAuth as any).initializeAuth(app, {
    persistence: (FirebaseAuth as any).getReactNativePersistence(AsyncStorage),
  });
} catch (error: any) {
  if (error.code === "auth/already-initialized") {
    auth = (FirebaseAuth as any).getAuth(app);
  } else {
    throw error;
  }
}

export { app, auth };
