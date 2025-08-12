import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

export const firebaseConfig = {
  apiKey: "AIzaSyARU21WXe2PXo7oTLRbxK097QJpn-2Kj9Q",
  authDomain: "luna-18810.firebaseapp.com",
  projectId: "luna-18810",
  storageBucket: "luna-18810.firebasestorage.app",
  messagingSenderId: "671975384028",
  appId: "1:671975384028:web:fc40ca57b617df51272519",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// getAuth maneja la persistencia automáticamente en React Native
// const auth = getAuth(app);

export const db = getFirestore(app);

// export { auth };
// export default app;
