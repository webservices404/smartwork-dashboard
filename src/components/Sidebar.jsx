import { useAuth } from '../hooks/useAuth.jsx';
import {
  LayoutDashboard, Activity, Sliders, Clock, FileBarChart2,
  CheckSquare, LogOut, Zap,
} from 'lucide-react';

const HR_NAV = [
  { key: 'Dashboard',       label: 'Dashboard',       icon: LayoutDashboard },
  { key: 'Live Monitoring', label: 'Live Monitoring', icon: Activity },
  { key: 'Control Panel',   label: 'Control Panel',   icon: Sliders },
  { key: 'Recent Sessions', label: 'Recent Sessions', icon: Clock },
  { key: 'Reports',         label: 'Reports',         icon: FileBarChart2 },
];

const EMP_NAV = [
  { key: 'Dashboard',       label: 'Dashboard',       icon: LayoutDashboard },
  { key: 'My Tasks',        label: 'My Tasks',        icon: CheckSquare },
  { key: 'Recent Sessions', label: 'Recent Sessions', icon: Clock },
];

export default function Sidebar({ role, page, setPage }) {
  const { user, logout } = useAuth();
  const nav = role === 'hr' ? HR_NAV : EMP_NAV;
  const initials = (user.name || '').split(' ').map((s) => s[0]).slice(0, 2).join('');

  return (
    <aside className="w-[260px] shrink-0 sticky top-0 h-screen bg-bone/40 backdrop-blur-sm border-r border-violet-500/8 px-5 py-6 flex flex-col z-20">
      {}
      <div className="flex items-center gap-2.5 mb-8 px-1">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-400 to-violet-600 flex items-center justify-center shadow-md shadow-violet-700/30">
          <Zap className="w-4 h-4 text-white" strokeWidth={2.5} />
        </div>
        <div>
          <div className="font-display text-[17px] tracking-tight leading-none">SmartWork</div>
          <div className="text-[9px] uppercase tracking-[0.18em] text-violet-700/60 font-mono mt-1">
            {role === 'hr' ? 'HR Workspace' : 'Employee Workspace'}
          </div>
        </div>
      </div>

      {/* Active user pill */}
      <div className="surface-ink p-4 mb-6 grain relative overflow-hidden">
        <div className="text-[9px] uppercase tracking-[0.2em] text-bone/45 font-mono mb-2">
          Active user
        </div>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-ink-900 font-bold text-sm shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <div className="font-display text-base truncate">{user.name}</div>
            <div className="text-[11px] text-bone/50 font-mono">{user.employee_id}</div>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-bone/10 flex items-center justify-between text-xs">
          <span className="text-bone/55">Critical alerts</span>
          <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-full px-2 py-0.5 font-mono font-semibold tnum">
            {role === 'hr' ? '3' : '1'}
          </span>
        </div>
      </div>

      {/* Nav */}
      <div className="text-[9px] uppercase tracking-[0.2em] text-violet-700/55 font-mono mb-2 px-2">
        Navigation
      </div>
      <nav className="flex-1 space-y-1">
        {nav.map(({ key, label, icon: Icon }) => {
          const active = page === key;
          return (
            <button
              key={key}
              onClick={() => setPage(key)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition relative
                ${active
                  ? 'bg-violet-500/10 text-violet-700'
                  : 'text-ink-700 hover:bg-violet-500/5 hover:text-violet-700'}
              `}
            >
              {active && (
                <span className="absolute left-0 top-2 bottom-2 w-[3px] bg-violet-500 rounded-r-full" />
              )}
              <Icon className="w-4 h-4 shrink-0" strokeWidth={active ? 2.5 : 2} />
              <span className={active ? 'font-semibold' : ''}>{label}</span>
            </button>
          );
        })}
      </nav>

      {/* Sign out */}
      <button
        onClick={logout}
        className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-ink-700 hover:bg-rose-500/10 hover:text-rose-600 transition"
      >
        <LogOut className="w-4 h-4" />
        Sign out
      </button>
    </aside>
  );
}
