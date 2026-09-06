import React from 'react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-[#F8FAFC] text-slate-900 flex flex-col justify-between items-center p-3 sm:p-6 lg:p-8 selection:bg-indigo-500 selection:text-white">
      {/* Dynamic Ambient Background Canvas */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
        {/* Soft Radial Ambient Lights */}
        <div className="absolute -top-[20%] left-1/2 -translate-x-1/2 w-[900px] h-[650px] bg-gradient-to-b from-indigo-200/50 via-indigo-100/30 to-transparent rounded-full blur-[90px] animate-pulse-glow" />
        <div className="absolute -bottom-[20%] -right-[10%] w-[600px] h-[600px] bg-gradient-to-tl from-emerald-100/40 via-teal-50/20 to-transparent rounded-full blur-[100px]" />
        <div className="absolute top-[35%] -left-[15%] w-[550px] h-[550px] bg-gradient-to-br from-indigo-100/35 via-purple-50/15 to-transparent rounded-full blur-[110px]" />

        {/* Micro-dot Operations Grid */}
        <div className="absolute inset-0 bg-operations-grid opacity-60" />
      </div>

      {/* Main Authentication Flow Canvas */}
      <main className="relative z-10 w-full max-w-5xl my-auto py-2 flex items-center justify-center">
        {children}
      </main>

      {/* Minimal and Clean Enterprise Footer */}
      <footer className="relative z-10 w-full max-w-5xl pt-4 pb-2 text-center">
        <div className="text-xs text-slate-400 font-medium">
          © 2026 Stock Management System (SMS). All rights reserved.
        </div>
      </footer>
    </div>
  );
}

