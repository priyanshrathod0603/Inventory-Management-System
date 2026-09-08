'use client';

import React, { useState } from 'react';
import { PageHeader } from '../../../components/layout/page-header';
import { Building2, Plus, Search, Phone, Mail, MapPin } from 'lucide-react';
import { SupplierFormModal } from '../../../components/suppliers/supplier-form-modal';
import { useSuppliers, Supplier } from '../../../hooks/use-suppliers';

export default function SuppliersPage() {
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: response, isLoading, refetch } = useSuppliers({
    search: search.trim() || undefined,
  });

  const suppliers = response?.data || [];
  const filteredSuppliers = suppliers.filter(
    (s) =>
      s.companyName.toLowerCase().includes(search.toLowerCase()) ||
      (s.phone && s.phone.includes(search)) ||
      (s.contactPerson && s.contactPerson.toLowerCase().includes(search.toLowerCase())) ||
      (s.email && s.email.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Suppliers"
        description="Manage vendor directories, GSTIN records, payment terms, and procurement ledgers."
        breadcrumbs={[
          { label: 'Master Data' },
          { label: 'Suppliers' },
        ]}
        actions={
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="pill-btn-coral h-9 px-4 text-white font-semibold text-xs rounded-full shadow-coral flex items-center gap-1.5 transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Supplier</span>
          </button>
        }
      />

      <div className="bg-white rounded-[24px] border border-border shadow-card overflow-hidden">
        <div className="p-4 border-b border-border bg-surface-subtle/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-content-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by vendor name, GSTIN, or phone..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-border rounded-full focus:outline-none focus:ring-2 focus:ring-coral-500/20 focus:border-coral-500 shadow-xs transition"
            />
          </div>
          <div className="text-xs text-content-secondary font-mono">
            {filteredSuppliers.length} {filteredSuppliers.length === 1 ? 'supplier' : 'suppliers'} listed
          </div>
        </div>

        {filteredSuppliers.length === 0 ? (
          <div className="p-16 text-center">
            <div className="w-14 h-14 rounded-2xl bg-surface-subtle border border-border flex items-center justify-center mx-auto mb-3.5 text-content-muted shadow-xs">
              <Building2 className="w-7 h-7 text-content-muted" />
            </div>
            <h3 className="text-base font-bold text-navy-950">
              {search ? 'No matching suppliers found' : 'No suppliers registered'}
            </h3>
            <p className="text-xs text-content-secondary mt-1 max-w-sm mx-auto leading-relaxed mb-4">
              {search
                ? `No supplier matches the query "${search}". Try searching another name or phone number.`
                : 'Add suppliers and vendors to manage inward stock orders, purchase orders, and vendor balances.'}
            </p>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="pill-btn-coral h-9 px-4 text-white font-semibold text-xs rounded-full shadow-coral transition inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Register Supplier</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-border bg-surface-subtle/30 text-content-muted font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Vendor / Company Name</th>
                  <th className="py-3 px-4">Contact Person</th>
                  <th className="py-3 px-4">Phone &amp; Email</th>
                  <th className="py-3 px-4">GSTIN</th>
                  <th className="py-3 px-4 text-right">Pending Payables</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredSuppliers.map((supp) => (
                  <tr key={supp.id} className="hover:bg-surface-subtle/40 transition">
                    <td className="py-3.5 px-4 font-bold text-navy-950 font-sans">
                      {supp.companyName}
                    </td>
                    <td className="py-3.5 px-4 text-content-secondary">
                      {supp.contactPerson || '—'}
                    </td>
                    <td className="py-3.5 px-4 text-content-secondary">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 font-mono text-[11px]">
                          <Phone className="w-3 h-3 text-content-muted" />
                          <span>{supp.phone}</span>
                        </div>
                        {supp.email && (
                          <div className="flex items-center gap-1.5 text-[11px]">
                            <Mail className="w-3 h-3 text-content-muted" />
                            <span>{supp.email}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs text-content-secondary">
                      {supp.gstin || '—'}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-navy-950">
                      ₹{Number(supp.pendingPayables || 0).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Supplier Form Modal */}
      <SupplierFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          refetch();
        }}
      />
    </div>
  );
}
