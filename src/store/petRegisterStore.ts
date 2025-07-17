import { create } from "zustand";

export type PetRegisterFormData = {
  name: string;
  species: string;
  breed?: string;
  age: number;
  gender: "macho" | "hembra";
  size: string;
  isVaccinated: boolean;
  isNeutered: boolean;
  hasMedicalConditions: boolean;
  healthInfo?: string;
  goodWithKids: boolean;
  goodWithOtherPets: boolean;
  friendlyWithStrangers?: string;
  needsWalks?: string;
  energyLevel?: string;
  description?: string;
  photoUrls?: {
    uri: string;
    offsetY?: number;
  }[];
};

export type PetRegisterApiData = Omit<PetRegisterFormData, "age"> & {
  age: number;
};

interface PetRegisterState {
  form: Partial<PetRegisterFormData>;
  setFormField: (key: keyof PetRegisterFormData, value: any) => void;
  resetForm: () => void;
}

export const usePetRegisterStore = create<PetRegisterState>((set) => ({
  form: {},
  setFormField: (key, value) =>
    set((state) => ({
      form: { ...state.form, [key]: value },
    })),
  resetForm: () => set({ form: {} }),
}));
