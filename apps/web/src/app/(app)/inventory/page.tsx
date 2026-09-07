'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PageHeader } from '../../../components/layout/page-header';
import {
  Boxes,
  Plus,
  Search,
  Sliders,
  AlertCircle,
  Eye,
  Warehouse as WarehouseIcon,
} from 'lucide-react';
import { useInventoryOverview } from '../../../hooks/use-inventory';
import { useWarehouses } from '../../../hooks/use-warehouses';
import { useCategories } from '../../../hooks/use-categories';
import { Product } from '../../../hooks/use-products';
import { StockAdjustmentModal } from '../../../components/inventory/stock-adjustment-modal';
import { ProductDetailsDrawer } from '../../../components/products/product-details-drawer';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';

export default function InventoryPage() {
  const [activeTab, setActiveTab] = useState<'ALL' | 'LOW_STOCK' | 'OUT_OF_STOCK'>('ALL');
  const [search, setSearch] = useState('');
  const [selectedWarehouse, setSelectedWarehouse] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Modals & Drawer
  const [isAdjustmentModalOpen, setIsAdjustmentModalOpen] = useState(false);
  const [productToAdjust, setProductToAdjust] = useState<Product | null>(null);

  const [selectedProductIdForDrawer, setSelectedProductIdForDrawer] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Queries
  const { data: response, isLoading, isError, error, refetch } = useInventoryOverview({
    search: search.trim() || undefined,
    warehouseId: selectedWarehouse || undefined,
    categoryId: selectedCategory || undefined,
    stockStatus: activeTab !== 'ALL' ? activeTab : undefined,
    limit: 100,
  });

  const { data: warehousesData } = useWarehouses();
  const { data: categoriesData } = useCategories();

  const summary = response?.data?.summary || {
    totalValuationCost: 0,
    totalValuationRetail: 0,
    totalUnits: 0,
    lowStockCount: 0,
    outOfStockCount: 0,
    totalProductsCount: 0,
  };

  const products = response?.data?.products || [];

  const handleOpenAdjustment = (product: Product) => {
    setProductToAdjust(product);
    setIsAdjustmentModalOpen(true);
  };

  const handleOpenDrawer = (productId: string) => {
    setSelectedProductIdForDrawer(productId);
    setIsDrawerOpen(true);
  };

  const renderStockBadge = (status: string) => {
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

  return (
    <div className="space-y-6">
      <PageHeader
        title="Inventory Valuation & Stock"
        subtitle="Real-time multi-warehouse inventory levels, financial valuation, and stock alerts."
        breadcrumbs={[{ label: 'Inventory' }, { label: 'Stock Valuation' }]}
      >
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => handleOpenAdjustment(products[0] || null)}
            className="h-9 px-4 bg-white border border-border rounded-full text-xs font-semibold text-content-secondary hover:text-navy-950 hover:bg-surface-subtle flex items-center gap-2 shadow-xs transition cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5 text-content-muted" />
            <span>Stock Adjustment</span>
          </button>
          <Link
            href="/products"
            className="pill-btn-coral h-9 px-4 text-white font-semibold text-xs rounded-full shadow-coral flex items-center gap-1.5 transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Product</span>
          </Link>
        </div>
      </PageHeader>

      {/* Valuation Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-border rounded-[20px] p-5 shadow-card">
          <span className="text-[10px] font-extrabold text-content-muted uppercase tracking-wider block mb-1">
            Total Inventory Valuation (Cost)
          </span>
          <div className="text-2xl font-black text-navy-950 tabular-nums font-mono">
            ₹{Number(summary.totalValuationCost).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-content-secondary mt-1">Asset balance at weighted purchase cost</p>
        </div>

        <div className="bg-white border border-border rounded-[20px] p-5 shadow-card">
          <span className="text-[10px] font-extrabold text-content-muted uppercase tracking-wider block mb-1">
            Total Retail Potential (Selling)
          </span>
          <div className="text-2xl font-black text-coral-600 tabular-nums font-mono">
            ₹{Number(summary.totalValuationRetail).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-content-secondary mt-1">Projected revenue at active selling price</p>
        </div>

        <div className="bg-white border border-border rounded-[20px] p-5 shadow-card">
          <span className="text-[10px] font-extrabold text-content-muted uppercase tracking-wider block mb-1">
            Total Stock Quantity
          </span>
          <div className="text-2xl font-black text-navy-950 tabular-nums font-mono">
            {Number(summary.totalUnits).toLocaleString()} Units
          </div>
          <p className="text-xs text-content-secondary mt-1">
            Across {warehousesData?.length || 1} storage {(warehousesData?.length || 1) === 1 ? 'facility' : 'facilities'}
          </p>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white border border-border rounded-[24px] shadow-card overflow-hidden">
        {/* Filter Bar & Tabs */}
        <div className="p-4 border-b border-border bg-surface-subtle/50 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab('ALL')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                activeTab === 'ALL'
                  ? 'bg-coral-500 text-white shadow-xs'
                  : 'bg-white border border-border text-content-secondary hover:text-navy-950 hover:bg-surface-subtle'
              }`}
            >
              All Items ({summary.totalProductsCount})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('LOW_STOCK')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                activeTab === 'LOW_STOCK'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-white border border-border text-content-secondary hover:text-navy-950 hover:bg-surface-subtle'
              }`}
            >
              Low Stock Alert ({summary.lowStockCount})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('OUT_OF_STOCK')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                activeTab === 'OUT_OF_STOCK'
                  ? 'bg-rose-500 text-white shadow-xs'
                  : 'bg-white border border-border text-content-secondary hover:text-navy-950 hover:bg-surface-subtle'
              }`}
            >
              Out of Stock ({summary.outOfStockCount})
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative min-w-[200px]">
              <Search className="w-3.5 h-3.5 text-content-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search stock, SKU..."
                className="pl-8 pr-3.5 py-1.5 bg-white border border-border rounded-full text-xs text-navy-950 placeholder:text-content-muted focus:outline-none focus:ring-2 focus:ring-coral-500/20 focus:border-coral-500 shadow-xs"
              />
            </div>

            {/* Warehouse Filter */}
            <select
              value={selectedWarehouse}
              onChange={(e) => setSelectedWarehouse(e.target.value)}
              className="py-1.5 px-3 text-xs bg-white border border-border rounded-full focus:outline-none focus:ring-2 focus:ring-coral-500/20 text-navy-950 cursor-pointer shadow-xs"
            >
              <option value="">All Warehouses</option>
              {(warehousesData || []).map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name} ({w.code})
                </option>
              ))}
            </select>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="py-1.5 px-3 text-xs bg-white border border-border rounded-full focus:outline-none focus:ring-2 focus:ring-coral-500/20 text-navy-950 cursor-pointer shadow-xs"
            >
              <option value="">All Categories</option>
              {(categoriesData?.data || []).map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Content Table / Status */}
        {isLoading ? (
          <div className="p-16 text-center flex flex-col items-center justify-center space-y-3">
            <div className="w-8 h-8 rounded-full border-2 border-coral-500 border-t-transparent animate-spin" />
            <p className="text-xs text-content-secondary">Calculating inventory valuation balances...</p>
          </div>
        ) : isError ? (
          <div className="p-12 text-center flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-2xl bg-danger-50 border border-danger-200 flex items-center justify-center mb-3">
              <AlertCircle className="w-6 h-6 text-danger-600" />
            </div>
            <h3 className="text-sm font-bold text-navy-950 mb-1">Failed to load inventory valuation</h3>
            <p className="text-xs text-content-secondary mb-4">
              {(error as any)?.message || 'An error occurred while communicating with the server.'}
            </p>
            <Button variant="secondary" size="sm" onClick={() => refetch()}>
              Retry
            </Button>
          </div>
        ) : products.length === 0 ? (
          <div className="py-16 text-center text-content-secondary flex flex-col items-center justify-center p-6">
            <div className="w-14 h-14 rounded-2xl bg-surface-subtle border border-border flex items-center justify-center mb-3.5 shadow-xs">
              <Boxes className="w-7 h-7 text-content-muted" />
            </div>
            <h3 className="text-sm font-bold text-navy-950 mb-1">No Inventory Items Found</h3>
            <p className="text-xs text-content-secondary max-w-sm mb-4 leading-relaxed">
              {search || selectedWarehouse || selectedCategory || activeTab !== 'ALL'
                ? 'No inventory records match your selected filter criteria.'
                : 'Stock movements, inward shipments, and product inventory records will appear in this ledger.'}
            </p>
            <Link
              href="/products"
              className="pill-btn-coral h-9 px-4 text-white font-semibold text-xs rounded-full shadow-coral transition flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create First Product</span>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-surface-subtle/70 text-content-secondary border-b border-border">
                <tr>
                  <th className="py-3 px-4 font-semibold">Product & SKU</th>
                  <th className="py-3 px-4 font-semibold text-right">Available Stock</th>
                  <th className="py-3 px-4 font-semibold text-right">Cost Price</th>
                  <th className="py-3 px-4 font-semibold text-right">Valuation (Cost)</th>
                  <th className="py-3 px-4 font-semibold text-right">Retail Potential</th>
                  <th className="py-3 px-4 font-semibold text-center">Status</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {products.map((product) => {
                  const stock = Number(product.currentStock);
                  const cost = Number(product.purchasePrice);
                  const sell = Number(product.sellingPrice);
                  const totalCostVal = stock * cost;
                  const totalSellVal = stock * sell;

                  return (
                    <tr key={product.id} className="hover:bg-surface-subtle/30 transition">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenDrawer(product.id)}
                            className="font-bold text-navy-950 hover:text-coral-600 transition text-left cursor-pointer"
                          >
                            {product.name}
                          </button>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-content-muted font-mono mt-0.5">
                          <span>SKU: {product.sku}</span>
                          <span>• Category: {product.category?.name || '---'}</span>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <span className="font-mono font-bold text-navy-950 text-sm">
                          {stock}
                        </span>
                        <span className="text-[11px] text-content-muted ml-1 font-sans">
                          {product.unit}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right font-mono text-content-secondary">
                        ₹{cost.toFixed(2)}
                      </td>

                      <td className="py-3 px-4 text-right font-mono font-semibold text-navy-950">
                        ₹{totalCostVal.toFixed(2)}
                      </td>

                      <td className="py-3 px-4 text-right font-mono font-bold text-coral-600">
                        ₹{totalSellVal.toFixed(2)}
                      </td>

                      <td className="py-3 px-4 text-center">
                        {renderStockBadge(product.stockStatus)}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => handleOpenDrawer(product.id)}
                            className="p-1.5 text-content-muted hover:text-coral-600 hover:bg-coral-50 rounded-lg transition cursor-pointer"
                            title="View Stock Breakdown"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenAdjustment(product)}
                            className="p-1.5 text-content-muted hover:text-navy-950 hover:bg-surface-subtle rounded-lg transition cursor-pointer"
                            title="Record Adjustment"
                          >
                            <Sliders className="w-3.5 h-3.5" />
                          </button>
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

      {/* Stock Adjustment Modal */}
      <StockAdjustmentModal
        isOpen={isAdjustmentModalOpen}
        onClose={() => {
          setIsAdjustmentModalOpen(false);
          setProductToAdjust(null);
        }}
        preselectedProduct={productToAdjust}
        preselectedWarehouseId={selectedWarehouse}
      />

      {/* Product Details Drawer */}
      <ProductDetailsDrawer
        productId={selectedProductIdForDrawer}
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setSelectedProductIdForDrawer(null);
        }}
        onAdjustStock={(prod) => handleOpenAdjustment(prod)}
      />
    </div>
  );
}
