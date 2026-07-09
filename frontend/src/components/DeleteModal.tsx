'use client';

import React from 'react';
import { Trash2, X, AlertTriangle } from 'lucide-react';
import { useFocusTrap } from '../hooks/useFocusTrap';

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  creatorName: string;
  isDeleting?: boolean;
}

export default function DeleteModal({ isOpen, onClose, onConfirm, creatorName, isDeleting }: DeleteModalProps) {
  const modalRef = useFocusTrap(isOpen, onClose);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in">
      <div
        ref={modalRef}
        className="w-full max-w-sm overflow-hidden rounded-2xl border border-red-500/20 bg-slate-900/85 backdrop-blur-2xl shadow-[0_24px_80px_rgba(0,0,0,0.6),0_0_40px_rgba(239,68,68,0.08)] animate-scale-up"
        role="dialog" aria-modal="true" aria-labelledby="delete-modal-title"
      >
        {/* Red top accent */}
        <div className="h-[2px] bg-gradient-to-r from-transparent via-red-500/60 to-transparent" />

        {/* Close button */}
        <div className="flex justify-end px-5 pt-4">
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-slate-800/60 transition-all duration-200 cursor-pointer"
            aria-label="Close dialog"
          >
            <X size={16} />
          </button>
        </div>

        {/* Icon + content */}
        <div className="px-7 pb-6 text-center space-y-4">
          {/* Animated warning icon */}
          <div className="relative inline-flex">
            <div className="absolute inset-0 rounded-full bg-red-500/10 animate-ping opacity-60" style={{ animationDuration: '2s' }} />
            <div className="relative p-4 rounded-full bg-red-950/50 border border-red-500/25 text-red-400">
              <Trash2 size={26} />
            </div>
          </div>

          <div className="space-y-2">
            <h3 id="delete-modal-title" className="text-lg font-bold text-slate-100 font-display">
              Delete Profile
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Are you sure you want to permanently delete{' '}
              <span className="font-semibold text-slate-200">{creatorName}</span>?
              <br />
              <span className="text-xs text-slate-500 mt-1 block">This action cannot be undone.</span>
            </p>
          </div>

          {/* Warning note */}
          <div className="flex items-start gap-2 p-3 rounded-xl bg-red-950/20 border border-red-500/15 text-left">
            <AlertTriangle size={13} className="text-red-400 mt-0.5 shrink-0" />
            <p className="text-[11px] text-red-400/80 leading-relaxed">
              All data associated with this creator profile will be permanently removed from the database.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 px-7 pb-6">
          <button
            type="button" onClick={onClose} disabled={isDeleting}
            className="flex-1 py-2.5 text-sm font-semibold rounded-xl border border-slate-800/80 text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 hover:border-slate-700/80 transition-all duration-200 cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button" onClick={onConfirm} disabled={isDeleting}
            className="flex-1 py-2.5 text-sm font-semibold rounded-xl border border-red-500/40 bg-red-950/30 text-red-400 hover:bg-red-500 hover:text-white hover:border-red-500 hover:shadow-[0_0_20px_rgba(239,68,68,0.30)] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isDeleting ? (
              <span className="w-4 h-4 border-2 border-red-300/30 border-t-red-300 rounded-full animate-spin" />
            ) : (
              <>
                <Trash2 size={13} />
                Delete
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
