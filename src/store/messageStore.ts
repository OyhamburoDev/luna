import { create } from "zustand";

type MessageStore = {
  unreadCount: number;
  setUnreadCount: (count: number) => void;
};

export const useMessageStore = create<MessageStore>((set) => ({
  unreadCount: 0,
  setUnreadCount: (count) => set({ unreadCount: count }),
}));
