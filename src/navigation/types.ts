import { PetPost } from "../types/petPots";

export type RootStackParamList = {
  Tabs: undefined;
  Login: undefined;
  Register: undefined;
  PetRegister: undefined;
  Adoption: { petName: string };
  PetSwipe: { pet: PetPost };
  PetDetail: { pet: PetPost };
};
