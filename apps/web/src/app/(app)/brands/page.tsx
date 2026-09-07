'use client';

import React from 'react';
import { PageHeader } from '../../../components/layout/page-header';
import { Tag, Plus } from 'lucide-react';

export default function BrandsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Product Brands"
        subtitle="Manage product manufacturer brands and supplier associations."
        breadcrumbs={[{ label: 'Master Data' }, { label: 'Brands' }]}
      >
        <button
          type="button"
          className="pill-btn-coral h-9 px-4 text-white font-semibold text-xs rounded-full shadow-coral flex items-center gap-1.5 transition cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Brand</span>
        </button>
      </PageHeader>

      <div className="bg-white border border-border rounded-[24px] p-16 text-center shadow-card flex flex-col items-center justify-center">
        <div className="w-14 h-14 rounded-2xl bg-surface-subtle border border-border flex items-center justify-center mb-3.5 shadow-xs">
          <Tag className="w-7 h-7 text-content-muted" />
        </div>
        <h3 className="text-base font-bold text-navy-950 mb-1">Brands Directory</h3>
        <p className="text-xs text-content-secondary max-w-sm leading-relaxed mb-4">
          Brand manufacturers and product label registries will be managed here.
        </p>
        <button
          type="button"
          className="pill-btn-coral h-9 px-4 text-white font-semibold text-xs rounded-full shadow-coral flex items-center gap-1.5 transition cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add First Brand</span>
        </button>
      </div>
    </div>
  );
}
