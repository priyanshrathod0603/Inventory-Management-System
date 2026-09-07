'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Bell, X, Check, AlertTriangle, AlertCircle, ShieldAlert, Sparkles } from 'lucide-react';

interface NotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationsDrawer({ isOpen, onClose }: NotificationsDrawerProps) {
  const [activeTab, setActiveTab] = useState<'ALL' | 'STOCK' | 'FINANCE' | 'SYSTEM'>('ALL');
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (drawerRef.current && !drawerRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs z-50 flex justify-end animate-in fade-in duration-150">
      <div
        ref={drawerRef}
        className="w-full max-w-sm bg-white h-full shadow-2xl border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-200"
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Notifications</h3>
              <p className="text-[11px] text-slate-400">Real-time alerts & store updates</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Category Tabs */}
        <div className="px-4 py-2 border-b border-slate-100 bg-slate-50/60 flex gap-1 text-xs">
          {(['ALL', 'STOCK', 'FINANCE', 'SYSTEM'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-2.5 py-1 rounded-md font-semibold text-[11px] transition ${
                activeTab === tab
                  ? 'bg-white text-indigo-600 shadow-xs border border-slate-200/80'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.charAt(0) + tab.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {/* Notification Content Foundation */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-3">
            <Bell className="w-5 h-5 text-slate-400" />
          </div>
          <h4 className="text-xs font-semibold text-slate-800 mb-1">No unread alerts</h4>
          <p className="text-[11px] text-slate-400 max-w-[240px]">
            You are all caught up! Low stock warnings, expiry notices, and financial anomalies will appear here.
          </p>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-[11px]">
          <span className="text-slate-400">Inventory Notification Center</span>
          <button
            type="button"
            className="text-indigo-600 font-semibold hover:text-indigo-800 transition"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
