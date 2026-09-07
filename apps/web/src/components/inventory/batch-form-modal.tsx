'use client';

import React, { useState, useEffect } from 'react';
import { X, Tag, AlertCircle } from 'lucide-react';
import { useCreateBatch } from '../../hooks/use-batches';
import { useProducts, Product } from '../../hooks/use-products';
import { useWarehouses } from '../../hooks/use-warehouses';
import { Button } from '../ui/button';

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
  const createBatchMutation = useCreateBatch();

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
    if (!batchNumber.trim()) {
      setError('Batch number is required.');
      return;
    }
    if (!expiryDate) {
      setError('Expiry date is required for batch tracking.');
      return;
    }
    if (!quantity || Number(quantity) <= 0) {
      setError('Quantity must be greater than zero.');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white border border-border rounded-[28px] w-full max-w-lg shadow-elevated overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="px-6 py-5 border-b border-border flex items-center justify-between bg-surface-subtle/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-coral-50 border border-coral-200/80 flex items-center justify-center">
              <Tag className="w-4 h-4 text-coral-600" />
            </div>
            <div>
              <h3 className="text-base font-bold text-navy-950">Add Product Batch</h3>
              <p className="text-xs text-content-secondary">
                Track manufacturing & expiry dates for perishable / regulated inventory
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-navy-950 mb-1">
                Target Product <span className="text-danger-600">*</span>
              </label>
              <select
                required
                value={productId}
                onChange={(e) => {
                  setProductId(e.target.value);
                  const p = (productsData?.data || []).find((prod) => prod.id === e.target.value);
                  if (p) setPurchasePrice(String(p.purchasePrice || '0'));
                }}
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
                Warehouse <span className="text-danger-600">*</span>
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

          <div>
            <label className="block text-xs font-semibold text-navy-950 mb-1">
              Batch / Lot Number <span className="text-danger-600">*</span>
            </label>
            <input
              type="text"
              required
              value={batchNumber}
              onChange={(e) => setBatchNumber(e.target.value.toUpperCase())}
              placeholder="e.g. BATCH-2026-09A"
              className="form-input-warm w-full text-xs text-navy-950 focus:outline-none font-mono uppercase"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-navy-950 mb-1">
                Mfg Date <span className="text-content-muted font-normal">(Optional)</span>
              </label>
              <input
                type="date"
                value={mfgDate}
                onChange={(e) => setMfgDate(e.target.value)}
                className="form-input-warm w-full text-xs text-navy-950 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-navy-950 mb-1">
                Expiry Date <span className="text-danger-600">*</span>
              </label>
              <input
                type="date"
                required
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="form-input-warm w-full text-xs text-navy-950 focus:outline-none font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-navy-950 mb-1">
                Initial Batch Quantity <span className="text-danger-600">*</span>
              </label>
              <input
                type="number"
                step="1"
                min="1"
                required
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="e.g. 50"
                className="form-input-warm w-full text-xs text-navy-950 focus:outline-none tabular-nums font-mono font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-navy-950 mb-1">
                Purchase Price per Unit (₹)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={purchasePrice}
                onChange={(e) => setPurchasePrice(e.target.value)}
                placeholder="0.00"
                className="form-input-warm w-full text-xs text-navy-950 focus:outline-none tabular-nums"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-border flex items-center justify-end gap-2.5">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={onClose}
              disabled={createBatchMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="default"
              size="sm"
              isLoading={createBatchMutation.isPending}
            >
              Create Batch
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
