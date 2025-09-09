import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { app } from "./auth"; // <— usa la app ya inicializada

export const db = getFirestore(app);
export const storage = getStorage(app);
