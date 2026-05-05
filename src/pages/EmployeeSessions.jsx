import { useMemo } from 'react';
import { useAuth } from '../hooks/useAuth.jsx';
import { sessions } from '../data/mock.js';
import { Pill, SectionHead } from '../components/UI.jsx';
import { Clock, Activity, Mouse, Keyboard } from 'lucide-react';

const LEVEL = {
  Normal: { tone: 'mint',  color: '#1FB87A', icon: '●' },
  Mild:   { tone: 'amber', color: '#F58220', icon: '●' },
  High:   { tone: 'rose',  color: '#FF5C7A', icon: '●' },
};

function fmtDuration(start, end) {
  const mins = Math.max(1, Math.round((new Date(end) - new Date(start)) / 60000));
  if (mins < 60) return `${mins}m`;
  return `${Math.floor(mins / 60)}h ${mins % 60}m`;
}

function fmtRelative(t) {
  const diff = (Date.now() - new Date(t).getTime()) / 60000;
  if (diff < 60) return `${Math.round(diff)}m ago`;
  if (diff < 1440) return `${Math.round(diff / 60)}h ago`;
  return `${Math.round(diff / 1440)}d ago`;
}

export default function EmployeeSessions() {
  const { user } = useAuth();
  const my = useMemo(
    () => sessions.filter((s) => s.employee_id === user.employee_id).slice(0, 30),
    [user.employee_id]
  );

  return (
    <div className="space-y-8">
      <SectionHead
        kicker="§08 — Recent sessions"
        title="A timeline of your last 30 sessions"
        subtitle="Each entry is a continuous monitoring window — the system stitches together activity, fatigue, and the work you were doing."
      />

      {my.length === 0 ? (
        <div className="surface p-10 text-center text-ink-700/55">No sessions logged yet.</div>
      ) : (
        <div className="space-y-3">
          {my.map((s, i) => {
            const lvl = LEVEL[s.fatigue_level] ?? LEVEL.Normal;
            const startDate = new Date(s.start_time);
            const endDate   = new Date(s.end_time);
            const sameDay   = startDate.toDateString() === endDate.toDateString();
            const dayMs = 24 * 60 * 60 * 1000;
            const dayStart = new Date(startDate); dayStart.setHours(0, 0, 0, 0);
            const left = ((startDate - dayStart) / dayMs) * 100;
            const width = Math.min(100 - left, ((endDate - startDate) / dayMs) * 100);

            return (
              <div
                key={s.id}
                className="surface p-5 hover:shadow-lift transition group animate-slideUp"
                style={{ animationDelay: `${i * 30}ms` }}
              >
                <div className="flex items-start gap-4 flex-wrap">
                  <div className="shrink-0 w-14 text-right">
                    <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-700/45">
                      {startDate.toLocaleDateString([], { month: 'short' })}
                    </div>
                    <div className="editorial text-2xl tnum">
                      {String(startDate.getDate()).padStart(2, '0')}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <span style={{ color: lvl.color }} className="text-lg leading-none">{lvl.icon}</span>
                      <h3 className="editorial text-lg leading-snug">{s.task_summary}</h3>
                      <Pill tone={lvl.tone}>{s.fatigue_level}</Pill>
                      <span className="ml-auto text-xs text-ink-700/55 font-mono">
                        {fmtRelative(s.start_time)}
                      </span>
                    </div>

                    {}
                    <div className="relative h-1.5 bg-violet-500/8 rounded-full mb-3 overflow-hidden">
                      <div
                        style={{ left: `${left}%`, width: `${width}%`, background: lvl.color }}
                        className="absolute top-0 bottom-0 rounded-full opacity-80"
                      />
                    </div>

                    <div className="flex items-center gap-5 text-xs text-ink-700/55 flex-wrap">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        <span className="tnum">{startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} – {endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        <span className="text-ink-700/35">·</span>
                        <strong className="text-ink-900">{fmtDuration(s.start_time, s.end_time)}</strong>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Activity className="w-3.5 h-3.5" />
                        Engagement <strong className="text-ink-900 tnum">{Math.round((1 - s.avg_fatigue) * 100)}%</strong>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Keyboard className="w-3.5 h-3.5" />
                        <span className="tnum">{s.keystrokes}</span> keys
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Mouse className="w-3.5 h-3.5" />
                        <span className="tnum">{s.clicks}</span> clicks
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
