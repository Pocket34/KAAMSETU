'use client';

import React, { useState } from 'react';
import {
  Search,
  MapPin,
  ArrowRight,
  Briefcase,
  Wrench,
  Users,
  Store,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  Bot,
  Package,
  Clock,
  Send,
  MessageSquare,
  Share2,
  Phone
} from 'lucide-react';
import { soundEngine } from '@/lib/audio';
import { VERIFIED_JOBS_REGISTRY, VERIFIED_OPPORTUNITIES_REGISTRY, VerifiedJob } from '@/services/jarvisTools';

interface HomeHeroProps {
  onNavigate: (tabKey: string, searchParams?: { keyword?: string; location?: string }) => void;
  onOpenAuth: (mode?: 'signin' | 'signup') => void;
  onOpenJarvis: () => void;
}

export const HomeHero: React.FC<HomeHeroProps> = ({
  onNavigate,
  onOpenAuth,
  onOpenJarvis,
}) => {
  const [jobKeyword, setJobKeyword] = useState('');
  const [jobLocation, setJobLocation] = useState('');
  const [selectedEnquiryStore, setSelectedEnquiryStore] = useState<string | null>(null);
  const [enquirySuccess, setEnquirySuccess] = useState(false);
  const [enquiryName, setEnquiryName] = useState('');
  const [enquiryPhone, setEnquiryPhone] = useState('');
  const [enquiryMsg, setEnquiryMsg] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundEngine.playClick();
    onNavigate('jobs', { keyword: jobKeyword, location: jobLocation });
  };

  const pillars = [
    {
      id: 'employment',
      icon: Briefcase,
      title: '1. Find Employment',
      desc: 'Browse verified Government, PSU, Apprenticeship, and private vacancies. Every listing includes verified source documentation and direct official application links.',
      ctaText: 'Browse All Openings',
      targetTab: 'jobs',
      badge: 'Zero Scam Policy',
    },
    {
      id: 'skills',
      icon: Wrench,
      title: '2. Showcase Your Skills',
      desc: 'Create your digital Rozgar Card. Perfect for electricians, tailors, carpenters, cooks, mechanics, and freelancers. Share your verified experience and pricing without rent.',
      ctaText: 'Build Skill Profile',
      targetTab: 'showcase',
      badge: 'Zero Shop Rent',
    },
    {
      id: 'customers',
      icon: Users,
      title: '3. Connect with Customers',
      desc: 'Receive direct customer enquiries for home repairs, craft goods, and services. Retain 100% of your earnings with zero middleman deductions.',
      ctaText: 'View Storefronts',
      targetTab: 'business',
      badge: 'Direct Orders',
    },
    {
      id: 'business',
      icon: Store,
      title: '4. Start Your Business',
      desc: 'Launch a zero-rent digital storefront. Showcase products, specify delivery areas, and access official credit schemes like PM Vishwakarma and Mudra.',
      ctaText: 'Launch Digital Dukaan',
      targetTab: 'business',
      badge: 'Instant Setup',
    },
  ];

  const sampleWorkers = [
    {
      id: 'wp-01',
      name: 'Rameshwar Kumar Sharma',
      trade: 'Master Electrician & Inverter Specialist',
      location: 'Aligarh, UP',
      exp: '12 Yrs Exp',
      rate: '₹600 / visit or ₹800 / day',
      skills: ['House Wiring', 'MCB Setup', 'Inverter Battery Repair', 'Solar PV'],
      verified: true,
    },
    {
      id: 'wp-02',
      name: 'Mohammad Farooq',
      trade: 'Master Locksmith & Precision Metal Craft',
      location: 'Aligarh, UP',
      exp: '18 Yrs Exp',
      rate: 'Custom Quote / Job-based',
      skills: ['Brass Lock Forging', 'High-Security Tumblers', 'Heritage Restoration'],
      verified: true,
    },
    {
      id: 'wp-03',
      name: 'Sunita Devi',
      trade: 'Master Tailor & Traditional Embroidery',
      location: 'Agra, UP',
      exp: '7 Yrs Exp',
      rate: '₹350 - ₹1,200 per piece',
      skills: ['Boutique Blouses', 'Zardozi Embroidery', 'Uniform Stitching'],
      verified: true,
    },
  ];

  const sampleStores = [
    {
      id: 'duk-01',
      name: 'Noor Heritage Brass Handcrafts',
      category: 'Handicrafts & Architectural Hardware',
      location: 'Aligarh, UP',
      coverage: 'Pan-India Delivery via Speed Post',
      items: [
        { name: 'Lion-Head Solid Brass Knocker', price: '₹650' },
        { name: 'Hand-Engraved 6-Lever Brass Padlock', price: '₹480' },
      ],
      desc: 'Direct artisan workshop crafting solid brass antique door knockers and vintage locks without showroom costs.',
    },
    {
      id: 'duk-02',
      name: 'Ganga Maati Eco Clay & Pottery Works',
      category: 'Terracotta & Kitchenware Utensils',
      location: 'Western UP / Delhi NCR',
      coverage: 'Local & Regional Delivery',
      items: [
        { name: '10-Litre Terracotta Matka', price: '₹320' },
        { name: 'Clay Handi Cookware Set (2 Pcs)', price: '₹550' },
      ],
      desc: 'Natural clay water pots, terracotta curd bowls, and cookware crafted directly on potter’s wheel.',
    },
  ];

  const handleEnquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!enquiryName || !enquiryPhone) return;
    soundEngine.playClick();
    setEnquirySuccess(true);
    setTimeout(() => {
      setEnquirySuccess(false);
      setSelectedEnquiryStore(null);
      setEnquiryName('');
      setEnquiryPhone('');
      setEnquiryMsg('');
    }, 2000);
  };

  return (
    <div className="space-y-24 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 sm:pt-20 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* Ambient Top Glow */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-80 rounded-full blur-3xl opacity-25 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, #FF6B00 0%, #E5A93C 40%, transparent 70%)',
          }}
        />

        <div className="relative z-10 max-w-4xl mx-auto space-y-6">
          {/* Mission Tagline Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FF6B00]/15 border border-[#FF6B00]/30 shadow-[0_0_15px_rgba(255,107,0,0.15)]">
            <span className="w-2 h-2 rounded-full bg-[#FF6B00] animate-pulse" />
            <span className="text-xs font-black uppercase tracking-wider text-[#FF8F3D]">
              KAAMSETU &bull; Talent Deserves An Opportunity
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.1]">
            Your Talent. Your Opportunity.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B00] via-[#FF8F3D] to-[#E5A93C] drop-shadow-[0_0_30px_rgba(255,107,0,0.4)]">
              Your Future.
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-base sm:text-xl text-zinc-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Find work, showcase your skills, connect with customers, and build your future — all in one place.
          </p>

          {/* Interactive Job Title & Location Search */}
          <form
            onSubmit={handleSearchSubmit}
            className="p-3 rounded-2xl sm:rounded-full bg-zinc-950/90 border border-white/15 shadow-2xl backdrop-blur-xl flex flex-col sm:flex-row items-center gap-2.5 max-w-3xl mx-auto"
          >
            {/* Job Title Input */}
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                value={jobKeyword}
                onChange={(e) => setJobKeyword(e.target.value)}
                placeholder="Job title or skill (e.g. Electrician, Carpenter, Next.js)..."
                className="w-full pl-11 pr-4 py-3 rounded-full bg-transparent text-white placeholder-zinc-500 text-xs sm:text-sm focus:outline-none"
              />
            </div>

            {/* Location Input */}
            <div className="relative w-full sm:w-60 border-t sm:border-t-0 sm:border-l border-white/10 pt-2 sm:pt-0 sm:pl-2">
              <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                value={jobLocation}
                onChange={(e) => setJobLocation(e.target.value)}
                placeholder="Location (e.g. Aligarh, Agra, UP)..."
                className="w-full pl-9 pr-3 py-3 rounded-full bg-transparent text-white placeholder-zinc-500 text-xs sm:text-sm focus:outline-none"
              />
            </div>

            {/* Find Jobs Button */}
            <button
              type="submit"
              className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-gradient-to-r from-[#FF6B00] to-[#FF8F3D] hover:brightness-110 text-black font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-[#FF6B00]/30 cursor-pointer whitespace-nowrap shrink-0"
            >
              Find Jobs
            </button>
          </form>

          {/* Action Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2 text-xs text-zinc-400">
            <span className="font-semibold text-zinc-300">Popular Trades:</span>
            <button
              onClick={() => onNavigate('jobs', { keyword: 'electrician' })}
              className="px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white transition-all cursor-pointer"
            >
              Electrician Roles
            </button>
            <button
              onClick={() => onNavigate('jobs', { keyword: 'carpenter' })}
              className="px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white transition-all cursor-pointer"
            >
              Carpenter Craft
            </button>
            <button
              onClick={() => onNavigate('opportunities')}
              className="px-3.5 py-1 rounded-full bg-[#FFE066]/15 hover:bg-[#FFE066]/25 border border-[#FFE066]/40 text-[#FFE066] font-semibold transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Explore Govt Opportunities</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. FOUR CORE PILLARS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-wide">
            How KAAMSETU Works
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm max-w-xl mx-auto">
            A comprehensive, transparent infrastructure built for employment, artisanal craft, and zero-rent enterprise.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar) => {
            const IconComponent = pillar.icon;
            return (
              <div
                key={pillar.id}
                onClick={() => onNavigate(pillar.targetTab)}
                className="group p-6 rounded-3xl bg-zinc-950 border border-white/10 hover:border-[#FF6B00]/50 shadow-xl transition-all duration-300 flex flex-col justify-between space-y-5 cursor-pointer relative overflow-hidden"
              >
                <div className="space-y-4 relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="p-3.5 rounded-2xl bg-zinc-900 border border-white/10 text-[#FF8F3D] group-hover:scale-110 transition-transform">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FF6B00]/15 text-[#FF8F3D] border border-[#FF6B00]/30">
                      {pillar.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-[#FF8F3D] transition-colors">
                    {pillar.title}
                  </h3>

                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs font-bold text-[#FF8F3D] group-hover:text-white transition-colors relative z-10">
                  <span>{pillar.ctaText}</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. EMPLOYMENT SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                Employment Section &bull; Verified Registry
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Verified Jobs & Apprenticeships
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-xl">
              Every job listing has an audited public source, check date, and direct application portal. Zero mock HRs or unverified vacancies.
            </p>
          </div>

          <button
            onClick={() => onNavigate('jobs')}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#FF6B00]/15 hover:bg-[#FF6B00]/25 text-[#FF8F3D] border border-[#FF6B00]/30 text-xs font-bold transition-all cursor-pointer self-start sm:self-auto"
          >
            <span>Explore All Jobs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {VERIFIED_JOBS_REGISTRY.slice(0, 3).map((job) => (
            <div
              key={job.id}
              onClick={() => onNavigate('jobs')}
              className="p-6 rounded-3xl bg-zinc-950 border border-white/10 hover:border-[#FF6B00]/50 shadow-xl transition-all cursor-pointer flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 uppercase">
                    {job.verificationStatus.replace('_', ' ')}
                  </span>
                  <span className="text-[11px] text-zinc-500">{job.dateChecked}</span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white leading-snug line-clamp-1">{job.title}</h3>
                  <p className="text-xs text-zinc-400 mt-0.5">{job.employer}</p>
                </div>

                <div className="flex items-center gap-2 text-xs text-zinc-400">
                  <MapPin className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                  <span>{job.location}</span>
                </div>

                {job.salaryPublished && (
                  <div className="p-2.5 rounded-xl bg-zinc-900 border border-white/5 text-xs text-[#FFE066] font-bold">
                    {job.salaryPublished}
                  </div>
                )}

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {job.skillRequired.slice(0, 3).map((s, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-[11px] text-zinc-300"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-zinc-500">
                <span>Source: {job.sourceName}</span>
                <span className="text-[#FF8F3D] font-bold flex items-center gap-1">
                  <span>View Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. SKILL SHOWCASE SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Wrench className="w-4 h-4 text-[#FF8F3D]" />
              <span className="text-xs font-bold text-[#FF8F3D] uppercase tracking-wider">
                Skill Showcase Section &bull; Digital Rozgar Card
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Artisan & Technician Profiles
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-xl">
              Digital professional profiles for grassroot craftsmen, electricians, tailors, and mechanics. No shop rent required.
            </p>
          </div>

          <button
            onClick={() => onNavigate('showcase')}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#FF6B00]/15 hover:bg-[#FF6B00]/25 text-[#FF8F3D] border border-[#FF6B00]/30 text-xs font-bold transition-all cursor-pointer self-start sm:self-auto"
          >
            <span>View All Profiles</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleWorkers.map((w) => (
            <div
              key={w.id}
              onClick={() => onNavigate('showcase')}
              className="p-6 rounded-3xl bg-zinc-950 border border-white/10 hover:border-[#FF6B00]/50 shadow-xl transition-all cursor-pointer flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-[#FF6B00]/20 border border-[#FF6B00]/40 flex items-center justify-center font-bold text-[#FF8F3D]">
                    {w.name.charAt(0)}
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Verified</span>
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white">{w.name}</h3>
                  <p className="text-xs text-[#FF8F3D] font-medium">{w.trade}</p>
                </div>

                <div className="flex items-center gap-3 text-xs text-zinc-400">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                    <span>{w.location}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-zinc-500" />
                    <span>{w.exp}</span>
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-zinc-900 border border-white/5 text-xs flex items-center justify-between">
                  <span className="text-zinc-400">Rate / Pricing:</span>
                  <span className="font-bold text-[#FFE066]">{w.rate}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-zinc-400">
                <span>Direct Contact Consent</span>
                <span className="text-[#FF8F3D] font-bold">View Card &rarr;</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. BUSINESS HUB SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Store className="w-4 h-4 text-[#FFE066]" />
              <span className="text-xs font-bold text-[#FFE066] uppercase tracking-wider">
                Business Hub Section &bull; Zero-Rent Digital Dukaan
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Digital Storefronts Without Shop Rent
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-xl">
              Sell authentic handmade brass craft, pottery, and tailored garments directly to buyers across India.
            </p>
          </div>

          <button
            onClick={() => onNavigate('business')}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#FF6B00]/15 hover:bg-[#FF6B00]/25 text-[#FF8F3D] border border-[#FF6B00]/30 text-xs font-bold transition-all cursor-pointer self-start sm:self-auto"
          >
            <span>Launch My Dukaan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sampleStores.map((s) => (
            <div
              key={s.id}
              className="p-6 sm:p-7 rounded-3xl bg-zinc-950 border border-white/10 hover:border-[#FF6B00]/50 shadow-xl transition-all space-y-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white">{s.name}</h3>
                  <p className="text-xs text-[#FFE066] font-medium">{s.category}</p>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  Verified Workshop
                </span>
              </div>

              <p className="text-xs text-zinc-300 leading-relaxed">{s.desc}</p>

              <div className="p-3 rounded-xl bg-zinc-900 border border-white/5 space-y-1 text-xs text-zinc-400">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                  <span>Workshop: {s.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Package className="w-3.5 h-3.5 text-zinc-500" />
                  <span className="text-zinc-300">{s.coverage}</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-[11px] font-bold uppercase text-zinc-400">Featured Products:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {s.items.map((it, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-black/50 border border-white/5 flex items-center justify-between text-xs"
                    >
                      <span className="text-zinc-200 truncate pr-2">{it.name}</span>
                      <span className="font-bold text-[#FFE066] shrink-0">{it.price}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                <span className="text-zinc-500 text-[11px]">Direct maker dispatch</span>
                <button
                  onClick={() => {
                    soundEngine.playClick();
                    setSelectedEnquiryStore(s.name);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#FF6B00] hover:bg-[#FF8F3D] text-black font-bold text-xs uppercase cursor-pointer transition-colors"
                >
                  Send Enquiry
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. OPPORTUNITY NETWORK SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-[#FFE066]" />
              <span className="text-xs font-bold text-[#FFE066] uppercase tracking-wider">
                Opportunity Network Section &bull; Govt Schemes & Micro-Credit
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Official Schemes & Enterprise Funding
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-xl">
              Direct official ministry portals for collateral-free credit, toolkit incentives, and cluster market linkages.
            </p>
          </div>

          <button
            onClick={() => onNavigate('opportunities')}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#FF6B00]/15 hover:bg-[#FF6B00]/25 text-[#FF8F3D] border border-[#FF6B00]/30 text-xs font-bold transition-all cursor-pointer self-start sm:self-auto"
          >
            <span>View All Schemes</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {VERIFIED_OPPORTUNITIES_REGISTRY.map((opp) => (
            <div
              key={opp.id}
              className="p-6 rounded-3xl bg-zinc-950 border border-white/10 hover:border-[#FF6B00]/50 shadow-xl transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#FF6B00]/15 text-[#FF8F3D] border border-[#FF6B00]/30 w-fit block">
                  {opp.category.replace('_', ' ')}
                </span>

                <h3 className="text-base font-bold text-white leading-snug">{opp.title}</h3>

                <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2">
                  {opp.targetAudience}
                </p>

                <div className="p-3 rounded-xl bg-black/50 border border-white/5 text-xs space-y-1">
                  <span className="text-[#FFE066] font-bold block">Support & Incentives:</span>
                  <p className="text-zinc-300 text-[11px] leading-relaxed">{opp.supportDetails}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-white/5 space-y-2">
                <div className="text-[10px] text-zinc-500">Ministry: {opp.sourceName}</div>
                <a
                  href={opp.officialPortalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#FF6B00]/15 hover:bg-[#FF6B00]/25 text-[#FF8F3D] font-bold text-xs uppercase transition-all"
                >
                  <span>Official Ministry Link</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Direct Customer Enquiry Modal */}
      {selectedEnquiryStore && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="max-w-md w-full p-6 sm:p-8 rounded-3xl bg-zinc-950 border border-white/10 shadow-2xl space-y-4">
            <h3 className="text-lg font-black text-white">Send Customer Enquiry to {selectedEnquiryStore}</h3>
            <p className="text-xs text-zinc-400">Zero middleman fees. Your enquiry goes straight to the craftsman.</p>

            {enquirySuccess ? (
              <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-2 text-emerald-400">
                <CheckCircle2 className="w-10 h-10 mx-auto" />
                <h4 className="font-bold text-sm">Enquiry Dispatched!</h4>
                <p className="text-xs text-zinc-300">The artisan has received your enquiry.</p>
              </div>
            ) : (
              <form onSubmit={handleEnquirySubmit} className="space-y-3 text-xs">
                <div>
                  <label className="text-zinc-300 font-semibold block mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={enquiryName}
                    onChange={(e) => setEnquiryName(e.target.value)}
                    placeholder="e.g. Vikram Verma"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-[#FF6B00]"
                  />
                </div>
                <div>
                  <label className="text-zinc-300 font-semibold block mb-1">Your Mobile / WhatsApp</label>
                  <input
                    type="tel"
                    required
                    value={enquiryPhone}
                    onChange={(e) => setEnquiryPhone(e.target.value)}
                    placeholder="e.g. +91 98XXXXXXXX"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-[#FF6B00]"
                  />
                </div>
                <div>
                  <label className="text-zinc-300 font-semibold block mb-1">Requirements / Product Inquiry</label>
                  <textarea
                    rows={3}
                    value={enquiryMsg}
                    onChange={(e) => setEnquiryMsg(e.target.value)}
                    placeholder="Quantity, custom dimensions, or dispatch timeline..."
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-[#FF6B00]"
                  />
                </div>
                <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setSelectedEnquiryStore(null)}
                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#FF6B00] hover:bg-[#FF8F3D] text-black font-bold"
                  >
                    Dispatch Enquiry
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
