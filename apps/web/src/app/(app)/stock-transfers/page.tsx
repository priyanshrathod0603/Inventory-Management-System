'use client';

import React from 'react';
import { PageHeader } from '../../../components/layout/page-header';
import { ArrowLeftRight, Plus, Search } from 'lucide-react';

export default function StockTransfersPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Stock Transfers"
        description="Transfer inventory items between warehouses, retail counters, and storage locations."
        breadcrumbs={[
          { label: 'Inventory' },
          { label: 'Transfers' },
        ]}
        actions={
          <button
            type="button"
            className="pill-btn-coral h-9 px-4 text-white font-semibold text-xs rounded-full shadow-coral flex items-center gap-1.5 transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Transfer</span>
          </button>
        }
      />

      <div className="bg-white rounded-[24px] border border-border shadow-card overflow-hidden">
        <div className="p-4 border-b border-border bg-surface-subtle/50 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-content-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search transfers by transfer ID or location..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-border rounded-full focus:outline-none focus:ring-2 focus:ring-coral-500/20 focus:border-coral-500 shadow-xs transition"
              disabled
            />
          </div>
        </div>

        <div className="p-16 text-center">
          <div className="w-14 h-14 rounded-2xl bg-surface-subtle border border-border flex items-center justify-center mx-auto mb-3.5 text-content-muted shadow-xs">
            <ArrowLeftRight className="w-7 h-7 text-content-muted" />
          </div>
          <h3 className="text-base font-bold text-navy-950">No stock transfers</h3>
          <p className="text-xs text-content-secondary mt-1 max-w-sm mx-auto leading-relaxed mb-4">
            Create internal warehouse transfer orders to move stock between storage locations.
          </p>
          <button
            type="button"
            className="pill-btn-coral h-9 px-4 text-white font-semibold text-xs rounded-full shadow-coral transition inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Transfer Order</span>
          </button>
        </div>
      </div>
    </div>
  );
}
