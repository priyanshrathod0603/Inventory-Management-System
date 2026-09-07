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
  BookOpen,
  UserCheck,
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

export function MoreMenu({
  isOpen,
  onToggle,
  onClose,
}: MoreMenuProps) {
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
        { label: 'Audit Logs', href: '/audit-logs', icon: FileText },
        { label: 'Notifications', href: '/notifications', icon: Bell },
        { label: 'Business Settings', href: '/settings', icon: Settings },
      ],
    },
  ];

  const isMoreActive = categories.some((cat) =>
    cat.items.some((item) => pathname === item.href || pathname.startsWith(`${item.href}/`)),
  );

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={onToggle}
        className={`px-3.5 py-1.5 text-xs sm:text-sm rounded-full flex items-center gap-1.5 cursor-pointer select-none transition-colors duration-180 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral-500 ${
          isMoreActive && !isOpen
            ? 'bg-[#111722] text-white font-semibold shadow-xs'
            : isOpen
            ? 'bg-black/[0.06] text-[#111722] font-semibold'
            : 'text-[#5F636B] font-medium hover:text-[#111722] hover:bg-black/[0.04]'
        }`}
        aria-expanded={isOpen}
      >
        <span>More</span>
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute left-1/2 -translate-x-1/2 mt-3 w-[760px] max-w-[92vw] bg-white border border-[#EAE5E0] rounded-[28px] shadow-[0_24px_60px_-12px_rgba(17,23,34,0.14),0_8px_24px_-4px_rgba(17,23,34,0.06)] z-50 p-6 animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {categories.map((group) => (
              <div key={group.title} className="space-y-3">
                <h4 className="text-[10px] font-extrabold text-[#8C9097] uppercase tracking-wider">
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
                          className={`flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-xs transition-all duration-180 ${
                            active
                              ? 'bg-coral-50 text-coral-700 font-bold shadow-xs'
                              : 'text-content-secondary hover:text-[#111722] hover:bg-[#FAF7F4] font-medium hover:translate-x-0.5'
                          }`}
                        >
                          <Icon
                            className={`w-3.5 h-3.5 shrink-0 ${
                              active ? 'text-coral-500' : 'text-[#8C9097]'
                            }`}
                          />
                          <span className="truncate">{item.label}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-5 pt-3.5 border-t border-[#EAE5E0]/70 flex items-center justify-between text-[11px] text-[#8C9097]">
            <div className="flex items-center gap-1.5">
              <span>Press</span>
              <kbd className="px-1.5 py-0.5 bg-[#FAF7F4] border border-[#EAE5E0] rounded-full font-mono text-[10px] text-[#111722] font-semibold">
                ⌘K
              </kbd>
              <span>to search all modules &amp; actions</span>
            </div>
            <span className="font-semibold text-[#8C9097] hidden sm:inline">Inventory Master Catalog</span>
          </div>
        </div>
      )}
    </div>
  );
}
