'use client';

import React, { useState, useEffect } from 'react';
import { Creator, Niche } from '../types';
import { X, User, Mail, Tag, Activity, Users, Zap } from 'lucide-react';
import { useFocusTrap } from '../hooks/useFocusTrap';

interface CreatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Creator, 'id' | 'createdAt'>) => void;
  creator?: Creator | null;
  isSubmitting?: boolean;
}

const NICHES: Niche[] = ['beauty', 'fitness', 'travel', 'food', 'tech', 'fashion'];
const NICHE_COLORS: Record<Niche, string> = {
  beauty: '#f472b6', fitness: '#34d399', travel: '#2dd4bf',
  food: '#fbbf24', tech: '#818cf8', fashion: '#c084fc',
};

function Field({
  id, label, icon: Icon, error, children,
}: {
  id: string; label: string; icon: React.ElementType; error?: string; children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
        <Icon size={11} className="text-slate-600" />
        {label}
      </label>
      {children}
      {error && (
        <p className="text-[11px] text-red-400 flex items-center gap-1">
          <span className="w-1 h-1 rounded-full bg-red-400 inline-block" />
          {error}
        </p>
      )}
    </div>
  );
}

const INPUT_BASE = 'w-full px-4 py-2.5 rounded-xl border bg-slate-950/60 text-slate-100 placeholder-slate-600 text-sm outline-none transition-all duration-300';
const INPUT_NORMAL = `${INPUT_BASE} border-zinc-800 focus:border-blue-500/40 focus:bg-slate-950/80`;
const INPUT_ERROR  = `${INPUT_BASE} border-red-500/50 focus:border-red-500/70`;

export default function CreatorModal({ isOpen, onClose, onSubmit, creator, isSubmitting }: CreatorModalProps) {
  const modalRef = useFocusTrap(isOpen, onClose);
  const [name, setName] = useState('');
  const [niche, setNiche] = useState<Niche>('tech');
  const [followerCount, setFollowerCount] = useState<number | ''>('');
  const [engagementRate, setEngagementRate] = useState<number | ''>('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (creator) {
      setName(creator.name); setNiche(creator.niche);
      setFollowerCount(creator.followerCount); setEngagementRate(creator.engagementRate);
      setEmail(creator.email); setStatus(creator.status);
    } else {
      setName(''); setNiche('tech'); setFollowerCount('');
      setEngagementRate(''); setEmail(''); setStatus('active');
    }
    setErrors({});
  }, [creator, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'Name is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = email ? 'Invalid email address' : 'Email is required';
    if (followerCount !== '' && Number(followerCount) < 0) e.followerCount = 'Must be non-negative';
    if (engagementRate !== '') {
      const r = Number(engagementRate);
      if (r < 0 || r > 100) e.engagementRate = 'Must be between 0–100%';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      name: name.trim(), niche,
      followerCount: followerCount === '' ? 0 : Number(followerCount),
      engagementRate: engagementRate === '' ? 0 : Number(Number(engagementRate).toFixed(1)),
      email: email.trim(), status,
    });
  };

  const isEdit = !!creator;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in">
      <div
        ref={modalRef}
        className="w-full max-w-lg overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/85 backdrop-blur-xl shadow-2xl animate-scale-up"
        role="dialog" aria-modal="true" aria-labelledby="modal-title"
      >
        {/* Modal top accent */}
        <div className="h-[1px] bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <Zap size={14} className="text-blue-500" />
            </div>
            <div>
              <h2 id="modal-title" className="text-base font-bold text-slate-100 font-display">
                {isEdit ? 'Edit Creator' : 'Add Creator'}
              </h2>
              <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                {isEdit ? `Editing ${creator?.name}` : 'New profile'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-slate-800/60 transition-all duration-200 cursor-pointer"
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Name */}
          <Field id="creator-name" label="Full Name" icon={User} error={errors.name}>
            <input id="creator-name" type="text" value={name} onChange={(e) => setName(e.target.value)}
              className={errors.name ? INPUT_ERROR : INPUT_NORMAL} placeholder="e.g. Priya Sharma" />
          </Field>

          {/* Email */}
          <Field id="creator-email" label="Email Address" icon={Mail} error={errors.email}>
            <input id="creator-email" type="text" value={email} onChange={(e) => setEmail(e.target.value)}
              className={errors.email ? INPUT_ERROR : INPUT_NORMAL} placeholder="e.g. priya@example.com" />
          </Field>

          {/* Niche pills */}
          <Field id="creator-niche" label="Niche" icon={Tag} error={errors.niche}>
            <div className="flex flex-wrap gap-2 pt-1">
              {NICHES.map((n) => {
                const active = niche === n;
                const color = NICHE_COLORS[n];
                return (
                  <button
                    key={n} type="button" onClick={() => setNiche(n)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold capitalize border transition-all duration-200 cursor-pointer"
                    style={{
                      color: active ? color : '#64748b',
                      borderColor: active ? `${color}50` : 'rgba(51,65,85,0.7)',
                      background: active ? `${color}12` : 'transparent',
                      boxShadow: active ? `0 0 10px ${color}20` : 'none',
                    }}
                  >
                    {n}
                  </button>
                );
              })}
            </div>
          </Field>

          {/* Followers + Engagement */}
          <div className="grid grid-cols-2 gap-4">
            <Field id="creator-followers" label="Followers" icon={Users} error={errors.followerCount}>
              <input id="creator-followers" type="number" value={followerCount}
                onChange={(e) => setFollowerCount(e.target.value === '' ? '' : Number(e.target.value))}
                className={errors.followerCount ? INPUT_ERROR : INPUT_NORMAL} placeholder="e.g. 45200" />
            </Field>
            <Field id="creator-engagement" label="Engagement %" icon={Activity} error={errors.engagementRate}>
              <input id="creator-engagement" type="number" step="0.1" value={engagementRate}
                onChange={(e) => setEngagementRate(e.target.value === '' ? '' : Number(e.target.value))}
                className={errors.engagementRate ? INPUT_ERROR : INPUT_NORMAL} placeholder="e.g. 3.8" />
            </Field>
          </div>

          {/* Status toggle */}
          <Field id="creator-status" label="Status" icon={Activity}>
            <div className="flex gap-2 pt-1">
              {(['active', 'inactive'] as const).map((s) => (
                <button
                  key={s} type="button" onClick={() => setStatus(s)}
                  className={`flex-1 py-2 rounded-xl text-sm font-semibold border capitalize transition-all duration-200 cursor-pointer ${
                    status === s
                      ? s === 'active'
                        ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.12)]'
                        : 'bg-slate-800/60 border-slate-700/60 text-slate-300'
                      : 'bg-transparent border-slate-800/60 text-slate-600 hover:border-slate-700 hover:text-slate-400'
                  }`}
                >
                  {s === 'active' && <span className="mr-1.5">●</span>}
                  {s}
                </button>
              ))}
            </div>
          </Field>

          {/* Footer actions */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-zinc-800">
            <button type="button" onClick={onClose} disabled={isSubmitting}
              className="px-4 py-2.5 text-sm font-medium rounded-xl text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-all duration-150 cursor-pointer">
              Cancel
            </button>
            <button
              type="submit" disabled={isSubmitting}
              className="relative px-6 py-2.5 text-sm font-semibold rounded-xl border border-blue-500/40 text-blue-500 bg-blue-500/5 hover:bg-blue-500/10 hover:border-blue-500/60 transition-all duration-150 min-w-[130px] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <span className="w-4 h-4 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
              ) : (
                <>{isEdit ? 'Save Changes' : 'Create Creator'}</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
