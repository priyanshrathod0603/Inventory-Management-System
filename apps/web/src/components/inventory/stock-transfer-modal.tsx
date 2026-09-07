'use client';

import React, { useState, useEffect } from 'react';
import { X, ArrowRightLeft, Plus, Trash2, AlertCircle } from 'lucide-react';
import { useCreateTransfer } from '../../hooks/use-inventory';
import { useProducts } from '../../hooks/use-products';
import { useWarehouses } from '../../hooks/use-warehouses';
import { Button } from '../ui/button';

interface StockTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface TransferItemRow {
  productId: string;
  quantity: string;
}

export function StockTransferModal({ isOpen, onClose }: StockTransferModalProps) {
  const [fromWarehouseId, setFromWarehouseId] = useState('');
  const [toWarehouseId, setToWarehouseId] = useState('');
  const [status, setStatus] = useState<'DRAFT' | 'IN_TRANSIT' | 'COMPLETED'>('IN_TRANSIT');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<TransferItemRow[]>([{ productId: '', quantity: '1' }]);
  const [error, setError] = useState<string | null>(null);

  const { data: warehousesData } = useWarehouses();
  const { data: productsData } = useProducts({ limit: 100 });
  const createTransferMutation = useCreateTransfer();

  useEffect(() => {
    if (isOpen && warehousesData && warehousesData.length >= 2) {
      setFromWarehouseId(warehousesData[0].id);
      setToWarehouseId(warehousesData[1].id);
      setStatus('IN_TRANSIT');
      setNotes('');
      setItems([{ productId: productsData?.data?.[0]?.id || '', quantity: '1' }]);
      setError(null);
    }
  }, [isOpen, warehousesData, productsData]);

  if (!isOpen) return null;

  const handleAddItem = () => {
    setItems((prev) => [...prev, { productId: productsData?.data?.[0]?.id || '', quantity: '1' }]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: keyof TransferItemRow, value: string) => {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fromWarehouseId || !toWarehouseId) {
      setError('Please select both source and destination warehouses.');
      return;
    }
    if (fromWarehouseId === toWarehouseId) {
      setError('Source and destination warehouses cannot be the same facility.');
      return;
    }
    if (items.length === 0) {
      setError('Please add at least one product line item to transfer.');
      return;
    }

    const payloadItems = items.map((it) => ({
      productId: it.productId,
      quantity: Number(it.quantity) || 0,
    }));

    for (const item of payloadItems) {
      if (!item.productId) {
        setError('Please select a product for all transfer line items.');
        return;
      }
      if (item.quantity <= 0) {
        setError('Transfer quantity for each item must be greater than zero.');
        return;
      }
    }

    try {
      await createTransferMutation.mutateAsync({
        fromWarehouseId,
        toWarehouseId,
        status,
        notes: notes.trim() || undefined,
        items: payloadItems,
      });
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to initiate transfer. Please check warehouse balances.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white border border-border rounded-[28px] w-full max-w-2xl shadow-elevated overflow-hidden animate-scale-up flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-border flex items-center justify-between bg-surface-subtle/50 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-coral-50 border border-coral-200/80 flex items-center justify-center">
              <ArrowRightLeft className="w-4 h-4 text-coral-600" />
            </div>
            <div>
              <h3 className="text-base font-bold text-navy-950">Create Stock Transfer</h3>
              <p className="text-xs text-content-secondary">
                Inter-warehouse stock relocation with dual ledger entries
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
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {error && (
            <div className="p-3 bg-danger-50 border border-danger-200 text-danger-700 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Warehouses Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-surface-subtle/60 border border-border rounded-2xl">
            <div>
              <label className="block text-xs font-semibold text-navy-950 mb-1">
                Source Warehouse (From) <span className="text-danger-600">*</span>
              </label>
              <select
                required
                value={fromWarehouseId}
                onChange={(e) => setFromWarehouseId(e.target.value)}
                className="form-input-warm w-full text-xs text-navy-950 focus:outline-none cursor-pointer"
              >
                {(warehousesData || []).map((w) => (
                  <option key={w.id} value={w.id} disabled={w.id === toWarehouseId}>
                    {w.name} ({w.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-navy-950 mb-1">
                Destination Warehouse (To) <span className="text-danger-600">*</span>
              </label>
              <select
                required
                value={toWarehouseId}
                onChange={(e) => setToWarehouseId(e.target.value)}
                className="form-input-warm w-full text-xs text-navy-950 focus:outline-none cursor-pointer"
              >
                {(warehousesData || []).map((w) => (
                  <option key={w.id} value={w.id} disabled={w.id === fromWarehouseId}>
                    {w.name} ({w.code})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Initial Status */}
          <div>
            <label className="block text-xs font-semibold text-navy-950 mb-1">
              Initial Transfer Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="form-input-warm w-full text-xs text-navy-950 focus:outline-none cursor-pointer"
            >
              <option value="DRAFT">Draft (Planning only, no stock moved yet)</option>
              <option value="IN_TRANSIT">In Transit (Deducted from source, awaiting receipt)</option>
              <option value="COMPLETED">Direct Complete (Instantly transferred & received)</option>
            </select>
          </div>

          {/* Transfer Line Items */}
          <div className="space-y-2.5 pt-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-navy-950 uppercase tracking-wider">
                Transfer Line Items ({items.length})
              </label>
              <button
                type="button"
                onClick={handleAddItem}
                className="text-xs font-semibold text-coral-600 hover:text-coral-700 flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Product</span>
              </button>
            </div>

            <div className="space-y-2">
              {items.map((item, index) => {
                const prod = (productsData?.data || []).find((p) => p.id === item.productId);
                const stockInFromWh =
                  prod?.warehouseInventory?.find((w) => w.warehouseId === fromWarehouseId)?.quantity ??
                  prod?.currentStock ??
                  0;

                return (
                  <div
                    key={index}
                    className="p-3 bg-surface-subtle/40 border border-border rounded-xl flex items-center gap-3"
                  >
                    <div className="flex-1">
                      <select
                        required
                        value={item.productId}
                        onChange={(e) => handleItemChange(index, 'productId', e.target.value)}
                        className="form-input-warm w-full text-xs text-navy-950 focus:outline-none cursor-pointer"
                      >
                        <option value="">Select Product to Transfer</option>
                        {(productsData?.data || []).map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name} ({p.sku})
                          </option>
                        ))}
                      </select>
                      <div className="text-[11px] text-content-muted mt-1 font-mono">
                        Available in Source: {Number(stockInFromWh)} {prod?.unit || 'units'}
                      </div>
                    </div>

                    <div className="w-28">
                      <input
                        type="number"
                        step="1"
                        min="1"
                        required
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                        placeholder="Qty"
                        className="form-input-warm w-full text-xs text-navy-950 focus:outline-none tabular-nums font-mono font-semibold"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveItem(index)}
                      disabled={items.length <= 1}
                      className="p-2 text-content-muted hover:text-danger-600 disabled:opacity-30 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-navy-950 mb-1">
              Transfer Notes / Dispatch Details <span className="text-content-muted font-normal">(Optional)</span>
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Dispatched via Truck #MH-04-1234. Driver contact: 9876543210"
              className="form-input-warm w-full text-xs text-navy-950 focus:outline-none resize-none"
            />
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-border flex items-center justify-end gap-2.5 shrink-0">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={onClose}
              disabled={createTransferMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="default"
              size="sm"
              isLoading={createTransferMutation.isPending}
            >
              Initiate Transfer
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
