import React from 'react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-[#090D16] text-slate-100 flex flex-col justify-center items-center p-3 sm:p-6 lg:p-10 selection:bg-indigo-500 selection:text-white">
      {/* Dynamic Ambient Background Canvas */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
        {/* Soft Indigo / Violet Radial Ambient Glows matching app theme */}
        <div className="absolute -top-[20%] left-1/4 w-[850px] h-[650px] bg-gradient-to-b from-indigo-600/12 via-indigo-950/20 to-transparent rounded-full blur-[140px]" />
        <div className="absolute -bottom-[20%] right-1/4 w-[750px] h-[650px] bg-gradient-to-tl from-violet-600/10 via-slate-900/15 to-transparent rounded-full blur-[140px]" />
      </div>

      {/* Main Authentication Flow Canvas */}
      <main className="relative z-10 w-full max-w-[1240px] my-auto flex items-center justify-center">
        {children}
      </main>
    </div>
  );
}




