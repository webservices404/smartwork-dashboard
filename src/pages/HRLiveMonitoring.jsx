import { useMemo, useState, useEffect } from 'react';
import { fatigueRecords, employees, monitoringControl } from '../data/mock.js';
import { Avatar, Pill, SectionHead, Bar } from '../components/UI.jsx';
import { Activity, Wifi, WifiOff, Eye, EyeOff } from 'lucide-react';

export default function HRLiveMonitoring() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 10_000);
    return () => clearInterval(id);
  }, []);

  const live = useMemo(() => {
    const out = [];
    employees.filter((e) => e.role === 'employee').forEach((e) => {
      const recs = fatigueRecords.filter((r) => r.employee_id === e.employee_id).slice(-12);
      if (!recs.length) return;
      const last = recs.at(-1);
      const ctrl = monitoringControl[e.employee_id];
      out.push({
        ...e,
        ctrl,
        last_score: last.overall_score,
        level: last.fatigue_level,
        productivity: last.productivity,
        spark: recs.map((r) => r.overall_score),
      });
    });
    return out.sort((a, b) => b.last_score - a.last_score);
  }, [tick]);

  const onlineCount = live.filter((l) => l.ctrl?.active && l.ctrl.last_seen_minutes_ago < 30).length;

  return (
    <div className="space-y-7">
      <div className="surface p-6 lg:p-7 flex items-center justify-between flex-wrap gap-4 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full opacity-20"
             style={{ background: 'radial-gradient(circle, rgba(31,184,122,0.6), transparent 70%)' }} />
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <span className="relative flex w-2.5 h-2.5">
              <span className="animate-pulseDot absolute inline-flex w-full h-full rounded-full bg-mint-500 opacity-75" />
              <span className="relative inline-flex w-2.5 h-2.5 rounded-full bg-mint-500" />
            </span>
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-mint-500">Live · Updates every 10s</div>
          </div>
          <h2 className="editorial text-3xl">
            <em className="text-mint-500 font-display italic not-italic">{onlineCount}</em> people online,
            <em className="text-amber-500 font-display italic not-italic"> {live.length - onlineCount}</em> idle
          </h2>
          <p className="text-sm text-ink-700/55 mt-1">Last reading is the most recent fatigue point we received from the agent.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {live.map((p) => {
          const lvl = p.level === 'High' ? { tone: 'rose', color: '#FF5C7A' }
                    : p.level === 'Mild' ? { tone: 'amber', color: '#F58220' }
                    : { tone: 'mint', color: '#1FB87A' };
          const online = p.ctrl?.active && p.ctrl.last_seen_minutes_ago < 30;

          return (
            <div key={p.employee_id} className="surface p-5 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1" style={{ background: lvl.color }} />
              <div className="flex items-start justify-between gap-3 mb-4 mt-1">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative">
                    <Avatar name={p.name} id={p.employee_id} />
                    <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-bone ${online ? 'bg-mint-500' : 'bg-ink-700/30'}`} />
                  </div>
                  <div className="min-w-0">
                    <div className="font-display text-base truncate">{p.name}</div>
                    <div className="text-[11px] text-ink-700/50 font-mono">{p.employee_id} · {p.department}</div>
                  </div>
                </div>
                <Pill tone={lvl.tone}>{p.level}</Pill>
              </div>

              {/* Sparkline */}
              <div className="flex items-end gap-0.5 h-10 mb-3">
                {p.spark.map((v, i) => (
                  <div
                    key={i}
                    style={{ height: `${Math.max(10, v * 100)}%`, background: lvl.color }}
                    className="flex-1 rounded-sm opacity-80"
                  />
                ))}
              </div>

              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="bg-violet-500/5 border border-violet-500/8 rounded-xl p-2.5">
                  <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-ink-700/50">Fatigue</div>
                  <div className="font-semibold tnum text-sm mt-0.5">{p.last_score.toFixed(2)}</div>
                </div>
                <div className="bg-violet-500/5 border border-violet-500/8 rounded-xl p-2.5">
                  <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-ink-700/50">Productivity</div>
                  <div className="font-semibold tnum text-sm mt-0.5">{Math.round(p.productivity)}%</div>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px]">
                <span className={`flex items-center gap-1.5 font-mono ${online ? 'text-mint-500' : 'text-ink-700/45'}`}>
                  {online ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
                  {online ? 'Connected' : 'Idle'}
                </span>
                <span className="text-ink-700/55 font-mono">
                  {p.ctrl?.last_seen_minutes_ago < 60
                    ? `${p.ctrl?.last_seen_minutes_ago}m ago`
                    : `${Math.round((p.ctrl?.last_seen_minutes_ago ?? 0) / 60)}h ago`}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
