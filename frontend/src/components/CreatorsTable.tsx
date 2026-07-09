'use client';

import React, { useState } from 'react';
import { Creator, CreatorResponse } from '../types';
import { 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown, 
  Edit2, 
  Trash2, 
  MoreHorizontal, 
  AlertTriangle,
  FolderOpen
} from 'lucide-react';

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

// Utility to format follower counts
function formatFollowers(num: number): string {
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return num.toString();
}

// Nicely colored badge classes based on creator's niche
const NICHE_BADGES: Record<string, string> = {
  beauty: 'bg-pink-950/40 text-pink-300 border-pink-500/20',
  fitness: 'bg-emerald-950/40 text-emerald-300 border-emerald-500/20',
  travel: 'bg-teal-950/40 text-teal-300 border-teal-500/20',
  food: 'bg-amber-950/40 text-amber-300 border-amber-500/20',
  tech: 'bg-indigo-950/40 text-indigo-300 border-indigo-500/20',
  fashion: 'bg-purple-950/40 text-purple-300 border-purple-500/20',
};

export default function CreatorsTable({
  creatorsData,
  isLoading,
  isError,
  error,
  sortBy,
  order,
  onSort,
  page,
  limit,
  onPageChange,
  onEdit,
  onDelete,
  onRetry,
}: CreatorsTableProps) {
  // Track open row actions menu id
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Toggle dropdown menu
  const toggleMenu = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveMenuId(activeMenuId === id ? null : id);
  };

  // Close menus on click outside
  React.useEffect(() => {
    const closeAll = () => setActiveMenuId(null);
    document.addEventListener('click', closeAll);
    return () => document.removeEventListener('click', closeAll);
  }, []);

  // Render sort icon based on current sorting state
  const renderSortIcon = (column: string) => {
    if (sortBy !== column) {
      return <ArrowUpDown size={14} className="text-slate-500 ml-1.5 opacity-60 group-hover:opacity-100 transition" />;
    }
    return order === 'asc' 
      ? <ArrowUp size={14} className="text-indigo-400 ml-1.5" /> 
      : <ArrowDown size={14} className="text-indigo-400 ml-1.5" />;
  };

  // Loading state skeleton
  if (isLoading) {
    return (
      <div className="overflow-hidden border border-slate-800 bg-slate-900/30 rounded-2xl">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider text-xs border-b border-slate-800">
            <tr>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Niche</th>
              <th className="px-6 py-4">Followers</th>
              <th className="px-6 py-4">Engagement Rate</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-850">
            {[...Array(5)].map((_, i) => (
              <tr key={i} className="animate-pulse">
                <td className="px-6 py-5">
                  <div className="h-4 bg-slate-800 rounded w-32 mb-2"></div>
                  <div className="h-3 bg-slate-850 rounded w-44"></div>
                </td>
                <td className="px-6 py-5">
                  <div className="h-6 bg-slate-800 rounded-full w-20"></div>
                </td>
                <td className="px-6 py-5">
                  <div className="h-4 bg-slate-800 rounded w-14"></div>
                </td>
                <td className="px-6 py-5">
                  <div className="h-4 bg-slate-800 rounded w-12"></div>
                </td>
                <td className="px-6 py-5">
                  <div className="h-6 bg-slate-800 rounded-full w-16"></div>
                </td>
                <td className="px-6 py-5 text-right">
                  <div className="h-8 bg-slate-800 rounded w-8 ml-auto"></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // Error state card
  if (isError) {
    return (
      <div className="p-8 border border-red-500/20 bg-red-950/10 backdrop-blur-md rounded-2xl text-center space-y-4 max-w-xl mx-auto my-6">
        <div className="inline-flex p-3 rounded-full bg-red-950 border border-red-500/30 text-red-400">
          <AlertTriangle size={32} />
        </div>
        <h3 className="text-lg font-semibold text-red-200">Database Connection Failed</h3>
        <p className="text-sm text-red-400/80">
          {error?.message || 'We could not fetch the creators data from the server. Please verify your backend server is active and try again.'}
        </p>
        <button
          onClick={onRetry}
          className="px-5 py-2 text-sm font-semibold rounded-lg bg-red-650 hover:bg-red-600 text-white shadow-lg shadow-red-650/15 focus:outline-none transition active:scale-95"
        >
          Retry Fetching
        </button>
      </div>
    );
  }

  const creators = creatorsData?.data || [];
  const totalItems = creatorsData?.total || 0;
  const totalPages = Math.ceil(totalItems / limit) || 1;

  // Empty state card
  if (creators.length === 0) {
    return (
      <div className="p-12 border border-slate-800 bg-slate-900/20 rounded-2xl text-center space-y-4 max-w-lg mx-auto my-6">
        <div className="inline-flex p-4 rounded-full bg-slate-950 text-slate-500">
          <FolderOpen size={36} />
        </div>
        <h3 className="text-lg font-semibold text-slate-300">No creators found</h3>
        <p className="text-sm text-slate-400">
          No records matched your current search filters. Try adjusting your follower ranges or switching categories.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Table Container */}
      <div className="overflow-x-auto border border-slate-800 bg-slate-900/30 rounded-2xl shadow-xl backdrop-blur-sm">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-slate-900/70 text-slate-400 uppercase tracking-wider text-xs border-b border-slate-800 select-none">
            <tr>
              <th className="px-6 py-4 font-semibold">Name</th>
              <th className="px-6 py-4 font-semibold">Niche</th>
              <th 
                className="px-6 py-4 font-semibold cursor-pointer group"
                onClick={() => onSort('followerCount')}
              >
                <div className="flex items-center">
                  Followers
                  {renderSortIcon('followerCount')}
                </div>
              </th>
              <th 
                className="px-6 py-4 font-semibold cursor-pointer group"
                onClick={() => onSort('engagementRate')}
              >
                <div className="flex items-center">
                  Engagement Rate
                  {renderSortIcon('engagementRate')}
                </div>
              </th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-850">
            {creators.map((c) => (
              <tr 
                key={c.id} 
                className={`hover:bg-slate-800/20 transition duration-150 ${
                  c.id.startsWith('temp-') ? 'opacity-60 bg-indigo-950/10' : ''
                }`}
              >
                {/* Name & Email */}
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-100">{c.name}</div>
                  <div className="text-slate-400 text-xs mt-0.5">{c.email}</div>
                </td>

                {/* Niche Badge */}
                <td className="px-6 py-4 capitalize">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                    NICHE_BADGES[c.niche] || 'bg-slate-950/40 text-slate-350 border-slate-800'
                  }`}>
                    {c.niche}
                  </span>
                </td>

                {/* Followers */}
                <td className="px-6 py-4 text-slate-200">
                  {formatFollowers(c.followerCount)}
                </td>

                {/* Engagement Rate */}
                <td className="px-6 py-4 text-slate-200">
                  {c.engagementRate}%
                </td>

                {/* Status */}
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    c.status === 'active' 
                      ? 'bg-emerald-950/30 text-emerald-400 border border-emerald-500/20' 
                      : 'bg-slate-950/30 text-slate-400 border border-slate-800'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      c.status === 'active' ? 'bg-emerald-400' : 'bg-slate-500'
                    }`} />
                    {c.status}
                  </span>
                </td>

                {/* Actions Dropdown */}
                <td className="px-6 py-4 text-right relative">
                  <button
                    onClick={(e) => toggleMenu(c.id, e)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition"
                    aria-label="Actions menu"
                  >
                    <MoreHorizontal size={16} />
                  </button>

                  {activeMenuId === c.id && (
                    <div className="absolute right-6 top-12 z-10 w-36 border bg-slate-950 border-slate-850 rounded-xl shadow-xl overflow-hidden animate-scale-up py-1 text-left">
                      <button
                        onClick={() => onEdit(c)}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:text-slate-100 hover:bg-slate-800 transition"
                      >
                        <Edit2 size={14} />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => onDelete(c)}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-950/40 transition"
                      >
                        <Trash2 size={14} />
                        <span>Delete</span>
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 border border-slate-800/80 bg-slate-900/30 rounded-2xl">
        <span className="text-sm text-slate-400">
          Showing <span className="font-semibold text-slate-200">{creators.length}</span> of{' '}
          <span className="font-semibold text-slate-200">{totalItems}</span> creators
        </span>

        <div className="flex items-center space-x-2 select-none">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-800 text-slate-350 hover:bg-slate-800 hover:text-slate-100 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-slate-350 transition"
          >
            Previous
          </button>
          
          <div className="flex items-center gap-1.5">
            {[...Array(totalPages)].map((_, idx) => {
              const pageNumber = idx + 1;
              return (
                <button
                  key={pageNumber}
                  onClick={() => onPageChange(pageNumber)}
                  className={`w-8 h-8 flex items-center justify-center text-xs font-semibold rounded-lg transition ${
                    page === pageNumber
                      ? 'bg-indigo-650 text-white shadow-lg shadow-indigo-650/20'
                      : 'border border-slate-800 hover:bg-slate-850 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {pageNumber}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-800 text-slate-350 hover:bg-slate-800 hover:text-slate-100 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-slate-350 transition"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
