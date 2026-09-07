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

  const initials = user.fullName
    ? user.fullName
        .trim()
        .split(/\s+/)
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'U';

  const roleBadgeColor =
    user.role === 'Admin'
      ? 'bg-coral-50 text-coral-700 border-coral-200'
      : user.role === 'Manager'
      ? 'bg-amber-50 text-amber-700 border-amber-200'
      : 'bg-[#FAF7F4] text-[#111722] border-[#EAE5E0]';

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="h-9 px-2.5 sm:px-3 bg-[#FAF7F4] hover:bg-[#F2ECE6] border border-[#EAE5E0] rounded-full flex items-center gap-2 transition duration-150 shadow-xs cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral-500 select-none"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="User account menu"
      >
        <div className="w-6 h-6 rounded-full bg-coral-100 text-coral-700 text-[10px] font-extrabold flex items-center justify-center shrink-0 border border-coral-200/80 shadow-2xs">
          {initials}
        </div>
        <div className="text-left hidden md:flex items-center gap-1.5">
          <span className="text-xs font-semibold text-[#111722] leading-none max-w-[110px] truncate font-sans">
            {user.fullName}
          </span>
          <span
            className={`px-1.5 py-0.5 text-[8.5px] font-extrabold rounded-full border uppercase tracking-wider leading-none ${roleBadgeColor}`}
          >
            {user.role}
          </span>
        </div>
        <ChevronDown
          className={`w-3.5 h-3.5 text-[#8C9097] transition-transform duration-200 shrink-0 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-64 bg-white border border-[#EAE5E0] rounded-[24px] shadow-[0_20px_40px_-10px_rgba(17,23,34,0.12),0_4px_16px_-2px_rgba(17,23,34,0.04)] z-50 p-2 animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-200">
          <div className="px-3.5 py-3 bg-[#FAF7F4] rounded-[18px] mb-1 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-coral-100 text-coral-700 text-xs font-extrabold flex items-center justify-center shrink-0 border border-coral-200 shadow-2xs">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-[#111722] font-sans truncate">{user.fullName}</p>
              <p className="text-[11px] text-[#8C9097] font-mono truncate">{user.email}</p>
              <div className="mt-1 flex items-center gap-1">
                <span
                  className={`inline-flex items-center gap-1 px-1.5 py-0.5 text-[9px] font-bold rounded-full border ${roleBadgeColor}`}
                >
                  <Shield className="w-2.5 h-2.5" />
                  {user.role}
                </span>
              </div>
            </div>
          </div>

          <div className="py-1 space-y-0.5">
            <Link
              href="/settings"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-content-secondary hover:text-[#111722] hover:bg-[#FAF7F4] rounded-xl transition"
            >
              <User className="w-4 h-4 text-[#8C9097]" />
              <span>Profile &amp; Account</span>
            </Link>
            <Link
              href="/settings"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-content-secondary hover:text-[#111722] hover:bg-[#FAF7F4] rounded-xl transition"
            >
              <Settings className="w-4 h-4 text-[#8C9097]" />
              <span>Store Settings</span>
            </Link>
          </div>

          <div className="border-t border-[#EAE5E0]/70 pt-1 mt-1">
            <button
              type="button"
              onClick={async () => {
                setIsOpen(false);
                await logout();
              }}
              className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-danger-600 hover:bg-danger-50 rounded-xl transition cursor-pointer"
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
