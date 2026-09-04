'use client';

import React from 'react';
import Link from 'next/link';
import { PageHeader } from '../../../components/layout/page-header';
import {
  TrendingUp,
  ShoppingBag,
  Boxes,
  AlertTriangle,
  CreditCard,
  Plus,
  ArrowRight,
  RefreshCw,
  Calendar,
  Package,
  Sliders,
  Truck,
  Receipt,
} from 'lucide-react';

export default function DashboardPage() {
  const kpis = [
    {
      title: "TODAY'S SALES",
      value: '₹0.00',
      subtitle: '0 counter bills today',
      icon: ShoppingBag,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-100',
    },
    {
      title: "TODAY'S PURCHASES",
      value: '₹0.00',
      subtitle: '0 inward POs received',
      icon: Truck,
      color: 'text-blue-600 bg-blue-50 border-blue-100',
    },
    {
      title: 'TOTAL STOCK VALUATION',
      value: '₹0.00',
      subtitle: 'Across all warehouses',
      icon: Boxes,
      color: 'text-purple-600 bg-purple-50 border-purple-100',
    },
    {
      title: 'LOW STOCK ALERTS',
      value: '0 Items',
      subtitle: '0 below minimum threshold',
      icon: AlertTriangle,
      color: 'text-amber-600 bg-amber-50 border-amber-100',
      badge: 'Optimal',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      title: 'OUTSTANDING RECEIVABLES',
      value: '₹0.00',
      subtitle: '0 customer khata balances',
      icon: CreditCard,
      color: 'text-slate-600 bg-slate-50 border-slate-200',
    },
  ];

  return (
    <div>
      {/* Page Header */}
      <PageHeader
        title="Operations Dashboard"
        subtitle="Real-time command center for retail sales, procurement, and stock health."
      >
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 shadow-xs"
          >
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Today: 05 Sep 2026</span>
          </button>
          <button
            type="button"
            className="p-1.5 bg-white border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 shadow-xs"
            title="Refresh dashboard"
          >
            <RefreshCw className="w-4 h-4 text-slate-500" />
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

      {/* 5-Card KPI Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.title}
              className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  {kpi.title}
                </span>
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center border ${kpi.color}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
              </div>
              <div>
                <div className="text-xl font-bold text-slate-900 tabular-nums font-sans">
                  {kpi.value}
                </div>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-[11px] text-slate-500">{kpi.subtitle}</p>
                  {kpi.badge && (
                    <span className={`px-1.5 py-0.5 text-[9px] font-bold rounded-full border ${kpi.badgeColor}`}>
                      {kpi.badge}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Grid: Revenue Trends & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Left (2 cols): Sales & Revenue Trends */}
        <div className="lg:col-span-2 bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Revenue & Procurement Velocity</h3>
              <p className="text-xs text-slate-400">7-Day comparative sales volume</p>
            </div>
            <span className="text-xs font-medium text-slate-400">Analytics Foundation</span>
          </div>

          <div className="h-56 bg-slate-50 border border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-center p-6">
            <TrendingUp className="w-8 h-8 text-slate-300 mb-2" />
            <h4 className="text-xs font-semibold text-slate-700">Sales Analytics Shell</h4>
            <p className="text-[11px] text-slate-400 max-w-sm mt-0.5">
              Live revenue curves, payment mode breakdowns, and hourly transaction trends will render here in Phase 14.
            </p>
          </div>
        </div>

        {/* Right (1 col): Quick Operations Panel */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs flex flex-col">
          <h3 className="text-sm font-bold text-slate-900 mb-1">Quick Actions</h3>
          <p className="text-xs text-slate-400 mb-4">High-velocity counter shortcuts</p>

          <div className="space-y-2 flex-1">
            <Link
              href="/pos"
              className="flex items-center justify-between p-3 rounded-xl bg-indigo-50/70 hover:bg-indigo-50 border border-indigo-100 text-indigo-900 transition group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold">Billing Counter (POS)</div>
                  <div className="text-[10px] text-indigo-600/80">Shortcut: F2</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-indigo-500 group-hover:translate-x-0.5 transition-transform" />
            </Link>

            <Link
              href="/products"
              className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 transition group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center">
                  <Package className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold">Add New Product</div>
                  <div className="text-[10px] text-slate-500">Create SKU / Barcode</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </Link>

            <Link
              href="/stock-adjustments"
              className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 transition group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center">
                  <Sliders className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold">Stock Adjustment</div>
                  <div className="text-[10px] text-slate-500">Audit physical count</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </Link>

            <Link
              href="/purchases"
              className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 transition group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold">Record Inward PO</div>
                  <div className="text-[10px] text-slate-500">Supplier shipment</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Activity Table Container */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Recent Transactions</h3>
            <p className="text-xs text-slate-400">Latest completed counter invoices & sales</p>
          </div>
          <Link
            href="/sales"
            className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold transition flex items-center gap-1"
          >
            <span>View All Sales</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="py-12 text-center text-slate-400 flex flex-col items-center justify-center border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mb-2">
            <Receipt className="w-5 h-5 text-slate-400" />
          </div>
          <h4 className="text-xs font-semibold text-slate-700">No Sales Recorded Today</h4>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Completed counter invoices will appear here as cashiers bill transactions.
          </p>
          <Link
            href="/pos"
            className="mt-3 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition inline-flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Open POS Counter</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
