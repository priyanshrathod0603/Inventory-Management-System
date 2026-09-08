'use client';

import React, { useState, useEffect } from 'react';
import { X, Tag, AlertCircle, Loader2, Package, Calendar, Coins } from 'lucide-react';
import { useCreateBatch } from '../../hooks/use-batches';
import { useProducts, Product } from '../../hooks/use-products';
import { useWarehouses } from '../../hooks/use-warehouses';
import { useBusinessProfile } from '../../hooks/use-business-profile';

interface BatchFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedProduct?: Product | null;
}

export function BatchFormModal({ isOpen, onClose, preselectedProduct }: BatchFormModalProps) {
  const [productId, setProductId] = useState('');
  const [warehouseId, setWarehouseId] = useState('');
  const [batchNumber, setBatchNumber] = useState('');
  const [mfgDate, setMfgDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [quantity, setQuantity] = useState<string>('');
  const [purchasePrice, setPurchasePrice] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const { data: productsData } = useProducts({ limit: 100 });
  const { data: warehousesData } = useWarehouses();
  const { data: profileData } = useBusinessProfile();
  const createBatchMutation = useCreateBatch();

  const isPending = createBatchMutation.isPending;
  const currencySymbol = profileData?.profile?.currencySymbol || '₹';

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
        setPurchasePrice(String(preselectedProduct.purchasePrice || '0'));
      } else if (productsData?.data?.[0]) {
        setProductId(productsData.data[0].id);
        setPurchasePrice(String(productsData.data[0].purchasePrice || '0'));
      }

      if (warehousesData?.[0]) {
        setWarehouseId(warehousesData[0].id);
      }

      setBatchNumber('');
      setMfgDate('');
      setExpiryDate('');
      setQuantity('');
      setError(null);
    }
  }, [isOpen, preselectedProduct, productsData, warehousesData]);

  if (!isOpen) return null;

  const selectedProduct = (productsData?.data || []).find((p) => p.id === productId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!productId) {
      setError('Please select a target product.');
      return;
    }
    if (!warehouseId) {
      setError('Please select a storage warehouse.');
      return;
    }
    if (!batchNumber.trim()) {
      setError('Batch or lot number is required.');
      return;
    }
    if (!expiryDate) {
      setError('Expiry date is mandatory for batch tracking.');
      return;
    }
    if (!quantity || Number(quantity) <= 0) {
      setError('Initial batch quantity must be greater than zero.');
      return;
    }

    try {
      await createBatchMutation.mutateAsync({
        productId,
        warehouseId,
        batchNumber: batchNumber.trim().toUpperCase(),
        mfgDate: mfgDate || undefined,
        expiryDate: new Date(expiryDate).toISOString(),
        quantity: Number(quantity),
        purchasePrice: Number(purchasePrice) || 0,
      });
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to create product batch. Please check inputs.');
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
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-[#111722] font-sans tracking-tight">
                Add Product Batch
              </h3>
              <p className="text-xs text-[#5F636B] mt-0.5">
                Track manufacturing & expiry dates for perishable and lot-tracked inventory
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

            {/* Section 1: Product & Warehouse */}
            <div className="p-4 rounded-2xl bg-[#FAF7F4]/50 border border-[#EAE5E0] space-y-3">
              <h4 className="text-[11px] font-extrabold text-[#111722] uppercase tracking-wider flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5 text-coral-500" />
                <span>Product &amp; Warehouse Location</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#111722] mb-1.5">
                    Target Product <span className="text-[#FF6B4A] font-bold ml-0.5">*</span>
                  </label>
                  <select
                    required
                    value={productId}
                    onChange={(e) => {
                      setProductId(e.target.value);
                      const p = (productsData?.data || []).find((prod) => prod.id === e.target.value);
                      if (p) setPurchasePrice(String(p.purchasePrice || '0'));
                    }}
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
                    Storage Warehouse <span className="text-[#FF6B4A] font-bold ml-0.5">*</span>
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

            {/* Section 2: Batch Information */}
            <div className="p-4 rounded-2xl bg-[#FAF7F4]/50 border border-[#EAE5E0] space-y-3">
              <h4 className="text-[11px] font-extrabold text-[#111722] uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-coral-500" />
                <span>Batch Identification &amp; Lifecycle</span>
              </h4>

              <div>
                <label className="block text-xs font-bold text-[#111722] mb-1.5">
                  Batch / Lot Number <span className="text-[#FF6B4A] font-bold ml-0.5">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={batchNumber}
                  onChange={(e) => setBatchNumber(e.target.value.toUpperCase())}
                  placeholder="e.g. LOT-2026-09A or BATCH-994"
                  className="w-full h-11 px-3.5 rounded-xl border border-[#EAE5E0] bg-white text-xs text-[#111722] placeholder:text-[#8C9097] focus:outline-none focus:ring-2 focus:ring-[#FF6B4A]/20 focus:border-[#FF6B4A] font-mono uppercase transition"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#111722] mb-1.5">
                    Manufacturing Date <span className="text-[#8C9097] font-normal text-[11px] ml-1">(Optional)</span>
                  </label>
                  <input
                    type="date"
                    value={mfgDate}
                    onChange={(e) => setMfgDate(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-[#EAE5E0] bg-white text-xs text-[#111722] focus:outline-none focus:ring-2 focus:ring-[#FF6B4A]/20 focus:border-[#FF6B4A] font-mono transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#111722] mb-1.5">
                    Expiry Date <span className="text-[#FF6B4A] font-bold ml-0.5">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-[#EAE5E0] bg-white text-xs text-[#111722] focus:outline-none focus:ring-2 focus:ring-[#FF6B4A]/20 focus:border-[#FF6B4A] font-mono transition"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Stock & Cost */}
            <div className="p-4 rounded-2xl bg-[#FAF7F4]/50 border border-[#EAE5E0] space-y-3">
              <h4 className="text-[11px] font-extrabold text-[#111722] uppercase tracking-wider flex items-center gap-1.5">
                <Coins className="w-3.5 h-3.5 text-coral-500" />
                <span>Initial Stock &amp; Cost Rate</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#111722] mb-1.5">
                    Initial Batch Quantity ({selectedProduct?.unit || 'Units'}) <span className="text-[#FF6B4A] font-bold ml-0.5">*</span>
                  </label>
                  <input
                    type="number"
                    step="1"
                    min="1"
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="e.g. 50"
                    className="w-full h-11 px-3.5 rounded-xl border border-[#EAE5E0] bg-white text-xs text-[#111722] placeholder:text-[#8C9097] focus:outline-none focus:ring-2 focus:ring-[#FF6B4A]/20 focus:border-[#FF6B4A] tabular-nums font-mono font-bold transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#111722] mb-1.5">
                    Purchase Price per Unit ({currencySymbol})
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#8C9097]">
                      {currencySymbol}
                    </span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={purchasePrice}
                      onChange={(e) => setPurchasePrice(e.target.value)}
                      placeholder="0.00"
                      className="w-full h-11 pl-8 pr-3.5 rounded-xl border border-[#EAE5E0] bg-white text-xs text-[#111722] placeholder:text-[#8C9097] focus:outline-none focus:ring-2 focus:ring-[#FF6B4A]/20 focus:border-[#FF6B4A] tabular-nums font-mono transition"
                    />
                  </div>
                </div>
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
              disabled={isPending}
              className="pill-btn-coral px-6 h-11 rounded-full text-white text-xs font-bold shadow-coral transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                  <span>Creating Batch...</span>
                </>
              ) : (
                <span>Create Batch</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
