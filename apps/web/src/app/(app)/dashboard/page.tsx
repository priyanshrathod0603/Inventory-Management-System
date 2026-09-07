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
      color: 'text-coral-600 bg-coral-50 border-coral-200',
    },
    {
      title: "TODAY'S PURCHASES",
      value: '₹0.00',
      subtitle: '0 inward POs received',
      icon: Truck,
      color: 'text-info-600 bg-info-50 border-info-200',
    },
    {
      title: 'STOCK VALUATION',
      value: '₹0.00',
      subtitle: 'Across all warehouses',
      icon: Boxes,
      color: 'text-navy-950 bg-surface-subtle border-border',
    },
    {
      title: 'LOW STOCK ALERTS',
      value: '0 Items',
      subtitle: '0 below minimum threshold',
      icon: AlertTriangle,
      color: 'text-amber-600 bg-amber-50 border-amber-200',
      badge: 'Optimal',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      title: 'RECEIVABLES',
      value: '₹0.00',
      subtitle: '0 customer khata balances',
      icon: CreditCard,
      color: 'text-content-secondary bg-surface-subtle border-border',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Operations Dashboard"
        subtitle="Real-time command center for retail counter sales, procurement, and stock valuation health."
      >
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            className="px-3.5 py-1.5 bg-white border border-border rounded-full text-xs font-semibold text-content-secondary hover:text-navy-950 hover:bg-surface-subtle flex items-center gap-2 shadow-xs transition cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5 text-content-muted" />
            <span>Today: 05 Sep 2026</span>
          </button>
          <button
            type="button"
            className="p-2 bg-white border border-border rounded-full text-content-secondary hover:text-navy-950 hover:bg-surface-subtle shadow-xs transition cursor-pointer"
            title="Refresh dashboard"
          >
            <RefreshCw className="w-3.5 h-3.5 text-content-muted" />
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

      {/* 5-Card KPI Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.title}
              className="bg-white border border-border rounded-[20px] p-5 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-extrabold text-content-muted uppercase tracking-wider">
                  {kpi.title}
                </span>
                <div className={`w-8 h-8 rounded-2xl flex items-center justify-center border ${kpi.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div>
                <div className="text-2xl font-black text-navy-950 tabular-nums font-sans tracking-tight">
                  {kpi.value}
                </div>
                <div className="flex items-center justify-between mt-1.5">
                  <p className="text-[11px] text-content-secondary font-medium">{kpi.subtitle}</p>
                  {kpi.badge && (
                    <span className={`px-2 py-0.5 text-[9px] font-extrabold rounded-full border ${kpi.badgeColor}`}>
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left (2 cols): Sales & Revenue Trends */}
        <div className="lg:col-span-2 bg-white border border-border rounded-[24px] p-6 shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-extrabold text-navy-950 font-sans tracking-tight">
                Revenue &amp; Procurement Velocity
              </h3>
              <p className="text-xs text-content-secondary mt-0.5">7-Day comparative sales volume &amp; turnover metrics</p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-surface-subtle border border-border text-[10px] font-bold text-content-secondary">
              Analytics Module
            </span>
          </div>

          <div className="h-60 bg-surface-subtle/70 border border-dashed border-border rounded-2xl flex flex-col items-center justify-center text-center p-6">
            <div className="w-12 h-12 rounded-full bg-white border border-border flex items-center justify-center mb-3 shadow-xs">
              <TrendingUp className="w-6 h-6 text-coral-500" />
            </div>
            <h4 className="text-xs font-bold text-navy-950">Sales Analytics Visualizer</h4>
            <p className="text-[11px] text-content-secondary max-w-sm mt-1 leading-relaxed">
              Live revenue curves, payment mode breakdowns, and hourly transaction velocity will render here.
            </p>
          </div>
        </div>

        {/* Right (1 col): Quick Operations Panel */}
        <div className="bg-white border border-border rounded-[24px] p-6 shadow-card flex flex-col">
          <h3 className="text-base font-extrabold text-navy-950 font-sans tracking-tight mb-1">
            Quick Actions
          </h3>
          <p className="text-xs text-content-secondary mb-4">High-velocity counter shortcuts</p>

          <div className="space-y-2.5 flex-1">
            <Link
              href="/pos"
              className="flex items-center justify-between p-3.5 rounded-2xl bg-coral-50/80 hover:bg-coral-100/70 border border-coral-200/80 text-navy-950 transition-all duration-200 hover:-translate-y-0.5 group shadow-xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-coral-500 text-white flex items-center justify-center shadow-xs">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-navy-950">Billing Counter (POS)</div>
                  <div className="text-[10px] text-coral-600 font-semibold font-mono">Shortcut: F2</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-coral-500 group-hover:translate-x-0.5 transition-transform" />
            </Link>

            <Link
              href="/products"
              className="flex items-center justify-between p-3.5 rounded-2xl bg-surface-subtle hover:bg-surface-muted border border-border text-navy-950 transition-all duration-200 hover:-translate-y-0.5 group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white border border-border text-content-secondary flex items-center justify-center shadow-xs">
                  <Package className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-navy-950">Add New Product</div>
                  <div className="text-[10px] text-content-muted">Create SKU / Barcode</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-content-muted group-hover:translate-x-0.5 transition-transform" />
            </Link>

            <Link
              href="/stock-adjustments"
              className="flex items-center justify-between p-3.5 rounded-2xl bg-surface-subtle hover:bg-surface-muted border border-border text-navy-950 transition-all duration-200 hover:-translate-y-0.5 group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white border border-border text-content-secondary flex items-center justify-center shadow-xs">
                  <Sliders className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-navy-950">Stock Adjustment</div>
                  <div className="text-[10px] text-content-muted">Audit physical inventory</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-content-muted group-hover:translate-x-0.5 transition-transform" />
            </Link>

            <Link
              href="/purchases"
              className="flex items-center justify-between p-3.5 rounded-2xl bg-surface-subtle hover:bg-surface-muted border border-border text-navy-950 transition-all duration-200 hover:-translate-y-0.5 group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white border border-border text-content-secondary flex items-center justify-center shadow-xs">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-navy-950">Record Inward PO</div>
                  <div className="text-[10px] text-content-muted">Supplier shipment receiving</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-content-muted group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Activity Container */}
      <div className="bg-white border border-border rounded-[24px] p-6 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-extrabold text-navy-950 font-sans tracking-tight">
              Recent Transactions
            </h3>
            <p className="text-xs text-content-secondary mt-0.5">Latest completed counter invoices &amp; sales</p>
          </div>
          <Link
            href="/sales"
            className="text-xs text-coral-600 hover:text-coral-700 font-bold transition flex items-center gap-1.5"
          >
            <span>View All Sales</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="py-14 text-center text-content-secondary flex flex-col items-center justify-center border border-dashed border-border rounded-2xl bg-surface-subtle/50">
          <div className="w-12 h-12 rounded-full bg-white border border-border flex items-center justify-center mb-3 shadow-xs">
            <Receipt className="w-6 h-6 text-content-muted" />
          </div>
          <h4 className="text-xs font-bold text-navy-950">No Sales Recorded Today</h4>
          <p className="text-[11px] text-content-secondary mt-1 max-w-xs leading-relaxed">
            Completed counter invoices will appear here in real-time as cashiers bill transactions.
          </p>
          <Link
            href="/pos"
            className="pill-btn-coral mt-4 h-9 px-4 text-white text-xs font-semibold rounded-full shadow-coral transition inline-flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Open POS Counter</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
