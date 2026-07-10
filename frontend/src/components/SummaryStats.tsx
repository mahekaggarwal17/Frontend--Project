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
    description: 'Matching active filters',
    icon: Users,
    iconColor: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
    trend: '+12%',
  },
  {
    title: 'Total Reach',
    key: 'followers',
    description: 'Combined follower count',
    icon: Eye,
    iconColor: 'text-zinc-400 bg-zinc-800 border-zinc-700',
    trend: '+8.4%',
  },
  {
    title: 'Avg. Engagement',
    key: 'engagement',
    description: 'Roster average rate',
    icon: Activity,
    iconColor: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    trend: '+3.1%',
  },
  {
    title: 'Active Profiles',
    key: 'active',
    description: 'Current agency roster',
    icon: Award,
    iconColor: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
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
    isLoading ? null : total.toString(),
    isLoading ? null : formatNumber(totalFollowers),
    isLoading ? null : `${avgEngagement}%`,
    isLoading ? null : `${activeCount} / ${total}`,
  ];

  return (
    <div
      ref={containerRef}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      role="region"
      aria-label="Summary statistics"
    >
      {STATS_CONFIG.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div
            key={idx}
            className="stat-card group rounded-xl border border-zinc-800 bg-zinc-900/20 p-5 hover:border-zinc-700 transition-all duration-150 cursor-default"
          >
            <div className="relative z-10">
              {/* Top row */}
              <div className="flex items-start justify-between mb-3">
                <div
                  className={`p-2.5 rounded-lg border ${stat.iconColor} transition-transform duration-150`}
                  aria-hidden="true"
                >
                  <Icon size={18} />
                </div>
                <div
                  className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-zinc-800/50 border border-zinc-700/60"
                  aria-label={`Trend: ${stat.trend}`}
                >
                  <TrendingUp size={10} className="text-zinc-500" aria-hidden="true" />
                  <span className="text-[10px] font-mono font-medium text-zinc-400">
                    {stat.trend}
                  </span>
                </div>
              </div>

              {/* Value — skeleton shimmer when loading */}
              <div className="space-y-1">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500 transition-colors duration-150">
                  {stat.title}
                </p>
                {values[idx] === null ? (
                  <div className="h-8 w-20 rounded bg-zinc-800/70 animate-pulse" aria-hidden="true" />
                ) : (
                  <h3
                    className="text-2xl font-bold tracking-tight text-zinc-100 transition-colors duration-150 font-display"
                    aria-label={`${stat.title}: ${values[idx]}`}
                  >
                    {values[idx]}
                  </h3>
                )}
                <p className="text-[11px] text-zinc-500 transition-colors duration-150">
                  {stat.description}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
