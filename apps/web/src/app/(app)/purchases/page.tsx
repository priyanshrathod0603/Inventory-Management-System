'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PageHeader } from '../../../components/layout/page-header';
import {
  Truck,
  Plus,
  Search,
  Download,
  Building2,
} from 'lucide-react';

export default function PurchasesPage() {
  const [search, setSearch] = useState('');

  return (
    <div className="space-y-6">
      <PageHeader
        title="Purchases & Vendor Orders"
        subtitle="Track incoming supplier bills, inward shipments, and inventory procurement."
        breadcrumbs={[{ label: 'Purchases' }]}
      >
        <div className="flex items-center gap-2.5">
          <Link
            href="/suppliers"
            className="h-9 px-4 bg-white border border-border rounded-full text-xs font-semibold text-content-secondary hover:text-navy-950 hover:bg-surface-subtle flex items-center gap-2 shadow-xs transition cursor-pointer"
          >
            <Building2 className="w-3.5 h-3.5 text-content-muted" />
            <span>Suppliers Directory</span>
          </Link>
          <button
            type="button"
            className="pill-btn-coral h-9 px-4 text-white font-semibold text-xs rounded-full shadow-coral flex items-center gap-1.5 transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Record Purchase Bill</span>
          </button>
        </div>
      </PageHeader>

      {/* Main Table Container */}
      <div className="bg-white border border-border rounded-[24px] shadow-card overflow-hidden">
        {/* Search Bar */}
        <div className="p-4 border-b border-border bg-surface-subtle/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-3.5 h-3.5 text-content-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by purchase #, supplier..."
              className="w-full pl-9 pr-3.5 py-1.5 bg-white border border-border rounded-full text-xs text-navy-950 placeholder:text-content-muted focus:outline-none focus:ring-2 focus:ring-coral-500/20 focus:border-coral-500 shadow-xs"
            />
          </div>

          <div className="flex items-center gap-2">
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
            <Truck className="w-7 h-7 text-content-muted" />
          </div>
          <h3 className="text-base font-bold text-navy-950 mb-1">No Purchase Records Found</h3>
          <p className="text-xs text-content-secondary max-w-sm mb-4 leading-relaxed">
            Vendor purchase bills, received goods receipts, and payment settlements will appear here.
          </p>
          <button
            type="button"
            className="pill-btn-coral h-9 px-4 text-white font-semibold text-xs rounded-full shadow-coral transition flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Record First Purchase</span>
          </button>
        </div>
      </div>
    </div>
  );
}
