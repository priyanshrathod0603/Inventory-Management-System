'use client';

import React, { useState } from 'react';
import { PageHeader } from '../../../components/layout/page-header';
import { Award, Plus, Search, Edit2, Trash2, AlertCircle } from 'lucide-react';
import { useBrands, useDeleteBrand, Brand } from '../../../hooks/use-brands';
import { BrandFormModal } from '../../../components/brands/brand-form-modal';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';

export default function BrandsPage() {
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [brandToEdit, setBrandToEdit] = useState<Brand | null>(null);

  const { data: response, isLoading, isError, error, refetch } = useBrands({
    search: search.trim() || undefined,
  });
  const deleteMutation = useDeleteBrand();

  const brands = response?.data || [];

  const handleOpenCreate = () => {
    setBrandToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (brand: Brand) => {
    setBrandToEdit(brand);
    setIsModalOpen(true);
  };

  const handleDelete = async (brand: Brand) => {
    if (
      window.confirm(
        `Are you sure you want to delete brand "${brand.name}"? This action cannot be undone.`
      )
    ) {
      try {
        await deleteMutation.mutateAsync(brand.id);
      } catch (err: any) {
        alert(err?.message || 'Failed to delete brand.');
      }
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Product Brands"
        subtitle="Manage product manufacturer brands and supplier associations."
        breadcrumbs={[{ label: 'Master Data' }, { label: 'Brands' }]}
      >
        <button
          type="button"
          onClick={handleOpenCreate}
          className="pill-btn-coral h-9 px-4 text-white font-semibold text-xs rounded-full shadow-coral flex items-center gap-1.5 transition cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Brand</span>
        </button>
      </PageHeader>

      {/* Filter / Search Bar */}
      <div className="bg-white border border-border rounded-[24px] shadow-card overflow-hidden">
        <div className="p-4 border-b border-border bg-surface-subtle/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-content-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search brands by name or description..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-border rounded-full focus:outline-none focus:ring-2 focus:ring-coral-500/20 focus:border-coral-500 shadow-xs transition"
            />
          </div>
          <div className="text-xs text-content-secondary font-mono">
            {brands.length} {brands.length === 1 ? 'brand' : 'brands'} registered
          </div>
        </div>

        {/* Content Area */}
        {isLoading ? (
          <div className="p-16 text-center flex flex-col items-center justify-center space-y-3">
            <div className="w-8 h-8 rounded-full border-2 border-coral-500 border-t-transparent animate-spin" />
            <p className="text-xs text-content-secondary">Loading product brands...</p>
          </div>
        ) : isError ? (
          <div className="p-12 text-center flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-2xl bg-danger-50 border border-danger-200 flex items-center justify-center mb-3">
              <AlertCircle className="w-6 h-6 text-danger-600" />
            </div>
            <h3 className="text-sm font-bold text-navy-950 mb-1">Failed to load brands</h3>
            <p className="text-xs text-content-secondary mb-4">
              {(error as any)?.message || 'An error occurred while communicating with the server.'}
            </p>
            <Button variant="secondary" size="sm" onClick={() => refetch()}>
              Retry
            </Button>
          </div>
        ) : brands.length === 0 ? (
          <div className="bg-white p-16 text-center flex flex-col items-center justify-center">
            <div className="w-14 h-14 rounded-2xl bg-surface-subtle border border-border flex items-center justify-center mb-3.5 shadow-xs">
              <Award className="w-7 h-7 text-content-muted" />
            </div>
            <h3 className="text-base font-bold text-navy-950 mb-1">No Brands Found</h3>
            <p className="text-xs text-content-secondary max-w-sm leading-relaxed mb-4">
              {search
                ? `No brands match the search term "${search}".`
                : 'Configure manufacturer brands to tag and filter catalog items across suppliers.'}
            </p>
            <button
              type="button"
              onClick={handleOpenCreate}
              className="pill-btn-coral h-9 px-4 text-white font-semibold text-xs rounded-full shadow-coral flex items-center gap-1.5 transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add First Brand</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-surface-subtle/70 text-content-secondary border-b border-border">
                <tr>
                  <th className="py-3 px-4 font-semibold">Brand Name</th>
                  <th className="py-3 px-4 font-semibold">Description</th>
                  <th className="py-3 px-4 font-semibold text-center">Products Count</th>
                  <th className="py-3 px-4 font-semibold text-center">Status</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {brands.map((brand) => (
                  <tr key={brand.id} className="hover:bg-surface-subtle/30 transition">
                    <td className="py-3 px-4 font-bold text-navy-950 flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-coral-50 border border-coral-200/80 flex items-center justify-center shrink-0">
                        <Award className="w-3.5 h-3.5 text-coral-600" />
                      </div>
                      <span>{brand.name}</span>
                    </td>
                    <td className="py-3 px-4 text-content-secondary max-w-sm truncate">
                      {brand.description || '—'}
                    </td>
                    <td className="py-3 px-4 text-center font-mono font-semibold text-navy-900">
                      {brand._count?.products ?? 0}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Badge variant={brand.isActive ? 'success' : 'neutral'}>
                        {brand.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(brand)}
                          className="p-1.5 text-content-muted hover:text-navy-950 hover:bg-surface-subtle rounded-lg transition cursor-pointer"
                          title="Edit Brand"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(brand)}
                          disabled={deleteMutation.isPending}
                          className="p-1.5 text-content-muted hover:text-danger-600 hover:bg-danger-50 rounded-lg transition cursor-pointer"
                          title="Delete Brand"
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

      {/* Brand Create/Edit Modal */}
      <BrandFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        brandToEdit={brandToEdit}
      />
    </div>
  );
}
