import { Creator, CreatorFilters, CreatorResponse } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';

export async function fetchCreators(filters: CreatorFilters): Promise<CreatorResponse> {
  const params = new URLSearchParams();
  params.append('page', String(filters.page));
  params.append('limit', String(filters.limit));
  
  if (filters.sortBy) params.append('sortBy', filters.sortBy);
  if (filters.order) params.append('order', filters.order);
  if (filters.niche) params.append('niche', filters.niche);
  if (filters.minFollowers !== undefined) params.append('minFollowers', String(filters.minFollowers));
  if (filters.maxFollowers !== undefined) params.append('maxFollowers', String(filters.maxFollowers));
  if (filters.search) params.append('search', filters.search);

  const response = await fetch(`${API_BASE_URL}/creators?${params.toString()}`);
  if (!response.ok) {
    throw new Error('Failed to fetch creators');
  }
  return response.json();
}

export async function createCreator(creator: Omit<Creator, 'id' | 'createdAt'>): Promise<Creator> {
  const response = await fetch(`${API_BASE_URL}/creators`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(creator),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to create creator');
  }
  return response.json();
}

export async function updateCreator({ id, ...updates }: { id: string } & Partial<Creator>): Promise<Creator> {
  const response = await fetch(`${API_BASE_URL}/creators/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to update creator');
  }
  return response.json();
}

export async function deleteCreator(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/creators/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete creator');
  }
}
