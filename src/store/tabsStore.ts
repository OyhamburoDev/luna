import { create } from "zustand";

interface TabsState {
  hideBottomTabs: boolean;
  setHideBottomTabs: (hide: boolean) => void;
}

export const useTabsStore = create<TabsState>((set) => ({
  hideBottomTabs: false,
  setHideBottomTabs: (hide) => set({ hideBottomTabs: hide }),
}));
