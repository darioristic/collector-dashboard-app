import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import type {
  ApiResponse,
  Relationship,
  RelationshipFilters,
  CreateRelationshipInput,
  UpdateRelationshipInput,
} from '@/lib/api/types';
import { toast } from 'sonner';

const QUERY_KEYS = {
  relationships: (filters?: RelationshipFilters) => ['relationships', filters],
  relationship: (id: string) => ['relationship', id],
} as const;

export function useRelationships(filters?: RelationshipFilters) {
  return useQuery({
    queryKey: QUERY_KEYS.relationships(filters),
    queryFn: () =>
      apiClient.get<ApiResponse<Relationship[]>>(
        '/relationships',
        filters
      ),
  });
}

export function useRelationship(id: string, enabled = true) {
  return useQuery({
    queryKey: QUERY_KEYS.relationship(id),
    queryFn: () =>
      apiClient.get<ApiResponse<Relationship>>(`/relationships/${id}`),
    enabled: enabled && !!id,
  });
}

export function useCreateRelationship() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRelationshipInput) =>
      apiClient.post<ApiResponse<Relationship>>('/internal/relationships', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['relationships'] });
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      toast.success('Relationship created successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create relationship');
    },
  });
}

export function useUpdateRelationship() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateRelationshipInput }) =>
      apiClient.put<ApiResponse<Relationship>>(`/internal/relationships/${id}`, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['relationships'] });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.relationship(variables.id) });
      toast.success('Relationship updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update relationship');
    },
  });
}

export function useDeleteRelationship() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      apiClient.delete<ApiResponse<{ message: string }>>(`/internal/relationships/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['relationships'] });
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      toast.success('Relationship deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete relationship');
    },
  });
}

