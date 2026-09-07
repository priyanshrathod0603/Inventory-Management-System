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
    <header className="sticky top-0 z-30 h-16 bg-white/90 backdrop-blur-md border-b border-border shadow-xs">
      <div className="max-w-[1600px] mx-auto h-full px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-6 shrink-0">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-coral-500 to-coral-600 text-white font-bold text-sm flex items-center justify-center shadow-md shadow-coral-500/25 group-hover:from-coral-600 group-hover:to-coral-700 transition">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
                <path d="m3.3 7 8.7 5 8.7-5" />
                <path d="M12 22V12" />
              </svg>
            </div>
            <div>
              <div className="text-sm font-extrabold text-navy-950 leading-tight tracking-tight font-sans">
                SMS
              </div>
              <div className="text-[10px] text-content-muted font-semibold leading-none uppercase tracking-wider">
                Stock Management System
              </div>
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
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition flex items-center gap-1.5 ${
                    isActive
                      ? 'text-coral-600 bg-coral-50 font-bold border border-coral-200/60'
                      : 'text-content-secondary hover:text-navy-950 hover:bg-surface-subtle font-medium'
                  }`}
                >
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="px-1.5 py-0.5 bg-coral-500 text-white text-[9px] font-bold rounded-full uppercase tracking-wider shadow-xs">
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
        <div className="flex items-center gap-3 shrink-0">
          {/* Global Search Trigger (⌘K) */}
          <button
            type="button"
            onClick={onOpenSearch}
            className="w-36 sm:w-44 lg:w-56 px-3 py-1.5 bg-surface-subtle hover:bg-surface-muted border border-border rounded-full text-xs text-content-muted flex items-center justify-between transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral-500 cursor-pointer"
          >
            <div className="flex items-center gap-2 truncate">
              <Search className="w-3.5 h-3.5 text-content-muted shrink-0" />
              <span className="truncate text-content-secondary">Search commands...</span>
            </div>
            <kbd className="px-1.5 py-0.5 bg-white border border-border text-[10px] font-mono text-content-secondary rounded-full font-semibold shrink-0 shadow-xs">
              ⌘K
            </kbd>
          </button>

          {/* Notifications Trigger */}
          <button
            type="button"
            onClick={onOpenNotifications}
            className="relative p-2 text-content-secondary hover:text-navy-950 rounded-full hover:bg-surface-subtle transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral-500 cursor-pointer"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-coral-500 ring-2 ring-white"></span>
          </button>

          <div className="h-5 w-px bg-border mx-0.5" />

          {/* User Profile Menu */}
          {user && <UserMenu user={user} />}

          {/* Primary Header Action: + New Sale (F2) */}
          <Link
            href="/pos"
            className="pill-btn-coral h-9 px-4 text-white font-semibold text-xs rounded-full shadow-coral flex items-center gap-1.5 transition shrink-0 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Sale</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
