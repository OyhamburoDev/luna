import { create } from "zustand";

interface ConfettiStore {
  mostrarConfetti: boolean;
  confettiActive: boolean;
  marcarNuevoPost: () => void; // 👈 Esto es lo que necesitamos acá
  activarConfetti: () => void;
  desactivarConfetti: () => void;
  resetConfetti: () => void;
}

export const useConfettiStore = create<ConfettiStore>((set) => ({
  mostrarConfetti: false,
  confettiActive: false,

  marcarNuevoPost: () => set({ mostrarConfetti: true }), // 👈 Solo marca
  activarConfetti: () => set({ confettiActive: true }), // 👈 Este se usa después
  desactivarConfetti: () => set({ confettiActive: false }),
  resetConfetti: () => set({ mostrarConfetti: false, confettiActive: false }),
}));
