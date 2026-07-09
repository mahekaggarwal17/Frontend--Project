'use client';

import React from 'react';
import { Users, Eye, Activity, Award } from 'lucide-react';

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
  
  const statsList = [
    {
      title: 'Total Creators',
      value: isLoading ? '...' : total.toString(),
      description: 'Matching current filters',
      icon: <Users size={20} className="text-indigo-400" />,
      bg: 'from-indigo-500/10 to-transparent border-indigo-500/15',
    },
    {
      title: 'Total Reach',
      value: isLoading ? '...' : formatNumber(totalFollowers),
      description: 'Followers combined reach',
      icon: <Eye size={20} className="text-sky-400" />,
      bg: 'from-sky-500/10 to-transparent border-sky-500/15',
    },
    {
      title: 'Avg. Engagement',
      value: isLoading ? '...' : `${avgEngagement}%`,
      description: 'High-performing metric',
      icon: <Activity size={20} className="text-emerald-400" />,
      bg: 'from-emerald-500/10 to-transparent border-emerald-500/15',
    },
    {
      title: 'Active Profiles',
      value: isLoading ? '...' : `${activeCount} / ${total}`,
      description: 'Current agency roster',
      icon: <Award size={20} className="text-amber-400" />,
      bg: 'from-amber-500/10 to-transparent border-amber-500/15',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statsList.map((stat, idx) => (
        <div
          key={idx}
          className={`relative overflow-hidden p-6 rounded-2xl border bg-gradient-to-br ${stat.bg} bg-slate-900/40 backdrop-blur-md shadow-lg transition duration-200 hover:-translate-y-0.5 hover:shadow-xl`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-455">
              {stat.title}
            </span>
            <span className="p-2 rounded-xl bg-slate-950/60 border border-slate-800/80">
              {stat.icon}
            </span>
          </div>

          <div className="mt-4 space-y-1">
            <h3 className="text-2xl font-bold tracking-tight text-slate-100">
              {stat.value}
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              {stat.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
