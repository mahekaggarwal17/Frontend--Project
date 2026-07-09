'use client';

import React, { useRef, useEffect } from 'react';
import { Users, Eye, Activity, Award, TrendingUp } from 'lucide-react';
import gsap from 'gsap';

interface SummaryStatsProps {
  total: number;
  totalFollowers: number;
  avgEngagement: number;
  activeCount: number;
  isLoading: boolean;
}

function formatNumber(num: number): string {
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(2).replace(/\.00$/, '') + 'M';
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return num.toString();
}

const STATS_CONFIG = [
  {
    title: 'Total Creators',
    key: 'total',
    description: 'Matching current filters',
    icon: Users,
    accent: '#6366f1',
    glow: 'rgba(99,102,241,0.2)',
    border: 'hover:border-indigo-500/40',
    iconBg: 'bg-indigo-500/10 text-indigo-400',
    gradient: 'from-indigo-500/8 via-transparent to-transparent',
    trend: '+12%',
  },
  {
    title: 'Total Reach',
    key: 'followers',
    description: 'Combined follower count',
    icon: Eye,
    accent: '#00BCFF',
    glow: 'rgba(0,188,255,0.2)',
    border: 'hover:border-[#00BCFF]/40',
    iconBg: 'bg-[#00BCFF]/10 text-[#00BCFF]',
    gradient: 'from-[#00BCFF]/8 via-transparent to-transparent',
    trend: '+8.4%',
  },
  {
    title: 'Avg. Engagement',
    key: 'engagement',
    description: 'High-performing metric',
    icon: Activity,
    accent: '#BBF351',
    glow: 'rgba(187,243,81,0.2)',
    border: 'hover:border-[#BBF351]/40',
    iconBg: 'bg-[#BBF351]/10 text-[#BBF351]',
    gradient: 'from-[#BBF351]/8 via-transparent to-transparent',
    trend: '+3.1%',
  },
  {
    title: 'Active Profiles',
    key: 'active',
    description: 'Current agency roster',
    icon: Award,
    accent: '#8B5CF6',
    glow: 'rgba(139,92,246,0.2)',
    border: 'hover:border-purple-500/40',
    iconBg: 'bg-purple-500/10 text-purple-400',
    gradient: 'from-purple-500/8 via-transparent to-transparent',
    trend: 'Steady',
  },
];

export default function SummaryStats({
  total,
  totalFollowers,
  avgEngagement,
  activeCount,
  isLoading,
}: SummaryStatsProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isLoading || !containerRef.current) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const cards = containerRef.current.querySelectorAll('.stat-card');
    gsap.fromTo(
      cards,
      { opacity: 0, y: 20, scale: 0.97 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.55,
        stagger: 0.08,
        ease: 'power3.out',
        overwrite: 'auto',
      }
    );
  }, [isLoading]);

  const values = [
    isLoading ? '—' : total.toString(),
    isLoading ? '—' : formatNumber(totalFollowers),
    isLoading ? '—' : `${avgEngagement}%`,
    isLoading ? '—' : `${activeCount} / ${total}`,
  ];

  return (
    <div ref={containerRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {STATS_CONFIG.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div
            key={idx}
            className={`stat-card group relative overflow-hidden rounded-2xl border border-slate-800/60 bg-slate-900/30 backdrop-blur-xl p-5 transition-all duration-300 hover:-translate-y-1.5 ${stat.border} cursor-default`}
            style={{
              transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = `0 8px 32px ${stat.glow}, 0 0 0 1px ${stat.accent}22`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '';
            }}
          >
            {/* Background gradient */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}
            />
            {/* Corner glow dot */}
            <div
              className="absolute -top-6 -right-6 w-24 h-24 rounded-full blur-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-500"
              style={{ background: stat.accent }}
            />

            <div className="relative z-10">
              {/* Top row */}
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`p-2.5 rounded-xl border border-white/5 ${stat.iconBg} group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon size={18} />
                </div>
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-800/60 border border-slate-700/40">
                  <TrendingUp size={10} style={{ color: stat.accent }} />
                  <span className="text-[10px] font-mono font-semibold" style={{ color: stat.accent }}>
                    {stat.trend}
                  </span>
                </div>
              </div>

              {/* Value */}
              <div className="space-y-1">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 group-hover:text-slate-400 transition-colors duration-300">
                  {stat.title}
                </p>
                <h3 className="text-2xl font-bold tracking-tight text-slate-100 group-hover:text-white transition-colors duration-300 font-display">
                  {values[idx]}
                </h3>
                <p className="text-[11px] text-slate-600 group-hover:text-slate-500 transition-colors duration-300">
                  {stat.description}
                </p>
              </div>

              {/* Bottom accent bar */}
              <div
                className="mt-4 h-[2px] w-0 rounded-full group-hover:w-full transition-all duration-500 ease-out"
                style={{ background: `linear-gradient(90deg, ${stat.accent}, transparent)` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
