'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PageHeader } from '../../../components/layout/page-header';
import {
  Boxes,
  Plus,
  Search,
  Filter,
  Download,
  AlertTriangle,
  ArrowUpDown,
  Sliders,
  Warehouse,
} from 'lucide-react';

export default function InventoryPage() {
  const [activeTab, setActiveTab] = useState<'ALL' | 'LOW' | 'OUT' | 'EXPIRING'>('ALL');
  const [search, setSearch] = useState('');

  const tabs = [
    { key: 'ALL', label: 'All Inventory Items' },
    { key: 'LOW', label: 'Low Stock Alert (0)' },
    { key: 'OUT', label: 'Out of Stock (0)' },
    { key: 'EXPIRING', label: 'Expiring Soon (0)' },
  ] as const;

  return (
    <div>
      <PageHeader
        title="Inventory & Stock Management"
        subtitle="Real-time multi-warehouse stock levels, valuations, and traceability ledgers."
        breadcrumbs={[{ label: 'Inventory' }]}
      >
        <div className="flex items-center gap-2">
          <Link
            href="/stock-adjustments"
            className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 shadow-xs"
          >
            <Sliders className="w-3.5 h-3.5 text-slate-500" />
            <span>Stock Adjustment</span>
          </Link>
          <Link
            href="/products"
            className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg shadow-xs flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Product</span>
          </Link>
        </div>
      </PageHeader>

      {/* Valuation Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Total Inventory Valuation (Cost)
          </span>
          <div className="text-xl font-bold text-slate-900 tabular-nums">₹0.00</div>
          <p className="text-[11px] text-slate-400 mt-0.5">Asset value at purchase cost</p>
        </div>
        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Total Retail Valuation (Selling)
          </span>
          <div className="text-xl font-bold text-indigo-700 tabular-nums">₹0.00</div>
          <p className="text-[11px] text-slate-400 mt-0.5">Total retail potential value</p>
        </div>
        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Total Stock Units
          </span>
          <div className="text-xl font-bold text-slate-900 tabular-nums">0 Units</div>
          <p className="text-[11px] text-slate-400 mt-0.5">Across 1 default warehouse</p>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white border border-slate-200/90 rounded-xl shadow-xs overflow-hidden">
        {/* Filter Bar & Tabs */}
        <div className="p-3.5 border-b border-slate-200/80 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                  activeTab === tab.key
                    ? 'bg-white text-indigo-600 shadow-xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search stock, SKU..."
                className="pl-8 pr-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
            </div>
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
            <Boxes className="w-6 h-6 text-slate-400" />
          </div>
          <h3 className="text-sm font-bold text-slate-800 mb-1">No Inventory Items Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mb-4">
            Stock movements, inward shipments, and product inventory records will appear in this ledger.
          </p>
          <Link
            href="/products"
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg shadow-xs transition flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create First Product</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
