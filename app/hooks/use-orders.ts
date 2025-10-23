import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Order, OrderStatus } from '@/lib/api/types';
import { apiClient } from '@/lib/api/client';

interface OrdersResponse {
  success: boolean;
  data: Order[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

interface OrderResponse {
  success: boolean;
  data: Order;
}

export function useOrders(params?: {
  page?: number;
  limit?: number;
  companyId?: string;
  customerId?: string;
  status?: OrderStatus;
}) {
  return useQuery({
    queryKey: ['orders', params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params?.page) searchParams.append('page', params.page.toString());
      if (params?.limit) searchParams.append('limit', params.limit.toString());
      if (params?.companyId) searchParams.append('companyId', params.companyId);
      if (params?.customerId) searchParams.append('customerId', params.customerId);
      if (params?.status) searchParams.append('status', params.status);

      return apiClient.get<OrdersResponse>(`/orders?${searchParams.toString()}`);
    },
  });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: ['order', id],
    queryFn: async () => {
      return apiClient.get<OrderResponse>(`/orders/${id}`);
    },
    enabled: !!id,
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      return apiClient.post('/orders', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}

export function useUpdateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      return apiClient.put(`/orders/${id}`, data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['order', variables.id] });
    },
  });
}

export function useConfirmOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return apiClient.post(`/orders/${id}/confirm`);
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['order', id] });
    },
  });
}

export function useFulfillOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return apiClient.post(`/orders/${id}/fulfill`);
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['order', id] });
    },
  });
}

export function useCancelOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason?: string }) => {
      return apiClient.post(`/orders/${id}/cancel`, { reason });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['order', variables.id] });
    },
  });
}

export function useSearchOrders(params?: {
  query?: string;
  companyId?: string;
  customerId?: string;
  status?: OrderStatus;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}) {
  return useQuery({
    queryKey: ['orders', 'search', params],
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

      return apiClient.get<OrdersResponse>(`/orders/search?${searchParams.toString()}`);
    },
    enabled: !!params?.query || !!params?.companyId || !!params?.customerId,
  });
}

export function useBulkOrderAction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ ids, action, reason }: { ids: string[]; action: 'confirm' | 'fulfill' | 'cancel'; reason?: string }) => {
      return apiClient.post('/orders/bulk', { ids, action, reason });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}

