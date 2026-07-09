'use client';

import React, { useRef, useEffect } from 'react';
import { Niche } from '../types';
import { BarChart3 } from 'lucide-react';
import gsap from 'gsap';

interface NicheBreakdownProps {
  nicheCounts?: Record<Niche, number>;
  total: number;
  isLoading: boolean;
}

const NICHE_COLORS: Record<Niche, { bar: string; text: string; bg: string }> = {
  beauty: { bar: 'bg-pink-500', text: 'text-pink-400', bg: 'bg-pink-500/10' },
  fitness: { bar: 'bg-emerald-500', text: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  travel: { bar: 'bg-teal-500', text: 'text-teal-400', bg: 'bg-teal-500/10' },
  food: { bar: 'bg-amber-500', text: 'text-amber-400', bg: 'bg-amber-500/10' },
  tech: { bar: 'bg-indigo-500', text: 'text-indigo-400', bg: 'bg-indigo-500/10' },
  fashion: { bar: 'bg-purple-500', text: 'text-purple-400', bg: 'bg-purple-500/10' },
};

export default function NicheBreakdown({ nicheCounts, total, isLoading }: NicheBreakdownProps) {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isLoading || !nicheCounts || !gridRef.current) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const items = gridRef.current.children;
    gsap.fromTo(
      items,
      { opacity: 0, y: 12 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.04,
        ease: 'power3.out',
        overwrite: 'auto',
      }
    );
  }, [isLoading, nicheCounts]);

  if (isLoading || !nicheCounts) {
    return (
      <div className="p-6 border border-slate-800 bg-slate-900/20 backdrop-blur-xl rounded-2xl animate-pulse space-y-4">
        <div className="h-4 bg-slate-800 rounded w-1/3"></div>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-1">
              <div className="flex justify-between">
                <div className="h-3 bg-slate-800 rounded w-16"></div>
                <div className="h-3 bg-slate-800 rounded w-8"></div>
              </div>
              <div className="h-2 bg-slate-800 rounded-full w-full"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const sortedNiches = (Object.keys(nicheCounts) as Niche[])
    .map((niche) => {
      const count = nicheCounts[niche] || 0;
      const percentage = total > 0 ? Number(((count / total) * 100).toFixed(0)) : 0;
      return { niche, count, percentage };
    })
    .sort((a, b) => b.count - a.count);

  return (
    <div className="p-6 border border-slate-800/60 bg-slate-900/20 rounded-2xl space-y-4 backdrop-blur-xl shadow-lg shadow-indigo-500/2">
      <div className="flex items-center gap-2 border-b border-slate-800/60 pb-3">
        <BarChart3 size={18} className="text-indigo-400" />
        <h3 className="text-sm font-semibold tracking-wider uppercase text-slate-400">
          Category Distribution
        </h3>
      </div>

      <div 
        ref={gridRef}
        className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4"
      >
        {sortedNiches.map(({ niche, count, percentage }) => {
          const colors = NICHE_COLORS[niche];
          return (
            <div key={niche} className="space-y-1.5 select-none group">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="capitalize text-slate-300 group-hover:text-slate-200 transition-colors duration-200">{niche}</span>
                <span className="text-slate-400 group-hover:text-slate-350 transition-colors duration-200">
                  {count} <span className="text-slate-600 font-normal">({percentage}%)</span>
                </span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-slate-950/80 overflow-hidden border border-slate-900/50 p-0.5">
                <div
                  className={`h-full rounded-full ${colors.bar} transition-all duration-700 ease-out`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
