'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../lib/api-client';
import { batchKeys, productKeys, inventoryKeys } from '../lib/query-keys';

export interface ProductBatch {
  id: string;
  productId: string;
  warehouseId: string;
  batchNumber: string;
  mfgDate: string | null;
  expiryDate: string;
  quantity: string | number;
  purchasePrice: string | number;
  status: 'ACTIVE' | 'NEAR_EXPIRY' | 'EXPIRED' | 'DEPLETED';
  daysRemaining?: number;
  createdAt: string;
  updatedAt: string;
  product?: { id: string; name: string; sku: string; unit: string };
  warehouse?: { id: string; name: string; code: string };
}

export interface BatchFilters {
  page?: number;
  limit?: number;
  search?: string;
  productId?: string;
  warehouseId?: string;
  status?: string;
}

export interface CreateBatchInput {
  productId: string;
  warehouseId: string;
  batchNumber: string;
  mfgDate?: string;
  expiryDate: string;
  quantity: number;
  purchasePrice: number;
}

export function useBatches(filters?: BatchFilters) {
  const queryParams = new URLSearchParams();
  if (filters?.page) queryParams.set('page', String(filters.page));
  if (filters?.limit) queryParams.set('limit', String(filters.limit));
  if (filters?.search) queryParams.set('search', filters.search);
  if (filters?.productId) queryParams.set('productId', filters.productId);
  if (filters?.warehouseId) queryParams.set('warehouseId', filters.warehouseId);
  if (filters?.status && filters.status !== 'ALL') queryParams.set('status', filters.status);

  const queryString = queryParams.toString();
  const endpoint = `/batches${queryString ? `?${queryString}` : ''}`;

  return useQuery({
    queryKey: batchKeys.list(filters),
    queryFn: async () => {
      const response = await apiClient.get<ProductBatch[]>(endpoint);
      return response;
    },
  });
}

export function useProductBatches(productId: string) {
  return useQuery({
    queryKey: batchKeys.byProduct(productId),
    queryFn: async () => {
      const response = await apiClient.get<ProductBatch[]>(`/batches/product/${productId}`);
      return response.data;
    },
    enabled: Boolean(productId),
  });
}

export function useCreateBatch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateBatchInput) => {
      const response = await apiClient.post<ProductBatch>('/batches', payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: batchKeys.all });
      queryClient.invalidateQueries({ queryKey: productKeys.all });
      queryClient.invalidateQueries({ queryKey: inventoryKeys.all });
    },
  });
}
