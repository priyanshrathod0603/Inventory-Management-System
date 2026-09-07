'use client';

import React, { useState, useEffect } from 'react';
import { X, Package, DollarSign, Warehouse as WarehouseIcon, AlertCircle } from 'lucide-react';
import { Product, useCreateProduct, useUpdateProduct } from '../../hooks/use-products';
import { useCategories } from '../../hooks/use-categories';
import { useBrands } from '../../hooks/use-brands';
import { useWarehouses } from '../../hooks/use-warehouses';
import { Button } from '../ui/button';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  productToEdit?: Product | null;
}

const UNITS = [
  { value: 'PCS', label: 'Pieces (PCS)' },
  { value: 'BOX', label: 'Box (BOX)' },
  { value: 'KG', label: 'Kilogram (KG)' },
  { value: 'LTR', label: 'Litre (LTR)' },
  { value: 'PKT', label: 'Packet (PKT)' },
  { value: 'DOZ', label: 'Dozen (DOZ)' },
  { value: 'MTR', label: 'Meter (MTR)' },
  { value: 'GRAM', label: 'Gram (GRAM)' },
];

const TAX_RATES = [
  { value: 0, label: '0% (Exempt / Nil)' },
  { value: 5, label: '5% (GST 5%)' },
  { value: 12, label: '12% (GST 12%)' },
  { value: 18, label: '18% (GST 18%)' },
  { value: 28, label: '28% (GST 28%)' },
];

