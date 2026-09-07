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

// Future module query key definitions (ready for subsequent phases)
export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...productKeys.lists(), filters] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
};

export const categoryKeys = {
  all: ['categories'] as const,
  list: () => [...categoryKeys.all, 'list'] as const,
};

export const brandKeys = {
  all: ['brands'] as const,
  list: () => [...brandKeys.all, 'list'] as const,
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
