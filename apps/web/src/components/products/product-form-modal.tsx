'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Package,
  Sparkles,
  Sliders,
  ChevronDown,
  AlertCircle,
  TrendingUp,
  CheckCircle2,
} from 'lucide-react';
import { Product, useCreateProduct, useUpdateProduct } from '../../hooks/use-products';
import { useCategories } from '../../hooks/use-categories';
import { useBrands } from '../../hooks/use-brands';
import { useWarehouses } from '../../hooks/use-warehouses';
import { useBusinessProfile } from '../../hooks/use-business-profile';
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
  { value: 'PAIR', label: 'Pair (PAIR)' },
  { value: 'SET', label: 'Set (SET)' },
];

const TAX_RATES = [
  { value: 0, label: '0% (Exempt / Nil)' },
  { value: 5, label: '5% (GST 5%)' },
  { value: 12, label: '12% (GST 12%)' },
  { value: 18, label: '18% (GST 18%)' },
  { value: 28, label: '28% (GST 28%)' },
];

export function ProductFormModal({ isOpen, onClose, productToEdit }: ProductFormModalProps) {
  const [error, setError] = useState<string | null>(null);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  // Section 1: Basic Information
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [brandId, setBrandId] = useState('');
  const [unit, setUnit] = useState('PCS');

  // Section 2: Pricing & Tax
  const [purchasePrice, setPurchasePrice] = useState<string>('0');
  const [sellingPrice, setSellingPrice] = useState<string>('');
  const [mrp, setMrp] = useState<string>('');
  const [taxRate, setTaxRate] = useState<number>(0);
  const [isTaxInclusive, setIsTaxInclusive] = useState(false);

  // Section 3: Inventory & Stock
  const [minStockAlert, setMinStockAlert] = useState<string>('5');
  const [initialOpeningStock, setInitialOpeningStock] = useState<string>('0');
  const [warehouseId, setWarehouseId] = useState('');

  // Section 4: Advanced Options
  const [barcode, setBarcode] = useState('');
  const [hasBatchTracking, setHasBatchTracking] = useState(false);
  const [isActive, setIsActive] = useState(true);

  // Reference queries
  const { data: profileData } = useBusinessProfile();
  const { data: categoriesData } = useCategories();
  const { data: brandsData } = useBrands();
  const { data: warehousesData } = useWarehouses();

  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();

  const isEditing = Boolean(productToEdit);
  const isPending = createMutation.isPending || updateMutation.isPending;
  const currencySymbol = profileData?.profile?.currencySymbol || '₹';

  // Handle Escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isPending) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isPending, onClose]);

  const handleGenerateSku = () => {
    const rawName = name.trim();
    if (!rawName) {
      setSku(`SKU-${Math.floor(100000 + Math.random() * 900000)}`);
      return;
    }
    const words = rawName.split(/[^a-zA-Z0-9]+/).filter(Boolean);
    const prefix = words
      .map((w) => w.slice(0, 3).toUpperCase())
      .slice(0, 2)
      .join('-');
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    setSku(`${prefix || 'ITEM'}-${randomSuffix}`);
  };

  const pPrice = Number(purchasePrice) || 0;
  const sPrice = Number(sellingPrice) || 0;
  const marginAmt = sPrice > 0 ? sPrice - pPrice : 0;
  const marginPct = sPrice > 0 ? ((marginAmt / sPrice) * 100).toFixed(1) : '0.0';

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

      // Open advanced section automatically if existing product has advanced configs
      if (productToEdit.barcode || productToEdit.hasBatchTracking) {
        setIsAdvancedOpen(true);
      } else {
        setIsAdvancedOpen(false);
      }
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
      setIsAdvancedOpen(false);
    }
    setError(null);
  }, [productToEdit, isOpen, categoriesData, warehousesData]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Product name is required.');
      return;
    }
    if (!sku.trim()) {
      setError('SKU code is required.');
      return;
    }
    if (!categoryId) {
      setError('Please select a product category.');
      return;
    }
    if (!sellingPrice || Number(sellingPrice) < 0) {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-navy-950/40 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white border border-[#EAE5E0] rounded-[28px] w-full max-w-3xl shadow-[0_24px_60px_-12px_rgba(20,20,20,0.12),0_4px_16px_-2px_rgba(20,20,20,0.04)] overflow-hidden flex flex-col max-h-[92vh] animate-scaleUp">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#EAE5E0] flex items-center justify-between bg-surface-subtle/40 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-coral-50 border border-coral-200/80 flex items-center justify-center text-coral-600 shadow-sm shadow-coral-500/10">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-navy-950 tracking-tight">
                {isEditing ? 'Edit Product' : 'Add New Product'}
              </h3>
              <p className="text-xs text-content-secondary mt-0.5">
                {isEditing
                  ? 'Update catalog master details & configuration'
                  : 'Add a new product to your inventory catalog'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="w-8 h-8 rounded-full flex items-center justify-center text-navy-400 hover:text-navy-950 hover:bg-surface-muted transition-colors cursor-pointer disabled:opacity-50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-7">
          {error && (
            <div className="p-4 bg-danger-50 border border-danger-200 text-danger-800 rounded-2xl text-xs flex items-center gap-3 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-danger-600 shrink-0" />
              <span className="font-medium">{error}</span>
            </div>
          )}

          {/* SECTION 1: BASIC INFORMATION */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-1.5 border-b border-[#EAE5E0]">
              <span className="text-[11px] font-bold uppercase tracking-wider text-navy-800">
                1. Basic Information
              </span>
            </div>

            {/* Product Name */}
            <div>
              <label className="block text-xs font-bold text-navy-900 mb-1.5">
                Product Name <span className="text-coral-600">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Premium Basmati Rice 5kg, Classic Cotton T-Shirt"
                className="w-full h-11 px-3.5 rounded-xl border border-border bg-white text-sm text-navy-950 placeholder:text-navy-400 focus:outline-none focus:ring-2 focus:ring-coral-500/20 focus:border-coral-500 transition-colors"
              />
            </div>

            {/* SKU Code */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-navy-900">
                  SKU Code <span className="text-coral-600">*</span>
                </label>
                <button
                  type="button"
                  onClick={handleGenerateSku}
                  className="text-xs text-coral-600 hover:text-coral-700 font-bold flex items-center gap-1 hover:underline cursor-pointer transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Generate SKU</span>
                </button>
              </div>
              <input
                type="text"
                required
                value={sku}
                onChange={(e) => setSku(e.target.value.toUpperCase())}
                placeholder="e.g., RICE-BAS-5K"
                className="w-full h-11 px-3.5 rounded-xl border border-border bg-white text-sm font-mono uppercase text-navy-950 placeholder:text-navy-400 focus:outline-none focus:ring-2 focus:ring-coral-500/20 focus:border-coral-500 transition-colors"
              />
            </div>

            {/* Category, Brand & Unit */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-navy-900 mb-1.5">
                  Category <span className="text-coral-600">*</span>
                </label>
                <select
                  required
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl border border-border bg-white text-sm text-navy-950 focus:outline-none focus:ring-2 focus:ring-coral-500/20 focus:border-coral-500 transition-colors cursor-pointer"
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
                <label className="block text-xs font-bold text-navy-900 mb-1.5">
                  Brand <span className="text-navy-400 font-normal">(Optional)</span>
                </label>
                <select
                  value={brandId}
                  onChange={(e) => setBrandId(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl border border-border bg-white text-sm text-navy-950 focus:outline-none focus:ring-2 focus:ring-coral-500/20 focus:border-coral-500 transition-colors cursor-pointer"
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
                <label className="block text-xs font-bold text-navy-900 mb-1.5">
                  Unit of Measurement <span className="text-coral-600">*</span>
                </label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl border border-border bg-white text-sm text-navy-950 focus:outline-none focus:ring-2 focus:ring-coral-500/20 focus:border-coral-500 transition-colors cursor-pointer"
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

          {/* SECTION 2: PRICING & TAX */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-1.5 border-b border-[#EAE5E0]">
              <span className="text-[11px] font-bold uppercase tracking-wider text-navy-800">
                2. Pricing & Tax
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-navy-900 mb-1.5">
                  Purchase Price ({currencySymbol})
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-400 font-medium text-xs">
                    {currencySymbol}
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={purchasePrice}
                    onChange={(e) => setPurchasePrice(e.target.value)}
                    placeholder="0.00"
                    className="w-full h-11 pl-8 pr-3.5 rounded-xl border border-border bg-white text-sm text-navy-950 placeholder:text-navy-400 focus:outline-none focus:ring-2 focus:ring-coral-500/20 focus:border-coral-500 transition-colors tabular-nums"
                  />
                </div>
                <p className="text-[11px] text-navy-500 mt-1">Cost price paid to supplier</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-900 mb-1.5">
                  Selling Price ({currencySymbol}) <span className="text-coral-600">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-coral-600 font-bold text-xs">
                    {currencySymbol}
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={sellingPrice}
                    onChange={(e) => setSellingPrice(e.target.value)}
                    placeholder="0.00"
                    className="w-full h-11 pl-8 pr-3.5 rounded-xl border border-border bg-white text-sm font-semibold text-navy-950 placeholder:text-navy-400 focus:outline-none focus:ring-2 focus:ring-coral-500/20 focus:border-coral-500 transition-colors tabular-nums"
                  />
                </div>
                <p className="text-[11px] text-navy-500 mt-1">Base price for customer billing</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-900 mb-1.5">
                  MRP ({currencySymbol}) <span className="text-navy-400 font-normal">(Optional)</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-400 font-medium text-xs">
                    {currencySymbol}
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={mrp}
                    onChange={(e) => setMrp(e.target.value)}
                    placeholder="0.00"
                    className="w-full h-11 pl-8 pr-3.5 rounded-xl border border-border bg-white text-sm text-navy-950 placeholder:text-navy-400 focus:outline-none focus:ring-2 focus:ring-coral-500/20 focus:border-coral-500 transition-colors tabular-nums"
                  />
                </div>
                <p className="text-[11px] text-navy-500 mt-1">Printed maximum retail price</p>
              </div>
            </div>

            {/* Compact Real-time Profit & Margin Card */}
            <div className="p-4 bg-[#FCF9F6] border border-[#EAE5E0] rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-surface flex items-center justify-center text-navy-700 border border-border shrink-0">
                  <TrendingUp className="w-4 h-4 text-coral-600" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-navy-700 block">
                    Estimated Gross Profit
                  </span>
                  <strong
                    className={`font-mono font-bold text-base ${
                      marginAmt >= 0 ? 'text-emerald-700' : 'text-rose-600'
                    }`}
                  >
                    {currencySymbol}
                    {marginAmt.toFixed(2)}
                    <span className="text-xs font-normal text-navy-500 ml-1">/ unit</span>
                  </strong>
                </div>
              </div>

              <div className="flex items-center sm:text-right gap-2 sm:flex-col sm:items-end">
                <span className="text-[11px] font-medium text-navy-500">Gross Margin:</span>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono font-bold ${
                    Number(marginPct) > 0
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-surface-subtle text-navy-600 border border-border'
                  }`}
                >
                  {marginPct}%
                </span>
              </div>
            </div>

            {/* Tax Settings */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center pt-1">
              <div>
                <label className="block text-xs font-bold text-navy-900 mb-1.5">
                  Applicable Tax Rate
                </label>
                <select
                  value={taxRate}
                  onChange={(e) => setTaxRate(Number(e.target.value))}
                  className="w-full h-11 px-3 rounded-xl border border-border bg-white text-sm text-navy-950 focus:outline-none focus:ring-2 focus:ring-coral-500/20 focus:border-coral-500 transition-colors cursor-pointer"
                >
                  {TAX_RATES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:pt-6">
                <label
                  onClick={() => setIsTaxInclusive(!isTaxInclusive)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                    isTaxInclusive
                      ? 'border-coral-500 bg-coral-50/40 ring-1 ring-coral-500/20'
                      : 'border-border bg-white hover:border-coral-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-4 h-4 rounded flex items-center justify-center transition-colors ${
                        isTaxInclusive ? 'bg-coral-500 text-white' : 'border border-border bg-white'
                      }`}
                    >
                      {isTaxInclusive && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-navy-950">Price Includes Tax</h4>
                      <p className="text-[11px] text-navy-500">MRP billing style</p>
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* SECTION 3: INVENTORY & STOCK */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-1.5 border-b border-[#EAE5E0]">
              <span className="text-[11px] font-bold uppercase tracking-wider text-navy-800">
                3. Inventory & Stock
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-navy-900 mb-1.5">
                  Minimum Stock Alert
                </label>
                <input
                  type="number"
                  min="0"
                  value={minStockAlert}
                  onChange={(e) => setMinStockAlert(e.target.value)}
                  placeholder="5"
                  className="w-full h-11 px-3.5 rounded-xl border border-border bg-white text-sm text-navy-950 placeholder:text-navy-400 focus:outline-none focus:ring-2 focus:ring-coral-500/20 focus:border-coral-500 transition-colors tabular-nums"
                />
                <p className="text-[11px] text-navy-500 mt-1">
                  Triggers low stock badge when quantity falls below this threshold.
                </p>
              </div>

              {!isEditing && (
                <div>
                  <label className="block text-xs font-bold text-navy-900 mb-1.5">
                    Opening Stock <span className="text-navy-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={initialOpeningStock}
                    onChange={(e) => setInitialOpeningStock(e.target.value)}
                    placeholder="0"
                    className="w-full h-11 px-3.5 rounded-xl border border-border bg-white text-sm text-navy-950 placeholder:text-navy-400 focus:outline-none focus:ring-2 focus:ring-coral-500/20 focus:border-coral-500 transition-colors tabular-nums"
                  />
                  <p className="text-[11px] text-navy-500 mt-1">
                    Initial quantity available when this product is added.
                  </p>
                </div>
              )}
            </div>

            {!isEditing && Number(initialOpeningStock) > 0 && (
              <div className="animate-fadeIn">
                <label className="block text-xs font-bold text-navy-900 mb-1.5">
                  Target Warehouse for Opening Stock <span className="text-coral-600">*</span>
                </label>
                <select
                  value={warehouseId}
                  onChange={(e) => setWarehouseId(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl border border-border bg-white text-sm text-navy-950 focus:outline-none focus:ring-2 focus:ring-coral-500/20 focus:border-coral-500 transition-colors cursor-pointer"
                >
                  {(warehousesData || []).map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.name} ({w.code}) {w.isDefault ? '• [Default]' : ''}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-navy-500 mt-1">
                  Select where this opening inventory will be stored.
                </p>
              </div>
            )}
          </div>

          {/* SECTION 4: ADVANCED OPTIONS (ACCORDION) */}
          <div className="border border-[#EAE5E0] rounded-2xl overflow-hidden transition-all bg-surface-subtle/20">
            <button
              type="button"
              onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
              className="w-full p-4 flex items-center justify-between text-left hover:bg-surface-subtle/60 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Sliders className="w-4 h-4 text-coral-600" />
                <div>
                  <h4 className="text-xs font-bold text-navy-950">Advanced Options</h4>
                  <p className="text-[11px] text-navy-500">
                    Barcode identifiers, batch tracking, catalog visibility
                  </p>
                </div>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-navy-400 transition-transform duration-200 ${
                  isAdvancedOpen ? 'rotate-180' : 'rotate-0'
                }`}
              />
            </button>

            {isAdvancedOpen && (
              <div className="p-4 pt-2 border-t border-[#EAE5E0] space-y-4 animate-fadeIn">
                {/* Barcode */}
                <div>
                  <label className="block text-xs font-bold text-navy-900 mb-1.5">
                    Barcode / EAN <span className="text-navy-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={barcode}
                    onChange={(e) => setBarcode(e.target.value)}
                    placeholder="e.g., 8901234567890"
                    className="w-full h-11 px-3.5 rounded-xl border border-border bg-white text-sm font-mono text-navy-950 placeholder:text-navy-400 focus:outline-none focus:ring-2 focus:ring-coral-500/20 focus:border-coral-500 transition-colors"
                  />
                  <p className="text-[11px] text-navy-500 mt-1">
                    Standard 12 or 13-digit barcode for scanner integration.
                  </p>
                </div>

                {/* Batch Tracking Toggle */}
                <div
                  onClick={() => setHasBatchTracking(!hasBatchTracking)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                    hasBatchTracking
                      ? 'border-coral-500 bg-coral-50/40 ring-1 ring-coral-500/20'
                      : 'border-border bg-white hover:border-coral-200'
                  }`}
                >
                  <div>
                    <h5 className="text-xs font-bold text-navy-950">
                      Batch & Expiry Date Tracking
                    </h5>
                    <p className="text-[11px] text-navy-500">
                      Enable batch numbers, manufacturing dates, and expiry tracking (ideal for
                      food, pharma, FMCG)
                    </p>
                  </div>
                  <div
                    className={`w-10 h-5 rounded-full p-0.5 transition-colors shrink-0 ml-3 ${
                      hasBatchTracking ? 'bg-coral-500' : 'bg-surface-muted'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white transition-transform ${
                        hasBatchTracking ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </div>
                </div>

                {/* Active in Catalog (When editing) */}
                {isEditing && (
                  <div
                    onClick={() => setIsActive(!isActive)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                      isActive
                        ? 'border-coral-500 bg-coral-50/40 ring-1 ring-coral-500/20'
                        : 'border-border bg-white hover:border-coral-200'
                    }`}
                  >
                    <div>
                      <h5 className="text-xs font-bold text-navy-950">Active Catalog Status</h5>
                      <p className="text-[11px] text-navy-500">
                        Product is active in catalog and selectable in POS billing
                      </p>
                    </div>
                    <div
                      className={`w-10 h-5 rounded-full p-0.5 transition-colors shrink-0 ml-3 ${
                        isActive ? 'bg-coral-500' : 'bg-surface-muted'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full bg-white transition-transform ${
                          isActive ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </form>

        {/* Sticky Action Footer */}
        <div className="px-6 py-4 border-t border-[#EAE5E0] bg-white flex items-center justify-between shrink-0">
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
            type="button"
            variant="default"
            size="default"
            onClick={handleSubmit}
            isLoading={isPending}
            className="bg-coral-500 hover:bg-coral-600 text-white font-bold px-6 shadow-md shadow-coral-500/25 cursor-pointer"
          >
            {isEditing ? 'Save Changes' : 'Create Product'}
          </Button>
        </div>
      </div>
    </div>
  );
}
