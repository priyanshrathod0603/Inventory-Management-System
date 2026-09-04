export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-[#F8FAFC]">
      <div className="max-w-md w-full bg-white rounded-xl border border-slate-200 p-8 shadow-sm text-center">
        <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center mx-auto mb-4 font-bold text-xl">
          SMS
        </div>
        <h1 className="text-xl font-bold text-slate-900 mb-2">
          Stock Management System (SMS)
        </h1>
        <p className="text-sm text-slate-500 mb-6">
          Phase 1 Repository & Application Foundation Initialized. Ready for module implementation.
        </p>
        <div className="flex items-center justify-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 py-1.5 px-3 rounded-full">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Foundation Operational
        </div>
      </div>
    </main>
  );
}
