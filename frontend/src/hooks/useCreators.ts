import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Creator, CreatorFilters, CreatorResponse } from '../types';
import { fetchCreators, createCreator, updateCreator, deleteCreator } from '../lib/api';

// Hook to query the creators list
export function useCreatorsQuery(filters: CreatorFilters) {
  return useQuery<CreatorResponse, Error>({
    queryKey: ['creators', filters],
    queryFn: () => fetchCreators(filters),
    placeholderData: (previousData) => previousData, // keep old data visible while fetching new page/filters
    staleTime: 5000,
  });
}

// Hook to create a creator with optimistic updates
export function useCreateCreatorMutation(filters: CreatorFilters) {
  const queryClient = useQueryClient();

  return useMutation<Creator, Error, Omit<Creator, 'id' | 'createdAt'>, { previousCreators: CreatorResponse | undefined }>({
    mutationFn: createCreator,
    onMutate: async (newCreator) => {
      // Cancel outgoing queries for creators list
      await queryClient.cancelQueries({ queryKey: ['creators', filters] });

      // Snapshot the previous value
      const previousCreators = queryClient.getQueryData<CreatorResponse>(['creators', filters]);

      // Optimistically update the list
      if (previousCreators) {
        const tempCreator: Creator = {
          id: `temp-${Date.now()}`,
          createdAt: new Date().toISOString(),
          ...newCreator,
        };

        queryClient.setQueryData<CreatorResponse>(['creators', filters], {
          ...previousCreators,
          data: [tempCreator, ...previousCreators.data].slice(0, previousCreators.limit),
          total: previousCreators.total + 1,
        });
      }

      return { previousCreators };
    },
    onError: (err, newCreator, context) => {
      // Rollback if mutation fails
      if (context?.previousCreators) {
        queryClient.setQueryData(['creators', filters], context.previousCreators);
      }
    },
    onSettled: () => {
      // Always refetch to stay in sync
      queryClient.invalidateQueries({ queryKey: ['creators'] });
    },
  });
}

// Hook to update a creator with optimistic updates
export function useUpdateCreatorMutation(filters: CreatorFilters) {
  const queryClient = useQueryClient();

  return useMutation<Creator, Error, { id: string } & Partial<Creator>, { previousCreators: CreatorResponse | undefined }>({
    mutationFn: updateCreator,
    onMutate: async (updatedCreator) => {
      await queryClient.cancelQueries({ queryKey: ['creators', filters] });

      const previousCreators = queryClient.getQueryData<CreatorResponse>(['creators', filters]);

      if (previousCreators) {
        queryClient.setQueryData<CreatorResponse>(['creators', filters], {
          ...previousCreators,
          data: previousCreators.data.map((c) =>
            c.id === updatedCreator.id ? { ...c, ...updatedCreator } : c
          ),
        });
      }

      return { previousCreators };
    },
    onError: (err, updatedCreator, context) => {
      if (context?.previousCreators) {
        queryClient.setQueryData(['creators', filters], context.previousCreators);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['creators'] });
    },
  });
}

// Hook to delete a creator with optimistic updates
export function useDeleteCreatorMutation(filters: CreatorFilters) {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string, { previousCreators: CreatorResponse | undefined }>({
    mutationFn: deleteCreator,
    onMutate: async (deletedId) => {
      await queryClient.cancelQueries({ queryKey: ['creators', filters] });

      const previousCreators = queryClient.getQueryData<CreatorResponse>(['creators', filters]);

      if (previousCreators) {
        queryClient.setQueryData<CreatorResponse>(['creators', filters], {
          ...previousCreators,
          data: previousCreators.data.filter((c) => c.id !== deletedId),
          total: Math.max(0, previousCreators.total - 1),
        });
      }

      return { previousCreators };
    },
    onError: (err, deletedId, context) => {
      if (context?.previousCreators) {
        queryClient.setQueryData(['creators', filters], context.previousCreators);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['creators'] });
    },
  });
}
