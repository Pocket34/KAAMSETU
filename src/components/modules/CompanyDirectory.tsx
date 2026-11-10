'use client';

import React, { useState } from 'react';
import { Building2, Globe, ExternalLink, ShieldCheck, Search, MapPin, Mail, Phone } from 'lucide-react';
import { soundEngine } from '@/lib/audio';

interface VerifiedCompany {
  id: string;
  name: string;
  industry: string;
  location: string;
  officialWebsite: string;
  careersPageUrl: string;
  publicRecruitmentEmail?: string; // Only when officially published on careers portal
  publicHelpline?: string; // Only official public toll-free or recruitment landline
  sourceUrl: string;
  verifiedDate: string;
  description: string;
}

const VERIFIED_COMPANIES: VerifiedCompany[] = [
  {
    id: 'comp-01',
    name: 'National Skill Development Corporation (NSDC)',
    industry: 'Vocational Training & Skill Certification',
    location: 'New Delhi / Pan-India Skill Centers',
    officialWebsite: 'https://nsdcindia.org',
    careersPageUrl: 'https://nsdcindia.org/careers',
    publicRecruitmentEmail: 'contact@nsdcindia.org',
    publicHelpline: '011-47451600 (Official Reception)',
    sourceUrl: 'https://nsdcindia.org',
    verifiedDate: '2026-11-08',
    description: 'Public-private partnership promoting skill development across 37 industrial sectors and PMKVY initiatives.',
  },
  {
    id: 'comp-02',
    name: 'U.P. Power Transmission Corporation Ltd (UPPTCL)',
    industry: 'Power Transmission & Electrical Infrastructure',
    location: 'Shakti Bhawan, Lucknow / Aligarh Transmission Substation',
    officialWebsite: 'https://upptcl.org',
    careersPageUrl: 'https://www.apprenticeshipindia.gov.in',
    sourceUrl: 'https://upptcl.org',
    verifiedDate: '2026-11-09',
    description: 'State government electric utility managing 765kV to 132kV transmission networks and public apprenticeships in UP.',
  },
  {
    id: 'comp-03',
    name: 'National Career Service (Ministry of Labour & Employment)',
    industry: 'Government Employment Exchange & Portal',
    location: 'Shram Shakti Bhawan, New Delhi / District Employment Exchanges',
    officialWebsite: 'https://www.ncs.gov.in',
    careersPageUrl: 'https://www.ncs.gov.in/job-seeker',
    publicHelpline: '1514 (Toll-Free National Helpline)',
    sourceUrl: 'https://www.ncs.gov.in',
    verifiedDate: '2026-11-07',
    description: 'Nationwide public digital platform providing employment services, career counseling, and verified vacancies.',
  }
];

export const CompanyDirectory: React.FC = () => {
  const [keyword, setKeyword] = useState('');

  const filtered = VERIFIED_COMPANIES.filter(
    (c) =>
      c.name.toLowerCase().includes(keyword.toLowerCase()) ||
      c.industry.toLowerCase().includes(keyword.toLowerCase()) ||
      c.location.toLowerCase().includes(keyword.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FF6B00]/15 text-[#FF8F3D] border border-[#FF6B00]/30 uppercase tracking-wider">
            Verified Public Directory
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-wide">
          Employer & Organization Directory
        </h1>
        <p className="text-zinc-400 text-xs sm:text-sm mt-1 max-w-2xl">
          We list only publicly verified employers and institutions. In strict adherence to our ethics guidelines, we never fabricate HR names, private mobile numbers, or unverified email addresses.
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Search verified organizations..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white placeholder-zinc-500 text-xs sm:text-sm focus:outline-none focus:border-[#FF6B00]"
        />
      </div>

      {/* Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((company) => (
          <div
            key={company.id}
            className="p-6 rounded-3xl bg-zinc-950 border border-white/10 shadow-lg space-y-4 flex flex-col justify-between hover:border-[#FF6B00]/40 transition-all"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="p-3 rounded-2xl bg-zinc-900 border border-white/10 text-[#FF8F3D]">
                  <Building2 className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Public Verified</span>
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-white leading-tight">{company.name}</h3>
                <p className="text-xs text-[#FFE066] font-medium mt-0.5">{company.industry}</p>
                <p className="text-xs text-zinc-400 flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                  <span>{company.location}</span>
                </p>
              </div>

              <p className="text-xs text-zinc-300 leading-relaxed">{company.description}</p>

              {/* Public Contacts (Only if officially published) */}
              <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1.5 text-xs text-zinc-400">
                {company.publicRecruitmentEmail && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-zinc-500" />
                    <span className="text-zinc-200">{company.publicRecruitmentEmail}</span>
                  </div>
                )}
                {company.publicHelpline && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-zinc-500" />
                    <span className="text-zinc-200">{company.publicHelpline}</span>
                  </div>
                )}
                <div className="text-[10px] text-zinc-500 pt-1">
                  Source Checked: {company.verifiedDate}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/5 flex items-center gap-2">
              <a
                href={company.careersPageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#FF6B00]/15 hover:bg-[#FF6B00]/25 text-[#FF8F3D] font-bold text-xs transition-colors"
              >
                <span>Official Careers</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <a
                href={company.officialWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                title="Visit Website"
              >
                <Globe className="w-4 h-4" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
