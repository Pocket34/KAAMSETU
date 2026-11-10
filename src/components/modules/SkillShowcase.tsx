'use client';

import React, { useState } from 'react';
import {
  User,
  Wrench,
  Camera,
  Star,
  Plus,
  Share2,
  CheckCircle2,
  Phone,
  MapPin,
  Clock,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { soundEngine } from '@/lib/audio';

interface WorkerProfile {
  id: string;
  name: string;
  trade: string;
  location: string;
  experienceYears: number;
  dailyRateOrPricing: string;
  skills: string[];
  bio: string;
  workSamplesCount: number;
  phoneConsent: boolean;
  publicPhone?: string;
  verifiedBadge: boolean;
}

const INITIAL_PROFILES: WorkerProfile[] = [
  {
    id: 'wp-01',
    name: 'Rameshwar Kumar Sharma',
    trade: 'Master Electrician & Inverter Specialist',
    location: 'Sasni Gate, Aligarh, UP',
    experienceYears: 12,
    dailyRateOrPricing: '₹600 / visit or ₹800 / day',
    skills: ['House Wiring', 'Substation Repair', 'Inverter Battery Setup', 'PM Surya Ghar Solar'],
    bio: '12 years practical experience in residential wiring, industrial MCB panels, and solar inverter installations in Aligarh region.',
    workSamplesCount: 8,
    phoneConsent: true,
    publicPhone: '+91 98XXXXXXXX (Verified with consent)',
    verifiedBadge: true,
  },
  {
    id: 'wp-02',
    name: 'Mohammad Farooq',
    trade: 'Master Locksmith & Precision Metal Craft',
    location: 'Upper Fort, Aligarh, UP',
    experienceYears: 18,
    dailyRateOrPricing: 'Custom Quote / Job-based',
    skills: ['Brass Lock Forging', 'High-Security Tumbler Pinning', 'Heritage Restoration'],
    bio: 'Generational lock craftsman from Aligarh. Restores vintage brass locks and crafts custom high-security security fittings.',
    workSamplesCount: 14,
    phoneConsent: true,
    publicPhone: '+91 94XXXXXXXX (Verified with consent)',
    verifiedBadge: true,
  },
  {
    id: 'wp-03',
    name: 'Sunita Devi',
    trade: 'Master Tailor & Traditional Embroidery',
    location: 'Gandhi Nagar, Agra, UP',
    experienceYears: 7,
    dailyRateOrPricing: '₹350 - ₹1,200 per piece',
    skills: ['Boutique Blouses', 'Zardozi Embroidery', 'Uniform Stitching', 'Garment Alterations'],
    bio: 'Trained under PMKVY apparel council. Runs home-based tailoring service with fast turnaround.',
    workSamplesCount: 11,
    phoneConsent: false,
    verifiedBadge: true,
  }
];

export const SkillShowcase: React.FC = () => {
  const [profiles, setProfiles] = useState<WorkerProfile[]>(INITIAL_PROFILES);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newTrade, setNewTrade] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newExp, setNewExp] = useState(2);
  const [newPricing, setNewPricing] = useState('');
  const [newSkills, setNewSkills] = useState('');
  const [newBio, setNewBio] = useState('');
  const [phoneConsent, setPhoneConsent] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCreateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newTrade.trim()) return;

    soundEngine.playClick();
    const newProf: WorkerProfile = {
      id: `wp-${Date.now()}`,
      name: newName.trim(),
      trade: newTrade.trim(),
      location: newLocation.trim() || 'Aligarh / UP',
      experienceYears: Number(newExp) || 1,
      dailyRateOrPricing: newPricing.trim() || '₹500 / day',
      skills: newSkills.split(',').map((s) => s.trim()).filter(Boolean),
      bio: newBio.trim(),
      workSamplesCount: 0,
      phoneConsent,
      publicPhone: phoneConsent ? '+91 (Phone shared with consent)' : undefined,
      verifiedBadge: false, // Starts as community submitted
    };

    setProfiles([newProf, ...profiles]);
    setShowCreateModal(false);
    setNewName('');
    setNewTrade('');
    setNewPricing('');
    setNewBio('');
  };

  const handleCopyLink = (id: string) => {
    soundEngine.playClick();
    if (typeof window !== 'undefined') {
      const url = `${window.location.origin}/showcase#${id}`;
      navigator.clipboard?.writeText(url).catch(() => {});
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FF6B00]/15 text-[#FF8F3D] border border-[#FF6B00]/30 uppercase tracking-wider">
              Digital Rozgar Card
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-wide">
            Skill Showcase & Artisan Profiles
          </h1>
          <p className="text-zinc-400 text-xs sm:text-sm mt-1 max-w-2xl">
            A digital professional identity for electricians, carpenters, tailors, cooks, and digital professionals. Showcase your work, transparent rates, and get customer requests without needing a physical shop.
          </p>
        </div>

        <button
          onClick={() => {
            soundEngine.playClick();
            setShowCreateModal(true);
          }}
          className="flex items-center gap-2 px-5 py-3 rounded-full bg-[#FF6B00] hover:bg-[#FF8F3D] text-black font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-[#FF6B00]/25 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create My Digital Skill Card</span>
        </button>
      </div>

      {/* Profiles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {profiles.map((p) => (
          <div
            key={p.id}
            id={p.id}
            className="p-6 rounded-3xl bg-zinc-950 border border-white/10 shadow-lg space-y-4 flex flex-col justify-between hover:border-[#FF6B00]/40 transition-all"
          >
            <div className="space-y-3">
              {/* Profile Card Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FF6B00]/20 to-[#E5A93C]/20 border border-[#FF6B00]/40 flex items-center justify-center text-[#FF8F3D] font-bold text-lg">
                    {p.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white leading-tight">{p.name}</h3>
                    <p className="text-xs text-[#FF8F3D] font-medium">{p.trade}</p>
                  </div>
                </div>

                {p.verifiedBadge ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Verified</span>
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                    Community Submitted
                  </span>
                )}
              </div>

              {/* Bio & Location */}
              <p className="text-xs text-zinc-300 leading-relaxed">{p.bio}</p>

              <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                  <span>{p.location}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-zinc-500" />
                  <span>{p.experienceYears} Yrs Exp</span>
                </span>
              </div>

              {/* Pricing Box */}
              <div className="p-3 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-between text-xs">
                <span className="text-zinc-400">Rate / Pricing:</span>
                <span className="font-bold text-[#FFE066]">{p.dailyRateOrPricing}</span>
              </div>

              {/* Skills */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {p.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-[11px] text-zinc-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs">
              <button
                onClick={() => handleCopyLink(p.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white transition-colors cursor-pointer text-xs"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{copiedId === p.id ? 'Copied Public Link!' : 'Share Rozgar Card'}</span>
              </button>

              {p.phoneConsent && p.publicPhone ? (
                <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
                  <Phone className="w-3 h-3" />
                  <span>Verified Contact</span>
                </span>
              ) : (
                <span className="text-[10px] text-zinc-500">Contact via Enquiries</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Create Profile */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="max-w-lg w-full p-6 sm:p-8 rounded-3xl bg-zinc-950 border border-white/10 shadow-2xl space-y-4">
            <h2 className="text-lg font-black text-white">Create Digital Rozgar Profile</h2>
            <p className="text-zinc-400 text-xs leading-relaxed">
              Build your free public skill card. You do not need a shop address. Your phone number is only displayed if you provide explicit consent.
            </p>

            <form onSubmit={handleCreateProfile} className="space-y-3 text-xs">
              <div>
                <label className="text-zinc-300 font-semibold block mb-1">Your Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Salim Khan"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-[#FF6B00]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-300 font-semibold block mb-1">Skill / Trade</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Electrician, Carpenter"
                    value={newTrade}
                    onChange={(e) => setNewTrade(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-[#FF6B00]"
                  />
                </div>
                <div>
                  <label className="text-zinc-300 font-semibold block mb-1">Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Aligarh, UP"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-[#FF6B00]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-300 font-semibold block mb-1">Years of Experience</label>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={newExp}
                    onChange={(e) => setNewExp(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-[#FF6B00]"
                  />
                </div>
                <div>
                  <label className="text-zinc-300 font-semibold block mb-1">Standard Rate / Pricing</label>
                  <input
                    type="text"
                    placeholder="e.g. ₹500/day or ₹300/visit"
                    value={newPricing}
                    onChange={(e) => setNewPricing(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-[#FF6B00]"
                  />
                </div>
              </div>

              <div>
                <label className="text-zinc-300 font-semibold block mb-1">Skills (Comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Inverter Wiring, MCB Setup, Drill Work"
                  value={newSkills}
                  onChange={(e) => setNewSkills(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-[#FF6B00]"
                />
              </div>

              <div>
                <label className="text-zinc-300 font-semibold block mb-1">Short Description of Work</label>
                <textarea
                  rows={2}
                  placeholder="Tell customers about the quality and speed of your work..."
                  value={newBio}
                  onChange={(e) => setNewBio(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-[#FF6B00]"
                />
              </div>

              {/* Consent Checkbox */}
              <div className="flex items-start gap-2 pt-1">
                <input
                  type="checkbox"
                  id="phoneConsent"
                  checked={phoneConsent}
                  onChange={(e) => setPhoneConsent(e.target.checked)}
                  className="mt-0.5 rounded text-[#FF6B00]"
                />
                <label htmlFor="phoneConsent" className="text-[11px] text-zinc-400 leading-normal">
                  I give explicit permission to display my verified mobile number publicly for customer job bookings.
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#FF6B00] hover:bg-[#FF8F3D] text-black font-bold text-xs"
                >
                  Publish Rozgar Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
