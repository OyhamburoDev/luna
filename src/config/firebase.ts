import { getFirestore } from "firebase/firestore";
import { app } from "./auth"; // <— usa la app ya inicializada

export const db = getFirestore(app);
