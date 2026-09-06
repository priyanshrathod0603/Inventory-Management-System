import React from 'react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-[#0C0A09] text-slate-100 flex flex-col justify-center items-center p-3 sm:p-6 lg:p-10 selection:bg-orange-500 selection:text-white">
      {/* Dynamic Ambient Background Canvas */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
        {/* Soft Warm Radial Ambient Glows matching screenshot */}
        <div className="absolute -top-[20%] left-1/4 w-[800px] h-[600px] bg-gradient-to-b from-orange-600/10 via-rose-900/5 to-transparent rounded-full blur-[140px]" />
        <div className="absolute -bottom-[20%] right-1/4 w-[700px] h-[600px] bg-gradient-to-tl from-amber-600/10 via-slate-900/5 to-transparent rounded-full blur-[140px]" />
      </div>

      {/* Main Authentication Flow Canvas */}
      <main className="relative z-10 w-full max-w-[1240px] my-auto flex items-center justify-center">
        {children}
      </main>
    </div>
  );
}



