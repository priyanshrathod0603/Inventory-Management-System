import React from 'react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 selection:bg-indigo-500 selection:text-white">
      <div className="w-full max-w-md">
        {children}
      </div>
      <div className="mt-8 text-center text-xs text-slate-500 font-medium">
        © 2026 Stock Management System (SMS). High-Performance POS & Operations Engine.
      </div>
    </div>
  );
}
