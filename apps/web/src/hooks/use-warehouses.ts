'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../lib/api-client';
import { warehouseKeys, inventoryKeys } from '../lib/query-keys';

export interface Warehouse {
  id: string;
  name: string;
  code: string;
  address: string | null;
  isDefault: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: { warehouseInventory: number };
}

export function useWarehouses() {
  return useQuery({
    queryKey: warehouseKeys.list(),
    queryFn: async () => {
      const response = await apiClient.get<Warehouse[]>('/warehouses');
      return response.data;
    },
  });
}

export function useWarehouse(id: string) {
  return useQuery({
    queryKey: warehouseKeys.detail(id),
    queryFn: async () => {
      const response = await apiClient.get<Warehouse>(`/warehouses/${id}`);
      return response.data;
    },
    enabled: Boolean(id),
  });
}

export function useCreateWarehouse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { name: string; code: string; address?: string; isDefault?: boolean }) => {
      const response = await apiClient.post<Warehouse>('/warehouses', payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: warehouseKeys.all });
      queryClient.invalidateQueries({ queryKey: inventoryKeys.all });
    },
  });
}

export function useUpdateWarehouse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...payload }: { id: string; name?: string; code?: string; address?: string; isDefault?: boolean; isActive?: boolean }) => {
      const response = await apiClient.patch<Warehouse>(`/warehouses/${id}`, payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: warehouseKeys.all });
      queryClient.invalidateQueries({ queryKey: inventoryKeys.all });
    },
  });
}
