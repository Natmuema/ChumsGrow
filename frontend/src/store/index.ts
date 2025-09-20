import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import conversationReducer from './slices/conversationSlice';
import leadReducer from './slices/leadSlice';
import mascotReducer from './slices/mascotSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    conversations: conversationReducer,
    leads: leadReducer,
    mascot: mascotReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;