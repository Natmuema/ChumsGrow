import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMascotConfig } from '@/hooks/useMascot';

interface NurtyMascotProps {
  emotion?: 'happy' | 'excited' | 'thinking' | 'helpful' | 'celebrating';
  size?: 'small' | 'medium' | 'large';
  animate?: boolean;
  onClick?: () => void;
}

export const NurtyMascot: React.FC<NurtyMascotProps> = ({
  emotion = 'happy',
  size = 'medium',
  animate = true,
  onClick,
}) => {
  const [isBlinking, setIsBlinking] = useState(false);
  const { data: config } = useMascotConfig();
  
  const sizeMap = {
    small: 80,
    medium: 120,
    large: 200,
  };
  
  const mascotSize = sizeMap[size];
  const primaryColor = config?.primary_color || '#6366F1';
  const secondaryColor = config?.secondary_color || '#8B5CF6';
  
  // Blink animation
  useEffect(() => {
    if (!animate) return;
    
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150);
    }, 3000 + Math.random() * 2000);
    
    return () => clearInterval(blinkInterval);
  }, [animate]);
  
  const emotionVariants = {
    happy: { rotate: [0, -5, 5, 0], transition: { duration: 0.5 } },
    excited: { y: [0, -10, 0], transition: { duration: 0.3, repeat: 3 } },
    thinking: { rotate: [0, 10, 0], transition: { duration: 2, repeat: Infinity } },
    helpful: { scale: [1, 1.05, 1], transition: { duration: 1, repeat: Infinity } },
    celebrating: { 
      rotate: [0, -10, 10, -10, 10, 0],
      y: [0, -20, 0],
      transition: { duration: 0.5 }
    },
  };
  
  return (
    <motion.div
      className={`relative cursor-pointer select-none ${onClick ? 'hover:scale-110' : ''}`}
      style={{ width: mascotSize, height: mascotSize }}
      animate={animate ? emotionVariants[emotion] : {}}
      whileHover={onClick ? { scale: 1.1 } : {}}
      whileTap={onClick ? { scale: 0.95 } : {}}
      onClick={onClick}
    >
      <svg
        viewBox="0 0 200 200"
        width={mascotSize}
        height={mascotSize}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Robot Body */}
        <defs>
          <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={primaryColor} />
            <stop offset="100%" stopColor={secondaryColor} />
          </linearGradient>
          <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
            <feOffset dx="0" dy="4" result="offsetblur"/>
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.2"/>
            </feComponentTransfer>
            <feMerge>
              <feMergeNode/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Antenna */}
        <motion.g
          animate={animate ? { rotate: [-5, 5, -5] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ transformOrigin: '100px 40px' }}
        >
          <line
            x1="100"
            y1="40"
            x2="100"
            y2="20"
            stroke={primaryColor}
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle
            cx="100"
            cy="15"
            r="8"
            fill={secondaryColor}
            filter="url(#shadow)"
          />
          {/* Antenna light */}
          <motion.circle
            cx="100"
            cy="15"
            r="5"
            fill="#FFF"
            opacity="0.8"
            animate={animate ? { opacity: [0.3, 1, 0.3] } : {}}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.g>
        
        {/* Head */}
        <rect
          x="60"
          y="40"
          width="80"
          height="70"
          rx="20"
          ry="20"
          fill="url(#bodyGradient)"
          filter="url(#shadow)"
        />
        
        {/* Face Screen */}
        <rect
          x="70"
          y="50"
          width="60"
          height="50"
          rx="10"
          ry="10"
          fill="#1F2937"
          opacity="0.9"
        />
        
        {/* Eyes */}
        <AnimatePresence>
          {!isBlinking && (
            <>
              {/* Left Eye */}
              <motion.circle
                cx="85"
                cy="70"
                r="8"
                fill="#FFFFFF"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ duration: 0.1 }}
              />
              <motion.circle
                cx="87"
                cy="70"
                r="4"
                fill="#000000"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ duration: 0.1 }}
              />
              
              {/* Right Eye */}
              <motion.circle
                cx="115"
                cy="70"
                r="8"
                fill="#FFFFFF"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ duration: 0.1 }}
              />
              <motion.circle
                cx="113"
                cy="70"
                r="4"
                fill="#000000"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ duration: 0.1 }}
              />
            </>
          )}
        </AnimatePresence>
        
        {/* Mouth based on emotion */}
        {emotion === 'happy' && (
          <path
            d="M 85 85 Q 100 95 115 85"
            stroke="#FFFFFF"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
        )}
        {emotion === 'excited' && (
          <ellipse
            cx="100"
            cy="88"
            rx="12"
            ry="8"
            fill="#FFFFFF"
          />
        )}
        {emotion === 'thinking' && (
          <line
            x1="90"
            y1="88"
            x2="110"
            y2="88"
            stroke="#FFFFFF"
            strokeWidth="3"
            strokeLinecap="round"
          />
        )}
        {emotion === 'helpful' && (
          <path
            d="M 85 85 Q 100 92 115 85"
            stroke="#FFFFFF"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
        )}
        {emotion === 'celebrating' && (
          <path
            d="M 85 83 Q 100 98 115 83"
            stroke="#FFFFFF"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
        )}
        
        {/* Body */}
        <rect
          x="65"
          y="110"
          width="70"
          height="60"
          rx="15"
          ry="15"
          fill="url(#bodyGradient)"
          filter="url(#shadow)"
        />
        
        {/* Body Details */}
        <rect
          x="75"
          y="120"
          width="50"
          height="8"
          rx="4"
          ry="4"
          fill="#FFFFFF"
          opacity="0.3"
        />
        <rect
          x="75"
          y="135"
          width="35"
          height="8"
          rx="4"
          ry="4"
          fill="#FFFFFF"
          opacity="0.3"
        />
        <rect
          x="75"
          y="150"
          width="45"
          height="8"
          rx="4"
          ry="4"
          fill="#FFFFFF"
          opacity="0.3"
        />
        
        {/* Arms */}
        <motion.g
          animate={animate && emotion === 'celebrating' ? 
            { rotate: [-20, 20, -20] } : 
            {}
          }
          transition={{ duration: 0.3, repeat: Infinity }}
          style={{ transformOrigin: '55px 130px' }}
        >
          <rect
            x="45"
            y="120"
            width="20"
            height="40"
            rx="10"
            ry="10"
            fill={primaryColor}
            filter="url(#shadow)"
          />
          <circle
            cx="55"
            cy="165"
            r="10"
            fill={secondaryColor}
          />
        </motion.g>
        
        <motion.g
          animate={animate && emotion === 'celebrating' ? 
            { rotate: [20, -20, 20] } : 
            {}
          }
          transition={{ duration: 0.3, repeat: Infinity }}
          style={{ transformOrigin: '145px 130px' }}
        >
          <rect
            x="135"
            y="120"
            width="20"
            height="40"
            rx="10"
            ry="10"
            fill={primaryColor}
            filter="url(#shadow)"
          />
          <circle
            cx="145"
            cy="165"
            r="10"
            fill={secondaryColor}
          />
        </motion.g>
        
        {/* Legs/Wheels */}
        <ellipse
          cx="85"
          cy="175"
          rx="12"
          ry="8"
          fill={primaryColor}
          filter="url(#shadow)"
        />
        <ellipse
          cx="115"
          cy="175"
          rx="12"
          ry="8"
          fill={primaryColor}
          filter="url(#shadow)"
        />
        
        {/* Heart indicator for helpful emotion */}
        {emotion === 'helpful' && (
          <motion.path
            d="M 100 130 C 100 125, 95 120, 90 125 C 85 120, 80 125, 80 130 C 80 135, 90 145, 100 155 C 110 145, 120 135, 120 130 C 120 125, 115 120, 110 125 C 105 120, 100 125, 100 130 Z"
            fill="#EF4444"
            opacity="0.8"
            scale={0.3}
            animate={{ scale: [0.3, 0.35, 0.3] }}
            transition={{ duration: 1, repeat: Infinity }}
            style={{ transformOrigin: '100px 137px' }}
          />
        )}
      </svg>
      
      {/* Speech Bubble for celebrating */}
      {emotion === 'celebrating' && (
        <motion.div
          className="absolute -top-8 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
        >
          <span className="text-2xl">🎉</span>
        </motion.div>
      )}
    </motion.div>
  );
};