'use client';

import React from 'react';
import { X, Package, Tag, Warehouse as WarehouseIcon, Clock, Layers, DollarSign, Edit3, ArrowUpRight } from 'lucide-react';
import { Product, useProduct } from '../../hooks/use-products';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

interface ProductDetailsDrawerProps {
  productId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (product: Product) => void;
  onAdjustStock?: (product: Product) => void;
  onAddBatch?: (product: Product) => void;
}

export function ProductDetailsDrawer({
  productId,
  isOpen,
  onClose,
  onEdit,
  onAdjustStock,
  onAddBatch,
}: ProductDetailsDrawerProps) {
  const { data: product, isLoading } = useProduct(productId || '');

  if (!isOpen || !productId) return null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'IN_STOCK':
        return <Badge variant="success">In Stock</Badge>;
      case 'LOW_STOCK':
        return <Badge variant="warning">Low Stock</Badge>;
      case 'OUT_OF_STOCK':
        return <Badge variant="danger">Out of Stock</Badge>;
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  };

  const sellingPrice = Number(product?.sellingPrice || 0);
  const purchasePrice = Number(product?.purchasePrice || 0);
  const margin = sellingPrice > 0 ? (((sellingPrice - purchasePrice) / sellingPrice) * 100).toFixed(1) : '0';

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-xl bg-white border-l border-border shadow-elevated flex flex-col animate-slide-in-right">
          {/* Header */}
          <div className="p-6 border-b border-border bg-surface-subtle/50 flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-coral-50 border border-coral-200/80 flex items-center justify-center shrink-0 mt-0.5">
                <Package className="w-5 h-5 text-coral-600" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-base font-bold text-navy-950">
                    {product?.name || 'Loading details...'}
                  </h2>
                  {product && getStatusBadge(product.stockStatus)}
                </div>
                <div className="flex items-center gap-3 text-xs text-content-secondary font-mono">
                  <span>SKU: {product?.sku || '---'}</span>
                  {product?.barcode && <span>• Barcode: {product.barcode}</span>}
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full text-content-muted hover:text-navy-950 hover:bg-surface-subtle transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body */}
          {isLoading || !product ? (
            <div className="flex-1 p-8 flex flex-col items-center justify-center space-y-3">
              <div className="w-8 h-8 rounded-full border-2 border-coral-500 border-t-transparent animate-spin" />
              <p className="text-xs text-content-secondary">Fetching product details & stock data...</p>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Quick Actions */}
              <div className="flex items-center gap-2">
                {onEdit && (
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      onEdit(product);
                      onClose();
                    }}
                    leftIcon={<Edit3 className="w-3.5 h-3.5" />}
                  >
                    Edit Master
                  </Button>
                )}
                {onAdjustStock && (
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      onAdjustStock(product);
                      onClose();
                    }}
                    leftIcon={<ArrowUpRight className="w-3.5 h-3.5" />}
                  >
                    Adjust Stock
                  </Button>
                )}
                {product.hasBatchTracking && onAddBatch && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      onAddBatch(product);
                      onClose();
                    }}
                  >
                    + Add Batch
                  </Button>
                )}
              </div>

              {/* Pricing & Tax Card */}
              <div className="bg-surface-subtle/70 border border-border rounded-2xl p-4 space-y-3">
                <h4 className="text-xs font-bold text-navy-950 uppercase tracking-wider flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-coral-600" />
                  <span>Commercial & Tax Structure</span>
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="bg-white p-2.5 rounded-xl border border-border/80">
                    <span className="text-[11px] text-content-secondary block">Selling Price</span>
                    <span className="text-sm font-bold text-navy-950 tabular-nums font-mono">
                      ₹{Number(product.sellingPrice).toFixed(2)}
                    </span>
                    <span className="text-[10px] text-content-muted block">
                      {product.isTaxInclusive ? '(Tax Inc.)' : '(Tax Excl.)'}
                    </span>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-border/80">
                    <span className="text-[11px] text-content-secondary block">Cost Price</span>
                    <span className="text-sm font-bold text-navy-950 tabular-nums font-mono">
                      ₹{Number(product.purchasePrice).toFixed(2)}
                    </span>
                    <span className="text-[10px] text-emerald-600 font-semibold block">
                      +{margin}% margin
                    </span>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-border/80">
                    <span className="text-[11px] text-content-secondary block">MRP</span>
                    <span className="text-sm font-bold text-navy-950 tabular-nums font-mono">
                      {product.mrp ? `₹${Number(product.mrp).toFixed(2)}` : 'N/A'}
                    </span>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-border/80">
                    <span className="text-[11px] text-content-secondary block">GST Rate</span>
                    <span className="text-sm font-bold text-navy-950 tabular-nums font-mono">
                      {product.taxRate}%
                    </span>
                  </div>
                </div>
              </div>

              {/* General Metadata */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-white rounded-xl border border-border">
                  <span className="text-content-secondary block text-[11px]">Category</span>
                  <span className="font-semibold text-navy-950">{product.category?.name || 'Uncategorized'}</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-border">
                  <span className="text-content-secondary block text-[11px]">Brand</span>
                  <span className="font-semibold text-navy-950">{product.brand?.name || 'Generic / None'}</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-border">
                  <span className="text-content-secondary block text-[11px]">Unit of Measure</span>
                  <span className="font-semibold text-navy-950">{product.unit}</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-border">
                  <span className="text-content-secondary block text-[11px]">Total Aggregate Stock</span>
                  <span className="font-bold text-navy-950 font-mono">
                    {Number(product.currentStock)} {product.unit}
                  </span>
                </div>
              </div>

              {/* Warehouse Inventory Breakdown */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold text-navy-950 uppercase tracking-wider flex items-center gap-1.5">
                  <WarehouseIcon className="w-3.5 h-3.5 text-coral-600" />
                  <span>Stock Distribution by Warehouse</span>
                </h4>
                {product.warehouseInventory && product.warehouseInventory.length > 0 ? (
                  <div className="border border-border rounded-xl overflow-hidden bg-white">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-surface-subtle/80 text-content-secondary border-b border-border">
                        <tr>
                          <th className="py-2.5 px-3 font-semibold">Warehouse</th>
                          <th className="py-2.5 px-3 font-semibold">Code</th>
                          <th className="py-2.5 px-3 font-semibold text-right">Available Qty</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {product.warehouseInventory.map((inv) => (
                          <tr key={inv.id} className="hover:bg-surface-subtle/40">
                            <td className="py-2.5 px-3 font-medium text-navy-950">
                              {inv.warehouse?.name || 'Warehouse'}
                            </td>
                            <td className="py-2.5 px-3 font-mono text-content-secondary">
                              {inv.warehouse?.code || '---'}
                            </td>
                            <td className="py-2.5 px-3 font-bold font-mono text-right text-navy-950">
                              {Number(inv.quantity)} {product.unit}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-4 bg-surface-subtle/50 rounded-xl border border-border text-center text-xs text-content-muted">
                    No warehouse inventory records found for this product.
                  </div>
                )}
              </div>

              {/* Active Batches (If Enabled) */}
              {product.hasBatchTracking && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-navy-950 uppercase tracking-wider flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-coral-600" />
                      <span>Product Batches</span>
                    </h4>
                  </div>
                  {product.batches && product.batches.length > 0 ? (
                    <div className="border border-border rounded-xl overflow-hidden bg-white">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-surface-subtle/80 text-content-secondary border-b border-border">
                          <tr>
                            <th className="py-2.5 px-3 font-semibold">Batch #</th>
                            <th className="py-2.5 px-3 font-semibold">Expiry Date</th>
                            <th className="py-2.5 px-3 font-semibold text-right">Quantity</th>
                            <th className="py-2.5 px-3 font-semibold text-right">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {product.batches.map((batch: any) => (
                            <tr key={batch.id} className="hover:bg-surface-subtle/40">
                              <td className="py-2.5 px-3 font-mono font-medium text-navy-950">
                                {batch.batchNumber}
                              </td>
                              <td className="py-2.5 px-3 text-content-secondary font-mono">
                                {new Date(batch.expiryDate).toLocaleDateString()}
                              </td>
                              <td className="py-2.5 px-3 font-bold font-mono text-right text-navy-950">
                                {Number(batch.quantity)}
                              </td>
                              <td className="py-2.5 px-3 text-right">
                                <span
                                  className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                    batch.status === 'ACTIVE'
                                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                      : batch.status === 'NEAR_EXPIRY'
                                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                                  }`}
                                >
                                  {batch.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="p-4 bg-surface-subtle/50 rounded-xl border border-border text-center text-xs text-content-muted">
                      No active batches recorded.
                    </div>
                  )}
                </div>
              )}

              {/* Recent Stock Movements */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold text-navy-950 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-coral-600" />
                  <span>Recent Ledger Activity</span>
                </h4>
                {product.stockMovements && product.stockMovements.length > 0 ? (
                  <div className="border border-border rounded-xl overflow-hidden bg-white">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-surface-subtle/80 text-content-secondary border-b border-border">
                        <tr>
                          <th className="py-2.5 px-3 font-semibold">Date</th>
                          <th className="py-2.5 px-3 font-semibold">Type</th>
                          <th className="py-2.5 px-3 font-semibold text-right">Qty</th>
                          <th className="py-2.5 px-3 font-semibold text-right">Balance</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {product.stockMovements.slice(0, 5).map((mov: any) => (
                          <tr key={mov.id} className="hover:bg-surface-subtle/40">
                            <td className="py-2.5 px-3 text-content-secondary font-mono">
                              {new Date(mov.movementDate || mov.createdAt).toLocaleDateString()}
                            </td>
                            <td className="py-2.5 px-3 font-medium text-navy-950">
                              {mov.movementType}
                            </td>
                            <td
                              className={`py-2.5 px-3 font-bold font-mono text-right ${
                                Number(mov.quantity) > 0 ? 'text-emerald-600' : 'text-rose-600'
                              }`}
                            >
                              {Number(mov.quantity) > 0 ? `+${mov.quantity}` : mov.quantity}
                            </td>
                            <td className="py-2.5 px-3 font-bold font-mono text-right text-navy-950">
                              {Number(mov.afterStock)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-4 bg-surface-subtle/50 rounded-xl border border-border text-center text-xs text-content-muted">
                    No movement records yet.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
