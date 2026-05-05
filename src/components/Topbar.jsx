import { Bell, Search, Command } from 'lucide-react';

export default function Topbar({ page }) {
  const date = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'short', day: 'numeric', year: 'numeric',
  });

  return (
    <div className="px-6 lg:px-10 pt-7 pb-5 max-w-[1380px] mx-auto">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-violet-700/60 mb-1">
            {date}
          </div>
          <h1 className="editorial text-3xl lg:text-[2.4rem] leading-none">{page}</h1>
        </div>

        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="hidden md:flex items-center gap-2 bg-white/60 backdrop-blur-sm border border-violet-500/10 rounded-xl px-3 py-2 w-64 hover:border-violet-500/20 transition">
            <Search className="w-4 h-4 text-ink-700/50" />
            <input
              placeholder="Search…"
              className="bg-transparent outline-none text-sm flex-1 placeholder:text-ink-700/40"
            />
            <div className="flex items-center gap-1 text-[10px] text-ink-700/40 font-mono">
              <Command className="w-3 h-3" />K
            </div>
          </div>

          {/* Bell */}
          <button className="relative w-10 h-10 rounded-xl bg-white/60 border border-violet-500/10 hover:border-violet-500/20 flex items-center justify-center transition">
            <Bell className="w-4 h-4 text-ink-700" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-amber-500 rounded-full animate-pulseDot" />
          </button>
        </div>
      </div>
    </div>
  );
}
