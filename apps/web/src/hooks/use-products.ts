'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../lib/api-client';
import { productKeys, inventoryKeys } from '../lib/query-keys';

export interface WarehouseInventoryInfo {
  id: string;
  warehouseId: string;
  productId: string;
  quantity: string | number;
  updatedAt: string;
  warehouse?: { id: string; name: string; code: string };
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  barcode: string | null;
  categoryId: string;
  brandId: string | null;
  unit: string;
  purchasePrice: string | number;
  sellingPrice: string | number;
  mrp: string | number;
  taxRate: string | number;
  isTaxInclusive: boolean;
  minStockAlert: string | number;
  currentStock: string | number;
  hasBatchTracking: boolean;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  stockStatus: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';
  category?: { id: string; name: string; slug: string };
  brand?: { id: string; name: string } | null;
  warehouseInventory?: WarehouseInventoryInfo[];
  batches?: any[];
  stockMovements?: any[];
}

export interface ProductFilters {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  brandId?: string;
  warehouseId?: string;
  stockStatus?: string;
  isActive?: boolean;
}

export interface CreateProductInput {
  name: string;
  sku: string;
  barcode?: string;
  categoryId: string;
  brandId?: string;
  unit: string;
  purchasePrice?: number;
  sellingPrice: number;
  mrp?: number;
  taxRate?: number;
  isTaxInclusive?: boolean;
  minStockAlert?: number;
  initialOpeningStock?: number;
  warehouseId?: string;
  hasBatchTracking?: boolean;
}

export interface UpdateProductInput {
  id: string;
  name?: string;
  sku?: string;
  barcode?: string | null;
  categoryId?: string;
  brandId?: string | null;
  unit?: string;
  purchasePrice?: number;
  sellingPrice?: number;
  mrp?: number;
  taxRate?: number;
  isTaxInclusive?: boolean;
  minStockAlert?: number;
  hasBatchTracking?: boolean;
  isActive?: boolean;
}

export function useProducts(filters?: ProductFilters) {
  const queryParams = new URLSearchParams();
  if (filters?.page) queryParams.set('page', String(filters.page));
  if (filters?.limit) queryParams.set('limit', String(filters.limit));
  if (filters?.search) queryParams.set('search', filters.search);
  if (filters?.categoryId) queryParams.set('categoryId', filters.categoryId);
  if (filters?.brandId) queryParams.set('brandId', filters.brandId);
  if (filters?.warehouseId) queryParams.set('warehouseId', filters.warehouseId);
  if (filters?.stockStatus && filters.stockStatus !== 'ALL') {
    queryParams.set('stockStatus', filters.stockStatus);
  }
  if (filters?.isActive !== undefined) queryParams.set('isActive', String(filters.isActive));

  const queryString = queryParams.toString();
  const endpoint = `/products${queryString ? `?${queryString}` : ''}`;

  return useQuery({
    queryKey: productKeys.list(filters),
    queryFn: async () => {
      const response = await apiClient.get<Product[]>(endpoint);
      return response;
    },
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: async () => {
      const response = await apiClient.get<Product>(`/products/${id}`);
      return response.data;
    },
    enabled: Boolean(id),
  });
}

export function useProductByBarcode(barcode: string) {
  return useQuery({
    queryKey: productKeys.barcode(barcode),
    queryFn: async () => {
      const response = await apiClient.get<Product>(`/products/barcode/${barcode}`);
      return response.data;
    },
    enabled: Boolean(barcode),
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateProductInput) => {
      const response = await apiClient.post<Product>('/products', payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
      queryClient.invalidateQueries({ queryKey: inventoryKeys.all });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...payload }: UpdateProductInput) => {
      const response = await apiClient.patch<Product>(`/products/${id}`, payload);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
      queryClient.invalidateQueries({ queryKey: productKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: inventoryKeys.all });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.delete<Product>(`/products/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
      queryClient.invalidateQueries({ queryKey: inventoryKeys.all });
    },
  });
}
