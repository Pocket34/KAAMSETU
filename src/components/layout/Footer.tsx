'use client';

import React from 'react';
import { ShieldCheck, ExternalLink, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#050608] border-t border-white/10 text-zinc-400 text-xs py-12 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        {/* Brand & Mission */}
        <div className="md:col-span-2 space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-base font-black tracking-wider text-white">
              KAAM<span className="text-[#FF8F3D]">SETU</span>
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#FF6B00]/15 text-[#FF8F3D] border border-[#FF6B00]/30">
              ETHICAL EMPLOYMENT INFRASTRUCTURE
            </span>
          </div>
          <p className="text-zinc-300 text-sm max-w-md">
            &ldquo;Talent deserves an opportunity.&rdquo;
          </p>
          <p className="text-zinc-400 leading-relaxed max-w-lg">
            KAAMSETU connects skilled and unskilled workers, artisans, corporate professionals, and micro-entrepreneurs directly to verified livelihoods, without demanding an expensive physical store or office.
          </p>
        </div>

        {/* Verification Standards */}
        <div className="space-y-2.5">
          <h4 className="text-white font-semibold text-xs uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#FFE066]" />
            <span>Integrity Standards</span>
          </h4>
          <ul className="space-y-1.5 text-zinc-400 text-[11px] leading-normal">
            <li>&bull; Zero fabricated jobs or synthetic HR contacts</li>
            <li>&bull; All listings show source and date checked</li>
            <li>&bull; Unverified posts are explicitly labeled</li>
            <li>&bull; Direct links to official government & employer portals</li>
          </ul>
        </div>

        {/* Official Sources Connected */}
        <div className="space-y-2.5">
          <h4 className="text-white font-semibold text-xs uppercase tracking-wider">
            Connected Public Portals
          </h4>
          <ul className="space-y-1.5 text-zinc-400 text-[11px]">
            <li>
              <a
                href="https://www.ncs.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#FF8F3D] transition-colors flex items-center gap-1"
              >
                <span>National Career Service (NCS)</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </li>
            <li>
              <a
                href="https://pmvishwakarma.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#FF8F3D] transition-colors flex items-center gap-1"
              >
                <span>PM Vishwakarma Portal</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </li>
            <li>
              <a
                href="https://www.apprenticeshipindia.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#FF8F3D] transition-colors flex items-center gap-1"
              >
                <span>Apprenticeship India (NAPS)</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </li>
            <li>
              <a
                href="https://www.mudra.org.in"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#FF8F3D] transition-colors flex items-center gap-1"
              >
                <span>Pradhan Mantri Mudra Yojana</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-[11px] text-zinc-500 gap-3">
        <div>
          &copy; 2026 KAAMSETU Foundation. All Rights Reserved.
        </div>
        <div className="flex items-center gap-1 text-zinc-400">
          <span>Built for human dignity and economic empowerment.</span>
        </div>
      </div>
    </footer>
  );
};
