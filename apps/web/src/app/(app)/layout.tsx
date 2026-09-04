'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../../lib/auth/auth-context';
import { AppHeader } from '../../components/layout/app-header';
import { CommandPalette } from '../../components/layout/command-palette';
import { NotificationsDrawer } from '../../components/layout/notifications-drawer';
import { Loader2 } from 'lucide-react';

export default function AuthenticatedAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Client-side authentication guard
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  // Global keyboard shortcuts (⌘K / Ctrl+K and F2)
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      } else if (e.key === 'F2') {
        e.preventDefault();
        router.push('/pos');
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [router]);

  // Loading skeleton state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-200" />
            <div className="w-24 h-4 bg-slate-200 rounded" />
          </div>
          <div className="flex items-center gap-3">
            <div className="w-40 h-8 bg-slate-100 rounded-lg" />
            <div className="w-8 h-8 rounded-full bg-slate-200" />
          </div>
        </header>
        <main className="flex-1 max-w-[1600px] w-full mx-auto p-6">
          <div className="space-y-4 animate-pulse">
            <div className="h-8 bg-slate-200 rounded w-1/4" />
            <div className="h-4 bg-slate-100 rounded w-1/3" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-28 bg-white border border-slate-200 rounded-xl p-4" />
              ))}
            </div>
            <div className="h-64 bg-white border border-slate-200 rounded-xl mt-6" />
          </div>
        </main>
      </div>
    );
  }

  // If unauthenticated, return null while redirecting
  if (!user) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-indigo-600 animate-spin" />
      </div>
    );
  }

  const isPosPage = pathname === '/pos';

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-slate-900 antialiased">
      {/* Top Application Header */}
      <AppHeader
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
      />

      {/* Main Application Canvas */}
      <main
        className={`flex-1 w-full mx-auto ${
          isPosPage
            ? 'p-3 max-w-[1920px]'
            : 'max-w-[1600px] p-4 sm:p-6'
        }`}
      >
        {children}
      </main>

      {/* Global Command Palette Overlay (⌘K) */}
      <CommandPalette
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      {/* Notification Center Drawer */}
      <NotificationsDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />
    </div>
  );
}
