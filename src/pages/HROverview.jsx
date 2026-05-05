import { useMemo, useState } from 'react';
import {
  AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid,
  ScatterChart, Scatter, Cell as RCell, RadialBarChart, RadialBar, PolarAngleAxis,
} from 'recharts';
import {
  Users, AlertTriangle, TrendingUp, Activity, ArrowUpRight, Search,
} from 'lucide-react';
import {
  fatigueRecords, sessions, employees, departmentMetrics,
} from '../data/mock.js';
import { KPI, SectionHead, PeriodSelector, Pill, Avatar, Bar } from '../components/UI.jsx';

const PERIOD_DAYS = { D: 1, W: 7, M: 30, '6M': 182, Y: 365 };

export default function HROverview() {
  const [period, setPeriod] = useState('M');
  const [query, setQuery] = useState('');

  const workforce = useMemo(() => {
    const cutoff = Date.now() - PERIOD_DAYS[period] * 86400000;
    const recs = fatigueRecords.filter((r) => new Date(r.timestamp).getTime() >= cutoff);
    const headcount = new Set(recs.map((r) => r.employee_id)).size;
    const avgFat = recs.length ? recs.reduce((s, r) => s + r.overall_score, 0) / recs.length : 0;
    const avgProd = recs.length ? recs.reduce((s, r) => s + r.productivity, 0) / recs.length : 0;
    const high = recs.filter((r) => r.fatigue_level === 'High').length;
    return { headcount, avgFat, avgProd, high, total: recs.length };
  }, [period]);

  const series = useMemo(() => {
    const cutoff = Date.now() - PERIOD_DAYS[period] * 86400000;
    const recs = fatigueRecords.filter((r) => new Date(r.timestamp).getTime() >= cutoff);
    const byDay = new Map();
    recs.forEach((r) => {
      const d = r.timestamp.slice(0, 10);
      if (!byDay.has(d)) byDay.set(d, { date: d, fat: 0, prod: 0, n: 0 });
      const o = byDay.get(d);
      o.fat += r.overall_score;
      o.prod += r.productivity;
      o.n += 1;
    });
    return [...byDay.values()].sort((a, b) => a.date.localeCompare(b.date)).map((o) => ({
      date: o.date,
      fatigue: +(o.fat / o.n).toFixed(3),
      productivity: +(o.prod / o.n).toFixed(1),
    }));
  }, [period]);

  const atRisk = useMemo(() => {
    const grouped = new Map();
    fatigueRecords.forEach((r) => {
      if (!grouped.has(r.employee_id)) grouped.set(r.employee_id, { id: r.employee_id, scores: [], last: r.timestamp });
      const o = grouped.get(r.employee_id);
      o.scores.push(r.overall_score);
      if (r.timestamp > o.last) o.last = r.timestamp;
    });
    const out = [];
    grouped.forEach((o) => {
      const emp = employees.find((e) => e.employee_id === o.id);
      if (!emp) return;
      const avg = o.scores.reduce((s, x) => s + x, 0) / o.scores.length;
      const max = Math.max(...o.scores);
      out.push({
        ...emp,
        avg_fatigue: avg,
        max_fatigue: max,
        productivity: (1 - avg) * 100,
        coverage: o.scores.length,
        last_seen: o.last,
      });
    });
    return out.sort((a, b) => b.max_fatigue - a.max_fatigue);
  }, []);

  const filteredRisk = atRisk.filter((e) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return e.employee_id.toLowerCase().includes(q) || e.name.toLowerCase().includes(q);
  });

  const scatter = atRisk.map((e) => ({
    x: e.avg_fatigue,
    y: e.productivity,
    name: e.name,
    id: e.employee_id,
  }));

  const deptGauges = departmentMetrics.map((d) => ({
    name: d.department,
    value: Math.round(d.avg_productivity),
    fat: d.avg_fatigue,
  }));

  return (
    <div className="space-y-8">
      {}
      <div className="surface-ink grain p-7 lg:p-8 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full opacity-30"
             style={{ background: 'radial-gradient(circle, rgba(245,130,32,0.6), transparent 70%)' }} />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-violet-300/80 mb-3">
              Smart Insights · {new Date().toLocaleDateString([], { month: 'long', day: 'numeric' })}
            </div>
            <h2 className="editorial text-3xl lg:text-[2.4rem] leading-[1.05] mb-4">
              <em className="text-amber-400 not-italic font-display italic">Operations</em> is running
              <em className="text-rose-500 not-italic font-display italic"> hot</em>.
              <br />
              Engineering is in rhythm.
            </h2>
            <p className="text-bone/65 leading-relaxed">
              Fatigue index for the Operations group has climbed <strong className="text-rose-400">+12%</strong> over the last seven days.
              Two team members are showing sustained high-fatigue readings. Consider redistributing the late-shift load this week.
            </p>
          </div>
          <button className="bg-amber-500 hover:bg-amber-600 text-ink-900 rounded-xl px-5 py-3 text-sm font-bold flex items-center gap-2 transition shrink-0">
            View intervention queue
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPI label="Active Workforce" value={workforce.headcount} sub="Currently monitored" accent="ink" />
        <KPI label="Workforce Fatigue" value={workforce.avgFat.toFixed(2)} sub={`${period} window`} accent={workforce.avgFat >= 0.5 ? 'rose' : 'amber'} trend={workforce.avgFat >= 0.5 ? 8 : -3} />
        <KPI label="Avg Productivity"  value={`${workforce.avgProd.toFixed(0)}%`} sub={`${workforce.total} readings`} accent="violet" trend={2} />
        <KPI label="High-Fatigue Events" value={workforce.high} sub="Above 0.65 threshold" accent={workforce.high > 30 ? 'rose' : 'mint'} highlight={workforce.high > 30} />
      </div>

      {/* Workforce trend chart */}
      <div className="surface p-6 lg:p-7">
        <div className="flex items-start justify-between gap-4 flex-wrap mb-5">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-violet-700/60 mb-2">
              §02 — Workforce Productivity
            </div>
            <h3 className="editorial text-2xl">Daily rhythm across the org</h3>
            <p className="text-sm text-ink-700/55 mt-1">Productivity is the inverse of fatigue. Watch the gap.</p>
          </div>
          <PeriodSelector value={period} onChange={setPeriod} />
        </div>
        <div className="h-[320px] -ml-2">
          <ResponsiveContainer>
            <AreaChart data={series} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="orgProd" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7C3AED" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#7C3AED" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(124,58,237,0.08)" vertical={false} />
              <XAxis dataKey="date" stroke="#6B5B8E" fontSize={11} tickLine={false} axisLine={false}
                     tickFormatter={(v) => new Date(v).toLocaleDateString([], { month: 'short', day: '2-digit' })} />
              <YAxis stroke="#6B5B8E" fontSize={11} tickLine={false} axisLine={false}
                     domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
              <Tooltip
                contentStyle={{ background: '#FFFEFB', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 12 }}
                formatter={(v, k) => [k === 'productivity' ? `${v.toFixed(1)}%` : v.toFixed(2), k === 'productivity' ? 'Productivity' : 'Fatigue']}
              />
              <Area type="monotone" dataKey="productivity" stroke="#7C3AED" strokeWidth={2.5} fill="url(#orgProd)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Two-up: Department gauges + Scatter */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="surface p-6 lg:col-span-2">
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-violet-700/60 mb-2">
            §03 — Department health
          </div>
          <h3 className="editorial text-xl mb-4">Productivity by team</h3>
          <div className="space-y-4">
            {deptGauges.map((d) => (
              <div key={d.name}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="text-sm font-semibold">{d.name}</div>
                  <div className="text-sm tnum text-ink-700/65">{d.value}%</div>
                </div>
                <Bar value={d.value} color={d.value >= 60 ? 'mint' : d.value >= 45 ? 'amber' : 'rose'} />
                <div className="text-[11px] text-ink-700/45 mt-1 flex justify-between">
                  <span>Fatigue {d.fat.toFixed(2)}</span>
                  <span className="font-mono">{departmentMetrics.find(dm => dm.department === d.name)?.headcount} people</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="surface p-6 lg:col-span-3">
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-violet-700/60 mb-2">
            §04 — Productivity vs. Fatigue
          </div>
          <h3 className="editorial text-xl mb-4">Each dot is a person</h3>
          <div className="h-[260px] -ml-1">
            <ResponsiveContainer>
              <ScatterChart margin={{ top: 8, right: 12, bottom: 8, left: 0 }}>
                <CartesianGrid stroke="rgba(124,58,237,0.08)" />
                <XAxis dataKey="x" type="number" stroke="#6B5B8E" fontSize={11} tickLine={false} axisLine={false}
                       domain={[0, 1]} label={{ value: 'Avg fatigue →', position: 'insideBottom', offset: -2, fontSize: 10, fill: '#6B5B8E' }} />
                <YAxis dataKey="y" type="number" stroke="#6B5B8E" fontSize={11} tickLine={false} axisLine={false}
                       domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                <Tooltip
                  contentStyle={{ background: '#FFFEFB', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 12 }}
                  formatter={(v, k) => k === 'x' ? [v.toFixed(2), 'Fatigue'] : [`${v.toFixed(0)}%`, 'Productivity']}
                  labelFormatter={() => ''}
                  content={({ payload }) => {
                    if (!payload || !payload.length) return null;
                    const p = payload[0].payload;
                    return (
                      <div className="bg-bone border border-violet-500/20 rounded-xl p-3 shadow-lift">
                        <div className="font-display text-sm">{p.name}</div>
                        <div className="text-[11px] text-ink-700/55 font-mono">{p.id}</div>
                        <div className="mt-2 text-xs flex gap-3">
                          <span>Fatigue <strong className="tnum">{p.x.toFixed(2)}</strong></span>
                          <span>Prod <strong className="tnum">{p.y.toFixed(0)}%</strong></span>
                        </div>
                      </div>
                    );
                  }}
                />
                <Scatter data={scatter}>
                  {scatter.map((d, i) => (
                    <RCell key={i} fill={d.x >= 0.65 ? '#FF5C7A' : d.x >= 0.4 ? '#F58220' : '#7C3AED'} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* At-risk employees */}
      <div>
        <SectionHead
          kicker="§05 — At-risk register"
          title="Employees showing strain"
          subtitle="Sorted by peak fatigue. Coverage indicates how many readings we have to work with."
          right={
            <div className="flex items-center gap-2 bg-white/60 border border-violet-500/10 rounded-xl px-3 py-2 w-64">
              <Search className="w-4 h-4 text-ink-700/45" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name or ID…"
                className="bg-transparent outline-none text-sm w-full"
              />
            </div>
          }
        />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredRisk.map((e) => {
            const lvl = e.max_fatigue >= 0.65 ? { tone: 'rose',  label: 'Critical', color: '#FF5C7A' }
                     : e.max_fatigue >= 0.4  ? { tone: 'amber', label: 'Warning',  color: '#F58220' }
                     :                          { tone: 'mint',  label: 'Stable',   color: '#1FB87A' };
            const lastMins = Math.round((Date.now() - new Date(e.last_seen).getTime()) / 60000);
            const seen = lastMins < 60 ? `${lastMins}m ago` : lastMins < 1440 ? `${Math.round(lastMins / 60)}h ago` : `${Math.round(lastMins / 1440)}d ago`;

            return (
              <div key={e.employee_id} className="surface p-5 hover:shadow-lift transition relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1" style={{ background: lvl.color }} />
                <div className="flex items-start justify-between gap-3 mb-4 mt-1">
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar name={e.name} id={e.employee_id} />
                    <div className="min-w-0">
                      <div className="font-display text-base truncate">{e.name}</div>
                      <div className="text-[11px] text-ink-700/50 font-mono">{e.employee_id} · {e.department}</div>
                    </div>
                  </div>
                  <Pill tone={lvl.tone}>{lvl.label}</Pill>
                </div>

                <div className="mb-3">
                  <div className="flex items-center justify-between text-xs text-ink-700/55 mb-1">
                    <span className="font-mono uppercase tracking-[0.18em]">Fatigue</span>
                    <strong className="tnum text-ink-900">{Math.round(e.avg_fatigue * 100)}%</strong>
                  </div>
                  <Bar value={e.avg_fatigue * 100} color={lvl.tone === 'rose' ? 'rose' : lvl.tone === 'amber' ? 'amber' : 'mint'} />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-violet-500/5 border border-violet-500/8 rounded-xl p-2.5">
                    <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-ink-700/50">Coverage</div>
                    <div className="font-semibold tnum text-sm mt-0.5">{e.coverage} pts</div>
                  </div>
                  <div className="bg-violet-500/5 border border-violet-500/8 rounded-xl p-2.5">
                    <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-ink-700/50">Engagement</div>
                    <div className="font-semibold tnum text-sm mt-0.5">{Math.round(e.productivity)}%</div>
                  </div>
                </div>

                <div className="mt-3 text-[11px] text-ink-700/50 font-mono">Last active {seen}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
