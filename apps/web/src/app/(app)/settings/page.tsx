import { PageHeader } from '@/components/layout/page-header';
import { Settings, Building, Receipt, Bell, Shield, Database, Save } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Company & System Settings"
        description="Configure organization details, GST tax rates, invoice templates, and system preferences."
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Administration' },
          { label: 'Settings' },
        ]}
        actions={
          <button
            type="button"
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-lg transition shadow-sm"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings</span>
          </button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Navigation Tabs Column */}
        <div className="md:col-span-1 space-y-1">
          <button
            type="button"
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium bg-indigo-50 text-indigo-700 border border-indigo-100/60"
          >
            <Building className="w-4 h-4 text-indigo-600" />
            <span>Company Profile</span>
          </button>
          <button
            type="button"
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
          >
            <Receipt className="w-4 h-4 text-slate-400" />
            <span>Taxes & Invoicing</span>
          </button>
          <button
            type="button"
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
          >
            <Bell className="w-4 h-4 text-slate-400" />
            <span>Notification Alerts</span>
          </button>
          <button
            type="button"
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
          >
            <Shield className="w-4 h-4 text-slate-400" />
            <span>Security & Sessions</span>
          </button>
          <button
            type="button"
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
          >
            <Database className="w-4 h-4 text-slate-400" />
            <span>Backup & Export</span>
          </button>
        </div>

        {/* Content Pane */}
        <div className="md:col-span-3 bg-white rounded-xl border border-slate-200/80 shadow-xs p-6 space-y-6">
          <div>
            <h3 className="text-base font-semibold text-slate-900">Organization Information</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              This information will be printed on sales invoices, bills, and tax reports.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Company Name</label>
              <input
                type="text"
                defaultValue="Stock Management System"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">GSTIN / Tax ID</label>
              <input
                type="text"
                placeholder="27ABCDE1234F1Z5"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Support Email</label>
              <input
                type="email"
                placeholder="billing@sms-system.internal"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Phone Number</label>
              <input
                type="text"
                placeholder="+91 98765 43210"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
