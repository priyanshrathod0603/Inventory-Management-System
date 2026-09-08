'use client';

import React, { useState, useEffect } from 'react';
import { X, Award, AlertCircle, Loader2 } from 'lucide-react';
import { Brand, useCreateBrand, useUpdateBrand } from '../../hooks/use-brands';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
      <div
        className="bg-white border border-[#EAE5E0] rounded-[28px] w-full max-w-lg shadow-[0_25px_60px_-15px_rgba(17,23,34,0.15)] overflow-hidden flex flex-col max-h-[92vh] animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 sm:px-8 py-5 border-b border-[#EAE5E0] flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-coral-50 border border-coral-200/80 text-coral-600 flex items-center justify-center shrink-0 shadow-xs">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-[#111722] font-sans tracking-tight">
                {isEditing ? 'Edit Brand' : 'Create New Brand'}
              </h3>
              <p className="text-xs text-[#5F636B] mt-0.5">
                {isEditing ? 'Update manufacturer or brand details' : 'Add a brand or manufacturer to product catalog'}
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto flex flex-col justify-between">
          <div className="p-6 sm:p-8 space-y-4">
            {error && (
              <div className="p-3.5 bg-danger-50 border border-danger-200 text-danger-700 rounded-2xl text-xs flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 text-danger-600" />
                <span className="font-semibold">{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-[#111722] mb-1.5">
                Brand Name <span className="text-[#FF6B4A] font-bold ml-0.5">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Nike, Nestlé, Sony, Samsung, Local Brand"
                className="w-full h-11 px-3.5 rounded-xl border border-[#EAE5E0] bg-[#FAF7F4]/50 focus:bg-white text-xs text-[#111722] placeholder:text-[#8C9097] focus:outline-none focus:ring-2 focus:ring-[#FF6B4A]/20 focus:border-[#FF6B4A] transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#111722] mb-1.5">
                Description / Manufacturer Notes <span className="text-[#8C9097] font-normal text-[11px] ml-1">(Optional)</span>
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief brand description, manufacturer warranty policies, or vendor details..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAE5E0] bg-[#FAF7F4]/50 focus:bg-white text-xs text-[#111722] placeholder:text-[#8C9097] focus:outline-none focus:ring-2 focus:ring-[#FF6B4A]/20 focus:border-[#FF6B4A] transition resize-none"
              />
            </div>

            {isEditing && (
              <div className="flex items-center gap-2.5 pt-2">
                <input
                  type="checkbox"
                  id="isActiveBrand"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 rounded text-coral-500 focus:ring-coral-500 cursor-pointer accent-[#FF6B4A]"
                />
                <label htmlFor="isActiveBrand" className="text-xs font-bold text-[#111722] cursor-pointer">
                  Brand is active and visible in product catalog
                </label>
              </div>
            )}
          </div>

          {/* Footer */}
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
                  <span>Saving...</span>
                </>
              ) : (
                <span>{isEditing ? 'Save Changes' : 'Create Brand'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
