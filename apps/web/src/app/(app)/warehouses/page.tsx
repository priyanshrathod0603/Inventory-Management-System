'use client';

import React, { useState } from 'react';
import { PageHeader } from '../../../components/layout/page-header';
import { Warehouse as WarehouseIcon, Plus, Search, Edit2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useWarehouses, Warehouse } from '../../../hooks/use-warehouses';
import { WarehouseFormModal } from '../../../components/warehouses/warehouse-form-modal';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';

export default function WarehousesPage() {
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [warehouseToEdit, setWarehouseToEdit] = useState<Warehouse | null>(null);

  const { data: warehouses = [], isLoading, isError, error, refetch } = useWarehouses();

  const filteredWarehouses = warehouses.filter((w) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      w.name.toLowerCase().includes(q) ||
      w.code.toLowerCase().includes(q) ||
      (w.address && w.address.toLowerCase().includes(q))
    );
  });

  const handleOpenCreate = () => {
    setWarehouseToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (warehouse: Warehouse) => {
    setWarehouseToEdit(warehouse);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Warehouses & Facilities"
        subtitle="Configure storage facilities, dispatch centers, retail outlets, and multi-location hubs."
        breadcrumbs={[{ label: 'Master Data' }, { label: 'Warehouses' }]}
      >
        <button
          type="button"
          onClick={handleOpenCreate}
          className="pill-btn-coral h-9 px-4 text-white font-semibold text-xs rounded-full shadow-coral flex items-center gap-1.5 transition cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Warehouse</span>
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
              placeholder="Search by warehouse name, code or address..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-border rounded-full focus:outline-none focus:ring-2 focus:ring-coral-500/20 focus:border-coral-500 shadow-xs transition"
            />
          </div>
          <div className="text-xs text-content-secondary font-mono">
            {filteredWarehouses.length} {filteredWarehouses.length === 1 ? 'warehouse' : 'warehouses'} active
          </div>
        </div>

        {/* Content Area */}
        {isLoading ? (
          <div className="p-16 text-center flex flex-col items-center justify-center space-y-3">
            <div className="w-8 h-8 rounded-full border-2 border-coral-500 border-t-transparent animate-spin" />
            <p className="text-xs text-content-secondary">Loading storage facilities...</p>
          </div>
        ) : isError ? (
          <div className="p-12 text-center flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-2xl bg-danger-50 border border-danger-200 flex items-center justify-center mb-3">
              <AlertCircle className="w-6 h-6 text-danger-600" />
            </div>
            <h3 className="text-sm font-bold text-navy-950 mb-1">Failed to load warehouses</h3>
            <p className="text-xs text-content-secondary mb-4">
              {(error as any)?.message || 'An error occurred while communicating with the server.'}
            </p>
            <Button variant="secondary" size="sm" onClick={() => refetch()}>
              Retry
            </Button>
          </div>
        ) : filteredWarehouses.length === 0 ? (
          <div className="bg-white p-16 text-center flex flex-col items-center justify-center">
            <div className="w-14 h-14 rounded-2xl bg-surface-subtle border border-border flex items-center justify-center mb-3.5 shadow-xs">
              <WarehouseIcon className="w-7 h-7 text-content-muted" />
            </div>
            <h3 className="text-base font-bold text-navy-950 mb-1">No Warehouses Configured</h3>
            <p className="text-xs text-content-secondary max-w-sm leading-relaxed mb-4">
              {search
                ? `No warehouses match the search term "${search}".`
                : 'Configure physical storage locations and retail counters to enable multi-location stock tracking.'}
            </p>
            <button
              type="button"
              onClick={handleOpenCreate}
              className="pill-btn-coral h-9 px-4 text-white font-semibold text-xs rounded-full shadow-coral flex items-center gap-1.5 transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add First Warehouse</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-surface-subtle/70 text-content-secondary border-b border-border">
                <tr>
                  <th className="py-3 px-4 font-semibold">Warehouse Name</th>
                  <th className="py-3 px-4 font-semibold">Code</th>
                  <th className="py-3 px-4 font-semibold">Physical Address</th>
                  <th className="py-3 px-4 font-semibold text-center">Type</th>
                  <th className="py-3 px-4 font-semibold text-center">Status</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredWarehouses.map((wh) => (
                  <tr key={wh.id} className="hover:bg-surface-subtle/30 transition">
                    <td className="py-3 px-4 font-bold text-navy-950 flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-coral-50 border border-coral-200/80 flex items-center justify-center shrink-0">
                        <WarehouseIcon className="w-3.5 h-3.5 text-coral-600" />
                      </div>
                      <div>
                        <span>{wh.name}</span>
                        {wh.isDefault && (
                          <span className="ml-2 inline-flex items-center text-[10px] font-semibold text-coral-600">
                            ★ Default
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold text-navy-900">{wh.code}</td>
                    <td className="py-3 px-4 text-content-secondary max-w-sm truncate">
                      {wh.address || '—'}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {wh.isDefault ? (
                        <span className="inline-flex items-center gap-1 bg-coral-50 text-coral-700 border border-coral-200/80 px-2.5 py-0.5 rounded-full text-[11px] font-semibold">
                          <CheckCircle2 className="w-3 h-3 text-coral-600" />
                          Primary Hub
                        </span>
                      ) : (
                        <span className="text-content-secondary bg-surface-subtle px-2.5 py-0.5 rounded-full border border-border text-[11px] font-medium">
                          Branch / Secondary
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Badge variant={wh.isActive ? 'success' : 'neutral'}>
                        {wh.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(wh)}
                          className="p-1.5 text-content-muted hover:text-navy-950 hover:bg-surface-subtle rounded-lg transition cursor-pointer"
                          title="Edit Warehouse"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
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

      {/* Warehouse Create/Edit Modal */}
      <WarehouseFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        warehouseToEdit={warehouseToEdit}
      />
    </div>
  );
}
