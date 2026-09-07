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
        <header className="sticky top-0 z-40 w-full bg-white/95 border-b border-[#EAE5E0] h-16 sm:h-[70px] flex items-center animate-pulse">
          <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-surface-muted" />
              <div className="w-28 h-4 bg-surface-muted rounded-full hidden sm:block" />
            </div>
            <div className="flex items-center gap-3">
              <div className="w-40 h-9 bg-surface-subtle rounded-full hidden lg:block" />
              <div className="w-9 h-9 rounded-full bg-surface-muted" />
              <div className="w-24 h-9 rounded-full bg-coral-100" />
            </div>
          </div>
        </header>
        <main className="flex-1 max-w-[1600px] w-full mx-auto p-4 sm:p-6">
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
