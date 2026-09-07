'use client';

import React, { useState } from 'react';
import { PageHeader } from '../../../components/layout/page-header';
import { Tag, Plus, Search, AlertCircle, Clock, Calendar, AlertTriangle } from 'lucide-react';
import { useBatches, ProductBatch } from '../../../hooks/use-batches';
import { useWarehouses } from '../../../hooks/use-warehouses';
import { BatchFormModal } from '../../../components/inventory/batch-form-modal';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';

export default function BatchesPage() {
  const [search, setSearch] = useState('');
  const [selectedWarehouse, setSelectedWarehouse] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: response, isLoading, isError, error, refetch } = useBatches({
    search: search.trim() || undefined,
    warehouseId: selectedWarehouse || undefined,
    status: selectedStatus !== 'ALL' ? selectedStatus : undefined,
    limit: 100,
  });

  const { data: warehousesData } = useWarehouses();

  const batches = response?.data || [];

  const renderBatchStatusBadge = (batch: ProductBatch) => {
    switch (batch.status) {
      case 'ACTIVE':
        return (
          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full text-[11px] font-semibold">
            Active
          </span>
        );
      case 'NEAR_EXPIRY':
        return (
          <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-0.5 rounded-full text-[11px] font-semibold">
            <AlertTriangle className="w-3 h-3 text-amber-600" />
            Near Expiry ({batch.daysRemaining ?? '≤30'}d)
          </span>
        );
      case 'EXPIRED':
        return (
          <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-700 border border-rose-200 px-2.5 py-0.5 rounded-full text-[11px] font-semibold">
            Expired
          </span>
        );
      case 'DEPLETED':
        return (
          <span className="inline-flex items-center gap-1 bg-surface-subtle text-content-secondary border border-border px-2.5 py-0.5 rounded-full text-[11px] font-semibold">
            Depleted (0 Qty)
          </span>
        );
      default:
        return <Badge variant="neutral">{batch.status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Batch & Expiry Tracking"
        subtitle="Monitor product batch numbers, manufacturing dates, expiry schedules, and perishable stock."
        breadcrumbs={[{ label: 'Inventory' }, { label: 'Batches' }]}
      >
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="pill-btn-coral h-9 px-4 text-white font-semibold text-xs rounded-full shadow-coral flex items-center gap-1.5 transition cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Batch</span>
        </button>
      </PageHeader>

      {/* Filter / Search Bar */}
      <div className="bg-white border border-border rounded-[24px] shadow-card overflow-hidden">
        <div className="p-4 border-b border-border bg-surface-subtle/50 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5 flex-1">
            <div className="relative min-w-[220px] max-w-sm">
              <Search className="w-4 h-4 text-content-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search batches by lot # or product..."
                className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-border rounded-full focus:outline-none focus:ring-2 focus:ring-coral-500/20 focus:border-coral-500 shadow-xs transition"
              />
            </div>

            {/* Warehouse Filter */}
            <select
              value={selectedWarehouse}
              onChange={(e) => setSelectedWarehouse(e.target.value)}
              className="py-2 px-3 text-xs bg-white border border-border rounded-full focus:outline-none focus:ring-2 focus:ring-coral-500/20 text-navy-950 cursor-pointer shadow-xs"
            >
              <option value="">All Warehouses</option>
              {(warehousesData || []).map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name} ({w.code})
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="py-2 px-3 text-xs bg-white border border-border rounded-full focus:outline-none focus:ring-2 focus:ring-coral-500/20 text-navy-950 cursor-pointer shadow-xs"
            >
              <option value="ALL">All Batch Statuses</option>
              <option value="ACTIVE">Active Only</option>
              <option value="NEAR_EXPIRY">Near Expiry (&le; 30 Days)</option>
              <option value="EXPIRED">Expired</option>
              <option value="DEPLETED">Depleted (Zero Qty)</option>
            </select>
          </div>

          <div className="text-xs text-content-secondary font-mono">
            {batches.length} {batches.length === 1 ? 'batch' : 'batches'} tracked
          </div>
        </div>

        {/* Content Table / Status */}
        {isLoading ? (
          <div className="p-16 text-center flex flex-col items-center justify-center space-y-3">
            <div className="w-8 h-8 rounded-full border-2 border-coral-500 border-t-transparent animate-spin" />
            <p className="text-xs text-content-secondary">Fetching product batch schedules...</p>
          </div>
        ) : isError ? (
          <div className="p-12 text-center flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-2xl bg-danger-50 border border-danger-200 flex items-center justify-center mb-3">
              <AlertCircle className="w-6 h-6 text-danger-600" />
            </div>
            <h3 className="text-sm font-bold text-navy-950 mb-1">Failed to load batches</h3>
            <p className="text-xs text-content-secondary mb-4">
              {(error as any)?.message || 'An error occurred while communicating with the server.'}
            </p>
            <Button variant="secondary" size="sm" onClick={() => refetch()}>
              Retry
            </Button>
          </div>
        ) : batches.length === 0 ? (
          <div className="bg-white p-16 text-center flex flex-col items-center justify-center">
            <div className="w-14 h-14 rounded-2xl bg-surface-subtle border border-border flex items-center justify-center mb-3.5 shadow-xs">
              <Clock className="w-7 h-7 text-content-muted" />
            </div>
            <h3 className="text-base font-bold text-navy-950 mb-1">No Batch Records Found</h3>
            <p className="text-xs text-content-secondary mt-1 max-w-sm mx-auto leading-relaxed mb-4">
              {search || selectedWarehouse || selectedStatus !== 'ALL'
                ? 'No batch records match your active search and filter criteria.'
                : 'Track manufacturing and expiration dates for pharmaceuticals, FMCG, and perishable inventory.'}
            </p>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="pill-btn-coral h-9 px-4 text-white font-semibold text-xs rounded-full shadow-coral transition inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add First Batch</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-surface-subtle/70 text-content-secondary border-b border-border">
                <tr>
                  <th className="py-3 px-4 font-semibold">Batch / Lot #</th>
                  <th className="py-3 px-4 font-semibold">Product & SKU</th>
                  <th className="py-3 px-4 font-semibold">Warehouse</th>
                  <th className="py-3 px-4 font-semibold">Mfg Date</th>
                  <th className="py-3 px-4 font-semibold">Expiry Date</th>
                  <th className="py-3 px-4 font-semibold text-right">Available Qty</th>
                  <th className="py-3 px-4 font-semibold text-right">Unit Cost</th>
                  <th className="py-3 px-4 font-semibold text-center">Batch Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {batches.map((batch) => (
                  <tr key={batch.id} className="hover:bg-surface-subtle/30 transition">
                    <td className="py-3 px-4 font-mono font-bold text-navy-950 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5 text-coral-600" />
                        <span>{batch.batchNumber}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-bold text-navy-950">{batch.product?.name || '---'}</div>
                      <div className="text-[11px] text-content-muted font-mono">
                        SKU: {batch.product?.sku || '---'}
                      </div>
                    </td>

                    <td className="py-3 px-4 font-medium text-navy-900">
                      {batch.warehouse?.name || 'Warehouse'}
                      <span className="text-[11px] text-content-muted font-mono ml-1">
                        ({batch.warehouse?.code || '---'})
                      </span>
                    </td>

                    <td className="py-3 px-4 text-content-secondary font-mono whitespace-nowrap">
                      {batch.mfgDate
                        ? new Date(batch.mfgDate).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })
                        : '—'}
                    </td>

                    <td className="py-3 px-4 font-mono whitespace-nowrap">
                      <div className="font-semibold text-navy-950">
                        {new Date(batch.expiryDate).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </div>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <span className="font-mono font-bold text-navy-950 text-sm">
                        {Number(batch.quantity)}
                      </span>
                      <span className="text-[11px] text-content-muted ml-1 font-sans">
                        {batch.product?.unit || 'units'}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right font-mono text-content-secondary">
                      ₹{Number(batch.purchasePrice).toFixed(2)}
                    </td>

                    <td className="py-3 px-4 text-center">
                      {renderBatchStatusBadge(batch)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Batch Form Modal */}
      <BatchFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
