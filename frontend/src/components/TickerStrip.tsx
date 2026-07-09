'use client';

import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';

// Simulated brand/platform logos as text badges (no external images needed)
const BRANDS = [
  { name: 'YouTube', color: '#FF0000' },
  { name: 'Instagram', color: '#E1306C' },
  { name: 'TikTok', color: '#00BCFF' },
  { name: 'Spotify', color: '#1DB954' },
  { name: 'Pinterest', color: '#E60023' },
  { name: 'LinkedIn', color: '#0A66C2' },
  { name: 'Snapchat', color: '#FFFC00' },
  { name: 'X / Twitter', color: '#ffffff' },
  { name: 'Twitch', color: '#9146FF' },
  { name: 'Facebook', color: '#1877F2' },
];

interface TickerStripProps {
  label?: string;
  items?: typeof BRANDS;
  speed?: number; // seconds for full loop
  direction?: 'left' | 'right';
}

export default function TickerStrip({
  label = 'Platforms Supported',
  items = BRANDS,
  speed = 28,
  direction = 'left',
}: TickerStripProps) {
  const track1Ref = useRef<HTMLDivElement>(null);
  const track2Ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  // Pure CSS infinite marquee — no GSAP needed (GPU-composited)
  const moveDir = direction === 'left' ? 'marquee-left' : 'marquee-right';

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-800/60 bg-slate-900/20 backdrop-blur-xl py-0">
      {/* Header row */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800/50">
        <div className="flex items-center gap-2">
          {/* Blinking dot — Monk-E "Recording" style */}
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
          </span>
          <span className="text-[10px] font-mono font-semibold uppercase tracking-[0.2em] text-slate-500">
            {label}
          </span>
        </div>
        <span className="text-[10px] text-slate-600 font-mono">{items.length} platforms</span>
      </div>

      {/* Ticker track */}
      <div
        ref={containerRef}
        className="flex overflow-hidden py-4 gap-0 cursor-pointer select-none"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        aria-label="Platform ticker"
      >
        {/* Two copies for seamless loop */}
        {[0, 1].map((copy) => (
          <div
            key={copy}
            className="flex items-center gap-4 shrink-0 pr-4"
            style={{
              animation: `marquee-scroll-${direction} ${speed}s linear infinite`,
              animationPlayState: paused ? 'paused' : 'running',
            }}
          >
            {items.map((brand, i) => (
              <div
                key={`${copy}-${i}`}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border bg-slate-950/50 backdrop-blur-sm whitespace-nowrap transition-all duration-300 group hover:scale-105"
                style={{ borderColor: `${brand.color}25` }}
              >
                {/* Color dot */}
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ background: brand.color, boxShadow: `0 0 6px ${brand.color}80` }}
                />
                <span className="text-xs font-semibold text-slate-400 group-hover:text-slate-200 transition-colors duration-200">
                  {brand.name}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Edge fade masks */}
      <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#030712] to-transparent pointer-events-none z-10" />
      <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#030712] to-transparent pointer-events-none z-10" />
    </div>
  );
}
