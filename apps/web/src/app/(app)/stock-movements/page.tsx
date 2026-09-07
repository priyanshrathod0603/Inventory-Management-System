'use client';

import React, { useState } from 'react';
import { PageHeader } from '../../../components/layout/page-header';
import { ArrowLeftRight, Search, Filter, AlertCircle, Calendar, User, FileText } from 'lucide-react';
import { useStockMovements, StockMovement } from '../../../hooks/use-inventory';
import { useWarehouses } from '../../../hooks/use-warehouses';
import { useProducts } from '../../../hooks/use-products';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';

const MOVEMENT_TYPES = [
  { value: '', label: 'All Movement Types' },
  { value: 'OPENING_STOCK', label: 'Opening Stock' },
  { value: 'PURCHASE_RECEIPT', label: 'Purchase Inward' },
  { value: 'SALE_DISPATCH', label: 'Sale Dispatch / POS' },
  { value: 'TRANSFER_IN', label: 'Transfer Inward' },
  { value: 'TRANSFER_OUT', label: 'Transfer Outward' },
  { value: 'ADJUSTMENT_INCREASE', label: 'Adjustment Increase (+)' },
  { value: 'ADJUSTMENT_DECREASE', label: 'Adjustment Decrease (-)' },
  { value: 'RETURN_INWARD', label: 'Sales Return Inward' },
  { value: 'RETURN_OUTWARD', label: 'Purchase Return Outward' },
];

