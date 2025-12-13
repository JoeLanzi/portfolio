import { create } from "zustand";

interface ConversationState {
  chatMessages: any[];
  conversationItems: any[];

  setChatMessages: (items: any[]) => void;
  setConversationItems: (messages: any[]) => void;
  addChatMessage: (item: any) => void;
  addConversationItem: (message: any) => void;
  resetConversation: () => void;
}

export const useConversationStore = create<ConversationState>((set) => ({
  chatMessages: [],
  conversationItems: [],
  setChatMessages: (items) => {
    set({ chatMessages: items });
  },
  setConversationItems: (messages) => {
    set({ conversationItems: messages });
  },
  addChatMessage: (item) => {
    set((state) => ({ chatMessages: [...state.chatMessages, item] }));
  },
  addConversationItem: (message) => {
    set((state) => ({ conversationItems: [...state.conversationItems, message] }));
  },
  resetConversation: () => {
    set({ chatMessages: [], conversationItems: [] });
  },
}));

export default useConversationStore;