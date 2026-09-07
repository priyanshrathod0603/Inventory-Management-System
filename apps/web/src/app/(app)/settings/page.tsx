'use client';

import React from 'react';
import { PageHeader } from '../../../components/layout/page-header';
import { Building, Receipt, Bell, Shield, Database, Save } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Company &amp; System Settings"
        description="Configure organization details, GST tax rates, invoice templates, and system preferences."
        breadcrumbs={[
          { label: 'Administration' },
          { label: 'Settings' },
        ]}
        actions={
          <button
            type="button"
            className="pill-btn-coral h-9 px-4 text-white font-semibold text-xs rounded-full shadow-coral flex items-center gap-1.5 transition cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Settings</span>
          </button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Navigation Tabs Column */}
        <div className="md:col-span-1 space-y-1.5">
          <button
            type="button"
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-full text-xs font-bold bg-coral-50 text-coral-700 border border-coral-200/80 shadow-xs cursor-pointer"
          >
            <Building className="w-4 h-4 text-coral-600" />
            <span>Company Profile</span>
          </button>
          <button
            type="button"
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-full text-xs font-semibold text-content-secondary hover:bg-surface-subtle hover:text-navy-950 transition cursor-pointer"
          >
            <Receipt className="w-4 h-4 text-content-muted" />
            <span>Taxes &amp; Invoicing</span>
          </button>
          <button
            type="button"
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-full text-xs font-semibold text-content-secondary hover:bg-surface-subtle hover:text-navy-950 transition cursor-pointer"
          >
            <Bell className="w-4 h-4 text-content-muted" />
            <span>Notification Alerts</span>
          </button>
          <button
            type="button"
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-full text-xs font-semibold text-content-secondary hover:bg-surface-subtle hover:text-navy-950 transition cursor-pointer"
          >
            <Shield className="w-4 h-4 text-content-muted" />
            <span>Security &amp; Sessions</span>
          </button>
          <button
            type="button"
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-full text-xs font-semibold text-content-secondary hover:bg-surface-subtle hover:text-navy-950 transition cursor-pointer"
          >
            <Database className="w-4 h-4 text-content-muted" />
            <span>Backup &amp; Export</span>
          </button>
        </div>

        {/* Content Pane */}
        <div className="md:col-span-3 bg-white rounded-[24px] border border-border shadow-card p-6 sm:p-8 space-y-6">
          <div>
            <h3 className="text-base font-extrabold text-navy-950 font-sans tracking-tight">Organization Information</h3>
            <p className="text-xs text-content-secondary mt-1">
              This information will be printed on sales invoices, bills, and tax reports.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-navy-950">Company Name</label>
              <input
                type="text"
                defaultValue="Stock Management System"
                className="w-full px-4 py-2.5 text-xs bg-white border border-border rounded-xl text-navy-950 focus:outline-none focus:ring-2 focus:ring-coral-500/20 focus:border-coral-500 shadow-xs transition"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-navy-950">GSTIN / Tax ID</label>
              <input
                type="text"
                placeholder="27ABCDE1234F1Z5"
                className="w-full px-4 py-2.5 text-xs bg-white border border-border rounded-xl text-navy-950 font-mono focus:outline-none focus:ring-2 focus:ring-coral-500/20 focus:border-coral-500 shadow-xs transition"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-navy-950">Support Email</label>
              <input
                type="email"
                placeholder="billing@sms-system.internal"
                className="w-full px-4 py-2.5 text-xs bg-white border border-border rounded-xl text-navy-950 focus:outline-none focus:ring-2 focus:ring-coral-500/20 focus:border-coral-500 shadow-xs transition"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-navy-950">Phone Number</label>
              <input
                type="text"
                placeholder="+91 98765 43210"
                className="w-full px-4 py-2.5 text-xs bg-white border border-border rounded-xl text-navy-950 focus:outline-none focus:ring-2 focus:ring-coral-500/20 focus:border-coral-500 shadow-xs transition"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
