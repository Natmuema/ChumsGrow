import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface MascotConfig {
  name: string;
  tagline: string;
  primary_color: string;
  secondary_color: string;
  avatar_style: 'robot' | 'animal' | 'character' | 'abstract';
  personality_traits: string[];
  use_emojis: boolean;
  emoji_frequency: 'never' | 'rarely' | 'sometimes' | 'often' | 'always';
  greetings: string[];
  farewell_messages: string[];
  encouragement_phrases: string[];
  enable_animations: boolean;
  animation_speed: 'slow' | 'normal' | 'fast';
}

interface MascotState {
  config: MascotConfig | null;
  currentEmotion: 'happy' | 'excited' | 'thinking' | 'helpful' | 'celebrating';
  isTyping: boolean;
  lastInteraction: Date | null;
  interactionCount: number;
}

const initialState: MascotState = {
  config: null,
  currentEmotion: 'happy',
  isTyping: false,
  lastInteraction: null,
  interactionCount: 0,
};

const mascotSlice = createSlice({
  name: 'mascot',
  initialState,
  reducers: {
    setConfig: (state, action: PayloadAction<MascotConfig>) => {
      state.config = action.payload;
    },
    setEmotion: (state, action: PayloadAction<MascotState['currentEmotion']>) => {
      state.currentEmotion = action.payload;
    },
    setTyping: (state, action: PayloadAction<boolean>) => {
      state.isTyping = action.payload;
    },
    recordInteraction: (state) => {
      state.lastInteraction = new Date();
      state.interactionCount += 1;
    },
    resetMascot: (state) => {
      state.currentEmotion = 'happy';
      state.isTyping = false;
    },
  },
});

export const { setConfig, setEmotion, setTyping, recordInteraction, resetMascot } = mascotSlice.actions;
export default mascotSlice.reducer;