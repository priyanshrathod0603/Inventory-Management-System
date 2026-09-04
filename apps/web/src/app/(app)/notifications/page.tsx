import { PageHeader } from '@/components/layout/page-header';
import { Bell, CheckCheck, Trash2 } from 'lucide-react';

export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications Center"
        description="View and manage system alerts, low stock warnings, and transaction notices."
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Notifications' },
        ]}
        actions={
          <button
            type="button"
            className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium text-sm rounded-lg transition shadow-2xs"
          >
            <CheckCheck className="w-4 h-4 text-slate-500" />
            <span>Mark All as Read</span>
          </button>
        }
      />

      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-12 text-center">
          <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
            <Bell className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-slate-900">All caught up!</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            You don&apos;t have any pending alerts or low stock warnings at this time.
          </p>
        </div>
      </div>
    </div>
  );
}
