'use client';

import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Package,
  Layers,
  Tag,
  Users,
  Building2,
  Warehouse,
  ArrowLeftRight,
  Sliders,
  Clock,
  RotateCcw,
  Receipt,
  CreditCard,
  FileSpreadsheet,
  BookOpen,
  UserCheck,
  Shield,
  FileText,
  Bell,
  Settings,
  ChevronDown,
} from 'lucide-react';

interface MoreMenuProps {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

export function MoreMenu({ isOpen, onToggle, onClose }: MoreMenuProps) {
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
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

  const categories = [
    {
      title: 'MASTER DATA',
      items: [
        { label: 'Products', href: '/products', icon: Package },
        { label: 'Categories', href: '/categories', icon: Layers },
        { label: 'Brands', href: '/brands', icon: Tag },
        { label: 'Customers', href: '/customers', icon: Users },
        { label: 'Suppliers', href: '/suppliers', icon: Building2 },
      ],
    },
    {
      title: 'INVENTORY',
      items: [
        { label: 'Warehouses', href: '/warehouses', icon: Warehouse },
        { label: 'Stock Movements', href: '/stock-movements', icon: ArrowLeftRight },
        { label: 'Stock Adjustments', href: '/stock-adjustments', icon: Sliders },
        { label: 'Stock Transfers', href: '/stock-transfers', icon: ArrowLeftRight },
        { label: 'Batch & Expiry', href: '/batches', icon: Clock },
      ],
    },
    {
      title: 'TRANSACTIONS',
      items: [
        { label: 'Sales Returns', href: '/sales-returns', icon: RotateCcw },
        { label: 'Purchase Returns', href: '/purchase-returns', icon: RotateCcw },
        { label: 'Payment History', href: '/payments', icon: CreditCard },
        { label: 'Invoices & Receipts', href: '/invoices', icon: Receipt },
        { label: 'Khata Ledger', href: '/ledger', icon: BookOpen },
      ],
    },
    {
      title: 'ADMINISTRATION',
      items: [
        { label: 'Users & Staff', href: '/users', icon: UserCheck },
        { label: 'Roles & Permissions', href: '/roles', icon: Shield },
        { label: 'Audit Logs', href: '/audit-logs', icon: FileText },
        { label: 'Notifications', href: '/notifications', icon: Bell },
        { label: 'Business Settings', href: '/settings', icon: Settings },
      ],
    },
  ];

  const isMoreActive = categories.some((cat) =>
    cat.items.some((item) => pathname.startsWith(item.href)),
  );

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={onToggle}
        className={`px-3 py-1.5 text-xs font-semibold rounded-md transition flex items-center gap-1 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 ${
          isOpen || isMoreActive
            ? 'text-indigo-600 bg-indigo-50/80'
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
        }`}
        aria-expanded={isOpen}
      >
        <span>More</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-150 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-[720px] bg-white border border-slate-200/90 rounded-2xl shadow-2xl z-50 p-6 animate-in fade-in zoom-in-95 duration-150 backdrop-blur-md">
          <div className="grid grid-cols-4 gap-6">
            {categories.map((group) => (
              <div key={group.title} className="space-y-3">
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  {group.title}
                </h4>
                <ul className="space-y-1">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={onClose}
                          className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs transition ${
                            active
                              ? 'bg-indigo-50 text-indigo-700 font-semibold'
                              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium'
                          }`}
                        >
                          <Icon className={`w-3.5 h-3.5 shrink-0 ${active ? 'text-indigo-600' : 'text-slate-400'}`} />
                          <span className="truncate">{item.label}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span>Press <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded font-mono text-[10px]">⌘K</kbd> to quickly search all commands</span>
            <span className="text-slate-400">SMS Master Catalog</span>
          </div>
        </div>
      )}
    </div>
  );
}
