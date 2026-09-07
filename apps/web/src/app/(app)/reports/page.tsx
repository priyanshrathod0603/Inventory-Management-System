'use client';

import React, { useState } from 'react';
import { PageHeader } from '../../../components/layout/page-header';
import {
  BarChart3,
  Calendar,
  Download,
} from 'lucide-react';

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<'SALES' | 'PURCHASE' | 'INVENTORY' | 'PROFIT' | 'PAYMENT'>('SALES');

  const reportTabs = [
    { key: 'SALES', label: 'Sales Reports' },
    { key: 'PURCHASE', label: 'Purchase Reports' },
    { key: 'INVENTORY', label: 'Inventory Valuation' },
    { key: 'PROFIT', label: 'Profit & Loss' },
    { key: 'PAYMENT', label: 'Payment Collections' },
  ] as const;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports & Analytics"
        subtitle="Business intelligence, sales velocity summaries, and inventory financial reports."
        breadcrumbs={[{ label: 'Reports' }]}
      >
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            className="h-9 px-4 bg-white border border-border rounded-full text-xs font-semibold text-content-secondary hover:text-navy-950 hover:bg-surface-subtle flex items-center gap-2 shadow-xs transition cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5 text-content-muted" />
            <span>This Month: Sep 2026</span>
          </button>
          <button
            type="button"
            className="pill-btn-coral h-9 px-4 text-white font-semibold text-xs rounded-full shadow-coral flex items-center gap-1.5 transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Excel</span>
          </button>
        </div>
      </PageHeader>

      {/* KPI Financial Overview Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-border rounded-[20px] p-5 shadow-card">
          <span className="text-[10px] font-extrabold text-content-muted uppercase tracking-wider block mb-1">
            Total Revenue
          </span>
          <div className="text-2xl font-black text-navy-950 tabular-nums font-sans">₹0.00</div>
          <p className="text-xs text-content-secondary mt-1">Gross collections this period</p>
        </div>
        <div className="bg-white border border-border rounded-[20px] p-5 shadow-card">
          <span className="text-[10px] font-extrabold text-content-muted uppercase tracking-wider block mb-1">
            Cost of Goods (COGS)
          </span>
          <div className="text-2xl font-black text-navy-950 tabular-nums font-sans">₹0.00</div>
          <p className="text-xs text-content-secondary mt-1">Direct stock purchase cost</p>
        </div>
        <div className="bg-white border border-border rounded-[20px] p-5 shadow-card">
          <span className="text-[10px] font-extrabold text-content-muted uppercase tracking-wider block mb-1">
            Gross Profit
          </span>
          <div className="text-2xl font-black text-emerald-600 tabular-nums font-sans">₹0.00</div>
          <p className="text-xs text-content-secondary mt-1">Calculated net margin</p>
        </div>
        <div className="bg-white border border-border rounded-[20px] p-5 shadow-card">
          <span className="text-[10px] font-extrabold text-content-muted uppercase tracking-wider block mb-1">
            Profit Margin %
          </span>
          <div className="text-2xl font-black text-coral-600 tabular-nums font-sans">0.00%</div>
          <p className="text-xs text-content-secondary mt-1">Average across all categories</p>
        </div>
      </div>

      {/* Report Category Container */}
      <div className="bg-white border border-border rounded-[24px] shadow-card overflow-hidden">
        <div className="px-5 py-3 border-b border-border bg-surface-subtle/50 flex items-center gap-1.5 overflow-x-auto">
          {reportTabs.map((tab) => (
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

        <div className="py-16 text-center text-content-secondary flex flex-col items-center justify-center p-6">
          <div className="w-14 h-14 rounded-2xl bg-surface-subtle border border-border flex items-center justify-center mb-3.5 shadow-xs">
            <BarChart3 className="w-7 h-7 text-content-muted" />
          </div>
          <h3 className="text-base font-bold text-navy-950 mb-1">Reports Data Aggregation Module</h3>
          <p className="text-xs text-content-secondary max-w-sm leading-relaxed mb-4">
            Aggregated financial calculations, GST reports, product-wise sales summaries, and export tools will render here.
          </p>
        </div>
      </div>
    </div>
  );
}
