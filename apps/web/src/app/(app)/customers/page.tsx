'use client';

import React, { useState } from 'react';
import { PageHeader } from '../../../components/layout/page-header';
import { Users, Plus, Search, Phone, Mail, MapPin, CreditCard } from 'lucide-react';
import { CustomerFormModal } from '../../../components/customers/customer-form-modal';
import { useCustomers, Customer } from '../../../hooks/use-customers';

export default function CustomersPage() {
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: response, isLoading, refetch } = useCustomers({
    search: search.trim() || undefined,
  });

  const customers = response?.data || [];
  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.phone && c.phone.includes(search)) ||
      (c.email && c.email.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Customers"
        description="Manage customer profiles, credit limits, contact directory, and purchase histories."
        breadcrumbs={[
          { label: 'Master Data' },
          { label: 'Customers' },
        ]}
        actions={
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="pill-btn-coral h-9 px-4 text-white font-semibold text-xs rounded-full shadow-coral flex items-center gap-1.5 transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Customer</span>
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
              placeholder="Search by name, phone, or email..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-border rounded-full focus:outline-none focus:ring-2 focus:ring-coral-500/20 focus:border-coral-500 shadow-xs transition"
            />
          </div>
          <div className="text-xs text-content-secondary font-mono">
            {filteredCustomers.length} {filteredCustomers.length === 1 ? 'customer' : 'customers'} listed
          </div>
        </div>

        {filteredCustomers.length === 0 ? (
          <div className="p-16 text-center">
            <div className="w-14 h-14 rounded-2xl bg-surface-subtle border border-border flex items-center justify-center mx-auto mb-3.5 text-content-muted shadow-xs">
              <Users className="w-7 h-7 text-content-muted" />
            </div>
            <h3 className="text-base font-bold text-navy-950">
              {search ? 'No matching customers found' : 'No customers registered'}
            </h3>
            <p className="text-xs text-content-secondary mt-1 max-w-sm mx-auto leading-relaxed mb-4">
              {search
                ? `No customer matches the query "${search}". Try searching another name or phone number.`
                : 'Create customer records to track customer ledgers, credit limits, and POS purchase histories.'}
            </p>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="pill-btn-coral h-9 px-4 text-white font-semibold text-xs rounded-full shadow-coral transition inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Customer</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-border bg-surface-subtle/30 text-content-muted font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Customer Name</th>
                  <th className="py-3 px-4">Contact Details</th>
                  <th className="py-3 px-4">GSTIN</th>
                  <th className="py-3 px-4 text-right">Credit Limit</th>
                  <th className="py-3 px-4 text-right">Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredCustomers.map((cust) => (
                  <tr key={cust.id} className="hover:bg-surface-subtle/40 transition">
                    <td className="py-3.5 px-4 font-bold text-navy-950 font-sans">
                      {cust.name}
                    </td>
                    <td className="py-3.5 px-4 text-content-secondary">
                      <div className="space-y-0.5">
                        {cust.phone && (
                          <div className="flex items-center gap-1.5 font-mono text-[11px]">
                            <Phone className="w-3 h-3 text-content-muted" />
                            <span>{cust.phone}</span>
                          </div>
                        )}
                        {cust.email && (
                          <div className="flex items-center gap-1.5 text-[11px]">
                            <Mail className="w-3 h-3 text-content-muted" />
                            <span>{cust.email}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs text-content-secondary">
                      {cust.gstin || '—'}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-semibold text-navy-950">
                      ₹{Number(cust.creditLimit || 0).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-coral-600">
                      ₹{Number(cust.outstandingBalance || 0).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Customer Form Modal */}
      <CustomerFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          refetch();
        }}
      />
    </div>
  );
}
