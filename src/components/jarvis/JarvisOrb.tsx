'use client';

import React from 'react';
import { Bot, Mic, Sparkles } from 'lucide-react';
import { soundEngine } from '@/lib/audio';

interface JarvisOrbProps {
  isOpen: boolean;
  onClick: () => void;
}

export const JarvisOrb: React.FC<JarvisOrbProps> = ({ isOpen, onClick }) => {
  const handleClick = () => {
    soundEngine.playClick();
    onClick();
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <button
        onClick={handleClick}
        aria-label="Toggle KAAMSETU JARVIS Voice Assistant"
        className="group relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-[#0B0D11] via-[#14171F] to-[#1E232F] border-2 border-[#FF6B00]/60 shadow-[0_0_25px_rgba(255,107,0,0.45)] hover:shadow-[0_0_40px_rgba(255,107,0,0.75)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer overflow-hidden"
      >
        {/* Notification Ping Indicator */}
        <span className="absolute top-1 right-1 flex h-3 w-3 z-20">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF6B00] opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-[#FF4D00]" />
        </span>

        {/* Ambient Pulsating Glow Behind */}
        <div className="absolute inset-0 rounded-full bg-[#FF6B00]/25 blur-md animate-pulse pointer-events-none" />

        {/* Orbit Rings */}
        <div className="absolute inset-1 rounded-full border border-dashed border-[#FFE066]/40 animate-[spin_12s_linear_infinite] pointer-events-none" />

        {/* Inner Icon */}
        <div className="relative z-10 flex items-center justify-center text-[#FF8F3D] group-hover:text-white transition-colors">
          <Bot className="w-7 h-7 sm:w-8 sm:h-8" />
        </div>

        {/* Tooltip Pill */}
        <div className="absolute right-full mr-3.5 hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-950/90 border border-white/10 text-xs font-semibold text-white whitespace-nowrap shadow-xl backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          <Sparkles className="w-3.5 h-3.5 text-[#FF8F3D]" />
          <span>Talk with JARVIS</span>
        </div>
      </button>
    </div>
  );
};
