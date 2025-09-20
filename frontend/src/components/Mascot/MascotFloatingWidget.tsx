import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Close } from '@mui/icons-material';
import { NurtyMascot } from './NurtyMascot';
import { MascotChat } from './MascotChat';

export const MascotFloatingWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(true);
  
  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setHasNewMessage(false);
    }
  };
  
  return (
    <>
      {/* Floating Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', duration: 0.5 }}
      >
        {!isOpen && (
          <motion.button
            onClick={toggleChat}
            className="relative bg-gradient-to-r from-mascot-primary to-mascot-secondary rounded-full p-3 shadow-lg hover:shadow-xl transition-shadow"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <NurtyMascot size="small" emotion="happy" animate={true} />
            
            {/* Notification Badge */}
            {hasNewMessage && (
              <motion.div
                className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full"
                initial={{ scale: 0 }}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.3, repeat: Infinity, repeatDelay: 2 }}
              />
            )}
            
            {/* Tooltip */}
            <motion.div
              className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-800 text-white text-sm rounded-lg whitespace-nowrap"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              Need help? Chat with Nurty! 🤖
              <div className="absolute bottom-0 right-4 transform translate-y-1/2 rotate-45 w-2 h-2 bg-gray-800" />
            </motion.div>
          </motion.button>
        )}
      </motion.div>
      
      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-6 right-6 z-50 w-96 h-[600px] max-h-[80vh]"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', duration: 0.3 }}
          >
            <div className="relative h-full">
              {/* Close Button */}
              <button
                onClick={toggleChat}
                className="absolute -top-2 -right-2 z-10 bg-white rounded-full p-1 shadow-lg hover:bg-gray-100 transition-colors"
              >
                <Close className="w-6 h-6 text-gray-600" />
              </button>
              
              {/* Chat Component */}
              <MascotChat />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};