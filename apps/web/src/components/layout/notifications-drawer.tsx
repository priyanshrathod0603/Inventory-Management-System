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
    <div className="fixed inset-0 bg-navy-950/30 backdrop-blur-xs z-50 flex justify-end animate-in fade-in duration-150">
      <div
        ref={drawerRef}
        className="w-full max-w-sm bg-white h-full shadow-modal border-l border-border flex flex-col animate-in slide-in-from-right duration-200"
      >
        {/* Header */}
        <div className="p-5 border-b border-border flex items-center justify-between bg-surface">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-coral-50 text-coral-600 flex items-center justify-center shadow-xs">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-navy-950 font-sans">Notifications</h3>
              <p className="text-[11px] text-content-muted">Real-time alerts &amp; store updates</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-content-muted hover:text-navy-950 rounded-full hover:bg-surface-subtle transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Category Tabs */}
        <div className="px-5 py-2.5 border-b border-border-subtle bg-surface-subtle/70 flex gap-1.5 text-xs overflow-x-auto">
          {(['ALL', 'STOCK', 'FINANCE', 'SYSTEM'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 rounded-full font-semibold text-[11px] transition shrink-0 cursor-pointer ${
                activeTab === tab
                  ? 'bg-coral-500 text-white shadow-xs'
                  : 'text-content-secondary hover:text-navy-950 hover:bg-surface-muted'
              }`}
            >
              {tab.charAt(0) + tab.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {/* Notification Content Foundation */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center justify-center text-center">
          <div className="w-14 h-14 rounded-full bg-surface-subtle border border-border text-content-muted flex items-center justify-center mb-3.5 shadow-xs">
            <Bell className="w-6 h-6 text-content-muted" />
          </div>
          <h4 className="text-sm font-bold text-navy-950 mb-1">No unread alerts</h4>
          <p className="text-xs text-content-secondary max-w-[240px] leading-relaxed">
            You are all caught up! Low stock warnings, expiry notices, and financial anomalies will appear here.
          </p>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-surface-subtle/80 flex items-center justify-between text-xs">
          <span className="text-content-muted">Notification Center</span>
          <button
            type="button"
            className="text-coral-600 font-semibold hover:text-coral-700 transition cursor-pointer"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
