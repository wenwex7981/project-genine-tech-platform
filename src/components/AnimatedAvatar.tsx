"use client";

import React, { useEffect, useState } from 'react';

interface AnimatedAvatarProps {
  isSpeaking: boolean;
  className?: string;
}

export const AnimatedAvatar: React.FC<AnimatedAvatarProps> = ({ isSpeaking, className = "" }) => {
  const [mouthHeight, setMouthHeight] = useState(4);
  
  // Randomly animate mouth height when speaking
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isSpeaking) {
      interval = setInterval(() => {
        // Random height between 4 and 24 to simulate talking
        setMouthHeight(Math.random() * 20 + 4);
      }, 100); // Change mouth shape every 100ms
    } else {
      setMouthHeight(4); // Closed mouth
    }
    return () => clearInterval(interval);
  }, [isSpeaking]);

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Background Glow */}
      <div className={`absolute inset-0 bg-purple-500 rounded-full blur-2xl transition-all duration-500 ${isSpeaking ? 'opacity-40 animate-pulse' : 'opacity-10'}`}></div>
      
      <svg 
        viewBox="0 0 200 200" 
        className={`relative z-10 w-full h-full drop-shadow-2xl transition-transform duration-300 ${isSpeaking ? 'scale-105' : 'scale-100'}`}
      >
        <defs>
          <linearGradient id="headGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#e2e8f0" />
          </linearGradient>
          <linearGradient id="suitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
        </defs>

        {/* Suit/Shoulders */}
        <path d="M 40 200 C 40 140, 160 140, 160 200 Z" fill="url(#suitGrad)" />
        {/* Tie */}
        <path d="M 95 160 L 105 160 L 102 200 L 98 200 Z" fill="#6366f1" />
        {/* Shirt Collar */}
        <path d="M 80 150 L 100 165 L 120 150 L 100 170 Z" fill="#ffffff" />

        {/* Head */}
        <rect x="50" y="40" width="100" height="110" rx="30" fill="url(#headGrad)" stroke="#cbd5e1" strokeWidth="2" />
        
        {/* Ear Antennas */}
        <rect x="35" y="80" width="15" height="30" rx="5" fill="#94a3b8" />
        <rect x="150" y="80" width="15" height="30" rx="5" fill="#94a3b8" />
        
        {/* Screen/Face Area */}
        <rect x="65" y="60" width="70" height="70" rx="15" fill="#0f172a" />

        {/* Eyes (Blinking Animation applied via CSS) */}
        <g className="animate-blink">
          <circle cx="85" cy="85" r="8" fill="#38bdf8" className={isSpeaking ? "animate-pulse" : ""} />
          <circle cx="115" cy="85" r="8" fill="#38bdf8" className={isSpeaking ? "animate-pulse" : ""} />
        </g>

        {/* Mouth (Dynamic Height) */}
        <rect 
          x="80" 
          y={110 - (mouthHeight / 2)} 
          width="40" 
          height={mouthHeight} 
          rx={mouthHeight / 2} 
          fill="#38bdf8" 
          className="transition-all duration-75"
        />
      </svg>

      <style jsx>{`
        @keyframes blink {
          0%, 96%, 98% { opacity: 1; transform: scaleY(1); }
          97% { opacity: 0; transform: scaleY(0.1); }
        }
        .animate-blink {
          animation: blink 4s infinite;
          transform-origin: center 85px;
        }
      `}</style>
    </div>
  );
};
