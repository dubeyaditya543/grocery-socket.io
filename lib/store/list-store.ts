import { create } from "zustand";

export interface List {
  _id: string;
  listName: string;
  createdBy: {
    fullName: string;
    avatarUrl: string;
  };
}

interface ListStore {
  currentList: List | null;
  setCurrentList: (list: List) => void;
}

export const useListStore = create<ListStore>((set) => ({
  currentList: null,
  setCurrentList: (list: List) => {
    set(() => ({
      currentList: list,
    }));
  },
}));
