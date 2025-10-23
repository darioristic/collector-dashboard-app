import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Offer, OfferStatus } from '@/lib/api/types';
import { apiClient } from '@/lib/api/client';

interface OffersResponse {
  success: boolean;
  data: Offer[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

interface OfferResponse {
  success: boolean;
  data: Offer;
}

export function useOffers(params?: {
  page?: number;
  limit?: number;
  companyId?: string;
  customerId?: string;
  status?: OfferStatus;
}) {
  return useQuery({
    queryKey: ['offers', params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params?.page) searchParams.append('page', params.page.toString());
      if (params?.limit) searchParams.append('limit', params.limit.toString());
      if (params?.companyId) searchParams.append('companyId', params.companyId);
      if (params?.customerId) searchParams.append('customerId', params.customerId);
      if (params?.status) searchParams.append('status', params.status);

      return apiClient.get<OffersResponse>(`/offers?${searchParams.toString()}`);
    },
  });
}

export function useOffer(id: string) {
  return useQuery({
    queryKey: ['offer', id],
    queryFn: async () => {
      return apiClient.get<OfferResponse>(`/offers/${id}`);
    },
    enabled: !!id,
  });
}

export function useCreateOffer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      return apiClient.post('/offers', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['offers'] });
    },
  });
}

export function useUpdateOffer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      return apiClient.put(`/offers/${id}`, data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['offers'] });
      queryClient.invalidateQueries({ queryKey: ['offer', variables.id] });
    },
  });
}

export function useApproveOffer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return apiClient.post(`/offers/${id}/approve`, {});
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['offers'] });
      queryClient.invalidateQueries({ queryKey: ['offer', id] });
    },
  });
}

export function useRejectOffer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason?: string }) => {
      return apiClient.post(`/offers/${id}/reject`, { reason });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['offers'] });
      queryClient.invalidateQueries({ queryKey: ['offer', variables.id] });
    },
  });
}

export function useSendOffer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return apiClient.post(`/offers/${id}/send`, {});
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['offers'] });
      queryClient.invalidateQueries({ queryKey: ['offer', id] });
    },
  });
}

export function useSearchOffers(params?: {
  query?: string;
  companyId?: string;
  customerId?: string;
  status?: OfferStatus;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}) {
  return useQuery({
    queryKey: ['offers', 'search', params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params?.query) searchParams.append('q', params.query);
      if (params?.companyId) searchParams.append('companyId', params.companyId);
      if (params?.customerId) searchParams.append('customerId', params.customerId);
      if (params?.status) searchParams.append('status', params.status);
      if (params?.page) searchParams.append('page', params.page.toString());
      if (params?.limit) searchParams.append('limit', params.limit.toString());
      if (params?.sortBy) searchParams.append('sortBy', params.sortBy);
      if (params?.sortOrder) searchParams.append('sortOrder', params.sortOrder);

      return apiClient.get<OffersResponse>(`/offers/search?${searchParams.toString()}`);
    },
    enabled: !!params?.query || !!params?.companyId || !!params?.customerId,
  });
}

export function useBulkOfferAction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ ids, action, reason }: { ids: string[]; action: 'approve' | 'reject' | 'send' | 'delete'; reason?: string }) => {
      return apiClient.post('/offers/bulk', { ids, action, reason });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['offers'] });
    },
  });
}

