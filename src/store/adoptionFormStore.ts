import { create } from "zustand";
import type { AdoptionFormData } from "../types/forms";

type AdoptionFormStore = {
  form: Partial<Omit<AdoptionFormData, "petId">>;
  setFormField: (field: string, value: string | boolean | number) => void;
  resetForm: () => void;
};

export const useAdoptionFormStore = create<AdoptionFormStore>((set) => ({
  form: {},
  setFormField: (field, value) =>
    set((state) => ({
      form: { ...state.form, [field]: value },
    })),
  resetForm: () => set({ form: {} }),
}));
