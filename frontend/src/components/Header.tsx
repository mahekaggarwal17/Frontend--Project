'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Zap, Menu, X } from 'lucide-react';
import gsap from 'gsap';

const NAV_ITEMS = ['Directory', 'Analytics', 'Campaigns'] as const;

export default function Header() {
  const headerRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced || !headerRef.current) return;

    // Stagger entrance animation on load
    const tl = gsap.timeline();
    tl.fromTo(logoRef.current,
      { opacity: 0, x: -16 },
      { opacity: 1, x: 0, duration: 0.5, ease: 'power3.out' }
    ).fromTo(navRef.current,
      { opacity: 0, y: -8 },
      { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' },
      '-=0.25'
    ).fromTo(badgeRef.current,
      { opacity: 0, x: 16 },
      { opacity: 1, x: 0, duration: 0.4, ease: 'power3.out' },
      '-=0.25'
    );
  }, []);

  return (
    <>
      {/* Skip-link for keyboard navigation accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-[#00BCFF] focus:text-slate-900 focus:font-bold focus:rounded-lg focus:text-sm"
      >
        Skip to main content
      </a>

      <header
        ref={headerRef}
        className="sticky top-0 z-[var(--z-sticky,30)] w-full border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md"
        role="banner"
      >
        {/* Top border spacer */}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">

          {/* Logo */}
          <div ref={logoRef} className="flex items-center gap-3 shrink-0">
            <div
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 shadow-sm"
              aria-hidden="true"
            >
              <Zap size={18} />
            </div>
            <div>
              {/* Dashboard branding title */}
              <span className="text-base font-bold tracking-tight text-zinc-100 font-display" aria-label="CreatorCRM Admin Dashboard">
                Creator<span className="text-blue-500">CRM</span>
              </span>
              <div className="text-[10px] text-slate-500 font-mono -mt-0.5 tracking-widest uppercase" aria-hidden="true">
                Admin Dashboard
              </div>
            </div>
          </div>

          {/* Desktop Navigation links */}
          <nav
            ref={navRef}
            className="hidden sm:flex items-center gap-1"
            aria-label="Main navigation"
          >
            {NAV_ITEMS.map((item, i) => (
              <button
                key={item}
                className={`touch-compact px-4 py-2 text-sm font-medium rounded-lg transition-all duration-150 cursor-pointer ${
                  i === 0
                    ? 'bg-zinc-800 text-zinc-100 border border-zinc-700'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
                }`}
                aria-current={i === 0 ? 'page' : undefined}
              >
                {item}
              </button>
            ))}
          </nav>

          {/* Right side */}
          <div ref={badgeRef} className="flex items-center gap-3 shrink-0">
            {/* Live indicator */}
            <div
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/20 border border-emerald-900/30 touch-compact"
              aria-label="System live"
              role="status"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
              <span className="text-xs font-semibold text-emerald-500 font-mono">LIVE</span>
            </div>

            {/* User Profile avatar */}
            <div
              className="w-9 h-9 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-xs font-bold text-zinc-200 border border-zinc-700 touch-compact cursor-pointer transition-colors duration-150"
              aria-label="User profile: Admin"
              role="button"
              tabIndex={0}
            >
              A
            </div>

            {/* Mobile hamburger menu toggle */}
            <button
              className="flex sm:hidden items-center justify-center w-10 h-10 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 transition-colors duration-200 touch-compact cursor-pointer"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation menu dropdown */}
        {mobileOpen && (
          <nav
            id="mobile-nav"
            className="sm:hidden border-t border-slate-800/50 bg-[#030712]/95 backdrop-blur-2xl px-4 py-3 flex flex-col gap-1 animate-slide-up"
            aria-label="Mobile navigation"
          >
            {NAV_ITEMS.map((item, i) => (
              <button
                key={item}
                className={`w-full text-left px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 cursor-pointer ${
                  i === 0
                    ? 'bg-slate-800/80 text-slate-100'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
                aria-current={i === 0 ? 'page' : undefined}
                onClick={() => setMobileOpen(false)}
              >
                {item}
              </button>
            ))}
          </nav>
        )}
      </header>
    </>
  );
}
