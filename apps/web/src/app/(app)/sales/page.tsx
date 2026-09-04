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
    <div>
      <PageHeader
        title="Sales & Counter Invoices"
        subtitle="Chronological register of retail invoices, counter transactions, and customer bills."
        breadcrumbs={[{ label: 'Sales' }]}
      >
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 shadow-xs"
          >
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>This Month</span>
          </button>
          <Link
            href="/pos"
            className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg shadow-xs flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Sale (F2)</span>
          </Link>
        </div>
      </PageHeader>

      {/* Main Table Container */}
      <div className="bg-white border border-slate-200/90 rounded-xl shadow-xs overflow-hidden">
        {/* Search & Filter Bar */}
        <div className="p-3.5 border-b border-slate-200/80 bg-slate-50/50 flex items-center justify-between gap-3">
          <div className="relative w-72">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by invoice #, customer name..."
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-1.5"
            >
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span>Filter Status</span>
            </button>
            <button
              type="button"
              className="p-1.5 bg-white border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50"
              title="Export CSV"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Empty State Table */}
        <div className="py-16 text-center text-slate-400 flex flex-col items-center justify-center p-6">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
            <Receipt className="w-6 h-6 text-slate-400" />
          </div>
          <h3 className="text-sm font-bold text-slate-800 mb-1">No Invoices Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mb-4">
            Completed counter sales, payments, and generated customer receipts will be recorded here.
          </p>
          <Link
            href="/pos"
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg shadow-xs transition flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Open POS Counter (F2)</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
