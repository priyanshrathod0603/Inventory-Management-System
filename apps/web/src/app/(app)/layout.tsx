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
      <div className="min-h-screen bg-[#FCF9F6] flex flex-col">
        <header className="h-16 bg-white/90 border-b border-border px-6 flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-surface-muted" />
            <div className="w-28 h-4 bg-surface-muted rounded-full" />
          </div>
          <div className="flex items-center gap-3">
            <div className="w-44 h-8 bg-surface-subtle rounded-full" />
            <div className="w-8 h-8 rounded-full bg-surface-muted" />
          </div>
        </header>
        <main className="flex-1 max-w-[1600px] w-full mx-auto p-6">
          <div className="space-y-4 animate-pulse">
            <div className="h-8 bg-surface-muted rounded-full w-1/4" />
            <div className="h-4 bg-surface-subtle rounded-full w-1/3" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-28 bg-white border border-border rounded-[20px] p-4 shadow-card" />
              ))}
            </div>
            <div className="h-64 bg-white border border-border rounded-[24px] mt-6 shadow-card" />
          </div>
        </main>
      </div>
    );
  }

  // If unauthenticated, return loader while redirecting
  if (!user) {
    return (
      <div className="min-h-screen bg-[#FCF9F6] flex items-center justify-center">
        <Loader2 className="w-7 h-7 text-coral-500 animate-spin" />
      </div>
    );
  }

  const isPosPage = pathname === '/pos';

  return (
    <div className="min-h-screen bg-[#FCF9F6] flex flex-col font-sans text-navy-950 antialiased">
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
