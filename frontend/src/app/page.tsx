'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  useCreatorsQuery, 
  useCreateCreatorMutation, 
  useUpdateCreatorMutation, 
  useDeleteCreatorMutation 
} from '../hooks/useCreators';
import { Creator, Niche } from '../types';
import FilterBar from '../components/FilterBar';
import CreatorsTable from '../components/CreatorsTable';
import CreatorModal from '../components/CreatorModal';
import DeleteModal from '../components/DeleteModal';
import { Plus, Users, Sparkles, CheckCircle2 } from 'lucide-react';

function CreatorDirectoryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Parse state from URL params
  const page = Number(searchParams.get('page')) || 1;
  const limit = 10;
  const niche = searchParams.get('niche') || '';
  const minFollowers = searchParams.get('minFollowers') || '';
  const maxFollowers = searchParams.get('maxFollowers') || '';
  const sortBy = searchParams.get('sortBy') || '';
  const order = (searchParams.get('order') as 'asc' | 'desc') || 'asc';

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null);

  // Success Notification state
  const [notification, setNotification] = useState<string | null>(null);

  const triggerNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  // Build filter object for query hook
  const filters = {
    page,
    limit,
    sortBy: sortBy || undefined,
    order,
    niche: niche || undefined,
    minFollowers: minFollowers ? Number(minFollowers) : undefined,
    maxFollowers: maxFollowers ? Number(maxFollowers) : undefined,
  };

  // Queries & Mutations
  const { data: creatorsData, isLoading, isError, error, refetch } = useCreatorsQuery(filters);

  const createMutation = useCreateCreatorMutation(filters);
  const updateMutation = useUpdateCreatorMutation(filters);
  const deleteMutation = useDeleteCreatorMutation(filters);

  // URL Sync handler
  const handleFilterChange = (updates: {
    niche?: string;
    minFollowers?: string;
    maxFollowers?: string;
    sortBy?: string;
    order?: 'asc' | 'desc';
    page?: number;
  }) => {
    const params = new URLSearchParams(searchParams.toString());

    if (updates.niche !== undefined) {
      if (updates.niche) params.set('niche', updates.niche);
      else params.delete('niche');
      params.set('page', '1');
    }

    if (updates.minFollowers !== undefined) {
      if (updates.minFollowers) params.set('minFollowers', updates.minFollowers);
      else params.delete('minFollowers');
      params.set('page', '1');
    }

    if (updates.maxFollowers !== undefined) {
      if (updates.maxFollowers) params.set('maxFollowers', updates.maxFollowers);
      else params.delete('maxFollowers');
      params.set('page', '1');
    }

    if (updates.sortBy !== undefined) {
      params.set('sortBy', updates.sortBy);
      if (updates.order) params.set('order', updates.order);
    }

    if (updates.page !== undefined) {
      params.set('page', String(updates.page));
    }

    router.replace(`?${params.toString()}`, { scroll: false });
  };

  const handleClearFilters = () => {
    router.replace('?', { scroll: false });
  };

  // Sorting Handler
  const handleSort = (column: string) => {
    let nextOrder: 'asc' | 'desc' = 'asc';
    if (sortBy === column && order === 'asc') {
      nextOrder = 'desc';
    }
    handleFilterChange({ sortBy: column, order: nextOrder });
  };

  // Mutation Handlers
  const handleModalSubmit = async (formData: Omit<Creator, 'id' | 'createdAt'>) => {
    try {
      if (selectedCreator) {
        await updateMutation.mutateAsync({ id: selectedCreator.id, ...formData });
        triggerNotification('Creator profile updated successfully!');
      } else {
        await createMutation.mutateAsync(formData);
        triggerNotification('New creator profile added successfully!');
      }
      setIsModalOpen(false);
      setSelectedCreator(null);
    } catch (e: any) {
      alert(e.message || 'Mutation failed');
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedCreator) return;
    try {
      await deleteMutation.mutateAsync(selectedCreator.id);
      triggerNotification('Creator profile deleted successfully!');
      setIsDeleteOpen(false);
      setSelectedCreator(null);
    } catch (e: any) {
      alert(e.message || 'Deletion failed');
    }
  };

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 border border-emerald-500/30 bg-slate-900 text-emerald-400 rounded-xl shadow-xl shadow-emerald-950/20 animate-scale-up">
          <CheckCircle2 size={18} />
          <span className="text-sm font-semibold">{notification}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-900 pb-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-slate-100 flex items-center gap-3">
            <span className="p-2 rounded-xl bg-indigo-950 border border-indigo-500/20 text-indigo-400">
              <Users size={28} />
            </span>
            Creator Directory
          </h1>
          <p className="text-sm text-slate-400">
            Monitor and manage your influencer talent database with real-time stats.
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedCreator(null);
            setIsModalOpen(true);
          }}
          className="flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20 transition hover:shadow-indigo-600/30 active:scale-98"
        >
          <Plus size={18} />
          <span>Add Creator</span>
        </button>
      </div>

      {/* Filter Bar */}
      <FilterBar
        niche={niche}
        minFollowers={minFollowers}
        maxFollowers={maxFollowers}
        onChange={handleFilterChange}
        onClear={handleClearFilters}
      />

      {/* Creators Table */}
      <CreatorsTable
        creatorsData={creatorsData}
        isLoading={isLoading}
        isError={isError}
        error={error}
        sortBy={sortBy}
        order={order}
        onSort={handleSort}
        page={page}
        limit={limit}
        onPageChange={(newPage) => handleFilterChange({ page: newPage })}
        onEdit={(creator) => {
          setSelectedCreator(creator);
          setIsModalOpen(true);
        }}
        onDelete={(creator) => {
          setSelectedCreator(creator);
          setIsDeleteOpen(true);
        }}
        onRetry={refetch}
      />

      {/* Modals */}
      <CreatorModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedCreator(null);
        }}
        onSubmit={handleModalSubmit}
        creator={selectedCreator}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />

      <DeleteModal
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setSelectedCreator(null);
        }}
        onConfirm={handleConfirmDelete}
        creatorName={selectedCreator?.name || ''}
        isDeleting={deleteMutation.isPending}
      />
    </div>
  );
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 flex items-center justify-center min-h-screen">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-slate-800 border-t-indigo-500 rounded-full animate-spin"></div>
            <p className="text-sm text-slate-400 font-medium">Loading Dashboard...</p>
          </div>
        </div>
      }
    >
      <CreatorDirectoryContent />
    </Suspense>
  );
}
