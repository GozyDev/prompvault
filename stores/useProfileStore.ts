import { create } from "zustand";

import { Profile } from "@/lib/type";

interface ProfileStore {
  profile: Profile | null;
  setProfileStore: (data: Profile) => void;
  updateProfile: (newData: Partial<Profile>) => void;
}

const useProfileStore = create<ProfileStore>((set) => ({
  profile: null,
  setProfileStore: (data) => set({ profile: data }),
  updateProfile: (newData) =>
    set((state) => ({
      profile: state.profile ? { ...state.profile, ...newData } : null, // stay null if profile is not set
    })),
}));

export default useProfileStore;
