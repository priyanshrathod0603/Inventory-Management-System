'use client';

import React, { useState } from 'react';
import { PageHeader } from '../../../components/layout/page-header';
import {
  ArrowRightLeft,
  Plus,
  Search,
  AlertCircle,
  Truck,
  CheckCircle2,
  XCircle,
  ArrowRight,
  FileText,
  User,
} from 'lucide-react';
import { useStockTransfers, useUpdateTransferStatus, StockTransfer } from '../../../hooks/use-inventory';
import { StockTransferModal } from '../../../components/inventory/stock-transfer-modal';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';

export default function StockTransfersPage() {
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: response, isLoading, isError, error, refetch } = useStockTransfers({
    search: search.trim() || undefined,
    limit: 100,
  });
  const updateStatusMutation = useUpdateTransferStatus();

  const transfers = response?.data || [];

  const handleUpdateStatus = async (
    transfer: StockTransfer,
    status: 'DRAFT' | 'IN_TRANSIT' | 'COMPLETED' | 'CANCELLED'
  ) => {
    const actionLabel =
      status === 'IN_TRANSIT'
        ? 'dispatch this transfer (deduct stock from source)'
        : status === 'COMPLETED'
        ? 'complete receiving this transfer (credit stock to destination)'
        : 'cancel this transfer';

    if (window.confirm(`Are you sure you want to ${actionLabel}?`)) {
      try {
        await updateStatusMutation.mutateAsync({
          id: transfer.id,
          status,
        });
      } catch (err: any) {
        alert(err?.message || 'Failed to update transfer status.');
      }
    }
  };

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'DRAFT':
        return <Badge variant="neutral">Draft (Planned)</Badge>;
      case 'IN_TRANSIT':
        return <Badge variant="warning">In Transit</Badge>;
      case 'COMPLETED':
        return <Badge variant="success">Completed</Badge>;
      case 'CANCELLED':
        return <Badge variant="danger">Cancelled</Badge>;
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Stock Transfers"
        subtitle="Manage inter-warehouse relocations, in-transit shipments, and dual ledger tracking."
        breadcrumbs={[{ label: 'Inventory' }, { label: 'Transfers' }]}
      >
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="pill-btn-coral h-9 px-4 text-white font-semibold text-xs rounded-full shadow-coral flex items-center gap-1.5 transition cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Transfer</span>
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
              placeholder="Search transfers by transfer #, warehouse or notes..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-border rounded-full focus:outline-none focus:ring-2 focus:ring-coral-500/20 focus:border-coral-500 shadow-xs transition"
            />
          </div>
          <div className="text-xs text-content-secondary font-mono">
            {transfers.length} {transfers.length === 1 ? 'transfer' : 'transfers'} recorded
          </div>
        </div>

        {/* Content Table / Status */}
        {isLoading ? (
          <div className="p-16 text-center flex flex-col items-center justify-center space-y-3">
            <div className="w-8 h-8 rounded-full border-2 border-coral-500 border-t-transparent animate-spin" />
            <p className="text-xs text-content-secondary">Fetching stock transfer orders...</p>
          </div>
        ) : isError ? (
          <div className="p-12 text-center flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-2xl bg-danger-50 border border-danger-200 flex items-center justify-center mb-3">
              <AlertCircle className="w-6 h-6 text-danger-600" />
            </div>
            <h3 className="text-sm font-bold text-navy-950 mb-1">Failed to load transfer orders</h3>
            <p className="text-xs text-content-secondary mb-4">
              {(error as any)?.message || 'An error occurred while communicating with the server.'}
            </p>
            <Button variant="secondary" size="sm" onClick={() => refetch()}>
              Retry
            </Button>
          </div>
        ) : transfers.length === 0 ? (
          <div className="bg-white p-16 text-center flex flex-col items-center justify-center">
            <div className="w-14 h-14 rounded-2xl bg-surface-subtle border border-border flex items-center justify-center mb-3.5 shadow-xs">
              <ArrowRightLeft className="w-7 h-7 text-content-muted" />
            </div>
            <h3 className="text-base font-bold text-navy-950 mb-1">No Stock Transfers</h3>
            <p className="text-xs text-content-secondary mt-1 max-w-sm mx-auto leading-relaxed mb-4">
              {search
                ? `No transfers match the search query "${search}".`
                : 'Create internal warehouse transfer orders to move stock between storage locations and branch outlets.'}
            </p>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="pill-btn-coral h-9 px-4 text-white font-semibold text-xs rounded-full shadow-coral transition inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Transfer Order</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-surface-subtle/70 text-content-secondary border-b border-border">
                <tr>
                  <th className="py-3 px-4 font-semibold">Transfer #</th>
                  <th className="py-3 px-4 font-semibold">Date</th>
                  <th className="py-3 px-4 font-semibold">Route (From → To)</th>
                  <th className="py-3 px-4 font-semibold">Items Transferred</th>
                  <th className="py-3 px-4 font-semibold text-center">Status</th>
                  <th className="py-3 px-4 font-semibold">Created By</th>
                  <th className="py-3 px-4 font-semibold text-right">Workflow Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {transfers.map((trf) => (
                  <tr key={trf.id} className="hover:bg-surface-subtle/30 transition">
                    <td className="py-3 px-4 font-mono font-bold text-navy-950 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5 text-coral-600" />
                        <span>{trf.transferNumber}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-content-secondary font-mono whitespace-nowrap">
                      {new Date(trf.transferDate || trf.createdAt).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 text-navy-950 font-medium">
                        <span>{trf.fromWarehouse?.name}</span>
                        <ArrowRight className="w-3 h-3 text-content-muted shrink-0" />
                        <span>{trf.toWarehouse?.name}</span>
                      </div>
                      <div className="text-[11px] text-content-muted font-mono mt-0.5">
                        {trf.fromWarehouse?.code} → {trf.toWarehouse?.code}
                      </div>
                    </td>

                    <td className="py-3 px-4 text-content-secondary">
                      {trf.items && trf.items.length > 0 ? (
                        <div className="space-y-0.5">
                          {trf.items.map((item) => (
                            <div key={item.id} className="text-[11px]">
                              <span className="font-semibold text-navy-900">{item.product?.name}</span>
                              <span className="font-mono text-content-muted ml-1">
                                (Qty: {Number(item.quantity)})
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span>—</span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-center">
                      {renderStatusBadge(trf.status)}
                    </td>

                    <td className="py-3 px-4 text-content-secondary whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3 text-content-muted" />
                        <span>{trf.creator?.fullName || trf.creator?.username || 'Admin'}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {trf.status === 'DRAFT' && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleUpdateStatus(trf, 'IN_TRANSIT')}
                              disabled={updateStatusMutation.isPending}
                              className="px-2.5 py-1 text-[11px] font-semibold bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 rounded-full transition flex items-center gap-1 cursor-pointer"
                            >
                              <Truck className="w-3 h-3" />
                              <span>Dispatch</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleUpdateStatus(trf, 'CANCELLED')}
                              disabled={updateStatusMutation.isPending}
                              className="px-2.5 py-1 text-[11px] font-semibold bg-danger-50 text-danger-700 hover:bg-danger-100 border border-danger-200 rounded-full transition flex items-center gap-1 cursor-pointer"
                            >
                              <XCircle className="w-3 h-3" />
                              <span>Cancel</span>
                            </button>
                          </>
                        )}

                        {trf.status === 'IN_TRANSIT' && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleUpdateStatus(trf, 'COMPLETED')}
                              disabled={updateStatusMutation.isPending}
                              className="px-2.5 py-1 text-[11px] font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded-full transition flex items-center gap-1 cursor-pointer"
                            >
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Receive & Complete</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleUpdateStatus(trf, 'CANCELLED')}
                              disabled={updateStatusMutation.isPending}
                              className="px-2.5 py-1 text-[11px] font-semibold bg-danger-50 text-danger-700 hover:bg-danger-100 border border-danger-200 rounded-full transition flex items-center gap-1 cursor-pointer"
                            >
                              <XCircle className="w-3 h-3" />
                              <span>Cancel (Return)</span>
                            </button>
                          </>
                        )}

                        {(trf.status === 'COMPLETED' || trf.status === 'CANCELLED') && (
                          <span className="text-[11px] text-content-muted font-mono italic">
                            Workflow Closed
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Stock Transfer Modal */}
      <StockTransferModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
