'use client';

import React, { useState } from 'react';
import { PageHeader } from '../../../components/layout/page-header';
import { Layers, Plus, Search, Edit2, Trash2, FolderTree, AlertCircle } from 'lucide-react';
import { useCategories, useDeleteCategory, Category } from '../../../hooks/use-categories';
import { CategoryFormModal } from '../../../components/categories/category-form-modal';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';

export default function CategoriesPage() {
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);

  const { data: response, isLoading, isError, error, refetch } = useCategories({
    search: search.trim() || undefined,
  });
  const deleteMutation = useDeleteCategory();

  const categories = response?.data || [];

  const handleOpenCreate = () => {
    setCategoryToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (category: Category) => {
    setCategoryToEdit(category);
    setIsModalOpen(true);
  };

  const handleDelete = async (category: Category) => {
    if (
      window.confirm(
        `Are you sure you want to delete "${category.name}"? This action cannot be undone.`
      )
    ) {
      try {
        await deleteMutation.mutateAsync(category.id);
      } catch (err: any) {
        alert(err?.message || 'Failed to delete category.');
      }
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Product Categories"
        subtitle="Organize product catalog taxonomy, hierarchical subcategories, and tax classifications."
        breadcrumbs={[{ label: 'Master Data' }, { label: 'Categories' }]}
      >
        <button
          type="button"
          onClick={handleOpenCreate}
          className="pill-btn-coral h-9 px-4 text-white font-semibold text-xs rounded-full shadow-coral flex items-center gap-1.5 transition cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Category</span>
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
              placeholder="Search categories by name, slug or description..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-border rounded-full focus:outline-none focus:ring-2 focus:ring-coral-500/20 focus:border-coral-500 shadow-xs transition"
            />
          </div>
          <div className="text-xs text-content-secondary font-mono">
            {categories.length} {categories.length === 1 ? 'category' : 'categories'} registered
          </div>
        </div>

        {/* Content Area */}
        {isLoading ? (
          <div className="p-16 text-center flex flex-col items-center justify-center space-y-3">
            <div className="w-8 h-8 rounded-full border-2 border-coral-500 border-t-transparent animate-spin" />
            <p className="text-xs text-content-secondary">Loading product categories...</p>
          </div>
        ) : isError ? (
          <div className="p-12 text-center flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-2xl bg-danger-50 border border-danger-200 flex items-center justify-center mb-3">
              <AlertCircle className="w-6 h-6 text-danger-600" />
            </div>
            <h3 className="text-sm font-bold text-navy-950 mb-1">Failed to load categories</h3>
            <p className="text-xs text-content-secondary mb-4">
              {(error as any)?.message || 'An error occurred while communicating with the server.'}
            </p>
            <Button variant="secondary" size="sm" onClick={() => refetch()}>
              Retry
            </Button>
          </div>
        ) : categories.length === 0 ? (
          <div className="bg-white p-16 text-center flex flex-col items-center justify-center">
            <div className="w-14 h-14 rounded-2xl bg-surface-subtle border border-border flex items-center justify-center mb-3.5 shadow-xs">
              <Layers className="w-7 h-7 text-content-muted" />
            </div>
            <h3 className="text-base font-bold text-navy-950 mb-1">No Categories Found</h3>
            <p className="text-xs text-content-secondary max-w-sm leading-relaxed mb-4">
              {search
                ? `No categories match the search term "${search}".`
                : 'Get started by creating your first product category for grouping catalog items.'}
            </p>
            <button
              type="button"
              onClick={handleOpenCreate}
              className="pill-btn-coral h-9 px-4 text-white font-semibold text-xs rounded-full shadow-coral flex items-center gap-1.5 transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Category</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-surface-subtle/70 text-content-secondary border-b border-border">
                <tr>
                  <th className="py-3 px-4 font-semibold">Category Name</th>
                  <th className="py-3 px-4 font-semibold">Slug</th>
                  <th className="py-3 px-4 font-semibold">Parent Category</th>
                  <th className="py-3 px-4 font-semibold">Description</th>
                  <th className="py-3 px-4 font-semibold text-center">Status</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-surface-subtle/30 transition">
                    <td className="py-3 px-4 font-bold text-navy-950 flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-coral-50 border border-coral-200/80 flex items-center justify-center shrink-0">
                        <FolderTree className="w-3.5 h-3.5 text-coral-600" />
                      </div>
                      <span>{cat.name}</span>
                    </td>
                    <td className="py-3 px-4 font-mono text-content-secondary">{cat.slug}</td>
                    <td className="py-3 px-4 text-content-secondary">
                      {cat.parent ? (
                        <span className="font-medium text-navy-900 bg-surface-subtle px-2 py-0.5 rounded-full border border-border text-[11px]">
                          {cat.parent.name}
                        </span>
                      ) : (
                        <span className="text-content-muted italic">Top-Level</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-content-secondary max-w-xs truncate">
                      {cat.description || '—'}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Badge variant={cat.isActive ? 'success' : 'neutral'}>
                        {cat.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(cat)}
                          className="p-1.5 text-content-muted hover:text-navy-950 hover:bg-surface-subtle rounded-lg transition cursor-pointer"
                          title="Edit Category"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(cat)}
                          disabled={deleteMutation.isPending}
                          className="p-1.5 text-content-muted hover:text-danger-600 hover:bg-danger-50 rounded-lg transition cursor-pointer"
                          title="Delete Category"
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

      {/* Category Create/Edit Modal */}
      <CategoryFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        categoryToEdit={categoryToEdit}
      />
    </div>
  );
}
