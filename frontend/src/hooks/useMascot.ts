import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { setConfig, setEmotion, setTyping, recordInteraction } from '@/store/slices/mascotSlice';
import api from '@/services/api';
import toast from 'react-hot-toast';

interface MascotConfig {
  name: string;
  tagline: string;
  primary_color: string;
  secondary_color: string;
  avatar_style: string;
  personality_traits: string[];
  use_emojis: boolean;
  emoji_frequency: string;
  greetings: string[];
  farewell_messages: string[];
  encouragement_phrases: string[];
  enable_animations: boolean;
  animation_speed: string;
}

export const useMascotConfig = () => {
  const dispatch = useDispatch();
  
  return useQuery({
    queryKey: ['mascot-config'],
    queryFn: async () => {
      const response = await api.get<MascotConfig>('/api/v1/mascot/config/current/');
      dispatch(setConfig(response));
      return response;
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

export const useUpdateMascotConfig = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  
  return useMutation({
    mutationFn: async (config: Partial<MascotConfig>) => {
      const response = await api.patch<MascotConfig>('/api/v1/mascot/config/current/', config);
      return response;
    },
    onSuccess: (data) => {
      dispatch(setConfig(data));
      queryClient.invalidateQueries({ queryKey: ['mascot-config'] });
      toast.success('Mascot configuration updated!');
    },
    onError: () => {
      toast.error('Failed to update mascot configuration');
    },
  });
};

export const useMascotGreeting = () => {
  const dispatch = useDispatch();
  
  return useMutation({
    mutationFn: async () => {
      const response = await api.post<{
        message: string;
        emotion: string;
        animation: string;
      }>('/api/v1/mascot/config/get_greeting/');
      return response;
    },
    onSuccess: (data) => {
      dispatch(setEmotion(data.emotion as any));
      dispatch(recordInteraction());
    },
  });
};

export const useMascotChat = () => {
  const dispatch = useDispatch();
  const mascotState = useSelector((state: RootState) => state.mascot);
  
  const sendMessage = async (message: string) => {
    dispatch(setTyping(true));
    dispatch(setEmotion('thinking'));
    
    try {
      // Simulate API call to chatbot engine
      const response = await api.post('/api/v1/chatbot/message/', {
        message,
        context: {
          emotion: mascotState.currentEmotion,
          interaction_count: mascotState.interactionCount,
        },
      });
      
      dispatch(setEmotion(response.emotion || 'helpful'));
      dispatch(recordInteraction());
      
      return response;
    } catch (error) {
      dispatch(setEmotion('thinking'));
      toast.error('Failed to send message');
      throw error;
    } finally {
      dispatch(setTyping(false));
    }
  };
  
  return {
    sendMessage,
    isTyping: mascotState.isTyping,
    currentEmotion: mascotState.currentEmotion,
  };
};

export const useMascotAnalytics = () => {
  return useQuery({
    queryKey: ['mascot-analytics'],
    queryFn: async () => {
      const response = await api.get('/api/v1/mascot/interactions/analytics/');
      return response;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};