import { PetPost } from "../types/petPots";

export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Register: undefined;
  PetRegister: undefined;
  AdoptionFormPet: {
    petId: string;
    petName: string;
    ownerId: string;
    ownerName: string;
    ownerEmail?: string;
  };
  PetSwipe: { pet: PetPost };
  PetDetail: { pet: PetPost };
  Perfil: undefined;
  Swipe: { screen?: string; mostrarConfetti?: boolean } | undefined;
  NotificationDetail: undefined;

  CreatePost: {
    media: {
      uri: string;
      width?: number;
      height?: number;
    };
    type: "photo" | "video";
  };
};
