'use client';

import React, { useRef, useEffect } from 'react';
import { Users, Eye, Activity, Award } from 'lucide-react';
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

    const cards = containerRef.current.children;
    gsap.fromTo(
      cards,
      { opacity: 0, y: 16, scale: 0.98 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        stagger: 0.06,
        ease: 'power3.out',
        overwrite: 'auto',
      }
    );
  }, [isLoading]);

  const statsList = [
    {
      title: 'Total Creators',
      value: isLoading ? '...' : total.toString(),
      description: 'Matching current filters',
      icon: <Users size={20} className="text-indigo-400" />,
      bg: 'from-indigo-500/5 to-transparent border-indigo-500/10 hover:border-indigo-500/30',
      glow: 'group-hover:bg-indigo-500/5',
    },
    {
      title: 'Total Reach',
      value: isLoading ? '...' : formatNumber(totalFollowers),
      description: 'Followers combined reach',
      icon: <Eye size={20} className="text-sky-400" />,
      bg: 'from-sky-500/5 to-transparent border-sky-500/10 hover:border-sky-500/30',
      glow: 'group-hover:bg-sky-500/5',
    },
    {
      title: 'Avg. Engagement',
      value: isLoading ? '...' : `${avgEngagement}%`,
      description: 'High-performing metric',
      icon: <Activity size={20} className="text-emerald-400" />,
      bg: 'from-emerald-500/5 to-transparent border-emerald-500/10 hover:border-emerald-500/30',
      glow: 'group-hover:bg-emerald-500/5',
    },
    {
      title: 'Active Profiles',
      value: isLoading ? '...' : `${activeCount} / ${total}`,
      description: 'Current agency roster',
      icon: <Award size={20} className="text-amber-400" />,
      bg: 'from-amber-500/5 to-transparent border-amber-500/10 hover:border-amber-500/30',
      glow: 'group-hover:bg-amber-500/5',
    },
  ];

  return (
    <div 
      ref={containerRef}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
    >
      {statsList.map((stat, idx) => (
        <div
          key={idx}
          className={`group relative overflow-hidden p-6 rounded-2xl border bg-gradient-to-br ${stat.bg} bg-slate-900/20 backdrop-blur-xl shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/5`}
        >
          {/* Subtle hover background glow */}
          <div className={`absolute inset-0 -z-10 transition-colors duration-300 ${stat.glow}`} />
          
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 group-hover:text-slate-300 transition-colors duration-300">
              {stat.title}
            </span>
            <span className="p-2 rounded-xl bg-slate-950/40 border border-slate-900/60 group-hover:scale-105 transition-transform duration-300">
              {stat.icon}
            </span>
          </div>

          <div className="mt-4 space-y-1">
            <h3 className="text-2xl font-bold tracking-tight text-slate-100 group-hover:text-white transition-colors duration-300">
              {stat.value}
            </h3>
            <p className="text-xs text-slate-500 group-hover:text-slate-400 font-medium transition-colors duration-300">
              {stat.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
