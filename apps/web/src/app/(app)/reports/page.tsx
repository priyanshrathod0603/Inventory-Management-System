'use client';

import React, { useState } from 'react';
import { PageHeader } from '../../../components/layout/page-header';
import {
  BarChart3,
  Calendar,
  Download,
  TrendingUp,
  FileSpreadsheet,
  Printer,
  DollarSign,
  Boxes,
  Users,
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
    <div>
      <PageHeader
        title="Reports & Analytics"
        subtitle="Business intelligence, sales velocity summaries, and inventory financial reports."
        breadcrumbs={[{ label: 'Reports' }]}
      >
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 shadow-xs"
          >
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>This Month: Sep 2026</span>
          </button>
          <button
            type="button"
            className="px-3.5 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-lg shadow-xs flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export Excel</span>
          </button>
        </div>
      </PageHeader>

      {/* KPI Financial Overview Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Total Revenue
          </span>
          <div className="text-xl font-bold text-slate-900 tabular-nums">₹0.00</div>
          <p className="text-[11px] text-slate-400 mt-0.5">Gross collections this period</p>
        </div>
        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Total Cost of Goods (COGS)
          </span>
          <div className="text-xl font-bold text-slate-900 tabular-nums">₹0.00</div>
          <p className="text-[11px] text-slate-400 mt-0.5">Direct stock purchase cost</p>
        </div>
        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Gross Profit
          </span>
          <div className="text-xl font-bold text-emerald-600 tabular-nums">₹0.00</div>
          <p className="text-[11px] text-slate-400 mt-0.5">Calculated net margin</p>
        </div>
        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Profit Margin %
          </span>
          <div className="text-xl font-bold text-slate-900 tabular-nums">0.00%</div>
          <p className="text-[11px] text-slate-400 mt-0.5">Average across all categories</p>
        </div>
      </div>

      {/* Report Category Container */}
      <div className="bg-white border border-slate-200/90 rounded-xl shadow-xs overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-200/80 bg-slate-50/50 flex items-center gap-1 overflow-x-auto">
          {reportTabs.map((tab) => (
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

        <div className="py-16 text-center text-slate-400 flex flex-col items-center justify-center p-6">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
            <BarChart3 className="w-6 h-6 text-slate-400" />
          </div>
          <h3 className="text-sm font-bold text-slate-800 mb-1">Reports Data Aggregation Shell</h3>
          <p className="text-xs text-slate-400 max-w-sm mb-4">
            Aggregated financial calculations, GST reports, product-wise sales summaries, and export tools will render here in Phase 14.
          </p>
        </div>
      </div>
    </div>
  );
}
