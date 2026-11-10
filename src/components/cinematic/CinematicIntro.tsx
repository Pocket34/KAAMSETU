'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, ArrowRight, FastForward, LogIn, Compass, Volume2, VolumeX } from 'lucide-react';
import { ParticleCanvas } from './ParticleCanvas';
import { KaamsetuEmblem } from './KaamsetuEmblem';
import { getRandomQuote, ORIGINAL_QUOTES, Quote } from '@/data/quotes';
import { soundEngine } from '@/lib/audio';

interface CinematicIntroProps {
  onEnter: () => void;
  onOpenAuth: () => void;
}

export const CinematicIntro: React.FC<CinematicIntroProps> = ({ onEnter, onOpenAuth }) => {
  // Screen 1: Emblem + Brand + Tagline (0s)
  // Screen 2: Motivational Quote reveal (1.2s)
  // Screen 3: Prominent Actions (2.4s)
  // Auto-finish at ~4.5s so it never blocks the user!
  const [activeScreen, setActiveScreen] = useState<1 | 2 | 3>(1);
  const [isExiting, setIsExiting] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [quote, setQuote] = useState<Quote>(ORIGINAL_QUOTES[0]);
  const [userInteracted, setUserInteracted] = useState<boolean>(false);

  const autoFinishTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Pick random quote on client mount
    setQuote(getRandomQuote());

    // Respect reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setActiveScreen(3);
      return;
    }

    // Play subtle ambient sound safely
    try {
      soundEngine.playSubDrone();
    } catch {}

    // Timeline sequence
    const tScreen2 = setTimeout(() => {
      setActiveScreen((prev) => (prev < 2 ? 2 : prev));
      try {
        soundEngine.playChime();
      } catch {}
    }, 1200);

    const tScreen3 = setTimeout(() => {
      setActiveScreen(3);
    }, 2400);

    // Auto-advance into main app around 4.5 seconds so user is NEVER blocked
    autoFinishTimerRef.current = setTimeout(() => {
      if (!userInteracted) {
        handleEnterApp();
      }
    }, 5200);

    return () => {
      clearTimeout(tScreen2);
      clearTimeout(tScreen3);
      if (autoFinishTimerRef.current) clearTimeout(autoFinishTimerRef.current);
    };
  }, [userInteracted]);

  const handleEnterApp = () => {
    try {
      soundEngine.playEnterWhoosh();
    } catch {}
    setIsExiting(true);
    setTimeout(() => {
      onEnter();
    }, 500);
  };

  const handleLoginClick = () => {
    try {
      soundEngine.playClick();
    } catch {}
    setIsExiting(true);
    setTimeout(() => {
      onEnter();
      onOpenAuth();
    }, 500);
  };

  const handleSkip = () => {
    setUserInteracted(true);
    handleEnterApp();
  };

  const toggleSound = () => {
    setUserInteracted(true);
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    soundEngine.setMuted(nextMuted);
  };

  return (
    <div
      onMouseEnter={() => setUserInteracted(true)}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-between p-6 sm:p-10 bg-[#050608] text-white transition-all duration-700 select-none overflow-hidden ${
        isExiting ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* 1. Background Particle & Dynamic Light Dynamics */}
      <ParticleCanvas />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 50% 45%, rgba(255, 107, 0, 0.12) 0%, rgba(5, 6, 8, 0.94) 65%, #050608 100%)',
        }}
      />

      {/* Top Header Bar: Sound Toggle & Visible Skip Intro */}
      <div className="relative z-20 w-full max-w-6xl flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FF6B00] animate-ping" />
          <span className="text-xs uppercase tracking-widest text-[#FF8F3D] font-bold">
            KAAMSETU &bull; Cinematic Preview
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleSound}
            aria-label={isMuted ? 'Unmute Sound' : 'Mute Sound'}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-zinc-300 hover:text-white hover:bg-white/10 transition-all backdrop-blur-md cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-zinc-400" /> : <Volume2 className="w-4 h-4 text-[#FF8F3D]" />}
            <span className="hidden sm:inline">{isMuted ? 'Muted' : 'Sound On'}</span>
          </button>

          <button
            onClick={handleSkip}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-xs text-white font-semibold transition-all backdrop-blur-md cursor-pointer shadow-lg"
          >
            <span>Skip Intro</span>
            <FastForward className="w-3.5 h-3.5 text-[#FF8F3D]" />
          </button>
        </div>
      </div>

      {/* Main Center Stage: Large Emblem + Brand + Quote + Buttons */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-4xl w-full my-auto space-y-6">
        {/* SCREEN 1: Large Clearly Visible Emblem */}
        <div className="transition-all duration-700 transform">
          <KaamsetuEmblem size={210} glowIntensity={activeScreen >= 2 ? 'ultra' : 'high'} />
        </div>

        {/* Brand Name Typography — Bold, Luminous & Prominent */}
        <div className="space-y-2">
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-100 to-zinc-400 drop-shadow-[0_0_35px_rgba(255,107,0,0.6)]">
            KAAM<span className="text-[#FF8F3D]">SETU</span>
          </h1>

          <div className="flex items-center justify-center gap-2 sm:gap-3">
            <span className="h-[1.5px] w-8 sm:w-16 bg-gradient-to-r from-transparent to-[#FF6B00]" />
            <p className="text-xs sm:text-sm md:text-base font-extrabold tracking-[0.3em] text-[#FFE066] uppercase">
              Talent Deserves An Opportunity
            </p>
            <span className="h-[1.5px] w-8 sm:w-16 bg-gradient-to-l from-transparent to-[#FF6B00]" />
          </div>
        </div>

        {/* SCREEN 2: Motivational Quote Reveal (Hindi & English authentic reflection) */}
        <div
          className={`w-full max-w-2xl px-6 py-5 rounded-3xl bg-zinc-950/80 border border-white/15 shadow-[0_15px_40px_rgba(0,0,0,0.8)] backdrop-blur-xl transition-all duration-700 ${
            activeScreen >= 2 ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95 pointer-events-none'
          }`}
        >
          <div className="flex items-center justify-center gap-1.5 text-[#FF8F3D] mb-2 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ethical Foundation & Reflection</span>
          </div>

          <p className="text-base sm:text-xl text-zinc-100 font-semibold leading-relaxed italic">
            &ldquo;{quote.quote}&rdquo;
          </p>

          {quote.translation && (
            <p className="text-xs sm:text-sm text-zinc-400 mt-2 font-normal">
              {quote.translation}
            </p>
          )}
        </div>

        {/* SCREEN 3: Two Prominent Actions [ EXPLORE KAAMSETU ] & [ LOGIN / SIGN UP ] */}
        <div
          className={`flex flex-col sm:flex-row items-center justify-center gap-4 w-full pt-2 transition-all duration-700 ${
            activeScreen >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
          }`}
        >
          {/* Primary Action: Explore KAAMSETU */}
          <button
            onClick={handleEnterApp}
            className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full font-black text-sm tracking-widest uppercase text-black bg-gradient-to-r from-[#FF6B00] via-[#FF8F3D] to-[#E5A93C] shadow-[0_0_35px_rgba(255,107,0,0.65)] hover:shadow-[0_0_55px_rgba(255,107,0,0.95)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer overflow-hidden"
          >
            <Compass className="w-5 h-5 text-black" />
            <span>Explore KAAMSETU</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1.5" />
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/50 to-transparent" />
          </button>

          {/* Secondary Action: Login / Sign Up */}
          <button
            onClick={handleLoginClick}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full font-bold text-sm tracking-wider uppercase text-white bg-zinc-900/90 hover:bg-zinc-800 border border-white/20 hover:border-[#FF6B00]/60 shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer backdrop-blur-md"
          >
            <LogIn className="w-4 h-4 text-[#FF8F3D]" />
            <span>Login / Sign Up</span>
          </button>
        </div>
      </div>

      {/* Bottom Footer Credits & Progress Hint */}
      <div className="relative z-10 w-full max-w-6xl flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-2 border-t border-white/5 pt-4">
        <span>Empowering Employment, Skills & Micro-Enterprise across India</span>
        <span className="text-[11px] text-zinc-400">
          Entering automatically in a moment... or click <strong>Explore KAAMSETU</strong> above
        </span>
      </div>
    </div>
  );
};
