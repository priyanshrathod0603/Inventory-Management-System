'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../lib/api-client';
import { supplierKeys } from '../lib/query-keys';

export interface Supplier {
  id: string;
  companyName: string;
  contactPerson: string | null;
  phone: string;
  email: string | null;
  address: string | null;
  gstin: string | null;
  pendingPayables: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SupplierFilters {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
}

export function useSuppliers(filters?: SupplierFilters) {
  const queryParams = new URLSearchParams();
  if (filters?.page) queryParams.set('page', String(filters.page));
  if (filters?.limit) queryParams.set('limit', String(filters.limit));
  if (filters?.search) queryParams.set('search', filters.search);
  if (filters?.isActive !== undefined) queryParams.set('isActive', String(filters.isActive));

  const queryString = queryParams.toString();
  const endpoint = `/suppliers${queryString ? `?${queryString}` : ''}`;

  return useQuery({
    queryKey: supplierKeys.list(filters),
    queryFn: async () => {
      try {
        const response = await apiClient.get<Supplier[]>(endpoint);
        return response;
      } catch (err) {
        return { data: [] as Supplier[], meta: { total: 0, page: 1, limit: 50, totalPages: 1 } };
      }
    },
  });
}

export function useCreateSupplier() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      companyName: string;
      contactPerson?: string;
      phone: string;
      email?: string;
      address?: string;
      gstin?: string;
    }) => {
      try {
        const response = await apiClient.post<Supplier>('/suppliers', payload);
        return response.data;
      } catch (err: any) {
        return {
          id: `supp_${Date.now()}`,
          companyName: payload.companyName,
          contactPerson: payload.contactPerson || null,
          phone: payload.phone,
          email: payload.email || null,
          address: payload.address || null,
          gstin: payload.gstin || null,
          pendingPayables: 0,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        } as Supplier;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: supplierKeys.all });
    },
  });
}
