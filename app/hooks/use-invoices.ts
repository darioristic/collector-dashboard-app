import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Invoice, InvoiceStatus, InvoiceType } from '@/lib/api/types';
import { apiClient } from '@/lib/api/client';

interface InvoicesResponse {
  success: boolean;
  data: Invoice[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

interface InvoiceResponse {
  success: boolean;
  data: Invoice;
}

export function useInvoices(params?: {
  page?: number;
  limit?: number;
  companyId?: string;
  customerId?: string;
  type?: InvoiceType;
  status?: InvoiceStatus;
}) {
  return useQuery({
    queryKey: ['invoices', params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params?.page) searchParams.append('page', params.page.toString());
      if (params?.limit) searchParams.append('limit', params.limit.toString());
      if (params?.companyId) searchParams.append('companyId', params.companyId);
      if (params?.customerId) searchParams.append('customerId', params.customerId);
      if (params?.type) searchParams.append('type', params.type);
      if (params?.status) searchParams.append('status', params.status);

      return apiClient.get<InvoicesResponse>(`/invoices?${searchParams.toString()}`);
    },
  });
}

export function useInvoice(id: string) {
  return useQuery({
    queryKey: ['invoice', id],
    queryFn: async () => {
      return apiClient.get<InvoiceResponse>(`/invoices/${id}`);
    },
    enabled: !!id,
  });
}

export function useCreateInvoice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      return apiClient.post('/invoices', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
    },
  });
}

export function useUpdateInvoice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      return apiClient.put(`/invoices/${id}`, data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['invoice', variables.id] });
    },
  });
}

export function useSendInvoice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return apiClient.post(`/invoices/${id}/send`, {});
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['invoice', id] });
    },
  });
}

export function usePayInvoice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, paidAt }: { id: string; paidAt?: Date }) => {
      return apiClient.post(`/invoices/${id}/pay`, { paidAt });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['invoice', variables.id] });
    },
  });
}

export function useMarkAsUnpaid() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return apiClient.post(`/invoices/${id}/unpaid`, {});
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['invoice', id] });
    },
  });
}

export function useCancelInvoice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason?: string }) => {
      return apiClient.post(`/invoices/${id}/cancel`, { reason });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['invoice', variables.id] });
    },
  });
}

export function useSearchInvoices(params?: {
  query?: string;
  companyId?: string;
  customerId?: string;
  type?: InvoiceType;
  status?: InvoiceStatus;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}) {
  return useQuery({
    queryKey: ['invoices', 'search', params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params?.query) searchParams.append('q', params.query);
      if (params?.companyId) searchParams.append('companyId', params.companyId);
      if (params?.customerId) searchParams.append('customerId', params.customerId);
      if (params?.type) searchParams.append('type', params.type);
      if (params?.status) searchParams.append('status', params.status);
      if (params?.page) searchParams.append('page', params.page.toString());
      if (params?.limit) searchParams.append('limit', params.limit.toString());
      if (params?.sortBy) searchParams.append('sortBy', params.sortBy);
      if (params?.sortOrder) searchParams.append('sortOrder', params.sortOrder);

      return apiClient.get<InvoicesResponse>(`/invoices/search?${searchParams.toString()}`);
    },
    enabled: !!params?.query || !!params?.companyId || !!params?.customerId,
  });
}

export function useBulkInvoiceAction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ ids, action, reason }: { ids: string[]; action: 'send' | 'pay' | 'cancel'; reason?: string }) => {
      return apiClient.post('/invoices/bulk', { ids, action, reason });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
    },
  });
}

export function useDownloadInvoicePDF() {
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/v1/invoices/${id}/pdf`, {
        headers: {
          Authorization: `Bearer ${apiClient.getToken?.() ?? ''}`,
        },
      });
      if (!response.ok) throw new Error('Failed to download PDF');
      
      const blob = await response.blob();
      const contentDisposition = response.headers.get('Content-Disposition');
      const filename = contentDisposition
        ? contentDisposition.split('filename=')[1]?.replace(/"/g, '')
        : `invoice-${id}.pdf`;
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      return { success: true };
    },
  });
}

export function useGetInvoiceQRCode(id: string, type: 'invoice' | 'payment' = 'invoice') {
  return useQuery({
    queryKey: ['invoice-qr', id, type],
    queryFn: async () => {
      const response = await fetch(`/api/v1/invoices/${id}/qrcode?type=${type}`);
      if (!response.ok) throw new Error('Failed to get QR code');
      return response.json();
    },
    enabled: !!id,
  });
}

export function useCreateInvoiceFromOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ orderId, dueDate }: { orderId: string; dueDate: Date }) => {
      return apiClient.post('/invoices/create-from-order', { orderId, dueDate: dueDate.toISOString() });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
    },
  });
}

export function useCreateInvoiceFromDelivery() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ deliveryId, dueDate }: { deliveryId: string; dueDate: Date }) => {
      return apiClient.post('/invoices/create-from-delivery', { deliveryId, dueDate: dueDate.toISOString() });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
    },
  });
}

