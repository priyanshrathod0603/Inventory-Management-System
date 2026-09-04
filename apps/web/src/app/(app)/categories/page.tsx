'use client';

import React from 'react';
import { PageHeader } from '../../../components/layout/page-header';
import { Layers, Plus } from 'lucide-react';

export default function CategoriesPage() {
  return (
    <div>
      <PageHeader
        title="Product Categories"
        subtitle="Organize product hierarchy, tax defaults, and subcategories."
        breadcrumbs={[{ label: 'Master Data' }, { label: 'Categories' }]}
      >
        <button
          type="button"
          className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg shadow-xs flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Category</span>
        </button>
      </PageHeader>

      <div className="bg-white border border-slate-200/90 rounded-xl p-12 text-center shadow-xs flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
          <Layers className="w-6 h-6 text-slate-400" />
        </div>
        <h3 className="text-sm font-bold text-slate-800 mb-1">Categories Shell</h3>
        <p className="text-xs text-slate-400 max-w-sm">
          Category and subcategory taxonomy management will be available in Phase 10.
        </p>
      </div>
    </div>
  );
}
