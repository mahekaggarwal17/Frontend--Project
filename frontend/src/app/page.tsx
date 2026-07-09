'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  useCreatorsQuery, 
  useCreateCreatorMutation, 
  useUpdateCreatorMutation, 
  useDeleteCreatorMutation 
} from '../hooks/useCreators';
import { Creator } from '../types';
import SummaryStats from '../components/SummaryStats';
import NicheBreakdown from '../components/NicheBreakdown';
import FilterBar from '../components/FilterBar';
import CreatorsTable from '../components/CreatorsTable';
import CreatorModal from '../components/CreatorModal';
import DeleteModal from '../components/DeleteModal';
import { Plus, Users, CheckCircle2, Download } from 'lucide-react';
import { fetchCreators } from '../lib/api';

function CreatorDirectoryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Parse states from URL params
  const page = Number(searchParams.get('page')) || 1;
  const limit = 10;
  const search = searchParams.get('search') || '';
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
    search: search || undefined,
  };

  // Queries & Mutations
  const { data: creatorsData, isLoading, isError, error, refetch } = useCreatorsQuery(filters);

  // Stats query for client-side aggregations (fetch up to 1000 items matching active filters)
  const statsFilters = {
    page: 1,
    limit: 1000,
    niche: niche || undefined,
    minFollowers: minFollowers ? Number(minFollowers) : undefined,
    maxFollowers: maxFollowers ? Number(maxFollowers) : undefined,
    search: search || undefined,
  };
  const { data: statsData, isLoading: isStatsLoading } = useCreatorsQuery(statsFilters);

  // Client-side calculations
  const allMatchingCreators = statsData?.data || [];
  const totalMatchingCount = statsData?.total || 0;
  const totalFollowers = allMatchingCreators.reduce((sum, c) => sum + c.followerCount, 0);
  const avgEngagement = allMatchingCreators.length > 0
    ? Number((allMatchingCreators.reduce((sum, c) => sum + c.engagementRate, 0) / allMatchingCreators.length).toFixed(1))
    : 0;
  const activeCount = allMatchingCreators.filter((c) => c.status === 'active').length;

  const nicheCounts = allMatchingCreators.reduce((acc, c) => {
    acc[c.niche] = (acc[c.niche] || 0) + 1;
    return acc;
  }, { beauty: 0, fitness: 0, travel: 0, food: 0, tech: 0, fashion: 0 } as Record<string, number>);

  const createMutation = useCreateCreatorMutation(filters);
  const updateMutation = useUpdateCreatorMutation(filters);
  const deleteMutation = useDeleteCreatorMutation(filters);

  // URL Sync handler
  const handleFilterChange = (updates: {
    search?: string;
    niche?: string;
    minFollowers?: string;
    maxFollowers?: string;
    sortBy?: string;
    order?: 'asc' | 'desc';
    page?: number;
  }) => {
    const params = new URLSearchParams(searchParams.toString());

    if (updates.search !== undefined) {
      if (updates.search) params.set('search', updates.search);
      else params.delete('search');
      params.set('page', '1'); // reset page on search
    }

    if (updates.niche !== undefined) {
      if (updates.niche) params.set('niche', updates.niche);
      else params.delete('niche');
      params.set('page', '1'); // reset page on niche change
    }

    if (updates.minFollowers !== undefined) {
      if (updates.minFollowers) params.set('minFollowers', updates.minFollowers);
      else params.delete('minFollowers');
      params.set('page', '1'); // reset page on filter change
    }

    if (updates.maxFollowers !== undefined) {
      if (updates.maxFollowers) params.set('maxFollowers', updates.maxFollowers);
      else params.delete('maxFollowers');
      params.set('page', '1'); // reset page on filter change
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

  const handleExportCSV = async () => {
    try {
      const exportFilters = {
        ...filters,
        page: 1,
        limit: 1000, // Fetch all matching results up to 1000
      };
      
      const response = await fetchCreators(exportFilters);
      const data = response.data;
      
      if (data.length === 0) {
        triggerNotification('No data available to export.');
        return;
      }
      
      // Build CSV String
      const headers = ['ID', 'Name', 'Email', 'Niche', 'Followers', 'Engagement Rate (%)', 'Status', 'Created At'];
      const rows = data.map(c => [
        c.id,
        `"${c.name.replace(/"/g, '""')}"`,
        c.email,
        c.niche,
        c.followerCount,
        c.engagementRate,
        c.status,
        c.createdAt
      ]);
      
      const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      
      // Download link trigger
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `creators_export_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      triggerNotification('CSV export completed successfully!');
    } catch (e: any) {
      alert('Failed to export CSV: ' + e.message);
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
          <h1 className="text-3xl font-bold tracking-tight text-slate-100 flex items-center gap-3 font-display">
            <span className="p-2 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.15)]">
              <Users size={28} />
            </span>
            Creator Directory
          </h1>
          <p className="text-sm text-slate-400">
            Monitor and manage your influencer talent database with real-time stats.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold rounded-xl border border-slate-800 bg-slate-900/10 text-slate-350 hover:border-[#BBF351]/50 hover:text-[#BBF351] hover:shadow-[0_0_15px_rgba(187,243,81,0.15)] hover:bg-[#BBF351]/5 transition-all duration-300 cursor-pointer"
          >
            <Download size={18} />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => {
              setSelectedCreator(null);
              setIsModalOpen(true);
            }}
            className="flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold rounded-xl bg-slate-900 border border-[#00BCFF]/50 text-[#00BCFF] shadow-[0_0_15px_rgba(0,188,255,0.15)] hover:bg-[#00BCFF] hover:text-slate-950 transition-all duration-300 cursor-pointer"
          >
            <Plus size={18} />
            <span>Add Creator</span>
          </button>
        </div>
      </div>

      {/* Summary Stats Dashboard */}
      <SummaryStats
        total={totalMatchingCount}
        totalFollowers={totalFollowers}
        avgEngagement={avgEngagement}
        activeCount={activeCount}
        isLoading={isLoading || isStatsLoading}
      />

      {/* Niche Category Distribution Chart */}
      <NicheBreakdown
        nicheCounts={nicheCounts}
        total={totalMatchingCount}
        isLoading={isLoading || isStatsLoading}
      />

      {/* Filter Bar */}
      <FilterBar
        search={search}
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
