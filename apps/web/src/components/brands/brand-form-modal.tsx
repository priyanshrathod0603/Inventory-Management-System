'use client';

import React, { useState, useEffect } from 'react';
import { X, Award, AlertCircle } from 'lucide-react';
import { Brand, useCreateBrand, useUpdateBrand } from '../../hooks/use-brands';
import { Button } from '../ui/button';

interface BrandFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  brandToEdit?: Brand | null;
}

export function BrandFormModal({ isOpen, onClose, brandToEdit }: BrandFormModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const createMutation = useCreateBrand();
  const updateMutation = useUpdateBrand();

  const isEditing = Boolean(brandToEdit);
  const isPending = createMutation.isPending || updateMutation.isPending;

  useEffect(() => {
    if (brandToEdit) {
      setName(brandToEdit.name);
      setDescription(brandToEdit.description || '');
      setIsActive(brandToEdit.isActive);
    } else {
      setName('');
      setDescription('');
      setIsActive(true);
    }
    setError(null);
  }, [brandToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Brand name is required.');
      return;
    }

    try {
      if (isEditing && brandToEdit) {
        await updateMutation.mutateAsync({
          id: brandToEdit.id,
          name: name.trim(),
          description: description.trim() || undefined,
          isActive,
        });
      } else {
        await createMutation.mutateAsync({
          name: name.trim(),
          description: description.trim() || undefined,
        });
      }
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to save brand. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white border border-border rounded-[28px] w-full max-w-lg shadow-elevated overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="px-6 py-5 border-b border-border flex items-center justify-between bg-surface-subtle/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-coral-50 border border-coral-200/80 flex items-center justify-center">
              <Award className="w-4 h-4 text-coral-600" />
            </div>
            <div>
              <h3 className="text-base font-bold text-navy-950">
                {isEditing ? 'Edit Brand' : 'Create New Brand'}
              </h3>
              <p className="text-xs text-content-secondary">
                {isEditing ? 'Update manufacturer or brand details' : 'Add a brand to product catalog'}
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

          <div>
            <label className="block text-xs font-semibold text-navy-950 mb-1">
              Brand Name <span className="text-danger-600">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Nestlé, Apple, Unilever"
              className="form-input-warm w-full text-xs text-navy-950 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-navy-950 mb-1">
              Description <span className="text-content-muted font-normal">(Optional)</span>
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description or manufacturer notes..."
              className="form-input-warm w-full text-xs text-navy-950 focus:outline-none resize-none"
            />
          </div>

          {isEditing && (
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="isActiveBrand"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4 rounded text-coral-500 focus:ring-coral-500 cursor-pointer"
              />
              <label htmlFor="isActiveBrand" className="text-xs font-medium text-navy-950 cursor-pointer">
                Brand is active and visible in product catalog
              </label>
            </div>
          )}

          {/* Footer */}
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
              {isEditing ? 'Save Changes' : 'Create Brand'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
