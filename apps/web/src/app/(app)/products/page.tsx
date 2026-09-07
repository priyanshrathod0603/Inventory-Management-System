'use client';

import React, { useState } from 'react';
import { PageHeader } from '../../../components/layout/page-header';
import {
  Package,
  Plus,
  Search,
  Filter,
  Eye,
  Edit2,
  Trash2,
  AlertCircle,
  Sliders,
  Tag,
} from 'lucide-react';
import { useProducts, useDeleteProduct, Product } from '../../../hooks/use-products';
import { useCategories } from '../../../hooks/use-categories';
import { useBrands } from '../../../hooks/use-brands';
import { ProductFormModal } from '../../../components/products/product-form-modal';
import { ProductDetailsDrawer } from '../../../components/products/product-details-drawer';
import { StockAdjustmentModal } from '../../../components/inventory/stock-adjustment-modal';
import { BatchFormModal } from '../../../components/inventory/batch-form-modal';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';

export default function ProductsPage() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [stockStatus, setStockStatus] = useState<string>('ALL');

  // Modals & Drawer states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);

  const [selectedProductIdForDrawer, setSelectedProductIdForDrawer] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [isAdjustmentModalOpen, setIsAdjustmentModalOpen] = useState(false);
  const [productToAdjust, setProductToAdjust] = useState<Product | null>(null);

  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [productForBatch, setProductForBatch] = useState<Product | null>(null);

  // Queries
  const {
    data: response,
    isLoading,
    isError,
    error,
    refetch,
  } = useProducts({
    search: search.trim() || undefined,
    categoryId: selectedCategory || undefined,
    brandId: selectedBrand || undefined,
    stockStatus: stockStatus !== 'ALL' ? stockStatus : undefined,
    limit: 100,
  });

  const { data: categoriesData } = useCategories();
  const { data: brandsData } = useBrands();
  const deleteMutation = useDeleteProduct();

  const products = response?.data || [];

  const handleOpenCreate = () => {
    setProductToEdit(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setProductToEdit(product);
    setIsFormModalOpen(true);
  };

  const handleOpenDrawer = (productId: string) => {
    setSelectedProductIdForDrawer(productId);
    setIsDrawerOpen(true);
  };

  const handleOpenAdjustment = (product: Product) => {
    setProductToAdjust(product);
    setIsAdjustmentModalOpen(true);
  };

  const handleOpenBatch = (product: Product) => {
    setProductForBatch(product);
    setIsBatchModalOpen(true);
  };

  const handleDelete = async (product: Product) => {
    if (
      window.confirm(
        `Are you sure you want to delete "${product.name}" (${product.sku})? This product will be marked as deleted.`
      )
    ) {
      try {
        await deleteMutation.mutateAsync(product.id);
      } catch (err: any) {
        alert(err?.message || 'Failed to delete product.');
      }
    }
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
        title="Products Catalog"
        subtitle="Manage master product catalog, SKUs, barcode identifiers, pricing, and stock alerts."
        breadcrumbs={[{ label: 'Master Data' }, { label: 'Products' }]}
      >
        <button
          type="button"
          onClick={handleOpenCreate}
          className="pill-btn-coral h-9 px-4 text-white font-semibold text-xs rounded-full shadow-coral flex items-center gap-1.5 transition cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Product</span>
        </button>
      </PageHeader>

      {/* Filter and Control Bar */}
      <div className="bg-white border border-border rounded-[24px] shadow-card overflow-hidden">
        <div className="p-4 border-b border-border bg-surface-subtle/50 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5 flex-1">
            {/* Search Input */}
            <div className="relative min-w-[240px] max-w-sm">
              <Search className="w-4 h-4 text-content-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products by name, SKU or barcode..."
                className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-border rounded-full focus:outline-none focus:ring-2 focus:ring-coral-500/20 focus:border-coral-500 shadow-xs transition"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="py-2 px-3 text-xs bg-white border border-border rounded-full focus:outline-none focus:ring-2 focus:ring-coral-500/20 text-navy-950 cursor-pointer shadow-xs"
            >
              <option value="">All Categories</option>
              {(categoriesData?.data || []).map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>

            {/* Brand Filter */}
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="py-2 px-3 text-xs bg-white border border-border rounded-full focus:outline-none focus:ring-2 focus:ring-coral-500/20 text-navy-950 cursor-pointer shadow-xs"
            >
              <option value="">All Brands</option>
              {(brandsData?.data || []).map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>

            {/* Stock Status Filter */}
            <select
              value={stockStatus}
              onChange={(e) => setStockStatus(e.target.value)}
              className="py-2 px-3 text-xs bg-white border border-border rounded-full focus:outline-none focus:ring-2 focus:ring-coral-500/20 text-navy-950 cursor-pointer shadow-xs"
            >
              <option value="ALL">All Stock Statuses</option>
              <option value="IN_STOCK">In Stock Only</option>
              <option value="LOW_STOCK">Low Stock Alert</option>
              <option value="OUT_OF_STOCK">Out of Stock</option>
            </select>
          </div>

          <div className="text-xs text-content-secondary font-mono">
            {products.length} {products.length === 1 ? 'item' : 'items'} found
          </div>
        </div>

        {/* Content Table / Status */}
        {isLoading ? (
          <div className="p-16 text-center flex flex-col items-center justify-center space-y-3">
            <div className="w-8 h-8 rounded-full border-2 border-coral-500 border-t-transparent animate-spin" />
            <p className="text-xs text-content-secondary">Fetching product catalog...</p>
          </div>
        ) : isError ? (
          <div className="p-12 text-center flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-2xl bg-danger-50 border border-danger-200 flex items-center justify-center mb-3">
              <AlertCircle className="w-6 h-6 text-danger-600" />
            </div>
            <h3 className="text-sm font-bold text-navy-950 mb-1">Failed to load product catalog</h3>
            <p className="text-xs text-content-secondary mb-4">
              {(error as any)?.message || 'An error occurred while communicating with the server.'}
            </p>
            <Button variant="secondary" size="sm" onClick={() => refetch()}>
              Retry
            </Button>
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white p-16 text-center flex flex-col items-center justify-center">
            <div className="w-14 h-14 rounded-2xl bg-surface-subtle border border-border flex items-center justify-center mb-3.5 shadow-xs">
              <Package className="w-7 h-7 text-content-muted" />
            </div>
            <h3 className="text-base font-bold text-navy-950 mb-1">No Products Found</h3>
            <p className="text-xs text-content-secondary max-w-sm leading-relaxed mb-4">
              {search || selectedCategory || selectedBrand || stockStatus !== 'ALL'
                ? 'No products match your active search and filter criteria.'
                : 'Create your first product record to begin tracking inventory balances and pricing.'}
            </p>
            <button
              type="button"
              onClick={handleOpenCreate}
              className="pill-btn-coral h-9 px-4 text-white font-semibold text-xs rounded-full shadow-coral flex items-center gap-1.5 transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add First Product</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-surface-subtle/70 text-content-secondary border-b border-border">
                <tr>
                  <th className="py-3 px-4 font-semibold">Product & SKU</th>
                  <th className="py-3 px-4 font-semibold">Category / Brand</th>
                  <th className="py-3 px-4 font-semibold text-right">Selling Price</th>
                  <th className="py-3 px-4 font-semibold text-right">MRP</th>
                  <th className="py-3 px-4 font-semibold text-right">Available Stock</th>
                  <th className="py-3 px-4 font-semibold text-center">Status</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-surface-subtle/30 transition">
                    <td className="py-3 px-4">
                      <div className="flex items-start gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-coral-50 border border-coral-200/80 flex items-center justify-center shrink-0 mt-0.5">
                          <Package className="w-4 h-4 text-coral-600" />
                        </div>
                        <div>
                          <button
                            type="button"
                            onClick={() => handleOpenDrawer(product.id)}
                            className="font-bold text-navy-950 hover:text-coral-600 transition text-left cursor-pointer"
                          >
                            {product.name}
                          </button>
                          <div className="flex items-center gap-2 text-[11px] text-content-muted font-mono mt-0.5">
                            <span>SKU: {product.sku}</span>
                            {product.barcode && <span>• Barcode: {product.barcode}</span>}
                            {product.hasBatchTracking && (
                              <span className="text-coral-600 font-semibold">• Batch Tracked</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-content-secondary">
                      <div className="font-medium text-navy-900">{product.category?.name || 'Uncategorized'}</div>
                      <div className="text-[11px] text-content-muted">{product.brand?.name || 'Generic'}</div>
                    </td>

                    <td className="py-3 px-4 text-right font-mono font-bold text-navy-950">
                      ₹{Number(product.sellingPrice).toFixed(2)}
                      <span className="text-[10px] text-content-muted block font-normal font-sans">
                        {product.isTaxInclusive ? 'Incl. Tax' : `+${product.taxRate}% GST`}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right font-mono text-content-secondary">
                      {product.mrp ? `₹${Number(product.mrp).toFixed(2)}` : '—'}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <span className="font-mono font-bold text-navy-950 text-sm">
                        {Number(product.currentStock)}
                      </span>
                      <span className="text-[11px] text-content-muted ml-1 font-sans">
                        {product.unit}
                      </span>
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
                          title="View Details & Warehouse Breakdown"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenAdjustment(product)}
                          className="p-1.5 text-content-muted hover:text-navy-950 hover:bg-surface-subtle rounded-lg transition cursor-pointer"
                          title="Adjust Stock Balance"
                        >
                          <Sliders className="w-3.5 h-3.5" />
                        </button>
                        {product.hasBatchTracking && (
                          <button
                            type="button"
                            onClick={() => handleOpenBatch(product)}
                            className="p-1.5 text-content-muted hover:text-navy-950 hover:bg-surface-subtle rounded-lg transition cursor-pointer"
                            title="Add Product Batch"
                          >
                            <Tag className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(product)}
                          className="p-1.5 text-content-muted hover:text-navy-950 hover:bg-surface-subtle rounded-lg transition cursor-pointer"
                          title="Edit Product Master"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(product)}
                          disabled={deleteMutation.isPending}
                          className="p-1.5 text-content-muted hover:text-danger-600 hover:bg-danger-50 rounded-lg transition cursor-pointer"
                          title="Delete Product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Product Create / Edit Modal */}
      <ProductFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        productToEdit={productToEdit}
      />

      {/* Product Details Drawer */}
      <ProductDetailsDrawer
        productId={selectedProductIdForDrawer}
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setSelectedProductIdForDrawer(null);
        }}
        onEdit={(prod) => handleOpenEdit(prod)}
        onAdjustStock={(prod) => handleOpenAdjustment(prod)}
        onAddBatch={(prod) => handleOpenBatch(prod)}
      />

      {/* Stock Adjustment Modal */}
      <StockAdjustmentModal
        isOpen={isAdjustmentModalOpen}
        onClose={() => {
          setIsAdjustmentModalOpen(false);
          setProductToAdjust(null);
        }}
        preselectedProduct={productToAdjust}
      />

      {/* Batch Form Modal */}
      <BatchFormModal
        isOpen={isBatchModalOpen}
        onClose={() => {
          setIsBatchModalOpen(false);
          setProductForBatch(null);
        }}
        preselectedProduct={productForBatch}
      />
    </div>
  );
}
