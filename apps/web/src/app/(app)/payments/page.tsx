import { PageHeader } from '@/components/layout/page-header';
import { CreditCard, Plus, Search, Filter } from 'lucide-react';

export default function PaymentsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Payments & Collections"
        description="Track cash, card, UPI, bank transfers, supplier payouts, and customer collections."
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Transactions' },
          { label: 'Payments' },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium text-sm rounded-lg transition shadow-2xs"
            >
              <Filter className="w-4 h-4 text-slate-500" />
              <span>Filter</span>
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-lg transition shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Record Payment</span>
            </button>
          </div>
        }
      />

      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by transaction reference, customer, or payment mode..."
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
              disabled
            />
          </div>
        </div>

        <div className="p-12 text-center">
          <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
            <CreditCard className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-slate-900">No payment records</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Payment transactions from POS counters, vendor disbursements, and customer receivables will appear here.
          </p>
        </div>
      </div>
    </div>
  );
}
