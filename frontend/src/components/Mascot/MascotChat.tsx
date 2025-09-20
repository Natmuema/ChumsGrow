import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mic, Paperclip, EmojiEmotions } from '@mui/icons-material';
import { NurtyMascot } from './NurtyMascot';
import { useMascotChat } from '@/hooks/useMascot';
import { format } from 'date-fns';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  emotion?: 'happy' | 'excited' | 'thinking' | 'helpful' | 'celebrating';
  quickReplies?: string[];
}

export const MascotChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hi! I'm Nurty 🤖, your AI shopping assistant! How can I help you today?",
      sender: 'bot',
      timestamp: new Date(),
      emotion: 'happy',
      quickReplies: ['Show products', 'Track order', 'Need help', 'Just browsing'],
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState<Message['emotion']>('happy');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { sendMessage } = useMascotChat();
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);
    setCurrentEmotion('thinking');
    
    // Simulate bot response
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: getBotResponse(inputValue),
        sender: 'bot',
        timestamp: new Date(),
        emotion: 'helpful',
        quickReplies: getQuickReplies(inputValue),
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
      setCurrentEmotion('helpful');
    }, 1500);
  };
  
  const getBotResponse = (input: string): string => {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('product') || lowerInput.includes('show')) {
      return "Great! Let me show you our bestsellers! We have amazing deals on summer clothing right now 🌟";
    } else if (lowerInput.includes('order') || lowerInput.includes('track')) {
      return "I can help you track your order! Please provide your order number or phone number 📦";
    } else if (lowerInput.includes('help')) {
      return "I'm here to help! You can ask me about products, orders, returns, or anything else about our store 😊";
    } else if (lowerInput.includes('price') || lowerInput.includes('cost')) {
      return "Our prices are very competitive! Most items are between $20-$100 with free shipping on orders over $50 💰";
    } else {
      return "That's interesting! Let me help you find exactly what you're looking for. What type of products are you interested in? 🛍️";
    }
  };
  
  const getQuickReplies = (input: string): string[] => {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('product')) {
      return ['T-Shirts', 'Dresses', 'Accessories', 'View all'];
    } else if (lowerInput.includes('order')) {
      return ['Enter order number', 'Check status', 'Contact support'];
    } else {
      return ['Browse products', 'Current deals', 'Customer service', 'FAQ'];
    }
  };
  
  const handleQuickReply = (reply: string) => {
    setInputValue(reply);
    handleSendMessage();
  };
  
  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-lg">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b bg-gradient-to-r from-mascot-primary to-mascot-secondary text-white rounded-t-xl">
        <NurtyMascot size="small" emotion={currentEmotion} animate={true} />
        <div className="flex-1">
          <h3 className="font-semibold text-lg">Nurty</h3>
          <p className="text-sm opacity-90">
            {isTyping ? 'Typing...' : 'Online'}
          </p>
        </div>
      </div>
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[70%] ${message.sender === 'user' ? 'order-2' : 'order-1'}`}>
                {message.sender === 'bot' && (
                  <div className="flex items-start gap-2 mb-2">
                    <NurtyMascot size="small" emotion={message.emotion} animate={false} />
                    <div className="flex-1">
                      <div className="bg-gray-100 rounded-2xl px-4 py-3">
                        <p className="text-gray-800">{message.content}</p>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 ml-2">
                        {format(message.timestamp, 'HH:mm')}
                      </p>
                    </div>
                  </div>
                )}
                
                {message.sender === 'user' && (
                  <div>
                    <div className="bg-mascot-primary text-white rounded-2xl px-4 py-3">
                      <p>{message.content}</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 mr-2 text-right">
                      {format(message.timestamp, 'HH:mm')}
                    </p>
                  </div>
                )}
                
                {/* Quick Replies */}
                {message.quickReplies && message.quickReplies.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-wrap gap-2 mt-2"
                  >
                    {message.quickReplies.map((reply, index) => (
                      <button
                        key={index}
                        onClick={() => handleQuickReply(reply)}
                        className="px-3 py-1 bg-white border border-mascot-primary text-mascot-primary rounded-full text-sm hover:bg-mascot-primary hover:text-white transition-colors"
                      >
                        {reply}
                      </button>
                    ))}
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {/* Typing Indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2"
          >
            <NurtyMascot size="small" emotion="thinking" animate={true} />
            <div className="bg-gray-100 rounded-2xl px-4 py-3">
              <div className="flex gap-1">
                <motion.div
                  className="w-2 h-2 bg-gray-400 rounded-full"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity, delay: 0 }}
                />
                <motion.div
                  className="w-2 h-2 bg-gray-400 rounded-full"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity, delay: 0.1 }}
                />
                <motion.div
                  className="w-2 h-2 bg-gray-400 rounded-full"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity, delay: 0.2 }}
                />
              </div>
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input */}
      <div className="p-4 border-t">
        <div className="flex items-center gap-2">
          <button className="p-2 text-gray-500 hover:text-mascot-primary transition-colors">
            <Paperclip />
          </button>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-mascot-primary"
          />
          <button className="p-2 text-gray-500 hover:text-mascot-primary transition-colors">
            <EmojiEmotions />
          </button>
          <button className="p-2 text-gray-500 hover:text-mascot-primary transition-colors">
            <Mic />
          </button>
          <button
            onClick={handleSendMessage}
            className="p-2 bg-mascot-primary text-white rounded-full hover:bg-mascot-secondary transition-colors"
          >
            <Send />
          </button>
        </div>
      </div>
    </div>
  );
};