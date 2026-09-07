'use client';

import React, { useState } from 'react';
import { PageHeader } from '../../../components/layout/page-header';
import { Sliders, Plus, Search, AlertCircle, TrendingUp, TrendingDown, User, FileText } from 'lucide-react';
import { useStockAdjustments, StockAdjustment } from '../../../hooks/use-inventory';
import { StockAdjustmentModal } from '../../../components/inventory/stock-adjustment-modal';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';

export default function StockAdjustmentsPage() {
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: response, isLoading, isError, error, refetch } = useStockAdjustments({
    search: search.trim() || undefined,
    limit: 100,
  });

  const adjustments = response?.data || [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Stock Adjustments"
        subtitle="Reconcile inventory variances, damage write-offs, physical count audits, and shrinkage entries."
        breadcrumbs={[{ label: 'Inventory' }, { label: 'Adjustments' }]}
      >
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="pill-btn-coral h-9 px-4 text-white font-semibold text-xs rounded-full shadow-coral flex items-center gap-1.5 transition cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Adjustment</span>
        </button>
      </PageHeader>

      {/* Filter / Search Bar */}
      <div className="bg-white border border-border rounded-[24px] shadow-card overflow-hidden">
        <div className="p-4 border-b border-border bg-surface-subtle/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-content-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search adjustments by reference # or notes..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-border rounded-full focus:outline-none focus:ring-2 focus:ring-coral-500/20 focus:border-coral-500 shadow-xs transition"
            />
          </div>
          <div className="text-xs text-content-secondary font-mono">
            {adjustments.length} {adjustments.length === 1 ? 'adjustment' : 'adjustments'} recorded
          </div>
        </div>

        {/* Content Table / Status */}
        {isLoading ? (
          <div className="p-16 text-center flex flex-col items-center justify-center space-y-3">
            <div className="w-8 h-8 rounded-full border-2 border-coral-500 border-t-transparent animate-spin" />
            <p className="text-xs text-content-secondary">Fetching stock adjustment records...</p>
          </div>
        ) : isError ? (
          <div className="p-12 text-center flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-2xl bg-danger-50 border border-danger-200 flex items-center justify-center mb-3">
              <AlertCircle className="w-6 h-6 text-danger-600" />
            </div>
            <h3 className="text-sm font-bold text-navy-950 mb-1">Failed to load adjustments</h3>
            <p className="text-xs text-content-secondary mb-4">
              {(error as any)?.message || 'An error occurred while communicating with the server.'}
            </p>
            <Button variant="secondary" size="sm" onClick={() => refetch()}>
              Retry
            </Button>
          </div>
        ) : adjustments.length === 0 ? (
          <div className="bg-white p-16 text-center flex flex-col items-center justify-center">
            <div className="w-14 h-14 rounded-2xl bg-surface-subtle border border-border flex items-center justify-center mb-3.5 shadow-xs">
              <Sliders className="w-7 h-7 text-content-muted" />
            </div>
            <h3 className="text-base font-bold text-navy-950 mb-1">No Stock Adjustments</h3>
            <p className="text-xs text-content-secondary mt-1 max-w-sm mx-auto leading-relaxed mb-4">
              {search
                ? `No adjustments match the search query "${search}".`
                : 'Record manual stock adjustments for damages, expirations, or discrepancies discovered during physical cycle counts.'}
            </p>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="pill-btn-coral h-9 px-4 text-white font-semibold text-xs rounded-full shadow-coral transition inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Record Adjustment</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-surface-subtle/70 text-content-secondary border-b border-border">
                <tr>
                  <th className="py-3 px-4 font-semibold">Adjustment #</th>
                  <th className="py-3 px-4 font-semibold">Date</th>
                  <th className="py-3 px-4 font-semibold">Product & SKU</th>
                  <th className="py-3 px-4 font-semibold">Warehouse</th>
                  <th className="py-3 px-4 font-semibold text-center">Type</th>
                  <th className="py-3 px-4 font-semibold text-right">Adjustment Qty</th>
                  <th className="py-3 px-4 font-semibold text-right">Balance Change</th>
                  <th className="py-3 px-4 font-semibold">Reason Category</th>
                  <th className="py-3 px-4 font-semibold">Authorized By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {adjustments.map((adj) => (
                  <tr key={adj.id} className="hover:bg-surface-subtle/30 transition">
                    <td className="py-3 px-4 font-mono font-bold text-navy-950 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5 text-coral-600" />
                        <span>{adj.adjustmentNumber}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-content-secondary font-mono whitespace-nowrap">
                      {new Date(adj.createdAt).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-bold text-navy-950">{adj.product?.name || '---'}</div>
                      <div className="text-[11px] text-content-muted font-mono">
                        SKU: {adj.product?.sku || '---'}
                      </div>
                    </td>

                    <td className="py-3 px-4 font-medium text-navy-900">
                      {adj.warehouse?.name || 'Warehouse'}
                      <span className="text-[11px] text-content-muted font-mono ml-1">
                        ({adj.warehouse?.code || '---'})
                      </span>
                    </td>

                    <td className="py-3 px-4 text-center">
                      {adj.adjustmentType === 'INCREASE' ? (
                        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full text-[11px] font-semibold">
                          <TrendingUp className="w-3 h-3 text-emerald-600" />
                          Increase
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded-full text-[11px] font-semibold">
                          <TrendingDown className="w-3 h-3 text-rose-600" />
                          Decrease
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right font-mono font-bold">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          adj.adjustmentType === 'INCREASE'
                            ? 'text-emerald-700 bg-emerald-50 border border-emerald-200'
                            : 'text-rose-700 bg-rose-50 border border-rose-200'
                        }`}
                      >
                        {adj.adjustmentType === 'INCREASE' ? `+${adj.quantity}` : `-${adj.quantity}`}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right font-mono text-content-secondary whitespace-nowrap">
                      <span>{Number(adj.previousStock)}</span>
                      <span className="text-content-muted mx-1">→</span>
                      <span className="font-bold text-navy-950">{Number(adj.newStock)}</span>
                    </td>

                    <td className="py-3 px-4 text-content-secondary max-w-xs">
                      <div className="font-medium text-navy-900">{adj.reasonCategory}</div>
                      <div className="text-[11px] text-content-muted italic truncate">{adj.notes}</div>
                    </td>

                    <td className="py-3 px-4 text-content-secondary whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3 text-content-muted" />
                        <span>{adj.authorizer?.fullName || adj.authorizer?.username || 'Admin'}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Adjustment Modal */}
      <StockAdjustmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
