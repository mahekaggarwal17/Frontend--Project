'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Creator, CreatorResponse } from '../types';
import {
  ArrowUpDown, ArrowUp, ArrowDown,
  Edit2, Trash2, MoreHorizontal, AlertTriangle, FolderOpen, ChevronLeft, ChevronRight
} from 'lucide-react';
import gsap from 'gsap';

interface CreatorsTableProps {
  creatorsData?: CreatorResponse;
  isLoading: boolean;
  isError: boolean;
  error?: Error | null;
  sortBy?: string;
  order?: 'asc' | 'desc';
  onSort: (column: string) => void;
  page: number;
  limit: number;
  onPageChange: (newPage: number) => void;
  onEdit: (creator: Creator) => void;
  onDelete: (creator: Creator) => void;
  onRetry: () => void;
}

function formatFollowers(num: number): string {
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (num >= 1_000) return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
  return num.toString();
}

const NICHE_CONFIG: Record<string, { color: string; bg: string; border: string }> = {
  beauty:  { color: '#f472b6', bg: 'rgba(244,114,182,0.10)', border: 'rgba(244,114,182,0.25)' },
  fitness: { color: '#34d399', bg: 'rgba(52,211,153,0.10)',  border: 'rgba(52,211,153,0.25)'  },
  travel:  { color: '#2dd4bf', bg: 'rgba(45,212,191,0.10)',  border: 'rgba(45,212,191,0.25)'  },
  food:    { color: '#fbbf24', bg: 'rgba(251,191,36,0.10)',   border: 'rgba(251,191,36,0.25)'  },
  tech:    { color: '#818cf8', bg: 'rgba(129,140,248,0.10)', border: 'rgba(129,140,248,0.25)' },
  fashion: { color: '#c084fc', bg: 'rgba(192,132,252,0.10)', border: 'rgba(192,132,252,0.25)' },
};

