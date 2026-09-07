'use client';

import React from 'react';
import { PageHeader } from '../../../components/layout/page-header';
import { CreditCard, Plus, Search, Filter } from 'lucide-react';

export default function PaymentsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Payments & Collections"
        description="Track cash, card, UPI, bank transfers, supplier payouts, and customer collections."
        breadcrumbs={[
          { label: 'Transactions' },
          { label: 'Payments' },
        ]}
        actions={
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              className="h-9 px-4 bg-white border border-border rounded-full text-xs font-semibold text-content-secondary hover:text-navy-950 hover:bg-surface-subtle flex items-center gap-2 shadow-xs transition cursor-pointer"
            >
              <Filter className="w-3.5 h-3.5 text-content-muted" />
              <span>Filter</span>
            </button>
            <button
              type="button"
              className="pill-btn-coral h-9 px-4 text-white font-semibold text-xs rounded-full shadow-coral flex items-center gap-1.5 transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Record Payment</span>
            </button>
          </div>
        }
      />

      <div className="bg-white rounded-[24px] border border-border shadow-card overflow-hidden">
        <div className="p-4 border-b border-border bg-surface-subtle/50 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-content-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by transaction reference, customer, or payment mode..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-border rounded-full focus:outline-none focus:ring-2 focus:ring-coral-500/20 focus:border-coral-500 shadow-xs transition"
              disabled
            />
          </div>
        </div>

        <div className="p-16 text-center">
          <div className="w-14 h-14 rounded-2xl bg-surface-subtle border border-border flex items-center justify-center mx-auto mb-3.5 text-content-muted shadow-xs">
            <CreditCard className="w-7 h-7 text-content-muted" />
          </div>
          <h3 className="text-base font-bold text-navy-950">No payment records</h3>
          <p className="text-xs text-content-secondary mt-1 max-w-sm mx-auto leading-relaxed mb-4">
            Payment transactions from POS counters, vendor disbursements, and customer receivables will appear here.
          </p>
          <button
            type="button"
            className="pill-btn-coral h-9 px-4 text-white font-semibold text-xs rounded-full shadow-coral transition inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Record First Payment</span>
          </button>
        </div>
      </div>
    </div>
  );
}
