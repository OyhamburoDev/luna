import { create } from "zustand";

export type AdoptionFormData = {
  petId: string;
  petName: string;
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  hasPets: string;
  petTypes: string;
  housingType: string;
  housingDetails: string;
  hasYard: string;
  hasChildren: string;
  availableTime: string;
  reason: string;
  comments: string;
};

interface AdoptionRequestState {
  form: Partial<AdoptionFormData>;
  setFormField: (key: keyof AdoptionFormData, value: string) => void;
  resetForm: () => void;
}

export const useAdoptionRequestStore = create<AdoptionRequestState>((set) => ({
  form: {},
  setFormField: (key, value) =>
    set((state) => ({
      form: { ...state.form, [key]: value },
    })),
  resetForm: () => set({ form: {} }),
}));
