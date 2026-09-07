'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuth, AuthUser } from '../../lib/auth/auth-context';
import { LogOut, User, Settings, Shield, ChevronDown } from 'lucide-react';

interface UserMenuProps {
  user: AuthUser;
}

export function UserMenu({ user }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useAuth();
  const menuRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
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
  }, [isOpen]);

  const roleBadgeColor =
    user.role === 'Admin'
      ? 'bg-coral-50 text-coral-700 border-coral-200'
      : user.role === 'Manager'
      ? 'bg-amber-50 text-amber-700 border-amber-200'
      : 'bg-surface-subtle text-navy-800 border-border';

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 p-1 rounded-full hover:bg-surface-subtle transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral-500 cursor-pointer"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="text-left hidden sm:block">
          <p className="text-xs font-bold text-navy-950 leading-tight max-w-[120px] truncate font-sans">{user.fullName}</p>
          <span className={`inline-block px-1.5 py-0.5 text-[9px] font-extrabold rounded-full border uppercase tracking-wider ${roleBadgeColor}`}>
            {user.role}
          </span>
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-content-muted transition-transform duration-150 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white border border-border rounded-2xl shadow-popover z-50 py-1.5 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-4 py-3 border-b border-border-subtle bg-surface-subtle/80 rounded-t-2xl">
            <p className="text-sm font-bold text-navy-950 font-sans">{user.fullName}</p>
            <p className="text-xs text-content-muted font-mono truncate">{user.email}</p>
            <div className="mt-2 flex items-center gap-1.5">
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-bold rounded-full border ${roleBadgeColor}`}>
                <Shield className="w-3 h-3" />
                {user.role}
              </span>
            </div>
          </div>

          <div className="py-1">
            <Link
              href="/settings"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-content-secondary hover:text-navy-950 hover:bg-surface-subtle transition"
            >
              <User className="w-4 h-4 text-content-muted" />
              <span>Profile &amp; Account</span>
            </Link>
            <Link
              href="/settings"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-content-secondary hover:text-navy-950 hover:bg-surface-subtle transition"
            >
              <Settings className="w-4 h-4 text-content-muted" />
              <span>Store Settings</span>
            </Link>
          </div>

          <div className="border-t border-border-subtle pt-1">
            <button
              type="button"
              onClick={async () => {
                setIsOpen(false);
                await logout();
              }}
              className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-danger-600 hover:bg-danger-50 transition cursor-pointer"
            >
              <LogOut className="w-4 h-4 text-danger-500" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
