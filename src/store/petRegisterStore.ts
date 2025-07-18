import { create } from "zustand";

// Tipar el formulario de petRegister
export type PetRegisterFormData = {
  userId: string;
  petName: string;
  species: string;
  breed: string;
  age: string;
  size: string;
  gender: string;
  healthInfo: string;
  isVaccinated: string;
  isNeutered: string;
  hasMedicalConditions: string;
  medicalDetails: string;
  goodWithKids: string;
  goodWithOtherPets: string;
  friendlyWithStrangers: string;
  needsWalks: string;
  energyLevel: string;
  description: string;
  ownerContact: string;
  photoUrls: {
    uri: string;
    offsetY: number; // valor entre 0 (arriba) y 1 (abajo)
  }[];
};

// Nuevo tipo para la API (lo agregamos aquí para centralizar los tipos relacionados)
export type PetRegisterApiData = Omit<PetRegisterFormData, "age" | "petName"> & {
  age: number;
  isVaccinated: boolean;
  isNeutrered: boolean;
  goodWithKids:boolean;
  goodWithOtherPets:boolean;
  hasMedicalConditions:boolean;
  name:string
};

// Tipar las funciones o todo lo que va a tener petRegister
interface PetRegisterState {
  form: Partial<PetRegisterFormData>;
  setFormField: (key: keyof PetRegisterFormData, value: any) => void;
  resetForm: () => void;
}

// Armar las funciones, variales globales de zuztan
export const usePetRegisterStore = create<PetRegisterState>((set) => ({
  form: {},
  setFormField: (key, value) =>
    set((state) => ({
      form: { ...state.form, [key]: value },
    })),
  resetForm: () => set({ form: {} }),
}));
