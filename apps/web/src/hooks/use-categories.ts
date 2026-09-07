'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../lib/api-client';
import { categoryKeys, productKeys } from '../lib/query-keys';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  parentId: string | null;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  parent?: { id: string; name: string; slug: string } | null;
  children?: Category[];
  _count?: { products: number; children?: number };
}

export interface CategoryFilters {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
  tree?: boolean;
}

export function useCategories(filters?: CategoryFilters) {
  const queryParams = new URLSearchParams();
  if (filters?.page) queryParams.set('page', String(filters.page));
  if (filters?.limit) queryParams.set('limit', String(filters.limit));
  if (filters?.search) queryParams.set('search', filters.search);
  if (filters?.isActive !== undefined) queryParams.set('isActive', String(filters.isActive));
  if (filters?.tree !== undefined) queryParams.set('tree', String(filters.tree));

  const queryString = queryParams.toString();
  const endpoint = `/categories${queryString ? `?${queryString}` : ''}`;

  return useQuery({
    queryKey: categoryKeys.list(filters),
    queryFn: async () => {
      const response = await apiClient.get<Category[]>(endpoint);
      return response;
    },
  });
}

export function useCategory(id: string) {
  return useQuery({
    queryKey: categoryKeys.detail(id),
    queryFn: async () => {
      const response = await apiClient.get<Category>(`/categories/${id}`);
      return response.data;
    },
    enabled: Boolean(id),
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { name: string; slug?: string; description?: string; parentId?: string }) => {
      const response = await apiClient.post<Category>('/categories', payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...payload }: { id: string; name?: string; slug?: string; description?: string; parentId?: string | null; isActive?: boolean }) => {
      const response = await apiClient.patch<Category>(`/categories/${id}`, payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.delete<Category>(`/categories/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
    },
  });
}
