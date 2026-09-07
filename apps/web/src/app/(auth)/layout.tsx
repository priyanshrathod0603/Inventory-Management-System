import React from 'react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-[#FCF9F6] bg-subtle-grid text-navy-950 flex flex-col justify-center items-center p-3 sm:p-6 lg:p-10 selection:bg-coral-100 selection:text-coral-900">
      {/* Subtle Warm Ambient Glows */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-[15%] left-1/3 w-[800px] h-[600px] bg-gradient-to-b from-coral-200/20 via-coral-50/10 to-transparent rounded-full blur-[130px]" />
        <div className="absolute -bottom-[20%] right-1/4 w-[700px] h-[600px] bg-gradient-to-tl from-amber-100/30 via-orange-50/20 to-transparent rounded-full blur-[140px]" />
      </div>

      {/* Main Authentication Flow Canvas */}
      <main className="relative z-10 w-full max-w-[1240px] my-auto flex items-center justify-center">
        {children}
      </main>

      {/* Minimal Warm Enterprise Footer */}
      <footer className="relative z-10 mt-8 text-center text-xs text-content-muted">
        <p>© 2026 Inventory Management System (IMS). High-Velocity Inventory &amp; Retail POS Platform.</p>
      </footer>
    </div>
  );
}