export function ProductFormModal({ isOpen, onClose, productToEdit }: ProductFormModalProps) {
  const [activeTab, setActiveTab] = useState<'basic' | 'pricing' | 'stock'>('basic');
  const [error, setError] = useState<string | null>(null);

  // Tab 1: Basic Info
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [barcode, setBarcode] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [brandId, setBrandId] = useState('');
  const [unit, setUnit] = useState('PCS');

  // Tab 2: Pricing & Tax
  const [purchasePrice, setPurchasePrice] = useState<string>('0');
  const [sellingPrice, setSellingPrice] = useState<string>('');
  const [mrp, setMrp] = useState<string>('');
  const [taxRate, setTaxRate] = useState<number>(0);
  const [isTaxInclusive, setIsTaxInclusive] = useState(false);

  // Tab 3: Stock & Warehouse
  const [minStockAlert, setMinStockAlert] = useState<string>('5');
  const [initialOpeningStock, setInitialOpeningStock] = useState<string>('0');
  const [warehouseId, setWarehouseId] = useState('');
  const [hasBatchTracking, setHasBatchTracking] = useState(false);
  const [isActive, setIsActive] = useState(true);

  // Reference queries
  const { data: categoriesData } = useCategories();
  const { data: brandsData } = useBrands();
  const { data: warehousesData } = useWarehouses();

  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();

  const isEditing = Boolean(productToEdit);
  const isPending = createMutation.isPending || updateMutation.isPending;

  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name);
      setSku(productToEdit.sku);
      setBarcode(productToEdit.barcode || '');
      setCategoryId(productToEdit.categoryId);
      setBrandId(productToEdit.brandId || '');
      setUnit(productToEdit.unit);

      setPurchasePrice(String(productToEdit.purchasePrice ?? '0'));
      setSellingPrice(String(productToEdit.sellingPrice ?? ''));
      setMrp(String(productToEdit.mrp ?? ''));
      setTaxRate(Number(productToEdit.taxRate ?? 0));
      setIsTaxInclusive(productToEdit.isTaxInclusive);

      setMinStockAlert(String(productToEdit.minStockAlert ?? '5'));
      setHasBatchTracking(productToEdit.hasBatchTracking);
      setIsActive(productToEdit.isActive);
    } else {
      setName('');
      setSku('');
      setBarcode('');
      setCategoryId(categoriesData?.data?.[0]?.id || '');
      setBrandId('');
      setUnit('PCS');

      setPurchasePrice('0');
      setSellingPrice('');
      setMrp('');
      setTaxRate(0);
      setIsTaxInclusive(false);

      setMinStockAlert('5');
      setInitialOpeningStock('0');
      setWarehouseId(warehousesData?.[0]?.id || '');
      setHasBatchTracking(false);
      setIsActive(true);
    }
    setActiveTab('basic');
    setError(null);
  }, [productToEdit, isOpen, categoriesData, warehousesData]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setActiveTab('basic');
      setError('Product name is required.');
      return;
    }
    if (!sku.trim()) {
      setActiveTab('basic');
      setError('SKU code is required.');
      return;
    }
    if (!categoryId) {
      setActiveTab('basic');
      setError('Please select a product category.');
      return;
    }
    if (!sellingPrice || Number(sellingPrice) < 0) {
      setActiveTab('pricing');
      setError('Valid selling price is required.');
      return;
    }

    try {
      if (isEditing && productToEdit) {
        await updateMutation.mutateAsync({
          id: productToEdit.id,
          name: name.trim(),
          sku: sku.trim().toUpperCase(),
          barcode: barcode.trim() || null,
          categoryId,
          brandId: brandId || null,
          unit,
          purchasePrice: Number(purchasePrice) || 0,
          sellingPrice: Number(sellingPrice),
          mrp: mrp ? Number(mrp) : undefined,
          taxRate: Number(taxRate),
          isTaxInclusive,
          minStockAlert: Number(minStockAlert) || 0,
          hasBatchTracking,
          isActive,
        });
      } else {
        await createMutation.mutateAsync({
          name: name.trim(),
          sku: sku.trim().toUpperCase(),
          barcode: barcode.trim() || undefined,
          categoryId,
          brandId: brandId || undefined,
          unit,
          purchasePrice: Number(purchasePrice) || 0,
          sellingPrice: Number(sellingPrice),
          mrp: mrp ? Number(mrp) : undefined,
          taxRate: Number(taxRate),
          isTaxInclusive,
          minStockAlert: Number(minStockAlert) || 0,
          initialOpeningStock: Number(initialOpeningStock) || 0,
          warehouseId: warehouseId || undefined,
          hasBatchTracking,
        });
      }
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to save product. Please check your inputs.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white border border-border rounded-[28px] w-full max-w-2xl shadow-elevated overflow-hidden animate-scale-up flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-border flex items-center justify-between bg-surface-subtle/50 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-coral-50 border border-coral-200/80 flex items-center justify-center">
              <Package className="w-4 h-4 text-coral-600" />
            </div>
            <div>
              <h3 className="text-base font-bold text-navy-950">
                {isEditing ? 'Edit Product' : 'Create New Product'}
              </h3>
              <p className="text-xs text-content-secondary">
                {isEditing ? 'Update catalog master details' : 'Add product to inventory catalog'}
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

        {/* Tab Navigation */}
        <div className="px-6 pt-3 border-b border-border flex items-center gap-6 bg-white shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('basic')}
            className={`pb-3 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition cursor-pointer ${
              activeTab === 'basic'
                ? 'border-coral-500 text-coral-600'
                : 'border-transparent text-content-secondary hover:text-navy-950'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>1. Basic Info</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('pricing')}
            className={`pb-3 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition cursor-pointer ${
              activeTab === 'pricing'
                ? 'border-coral-500 text-coral-600'
                : 'border-transparent text-content-secondary hover:text-navy-950'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>2. Pricing & Tax</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('stock')}
            className={`pb-3 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition cursor-pointer ${
              activeTab === 'stock'
                ? 'border-coral-500 text-coral-600'
                : 'border-transparent text-content-secondary hover:text-navy-950'
            }`}
          >
            <WarehouseIcon className="w-3.5 h-3.5" />
            <span>3. Stock & Warehouse</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {error && (
            <div className="p-3 bg-danger-50 border border-danger-200 text-danger-700 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* TAB 1: BASIC INFO */}
          {activeTab === 'basic' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-navy-950 mb-1">
                  Product Name <span className="text-danger-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Premium Basmati Rice 5kg"
                  className="form-input-warm w-full text-xs text-navy-950 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-navy-950 mb-1">
                    SKU Code <span className="text-danger-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={sku}
                    onChange={(e) => setSku(e.target.value.toUpperCase())}
                    placeholder="e.g. RICE-BAS-5K"
                    className="form-input-warm w-full text-xs text-navy-950 focus:outline-none font-mono uppercase"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-navy-950 mb-1">
                    Barcode / EAN <span className="text-content-muted font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={barcode}
                    onChange={(e) => setBarcode(e.target.value)}
                    placeholder="e.g. 8901234567890"
                    className="form-input-warm w-full text-xs text-navy-950 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-navy-950 mb-1">
                    Category <span className="text-danger-600">*</span>
                  </label>
                  <select
                    required
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="form-input-warm w-full text-xs text-navy-950 focus:outline-none cursor-pointer"
                  >
                    <option value="">Select Category</option>
                    {(categoriesData?.data || []).map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-navy-950 mb-1">
                    Brand <span className="text-content-muted font-normal">(Optional)</span>
                  </label>
                  <select
                    value={brandId}
                    onChange={(e) => setBrandId(e.target.value)}
                    className="form-input-warm w-full text-xs text-navy-950 focus:outline-none cursor-pointer"
                  >
                    <option value="">None / Generic</option>
                    {(brandsData?.data || []).map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-navy-950 mb-1">
                    Unit of Measurement <span className="text-danger-600">*</span>
                  </label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="form-input-warm w-full text-xs text-navy-950 focus:outline-none cursor-pointer"
                  >
                    {UNITS.map((u) => (
                      <option key={u.value} value={u.value}>
                        {u.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PRICING & TAX */}
          {activeTab === 'pricing' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-navy-950 mb-1">
                    Purchase Price (₹)
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

                <div>
                  <label className="block text-xs font-semibold text-navy-950 mb-1">
                    Selling Price (₹) <span className="text-danger-600">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={sellingPrice}
                    onChange={(e) => setSellingPrice(e.target.value)}
                    placeholder="0.00"
                    className="form-input-warm w-full text-xs text-navy-950 focus:outline-none tabular-nums font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-navy-950 mb-1">
                    MRP (₹) <span className="text-content-muted font-normal">(Optional)</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={mrp}
                    onChange={(e) => setMrp(e.target.value)}
                    placeholder="0.00"
                    className="form-input-warm w-full text-xs text-navy-950 focus:outline-none tabular-nums"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-navy-950 mb-1">
                    Applicable GST Slab
                  </label>
                  <select
                    value={taxRate}
                    onChange={(e) => setTaxRate(Number(e.target.value))}
                    className="form-input-warm w-full text-xs text-navy-950 focus:outline-none cursor-pointer"
                  >
                    {TAX_RATES.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isTaxInclusive}
                      onChange={(e) => setIsTaxInclusive(e.target.checked)}
                      className="w-4 h-4 rounded text-coral-500 focus:ring-coral-500 cursor-pointer"
                    />
                    <span className="text-xs font-medium text-navy-950">
                      Selling Price is Tax-Inclusive (MRP style)
                    </span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: STOCK & WAREHOUSE */}
          {activeTab === 'stock' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-navy-950 mb-1">
                    Low Stock Alert Threshold
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={minStockAlert}
                    onChange={(e) => setMinStockAlert(e.target.value)}
                    placeholder="5"
                    className="form-input-warm w-full text-xs text-navy-950 focus:outline-none tabular-nums"
                  />
                  <p className="text-[11px] text-content-muted mt-1">
                    Triggers low stock badge when total quantity reaches or falls below this.
                  </p>
                </div>

                {!isEditing && (
                  <div>
                    <label className="block text-xs font-semibold text-navy-950 mb-1">
                      Initial Opening Stock
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={initialOpeningStock}
                      onChange={(e) => setInitialOpeningStock(e.target.value)}
                      placeholder="0"
                      className="form-input-warm w-full text-xs text-navy-950 focus:outline-none tabular-nums"
                    />
                    <p className="text-[11px] text-content-muted mt-1">
                      Initial stock will be credited via an opening stock movement.
                    </p>
                  </div>
                )}
              </div>

              {!isEditing && Number(initialOpeningStock) > 0 && (
                <div>
                  <label className="block text-xs font-semibold text-navy-950 mb-1">
                    Target Warehouse for Opening Stock <span className="text-danger-600">*</span>
                  </label>
                  <select
                    value={warehouseId}
                    onChange={(e) => setWarehouseId(e.target.value)}
                    className="form-input-warm w-full text-xs text-navy-950 focus:outline-none cursor-pointer"
                  >
                    {(warehousesData || []).map((w) => (
                      <option key={w.id} value={w.id}>
                        {w.name} ({w.code}) {w.isDefault ? '• [Default]' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="pt-2 space-y-2 border-t border-border">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="hasBatchTracking"
                    checked={hasBatchTracking}
                    onChange={(e) => setHasBatchTracking(e.target.checked)}
                    className="w-4 h-4 rounded text-coral-500 focus:ring-coral-500 cursor-pointer"
                  />
                  <label htmlFor="hasBatchTracking" className="text-xs font-medium text-navy-950 cursor-pointer">
                    Enable Batch & Expiry Date tracking for this product (FMCG / Pharma)
                  </label>
                </div>

                {isEditing && (
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isActiveProd"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="w-4 h-4 rounded text-coral-500 focus:ring-coral-500 cursor-pointer"
                    />
                    <label htmlFor="isActiveProd" className="text-xs font-medium text-navy-950 cursor-pointer">
                      Product is active in catalog and POS billing
                    </label>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="pt-4 border-t border-border flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              {activeTab !== 'basic' && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (activeTab === 'stock') setActiveTab('pricing');
                    else if (activeTab === 'pricing') setActiveTab('basic');
                  }}
                >
                  Previous
                </Button>
              )}
              {activeTab !== 'stock' && (
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    if (activeTab === 'basic') setActiveTab('pricing');
                    else if (activeTab === 'pricing') setActiveTab('stock');
                  }}
                >
                  Next Tab
                </Button>
              )}
            </div>

            <div className="flex items-center gap-2.5">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={onClose}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="default"
                size="sm"
                isLoading={isPending}
              >
                {isEditing ? 'Save Changes' : 'Create Product'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
