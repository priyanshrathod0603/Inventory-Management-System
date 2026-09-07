'use client';

import React from 'react';
import { PageHeader } from '../../../components/layout/page-header';
import { Bell, CheckCheck } from 'lucide-react';

export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications Center"
        description="View and manage system alerts, low stock warnings, and transaction notices."
        breadcrumbs={[
          { label: 'Administration' },
          { label: 'Notifications' },
        ]}
        actions={
          <button
            type="button"
            className="pill-btn-coral h-9 px-4 text-white font-semibold text-xs rounded-full shadow-coral flex items-center gap-1.5 transition cursor-pointer"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Mark All as Read</span>
          </button>
        }
      />

      <div className="bg-white rounded-[24px] border border-border shadow-card overflow-hidden">
        <div className="p-16 text-center">
          <div className="w-14 h-14 rounded-2xl bg-surface-subtle border border-border flex items-center justify-center mx-auto mb-3.5 text-content-muted shadow-xs">
            <Bell className="w-7 h-7 text-content-muted" />
          </div>
          <h3 className="text-base font-bold text-navy-950">All caught up!</h3>
          <p className="text-xs text-content-secondary mt-1 max-w-sm mx-auto leading-relaxed">
            You don&apos;t have any pending alerts or low stock warnings at this time.
          </p>
        </div>
      </div>
    </div>
  );
}
