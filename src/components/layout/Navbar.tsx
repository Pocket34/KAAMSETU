'use client';

import React, { useState } from 'react';
import {
  Globe,
  User,
  LogIn,
  UserPlus,
  Play,
  Briefcase,
  Store,
  Compass,
  Brain,
  Info,
  Menu,
  X,
  Sparkles
} from 'lucide-react';
import { soundEngine } from '@/lib/audio';

interface NavbarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onReplayIntro: () => void;
  onOpenAuth: (mode?: 'signin' | 'signup') => void;
  currentLanguage: 'hi' | 'en' | 'hinglish';
  onChangeLanguage: (lang: 'hi' | 'en' | 'hinglish') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  onReplayIntro,
  onOpenAuth,
  currentLanguage,
  onChangeLanguage,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { key: 'home', label: currentLanguage === 'hi' ? 'होम' : 'Home' },
    { key: 'jobs', label: currentLanguage === 'hi' ? 'नौकरियां' : 'Find Jobs' },
    { key: 'showcase', label: currentLanguage === 'hi' ? 'हुनर' : 'Explore Skills' },
    { key: 'business', label: currentLanguage === 'hi' ? 'दुकान' : 'Business Hub' },
    { key: 'opportunities', label: currentLanguage === 'hi' ? 'योजनाएं' : 'Opportunities' },
    { key: 'memory', label: 'Hindsight AI', isBadge: true },
    { key: 'about', label: currentLanguage === 'hi' ? 'परिचय' : 'About' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#050608]/95 backdrop-blur-2xl border-b border-white/10 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Logo */}
        <div
          onClick={() => {
            soundEngine.playClick();
            onSelectTab('home');
          }}
          className="flex items-center gap-3 cursor-pointer group shrink-0"
        >
          {/* Logo Icon */}
          <div className="relative w-10 h-10 flex items-center justify-center rounded-2xl bg-gradient-to-tr from-[#FF6B00] via-[#FF8F3D] to-[#E5A93C] p-0.5 shadow-[0_0_20px_rgba(255,107,0,0.4)] group-hover:shadow-[0_0_30px_rgba(255,107,0,0.7)] transition-all">
            <div className="w-full h-full bg-[#090B10] rounded-[14px] flex items-center justify-center">
              <span className="text-xl font-black text-[#FF8F3D]">K</span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-wider text-white">
                KAAM<span className="text-[#FF8F3D]">SETU</span>
              </span>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-[#FF6B00]/20 text-[#FF8F3D] border border-[#FF6B00]/40 tracking-wider hidden sm:inline-block">
                OFFICIAL
              </span>
            </div>
            <p className="text-[10px] text-zinc-400 font-semibold tracking-wider uppercase hidden md:block">
              Talent Deserves An Opportunity
            </p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <button
              key={link.key}
              onClick={() => {
                soundEngine.playClick();
                onSelectTab(link.key);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold tracking-wide transition-all cursor-pointer ${
                activeTab === link.key
                  ? 'bg-gradient-to-r from-[#FF6B00]/25 to-[#E5A93C]/15 text-white border border-[#FF6B00]/60 shadow-[0_0_15px_rgba(255,107,0,0.25)]'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>{link.label}</span>
              {link.isBadge && (
                <span className="ml-1.5 px-1.5 py-0.5 rounded-full text-[9px] bg-indigo-500/25 text-indigo-300 border border-indigo-500/40">
                  Memory
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Right Actions: Language, Replay, Login & Sign Up */}
        <div className="hidden sm:flex items-center gap-2.5">
          {/* Language Selector */}
          <div className="relative flex items-center bg-zinc-900/90 border border-white/10 rounded-full px-2.5 py-1 text-xs text-zinc-300">
            <Globe className="w-3.5 h-3.5 mr-1.5 text-zinc-400" />
            <select
              value={currentLanguage}
              onChange={(e) => onChangeLanguage(e.target.value as any)}
              className="bg-transparent text-xs text-zinc-200 focus:outline-none cursor-pointer pr-1"
            >
              <option value="en" className="bg-zinc-950 text-white">English</option>
              <option value="hi" className="bg-zinc-950 text-white">हिंदी</option>
              <option value="hinglish" className="bg-zinc-950 text-white">Hinglish</option>
            </select>
          </div>

          {/* Replay Intro Action */}
          <button
            onClick={() => {
              soundEngine.playClick();
              onReplayIntro();
            }}
            title="Replay Cinematic Intro"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-zinc-300 hover:text-white transition-all cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 text-[#FF8F3D]" />
            <span className="hidden md:inline">Replay Intro</span>
          </button>

          {/* Login Button */}
          <button
            onClick={() => {
              soundEngine.playClick();
              onOpenAuth('signin');
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-white/20 text-xs font-bold text-white transition-all cursor-pointer"
          >
            <LogIn className="w-3.5 h-3.5 text-[#FF8F3D]" />
            <span>Login</span>
          </button>

          {/* Sign Up Button */}
          <button
            onClick={() => {
              soundEngine.playClick();
              onOpenAuth('signup');
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-[#FF6B00] to-[#FF8F3D] hover:brightness-110 text-xs font-black text-black tracking-wide uppercase transition-all shadow-md shadow-[#FF6B00]/25 cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Sign Up</span>
          </button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-zinc-900 border border-white/10 text-zinc-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden px-4 pt-3 pb-5 bg-zinc-950 border-b border-white/10 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((link) => (
              <button
                key={link.key}
                onClick={() => {
                  soundEngine.playClick();
                  onSelectTab(link.key);
                  setMobileMenuOpen(false);
                }}
                className={`p-3 rounded-xl text-left text-xs font-bold ${
                  activeTab === link.key
                    ? 'bg-[#FF6B00]/20 text-white border border-[#FF6B00]/50'
                    : 'text-zinc-300 bg-zinc-900/60'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs gap-2">
            <button
              onClick={() => {
                onReplayIntro();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-1 text-zinc-300 text-xs"
            >
              <Play className="w-3.5 h-3.5 text-[#FF8F3D]" />
              <span>Replay Intro</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  onOpenAuth('signin');
                  setMobileMenuOpen(false);
                }}
                className="px-3 py-1.5 rounded-full bg-zinc-800 text-white font-bold"
              >
                Login
              </button>
              <button
                onClick={() => {
                  onOpenAuth('signup');
                  setMobileMenuOpen(false);
                }}
                className="px-3.5 py-1.5 rounded-full bg-[#FF6B00] text-black font-black uppercase text-[11px]"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
