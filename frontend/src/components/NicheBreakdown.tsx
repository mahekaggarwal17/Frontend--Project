'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Niche } from '../types';
import { BarChart3, Sparkles } from 'lucide-react';
import gsap from 'gsap';

interface NicheBreakdownProps {
  nicheCounts?: Record<Niche, number>;
  total: number;
  isLoading: boolean;
}

const NICHE_CONFIG: Record<Niche, { color: string; glow: string; label: string; emoji: string }> = {
  beauty:  { color: '#f472b6', glow: 'rgba(244,114,182,0.25)', label: 'Beauty',  emoji: '✨' },
  fitness: { color: '#34d399', glow: 'rgba(52,211,153,0.25)',  label: 'Fitness', emoji: '💪' },
  travel:  { color: '#2dd4bf', glow: 'rgba(45,212,191,0.25)', label: 'Travel',  emoji: '✈️' },
  food:    { color: '#fbbf24', glow: 'rgba(251,191,36,0.25)',  label: 'Food',    emoji: '🍽️' },
  tech:    { color: '#818cf8', glow: 'rgba(129,140,248,0.25)', label: 'Tech',    emoji: '⚡' },
  fashion: { color: '#c084fc', glow: 'rgba(192,132,252,0.25)', label: 'Fashion', emoji: '👗' },
};

export default function NicheBreakdown({ nicheCounts, total, isLoading }: NicheBreakdownProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const barsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [hoveredNiche, setHoveredNiche] = useState<string | null>(null);

  useEffect(() => {
    if (isLoading || !nicheCounts || !containerRef.current) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Stagger the rows
    const rows = containerRef.current.querySelectorAll('.niche-row');
    if (!prefersReduced) {
      gsap.fromTo(rows,
        { opacity: 0, x: -16 },
        { opacity: 1, x: 0, duration: 0.5, stagger: 0.06, ease: 'power3.out', overwrite: 'auto' }
      );
    }

    // Animate bar widths
    barsRef.current.forEach((bar, i) => {
      if (!bar) return;
      const target = bar.dataset.width || '0';
      if (prefersReduced) {
        bar.style.width = `${target}%`;
        return;
      }
      gsap.fromTo(bar,
        { width: '0%' },
        { width: `${target}%`, duration: 0.9, delay: i * 0.07, ease: 'power2.out' }
      );
    });
  }, [isLoading, nicheCounts]);

  if (isLoading || !nicheCounts) {
    return (
      <div className="rounded-2xl border border-slate-800/60 bg-slate-900/20 backdrop-blur-xl p-6 space-y-5 animate-pulse">
        <div className="h-4 bg-slate-800/70 rounded w-40" />
        {[...Array(4)].map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="flex justify-between">
              <div className="h-3 bg-slate-800/70 rounded w-20" />
              <div className="h-3 bg-slate-800/70 rounded w-10" />
            </div>
            <div className="h-2.5 bg-slate-800/50 rounded-full w-full" />
          </div>
        ))}
      </div>
    );
  }

  const sorted = (Object.keys(nicheCounts) as Niche[])
    .map((niche) => {
      const count = nicheCounts[niche] || 0;
      const pct = total > 0 ? Math.round((count / total) * 100) : 0;
      return { niche, count, pct };
    })
    .sort((a, b) => b.count - a.count);

  const topNiche = sorted[0]?.niche;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-800/60 bg-slate-900/20 backdrop-blur-xl shadow-xl">
      {/* Subtle animated corner gradient */}
      <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-indigo-500/5 blur-2xl pointer-events-none" />

      <div className="relative p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
              <BarChart3 size={15} className="text-indigo-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-200 font-display">Category Distribution</h3>
              <p className="text-[10px] text-slate-600 font-mono mt-0.5">{total} creators total</p>
            </div>
          </div>
          {topNiche && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800/60 border border-slate-700/40">
              <Sparkles size={10} style={{ color: NICHE_CONFIG[topNiche].color }} />
              <span className="text-[10px] font-mono font-semibold capitalize" style={{ color: NICHE_CONFIG[topNiche].color }}>
                {topNiche} leads
              </span>
            </div>
          )}
        </div>

        {/* Niche Rows */}
        <div ref={containerRef} className="space-y-3">
          {sorted.map(({ niche, count, pct }, i) => {
            const cfg = NICHE_CONFIG[niche as Niche];
            const isHovered = hoveredNiche === niche;
            return (
              <div
                key={niche}
                className="niche-row group space-y-1.5 cursor-default"
                onMouseEnter={() => setHoveredNiche(niche)}
                onMouseLeave={() => setHoveredNiche(null)}
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-base leading-none select-none">{cfg.emoji}</span>
                    <span
                      className="font-semibold capitalize transition-colors duration-200"
                      style={{ color: isHovered ? cfg.color : '#cbd5e1' }}
                    >
                      {cfg.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-semibold text-slate-300">{count}</span>
                    <span
                      className="font-mono text-[10px] px-1.5 py-0.5 rounded-full transition-all duration-200"
                      style={{
                        color: cfg.color,
                        background: isHovered ? `${cfg.color}18` : 'rgba(15,23,42,0.5)',
                        border: `1px solid ${isHovered ? cfg.color + '40' : 'transparent'}`,
                      }}
                    >
                      {pct}%
                    </span>
                  </div>
                </div>

                {/* Bar track */}
                <div className="h-2 w-full rounded-full bg-slate-950/70 border border-slate-800/50 overflow-hidden">
                  <div
                    ref={(el) => { barsRef.current[i] = el; }}
                    data-width={pct}
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: '0%',
                      background: isHovered
                        ? `linear-gradient(90deg, ${cfg.color}, ${cfg.color}bb)`
                        : `linear-gradient(90deg, ${cfg.color}cc, ${cfg.color}66)`,
                      boxShadow: isHovered ? `0 0 10px ${cfg.glow}` : 'none',
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
