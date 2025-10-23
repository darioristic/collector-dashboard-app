import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Delivery, DeliveryStatus } from '@/lib/api/types';
import { apiClient } from '@/lib/api/client';

interface DeliveriesResponse {
  success: boolean;
  data: Delivery[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

interface DeliveryResponse {
  success: boolean;
  data: Delivery;
}

export function useDeliveries(params?: {
  page?: number;
  limit?: number;
  orderId?: string;
  status?: DeliveryStatus;
}) {
  return useQuery({
    queryKey: ['deliveries', params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params?.page) searchParams.append('page', params.page.toString());
      if (params?.limit) searchParams.append('limit', params.limit.toString());
      if (params?.orderId) searchParams.append('orderId', params.orderId);
      if (params?.status) searchParams.append('status', params.status);

      return apiClient.get<DeliveriesResponse>(`/deliveries?${searchParams.toString()}`);
    },
  });
}

export function useDelivery(id: string) {
  return useQuery({
    queryKey: ['delivery', id],
    queryFn: async () => {
      return apiClient.get<DeliveryResponse>(`/deliveries/${id}`);
    },
    enabled: !!id,
  });
}

export function useCreateDelivery() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      return apiClient.post('/deliveries', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deliveries'] });
    },
  });
}

export function useUpdateDelivery() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      return apiClient.put(`/deliveries/${id}`, data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['deliveries'] });
      queryClient.invalidateQueries({ queryKey: ['delivery', variables.id] });
    },
  });
}

export function useMarkDelivered() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return apiClient.post(`/deliveries/${id}/mark-delivered`, {});
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['deliveries'] });
      queryClient.invalidateQueries({ queryKey: ['delivery', id] });
    },
  });
}

export function useSignDelivery() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, signedBy }: { id: string; signedBy: string }) => {
      return apiClient.post(`/deliveries/${id}/sign`, { signedBy });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['deliveries'] });
      queryClient.invalidateQueries({ queryKey: ['delivery', variables.id] });
    },
  });
}

export function useSearchDeliveries(params?: {
  query?: string;
  companyId?: string;
  customerId?: string;
  orderId?: string;
  status?: DeliveryStatus;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}) {
  return useQuery({
    queryKey: ['deliveries', 'search', params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params?.query) searchParams.append('q', params.query);
      if (params?.companyId) searchParams.append('companyId', params.companyId);
      if (params?.customerId) searchParams.append('customerId', params.customerId);
      if (params?.orderId) searchParams.append('orderId', params.orderId);
      if (params?.status) searchParams.append('status', params.status);
      if (params?.page) searchParams.append('page', params.page.toString());
      if (params?.limit) searchParams.append('limit', params.limit.toString());
      if (params?.sortBy) searchParams.append('sortBy', params.sortBy);
      if (params?.sortOrder) searchParams.append('sortOrder', params.sortOrder);

      return apiClient.get<DeliveriesResponse>(`/deliveries/search?${searchParams.toString()}`);
    },
    enabled: !!params?.query || !!params?.companyId || !!params?.customerId || !!params?.orderId,
  });
}

