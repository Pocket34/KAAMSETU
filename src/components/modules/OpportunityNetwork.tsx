'use client';

import React from 'react';
import {
  TrendingUp,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Award,
  Users,
  Compass
} from 'lucide-react';
import { VERIFIED_OPPORTUNITIES_REGISTRY } from '@/services/jarvisTools';

export const OpportunityNetwork: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FF6B00]/15 text-[#FF8F3D] border border-[#FF6B00]/30 uppercase tracking-wider">
            Verified Support Ecosystem
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-wide">
          Opportunity & Government Scheme Network
        </h1>
        <p className="text-zinc-400 text-xs sm:text-sm mt-1 max-w-2xl">
          Discover verified central and state government schemes, zero-collateral credit lines, toolkit grants, and market linkages. We only link to authorized ministry portals.
        </p>
      </div>

      {/* Honest Ethics Banner */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 flex items-start gap-3">
        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-amber-100">Transparent Public Notice:</strong> KAAMSETU does not promise guaranteed government funding, loan approvals, or automatic customer contracts. All schemes require direct eligibility verification through the official government portal.
        </p>
      </div>

      {/* Schemes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {VERIFIED_OPPORTUNITIES_REGISTRY.map((opp) => (
          <div
            key={opp.id}
            className="p-6 rounded-3xl bg-zinc-950 border border-white/10 shadow-xl space-y-4 flex flex-col justify-between hover:border-[#FF6B00]/40 transition-all"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#FF6B00]/15 text-[#FF8F3D] border border-[#FF6B00]/30">
                  {opp.category.replace('_', ' ')}
                </span>
                <span className="text-[10px] text-zinc-500">Verified: {opp.dateVerified}</span>
              </div>

              <h3 className="text-base font-bold text-white leading-snug">{opp.title}</h3>

              {/* Target Audience */}
              <div className="space-y-1 text-xs">
                <span className="text-zinc-400 font-semibold block">Target Beneficiaries:</span>
                <p className="text-zinc-300 bg-zinc-900/50 p-2.5 rounded-xl border border-white/5">
                  {opp.targetAudience}
                </p>
              </div>

              {/* Eligibility */}
              <div className="space-y-1 text-xs">
                <span className="text-zinc-400 font-semibold block">Eligibility Criteria:</span>
                <p className="text-zinc-300 leading-relaxed">{opp.eligibility}</p>
              </div>

              {/* Financial Support */}
              <div className="p-3 rounded-xl bg-black/50 border border-white/5 text-xs space-y-1">
                <span className="text-[#FFE066] font-bold block">Support & Incentives:</span>
                <p className="text-zinc-300">{opp.supportDetails}</p>
                <p className="text-[#FF8F3D] text-[11px] pt-1">{opp.investmentRequired}</p>
              </div>
            </div>

            {/* Source & Portal Action */}
            <div className="pt-4 border-t border-white/5 space-y-2">
              <div className="text-[11px] text-zinc-500">
                Official Ministry: <strong className="text-zinc-300">{opp.sourceName}</strong>
              </div>

              <a
                href={opp.officialPortalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#FF6B00]/15 hover:bg-[#FF6B00]/25 text-[#FF8F3D] font-bold text-xs uppercase tracking-wide transition-all"
              >
                <span>Visit Official Ministry Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
