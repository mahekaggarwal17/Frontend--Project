'use client';

import React, { useState, useEffect } from 'react';
import { Creator, Niche } from '../types';
import { X } from 'lucide-react';

interface CreatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Creator, 'id' | 'createdAt'>) => void;
  creator?: Creator | null;
  isSubmitting?: boolean;
}

const NICHES: Niche[] = ['beauty', 'fitness', 'travel', 'food', 'tech', 'fashion'];

export default function CreatorModal({
  isOpen,
  onClose,
  onSubmit,
  creator,
  isSubmitting,
}: CreatorModalProps) {
  const [name, setName] = useState('');
  const [niche, setNiche] = useState<Niche>('tech');
  const [followerCount, setFollowerCount] = useState<number | ''>('');
  const [engagementRate, setEngagementRate] = useState<number | ''>('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (creator) {
      setName(creator.name);
      setNiche(creator.niche);
      setFollowerCount(creator.followerCount);
      setEngagementRate(creator.engagementRate);
      setEmail(creator.email);
      setStatus(creator.status);
    } else {
      setName('');
      setNiche('tech');
      setFollowerCount('');
      setEngagementRate('');
      setEmail('');
      setStatus('active');
    }
    setErrors({});
  }, [creator, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!niche) {
      newErrors.niche = 'Niche is required';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Invalid email address';
    }

    if (followerCount !== '' && Number(followerCount) < 0) {
      newErrors.followerCount = 'Follower count must be non-negative';
    }

    if (engagementRate !== '') {
      const rate = Number(engagementRate);
      if (rate < 0 || rate > 100) {
        newErrors.engagementRate = 'Engagement rate must be between 0% and 100%';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      name: name.trim(),
      niche,
      followerCount: followerCount === '' ? 0 : Number(followerCount),
      engagementRate: engagementRate === '' ? 0 : Number(Number(engagementRate).toFixed(1)),
      email: email.trim(),
      status,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-lg overflow-hidden border bg-slate-900 border-slate-800 rounded-2xl shadow-2xl shadow-indigo-500/10 animate-scale-up"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <h2 id="modal-title" className="text-xl font-semibold text-slate-100">
            {creator ? 'Edit Creator Profile' : 'Add New Creator'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition"
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5" htmlFor="creator-name">
              Name *
            </label>
            <input
              id="creator-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full px-4 py-2.5 rounded-lg border bg-slate-950/50 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 transition ${
                errors.name 
                  ? 'border-red-500/50 focus:ring-red-500/30' 
                  : 'border-slate-800 focus:border-indigo-500/50 focus:ring-indigo-500/20'
              }`}
              placeholder="e.g. Priya Sharma"
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-400">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5" htmlFor="creator-email">
              Email Address *
            </label>
            <input
              id="creator-email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-4 py-2.5 rounded-lg border bg-slate-950/50 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 transition ${
                errors.email 
                  ? 'border-red-500/50 focus:ring-red-500/30' 
                  : 'border-slate-800 focus:border-indigo-500/50 focus:ring-indigo-500/20'
              }`}
              placeholder="e.g. priya@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-400">{errors.email}</p>
            )}
          </div>

          {/* Row: Niche & Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5" htmlFor="creator-niche">
                Niche *
              </label>
              <select
                id="creator-niche"
                value={niche}
                onChange={(e) => setNiche(e.target.value as Niche)}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-800 bg-slate-950 text-slate-100 focus:outline-none focus:ring-2 focus:border-indigo-500/50 focus:ring-indigo-500/20 transition capitalize"
              >
                {NICHES.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5" htmlFor="creator-status">
                Status
              </label>
              <select
                id="creator-status"
                value={status}
                onChange={(e) => setStatus(e.target.value as 'active' | 'inactive')}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-800 bg-slate-950 text-slate-100 focus:outline-none focus:ring-2 focus:border-indigo-500/50 focus:ring-indigo-500/20 transition"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Row: Followers & Engagement Rate */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5" htmlFor="creator-followers">
                Follower Count
              </label>
              <input
                id="creator-followers"
                type="number"
                value={followerCount}
                onChange={(e) => setFollowerCount(e.target.value === '' ? '' : Number(e.target.value))}
                className={`w-full px-4 py-2.5 rounded-lg border bg-slate-950/50 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 transition ${
                  errors.followerCount
                    ? 'border-red-500/50 focus:ring-red-500/30'
                    : 'border-slate-800 focus:border-indigo-500/50 focus:ring-indigo-500/20'
                }`}
                placeholder="e.g. 45200"
              />
              {errors.followerCount && (
                <p className="mt-1 text-xs text-red-400">{errors.followerCount}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5" htmlFor="creator-engagement">
                Engagement Rate (%)
              </label>
              <input
                id="creator-engagement"
                type="number"
                step="0.1"
                value={engagementRate}
                onChange={(e) => setEngagementRate(e.target.value === '' ? '' : Number(e.target.value))}
                className={`w-full px-4 py-2.5 rounded-lg border bg-slate-950/50 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 transition ${
                  errors.engagementRate
                    ? 'border-red-500/50 focus:ring-red-500/30'
                    : 'border-slate-800 focus:border-indigo-500/50 focus:ring-indigo-500/20'
                }`}
                placeholder="e.g. 3.8"
              />
              {errors.engagementRate && (
                <p className="mt-1 text-xs text-red-400">{errors.engagementRate}</p>
              )}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium rounded-lg text-slate-300 hover:text-slate-100 hover:bg-slate-800 transition"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-medium rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition flex items-center justify-center min-w-[80px]"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : creator ? (
                'Save Changes'
              ) : (
                'Create Creator'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
