'use client';

import React, { useRef, useEffect, useState } from 'react';
import { TrendingUp, Users, Eye, Zap } from 'lucide-react';
import gsap from 'gsap';

interface StatItem {
  value: number;
  suffix: string;
  label: string;
  sublabel: string;
  icon: React.ElementType;
  color: string;
  glow: string;
}

const HERO_STATS: StatItem[] = [
  {
    value: 85,
    suffix: 'B+',
    label: 'Total Views',
    sublabel: 'Across all creators',
    icon: Eye,
    color: '#00BCFF',
    glow: 'rgba(0,188,255,0.15)',
  },
  {
    value: 500,
    suffix: '+',
    label: 'Active Creators',
    sublabel: 'On the platform',
    icon: Users,
    color: '#BBF351',
    glow: 'rgba(187,243,81,0.12)',
  },
  {
    value: 120,
    suffix: '+',
    label: 'Brand Deals',
    sublabel: 'Campaigns this year',
    icon: Zap,
    color: '#c084fc',
    glow: 'rgba(192,132,252,0.12)',
  },
  {
    value: 4.8,
    suffix: '%',
    label: 'Avg. Engagement',
    sublabel: 'Industry-leading rate',
    icon: TrendingUp,
    color: '#34d399',
    glow: 'rgba(52,211,153,0.12)',
  },
];

function useCountUp(target: number, duration = 1.8, start = false) {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    if (!start) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) { setCurrent(target); return; }
    const startTime = performance.now();
    const tick = (now: number) => {
      const elapsed = (now - startTime) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3); // cubic ease out
      setCurrent(Number((target * ease).toFixed(target % 1 !== 0 ? 1 : 0)));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration, start]);
  return current;
}

function StatCounter({ stat, startCount }: { stat: StatItem; startCount: boolean }) {
  const Icon = stat.icon;
  const count = useCountUp(stat.value, 1.6, startCount);

  return (
    <div
      className="relative group overflow-hidden rounded-2xl border border-slate-800/60 bg-slate-900/30 backdrop-blur-xl p-6 transition-all duration-300 hover:-translate-y-1"
      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = `0 8px 40px ${stat.glow}`; e.currentTarget.style.borderColor = `${stat.color}30`; }}
      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = ''; e.currentTarget.style.borderColor = ''; }}
    >
      {/* Corner brackets — Monk-E style */}
      <span className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 rounded-tl-sm opacity-30 group-hover:opacity-80 transition-opacity duration-300" style={{ borderColor: stat.color }} />
      <span className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 rounded-tr-sm opacity-30 group-hover:opacity-80 transition-opacity duration-300" style={{ borderColor: stat.color }} />
      <span className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 rounded-bl-sm opacity-30 group-hover:opacity-80 transition-opacity duration-300" style={{ borderColor: stat.color }} />
      <span className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 rounded-br-sm opacity-30 group-hover:opacity-80 transition-opacity duration-300" style={{ borderColor: stat.color }} />

      {/* Ambient corner glow */}
      <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full blur-2xl opacity-0 group-hover:opacity-40 transition-opacity duration-500" style={{ background: stat.color }} />

      <div className="relative z-10">
        {/* Icon */}
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center mb-4 border border-white/5 transition-transform duration-300 group-hover:scale-110"
          style={{ background: `${stat.color}15` }}
        >
          <Icon size={17} style={{ color: stat.color }} />
        </div>

        {/* Big number — Monk-E bold stat style */}
        <div className="flex items-end gap-0.5 mb-1">
          <span
            className="text-4xl font-bold tracking-tight font-display leading-none"
            style={{ color: stat.color }}
          >
            {count}
          </span>
          <span
            className="text-2xl font-bold font-display leading-none mb-0.5"
            style={{ color: `${stat.color}aa` }}
          >
            {stat.suffix}
          </span>
        </div>

        <p className="text-sm font-semibold text-slate-200">{stat.label}</p>
        <p className="text-[11px] text-slate-500 mt-0.5">{stat.sublabel}</p>
      </div>
    </div>
  );
}

export default function HeroStats() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [startCount, setStartCount] = useState(false);

  useEffect(() => {
    if (!sectionRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStartCount(true); observer.disconnect(); } },
      { threshold: 0.2 }
    );
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={sectionRef}>
      {/* Section label — Monk-E tagline style */}
      <div className="flex items-center gap-3 mb-4">
        <div className="text-[10px] font-mono font-semibold uppercase tracking-[0.22em] text-slate-600">
          Platform at a Glance
        </div>
        <div className="h-[1px] flex-1 max-w-[80px] bg-gradient-to-r from-slate-800 to-transparent" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {HERO_STATS.map((stat, i) => (
          <StatCounter key={i} stat={stat} startCount={startCount} />
        ))}
      </div>
    </div>
  );
}
