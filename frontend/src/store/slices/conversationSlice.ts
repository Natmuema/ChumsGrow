import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Message {
  id: string;
  content: string;
  sender_type: 'user' | 'bot' | 'agent';
  timestamp: string;
  is_read: boolean;
  mascot_emotion?: string;
}

interface Conversation {
  id: string;
  lead_id: string;
  lead_name: string;
  status: 'active' | 'paused' | 'completed' | 'transferred';
  started_at: string;
  last_message_at: string;
  total_messages: number;
  unread_count: number;
}

interface ConversationState {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  messages: Message[];
  loading: boolean;
  error: string | null;
}

const initialState: ConversationState = {
  conversations: [],
  activeConversation: null,
  messages: [],
  loading: false,
  error: null,
};

const conversationSlice = createSlice({
  name: 'conversations',
  initialState,
  reducers: {
    setConversations: (state, action: PayloadAction<Conversation[]>) => {
      state.conversations = action.payload;
    },
    setActiveConversation: (state, action: PayloadAction<Conversation>) => {
      state.activeConversation = action.payload;
    },
    setMessages: (state, action: PayloadAction<Message[]>) => {
      state.messages = action.payload;
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },
    updateConversation: (state, action: PayloadAction<Partial<Conversation> & { id: string }>) => {
      const index = state.conversations.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.conversations[index] = { ...state.conversations[index], ...action.payload };
      }
      if (state.activeConversation?.id === action.payload.id) {
        state.activeConversation = { ...state.activeConversation, ...action.payload };
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setConversations,
  setActiveConversation,
  setMessages,
  addMessage,
  updateConversation,
  setLoading,
  setError,
} = conversationSlice.actions;

export default conversationSlice.reducer;