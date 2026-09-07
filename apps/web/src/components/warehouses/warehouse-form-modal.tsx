'use client';

import React, { useState, useEffect } from 'react';
import { X, Warehouse as WarehouseIcon, AlertCircle } from 'lucide-react';
import { Warehouse, useCreateWarehouse, useUpdateWarehouse } from '../../hooks/use-warehouses';
import { Button } from '../ui/button';

interface WarehouseFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  warehouseToEdit?: Warehouse | null;
}

export function WarehouseFormModal({ isOpen, onClose, warehouseToEdit }: WarehouseFormModalProps) {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [address, setAddress] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const createMutation = useCreateWarehouse();
  const updateMutation = useUpdateWarehouse();

  const isEditing = Boolean(warehouseToEdit);
  const isPending = createMutation.isPending || updateMutation.isPending;

  useEffect(() => {
    if (warehouseToEdit) {
      setName(warehouseToEdit.name);
      setCode(warehouseToEdit.code);
      setAddress(warehouseToEdit.address || '');
      setIsDefault(warehouseToEdit.isDefault);
      setIsActive(warehouseToEdit.isActive);
    } else {
      setName('');
      setCode('');
      setAddress('');
      setIsDefault(false);
      setIsActive(true);
    }
    setError(null);
  }, [warehouseToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Warehouse name is required.');
      return;
    }
    if (!code.trim()) {
      setError('Warehouse code is required.');
      return;
    }

    try {
      if (isEditing && warehouseToEdit) {
        await updateMutation.mutateAsync({
          id: warehouseToEdit.id,
          name: name.trim(),
          code: code.trim().toUpperCase(),
          address: address.trim() || undefined,
          isDefault,
          isActive,
        });
      } else {
        await createMutation.mutateAsync({
          name: name.trim(),
          code: code.trim().toUpperCase(),
          address: address.trim() || undefined,
          isDefault,
        });
      }
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to save warehouse. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white border border-border rounded-[28px] w-full max-w-lg shadow-elevated overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="px-6 py-5 border-b border-border flex items-center justify-between bg-surface-subtle/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-coral-50 border border-coral-200/80 flex items-center justify-center">
              <WarehouseIcon className="w-4 h-4 text-coral-600" />
            </div>
            <div>
              <h3 className="text-base font-bold text-navy-950">
                {isEditing ? 'Edit Warehouse' : 'Create New Warehouse'}
              </h3>
              <p className="text-xs text-content-secondary">
                {isEditing ? 'Update facility details and location' : 'Add a storage location / branch warehouse'}
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

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-navy-950 mb-1">
                Warehouse Name <span className="text-danger-600">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Main Distribution Center"
                className="form-input-warm w-full text-xs text-navy-950 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-navy-950 mb-1">
                Code <span className="text-danger-600">*</span>
              </label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="e.g. WH-01"
                className="form-input-warm w-full text-xs text-navy-950 focus:outline-none font-mono uppercase"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-navy-950 mb-1">
              Location / Physical Address <span className="text-content-muted font-normal">(Optional)</span>
            </label>
            <textarea
              rows={3}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g. Plot 42, Industrial Area, Sector 5, Mumbai"
              className="form-input-warm w-full text-xs text-navy-950 focus:outline-none resize-none"
            />
          </div>

          <div className="space-y-2 pt-1">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isDefaultWh"
                checked={isDefault}
                onChange={(e) => setIsDefault(e.target.checked)}
                className="w-4 h-4 rounded text-coral-500 focus:ring-coral-500 cursor-pointer"
              />
              <label htmlFor="isDefaultWh" className="text-xs font-medium text-navy-950 cursor-pointer">
                Set as Primary / Default Warehouse for new stock & sales
              </label>
            </div>

            {isEditing && (
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActiveWh"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 rounded text-coral-500 focus:ring-coral-500 cursor-pointer"
                />
                <label htmlFor="isActiveWh" className="text-xs font-medium text-navy-950 cursor-pointer">
                  Warehouse is active and enabled for stock transactions
                </label>
              </div>
            )}
          </div>

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
              {isEditing ? 'Save Changes' : 'Create Warehouse'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
