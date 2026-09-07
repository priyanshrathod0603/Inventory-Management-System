'use client';

import React from 'react';
import { PageHeader } from '../../../components/layout/page-header';
import { useCurrentUser } from '../../../hooks/use-current-user';
import { hasPermission } from '../../../lib/auth/permissions';
import { UserCheck, Plus, Search, Shield, AlertCircle, RefreshCw } from 'lucide-react';

export default function UsersPage() {
  const { data: user, isLoading, isError, error, refetch } = useCurrentUser();
  const canManageUsers = hasPermission(user, 'manage_users');

  return (
    <div className="space-y-6">
      <PageHeader
        title="User &amp; Account Management"
        description="Manage system user accounts and inspect active operational sessions."
        breadcrumbs={[
          { label: 'Administration' },
          { label: 'Users' },
        ]}
        actions={
          canManageUsers ? (
            <button
              type="button"
              className="pill-btn-coral h-9 px-4 text-white font-semibold text-xs rounded-full shadow-coral flex items-center gap-1.5 transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Invite Staff</span>
            </button>
          ) : undefined
        }
      />

      {isError && (
        <div className="p-4 bg-danger-50 border border-danger-200 rounded-2xl flex items-center justify-between gap-3 text-danger-700 text-xs">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-danger-600 shrink-0" />
            <span>Failed to load user directory: {error?.message || 'Server error'}</span>
          </div>
          <button
            type="button"
            onClick={() => refetch()}
            className="underline font-bold hover:text-danger-800 cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      <div className="bg-white rounded-[24px] border border-border shadow-card overflow-hidden">
        <div className="p-4 border-b border-border bg-surface-subtle/50 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-content-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Filter users by name, username, or email..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-border rounded-full focus:outline-none focus:ring-2 focus:ring-coral-500/20 focus:border-coral-500 shadow-xs transition"
              disabled={isLoading || !canManageUsers}
            />
          </div>
          <button
            type="button"
            onClick={() => refetch()}
            className="p-2 bg-white border border-[#EAE5E0] rounded-full text-[#5F636B] hover:text-[#111722] transition shadow-xs cursor-pointer"
            title="Refresh directory"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {isLoading ? (
          <div className="p-12 space-y-4 animate-pulse">
            <div className="h-12 bg-[#FAF7F4] rounded-xl" />
            <div className="h-12 bg-[#FAF7F4] rounded-xl" />
          </div>
        ) : !canManageUsers ? (
          <div className="p-16 text-center">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto mb-3.5 text-amber-600 shadow-xs">
              <Shield className="w-7 h-7 text-amber-600" />
            </div>
            <h3 className="text-base font-bold text-[#111722]">Restricted Administration Area</h3>
            <p className="text-xs text-[#5F636B] mt-1 max-w-sm mx-auto leading-relaxed">
              Viewing other users and staff directories requires the <code className="font-mono text-coral-600 font-bold">manage_users</code> permission. Contact your system administrator for elevated privileges.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#EAE5E0]">
            {/* Authenticated user's active account row */}
            {user && (
              <div className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-[#FAF7F4]/50 transition">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-coral-100 text-coral-700 font-extrabold text-sm flex items-center justify-center border border-coral-200 shrink-0 shadow-2xs">
                    {user.fullName
                      ? user.fullName
                          .trim()
                          .split(/\s+/)
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join('')
                          .toUpperCase()
                      : 'U'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-[#111722]">{user.fullName}</h4>
                      <span className="px-2 py-0.5 text-[9px] font-extrabold bg-coral-50 text-coral-700 border border-coral-200 rounded-full uppercase">
                        Current User
                      </span>
                    </div>
                    <p className="text-[11px] text-[#5F636B] font-mono mt-0.5">
                      @{user.username} • {user.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 text-xs font-bold bg-coral-50 text-coral-700 border border-coral-200 rounded-full uppercase">
                    Admin
                  </span>
                </div>
              </div>
            )}

            <div className="p-10 text-center bg-[#FAF7F4]/30">
              <p className="text-xs text-[#8C9097] max-w-sm mx-auto">
                Additional staff member management and invitation dispatches will be fully accessible in subsequent phases.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

