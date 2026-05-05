import { useState, useMemo } from 'react';
import { useAuth } from '../hooks/useAuth.jsx';
import { tasks as initialTasks } from '../data/mock.js';
import { Pill, SectionHead } from '../components/UI.jsx';
import {
  Calendar, Clock, AlertTriangle, RefreshCw, CheckCircle2, ListTodo, Sparkles,
} from 'lucide-react';

const PRIORITY = {
  high:   { label: 'Critical', tone: 'rose',   accent: '#FF5C7A' },
  medium: { label: 'Planned',  tone: 'amber',  accent: '#F58220' },
  low:    { label: 'Routine',  tone: 'mint',   accent: '#1FB87A' },
};

export default function EmployeeTasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState(initialTasks);

  const myTasks = useMemo(() => tasks.filter((t) => t.employee_id === user.employee_id), [tasks, user.employee_id]);
  const pending = myTasks.filter((t) => t.status === 'pending');
  const completed = myTasks.filter((t) => t.status === 'completed');

  const markDone = (id) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status: 'completed' } : t)));
  };

  return (
    <div className="space-y-8">
      {}
      <div className="surface p-6 lg:p-7 flex items-center gap-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 -mr-16 -mt-16 rounded-full opacity-20"
             style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.5), transparent 70%)' }} />
        <div className="w-14 h-14 rounded-2xl bg-violet-500/12 text-violet-700 flex items-center justify-center shrink-0">
          <ListTodo className="w-6 h-6" />
        </div>
        <div className="flex-1 relative">
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-violet-700/60 mb-1">
            §05 — Today's docket
          </div>
          <h2 className="editorial text-2xl">
            {pending.length} pending, {completed.length} done
          </h2>
          <p className="text-sm text-ink-700/55 mt-1">
            Tasks the system rescheduled around your fatigue patterns are flagged.
          </p>
        </div>
      </div>

      {/* Pending */}
      <div>
        <SectionHead
          kicker="§06 — Pending"
          title="What's on deck"
          subtitle="Cards are sorted by priority, then deadline."
          right={<Pill tone="violet" icon={Sparkles}>Auto-rescheduled where useful</Pill>}
        />

        {pending.length === 0 ? (
          <div className="surface p-10 text-center">
            <div className="text-4xl mb-2">✓</div>
            <div className="editorial text-xl">All clear.</div>
            <p className="text-sm text-ink-700/55 mt-1">No pending tasks. Nice work.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {pending.map((t) => {
              const p = PRIORITY[t.priority] || PRIORITY.medium;
              const fatigueFlag = !!t.fatigue_triggered;
              return (
                <div key={t.id} className="surface p-5 relative overflow-hidden hover:shadow-lift transition group">
                  <div className="absolute top-0 left-0 right-0 h-1" style={{ background: p.accent }} />
                  <div className="flex items-start justify-between gap-3 mb-4 mt-1">
                    <div className="min-w-0">
                      <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-700/50 mb-1">
                        Task #{t.id} · {t.source === 'hr_assigned' ? 'HR-assigned' : 'Self-added'}
                      </div>
                      <h3 className="editorial text-lg leading-snug">{t.task_name}</h3>
                    </div>
                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <Pill tone={p.tone}>{p.label}</Pill>
                      {fatigueFlag && (
                        <Pill tone="amber" icon={RefreshCw}>
                          Resched ×{t.rescheduled_count}
                        </Pill>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="bg-violet-500/5 border border-violet-500/8 rounded-xl p-3">
                      <div className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.18em] text-ink-700/50 mb-1">
                        <Calendar className="w-3 h-3" /> Deadline
                      </div>
                      <div className="text-sm font-semibold tnum">{t.deadline.slice(0, 16)}</div>
                    </div>
                    <div className="bg-violet-500/5 border border-violet-500/8 rounded-xl p-3">
                      <div className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.18em] text-ink-700/50 mb-1">
                        <Clock className="w-3 h-3" /> Duration
                      </div>
                      <div className="text-sm font-semibold tnum">{t.estimated_duration_minutes} min</div>
                    </div>
                  </div>

                  <button
                    onClick={() => markDone(t.id)}
                    className="w-full bg-ink-900 hover:bg-ink-800 text-bone rounded-xl py-2.5 text-sm font-semibold transition flex items-center justify-center gap-2 group"
                  >
                    <CheckCircle2 className="w-4 h-4 group-hover:scale-110 transition" />
                    Mark done
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Completed */}
      {completed.length > 0 && (
        <div>
          <SectionHead
            kicker="§07 — Completed"
            title="The wrap-up"
            subtitle="Recently checked off."
          />
          <div className="surface overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-violet-500/5 border-b border-violet-500/10 text-left">
                <tr>
                  <th className="px-5 py-3 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-700/55">Task</th>
                  <th className="px-5 py-3 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-700/55">Priority</th>
                  <th className="px-5 py-3 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-700/55">Deadline</th>
                  <th className="px-5 py-3 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-700/55 text-right">Minutes</th>
                </tr>
              </thead>
              <tbody>
                {completed.map((t) => {
                  const p = PRIORITY[t.priority] || PRIORITY.medium;
                  return (
                    <tr key={t.id} className="border-b border-violet-500/5 last:border-0 hover:bg-violet-500/3">
                      <td className="px-5 py-3 font-medium">{t.task_name}</td>
                      <td className="px-5 py-3"><Pill tone={p.tone}>{p.label}</Pill></td>
                      <td className="px-5 py-3 text-ink-700/65 tnum">{t.deadline.slice(0, 16)}</td>
                      <td className="px-5 py-3 text-right tnum">{t.estimated_duration_minutes}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
