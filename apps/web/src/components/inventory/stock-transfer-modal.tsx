'use client';

import React, { useState, useEffect } from 'react';
import { X, ArrowRightLeft, Plus, Trash2, AlertCircle, Loader2, Warehouse, ArrowRight, Layers, FileText } from 'lucide-react';
import { useCreateTransfer } from '../../hooks/use-inventory';
import { useProducts } from '../../hooks/use-products';
import { useWarehouses } from '../../hooks/use-warehouses';

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

  const isPending = createTransferMutation.isPending;

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
      setError(err?.message || 'Failed to initiate transfer. Please check warehouse stock balances.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
      <div
        className="bg-white border border-[#EAE5E0] rounded-[28px] w-full max-w-2xl shadow-[0_25px_60px_-15px_rgba(17,23,34,0.15)] overflow-hidden flex flex-col max-h-[92vh] animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 sm:px-8 py-5 border-b border-[#EAE5E0] flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-coral-50 border border-coral-200/80 text-coral-600 flex items-center justify-center shrink-0 shadow-xs">
              <ArrowRightLeft className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-[#111722] font-sans tracking-tight">
                Create Stock Transfer
              </h3>
              <p className="text-xs text-[#5F636B] mt-0.5">
                Inter-warehouse stock relocation with automated source-to-destination ledger tracking
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

            {/* Section 1: Facilities */}
            <div className="p-4 rounded-2xl bg-[#FAF7F4]/50 border border-[#EAE5E0] space-y-3">
              <h4 className="text-[11px] font-extrabold text-[#111722] uppercase tracking-wider flex items-center gap-1.5">
                <Warehouse className="w-3.5 h-3.5 text-coral-500" />
                <span>Source &amp; Destination Facilities</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-11 gap-3 items-center">
                <div className="sm:col-span-5">
                  <label className="block text-xs font-bold text-[#111722] mb-1.5">
                    Source Warehouse (From) <span className="text-[#FF6B4A] font-bold ml-0.5">*</span>
                  </label>
                  <select
                    required
                    value={fromWarehouseId}
                    onChange={(e) => setFromWarehouseId(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-[#EAE5E0] bg-white text-xs text-[#111722] focus:outline-none focus:ring-2 focus:ring-[#FF6B4A]/20 focus:border-[#FF6B4A] transition cursor-pointer"
                  >
                    {(warehousesData || []).map((w) => (
                      <option key={w.id} value={w.id} disabled={w.id === toWarehouseId}>
                        {w.name} ({w.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-1 flex items-center justify-center pt-5">
                  <div className="w-8 h-8 rounded-full bg-white border border-[#EAE5E0] flex items-center justify-center text-coral-600 shadow-xs">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>

                <div className="sm:col-span-5">
                  <label className="block text-xs font-bold text-[#111722] mb-1.5">
                    Destination Warehouse (To) <span className="text-[#FF6B4A] font-bold ml-0.5">*</span>
                  </label>
                  <select
                    required
                    value={toWarehouseId}
                    onChange={(e) => setToWarehouseId(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-[#EAE5E0] bg-white text-xs text-[#111722] focus:outline-none focus:ring-2 focus:ring-[#FF6B4A]/20 focus:border-[#FF6B4A] transition cursor-pointer"
                  >
                    {(warehousesData || []).map((w) => (
                      <option key={w.id} value={w.id} disabled={w.id === fromWarehouseId}>
                        {w.name} ({w.code})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Section 2: Transfer Status */}
            <div>
              <label className="block text-xs font-bold text-[#111722] mb-1.5">
                Initial Transfer Workflow Status <span className="text-[#FF6B4A] font-bold ml-0.5">*</span>
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full h-11 px-3.5 rounded-xl border border-[#EAE5E0] bg-[#FAF7F4]/50 focus:bg-white text-xs text-[#111722] focus:outline-none focus:ring-2 focus:ring-[#FF6B4A]/20 focus:border-[#FF6B4A] transition cursor-pointer"
              >
                <option value="DRAFT">Draft (Planning stage, stock remains untouched)</option>
                <option value="IN_TRANSIT">In Transit (Stock deducted from source, awaiting receiving)</option>
                <option value="COMPLETED">Direct Complete (Instantly transferred and received in destination)</option>
              </select>
            </div>

            {/* Section 3: Line Items */}
            <div className="p-4 rounded-2xl bg-[#FAF7F4]/50 border border-[#EAE5E0] space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-[11px] font-extrabold text-[#111722] uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-coral-500" />
                  <span>Transfer Line Items ({items.length})</span>
                </h4>
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="text-xs font-bold text-coral-600 hover:text-coral-700 flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Another Product</span>
                </button>
              </div>

              <div className="space-y-2.5">
                {items.map((item, index) => {
                  const prod = (productsData?.data || []).find((p) => p.id === item.productId);
                  const stockInFromWh =
                    prod?.warehouseInventory?.find((w) => w.warehouseId === fromWarehouseId)?.quantity ??
                    prod?.currentStock ??
                    0;

                  return (
                    <div
                      key={index}
                      className="p-3.5 bg-white border border-[#EAE5E0] rounded-xl flex items-center gap-3 shadow-xs"
                    >
                      <div className="flex-1">
                        <label className="block text-[10px] font-extrabold text-[#8C9097] uppercase tracking-wider mb-1">
                          Product Item #{index + 1}
                        </label>
                        <select
                          required
                          value={item.productId}
                          onChange={(e) => handleItemChange(index, 'productId', e.target.value)}
                          className="w-full h-10 px-3 rounded-xl border border-[#EAE5E0] bg-[#FAF7F4]/40 text-xs text-[#111722] focus:outline-none focus:ring-2 focus:ring-[#FF6B4A]/20 focus:border-[#FF6B4A] transition cursor-pointer"
                        >
                          <option value="">Select Product to Transfer</option>
                          {(productsData?.data || []).map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name} ({p.sku})
                            </option>
                          ))}
                        </select>
                        <div className="text-[11px] text-[#8C9097] mt-1 font-mono font-medium">
                          Available in Source Warehouse: <span className="font-bold text-[#111722]">{Number(stockInFromWh)} {prod?.unit || 'units'}</span>
                        </div>
                      </div>

                      <div className="w-32">
                        <label className="block text-[10px] font-extrabold text-[#8C9097] uppercase tracking-wider mb-1">
                          Quantity
                        </label>
                        <input
                          type="number"
                          step="1"
                          min="1"
                          required
                          value={item.quantity}
                          onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                          placeholder="Qty"
                          className="w-full h-10 px-3 rounded-xl border border-[#EAE5E0] bg-[#FAF7F4]/40 text-xs text-[#111722] placeholder:text-[#8C9097] focus:outline-none focus:ring-2 focus:ring-[#FF6B4A]/20 focus:border-[#FF6B4A] tabular-nums font-mono font-bold transition"
                        />
                      </div>

                      <div className="pt-4">
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(index)}
                          disabled={items.length <= 1}
                          className="p-2 text-[#8C9097] hover:text-danger-600 disabled:opacity-25 transition cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Section 4: Notes */}
            <div>
              <label className="block text-xs font-bold text-[#111722] mb-1.5">
                Transfer Notes &amp; Dispatch Details <span className="text-[#8C9097] font-normal text-[11px] ml-1">(Optional)</span>
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Dispatched via Logistics Van #MH-04-1234. Driver Contact: 9876543210. Expected arrival by 4:00 PM."
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAE5E0] bg-[#FAF7F4]/50 focus:bg-white text-xs text-[#111722] placeholder:text-[#8C9097] focus:outline-none focus:ring-2 focus:ring-[#FF6B4A]/20 focus:border-[#FF6B4A] transition resize-none"
              />
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
                  <span>Initiating Transfer...</span>
                </>
              ) : (
                <span>Initiate Transfer</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
