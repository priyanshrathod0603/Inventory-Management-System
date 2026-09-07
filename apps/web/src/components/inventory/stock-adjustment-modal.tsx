'use client';

import React, { useState, useEffect } from 'react';
import { X, ArrowUpDown, AlertCircle, CheckCircle2, TrendingUp, TrendingDown } from 'lucide-react';
import { useCreateAdjustment } from '../../hooks/use-inventory';
import { useProducts, Product } from '../../hooks/use-products';
import { useWarehouses } from '../../hooks/use-warehouses';
import { Button } from '../ui/button';

interface StockAdjustmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedProduct?: Product | null;
  preselectedWarehouseId?: string;
}

const REASON_CATEGORIES = [
  { value: 'PHYSICAL_AUDIT_SURPLUS', label: 'Physical Audit Surplus (Found Stock)' },
  { value: 'PHYSICAL_AUDIT_SHORTAGE', label: 'Physical Audit Shortage (Missing Stock)' },
  { value: 'DAMAGED_GOODS', label: 'Damaged / Broken Goods' },
  { value: 'EXPIRED_STOCK', label: 'Expired Stock Write-Off' },
  { value: 'THEFT_OR_LOSS', label: 'Theft / Pilferage / Transit Loss' },
  { value: 'CORRECTION_ENTRY', label: 'Data Entry Correction' },
  { value: 'OTHER', label: 'Other Operational Reason' },
];

