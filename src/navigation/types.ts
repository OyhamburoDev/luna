import { PetPost } from "../types/petPots";

export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Register: undefined;
  Swipe: undefined;
  PetRegister: undefined;
  AdoptionFormPet: { petId: string; petName: string };
  PetSwipe: { pet: PetPost };
  PetDetail: { pet: PetPost };
};
