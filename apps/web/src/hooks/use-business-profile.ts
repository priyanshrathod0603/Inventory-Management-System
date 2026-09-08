'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../lib/api-client';
import { businessProfileKeys, authKeys, warehouseKeys } from '../lib/query-keys';

export type BusinessType =
  | 'GENERAL_STORE'
  | 'GROCERY'
  | 'FOOTWEAR'
  | 'CLOTHING'
  | 'ELECTRONICS'
  | 'FURNITURE'
  | 'HARDWARE'
  | 'PHARMACY'
  | 'RETAIL'
  | 'OTHER';

export interface BusinessProfile {
  id: string;
  userId: string;
  businessName: string;
  businessType: BusinessType;
  customBusinessType: string | null;
  ownerName: string | null;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  website: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string;
  postalCode: string | null;
  logoUrl: string | null;
  isGstRegistered: boolean;
  gstin: string | null;
  taxNumber: string | null;
  currency: string;
  currencySymbol: string;
  isMultiWarehouse: boolean;
  isOnboardingCompleted: boolean;
  onboardingStep: number;
  createdAt: string;
  updatedAt: string;
}

export interface BusinessProfileResponse {
  isOnboardingCompleted: boolean;
  onboardingStep: number;
  profile: BusinessProfile | null;
}

export interface CreateOnboardingPayload {
  businessName: string;
  businessType: BusinessType;
  customBusinessType?: string;
  ownerName?: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  website?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  isGstRegistered?: boolean;
  gstin?: string;
  currency?: string;
  currencySymbol?: string;
  isMultiWarehouse?: boolean;
}

export interface SaveDraftPayload {
  businessName?: string;
  businessType?: BusinessType;
  customBusinessType?: string;
  ownerName?: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  website?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  isGstRegistered?: boolean;
  gstin?: string;
  currency?: string;
  currencySymbol?: string;
  isMultiWarehouse?: boolean;
  onboardingStep?: number;
}

export function useBusinessProfile() {
  return useQuery({
    queryKey: businessProfileKeys.profile(),
    queryFn: async () => {
      const response = await apiClient.get<BusinessProfileResponse>('/business-profile');
      return response.data;
    },
  });
}

export function useCompleteOnboarding() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateOnboardingPayload) => {
      const response = await apiClient.post<{ message: string; isOnboardingCompleted: boolean; profile: BusinessProfile }>(
        '/business-profile/onboarding',
        payload,
      );
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(businessProfileKeys.profile(), {
        isOnboardingCompleted: true,
        onboardingStep: 4,
        profile: data.profile,
      });
      queryClient.invalidateQueries({ queryKey: authKeys.all });
      queryClient.invalidateQueries({ queryKey: warehouseKeys.all });
    },
  });
}

export function useSaveOnboardingDraft() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: SaveDraftPayload) => {
      const response = await apiClient.post<{ message: string; isOnboardingCompleted: boolean; onboardingStep: number; profile: BusinessProfile }>(
        '/business-profile/draft',
        payload,
      );
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(businessProfileKeys.profile(), {
        isOnboardingCompleted: data.isOnboardingCompleted,
        onboardingStep: data.onboardingStep,
        profile: data.profile,
      });
    },
  });
}

export function useUpdateBusinessProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: Partial<BusinessProfile>) => {
      const response = await apiClient.patch<{ message: string; profile: BusinessProfile }>(
        '/business-profile',
        payload,
      );
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(businessProfileKeys.profile(), (old: any) => ({
        ...old,
        profile: data.profile,
      }));
      queryClient.invalidateQueries({ queryKey: authKeys.all });
    },
  });
}
