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
  Menu,
  X,
} from 'lucide-react';

interface AppHeaderProps {
  onOpenSearch: () => void;
  onOpenNotifications: () => void;
}

export function AppHeader({ onOpenSearch, onOpenNotifications }: AppHeaderProps) {
  const pathname = usePathname();
  const { user } = useAuth();
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'POS', href: '/pos', icon: ShoppingCart, badge: 'LIVE' },
    { label: 'Inventory', href: '/inventory', icon: Boxes },
    { label: 'Sales', href: '/sales', icon: Receipt },
    { label: 'Purchases', href: '/purchases', icon: Truck },
    { label: 'Reports', href: '/reports', icon: BarChart3 },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-[#EAE5E0] shadow-[0_2px_12px_-2px_rgba(17,23,34,0.03)] h-16 sm:h-[70px] flex items-center transition-none">
      <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 lg:gap-8">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-3 shrink-0">
          <Link href="/dashboard" className="flex items-center gap-3 shrink-0 group select-none">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#FF7048] to-[#F55F34] text-white flex items-center justify-center shadow-sm shadow-[#FF7048]/25 group-hover:scale-105 transition-transform duration-200">
              <svg
                className="w-5 h-5 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
                <path d="m3.3 7 8.7 5 8.7-5" />
                <path d="M12 22V12" />
              </svg>
            </div>
            <div>
              <div className="text-sm sm:text-base font-extrabold text-[#111722] tracking-tight font-sans leading-none">
                IMS
              </div>
              <div className="text-[9px] text-[#8C9097] font-semibold tracking-wider uppercase leading-none mt-1 hidden sm:block">
                Inventory Management System
              </div>
            </div>
          </Link>
        </div>

        {/* Center: Unified Navigation Bar with Smooth Text & Background Transitions */}
        <nav
          className="hidden lg:flex items-center gap-0.5 p-1 rounded-full bg-[#FAF7F4] border border-[#EAE5E0] relative shadow-xs select-none"
          aria-label="Main Navigation"
        >
          {navLinks.map((link) => {
            const isActive =
              pathname === link.href ||
              (link.href !== '/dashboard' && pathname.startsWith(`${link.href}/`));

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3.5 py-1.5 text-xs sm:text-sm rounded-full flex items-center gap-1.5 cursor-pointer select-none transition-colors duration-180 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral-500 ${
                  isActive
                    ? 'bg-[#111722] text-white font-semibold shadow-xs'
                    : 'text-[#5F636B] font-medium hover:text-[#111722] hover:bg-black/[0.04]'
                }`}
              >
                <span>{link.label}</span>
                {link.badge && (
                  <span
                    className={`px-1.5 py-0.5 text-[8.5px] font-extrabold rounded-full uppercase tracking-wider leading-none transition-colors duration-180 ${
                      isActive
                        ? 'bg-coral-500 text-white'
                        : 'bg-coral-50 text-coral-600 border border-coral-200/80'
                    }`}
                  >
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

        {/* Right Action Tools — Uniform Heights & Alignment */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          {/* Global Search Trigger (⌘K) */}
          <button
            type="button"
            onClick={onOpenSearch}
            className="h-9 px-3.5 bg-[#FAF7F4] hover:bg-[#F3EDE7] border border-[#EAE5E0] rounded-full text-xs text-[#5F636B] flex items-center justify-between gap-3 transition duration-150 shadow-xs w-28 sm:w-44 xl:w-48 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral-500"
            aria-label="Search system"
          >
            <div className="flex items-center gap-2 truncate">
              <Search className="w-3.5 h-3.5 text-[#8C9097] shrink-0" />
              <span className="truncate text-[#8C9097] hidden sm:inline">Search...</span>
            </div>
            <kbd className="px-1.5 py-0.5 bg-white border border-[#EAE5E0] text-[9px] font-mono text-[#5F636B] rounded-md font-semibold shrink-0 shadow-xs hidden sm:inline">
              ⌘K
            </kbd>
          </button>

          {/* Notifications Trigger */}
          <button
            type="button"
            onClick={onOpenNotifications}
            className="h-9 w-9 rounded-full border border-[#EAE5E0] bg-[#FAF7F4] hover:bg-[#F3EDE7] text-[#111722] flex items-center justify-center transition duration-150 shadow-xs relative cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral-500"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4 text-[#5F636B]" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-coral-500 ring-2 ring-white" />
          </button>

          <div className="h-5 w-px bg-[#EAE5E0] hidden sm:block" />

          {/* User Profile Menu */}
          {user && <UserMenu user={user} />}

          {/* Primary Header Action: + New Sale (F2) */}
          <Link
            href="/pos"
            className="pill-btn-coral h-9 px-4 text-white font-semibold text-xs rounded-full shadow-coral hover:shadow-coral-lg flex items-center gap-1.5 transition-all duration-150 hover:-translate-y-0.5 active:translate-y-0 shrink-0 cursor-pointer select-none"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">New Sale</span>
            <span className="sm:hidden">Sale</span>
          </Link>

          {/* Mobile Menu Toggle Button (for <lg viewports) */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden h-9 w-9 rounded-full border border-[#EAE5E0] bg-[#FAF7F4] hover:bg-[#F3EDE7] text-[#111722] flex items-center justify-center transition duration-150 shadow-xs cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral-500"
            aria-label="Toggle navigation menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile & Tablet Drawer Sheet (<lg screens) */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white/98 backdrop-blur-xl border-b border-[#EAE5E0] p-4 sm:p-6 shadow-[0_20px_40px_-10px_rgba(17,23,34,0.12)] space-y-4 animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-150 max-h-[calc(100vh-70px)] overflow-y-auto">
          {/* Primary Routes */}
          <div className="space-y-1">
            <h4 className="text-[10px] font-extrabold text-[#8C9097] uppercase tracking-wider px-2 pb-1">
              Main Navigation
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive =
                  pathname === link.href ||
                  (link.href !== '/dashboard' && pathname.startsWith(`${link.href}/`));

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
                      isActive
                        ? 'bg-[#111722] text-white shadow-xs'
                        : 'bg-[#FAF7F4] text-[#5F636B] hover:text-[#111722] hover:bg-[#F3EDE7]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{link.label}</span>
                    </div>
                    {link.badge && (
                      <span className="px-1.5 py-0.5 bg-coral-500 text-white text-[8.5px] font-extrabold rounded-full">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Quick Search trigger in mobile */}
          <button
            type="button"
            onClick={() => {
              setIsMobileMenuOpen(false);
              onOpenSearch();
            }}
            className="w-full flex items-center justify-between px-3.5 py-2.5 bg-[#FAF7F4] hover:bg-[#F3EDE7] border border-[#EAE5E0] rounded-xl text-xs text-[#5F636B] transition cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-[#8C9097]" />
              <span className="font-semibold text-[#111722]">Search Commands &amp; Modules</span>
            </div>
            <kbd className="px-1.5 py-0.5 bg-white border border-[#EAE5E0] text-[9px] font-mono text-[#5F636B] rounded-md font-semibold">
              ⌘K
            </kbd>
          </button>
        </div>
      )}
    </header>
  );
}

