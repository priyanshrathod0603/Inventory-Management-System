import { useQuery } from '@tanstack/react-query';
import { apiClient, ApiError } from '../lib/api-client';
import { healthKeys } from '../lib/query-keys';

export interface HealthLivenessResponse {
  status: string;
  timestamp: string;
  service: string;
  environment: string;
}

export interface HealthReadinessResponse {
  status: string;
  database: string;
  timestamp: string;
  error?: string;
}

export function useHealthLiveness() {
  return useQuery<HealthLivenessResponse, ApiError>({
    queryKey: healthKeys.liveness(),
    queryFn: async () => {
      const res = await apiClient.get<HealthLivenessResponse>('/health');
      return res.data;
    },
    staleTime: 1000 * 30, // 30s
    retry: 1,
  });
}

export function useHealthReadiness() {
  return useQuery<HealthReadinessResponse, ApiError>({
    queryKey: healthKeys.readiness(),
    queryFn: async () => {
      const res = await apiClient.get<HealthReadinessResponse>('/health/ready');
      return res.data;
    },
    staleTime: 1000 * 30, // 30s
    retry: 1,
  });
}
