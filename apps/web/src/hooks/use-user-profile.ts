import { useQuery } from '@tanstack/react-query';
import { apiClient, ApiError } from '../lib/api-client';
import { userKeys } from '../lib/query-keys';
import { AuthUser } from '../lib/auth/auth-context';

/**
 * UserProfileResponse — Universal Admin Access Model
 * No roleId, no role hierarchy. accessLevel is always 'Admin'.
 */
export interface UserProfileResponse extends AuthUser {
  phone: string | null;
  accessLevel: 'Admin';
  isActive: boolean;
  createdAt: string;
}

export function useUserProfile(userId?: string) {
  return useQuery<UserProfileResponse, ApiError>({
    queryKey: userId ? userKeys.detail(userId) : userKeys.profile(),
    queryFn: async () => {
      const endpoint = userId ? `/users/${userId}` : '/users/me';
      const res = await apiClient.get<UserProfileResponse>(endpoint);
      return res.data;
    },
    enabled: typeof userId === 'string' ? !!userId : true,
    staleTime: 1000 * 60 * 5,
    retry: (failureCount, error) => {
      if (error?.status === 401 || error?.status === 403 || error?.status === 404) return false;
      return failureCount < 1;
    },
  });
}
