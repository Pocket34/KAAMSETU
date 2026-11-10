'use client';

import React from 'react';
import { ShieldCheck, Heart, Users, Target, CheckCircle2, Lock } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 animate-in fade-in duration-300">
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[#FF6B00]/15 text-[#FF8F3D] border border-[#FF6B00]/30">
          Our Foundation & Philosophy
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-white">
          About KAAMSETU
        </h1>
        <p className="text-sm sm:text-base text-zinc-300 max-w-2xl mx-auto italic">
          &ldquo;Talent deserves an opportunity.&rdquo;
        </p>
      </div>

      {/* Core Principles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-zinc-950 border border-white/10 space-y-3">
          <div className="p-3 w-fit rounded-2xl bg-[#FF6B00]/15 text-[#FF8F3D]">
            <Target className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Equal Economic Dignity</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Economic circumstance must never bound human potential. We build tools that serve daily-wage workers and experienced corporate professionals with equal respect and priority.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-zinc-950 border border-white/10 space-y-3">
          <div className="p-3 w-fit rounded-2xl bg-emerald-500/15 text-emerald-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Absolute Sourcing Truth</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Zero fabricated job listings, zero mock HR contacts, and zero fake success metrics. Every opportunity is cited with its verifiable source URL and audit timestamp.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-zinc-950 border border-white/10 space-y-3">
          <div className="p-3 w-fit rounded-2xl bg-indigo-500/15 text-indigo-400">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Privacy & Consent First</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Workers retain 100% control over their data, phone visibility, and Hindsight AI memory. We never share contacts or clone voices without explicit user permission.
          </p>
        </div>
      </div>

      {/* Detailed Manifesto */}
      <div className="p-8 rounded-3xl bg-zinc-950 border border-white/10 space-y-4">
        <h2 className="text-xl font-bold text-white">Why KAAMSETU Was Created</h2>
        <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
          Across India, millions of master artisans, electricians, tailors, carpenters, and aspiring entrepreneurs possess high technical capability but lack the capital to rent an expensive physical storefront or pay brokerage fees.
        </p>
        <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
          KAAMSETU serves as the bridge (*Setu*) between this immense human talent and verified economic opportunities—whether that is government apprenticeships, micro-credit lines like Mudra and PM Vishwakarma, or direct local customer discovery.
        </p>
      </div>
    </div>
  );
};
