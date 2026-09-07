'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../lib/api-client';
import { inventoryKeys, productKeys } from '../lib/query-keys';
import { Product } from './use-products';

export interface InventorySummary {
  totalValuationCost: number;
  totalValuationRetail: number;
  totalUnits: number;
  lowStockCount: number;
  outOfStockCount: number;
  totalProductsCount: number;
}

export interface InventoryOverviewResponse {
  summary: InventorySummary;
  products: Product[];
}

export interface StockMovement {
  id: string;
  movementDate: string;
  productId: string;
  warehouseId: string;
  batchId: string | null;
  movementType: string;
  quantity: string | number;
  beforeStock: string | number;
  afterStock: string | number;
  referenceType: string;
  referenceId: string;
  referenceNumber: string;
  userId: string;
  reason: string | null;
  createdAt: string;
  product?: { id: string; name: string; sku: string; unit: string };
  warehouse?: { id: string; name: string; code: string };
  user?: { id: string; fullName: string; username: string };
  batch?: { id: string; batchNumber: string; expiryDate: string } | null;
}

export interface StockAdjustment {
  id: string;
  adjustmentNumber: string;
  warehouseId: string;
  productId: string;
  adjustmentType: 'INCREASE' | 'DECREASE';
  quantity: string | number;
  previousStock: string | number;
  newStock: string | number;
  reasonCategory: string;
  notes: string;
  authorizedBy: string;
  createdAt: string;
  product?: { id: string; name: string; sku: string; unit: string };
  warehouse?: { id: string; name: string; code: string };
  authorizer?: { id: string; fullName: string; username: string };
}

export interface StockTransferItem {
  id: string;
  stockTransferId: string;
  productId: string;
  quantity: string | number;
  product?: { id: string; name: string; sku: string; unit: string; sellingPrice?: string | number };
}

export interface StockTransfer {
  id: string;
  transferNumber: string;
  fromWarehouseId: string;
  toWarehouseId: string;
  transferDate: string;
  status: 'DRAFT' | 'IN_TRANSIT' | 'COMPLETED' | 'CANCELLED';
  notes: string | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  fromWarehouse?: { id: string; name: string; code: string; address?: string };
  toWarehouse?: { id: string; name: string; code: string; address?: string };
  creator?: { id: string; fullName: string; username: string };
  items?: StockTransferItem[];
}

export interface InventoryOverviewFilters {
  page?: number;
  limit?: number;
  search?: string;
  warehouseId?: string;
  categoryId?: string;
  stockStatus?: string;
}

export function useInventoryOverview(filters?: InventoryOverviewFilters) {
  const queryParams = new URLSearchParams();
  if (filters?.page) queryParams.set('page', String(filters.page));
  if (filters?.limit) queryParams.set('limit', String(filters.limit));
  if (filters?.search) queryParams.set('search', filters.search);
  if (filters?.warehouseId) queryParams.set('warehouseId', filters.warehouseId);
  if (filters?.categoryId) queryParams.set('categoryId', filters.categoryId);
  if (filters?.stockStatus && filters.stockStatus !== 'ALL') {
    queryParams.set('stockStatus', filters.stockStatus);
  }

  const queryString = queryParams.toString();
  const endpoint = `/inventory/overview${queryString ? `?${queryString}` : ''}`;

  return useQuery({
    queryKey: inventoryKeys.overview(filters),
    queryFn: async () => {
      const response = await apiClient.get<InventoryOverviewResponse>(endpoint);
      return response;
    },
  });
}

export interface StockMovementFilters {
  page?: number;
  limit?: number;
  productId?: string;
  warehouseId?: string;
  movementType?: string;
  startDate?: string;
  endDate?: string;
}

export function useStockMovements(filters?: StockMovementFilters) {
  const queryParams = new URLSearchParams();
  if (filters?.page) queryParams.set('page', String(filters.page));
  if (filters?.limit) queryParams.set('limit', String(filters.limit));
  if (filters?.productId) queryParams.set('productId', filters.productId);
  if (filters?.warehouseId) queryParams.set('warehouseId', filters.warehouseId);
  if (filters?.movementType) queryParams.set('movementType', filters.movementType);
  if (filters?.startDate) queryParams.set('startDate', filters.startDate);
  if (filters?.endDate) queryParams.set('endDate', filters.endDate);

  const queryString = queryParams.toString();
  const endpoint = `/inventory/movements${queryString ? `?${queryString}` : ''}`;

  return useQuery({
    queryKey: inventoryKeys.movements(filters),
    queryFn: async () => {
      const response = await apiClient.get<StockMovement[]>(endpoint);
      return response;
    },
  });
}

export function useStockAdjustments(filters?: { page?: number; limit?: number; search?: string }) {
  const queryParams = new URLSearchParams();
  if (filters?.page) queryParams.set('page', String(filters.page));
  if (filters?.limit) queryParams.set('limit', String(filters.limit));
  if (filters?.search) queryParams.set('search', filters.search);

  const queryString = queryParams.toString();
  const endpoint = `/inventory/adjustments${queryString ? `?${queryString}` : ''}`;

  return useQuery({
    queryKey: inventoryKeys.adjustments(filters),
    queryFn: async () => {
      const response = await apiClient.get<StockAdjustment[]>(endpoint);
      return response;
    },
  });
}

export function useCreateAdjustment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      productId: string;
      warehouseId: string;
      adjustmentType: 'INCREASE' | 'DECREASE';
      quantity: number;
      reasonCategory: string;
      notes: string;
    }) => {
      const response = await apiClient.post<StockAdjustment>('/inventory/adjustments', payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.all });
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
  });
}

export function useStockTransfers(filters?: { page?: number; limit?: number; search?: string }) {
  const queryParams = new URLSearchParams();
  if (filters?.page) queryParams.set('page', String(filters.page));
  if (filters?.limit) queryParams.set('limit', String(filters.limit));
  if (filters?.search) queryParams.set('search', filters.search);

  const queryString = queryParams.toString();
  const endpoint = `/inventory/transfers${queryString ? `?${queryString}` : ''}`;

  return useQuery({
    queryKey: inventoryKeys.transfers(filters),
    queryFn: async () => {
      const response = await apiClient.get<StockTransfer[]>(endpoint);
      return response;
    },
  });
}

export function useStockTransfer(id: string) {
  return useQuery({
    queryKey: inventoryKeys.transferDetail(id),
    queryFn: async () => {
      const response = await apiClient.get<StockTransfer>(`/inventory/transfers/${id}`);
      return response.data;
    },
    enabled: Boolean(id),
  });
}

export function useCreateTransfer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      fromWarehouseId: string;
      toWarehouseId: string;
      status?: 'DRAFT' | 'IN_TRANSIT' | 'COMPLETED';
      notes?: string;
      items: { productId: string; quantity: number }[];
    }) => {
      const response = await apiClient.post<StockTransfer>('/inventory/transfers', payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.all });
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
  });
}

export function useUpdateTransferStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      status,
      notes,
    }: {
      id: string;
      status: 'DRAFT' | 'IN_TRANSIT' | 'COMPLETED' | 'CANCELLED';
      notes?: string;
    }) => {
      const response = await apiClient.patch<StockTransfer>(`/inventory/transfers/${id}/status`, {
        status,
        notes,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.all });
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
  });
}
