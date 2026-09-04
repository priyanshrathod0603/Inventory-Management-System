'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { apiClient, ApiError } from '../api-client';
import { useRouter } from 'next/navigation';

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: string;
  permissions: string[];
  isEmailVerified: boolean;
  avatarUrl: string | null;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (identifier: string, password: string, rememberMe?: boolean) => Promise<void>;
  googleLogin: (idToken: string) => Promise<void>;
  register: (data: { fullName: string; email: string; username: string; password: string; phone?: string }) => Promise<{ userId: string; email: string }>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  const refreshProfile = async () => {
    try {
      const response = await apiClient<AuthUser>('/auth/me');
      setUser(response.data);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshProfile();
  }, []);

  const login = async (identifier: string, password: string, rememberMe: boolean = false) => {
    const res = await apiClient<{ user: AuthUser }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ identifier, password, rememberMe }),
    });
    setUser(res.data.user);
    router.push('/');
  };

  const googleLogin = async (idToken: string) => {
    const res = await apiClient<{ user: AuthUser }>('/auth/google', {
      method: 'POST',
      body: JSON.stringify({ idToken }),
    });
    setUser(res.data.user);
    router.push('/');
  };

  const register = async (data: {
    fullName: string;
    email: string;
    username: string;
    password: string;
    phone?: string;
  }) => {
    const res = await apiClient<{ userId: string; email: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return res.data;
  };

  const logout = async () => {
    try {
      await apiClient('/auth/logout', { method: 'POST' });
    } finally {
      setUser(null);
      router.push('/login');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        googleLogin,
        register,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
