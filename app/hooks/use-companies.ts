import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import type {
  ApiResponse,
  Company,
  CompanyFilters,
  CreateCompanyInput,
  UpdateCompanyInput,
} from '@/lib/api/types';
import { toast } from 'sonner';

const QUERY_KEYS = {
  companies: (filters?: CompanyFilters) => ['companies', filters],
  company: (id: string) => ['company', id],
  companySearch: (query: string) => ['companies', 'search', query],
} as const;

export function useCompanies(filters?: CompanyFilters) {
  return useQuery({
    queryKey: QUERY_KEYS.companies(filters),
    queryFn: () =>
      apiClient.get<ApiResponse<Company[]>>(
        '/companies',
        filters
      ),
  });
}

export function useCompany(id: string, enabled = true) {
  return useQuery({
    queryKey: QUERY_KEYS.company(id),
    queryFn: () =>
      apiClient.get<ApiResponse<Company>>(`/companies/${id}`),
    enabled: enabled && !!id,
  });
}

export function useCompanySearch(query: string) {
  return useQuery({
    queryKey: QUERY_KEYS.companySearch(query),
    queryFn: () =>
      apiClient.get<ApiResponse<Company[]>>('/companies/search', { query }),
    enabled: query.length > 2,
  });
}

export function useCreateCompany() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCompanyInput) =>
      apiClient.post<ApiResponse<Company>>('/internal/companies', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      toast.success('Company created successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create company');
    },
  });
}

export function useUpdateCompany() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCompanyInput }) =>
      apiClient.put<ApiResponse<Company>>(`/internal/companies/${id}`, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.company(variables.id) });
      toast.success('Company updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update company');
    },
  });
}

export function useDeleteCompany() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      apiClient.delete<ApiResponse<{ message: string }>>(`/internal/companies/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      toast.success('Company deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete company');
    },
  });
}

