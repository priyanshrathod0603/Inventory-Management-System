'use client';

import React, { useState, useEffect } from 'react';
import { X, ArrowUpDown, AlertCircle, TrendingUp, TrendingDown, Loader2, Package, Calculator, FileText } from 'lucide-react';
import { useCreateAdjustment } from '../../hooks/use-inventory';
import { useProducts, Product } from '../../hooks/use-products';
import { useWarehouses } from '../../hooks/use-warehouses';

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

  const isPending = createAdjustmentMutation.isPending;

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isPending) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isPending, onClose]);

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
      setError('Please select a target product.');
      return;
    }
    if (!warehouseId) {
      setError('Please select a warehouse facility.');
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
      setError('Please provide mandatory audit justification / reason for this adjustment.');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
      <div
        className="bg-white border border-[#EAE5E0] rounded-[28px] w-full max-w-xl shadow-[0_25px_60px_-15px_rgba(17,23,34,0.15)] overflow-hidden flex flex-col max-h-[92vh] animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 sm:px-8 py-5 border-b border-[#EAE5E0] flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-coral-50 border border-coral-200/80 text-coral-600 flex items-center justify-center shrink-0 shadow-xs">
              <ArrowUpDown className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-[#111722] font-sans tracking-tight">
                Record Stock Adjustment
              </h3>
              <p className="text-xs text-[#5F636B] mt-0.5">
                Reconcile physical inventory variances, damages, write-offs, and shrinkage
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="p-2 rounded-full text-[#8C9097] hover:text-[#111722] hover:bg-[#FAF7F4] border border-transparent hover:border-[#EAE5E0] transition cursor-pointer disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto flex flex-col justify-between">
          <div className="p-6 sm:p-8 space-y-5">
            {error && (
              <div className="p-3.5 bg-danger-50 border border-danger-200 text-danger-700 rounded-2xl text-xs flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 text-danger-600" />
                <span className="font-semibold">{error}</span>
              </div>
            )}

            {/* Section 1: Product & Facility */}
            <div className="p-4 rounded-2xl bg-[#FAF7F4]/50 border border-[#EAE5E0] space-y-3">
              <h4 className="text-[11px] font-extrabold text-[#111722] uppercase tracking-wider flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5 text-coral-500" />
                <span>Product &amp; Facility Location</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#111722] mb-1.5">
                    Target Product <span className="text-[#FF6B4A] font-bold ml-0.5">*</span>
                  </label>
                  <select
                    required
                    value={productId}
                    onChange={(e) => setProductId(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-[#EAE5E0] bg-white text-xs text-[#111722] focus:outline-none focus:ring-2 focus:ring-[#FF6B4A]/20 focus:border-[#FF6B4A] transition cursor-pointer"
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
                  <label className="block text-xs font-bold text-[#111722] mb-1.5">
                    Warehouse Facility <span className="text-[#FF6B4A] font-bold ml-0.5">*</span>
                  </label>
                  <select
                    required
                    value={warehouseId}
                    onChange={(e) => setWarehouseId(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-[#EAE5E0] bg-white text-xs text-[#111722] focus:outline-none focus:ring-2 focus:ring-[#FF6B4A]/20 focus:border-[#FF6B4A] transition cursor-pointer"
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
            </div>

            {/* Section 2: Adjustment Direction & Quantity */}
            <div className="p-4 rounded-2xl bg-[#FAF7F4]/50 border border-[#EAE5E0] space-y-3">
              <h4 className="text-[11px] font-extrabold text-[#111722] uppercase tracking-wider flex items-center gap-1.5">
                <Calculator className="w-3.5 h-3.5 text-coral-500" />
                <span>Adjustment Operation &amp; Quantity</span>
              </h4>

              <div>
                <label className="block text-xs font-bold text-[#111722] mb-1.5">
                  Adjustment Type <span className="text-[#FF6B4A] font-bold ml-0.5">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setAdjustmentType('INCREASE')}
                    className={`h-11 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
                      adjustmentType === 'INCREASE'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-800 shadow-xs'
                        : 'border-[#EAE5E0] bg-white text-[#5F636B] hover:bg-[#FAF7F4]'
                    }`}
                  >
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                    <span>Stock In / Increase (+)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAdjustmentType('DECREASE')}
                    className={`h-11 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
                      adjustmentType === 'DECREASE'
                        ? 'border-rose-500 bg-rose-50 text-rose-800 shadow-xs'
                        : 'border-[#EAE5E0] bg-white text-[#5F636B] hover:bg-[#FAF7F4]'
                    }`}
                  >
                    <TrendingDown className="w-4 h-4 text-rose-600" />
                    <span>Stock Out / Decrease (-)</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#111722] mb-1.5">
                    Adjustment Quantity ({selectedProduct?.unit || 'Units'}) <span className="text-[#FF6B4A] font-bold ml-0.5">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="e.g. 10"
                    className="w-full h-11 px-3.5 rounded-xl border border-[#EAE5E0] bg-white text-xs text-[#111722] placeholder:text-[#8C9097] focus:outline-none focus:ring-2 focus:ring-[#FF6B4A]/20 focus:border-[#FF6B4A] tabular-nums font-mono font-bold transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#111722] mb-1.5">
                    Reason Category <span className="text-[#FF6B4A] font-bold ml-0.5">*</span>
                  </label>
                  <select
                    value={reasonCategory}
                    onChange={(e) => setReasonCategory(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-[#EAE5E0] bg-white text-xs text-[#111722] focus:outline-none focus:ring-2 focus:ring-[#FF6B4A]/20 focus:border-[#FF6B4A] transition cursor-pointer"
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
              <div className="p-3.5 bg-white border border-[#EAE5E0] rounded-xl space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-[#5F636B]">
                  <span>Current Available in Warehouse:</span>
                  <span className="font-mono font-bold text-[#111722]">{currentWarehouseStock} {selectedProduct?.unit || 'units'}</span>
                </div>
                <div className="flex items-center justify-between text-[#5F636B]">
                  <span>Adjustment Operation:</span>
                  <span
                    className={`font-mono font-bold ${
                      adjustmentType === 'INCREASE' ? 'text-emerald-600' : 'text-rose-600'
                    }`}
                  >
                    {adjustmentType === 'INCREASE' ? `+${adjustmentQty}` : `-${adjustmentQty}`} {selectedProduct?.unit || 'units'}
                  </span>
                </div>
                <div className="pt-2 border-t border-[#EAE5E0] flex items-center justify-between font-bold text-[#111722]">
                  <span>Projected New Balance:</span>
                  <span className={`font-mono text-sm ${isInvalidDecrease ? 'text-rose-600' : 'text-[#111722]'}`}>
                    {projectedStock} {selectedProduct?.unit || 'units'}
                  </span>
                </div>
                {isInvalidDecrease && (
                  <p className="text-[11px] text-rose-600 font-bold pt-1">
                    ⚠️ Negative stock is not allowed. Adjust quantity to at most {currentWarehouseStock} units.
                  </p>
                )}
              </div>
            </div>

            {/* Section 3: Audit Justification */}
            <div className="p-4 rounded-2xl bg-[#FAF7F4]/50 border border-[#EAE5E0] space-y-3">
              <h4 className="text-[11px] font-extrabold text-[#111722] uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-coral-500" />
                <span>Audit Notes &amp; Justification</span>
              </h4>

              <div>
                <label className="block text-xs font-bold text-[#111722] mb-1.5">
                  Audit Notes / Reason Description <span className="text-[#FF6B4A] font-bold ml-0.5">*</span>
                </label>
                <textarea
                  rows={2}
                  required
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Physical inventory audit on 2026-09-08 identified 5 broken units during warehouse shelf inspection."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAE5E0] bg-white text-xs text-[#111722] placeholder:text-[#8C9097] focus:outline-none focus:ring-2 focus:ring-[#FF6B4A]/20 focus:border-[#FF6B4A] transition resize-none"
                />
              </div>
            </div>
          </div>

          {/* Form Action Footer */}
          <div className="px-6 sm:px-8 py-4 bg-white border-t border-[#EAE5E0] flex items-center justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="px-5 h-11 rounded-full border border-[#EAE5E0] bg-white hover:bg-[#FAF7F4] text-[#111722] text-xs font-bold transition cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending || isInvalidDecrease || adjustmentQty <= 0}
              className="pill-btn-coral px-6 h-11 rounded-full text-white text-xs font-bold shadow-coral transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                  <span>Applying Adjustment...</span>
                </>
              ) : (
                <span>Apply Adjustment</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
