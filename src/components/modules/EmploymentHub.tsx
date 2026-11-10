'use client';

import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  MapPin,
  Building2,
  Calendar,
  ExternalLink,
  ShieldCheck,
  Briefcase,
  AlertCircle,
  Clock,
  Sparkles,
  CheckCircle2,
  Bookmark
} from 'lucide-react';
import { VERIFIED_JOBS_REGISTRY, VerifiedJob } from '@/services/jarvisTools';
import { soundEngine } from '@/lib/audio';

export const EmploymentHub: React.FC = () => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedSector, setSelectedSector] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedJob, setSelectedJob] = useState<VerifiedJob | null>(null);
  const [savedJobs, setSavedJobs] = useState<string[]>([]);

  const filteredJobs = useMemo(() => {
    return VERIFIED_JOBS_REGISTRY.filter((job) => {
      const matchesKeyword =
        !searchKeyword ||
        job.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        job.employer.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        job.skillRequired.some((s) => s.toLowerCase().includes(searchKeyword.toLowerCase()));

      const matchesLocation =
        selectedLocation === 'all' ||
        job.location.toLowerCase().includes(selectedLocation.toLowerCase());

      const matchesSector = selectedSector === 'all' || job.sector === selectedSector;

      const matchesType = selectedType === 'all' || job.employmentType === selectedType;

      return matchesKeyword && matchesLocation && matchesSector && matchesType;
    });
  }, [searchKeyword, selectedLocation, selectedSector, selectedType]);

  const toggleSaveJob = (id: string) => {
    soundEngine.playClick();
    setSavedJobs((prev) =>
      prev.includes(id) ? prev.filter((jId) => jId !== id) : [...prev, id]
    );
  };

  const getVerificationBadge = (status: VerifiedJob['verificationStatus']) => {
    switch (status) {
      case 'officially_sourced':
        return {
          label: 'Officially Sourced',
          className: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
        };
      case 'verified':
        return {
          label: 'Verified Opening',
          className: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
        };
      case 'employer_submitted':
        return {
          label: 'Employer Submitted',
          className: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
        };
      case 'expired':
        return {
          label: 'Expired',
          className: 'bg-zinc-800 text-zinc-500 border-zinc-700',
        };
      default:
        return {
          label: 'Not Verified',
          className: 'bg-red-500/15 text-red-400 border-red-500/30',
        };
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Title & Trust Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FF6B00]/15 text-[#FF8F3D] border border-[#FF6B00]/30 uppercase tracking-wider">
              Verified Employment Infrastructure
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-wide">
            Employment Hub
          </h1>
          <p className="text-zinc-400 text-xs sm:text-sm mt-1 max-w-2xl">
            Explore genuine government, PSU, private, apprenticeship, and skilled artisan livelihoods. Every posting displays its verified origin and official application gateway.
          </p>
        </div>

        {/* Anti-Scam Verification Notice */}
        <div className="p-3.5 rounded-2xl bg-zinc-950 border border-white/10 text-xs text-zinc-400 max-w-sm flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed">
            <strong className="text-zinc-200">Zero-Scam Policy:</strong> Never pay money for any job offer. KAAMSETU connects only to free official portals.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-zinc-950/80 border border-white/10 shadow-xl space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Keyword Search */}
          <div className="relative sm:col-span-2">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="Search by job title, skills (e.g. Electrician, Carpenter, Next.js)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white placeholder-zinc-500 text-xs sm:text-sm focus:outline-none focus:border-[#FF6B00]"
            />
          </div>

          {/* Location Selector */}
          <div className="relative">
            <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-zinc-300 text-xs sm:text-sm focus:outline-none focus:border-[#FF6B00] cursor-pointer appearance-none"
            >
              <option value="all">All Locations</option>
              <option value="aligarh">Aligarh, UP</option>
              <option value="agra">Agra, UP</option>
              <option value="delhi">Delhi NCR</option>
              <option value="remote">Remote (India)</option>
            </select>
          </div>

          {/* Sector Selector */}
          <div className="relative">
            <Building2 className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-zinc-300 text-xs sm:text-sm focus:outline-none focus:border-[#FF6B00] cursor-pointer appearance-none"
            >
              <option value="all">All Sectors</option>
              <option value="government">Government</option>
              <option value="psu">PSU / State Board</option>
              <option value="artisan">Artisan / PM Vishwakarma</option>
              <option value="private">Private Sector</option>
            </select>
          </div>
        </div>

        {/* Quick Filter Badges */}
        <div className="flex items-center gap-2 pt-2 border-t border-white/5 overflow-x-auto text-xs text-zinc-400">
          <span className="font-semibold text-zinc-300 shrink-0">Type:</span>
          {['all', 'apprenticeship', 'full_time', 'remote', 'daily_wage'].map((t) => (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              className={`px-3 py-1 rounded-full text-xs font-medium capitalize transition-all cursor-pointer whitespace-nowrap ${
                selectedType === t
                  ? 'bg-[#FF6B00] text-black font-bold'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white'
              }`}
            >
              {t.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Main Jobs Listing & Detail Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Job Cards List */}
        <div className="lg:col-span-2 space-y-4">
          {filteredJobs.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-zinc-950 border border-white/10 space-y-3">
              <AlertCircle className="w-10 h-10 text-zinc-600 mx-auto" />
              <h3 className="text-base font-bold text-white">No Verified Opportunities Found</h3>
              <p className="text-zinc-400 text-xs max-w-md mx-auto leading-relaxed">
                We do not show fabricated or unverified listings. Try clearing your search filters or check back when new verified notifications are published by official portals.
              </p>
              <button
                onClick={() => {
                  setSearchKeyword('');
                  setSelectedLocation('all');
                  setSelectedSector('all');
                  setSelectedType('all');
                }}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            filteredJobs.map((job) => {
              const badge = getVerificationBadge(job.verificationStatus);
              const isSelected = selectedJob?.id === job.id;
              const isSaved = savedJobs.includes(job.id);

              return (
                <div
                  key={job.id}
                  onClick={() => {
                    soundEngine.playClick();
                    setSelectedJob(job);
                  }}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-3.5 relative overflow-hidden ${
                    isSelected
                      ? 'bg-zinc-900/90 border-[#FF6B00] shadow-[0_0_25px_rgba(255,107,0,0.15)]'
                      : 'bg-zinc-950/70 border-white/10 hover:border-white/20'
                  }`}
                >
                  {/* Top Bar: Title, Employer & Verification */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${badge.className}`}
                        >
                          {badge.label}
                        </span>
                        <span className="text-[11px] text-zinc-400 capitalize">
                          &bull; {job.sector} &bull; {job.employmentType.replace('_', ' ')}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-white leading-snug">{job.title}</h3>
                      <p className="text-xs text-zinc-300 font-medium">{job.employer}</p>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSaveJob(job.id);
                      }}
                      title={isSaved ? 'Remove from saved' : 'Save opportunity'}
                      className={`p-2 rounded-lg transition-colors cursor-pointer ${
                        isSaved ? 'text-[#FF8F3D] bg-[#FF6B00]/15' : 'text-zinc-500 hover:text-white'
                      }`}
                    >
                      <Bookmark className="w-4 h-4 fill-current" />
                    </button>
                  </div>

                  {/* Location & Salary */}
                  <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-400">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                      <span>{job.location}</span>
                    </span>
                    {job.salaryPublished && (
                      <span className="flex items-center gap-1.5 text-[#FFE066] font-semibold">
                        <span>{job.salaryPublished}</span>
                      </span>
                    )}
                  </div>

                  {/* Skills tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {job.skillRequired.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-[11px] text-zinc-300"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Footer Meta: Source & Date Checked */}
                  <div className="pt-3 border-t border-white/5 flex flex-wrap items-center justify-between text-[11px] text-zinc-500">
                    <span>
                      Source: <strong className="text-zinc-400">{job.sourceName}</strong>
                    </span>
                    <span>Last Checked: {job.dateChecked}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right: Selected Job Details Card */}
        <div className="lg:col-span-1">
          {selectedJob ? (
            <div className="sticky top-28 p-6 rounded-3xl bg-zinc-950 border border-white/10 shadow-2xl space-y-6">
              <div className="space-y-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FF6B00]/20 text-[#FF8F3D] uppercase">
                  {selectedJob.verificationStatus.replace('_', ' ')}
                </span>
                <h2 className="text-lg font-black text-white leading-tight">
                  {selectedJob.title}
                </h2>
                <p className="text-xs text-zinc-300">{selectedJob.employer}</p>
                <p className="text-xs text-zinc-400 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                  <span>{selectedJob.location}</span>
                </p>
              </div>

              {selectedJob.salaryPublished && (
                <div className="p-3 rounded-xl bg-zinc-900 border border-white/5 text-xs">
                  <span className="text-zinc-400 block text-[10px] uppercase">Published Compensation:</span>
                  <span className="text-[#FFE066] font-bold text-sm">
                    {selectedJob.salaryPublished}
                  </span>
                </div>
              )}

              {/* Eligibility */}
              <div className="space-y-1.5 text-xs">
                <span className="font-semibold text-zinc-200 block">Eligibility & Education:</span>
                <p className="text-zinc-400 leading-relaxed bg-black/40 p-3 rounded-xl border border-white/5">
                  {selectedJob.educationRequirement}
                </p>
              </div>

              {/* Description */}
              <div className="space-y-1.5 text-xs">
                <span className="font-semibold text-zinc-200 block">Role Overview:</span>
                <p className="text-zinc-300 leading-relaxed">{selectedJob.description}</p>
              </div>

              {/* Deadline & Verification Stamp */}
              <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-white/5 space-y-2 text-[11px] text-zinc-400">
                <div className="flex items-center justify-between">
                  <span>Application Deadline:</span>
                  <strong className="text-white">{selectedJob.applicationDeadline}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span>Audit Source:</span>
                  <a
                    href={selectedJob.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#FF8F3D] hover:underline flex items-center gap-1"
                  >
                    <span>{selectedJob.sourceName}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div className="flex items-center justify-between">
                  <span>Verification Date:</span>
                  <span className="text-zinc-300">{selectedJob.dateChecked}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <a
                  href={selectedJob.officialApplicationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-[#FF6B00] hover:bg-[#FF8F3D] text-black font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-[#FF6B00]/25 cursor-pointer"
                >
                  <span>Apply on Official Portal</span>
                  <ExternalLink className="w-4 h-4" />
                </a>

                <p className="text-center text-[10px] text-zinc-500">
                  Redirects to {selectedJob.sourceName}. No intermediary application fees.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-8 rounded-3xl bg-zinc-950/60 border border-dashed border-white/10 text-center space-y-3">
              <Briefcase className="w-8 h-8 text-zinc-600 mx-auto" />
              <h3 className="text-sm font-semibold text-zinc-300">Select an Opportunity</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Click on any verified listing from the list to view eligibility, source credentials, and official application links.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
