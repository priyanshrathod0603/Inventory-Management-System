'use client';

import React, { useState } from 'react';
import { PageHeader } from '../../../components/layout/page-header';
import { useCurrentUser } from '../../../hooks/use-current-user';
import { useHealthLiveness, useHealthReadiness } from '../../../hooks/use-health';
import {
  User,
  Shield,
  Activity,
  Building,
  Receipt,
  Mail,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Clock,
  Key,
} from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'company' | 'health'>('profile');
  const { data: user, isLoading: isUserLoading, isError: isUserError, error: userError, refetch: refetchUser } = useCurrentUser();
  const { data: liveness, isLoading: isLivenessLoading, refetch: refetchLiveness } = useHealthLiveness();
  const { data: readiness, isLoading: isReadinessLoading, refetch: refetchReadiness } = useHealthReadiness();

  // Universal Admin Access Model: fixed coral Admin badge for all users
  const adminBadgeColor = 'bg-coral-50 text-coral-700 border-coral-200';

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings &amp; Account Profile"
        description="View authenticated user permissions, system health status, and store configuration."
        breadcrumbs={[
          { label: 'Administration' },
          { label: 'Settings' },
        ]}
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Navigation Tabs Column */}
        <div className="md:col-span-1 space-y-1.5">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-full text-xs font-bold transition cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-coral-50 text-coral-700 border border-coral-200/80 shadow-xs'
                : 'text-[#5F636B] hover:bg-[#F8F5F2] hover:text-[#111722]'
            }`}
          >
            <User className="w-4 h-4 text-coral-600" />
            <span>Profile &amp; Permissions</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('company')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-full text-xs font-semibold transition cursor-pointer ${
              activeTab === 'company'
                ? 'bg-coral-50 text-coral-700 border border-coral-200/80 shadow-xs'
                : 'text-[#5F636B] hover:bg-[#F8F5F2] hover:text-[#111722]'
            }`}
          >
            <Building className="w-4 h-4 text-[#8C9097]" />
            <span>Store Master Data</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('health')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-full text-xs font-semibold transition cursor-pointer ${
              activeTab === 'health'
                ? 'bg-coral-50 text-coral-700 border border-coral-200/80 shadow-xs'
                : 'text-[#5F636B] hover:bg-[#F8F5F2] hover:text-[#111722]'
            }`}
          >
            <Activity className="w-4 h-4 text-[#8C9097]" />
            <span>System Diagnostics</span>
          </button>
        </div>

        {/* Content Pane */}
        <div className="md:col-span-3">
          {/* TAB 1: Profile & Permissions */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-[24px] border border-border shadow-card p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-[#111722] font-sans tracking-tight">
                    User Account &amp; System Access
                  </h3>
                  <p className="text-xs text-[#5F636B] mt-1">
                    Authenticated session details and assigned operational privileges.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => refetchUser()}
                  className="p-2 bg-[#FAF7F4] hover:bg-[#F2ECE6] border border-[#EAE5E0] rounded-full text-[#5F636B] transition shadow-xs cursor-pointer"
                  title="Refresh profile"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>

              {isUserLoading && (
                <div className="space-y-4 animate-pulse">
                  <div className="h-16 bg-[#FAF7F4] rounded-2xl" />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-12 bg-[#FAF7F4] rounded-xl" />
                    <div className="h-12 bg-[#FAF7F4] rounded-xl" />
                  </div>
                  <div className="h-28 bg-[#FAF7F4] rounded-2xl" />
                </div>
              )}

              {isUserError && (
                <div className="p-4 bg-danger-50 border border-danger-200 rounded-2xl flex items-start justify-between gap-3 text-danger-700 text-xs">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-danger-600 shrink-0" />
                    <span>Failed to load profile: {userError?.message || 'Unauthorized or server error'}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => refetchUser()}
                    className="underline font-bold hover:text-danger-800"
                  >
                    Retry
                  </button>
                </div>
              )}

              {user && (
                <div className="space-y-6">
                  {/* User Profile Header Card */}
                  <div className="p-5 bg-[#FAF7F4] border border-[#EAE5E0] rounded-2xl flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-coral-100 text-coral-700 font-extrabold text-base flex items-center justify-center border border-coral-200 shadow-2xs">
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
                        <h4 className="text-sm font-bold text-[#111722] font-sans leading-snug">
                          {user.fullName}
                        </h4>
                        <p className="text-xs text-[#5F636B] font-mono leading-none mt-1">
                          @{user.username}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 text-xs font-bold rounded-full border uppercase tracking-wider ${adminBadgeColor}`}>
                        Admin
                      </span>
                      {user.isEmailVerified ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Verified</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200 rounded-full">
                          <Clock className="w-3 h-3 text-amber-600" />
                          <span>Pending Verification</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Field Summary */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-white border border-[#EAE5E0] rounded-2xl space-y-1">
                      <span className="text-[10px] font-extrabold text-[#8C9097] uppercase tracking-wider">
                        Email Address
                      </span>
                      <p className="text-xs font-semibold text-[#111722] font-mono truncate">
                        {user.email}
                      </p>
                    </div>
                    <div className="p-4 bg-white border border-[#EAE5E0] rounded-2xl space-y-1">
                      <span className="text-[10px] font-extrabold text-[#8C9097] uppercase tracking-wider">
                        System User ID
                      </span>
                      <p className="text-xs font-semibold text-[#111722] font-mono truncate">
                        {user.id}
                      </p>
                    </div>
                  </div>

                  {/* System Permissions — Universal Access Catalog */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-extrabold text-[#111722] uppercase tracking-wider flex items-center gap-1.5">
                        <Key className="w-3.5 h-3.5 text-coral-500" />
                        <span>All System Permissions ({user.permissions?.length || 0})</span>
                      </h4>
                      <span className="text-[11px] text-[#8C9097]">Enforced by NestJS backend</span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 p-4 bg-[#FAF7F4] border border-[#EAE5E0] rounded-2xl">
                      {user.permissions && user.permissions.length > 0 ? (
                        user.permissions.map((perm) => (
                          <span
                            key={perm}
                            className="px-2.5 py-1 bg-white border border-[#EAE5E0] text-[#111722] text-[11px] font-mono font-medium rounded-full shadow-2xs"
                          >
                            {perm}
                          </span>
                        ))
                      ) : (
                        <p className="text-xs text-[#8C9097] py-2">Loading permissions catalog…</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Store Master Data */}
          {activeTab === 'company' && (
            <div className="bg-white rounded-[24px] border border-border shadow-card p-6 sm:p-8 space-y-6">
              <div>
                <h3 className="text-base font-extrabold text-[#111722] font-sans tracking-tight">
                  Store &amp; Organization Master Data
                </h3>
                <p className="text-xs text-[#5F636B] mt-1">
                  Enterprise GST and organization details for invoices and receipts.
                </p>
              </div>

              <div className="p-8 text-center bg-[#FAF7F4] border border-dashed border-[#EAE5E0] rounded-2xl space-y-2">
                <Building className="w-8 h-8 text-[#8C9097] mx-auto" />
                <h4 className="text-xs font-bold text-[#111722]">Store Settings Configuration</h4>
                <p className="text-[11px] text-[#5F636B] max-w-sm mx-auto">
                  GSTIN configuration and invoice numbering sequence management will activate in Phase 15.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: System Diagnostics */}
          {activeTab === 'health' && (
            <div className="bg-white rounded-[24px] border border-border shadow-card p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-[#111722] font-sans tracking-tight">
                    System Health &amp; Connectivity
                  </h3>
                  <p className="text-xs text-[#5F636B] mt-1">
                    Live telemetry for NestJS backend API and PostgreSQL database.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    refetchLiveness();
                    refetchReadiness();
                  }}
                  className="p-2 bg-[#FAF7F4] hover:bg-[#F2ECE6] border border-[#EAE5E0] rounded-full text-[#5F636B] transition shadow-xs cursor-pointer"
                  title="Refresh telemetry"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Liveness Check */}
                <div className="p-5 bg-[#FAF7F4] border border-[#EAE5E0] rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold text-[#8C9097] uppercase tracking-wider">
                      Backend API Liveness
                    </span>
                    <span className="px-2 py-0.5 text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full">
                      {liveness?.status === 'ok' ? 'HEALTHY' : 'CONNECTING...'}
                    </span>
                  </div>
                  <div className="space-y-1 text-xs">
                    <p className="text-[#5F636B]">Service: <span className="font-semibold text-[#111722] font-mono">{liveness?.service || 'ims-api'}</span></p>
                    <p className="text-[#5F636B]">Environment: <span className="font-semibold text-[#111722] font-mono">{liveness?.environment || 'development'}</span></p>
                    <p className="text-[#5F636B]">Timestamp: <span className="font-mono text-[10px] text-[#8C9097]">{liveness?.timestamp || '—'}</span></p>
                  </div>
                </div>

                {/* Readiness Check */}
                <div className="p-5 bg-[#FAF7F4] border border-[#EAE5E0] rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold text-[#8C9097] uppercase tracking-wider">
                      Database Connection
                    </span>
                    <span className={`px-2 py-0.5 text-[10px] font-extrabold rounded-full border ${
                      readiness?.database === 'connected'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      {readiness?.database ? readiness.database.toUpperCase() : 'CHECKING...'}
                    </span>
                  </div>
                  <div className="space-y-1 text-xs">
                    <p className="text-[#5F636B]">Database: <span className="font-semibold text-[#111722]">PostgreSQL (Prisma)</span></p>
                    <p className="text-[#5F636B]">Status: <span className="font-semibold text-[#111722]">{readiness?.status || 'ok'}</span></p>
                    <p className="text-[#5F636B]">Timestamp: <span className="font-mono text-[10px] text-[#8C9097]">{readiness?.timestamp || '—'}</span></p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