export default function CreatorsTable({
  creatorsData, isLoading, isError, error,
  sortBy, order, onSort, page, limit, onPageChange, onEdit, onDelete, onRetry,
}: CreatorsTableProps) {
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const tbodyRef = useRef<HTMLTableSectionElement>(null);

  useEffect(() => {
    if (isLoading || !tbodyRef.current) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;
    gsap.fromTo(
      tbodyRef.current.children,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.45, stagger: 0.04, ease: 'power3.out', overwrite: 'auto' }
    );
  }, [isLoading, creatorsData]);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('.actions-menu-container')) {
        return;
      }
      setActiveMenuId(null);
    };
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, []);

  const SortIcon = ({ col }: { col: string }) => {
    if (sortBy !== col) return <ArrowUpDown size={13} className="ml-1.5 opacity-30 group-hover:opacity-70 transition-opacity" />;
    return order === 'desc'
      ? <ArrowDown size={13} className="ml-1.5 text-blue-500" />
      : <ArrowUp size={13} className="ml-1.5 text-blue-500" />;
  };

  /* ── Loading skeleton ── */
  if (isLoading) {
    return (
      <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/20 shadow-sm">
        <table className="w-full text-left text-sm border-collapse">
          <thead className="bg-zinc-900/50 border-b border-zinc-800">
            <tr>
              {['Name', 'Niche', 'Followers', 'Engagement', 'Status', 'Actions'].map((h) => (
                <th key={h} className="px-6 py-4 text-[11px] font-semibold uppercase tracking-widest text-zinc-500">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-900/50">
            {[...Array(6)].map((_, i) => (
              <tr key={i} className="animate-pulse">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-zinc-800/70" />
                    <div className="space-y-1.5">
                      <div className="h-3.5 bg-zinc-800/70 rounded w-28" />
                      <div className="h-2.5 bg-zinc-800/50 rounded w-36" />
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4"><div className="h-6 bg-zinc-800/60 rounded-full w-16" /></td>
                <td className="px-6 py-4"><div className="h-3.5 bg-zinc-800/60 rounded w-14" /></td>
                <td className="px-6 py-4"><div className="h-3.5 bg-zinc-800/60 rounded w-12" /></td>
                <td className="px-6 py-4"><div className="h-6 bg-zinc-800/60 rounded-full w-16" /></td>
                <td className="px-6 py-4"><div className="h-8 bg-zinc-800/60 rounded-lg w-8 ml-auto" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  /* ── Error state ── */
  if (isError) {
    return (
      <div className="p-10 rounded-xl border border-red-900/20 bg-red-950/5 text-center space-y-5">
        <div className="inline-flex p-4 rounded-xl bg-red-950/30 border border-red-900/25 text-red-400">
          <AlertTriangle size={30} />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-semibold text-red-200 font-display">Couldn't load creators.</h3>
          <p className="text-sm text-red-400/70 max-w-sm mx-auto">
            Please try again. {error?.message ? `(${error.message})` : ''}
          </p>
        </div>
        <button
          onClick={onRetry}
          className="px-5 py-2.5 text-sm font-semibold rounded-xl border border-red-500/40 text-red-450 hover:bg-red-500/10 hover:border-red-500/65 transition-all duration-150 cursor-pointer"
        >
          Retry
        </button>
      </div>
    );
  }

  const creators = creatorsData?.data || [];
  const totalItems = creatorsData?.total || 0;
  const totalPages = Math.ceil(totalItems / limit) || 1;

  /* ── Empty state ── */
  if (creators.length === 0) {
    return (
      <div className="py-20 rounded-xl border border-zinc-800 bg-zinc-900/20 text-center space-y-4">
        <div className="inline-flex p-5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-600">
          <FolderOpen size={32} />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-semibold text-zinc-300 font-display">No creators found</h3>
          <p className="text-sm text-zinc-550 max-w-xs mx-auto">
            Try clearing your filters or adjusting follower ranges.
          </p>
        </div>
      </div>
    );
  }

  /* ── Name avatar initials ── */
  function initials(name: string) {
    return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  }

  const AVATAR_COLORS = [
    ['#6366f1','#4f46e5'], ['#00BCFF','#0284c7'], ['#c084fc','#9333ea'],
    ['#34d399','#059669'], ['#f472b6','#db2777'], ['#fbbf24','#d97706'],
  ];

  return (
    <div className="space-y-3">
      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-800/60 bg-slate-900/20 backdrop-blur-xl shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-slate-900/50 border-b border-slate-800/80">
                <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-widest text-slate-500">
                  Creator
                </th>
                <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-widest text-slate-500">
                  Niche
                </th>
                <th
                  className="px-6 py-4 text-[11px] font-semibold uppercase tracking-widest text-slate-500 cursor-pointer group select-none"
                  onClick={() => onSort('followerCount')}
                >
                  <div className="flex items-center">Followers <SortIcon col="followerCount" /></div>
                </th>
                <th
                  className="px-6 py-4 text-[11px] font-semibold uppercase tracking-widest text-slate-500 cursor-pointer group select-none"
                  onClick={() => onSort('engagementRate')}
                >
                  <div className="flex items-center">Engagement <SortIcon col="engagementRate" /></div>
                </th>
                <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-widest text-slate-500">
                  Status
                </th>
                <th className="px-6 py-4 text-right text-[11px] font-semibold uppercase tracking-widest text-slate-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody ref={tbodyRef} className="divide-y divide-slate-900/60">
              {creators.map((c, idx) => {
                const nCfg = NICHE_CONFIG[c.niche];
                const [av1, av2] = AVATAR_COLORS[idx % AVATAR_COLORS.length];
                const isOptimistic = c.id.startsWith('temp-');

                return (
                  <tr
                    key={c.id}
                    className={`group transition-colors duration-150 hover:bg-slate-800/20 ${isOptimistic ? 'opacity-50' : ''}`}
                  >
                    {/* Creator name + avatar */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-lg"
                          style={{ background: `linear-gradient(135deg, ${av1}, ${av2})`, boxShadow: `0 0 14px ${av1}30` }}
                        >
                          {initials(c.name)}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-100 group-hover:text-white transition-colors duration-150 text-sm">
                            {c.name}
                          </div>
                          <div className="text-slate-500 text-xs mt-0.5 font-mono">{c.email}</div>
                        </div>
                      </div>
                    </td>

                    {/* Niche */}
                    <td className="px-6 py-4">
                      <span
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize border"
                        style={nCfg ? { color: nCfg.color, background: nCfg.bg, borderColor: nCfg.border } : {}}
                      >
                        {c.niche}
                      </span>
                    </td>

                    {/* Followers */}
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm font-semibold text-slate-200">
                        {formatFollowers(c.followerCount)}
                      </span>
                    </td>

                    {/* Engagement */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-semibold text-slate-200">{c.engagementRate}%</span>
                        {/* Mini sparkline bar */}
                        <div className="w-12 h-1.5 rounded-full bg-slate-800/60 overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${Math.min((c.engagementRate / 10) * 100, 100)}%`,
                              background: c.engagementRate >= 5 ? '#34d399' : c.engagementRate >= 2.5 ? '#fbbf24' : '#f87171',
                            }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                          c.status === 'active'
                            ? 'bg-emerald-950/30 text-emerald-400 border-emerald-500/25'
                            : 'bg-slate-900/40 text-slate-500 border-slate-800/60'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            c.status === 'active' ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'
                          }`}
                        />
                        {c.status}
                      </span>
                    </td>

                    {/* Actions menu */}
                    <td 
                      className="px-6 py-4 text-right relative actions-menu-container"
                      style={activeMenuId === c.id ? { zIndex: 30 } : undefined}
                    >
                      <button
                        onClick={(e) => { e.stopPropagation(); setActiveMenuId(activeMenuId === c.id ? null : c.id); }}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-slate-800/60 transition-all duration-200 cursor-pointer"
                        aria-label="Actions"
                      >
                        <MoreHorizontal size={16} />
                      </button>

                      {activeMenuId === c.id && (
                        <div className="absolute right-6 top-full mt-1 z-20 w-36 rounded-xl border border-slate-800/80 bg-slate-950/95 backdrop-blur-xl shadow-2xl overflow-hidden animate-scale-up">
                          <div className="py-1">
                            <button
                              onClick={() => onEdit(c)}
                              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors duration-150 cursor-pointer"
                            >
                              <Edit2 size={13} className="text-blue-500" />
                              <span>Edit</span>
                            </button>
                            <div className="mx-3 my-0.5 h-[1px] bg-slate-800/60" />
                            <button
                              onClick={() => onDelete(c)}
                              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-950/30 transition-colors duration-150 cursor-pointer"
                            >
                              <Trash2 size={13} />
                              <span>Delete</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-5 py-3.5 rounded-2xl border border-slate-800/60 bg-slate-900/20 backdrop-blur-xl">
        <span className="text-xs text-slate-500 font-mono">
          Showing{' '}
          <span className="text-slate-300 font-semibold">{(page - 1) * limit + 1}–{Math.min(page * limit, totalItems)}</span>
          {' '}of{' '}
          <span className="text-slate-300 font-semibold">{totalItems}</span> creators
        </span>

        <div className="flex items-center gap-1.5 select-none">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            className="p-2 rounded-lg border border-zinc-800 text-zinc-400 hover:text-zinc-100 hover:border-blue-500/40 hover:bg-blue-500/5 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:border-zinc-800 transition-all duration-150 cursor-pointer"
          >
            <ChevronLeft size={14} />
          </button>

          {[...Array(totalPages)].map((_, idx) => {
            const pn = idx + 1;
            const isActive = pn === page;
            return (
              <button
                key={pn}
                onClick={() => onPageChange(pn)}
                className={`w-8 h-8 flex items-center justify-center text-xs font-mono font-semibold rounded-lg border transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'border-blue-500/50 bg-blue-500/10 text-blue-500'
                    : 'border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300'
                }`}
              >
                {pn}
              </button>
            );
          })}

          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            className="p-2 rounded-lg border border-zinc-800 text-zinc-400 hover:text-zinc-100 hover:border-blue-500/40 hover:bg-blue-500/5 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:border-zinc-800 transition-all duration-150 cursor-pointer"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
