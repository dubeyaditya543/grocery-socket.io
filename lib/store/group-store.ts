import { create } from "zustand";

export interface Group {
  _id: string;
  groupName: string;
  members: Array<{
    fullName: string;
    avatarUrl: string;
  }>;
  createdBy: {
    fullName: string;
    avatarUrl: string;
  };
  joinCode: string;
}

interface GroupStore {
  currentGroup: Group | null;
  setGroup: (group: Group) => void;
}

export const useGroupStore = create<GroupStore>((set) => ({
  currentGroup: null,
  setGroup: (group: Group) => {
    set(() => ({
      currentGroup: group,
    }));
  },
}));
