export default function AppShell({ userName, onSignOut, children, active = "dashboard" }) {
  return (
    <div className="min-h-screen w-full bg-slate-50">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden md:flex md:w-64 lg:w-72 flex-col border-r bg-white">
          <div className="px-6 py-6 border-b">
            <div className="text-xl font-bold text-slate-900">Task Manager</div>
            <div className="text-sm text-slate-500 mt-1">Portfolio Project</div>
          </div>

          <nav className="px-3 py-4 space-y-1">
            <a
              className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm ${
                active === "dashboard"
                  ? "bg-blue-50 text-blue-700 border border-blue-100"
                  : "text-slate-700 hover:bg-slate-50"
              }`}
              href="/dashboard"
            >
              <span className="text-base">📋</span>
              <span>Dashboard</span>
            </a>

            <div className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-400">
              <span className="text-base">🧪</span>
              <span>Tests (coming)</span>
            </div>

            <div className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-400">
              <span className="text-base">⚙️</span>
              <span>Settings (coming)</span>
            </div>
          </nav>

          <div className="mt-auto border-t px-6 py-5">
            <div className="text-sm text-slate-700">
              Signed in as <span className="font-medium">{userName}</span>
            </div>
            <button
              onClick={onSignOut}
              className="mt-3 w-full rounded-xl border bg-white px-4 py-2 text-sm hover:bg-slate-50"
            >
              Sign out
            </button>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1">
          {/* Top bar (mobile + desktop) */}
          <header className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur">
            <div className="px-4 py-4 md:px-8 flex items-center justify-between">
              <div className="md:hidden">
                <div className="text-lg font-bold text-slate-900">Task Manager</div>
                <div className="text-xs text-slate-500">Portfolio Project</div>
              </div>

              <div className="hidden md:block text-sm text-slate-600">
                Welcome back, <span className="font-medium text-slate-900">{userName}</span>
              </div>

              <button
                onClick={onSignOut}
                className="md:hidden rounded-xl border bg-white px-3 py-2 text-sm hover:bg-slate-50"
              >
                Sign out
              </button>
            </div>
          </header>

          {/* Content */}
          <div className="px-4 py-6 md:px-8 md:py-8">{children}</div>
        </main>
      </div>
    </div>
  );
}