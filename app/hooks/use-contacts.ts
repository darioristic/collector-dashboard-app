import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import type {
  ApiResponse,
  Contact,
  ContactFilters,
  CreateContactInput,
  UpdateContactInput,
} from '@/lib/api/types';
import { toast } from 'sonner';

const QUERY_KEYS = {
  contacts: (filters?: ContactFilters) => ['contacts', filters],
  contact: (id: string) => ['contact', id],
} as const;

export function useContacts(filters?: ContactFilters) {
  return useQuery({
    queryKey: QUERY_KEYS.contacts(filters),
    queryFn: () =>
      apiClient.get<ApiResponse<Contact[]>>(
        '/contacts',
        filters
      ),
  });
}

export function useContact(id: string, enabled = true) {
  return useQuery({
    queryKey: QUERY_KEYS.contact(id),
    queryFn: () =>
      apiClient.get<ApiResponse<Contact>>(`/contacts/${id}`),
    enabled: enabled && !!id,
  });
}

export function useCreateContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateContactInput) =>
      apiClient.post<ApiResponse<Contact>>('/internal/contacts', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      toast.success('Contact created successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create contact');
    },
  });
}

export function useUpdateContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateContactInput }) =>
      apiClient.put<ApiResponse<Contact>>(`/internal/contacts/${id}`, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.contact(variables.id) });
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      toast.success('Contact updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update contact');
    },
  });
}

export function useDeleteContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      apiClient.delete<ApiResponse<{ message: string }>>(`/internal/contacts/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      toast.success('Contact deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete contact');
    },
  });
}

