'use client';

import React, { useEffect, useRef } from 'react';
import { Activity, Zap, Star } from 'lucide-react';
import gsap from 'gsap';

export default function Header() {
  const headerRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced || !headerRef.current) return;

    const tl = gsap.timeline();
    tl.fromTo(
      logoRef.current,
      { opacity: 0, x: -20 },
      { opacity: 1, x: 0, duration: 0.6, ease: 'power3.out' }
    );
    tl.fromTo(
      navRef.current,
      { opacity: 0, y: -10 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' },
      '-=0.3'
    );
    tl.fromTo(
      badgeRef.current,
      { opacity: 0, x: 20 },
      { opacity: 1, x: 0, duration: 0.5, ease: 'power3.out' },
      '-=0.3'
    );
  }, []);

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-40 w-full border-b border-slate-800/60 bg-[#030712]/80 backdrop-blur-2xl"
    >
      {/* Neon top accent line */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#00BCFF]/60 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo + Brand */}
        <div ref={logoRef} className="flex items-center gap-3">
          <div className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600/80 to-[#00BCFF]/60 border border-[#00BCFF]/30 shadow-[0_0_20px_rgba(0,188,255,0.20)]">
            <Zap size={18} className="text-white" />
            {/* Pulse ring */}
            <span className="absolute inset-0 rounded-xl border border-[#00BCFF]/40 animate-[ping_2.5s_ease-in-out_infinite] opacity-60" />
          </div>
          <div>
            <span className="text-base font-bold tracking-tight text-slate-100 font-display">
              Creator<span className="text-[#00BCFF]">CRM</span>
            </span>
            <div className="text-[10px] text-slate-500 font-mono -mt-0.5 tracking-widest uppercase">
              Admin Dashboard
            </div>
          </div>
        </div>

        {/* Nav Pills */}
        <nav ref={navRef} className="hidden sm:flex items-center gap-1">
          {['Directory', 'Analytics', 'Campaigns'].map((item, i) => (
            <button
              key={item}
              className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                i === 0
                  ? 'bg-slate-800/80 text-slate-100 border border-slate-700/60'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              {item}
            </button>
          ))}
        </nav>

        {/* Status Badge */}
        <div ref={badgeRef} className="flex items-center gap-3">
          {/* Live indicator */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/30 border border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold text-emerald-400 font-mono">LIVE</span>
          </div>

          {/* User avatar */}
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-[#8B5CF6] flex items-center justify-center text-xs font-bold text-white border-2 border-slate-700/60 shadow-[0_0_12px_rgba(139,92,246,0.25)]">
            A
          </div>
        </div>
      </div>
    </header>
  );
}
