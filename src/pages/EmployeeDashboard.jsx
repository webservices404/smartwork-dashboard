import { useMemo, useState } from 'react';
import {
  AreaChart, Area, LineChart, Line, ResponsiveContainer,
  XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine, BarChart, Bar as RBar, Cell,
} from 'recharts';
import {
  Flame, ClipboardCheck, Zap, Coffee, Sun, Moon, Activity,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth.jsx';
import { fatigueRecords, suggestionLogs, tasks } from '../data/mock.js';
import { KPI, SectionHead, PeriodSelector, Pill, Bar } from '../components/UI.jsx';

const PERIOD_DAYS = { D: 1, W: 7, M: 30, '6M': 182, Y: 365 };

function tickFormat(period) {
  return (v) => {
    const d = new Date(v);
    if (period === 'D')  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (period === 'W')  return d.toLocaleDateString([], { weekday: 'short' });
    if (period === 'M')  return d.toLocaleDateString([], { day: '2-digit', month: 'short' });
    return d.toLocaleDateString([], { month: 'short', year: '2-digit' });
  };
}

export default function EmployeeDashboard() {
  const { user } = useAuth();
  const [period, setPeriod] = useState('W');

  const myFatigue = useMemo(
    () => fatigueRecords.filter((r) => r.employee_id === user.employee_id),
    [user.employee_id]
  );

  const myTasks = useMemo(() => tasks.filter((t) => t.employee_id === user.employee_id), [user.employee_id]);
  const myLogs  = useMemo(() => suggestionLogs.filter((l) => l.employee_id === user.employee_id), [user.employee_id]);

  const periodData = useMemo(() => {
    const cutoff = Date.now() - PERIOD_DAYS[period] * 24 * 60 * 60 * 1000;
    return myFatigue.filter((r) => new Date(r.timestamp).getTime() >= cutoff);
  }, [myFatigue, period]);

  const avgFat   = periodData.length ? periodData.reduce((s, r) => s + r.overall_score, 0) / periodData.length : 0;
  const avgProd  = periodData.length ? periodData.reduce((s, r) => s + r.productivity, 0) / periodData.length : 0;
  const highCnt  = periodData.filter((r) => r.fatigue_level === 'High').length;
  const breaks   = myLogs.filter((l) => l.action === 'accepted').length;
  const breakAcceptance = myLogs.length ? Math.round((breaks / myLogs.length) * 100) : 0;

  const hourly = useMemo(() => {
    const buckets = Array.from({ length: 24 }, () => ({ total: 0, n: 0 }));
    myFatigue.forEach((r) => {
      const h = new Date(r.timestamp).getHours();
      buckets[h].total += r.overall_score;
      buckets[h].n += 1;
    });
    return buckets.map((b, h) => ({ hour: h, avg: b.n ? b.total / b.n : 0 }));
  }, [myFatigue]);
  const sortedHours = [...hourly].filter((h) => h.avg > 0).sort((a, b) => a.avg - b.avg);
  const bestHour  = sortedHours[0]?.hour ?? 9;
  const worstHour = sortedHours.at(-1)?.hour ?? 14;

  const dist = useMemo(() => {
    const c = { Normal: 0, Mild: 0, High: 0 };
    myFatigue.forEach((r) => { c[r.fatigue_level]++; });
    const total = myFatigue.length || 1;
    return {
      Normal: Math.round((c.Normal / total) * 100),
      Mild:   Math.round((c.Mild / total) * 100),
      High:   Math.round((c.High / total) * 100),
    };
  }, [myFatigue]);

  const streak = useMemo(() => {
    const byDate = new Map();
    myFatigue.forEach((r) => {
      const d = r.timestamp.slice(0, 10);
      if (!byDate.has(d)) byDate.set(d, { n: 0, m: 0, h: 0 });
      const o = byDate.get(d);
      if (r.fatigue_level === 'Normal') o.n++; else if (r.fatigue_level === 'Mild') o.m++; else o.h++;
    });
    const days = [...byDate.entries()].sort((a, b) => b[0].localeCompare(a[0]));
    let s = 0;
    for (const [, o] of days) {
      if (o.n >= o.m && o.n >= o.h) s++; else break;
    }
    return s;
  }, [myFatigue]);

  const chartData = useMemo(() => {
    const step = period === 'D' ? 1 : period === 'W' ? 1 : period === 'M' ? 4 : 12;
    return periodData.filter((_, i) => i % step === 0).map((r) => ({
      t: r.timestamp,
      productivity: r.productivity,
      fatigue: r.overall_score * 100,
    }));
  }, [periodData, period]);

  return (
    <div className="space-y-8">
      {}
      <div className="surface-ink grain p-7 lg:p-9 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 -mr-20 -mt-20 rounded-full opacity-30"
             style={{ background: 'radial-gradient(circle, rgba(245,130,32,0.6), transparent 70%)' }} />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-xl">
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-violet-300/80 mb-3">
              Morning Briefing
            </div>
            <h2 className="editorial text-4xl lg:text-5xl mb-3 leading-tight">
              Hello, <em className="text-amber-400 font-display italic not-italic">{user.name.split(' ')[0]}</em>.
            </h2>
            <p className="text-bone/70 text-base leading-relaxed">
              You've kept fatigue in check for <span className="text-mint-400 font-semibold">{streak} consecutive days</span>.
              Your peak focus tends to land around <span className="text-amber-400 font-semibold">{String(bestHour).padStart(2, '0')}:00</span>.
            </p>
          </div>
          <div className="flex gap-3 shrink-0">
            <div className="bg-bone/8 backdrop-blur-sm border border-bone/10 rounded-2xl p-4 min-w-[120px]">
              <Sun className="w-4 h-4 text-amber-400 mb-2" />
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-bone/50">Best hour</div>
              <div className="editorial text-2xl tnum">{String(bestHour).padStart(2, '0')}:00</div>
            </div>
            <div className="bg-bone/8 backdrop-blur-sm border border-bone/10 rounded-2xl p-4 min-w-[120px]">
              <Moon className="w-4 h-4 text-violet-300 mb-2" />
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-bone/50">Peak fatigue</div>
              <div className="editorial text-2xl tnum">{String(worstHour).padStart(2, '0')}:00</div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPI label="Avg Fatigue"    value={avgFat.toFixed(2)}              sub={`${period} window`}                  accent={avgFat >= 0.65 ? 'rose' : avgFat >= 0.4 ? 'amber' : 'mint'} trend={-4} />
        <KPI label="Avg Productivity" value={`${avgProd.toFixed(0)}%`}     sub={`${periodData.length} readings`}     accent="violet" trend={6} />
        <KPI label="Breaks Taken"   value={breaks}                          sub={`${breakAcceptance}% acceptance rate`} accent="amber" />
        <KPI label="High Events"    value={highCnt}                         sub="Above 0.65 threshold"                accent={highCnt > 5 ? 'rose' : 'mint'} highlight={highCnt > 5} />
      </div>

      {/* Main chart */}
      <div className="surface p-6 lg:p-7">
        <div className="flex items-start justify-between mb-5 gap-4 flex-wrap">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-violet-700/60 mb-2">
              §02 — Productivity & Fatigue
            </div>
            <h3 className="editorial text-2xl">Your active rhythm</h3>
            <p className="text-sm text-ink-700/55 mt-1">Two signals, one chart. Productivity climbs as fatigue clears.</p>
          </div>
          <PeriodSelector value={period} onChange={setPeriod} />
        </div>

        <div className="h-[320px] -ml-2">
          <ResponsiveContainer>
            <AreaChart data={chartData} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="gProd" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7C3AED" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#7C3AED" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gFat" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F58220" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#F58220" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(124,58,237,0.08)" vertical={false} />
              <XAxis
                dataKey="t"
                tickFormatter={tickFormat(period)}
                stroke="#6B5B8E"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#6B5B8E"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                domain={[0, 100]}
                tickFormatter={(v) => `${v}%`}
              />
              <Tooltip
                contentStyle={{
                  background: '#FFFEFB',
                  border: '1px solid rgba(124,58,237,0.2)',
                  borderRadius: 12,
                  boxShadow: '0 8px 24px -8px rgba(76,29,149,0.2)',
                }}
                labelFormatter={(v) => new Date(v).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                formatter={(v, name) => [`${v.toFixed(1)}%`, name === 'productivity' ? 'Productivity' : 'Fatigue']}
              />
              <Area type="monotone" dataKey="productivity" stroke="#7C3AED" strokeWidth={2.5} fill="url(#gProd)" />
              <Area type="monotone" dataKey="fatigue"      stroke="#F58220" strokeWidth={2}   fill="url(#gFat)"  />
              <ReferenceLine y={65} stroke="#FF5C7A" strokeDasharray="3 3" label={{ value: 'High threshold', position: 'right', fill: '#FF5C7A', fontSize: 10 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Distribution + Hourly chart + Recent breaks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Fatigue distribution */}
        <div className="surface p-6">
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-violet-700/60 mb-3">
            §03 — Distribution
          </div>
          <h3 className="editorial text-xl mb-5">Where you spend your day</h3>
          <div className="space-y-4">
            <DistRow label="Normal" pct={dist.Normal} color="mint"   icon="●" />
            <DistRow label="Mild"   pct={dist.Mild}   color="amber"  icon="●" />
            <DistRow label="High"   pct={dist.High}   color="rose"   icon="●" />
          </div>
          <div className="mt-5 pt-4 border-t border-violet-500/10 text-xs text-ink-700/55 tnum">
            {myFatigue.length} total readings logged
          </div>
        </div>

        {/* Hourly bar */}
        <div className="surface p-6 lg:col-span-2">
          <div className="flex items-baseline justify-between mb-3">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-violet-700/60">
                §04 — Circadian
              </div>
              <h3 className="editorial text-xl mt-1">Your hour-of-day curve</h3>
            </div>
            <Pill tone="amber" icon={Activity}>Avg over all readings</Pill>
          </div>
          <div className="h-[240px] -ml-2">
            <ResponsiveContainer>
              <BarChart data={hourly} margin={{ top: 8, right: 0, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="rgba(124,58,237,0.08)" vertical={false} />
                <XAxis dataKey="hour" stroke="#6B5B8E" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(h) => `${String(h).padStart(2, '0')}`} />
                <YAxis stroke="#6B5B8E" fontSize={10} tickLine={false} axisLine={false} domain={[0, 1]} />
                <Tooltip
                  contentStyle={{ background: '#FFFEFB', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 12 }}
                  formatter={(v) => [v.toFixed(2), 'Avg fatigue']}
                  labelFormatter={(h) => `${String(h).padStart(2, '0')}:00`}
                />
                <RBar dataKey="avg" radius={[6, 6, 0, 0]}>
                  {hourly.map((d, i) => {
                    const c = d.avg >= 0.65 ? '#FF5C7A' : d.avg >= 0.4 ? '#F58220' : '#7C3AED';
                    return <Cell key={i} fill={c} />;
                  })}
                </RBar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Highlights row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="surface p-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-600 flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </div>
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-amber-600">
              Active Productivity
            </div>
          </div>
          <div className="editorial text-4xl tnum mb-2">{avgProd.toFixed(0)}%</div>
          <div className="text-sm text-ink-700/55 mb-4">7-day average</div>
          <Bar value={avgProd} color="amber" />
          <div className="mt-4 text-xs text-ink-700/55">
            High-fatigue events: <strong className="text-ink-900 tnum">{dist.High}%</strong> of history
          </div>
        </div>

        <div className="surface p-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-9 h-9 rounded-xl bg-violet-500/15 text-violet-700 flex items-center justify-center">
              <ClipboardCheck className="w-4 h-4" />
            </div>
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-violet-700">
              Task Response
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <div className="editorial text-4xl tnum">{myTasks.filter((t) => t.status === 'completed').length}</div>
              <div className="text-xs text-ink-700/55 mt-1">Accepted</div>
            </div>
            <div>
              <div className="editorial text-4xl tnum">{myTasks.filter((t) => t.status === 'pending').length}</div>
              <div className="text-xs text-ink-700/55 mt-1">Pending</div>
            </div>
          </div>
          <div className="pt-4 border-t border-violet-500/10 text-xs text-ink-700/55">
            Break acceptance: <strong className="text-ink-900 tnum">{breakAcceptance}%</strong> · {breaks} of {myLogs.length}
          </div>
        </div>
      </div>
    </div>
  );
}

function DistRow({ label, pct, color }) {
  const dotColors = {
    mint: 'text-mint-500',
    amber: 'text-amber-500',
    rose: 'text-rose-500',
  };
  return (
    <div>
      <div className="flex items-center justify-between text-sm mb-1.5">
        <div className="flex items-center gap-2">
          <span className={`text-lg leading-none ${dotColors[color]}`}>●</span>
          <span className="font-medium">{label}</span>
        </div>
        <span className="tnum text-ink-700 font-semibold">{pct}%</span>
      </div>
      <Bar value={pct} color={color} />
    </div>
  );
}
