/**
 * Central Query Key Factory for TanStack Query
 * Ensures consistent, hierarchical, and predictable query cache keys across the application.
 */

export const authKeys = {
  all: ['auth'] as const,
  me: () => [...authKeys.all, 'me'] as const,
};

export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...userKeys.lists(), filters] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
  profile: () => [...userKeys.all, 'profile'] as const,
};

export const healthKeys = {
  all: ['health'] as const,
  liveness: () => [...healthKeys.all, 'liveness'] as const,
  readiness: () => [...healthKeys.all, 'readiness'] as const,
};

export const categoryKeys = {
  all: ['categories'] as const,
  lists: () => [...categoryKeys.all, 'list'] as const,
  list: (filters?: Record<string, any>) => [...categoryKeys.lists(), filters ?? {}] as const,
  details: () => [...categoryKeys.all, 'detail'] as const,
  detail: (id: string) => [...categoryKeys.details(), id] as const,
};

export const brandKeys = {
  all: ['brands'] as const,
  lists: () => [...brandKeys.all, 'list'] as const,
  list: (filters?: Record<string, any>) => [...brandKeys.lists(), filters ?? {}] as const,
  details: () => [...brandKeys.all, 'detail'] as const,
  detail: (id: string) => [...brandKeys.details(), id] as const,
};

export const warehouseKeys = {
  all: ['warehouses'] as const,
  lists: () => [...warehouseKeys.all, 'list'] as const,
  list: () => [...warehouseKeys.lists()] as const,
  details: () => [...warehouseKeys.all, 'detail'] as const,
  detail: (id: string) => [...warehouseKeys.details(), id] as const,
};

export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filters?: Record<string, any>) => [...productKeys.lists(), filters ?? {}] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
  barcode: (barcode: string) => [...productKeys.all, 'barcode', barcode] as const,
};

export const inventoryKeys = {
  all: ['inventory'] as const,
  overview: (filters?: Record<string, any>) => [...inventoryKeys.all, 'overview', filters ?? {}] as const,
  movements: (filters?: Record<string, any>) => [...inventoryKeys.all, 'movements', filters ?? {}] as const,
  adjustments: (filters?: Record<string, any>) => [...inventoryKeys.all, 'adjustments', filters ?? {}] as const,
  transfers: (filters?: Record<string, any>) => [...inventoryKeys.all, 'transfers', filters ?? {}] as const,
  transferDetail: (id: string) => [...inventoryKeys.all, 'transfers', id] as const,
};

export const batchKeys = {
  all: ['batches'] as const,
  lists: () => [...batchKeys.all, 'list'] as const,
  list: (filters?: Record<string, any>) => [...batchKeys.lists(), filters ?? {}] as const,
  byProduct: (productId: string) => [...batchKeys.all, 'product', productId] as const,
};

export const salesKeys = {
  all: ['sales'] as const,
  lists: () => [...salesKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...salesKeys.lists(), filters] as const,
  details: () => [...salesKeys.all, 'detail'] as const,
  detail: (id: string) => [...salesKeys.details(), id] as const,
};

export const purchaseKeys = {
  all: ['purchases'] as const,
  lists: () => [...purchaseKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...purchaseKeys.lists(), filters] as const,
  details: () => [...purchaseKeys.all, 'detail'] as const,
  detail: (id: string) => [...purchaseKeys.details(), id] as const,
};

export const businessProfileKeys = {
  all: ['business-profile'] as const,
  profile: () => [...businessProfileKeys.all, 'detail'] as const,
};

export const customerKeys = {
  all: ['customers'] as const,
  lists: () => [...customerKeys.all, 'list'] as const,
  list: (filters?: Record<string, any>) => [...customerKeys.lists(), filters ?? {}] as const,
  details: () => [...customerKeys.all, 'detail'] as const,
  detail: (id: string) => [...customerKeys.details(), id] as const,
};

export const supplierKeys = {
  all: ['suppliers'] as const,
  lists: () => [...supplierKeys.all, 'list'] as const,
  list: (filters?: Record<string, any>) => [...supplierKeys.lists(), filters ?? {}] as const,
  details: () => [...supplierKeys.all, 'detail'] as const,
  detail: (id: string) => [...supplierKeys.details(), id] as const,
};
