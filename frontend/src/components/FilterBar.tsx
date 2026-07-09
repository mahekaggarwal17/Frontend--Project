'use client';

import React, { useState, useEffect } from 'react';
import { Niche } from '../types';
import { Search, RotateCcw } from 'lucide-react';

interface FilterBarProps {
  search: string;
  niche: string;
  minFollowers: string;
  maxFollowers: string;
  onChange: (updates: { search?: string; niche?: string; minFollowers?: string; maxFollowers?: string }) => void;
  onClear: () => void;
}

const NICHES: Niche[] = ['beauty', 'fitness', 'travel', 'food', 'tech', 'fashion'];

export default function FilterBar({
  search,
  niche,
  minFollowers,
  maxFollowers,
  onChange,
  onClear,
}: FilterBarProps) {
  // Local states for inputs to avoid immediate layout lag (and allow standard typing)
  const [localSearch, setLocalSearch] = useState(search);
  const [localMin, setLocalMin] = useState(minFollowers);
  const [localMax, setLocalMax] = useState(maxFollowers);

  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  useEffect(() => {
    setLocalMin(minFollowers);
  }, [minFollowers]);

  useEffect(() => {
    setLocalMax(maxFollowers);
  }, [maxFollowers]);

  // Debounce helper
  useEffect(() => {
    const handler = setTimeout(() => {
      const updates: { search?: string; minFollowers?: string; maxFollowers?: string } = {};
      let hasUpdates = false;

      if (localSearch !== search) {
        updates.search = localSearch;
        hasUpdates = true;
      }
      if (localMin !== minFollowers) {
        updates.minFollowers = localMin;
        hasUpdates = true;
      }
      if (localMax !== maxFollowers) {
        updates.maxFollowers = localMax;
        hasUpdates = true;
      }

      if (hasUpdates) {
        onChange(updates);
      }
    }, 400);

    return () => clearTimeout(handler);
  }, [localSearch, localMin, localMax, search, minFollowers, maxFollowers, onChange]);

  return (
    <div className="p-5 border border-slate-800/60 bg-slate-900/20 backdrop-blur-xl rounded-2xl space-y-4 shadow-lg shadow-indigo-500/2">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        {/* Search Input */}
        <div className="w-full lg:w-1/3">
          <label htmlFor="search-filter" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Search Creators
          </label>
          <div className="relative">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              id="search-filter"
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-800/80 bg-slate-950/40 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:border-indigo-500/40 focus:ring-indigo-500/10 transition"
            />
          </div>
        </div>

        {/* Niche Selector */}
        <div className="w-full lg:w-1/4">
          <label htmlFor="niche-filter" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Niche / Category
          </label>
          <select
            id="niche-filter"
            value={niche}
            onChange={(e) => onChange({ niche: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-800/80 bg-slate-950/40 text-slate-200 focus:outline-none focus:ring-2 focus:border-indigo-500/40 focus:ring-indigo-500/10 transition capitalize"
          >
            <option value="" className="bg-slate-950">All Niches</option>
            {NICHES.map((n) => (
              <option key={n} value={n} className="bg-slate-950">
                {n}
              </option>
            ))}
          </select>
        </div>

        {/* Follower Range Filter */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="min-followers" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Min Followers
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm">Min:</span>
              <input
                id="min-followers"
                type="number"
                min="0"
                value={localMin}
                onChange={(e) => setLocalMin(e.target.value)}
                placeholder="0"
                className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-slate-800/80 bg-slate-950/40 text-slate-200 placeholder-slate-650 focus:outline-none focus:ring-2 focus:border-indigo-500/40 focus:ring-indigo-500/10 transition"
              />
            </div>
          </div>

          <div>
            <label htmlFor="max-followers" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Max Followers
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm">Max:</span>
              <input
                id="max-followers"
                type="number"
                min="0"
                value={localMax}
                onChange={(e) => setLocalMax(e.target.value)}
                placeholder="e.g. 5000000"
                className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-slate-800/80 bg-slate-950/40 text-slate-200 placeholder-slate-650 focus:outline-none focus:ring-2 focus:border-indigo-500/40 focus:ring-indigo-500/10 transition"
              />
            </div>
          </div>
        </div>

        {/* Reset Filters */}
        <div className="flex items-center gap-2">
          <button
            onClick={onClear}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-800 bg-slate-900/20 text-slate-350 hover:text-slate-100 hover:bg-slate-800/40 transition active:scale-95 cursor-pointer"
            title="Reset all filters"
          >
            <RotateCcw size={16} />
            <span>Reset</span>
          </button>
        </div>
      </div>
    </div>
  );
}
