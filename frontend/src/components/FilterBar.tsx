'use client';

import React, { useState, useEffect } from 'react';
import { Niche } from '../types';
import { Search, RotateCcw, SlidersHorizontal, ChevronDown } from 'lucide-react';

interface FilterBarProps {
  search: string;
  niche: string;
  minFollowers: string;
  maxFollowers: string;
  onChange: (updates: { search?: string; niche?: string; minFollowers?: string; maxFollowers?: string }) => void;
  onClear: () => void;
}

const NICHES: Niche[] = ['beauty', 'fitness', 'travel', 'food', 'tech', 'fashion'];

const NICHE_COLORS: Record<string, string> = {
  beauty: '#f472b6',
  fitness: '#34d399',
  travel: '#2dd4bf',
  food: '#fbbf24',
  tech: '#818cf8',
  fashion: '#c084fc',
};

export default function FilterBar({
  search, niche, minFollowers, maxFollowers, onChange, onClear,
}: FilterBarProps) {
  const [localSearch, setLocalSearch] = useState(search);
  const [localMin, setLocalMin] = useState(minFollowers);
  const [localMax, setLocalMax] = useState(maxFollowers);
  const [searchFocused, setSearchFocused] = useState(false);

  useEffect(() => { setLocalSearch(search); }, [search]);
  useEffect(() => { setLocalMin(minFollowers); }, [minFollowers]);
  useEffect(() => { setLocalMax(maxFollowers); }, [maxFollowers]);

  useEffect(() => {
    const handler = setTimeout(() => {
      const updates: { search?: string; minFollowers?: string; maxFollowers?: string } = {};
      let hasUpdates = false;
      if (localSearch !== search) { updates.search = localSearch; hasUpdates = true; }
      if (localMin !== minFollowers) { updates.minFollowers = localMin; hasUpdates = true; }
      if (localMax !== maxFollowers) { updates.maxFollowers = localMax; hasUpdates = true; }
      if (hasUpdates) onChange(updates);
    }, 400);
    return () => clearTimeout(handler);
  }, [localSearch, localMin, localMax, search, minFollowers, maxFollowers, onChange]);

  const hasActiveFilters = search || niche || minFollowers || maxFollowers;

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/20 shadow-sm">
      {/* Neon top accent when any filter active */}
      <div
        className={`h-[2px] w-full transition-all duration-500 ${
          hasActiveFilters
            ? 'bg-gradient-to-r from-transparent via-blue-500/40 to-transparent'
            : 'bg-gradient-to-r from-transparent via-zinc-800 to-transparent'
        }`}
      />

      <div className="p-5 space-y-5">
        {/* Top row label */}
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={14} className="text-slate-500" />
          <span className="text-[10px] font-mono font-semibold uppercase tracking-[0.18em] text-slate-500">
            Filter Creators
          </span>
          {hasActiveFilters && (
            <span className="ml-1 px-1.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[9px] font-mono font-bold text-blue-500 animate-fade-in">
              ACTIVE
            </span>
          )}
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end gap-4">
          {/* Search Input */}
          <div className="w-full lg:w-1/3">
            <label htmlFor="search-filter" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
              Search
            </label>
            <div className={`relative transition-all duration-300 ${searchFocused ? 'scale-[1.01]' : ''}`}>
              <Search
                size={16}
                className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-150 ${
                  searchFocused ? 'text-blue-500' : 'text-zinc-500'
                }`}
              />
              <input
                id="search-filter"
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                placeholder="Name or email…"
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border bg-zinc-950/50 text-zinc-200 placeholder-zinc-600 text-sm outline-none transition-all duration-150 ${
                  searchFocused
                    ? 'border-blue-500/40 bg-zinc-950/70'
                    : 'border-zinc-800 hover:border-zinc-700'
                }`}
              />
            </div>
          </div>

          {/* Niche Pills */}
          <div className="w-full lg:w-auto flex-1">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
              Niche
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => onChange({ niche: '' })}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-150 cursor-pointer ${
                  !niche
                    ? 'bg-zinc-800 border-zinc-700 text-zinc-100'
                    : 'bg-transparent border-zinc-800/60 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300'
                }`}
              >
                All
              </button>
              {NICHES.map((n) => {
                const color = NICHE_COLORS[n];
                const active = niche === n;
                return (
                  <button
                    key={n}
                    onClick={() => onChange({ niche: active ? '' : n })}
                    className="relative px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-150 capitalize cursor-pointer overflow-hidden"
                    style={{
                      borderColor: active ? `${color}40` : '#27272a',
                      color: active ? color : '#71717a',
                      background: active ? `${color}12` : 'transparent',
                    }}
                  >
                    {n}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Follower Range */}
          <div className="flex items-end gap-2 shrink-0">
            <div>
              <label htmlFor="min-followers" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                Min Followers
              </label>
              <input
                id="min-followers"
                type="number"
                min="0"
                value={localMin}
                onChange={(e) => setLocalMin(e.target.value)}
                placeholder="0"
                className="w-28 px-3 py-2.5 rounded-xl border border-zinc-800 bg-zinc-950/50 text-zinc-200 placeholder-zinc-600 text-sm outline-none focus:border-blue-500/40 transition-all duration-150"
              />
            </div>
            <div className="pb-2.5 text-slate-600 text-lg font-light">–</div>
            <div>
              <label htmlFor="max-followers" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                Max Followers
              </label>
              <input
                id="max-followers"
                type="number"
                min="0"
                value={localMax}
                onChange={(e) => setLocalMax(e.target.value)}
                placeholder="Any"
                className="w-28 px-3 py-2.5 rounded-xl border border-zinc-800 bg-zinc-950/50 text-zinc-200 placeholder-zinc-600 text-sm outline-none focus:border-blue-500/40 transition-all duration-150"
              />
            </div>
          </div>

          {/* Reset */}
          <button
            onClick={onClear}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all duration-150 cursor-pointer shrink-0 ${
              hasActiveFilters
                ? 'border-red-500/20 bg-red-950/10 text-red-400 hover:border-red-500/40 hover:bg-red-950/20'
                : 'border-zinc-800 bg-zinc-900/10 text-zinc-500 hover:border-zinc-700 hover:text-zinc-400'
            }`}
          >
            <RotateCcw size={14} className={hasActiveFilters ? 'animate-spin-once' : ''} />
            <span>Reset</span>
          </button>
        </div>
      </div>
    </div>
  );
}
