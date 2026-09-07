'use client';

import React, { useState, useEffect } from 'react';
import { X, Layers, AlertCircle } from 'lucide-react';
import { Category, useCreateCategory, useUpdateCategory, useCategories } from '../../hooks/use-categories';
import { Button } from '../ui/button';

interface CategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoryToEdit?: Category | null;
}

export function CategoryFormModal({ isOpen, onClose, categoryToEdit }: CategoryFormModalProps) {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [parentId, setParentId] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { data: categoriesData } = useCategories();
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();

  const isEditing = Boolean(categoryToEdit);
  const isPending = createMutation.isPending || updateMutation.isPending;

  useEffect(() => {
    if (categoryToEdit) {
      setName(categoryToEdit.name);
      setSlug(categoryToEdit.slug);
      setDescription(categoryToEdit.description || '');
      setParentId(categoryToEdit.parentId || '');
      setIsActive(categoryToEdit.isActive);
    } else {
      setName('');
      setSlug('');
      setDescription('');
      setParentId('');
      setIsActive(true);
    }
    setError(null);
  }, [categoryToEdit, isOpen]);

  if (!isOpen) return null;

  const availableParents = (categoriesData?.data || []).filter(
    (cat) => !categoryToEdit || cat.id !== categoryToEdit.id
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Category name is required.');
      return;
    }

    try {
      if (isEditing && categoryToEdit) {
        await updateMutation.mutateAsync({
          id: categoryToEdit.id,
          name: name.trim(),
          slug: slug.trim() || undefined,
          description: description.trim() || undefined,
          parentId: parentId || null,
          isActive,
        });
      } else {
        await createMutation.mutateAsync({
          name: name.trim(),
          slug: slug.trim() || undefined,
          description: description.trim() || undefined,
          parentId: parentId || undefined,
        });
      }
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to save category. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white border border-border rounded-[28px] w-full max-w-lg shadow-elevated overflow-hidden animate-scale-up">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-border flex items-center justify-between bg-surface-subtle/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-coral-50 border border-coral-200/80 flex items-center justify-center">
              <Layers className="w-4 h-4 text-coral-600" />
            </div>
            <div>
              <h3 className="text-base font-bold text-navy-950">
                {isEditing ? 'Edit Category' : 'Create New Category'}
              </h3>
              <p className="text-xs text-content-secondary">
                {isEditing ? 'Update category details and hierarchy' : 'Add a product category to catalog'}
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

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-danger-50 border border-danger-200 text-danger-700 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-navy-950 mb-1">
              Category Name <span className="text-danger-600">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Beverages, Dairy, Snacks"
              className="form-input-warm w-full text-xs text-navy-950 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-navy-950 mb-1">
              Slug <span className="text-content-muted font-normal">(Optional - auto generated)</span>
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="e.g. beverages"
              className="form-input-warm w-full text-xs text-navy-950 focus:outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-navy-950 mb-1">
              Parent Category <span className="text-content-muted font-normal">(Optional)</span>
            </label>
            <select
              value={parentId}
              onChange={(e) => setParentId(e.target.value)}
              className="form-input-warm w-full text-xs text-navy-950 focus:outline-none cursor-pointer"
            >
              <option value="">None (Top-Level Category)</option>
              {availableParents.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-navy-950 mb-1">
              Description <span className="text-content-muted font-normal">(Optional)</span>
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of items under this category..."
              className="form-input-warm w-full text-xs text-navy-950 focus:outline-none resize-none"
            />
          </div>

          {isEditing && (
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="isActiveCat"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4 rounded text-coral-500 focus:ring-coral-500 cursor-pointer"
              />
              <label htmlFor="isActiveCat" className="text-xs font-medium text-navy-950 cursor-pointer">
                Category is active and visible in product catalog
              </label>
            </div>
          )}

          {/* Modal Footer */}
          <div className="pt-4 border-t border-border flex items-center justify-end gap-2.5">
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
              {isEditing ? 'Save Changes' : 'Create Category'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
