'use client';

import React, { useState, useEffect } from 'react';
import { CinematicIntro } from '@/components/cinematic/CinematicIntro';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { HomeHero } from '@/components/home/HomeHero';
import { AboutSection } from '@/components/home/AboutSection';
import { EmploymentHub } from '@/components/modules/EmploymentHub';
import { CompanyDirectory } from '@/components/modules/CompanyDirectory';
import { SkillShowcase } from '@/components/modules/SkillShowcase';
import { BusinessHub } from '@/components/modules/BusinessHub';
import { OpportunityNetwork } from '@/components/modules/OpportunityNetwork';
import { HindsightInspector } from '@/components/memory/HindsightInspector';
import { JarvisOrb } from '@/components/jarvis/JarvisOrb';
import { JarvisPanel } from '@/components/jarvis/JarvisPanel';
import { AuthModal } from '@/components/auth/AuthModal';

export default function Home() {
  const [showIntro, setShowIntro] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('home');
  const [isJarvisOpen, setIsJarvisOpen] = useState<boolean>(false);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [authInitialMode, setAuthInitialMode] = useState<'signin' | 'signup'>('signin');
  const [currentLanguage, setCurrentLanguage] = useState<'hi' | 'en' | 'hinglish'>('hi');

  // Check if session has already dismissed intro
  useEffect(() => {
    try {
      const hasVisited = sessionStorage.getItem('kaamsetu_visited_session');
      if (hasVisited === 'true') {
        setShowIntro(false);
      }
    } catch {}
  }, []);

  const handleEnterApp = () => {
    try {
      sessionStorage.setItem('kaamsetu_visited_session', 'true');
    } catch {}
    setShowIntro(false);
  };

  const handleReplayIntro = () => {
    setShowIntro(true);
  };

  const handleOpenAuth = (mode: 'signin' | 'signup' = 'signin') => {
    setAuthInitialMode(mode);
    setIsAuthOpen(true);
  };

  const handleNavigate = (tabKey: string, searchParams?: { keyword?: string; location?: string }) => {
    setActiveTab(tabKey);
    // Smooth scroll to top of page
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNavigateFromJarvis = (moduleKey: string) => {
    if (
      moduleKey === 'home' ||
      moduleKey === 'jobs' ||
      moduleKey === 'directory' ||
      moduleKey === 'showcase' ||
      moduleKey === 'business_hub' ||
      moduleKey === 'opportunities' ||
      moduleKey === 'memory' ||
      moduleKey === 'about'
    ) {
      setActiveTab(moduleKey === 'business_hub' ? 'business' : moduleKey);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#050608] text-white selection:bg-[#FF6B00] selection:text-black">
      {/* 1. Cinematic Opening Screen (Auto-advances in ~4.5s or on user action) */}
      {showIntro && (
        <CinematicIntro
          onEnter={handleEnterApp}
          onOpenAuth={() => handleOpenAuth('signin')}
        />
      )}

      {/* 2. Top Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={(tab) => setActiveTab(tab)}
        onReplayIntro={handleReplayIntro}
        onOpenAuth={handleOpenAuth}
        currentLanguage={currentLanguage}
        onChangeLanguage={(lang) => setCurrentLanguage(lang)}
      />

      {/* 3. Main Application Modules */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <HomeHero
            onNavigate={handleNavigate}
            onOpenAuth={handleOpenAuth}
            onOpenJarvis={() => setIsJarvisOpen(true)}
          />
        )}
        {activeTab === 'jobs' && <EmploymentHub />}
        {activeTab === 'directory' && <CompanyDirectory />}
        {activeTab === 'showcase' && <SkillShowcase />}
        {activeTab === 'business' && <BusinessHub />}
        {activeTab === 'opportunities' && <OpportunityNetwork />}
        {activeTab === 'memory' && <HindsightInspector />}
        {activeTab === 'about' && <AboutSection />}
      </main>

      {/* 4. Footer */}
      <Footer />

      {/* 5. KAAMSETU JARVIS Floating Assistant & Panel */}
      <JarvisOrb
        isOpen={isJarvisOpen}
        onClick={() => setIsJarvisOpen(!isJarvisOpen)}
      />

      <JarvisPanel
        isOpen={isJarvisOpen}
        onClose={() => setIsJarvisOpen(false)}
        onNavigateModule={handleNavigateFromJarvis}
      />

      {/* 6. Supabase Authentication Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        initialMode={authInitialMode}
        preferredLanguage={currentLanguage}
      />
    </div>
  );
}
