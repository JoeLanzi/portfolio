import { create } from "zustand";
import type { ChatMessageItem } from "@/app/api/types";

interface ConversationState {
  chatMessages: ChatMessageItem[];
  lastResponseId?: string;

  setChatMessages: (items: ChatMessageItem[]) => void;
  setLastResponseId: (responseId?: string) => void;
  resetConversation: () => void;
}

export const useConversationStore = create<ConversationState>((set) => ({
  chatMessages: [],
  lastResponseId: undefined,
  setChatMessages: (items) => set({ chatMessages: items }),
  setLastResponseId: (responseId) => set({ lastResponseId: responseId }),
  resetConversation: () => {
    set({ chatMessages: [], lastResponseId: undefined });
  },
}));

export default useConversationStore;
