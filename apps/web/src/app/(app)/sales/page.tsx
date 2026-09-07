'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PageHeader } from '../../../components/layout/page-header';
import {
  Receipt,
  Plus,
  Search,
  Download,
  Calendar,
  Filter,
} from 'lucide-react';

export default function SalesPage() {
  const [search, setSearch] = useState('');

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sales & Counter Invoices"
        subtitle="Chronological register of retail invoices, counter transactions, and customer bills."
        breadcrumbs={[{ label: 'Sales' }]}
      >
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            className="h-9 px-4 bg-white border border-border rounded-full text-xs font-semibold text-content-secondary hover:text-navy-950 hover:bg-surface-subtle flex items-center gap-2 shadow-xs transition cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5 text-content-muted" />
            <span>This Month</span>
          </button>
          <Link
            href="/pos"
            className="pill-btn-coral h-9 px-4 text-white font-semibold text-xs rounded-full shadow-coral flex items-center gap-1.5 transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Sale (F2)</span>
          </Link>
        </div>
      </PageHeader>

      {/* Main Table Container */}
      <div className="bg-white border border-border rounded-[24px] shadow-card overflow-hidden">
        {/* Search & Filter Bar */}
        <div className="p-4 border-b border-border bg-surface-subtle/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-3.5 h-3.5 text-content-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by invoice #, customer..."
              className="w-full pl-9 pr-3.5 py-1.5 bg-white border border-border rounded-full text-xs text-navy-950 placeholder:text-content-muted focus:outline-none focus:ring-2 focus:ring-coral-500/20 focus:border-coral-500 shadow-xs"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="h-8 px-3.5 bg-white border border-border rounded-full text-xs font-semibold text-content-secondary hover:text-navy-950 hover:bg-surface-subtle flex items-center gap-1.5 shadow-xs transition cursor-pointer"
            >
              <Filter className="w-3.5 h-3.5 text-content-muted" />
              <span>Filter Status</span>
            </button>
            <button
              type="button"
              className="p-2 bg-white border border-border rounded-full text-content-secondary hover:text-navy-950 hover:bg-surface-subtle shadow-xs transition cursor-pointer"
              title="Export CSV"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Empty State Table */}
        <div className="py-16 text-center text-content-secondary flex flex-col items-center justify-center p-6">
          <div className="w-14 h-14 rounded-2xl bg-surface-subtle border border-border flex items-center justify-center mb-3.5 shadow-xs">
            <Receipt className="w-7 h-7 text-content-muted" />
          </div>
          <h3 className="text-base font-bold text-navy-950 mb-1">No Invoices Found</h3>
          <p className="text-xs text-content-secondary max-w-sm mb-4 leading-relaxed">
            Completed counter sales, payments, and generated customer receipts will be recorded here.
          </p>
          <Link
            href="/pos"
            className="pill-btn-coral h-9 px-4 text-white font-semibold text-xs rounded-full shadow-coral transition flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Open POS Counter (F2)</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