export function StockAdjustmentModal({
  isOpen,
  onClose,
  preselectedProduct,
  preselectedWarehouseId,
}: StockAdjustmentModalProps) {
  const [productId, setProductId] = useState('');
  const [warehouseId, setWarehouseId] = useState('');
  const [adjustmentType, setAdjustmentType] = useState<'INCREASE' | 'DECREASE'>('INCREASE');
  const [quantity, setQuantity] = useState<string>('');
  const [reasonCategory, setReasonCategory] = useState('PHYSICAL_AUDIT_SURPLUS');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  const { data: productsData } = useProducts({ limit: 100 });
  const { data: warehousesData } = useWarehouses();
  const createAdjustmentMutation = useCreateAdjustment();

  useEffect(() => {
    if (isOpen) {
      if (preselectedProduct) {
        setProductId(preselectedProduct.id);
      } else if (productsData?.data?.[0]) {
        setProductId(productsData.data[0].id);
      }

      if (preselectedWarehouseId) {
        setWarehouseId(preselectedWarehouseId);
      } else if (warehousesData?.[0]) {
        setWarehouseId(warehousesData[0].id);
      }

      setAdjustmentType('INCREASE');
      setQuantity('');
      setReasonCategory('PHYSICAL_AUDIT_SURPLUS');
      setNotes('');
      setError(null);
    }
  }, [isOpen, preselectedProduct, preselectedWarehouseId, productsData, warehousesData]);

  if (!isOpen) return null;

  // Selected product & stock calculation
  const selectedProduct = (productsData?.data || []).find((p) => p.id === productId);
  const warehouseStockRecord = selectedProduct?.warehouseInventory?.find(
    (w) => w.warehouseId === warehouseId
  );
  const currentWarehouseStock = Number(warehouseStockRecord?.quantity ?? (warehouseId ? 0 : selectedProduct?.currentStock ?? 0));
  const adjustmentQty = Number(quantity) || 0;

  const projectedStock =
    adjustmentType === 'INCREASE'
      ? currentWarehouseStock + adjustmentQty
      : currentWarehouseStock - adjustmentQty;

  const isInvalidDecrease = adjustmentType === 'DECREASE' && adjustmentQty > currentWarehouseStock;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!productId) {
      setError('Please select a product.');
      return;
    }
    if (!warehouseId) {
      setError('Please select a warehouse.');
      return;
    }
    if (adjustmentQty <= 0) {
      setError('Adjustment quantity must be greater than zero.');
      return;
    }
    if (isInvalidDecrease) {
      setError(
        `Cannot decrease ${adjustmentQty} units. Only ${currentWarehouseStock} units are currently available in this warehouse.`
      );
      return;
    }
    if (!notes.trim()) {
      setError('Please provide mandatory notes/justification for this stock adjustment.');
      return;
    }

    try {
      await createAdjustmentMutation.mutateAsync({
        productId,
        warehouseId,
        adjustmentType,
        quantity: adjustmentQty,
        reasonCategory,
        notes: notes.trim(),
      });
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to apply stock adjustment. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white border border-border rounded-[28px] w-full max-w-lg shadow-elevated overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="px-6 py-5 border-b border-border flex items-center justify-between bg-surface-subtle/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-coral-50 border border-coral-200/80 flex items-center justify-center">
              <ArrowUpDown className="w-4 h-4 text-coral-600" />
            </div>
            <div>
              <h3 className="text-base font-bold text-navy-950">Record Stock Adjustment</h3>
              <p className="text-xs text-content-secondary">
                Direct balance adjustment with audit logging & negative protection
              </p>
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-danger-50 border border-danger-200 text-danger-700 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Product & Warehouse Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-navy-950 mb-1">
                Target Product <span className="text-danger-600">*</span>
              </label>
              <select
                required
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                className="form-input-warm w-full text-xs text-navy-950 focus:outline-none cursor-pointer"
              >
                <option value="">Select Product</option>
                {(productsData?.data || []).map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.sku})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-navy-950 mb-1">
                Warehouse Location <span className="text-danger-600">*</span>
              </label>
              <select
                required
                value={warehouseId}
                onChange={(e) => setWarehouseId(e.target.value)}
                className="form-input-warm w-full text-xs text-navy-950 focus:outline-none cursor-pointer"
              >
                <option value="">Select Warehouse</option>
                {(warehousesData || []).map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name} ({w.code})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Adjustment Type Selector Buttons */}
          <div>
            <label className="block text-xs font-semibold text-navy-950 mb-1.5">
              Adjustment Type <span className="text-danger-600">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setAdjustmentType('INCREASE')}
                className={`p-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
                  adjustmentType === 'INCREASE'
                    ? 'border-emerald-500 bg-emerald-50/80 text-emerald-800 shadow-xs'
                    : 'border-border bg-white text-content-secondary hover:bg-surface-subtle'
                }`}
              >
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span>Stock In / Increase (+)</span>
              </button>

              <button
                type="button"
                onClick={() => setAdjustmentType('DECREASE')}
                className={`p-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
                  adjustmentType === 'DECREASE'
                    ? 'border-rose-500 bg-rose-50/80 text-rose-800 shadow-xs'
                    : 'border-border bg-white text-content-secondary hover:bg-surface-subtle'
                }`}
              >
                <TrendingDown className="w-4 h-4 text-rose-600" />
                <span>Stock Out / Decrease (-)</span>
              </button>
            </div>
          </div>

          {/* Quantity & Visual Math Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-navy-950 mb-1">
                Adjustment Quantity <span className="text-danger-600">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="e.g. 10"
                className="form-input-warm w-full text-xs text-navy-950 focus:outline-none tabular-nums font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-navy-950 mb-1">
                Reason Category <span className="text-danger-600">*</span>
              </label>
              <select
                value={reasonCategory}
                onChange={(e) => setReasonCategory(e.target.value)}
                className="form-input-warm w-full text-xs text-navy-950 focus:outline-none cursor-pointer"
              >
                {REASON_CATEGORIES.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Real-time Math Summary Card */}
          <div className="p-3.5 bg-surface-subtle/80 border border-border rounded-2xl space-y-1.5 text-xs">
            <div className="flex items-center justify-between text-content-secondary">
              <span>Current Available in Warehouse:</span>
              <span className="font-mono font-semibold text-navy-950">{currentWarehouseStock} {selectedProduct?.unit || 'units'}</span>
            </div>
            <div className="flex items-center justify-between text-content-secondary">
              <span>Adjustment Operation:</span>
              <span
                className={`font-mono font-semibold ${
                  adjustmentType === 'INCREASE' ? 'text-emerald-600' : 'text-rose-600'
                }`}
              >
                {adjustmentType === 'INCREASE' ? `+${adjustmentQty}` : `-${adjustmentQty}`} {selectedProduct?.unit || 'units'}
              </span>
            </div>
            <div className="pt-2 border-t border-border flex items-center justify-between font-bold text-navy-950">
              <span>Resulting Balance:</span>
              <span className={`font-mono text-sm ${isInvalidDecrease ? 'text-rose-600' : 'text-navy-950'}`}>
                {projectedStock} {selectedProduct?.unit || 'units'}
              </span>
            </div>
            {isInvalidDecrease && (
              <p className="text-[11px] text-rose-600 font-medium pt-1">
                ⚠️ Negative stock is not allowed. Adjust quantity to at most {currentWarehouseStock}.
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-navy-950 mb-1">
              Audit Notes / Reason Description <span className="text-danger-600">*</span>
            </label>
            <textarea
              rows={2}
              required
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Audit conducted on 2026-09-07 found 5 units broken in transit."
              className="form-input-warm w-full text-xs text-navy-950 focus:outline-none resize-none"
            />
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-border flex items-center justify-end gap-2.5">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={onClose}
              disabled={createAdjustmentMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="default"
              size="sm"
              disabled={isInvalidDecrease || adjustmentQty <= 0}
              isLoading={createAdjustmentMutation.isPending}
            >
              Apply Adjustment
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
