'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../lib/auth/auth-context';
import { MoreMenu } from './more-menu';
import { UserMenu } from './user-menu';
import {
  Search,
  Bell,
  Plus,
  LayoutDashboard,
  ShoppingCart,
  Boxes,
  Receipt,
  Truck,
  BarChart3,
} from 'lucide-react';

interface AppHeaderProps {
  onOpenSearch: () => void;
  onOpenNotifications: () => void;
}

export function AppHeader({ onOpenSearch, onOpenNotifications }: AppHeaderProps) {
  const pathname = usePathname();
  const { user } = useAuth();
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const navLinks = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'POS', href: '/pos', icon: ShoppingCart, badge: 'Live' },
    { label: 'Inventory', href: '/inventory', icon: Boxes },
    { label: 'Sales', href: '/sales', icon: Receipt },
    { label: 'Purchases', href: '/purchases', icon: Truck },
    { label: 'Reports', href: '/reports', icon: BarChart3 },
  ];

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-[1600px] mx-auto h-full px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-6 shrink-0">
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-bold text-sm flex items-center justify-center shadow-xs shadow-indigo-200 group-hover:bg-indigo-700 transition">
              SMS
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900 leading-tight tracking-tight">SMS</div>
              <div className="text-[10px] text-slate-400 font-medium leading-none">Stock Management System</div>
            </div>
          </Link>

          {/* Center Navigation Bar */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/dashboard' && pathname.startsWith(`${link.href}/`));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition flex items-center gap-1.5 ${
                    isActive
                      ? 'text-indigo-600 bg-indigo-50/80 border-b-2 border-indigo-600'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-700 text-[9px] font-bold rounded-full uppercase tracking-wider">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}

            <MoreMenu
              isOpen={isMoreOpen}
              onToggle={() => setIsMoreOpen(!isMoreOpen)}
              onClose={() => setIsMoreOpen(false)}
            />
          </nav>
        </div>

        {/* Right Action Tools */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Global Search Trigger */}
          <button
            type="button"
            onClick={onOpenSearch}
            className="w-40 lg:w-56 px-2.5 py-1.5 bg-slate-100/90 hover:bg-slate-200/70 border border-slate-200/80 rounded-lg text-xs text-slate-400 flex items-center justify-between transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 cursor-pointer"
          >
            <div className="flex items-center gap-2 truncate">
              <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">Search commands...</span>
            </div>
            <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 text-[10px] font-mono text-slate-500 rounded font-semibold shrink-0">
              ⌘K
            </kbd>
          </button>

          {/* Notifications Trigger */}
          <button
            type="button"
            onClick={onOpenNotifications}
            className="relative p-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 cursor-pointer"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-600 ring-2 ring-white"></span>
          </button>

          <div className="h-5 w-px bg-slate-200 mx-0.5" />

          {/* User Profile Menu */}
          {user && <UserMenu user={user} />}

          {/* Primary Action: + New Sale */}
          <Link
            href="/pos"
            className="h-9 px-3.5 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white font-semibold text-xs rounded-lg shadow-xs shadow-indigo-200 flex items-center gap-1.5 transition shrink-0 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Sale</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
