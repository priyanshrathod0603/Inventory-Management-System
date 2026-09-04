import { PageHeader } from '@/components/layout/page-header';
import { Layers, Search, AlertCircle } from 'lucide-react';

export default function BatchesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Batch & Expiry Tracking"
        description="Monitor product batch numbers, manufacturing dates, expiry dates, and lot quantities."
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Inventory' },
          { label: 'Batches' },
        ]}
      />

      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by batch number or SKU..."
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
              disabled
            />
          </div>
        </div>

        <div className="p-12 text-center">
          <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
            <Layers className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-slate-900">No batch records found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Batch tracking entries are automatically created when batch-tracked items are received via purchases.
          </p>
        </div>
      </div>
    </div>
  );
}
