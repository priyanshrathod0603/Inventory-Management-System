'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useCurrentUser } from '../../hooks/use-current-user';
import { hasPermission } from '../../lib/auth/permissions';
import {
  Search,
  LayoutDashboard,
  ShoppingCart,
  Boxes,
  Receipt,
  Truck,
  BarChart3,
  Package,
  Users,
  Building2,
  Warehouse,
  ArrowLeftRight,
  Sliders,
  Clock,
  RotateCcw,
  CreditCard,
  UserCheck,
  FileText,
  Settings,
  X,
  CornerDownLeft,
} from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CommandItem {
  id: string;
  title: string;
  category: 'Quick Actions' | 'Navigation';
  href: string;
  icon: React.ElementType;
  shortcut?: string;
  description?: string;
  requiredPermission?: string;
}

const COMMAND_ITEMS: CommandItem[] = [
  // Quick Actions
  {
    id: 'new-sale',
    title: 'New Counter Sale (POS)',
    category: 'Quick Actions',
    href: '/pos',
    icon: ShoppingCart,
    shortcut: 'F2',
    description: 'Open billing counter terminal',
    requiredPermission: 'create_sale',
  },
  {
    id: 'add-product',
    title: 'Add New Product',
    category: 'Quick Actions',
    href: '/products',
    icon: Package,
    description: 'Create new catalog SKU & barcode',
    requiredPermission: 'create_product',
  },
  {
    id: 'stock-adjustment',
    title: 'Record Stock Adjustment',
    category: 'Quick Actions',
    href: '/stock-adjustments',
    icon: Sliders,
    description: 'Audit damage, shrinkage, or physical count',
    requiredPermission: 'adjust_stock',
  },
  {
    id: 'record-purchase',
    title: 'Record Supplier Purchase',
    category: 'Quick Actions',
    href: '/purchases',
    icon: Truck,
    description: 'Inward inventory shipment',
    requiredPermission: 'create_purchase',
  },
  {
    id: 'record-payment',
    title: 'Record Customer / Supplier Payment',
    category: 'Quick Actions',
    href: '/payments',
    icon: CreditCard,
    description: 'Credit khata settlement or vendor payout',
    requiredPermission: 'record_payment',
  },

  // Navigation
  {
    id: 'nav-dashboard',
    title: 'Operations Dashboard',
    category: 'Navigation',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    id: 'nav-pos',
    title: 'POS Billing Terminal',
    category: 'Navigation',
    href: '/pos',
    icon: ShoppingCart,
  },
  {
    id: 'nav-inventory',
    title: 'Inventory & Stock Valuations',
    category: 'Navigation',
    href: '/inventory',
    icon: Boxes,
  },
  {
    id: 'nav-sales',
    title: 'Sales Register & Invoices',
    category: 'Navigation',
    href: '/sales',
    icon: Receipt,
  },
  {
    id: 'nav-purchases',
    title: 'Purchase Orders & Inward Bills',
    category: 'Navigation',
    href: '/purchases',
    icon: Truck,
  },
  {
    id: 'nav-reports',
    title: 'Reports & Business Intelligence',
    category: 'Navigation',
    href: '/reports',
    icon: BarChart3,
  },
  {
    id: 'nav-products',
    title: 'Product Catalog',
    category: 'Navigation',
    href: '/products',
    icon: Package,
  },
  {
    id: 'nav-customers',
    title: 'Customer CRM & Khata Ledger',
    category: 'Navigation',
    href: '/customers',
    icon: Users,
  },
  {
    id: 'nav-suppliers',
    title: 'Supplier Directory & Payables',
    category: 'Navigation',
    href: '/suppliers',
    icon: Building2,
  },
  {
    id: 'nav-warehouses',
    title: 'Warehouse Locations & Stock Transfers',
    category: 'Navigation',
    href: '/warehouses',
    icon: Warehouse,
  },
  {
    id: 'nav-movements',
    title: 'Stock Movement Ledger (Audit)',
    category: 'Navigation',
    href: '/stock-movements',
    icon: ArrowLeftRight,
  },
  {
    id: 'nav-batches',
    title: 'Batch & Expiry Tracker',
    category: 'Navigation',
    href: '/batches',
    icon: Clock,
  },
  {
    id: 'nav-returns',
    title: 'Sales & Purchase Returns',
    category: 'Navigation',
    href: '/sales-returns',
    icon: RotateCcw,
  },
  {
    id: 'nav-users',
    title: 'Users & Staff Management',
    category: 'Navigation',
    href: '/users',
    icon: UserCheck,
  },
  {
    id: 'nav-audit',
    title: 'System Audit Logs',
    category: 'Navigation',
    href: '/audit-logs',
    icon: FileText,
  },
  {
    id: 'nav-settings',
    title: 'Store Settings & Tax Config',
    category: 'Navigation',
    href: '/settings',
    icon: Settings,
  },
];

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const { data: user } = useCurrentUser();

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  const filteredItems = COMMAND_ITEMS.filter((item) => {
    if (item.requiredPermission && !hasPermission(user, item.requiredPermission)) {
      return false;
    }
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return (
      item.title.toLowerCase().includes(q) ||
      (item.description && item.description.toLowerCase().includes(q)) ||
      item.category.toLowerCase().includes(q)
    );
  });

  const handleSelect = (item: CommandItem) => {
    onClose();
    router.push(item.href);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1 < filteredItems.length ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 >= 0 ? prev - 1 : filteredItems.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        handleSelect(filteredItems[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-navy-950/40 backdrop-blur-sm z-50 flex items-start justify-center pt-20 px-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-white border border-border rounded-[24px] shadow-modal overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-5 py-4 border-b border-border gap-3 bg-surface">
          <Search className="w-5 h-5 text-content-muted shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a command or jump to page..."
            className="w-full text-sm text-navy-950 placeholder:text-content-muted bg-transparent outline-none font-medium"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 text-content-muted hover:text-navy-950 rounded-full hover:bg-surface-subtle"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <kbd className="px-2 py-0.5 bg-surface-subtle border border-border text-[10px] font-mono text-content-secondary rounded-full font-semibold">
              ESC
            </kbd>
          )}
        </div>

        {/* Results List */}
        <div ref={listRef} className="max-h-[380px] overflow-y-auto p-2.5 divide-y divide-surface-subtle">
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-xs text-content-muted">
              No matching actions or pages found for &quot;{query}&quot;
            </div>
          ) : (
            <div className="space-y-1">
              {filteredItems.map((item, index) => {
                const isSelected = index === selectedIndex;
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelect(item)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-left transition cursor-pointer ${
                      isSelected
                        ? 'bg-coral-50/90 text-navy-950 font-semibold'
                        : 'text-content-secondary hover:bg-surface-subtle font-medium'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition ${
                          isSelected
                            ? 'bg-coral-500 text-white shadow-xs'
                            : 'bg-surface-subtle text-content-secondary'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs truncate font-semibold text-navy-950">{item.title}</div>
                        {item.description && (
                          <div className="text-[11px] text-content-muted font-normal truncate">
                            {item.description}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 ml-3">
                      {item.shortcut && (
                        <span className="px-2 py-0.5 bg-surface-subtle border border-border text-[10px] font-mono text-content-secondary rounded-full font-semibold">
                          {item.shortcut}
                        </span>
                      )}
                      {isSelected && (
                        <CornerDownLeft className="w-3.5 h-3.5 text-coral-500" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-5 py-3 bg-surface-subtle/80 border-t border-border-subtle flex items-center justify-between text-[11px] text-content-muted">
          <div className="flex items-center gap-3">
            <span><kbd className="px-1.5 py-0.5 bg-white border border-border rounded-md text-[10px]">↑↓</kbd> navigate</span>
            <span><kbd className="px-1.5 py-0.5 bg-white border border-border rounded-md text-[10px]">↵</kbd> select</span>
            <span><kbd className="px-1.5 py-0.5 bg-white border border-border rounded-md text-[10px]">esc</kbd> close</span>
          </div>
          <span className="font-semibold text-content-muted">Inventory Command Palette</span>
        </div>
      </div>
    </div>
  );
}
