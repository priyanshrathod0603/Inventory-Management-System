'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../lib/api-client';
import { brandKeys, productKeys } from '../lib/query-keys';

export interface Brand {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: { products: number };
}

export interface BrandFilters {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
}

export function useBrands(filters?: BrandFilters) {
  const queryParams = new URLSearchParams();
  if (filters?.page) queryParams.set('page', String(filters.page));
  if (filters?.limit) queryParams.set('limit', String(filters.limit));
  if (filters?.search) queryParams.set('search', filters.search);
  if (filters?.isActive !== undefined) queryParams.set('isActive', String(filters.isActive));

  const queryString = queryParams.toString();
  const endpoint = `/brands${queryString ? `?${queryString}` : ''}`;

  return useQuery({
    queryKey: brandKeys.list(filters),
    queryFn: async () => {
      const response = await apiClient.get<Brand[]>(endpoint);
      return response;
    },
  });
}

export function useBrand(id: string) {
  return useQuery({
    queryKey: brandKeys.detail(id),
    queryFn: async () => {
      const response = await apiClient.get<Brand>(`/brands/${id}`);
      return response.data;
    },
    enabled: Boolean(id),
  });
}

export function useCreateBrand() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { name: string; description?: string }) => {
      const response = await apiClient.post<Brand>('/brands', payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: brandKeys.all });
    },
  });
}

export function useUpdateBrand() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...payload }: { id: string; name?: string; description?: string; isActive?: boolean }) => {
      const response = await apiClient.patch<Brand>(`/brands/${id}`, payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: brandKeys.all });
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
  });
}

export function useDeleteBrand() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.delete<Brand>(`/brands/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: brandKeys.all });
    },
  });
}
