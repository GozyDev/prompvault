// stores/usePromptStore.ts
import { create } from "zustand";
import { Prompt } from "@/lib/type";

type PromptStore = {
  prompts: Prompt[];
  setPrompts: (data: Prompt[]) => void;
  clearPrompts: () => void;
  updatePrompt: (id: string, newData: Partial<Prompt>) => void;
    setHasFetched: (value: boolean) => void;
     hasFetched: boolean;
};

export const usePromptStore = create<PromptStore>((set) => ({
  prompts: [],
  setPrompts: (data) => set({ prompts: data }),
  clearPrompts: () => set({ prompts: [] }),
  updatePrompt: (id, newData) =>
    set((state) => ({
      prompts: state.prompts.map((prompt) =>
        prompt.id === id ? { ...prompt, ...newData } : prompt
      ),
    })),
    setHasFetched: (value) => set({ hasFetched: value }),
      hasFetched:false
}));
