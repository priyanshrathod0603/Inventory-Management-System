'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PageHeader } from '../../../components/layout/page-header';
import {
  Boxes,
  Plus,
  Search,
  Download,
  Sliders,
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
    <div className="space-y-6">
      <PageHeader
        title="Inventory Management"
        subtitle="Real-time multi-warehouse stock levels, valuations, and traceability ledgers."
        breadcrumbs={[{ label: 'Inventory' }]}
      >
        <div className="flex items-center gap-2.5">
          <Link
            href="/stock-adjustments"
            className="h-9 px-4 bg-white border border-border rounded-full text-xs font-semibold text-content-secondary hover:text-navy-950 hover:bg-surface-subtle flex items-center gap-2 shadow-xs transition cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5 text-content-muted" />
            <span>Stock Adjustment</span>
          </Link>
          <Link
            href="/products"
            className="pill-btn-coral h-9 px-4 text-white font-semibold text-xs rounded-full shadow-coral flex items-center gap-1.5 transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Product</span>
          </Link>
        </div>
      </PageHeader>

      {/* Valuation Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-border rounded-[20px] p-5 shadow-card">
          <span className="text-[10px] font-extrabold text-content-muted uppercase tracking-wider block mb-1">
            Total Inventory Valuation (Cost)
          </span>
          <div className="text-2xl font-black text-navy-950 tabular-nums font-sans">₹0.00</div>
          <p className="text-xs text-content-secondary mt-1">Asset value at purchase cost</p>
        </div>
        <div className="bg-white border border-border rounded-[20px] p-5 shadow-card">
          <span className="text-[10px] font-extrabold text-content-muted uppercase tracking-wider block mb-1">
            Total Retail Valuation (Selling)
          </span>
          <div className="text-2xl font-black text-coral-600 tabular-nums font-sans">₹0.00</div>
          <p className="text-xs text-content-secondary mt-1">Total retail potential value</p>
        </div>
        <div className="bg-white border border-border rounded-[20px] p-5 shadow-card">
          <span className="text-[10px] font-extrabold text-content-muted uppercase tracking-wider block mb-1">
            Total Stock Units
          </span>
          <div className="text-2xl font-black text-navy-950 tabular-nums font-sans">0 Units</div>
          <p className="text-xs text-content-secondary mt-1">Across 1 default warehouse</p>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white border border-border rounded-[24px] shadow-card overflow-hidden">
        {/* Filter Bar & Tabs */}
        <div className="p-4 border-b border-border bg-surface-subtle/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  activeTab === tab.key
                    ? 'bg-coral-500 text-white shadow-xs'
                    : 'bg-white border border-border text-content-secondary hover:text-navy-950 hover:bg-surface-subtle'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-content-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search stock, SKU..."
                className="pl-8 pr-3.5 py-1.5 bg-white border border-border rounded-full text-xs text-navy-950 placeholder:text-content-muted focus:outline-none focus:ring-2 focus:ring-coral-500/20 focus:border-coral-500 shadow-xs"
              />
            </div>
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
            <Boxes className="w-7 h-7 text-content-muted" />
          </div>
          <h3 className="text-sm font-bold text-navy-950 mb-1">No Inventory Items Found</h3>
          <p className="text-xs text-content-secondary max-w-sm mb-4 leading-relaxed">
            Stock movements, inward shipments, and product inventory records will appear in this ledger.
          </p>
          <Link
            href="/products"
            className="pill-btn-coral h-9 px-4 text-white font-semibold text-xs rounded-full shadow-coral transition flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create First Product</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
