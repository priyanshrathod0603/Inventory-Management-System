import { useQuery } from '@tanstack/react-query';
import { apiClient, ApiError } from '../lib/api-client';
import { authKeys } from '../lib/query-keys';
import { AuthUser } from '../lib/auth/auth-context';

export function useCurrentUser() {
  return useQuery<AuthUser, ApiError>({
    queryKey: authKeys.me(),
    queryFn: async () => {
      const res = await apiClient.get<AuthUser>('/auth/me');
      return res.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: (failureCount, error) => {
      if (error?.status === 401 || error?.status === 403) return false;
      return failureCount < 1;
    },
  });
}
