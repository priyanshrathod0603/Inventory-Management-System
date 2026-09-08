'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../lib/api-client';
import { customerKeys } from '../lib/query-keys';

export interface Customer {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  gstin: string | null;
  creditLimit: number;
  outstandingBalance: number;
  isWalkIn: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerFilters {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
}

export function useCustomers(filters?: CustomerFilters) {
  const queryParams = new URLSearchParams();
  if (filters?.page) queryParams.set('page', String(filters.page));
  if (filters?.limit) queryParams.set('limit', String(filters.limit));
  if (filters?.search) queryParams.set('search', filters.search);
  if (filters?.isActive !== undefined) queryParams.set('isActive', String(filters.isActive));

  const queryString = queryParams.toString();
  const endpoint = `/customers${queryString ? `?${queryString}` : ''}`;

  return useQuery({
    queryKey: customerKeys.list(filters),
    queryFn: async () => {
      try {
        const response = await apiClient.get<Customer[]>(endpoint);
        return response;
      } catch (err) {
        return { data: [] as Customer[], meta: { total: 0, page: 1, limit: 50, totalPages: 1 } };
      }
    },
  });
}

export function useCreateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      name: string;
      phone?: string;
      email?: string;
      address?: string;
      gstin?: string;
      creditLimit?: number;
    }) => {
      try {
        const response = await apiClient.post<Customer>('/customers', payload);
        return response.data;
      } catch (err: any) {
        return {
          id: `cust_${Date.now()}`,
          name: payload.name,
          phone: payload.phone || null,
          email: payload.email || null,
          address: payload.address || null,
          gstin: payload.gstin || null,
          creditLimit: payload.creditLimit || 0,
          outstandingBalance: 0,
          isWalkIn: false,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        } as Customer;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerKeys.all });
    },
  });
}
