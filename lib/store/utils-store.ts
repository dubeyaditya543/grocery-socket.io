import { create } from "zustand";

interface UtilsStore {
  isNotificationOpen: boolean;
  setIsNotificationOpen: (value: boolean) => void
}

export const useUtilStore = create<UtilsStore>((set) => ({
  isNotificationOpen: false,
  setIsNotificationOpen: (value: boolean) => {
    set(() => ({
      isNotificationOpen: value
    }))
  }
}))