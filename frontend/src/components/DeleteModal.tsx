'use client';

import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { useFocusTrap } from '../hooks/useFocusTrap';

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  creatorName: string;
  isDeleting?: boolean;
}

export default function DeleteModal({
  isOpen,
  onClose,
  onConfirm,
  creatorName,
  isDeleting,
}: DeleteModalProps) {
  const modalRef = useFocusTrap(isOpen, onClose);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div 
        ref={modalRef}
        className="w-full max-w-md border bg-slate-900 border-slate-800 rounded-2xl shadow-2xl shadow-red-950/10 animate-scale-up"
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-modal-title"
      >
        <div className="flex items-start gap-4 p-6">
          <div className="flex-shrink-0 p-3 rounded-full bg-red-950/50 border border-red-500/20 text-red-400">
            <AlertTriangle size={24} />
          </div>
          <div className="flex-1 space-y-2">
            <h3 id="delete-modal-title" className="text-lg font-semibold text-slate-100">
              Delete Creator Profile
            </h3>
            <p className="text-sm text-slate-400">
              Are you sure you want to delete the profile for{' '}
              <strong className="text-slate-200">{creatorName}</strong>? This action
              cannot be undone.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition"
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex items-center justify-end space-x-3 px-6 py-4 bg-slate-950/30 border-t border-slate-850 rounded-b-2xl">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium rounded-lg text-slate-300 hover:text-slate-100 hover:bg-slate-800 transition"
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-5 py-2 text-sm font-medium rounded-lg bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/20 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition flex items-center justify-center min-w-[80px]"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              'Delete'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
