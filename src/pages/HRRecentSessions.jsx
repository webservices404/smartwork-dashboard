import { useMemo, useState } from 'react';
import { sessions, employees } from '../data/mock.js';
import { Avatar, Pill, SectionHead, PeriodSelector } from '../components/UI.jsx';
import { Filter, Clock, Activity } from 'lucide-react';

const LEVEL = {
  Normal: { tone: 'mint',  color: '#1FB87A' },
  Mild:   { tone: 'amber', color: '#F58220' },
  High:   { tone: 'rose',  color: '#FF5C7A' },
};

function fmtDuration(start, end) {
  const mins = Math.max(1, Math.round((new Date(end) - new Date(start)) / 60000));
  if (mins < 60) return `${mins}m`;
  return `${Math.floor(mins / 60)}h ${mins % 60}m`;
}

export default function HRRecentSessions() {
  const [empFilter, setEmpFilter] = useState('All');
  const [lvlFilter, setLvlFilter] = useState('All');

  const employeeMap = useMemo(() => {
    const m = new Map();
    employees.forEach((e) => m.set(e.employee_id, e));
    return m;
  }, []);

  const filtered = useMemo(() => {
    return sessions
      .filter((s) => empFilter === 'All' || s.employee_id === empFilter)
      .filter((s) => lvlFilter === 'All' || s.fatigue_level === lvlFilter)
      .slice(0, 60);
  }, [empFilter, lvlFilter]);

  return (
    <div className="space-y-7">
      <SectionHead
        kicker="§01 — Workforce sessions"
        title="Every recent monitoring window"
        subtitle="Sortable, filterable, and grouped by day. Click any row to drill into the per-second activity."
      />

      <div className="surface p-4 flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.18em] text-ink-700/55">
          <Filter className="w-3.5 h-3.5" /> Filters
        </div>
        <select
          value={empFilter}
          onChange={(e) => setEmpFilter(e.target.value)}
          className="bg-violet-500/5 border border-violet-500/10 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-violet-500/30"
        >
          <option value="All">All employees</option>
          {employees.filter((e) => e.role === 'employee').map((e) => (
            <option key={e.employee_id} value={e.employee_id}>{e.name} ({e.employee_id})</option>
          ))}
        </select>
        <select
          value={lvlFilter}
          onChange={(e) => setLvlFilter(e.target.value)}
          className="bg-violet-500/5 border border-violet-500/10 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-violet-500/30"
        >
          <option value="All">All levels</option>
          <option value="Normal">Normal</option>
          <option value="Mild">Mild</option>
          <option value="High">High</option>
        </select>
        <span className="ml-auto text-xs text-ink-700/55 font-mono tnum">
          Showing {filtered.length} session{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="surface overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-violet-500/5 border-b border-violet-500/10 text-left">
            <tr>
              <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-700/55">Employee</th>
              <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-700/55">Level</th>
              <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-700/55">Activity</th>
              <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-700/55">Started</th>
              <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-700/55">Duration</th>
              <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-700/55 text-right">Engagement</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => {
              const emp = employeeMap.get(s.employee_id);
              const lvl = LEVEL[s.fatigue_level] ?? LEVEL.Normal;
              return (
                <tr key={s.id} className="border-b border-violet-500/5 last:border-0 hover:bg-violet-500/3 transition">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <Avatar name={emp?.name} id={s.employee_id} size={28} />
                      <div>
                        <div className="font-semibold text-sm">{emp?.name ?? s.employee_id}</div>
                        <div className="text-[11px] text-ink-700/50 font-mono">{s.employee_id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3"><Pill tone={lvl.tone}>{s.fatigue_level}</Pill></td>
                  <td className="px-4 py-3 max-w-xs truncate">{s.task_summary}</td>
                  <td className="px-4 py-3 tnum text-ink-700/70">{new Date(s.start_time).toLocaleString([], { month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' })}</td>
                  <td className="px-4 py-3 tnum">{fmtDuration(s.start_time, s.end_time)}</td>
                  <td className="px-4 py-3 text-right">
                    <span className="font-semibold tnum">{Math.round((1 - s.avg_fatigue) * 100)}%</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
