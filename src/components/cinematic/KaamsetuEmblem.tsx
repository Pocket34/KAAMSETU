'use client';

import React from 'react';

interface KaamsetuEmblemProps {
  size?: number;
  className?: string;
  glowIntensity?: 'subtle' | 'high' | 'ultra';
}

export const KaamsetuEmblem: React.FC<KaamsetuEmblemProps> = ({
  size = 200,
  className = '',
  glowIntensity = 'high',
}) => {
  return (
    <div
      className={`relative flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
    >
      {/* 1. Deep Ambient Radial Aura */}
      <div
        className="absolute inset-[-20%] rounded-full blur-3xl pointer-events-none transition-opacity duration-1000"
        style={{
          background:
            glowIntensity === 'ultra'
              ? 'radial-gradient(circle, rgba(255,107,0,0.55) 0%, rgba(229,169,60,0.25) 45%, transparent 70%)'
              : 'radial-gradient(circle, rgba(255,107,0,0.4) 0%, rgba(229,169,60,0.18) 50%, transparent 75%)',
        }}
      />

      {/* 2. Concentric Orbit Energy Rings */}
      <div className="absolute inset-0 rounded-full border border-dashed border-[#FF6B00]/40 animate-[spin_24s_linear_infinite] pointer-events-none" />
      <div className="absolute inset-3 rounded-full border border-[#E5A93C]/20 animate-[spin_40s_linear_infinite_reverse] pointer-events-none" />

      {/* 3. The Master Bridge SVG Emblem */}
      <svg
        viewBox="0 0 240 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full relative z-10 drop-shadow-[0_0_35px_rgba(255,107,0,0.7)]"
      >
        <defs>
          {/* Electric Orange to Radiant Gold Gradient */}
          <linearGradient id="emblemOrangeGold" x1="20" y1="220" x2="220" y2="20" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FF4D00" />
            <stop offset="35%" stopColor="#FF6B00" />
            <stop offset="70%" stopColor="#E5A93C" />
            <stop offset="100%" stopColor="#FFE066" />
          </linearGradient>

          {/* Core Beam Gradient */}
          <linearGradient id="centralBeam" x1="120" y1="200" x2="120" y2="30" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="rgba(255,107,0,0.2)" />
            <stop offset="60%" stopColor="#FF8F3D" />
            <stop offset="100%" stopColor="#FFFFFF" />
          </linearGradient>

          {/* Soft Glow Filter */}
          <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Foundation Base Ground Line */}
        <line x1="30" y1="185" x2="210" y2="185" stroke="url(#emblemOrangeGold)" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
        <line x1="50" y1="192" x2="190" y2="192" stroke="#FF6B00" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />

        {/* Left Anchor Tower (Represents Human Talent & Craftsmanship) */}
        <path
          d="M 52 185 L 68 95 L 84 185 Z"
          fill="url(#emblemOrangeGold)"
          opacity="0.9"
        />
        <circle cx="68" cy="90" r="5.5" fill="#FFE066" filter="url(#softGlow)" />

        {/* Right Anchor Tower (Represents Market Opportunity & Enterprise) */}
        <path
          d="M 156 185 L 172 95 L 188 185 Z"
          fill="url(#emblemOrangeGold)"
          opacity="0.9"
        />
        <circle cx="172" cy="90" r="5.5" fill="#FFE066" filter="url(#softGlow)" />

        {/* The Grand Bridge Arch (The 'Setu' Spanning the Divide) */}
        <path
          d="M 40 178 Q 120 50 200 178"
          stroke="url(#emblemOrangeGold)"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
          filter="url(#softGlow)"
        />

        {/* Bridge Roadway Deck */}
        <path
          d="M 36 172 L 204 172"
          stroke="url(#emblemOrangeGold)"
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        {/* Vertical Suspension Cables */}
        <line x1="88" y1="130" x2="88" y2="172" stroke="#FF8F3D" strokeWidth="1.6" opacity="0.85" />
        <line x1="104" y1="106" x2="104" y2="172" stroke="#FF8F3D" strokeWidth="1.6" opacity="0.85" />
        <line x1="120" y1="94" x2="120" y2="172" stroke="#FFE066" strokeWidth="2.2" opacity="0.95" />
        <line x1="136" y1="106" x2="136" y2="172" stroke="#FF8F3D" strokeWidth="1.6" opacity="0.85" />
        <line x1="152" y1="130" x2="152" y2="172" stroke="#FF8F3D" strokeWidth="1.6" opacity="0.85" />

        {/* Central Spire of Potential & Upward Mobility */}
        <g transform="translate(120, 52)">
          {/* Pulsating North Star */}
          <path
            d="M 0 -22 L 5 -5 L 22 0 L 5 5 L 0 22 L -5 5 L -22 0 L -5 -5 Z"
            fill="#FFFFFF"
            filter="url(#softGlow)"
          />
          <circle cx="0" cy="0" r="4" fill="#FF4D00" />
        </g>
      </svg>
    </div>
  );
};