export default function StockMovementsPage() {
  const [movementType, setMovementType] = useState('');
  const [warehouseId, setWarehouseId] = useState('');
  const [productId, setProductId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const { data: response, isLoading, isError, error, refetch } = useStockMovements({
    movementType: movementType || undefined,
    warehouseId: warehouseId || undefined,
    productId: productId || undefined,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
    limit: 100,
  });

  const { data: warehousesData } = useWarehouses();
  const { data: productsData } = useProducts({ limit: 100 });

  const movements = response?.data || [];

  const renderMovementTypeBadge = (type: string) => {
    switch (type) {
      case 'OPENING_STOCK':
        return <Badge variant="info">Opening Stock</Badge>;
      case 'PURCHASE_RECEIPT':
        return <Badge variant="success">Purchase Receipt</Badge>;
      case 'SALE_DISPATCH':
        return <Badge variant="coral">Sale Dispatch</Badge>;
      case 'TRANSFER_IN':
        return <Badge variant="info">Transfer In</Badge>;
      case 'TRANSFER_OUT':
        return <Badge variant="warning">Transfer Out</Badge>;
      case 'ADJUSTMENT_INCREASE':
        return <Badge variant="success">Adjustment (+)</Badge>;
      case 'ADJUSTMENT_DECREASE':
        return <Badge variant="danger">Adjustment (-)</Badge>;
      default:
        return <Badge variant="neutral">{type}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Stock Movements Ledger"
        subtitle="Immutable transaction audit trail of all inventory inward, outward, transfer, and adjustment events."
        breadcrumbs={[{ label: 'Inventory' }, { label: 'Stock Movements' }]}
      />

      {/* Filter and Control Bar */}
      <div className="bg-white border border-border rounded-[24px] shadow-card overflow-hidden">
        <div className="p-4 border-b border-border bg-surface-subtle/50 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5 flex-1">
            {/* Movement Type Filter */}
            <select
              value={movementType}
              onChange={(e) => setMovementType(e.target.value)}
              className="py-1.5 px-3 text-xs bg-white border border-border rounded-full focus:outline-none focus:ring-2 focus:ring-coral-500/20 text-navy-950 cursor-pointer shadow-xs"
            >
              {MOVEMENT_TYPES.map((mt) => (
                <option key={mt.value} value={mt.value}>
                  {mt.label}
                </option>
              ))}
            </select>

            {/* Warehouse Filter */}
            <select
              value={warehouseId}
              onChange={(e) => setWarehouseId(e.target.value)}
              className="py-1.5 px-3 text-xs bg-white border border-border rounded-full focus:outline-none focus:ring-2 focus:ring-coral-500/20 text-navy-950 cursor-pointer shadow-xs"
            >
              <option value="">All Warehouses</option>
              {(warehousesData || []).map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name} ({w.code})
                </option>
              ))}
            </select>

            {/* Product Filter */}
            <select
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              className="py-1.5 px-3 text-xs bg-white border border-border rounded-full focus:outline-none focus:ring-2 focus:ring-coral-500/20 text-navy-950 cursor-pointer shadow-xs max-w-xs truncate"
            >
              <option value="">All Products</option>
              {(productsData?.data || []).map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.sku})
                </option>
              ))}
            </select>

            {/* Date Filters */}
            <div className="flex items-center gap-1.5 bg-white border border-border rounded-full px-3 py-1 shadow-xs text-xs">
              <Calendar className="w-3.5 h-3.5 text-content-muted" />
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="text-xs text-navy-950 focus:outline-none font-mono"
                placeholder="From"
              />
              <span className="text-content-muted text-[10px]">to</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="text-xs text-navy-950 focus:outline-none font-mono"
                placeholder="To"
              />
            </div>
          </div>

          <div className="text-xs text-content-secondary font-mono">
            {movements.length} {movements.length === 1 ? 'entry' : 'entries'} in ledger
          </div>
        </div>

        {/* Content Table / Status */}
        {isLoading ? (
          <div className="p-16 text-center flex flex-col items-center justify-center space-y-3">
            <div className="w-8 h-8 rounded-full border-2 border-coral-500 border-t-transparent animate-spin" />
            <p className="text-xs text-content-secondary">Fetching stock ledger transactions...</p>
          </div>
        ) : isError ? (
          <div className="p-12 text-center flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-2xl bg-danger-50 border border-danger-200 flex items-center justify-center mb-3">
              <AlertCircle className="w-6 h-6 text-danger-600" />
            </div>
            <h3 className="text-sm font-bold text-navy-950 mb-1">Failed to load stock movements</h3>
            <p className="text-xs text-content-secondary mb-4">
              {(error as any)?.message || 'An error occurred while communicating with the server.'}
            </p>
            <Button variant="secondary" size="sm" onClick={() => refetch()}>
              Retry
            </Button>
          </div>
        ) : movements.length === 0 ? (
          <div className="bg-white p-16 text-center flex flex-col items-center justify-center">
            <div className="w-14 h-14 rounded-2xl bg-surface-subtle border border-border flex items-center justify-center mb-3.5 shadow-xs">
              <ArrowLeftRight className="w-7 h-7 text-content-muted" />
            </div>
            <h3 className="text-base font-bold text-navy-950 mb-1">No Movements Recorded</h3>
            <p className="text-xs text-content-secondary max-w-sm leading-relaxed">
              All inventory transactions (purchases, POS sales, transfers, adjustments) will log immutable movement records here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-surface-subtle/70 text-content-secondary border-b border-border">
                <tr>
                  <th className="py-3 px-4 font-semibold">Date & Time</th>
                  <th className="py-3 px-4 font-semibold">Movement Type</th>
                  <th className="py-3 px-4 font-semibold">Product & SKU</th>
                  <th className="py-3 px-4 font-semibold">Warehouse</th>
                  <th className="py-3 px-4 font-semibold text-right">Qty Change</th>
                  <th className="py-3 px-4 font-semibold text-right">Balance (Before → After)</th>
                  <th className="py-3 px-4 font-semibold">Reference</th>
                  <th className="py-3 px-4 font-semibold">Operator</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {movements.map((mov) => {
                  const qty = Number(mov.quantity);
                  const isPositive = qty > 0;

                  return (
                    <tr key={mov.id} className="hover:bg-surface-subtle/30 transition">
                      <td className="py-3 px-4 text-content-secondary font-mono whitespace-nowrap">
                        {new Date(mov.movementDate || mov.createdAt).toLocaleString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>

                      <td className="py-3 px-4">
                        {renderMovementTypeBadge(mov.movementType)}
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-bold text-navy-950">{mov.product?.name || '---'}</div>
                        <div className="text-[11px] text-content-muted font-mono">
                          SKU: {mov.product?.sku || '---'}
                          {mov.batch && <span> • Lot: {mov.batch.batchNumber}</span>}
                        </div>
                      </td>

                      <td className="py-3 px-4 font-medium text-navy-900">
                        {mov.warehouse?.name || 'Warehouse'}
                        <span className="text-[11px] text-content-muted font-mono ml-1">
                          ({mov.warehouse?.code || '---'})
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right font-mono font-bold">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            isPositive
                              ? 'text-emerald-700 bg-emerald-50 border border-emerald-200'
                              : 'text-rose-700 bg-rose-50 border border-rose-200'
                          }`}
                        >
                          {isPositive ? `+${qty}` : qty} {mov.product?.unit || 'units'}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right font-mono text-content-secondary whitespace-nowrap">
                        <span>{Number(mov.beforeStock)}</span>
                        <span className="text-content-muted mx-1">→</span>
                        <span className="font-bold text-navy-950">{Number(mov.afterStock)}</span>
                      </td>

                      <td className="py-3 px-4 font-mono text-content-secondary">
                        <div className="flex items-center gap-1 font-semibold text-navy-900">
                          <FileText className="w-3 h-3 text-content-muted" />
                          <span>{mov.referenceNumber}</span>
                        </div>
                        {mov.reason && (
                          <div className="text-[11px] text-content-muted italic truncate max-w-xs font-sans">
                            {mov.reason}
                          </div>
                        )}
                      </td>

                      <td className="py-3 px-4 text-content-secondary whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3 text-content-muted" />
                          <span>{mov.user?.fullName || mov.user?.username || 'System Admin'}</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
