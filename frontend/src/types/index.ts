export type Niche = 'beauty' | 'fitness' | 'travel' | 'food' | 'tech' | 'fashion';

export interface Creator {
  id: string;
  name: string;
  niche: Niche;
  followerCount: number;
  engagementRate: number; // 0-100, one decimal
  email: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface CreatorResponse {
  data: Creator[];
  total: number;
  page: number;
  limit: number;
  stats?: {
    totalFollowers: number;
    avgEngagement: number;
    activeCount: number;
  };
}

export interface CreatorFilters {
  page: number;
  limit: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
  niche?: string;
  minFollowers?: number;
  maxFollowers?: number;
  search?: string;
}
