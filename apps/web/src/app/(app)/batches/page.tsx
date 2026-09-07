'use client';

import React from 'react';
import { PageHeader } from '../../../components/layout/page-header';
import { Clock, Search } from 'lucide-react';

export default function BatchesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Batch & Expiry Tracking"
        description="Monitor product batch numbers, manufacturing dates, expiry dates, and lot quantities."
        breadcrumbs={[
          { label: 'Inventory' },
          { label: 'Batches' },
        ]}
      />

      <div className="bg-white rounded-[24px] border border-border shadow-card overflow-hidden">
        <div className="p-4 border-b border-border bg-surface-subtle/50 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-content-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by batch number or SKU..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-border rounded-full focus:outline-none focus:ring-2 focus:ring-coral-500/20 focus:border-coral-500 shadow-xs transition"
              disabled
            />
          </div>
        </div>

        <div className="p-16 text-center">
          <div className="w-14 h-14 rounded-2xl bg-surface-subtle border border-border flex items-center justify-center mx-auto mb-3.5 text-content-muted shadow-xs">
            <Clock className="w-7 h-7 text-content-muted" />
          </div>
          <h3 className="text-base font-bold text-navy-950">No batch records found</h3>
          <p className="text-xs text-content-secondary mt-1 max-w-sm mx-auto leading-relaxed">
            Batch tracking entries are automatically created when batch-tracked items are received via inward purchases.
          </p>
        </div>
      </div>
    </div>
  );
}
