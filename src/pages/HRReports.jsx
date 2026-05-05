import {
  RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis,
} from 'recharts';
import { modelMetrics, departmentMetrics } from '../data/mock.js';
import { KPI, SectionHead, Pill } from '../components/UI.jsx';
import {
  Brain, Download, FileBarChart2, CheckCircle, AlertCircle,
} from 'lucide-react';

export default function HRReports() {
  const m = modelMetrics;
  const accuracyPct = Math.round(m.accuracy * 100);

  return (
    <div className="space-y-8">
      {}
      <div className="surface-ink grain p-7 lg:p-8 relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-60 h-60 rounded-full opacity-30"
             style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.7), transparent 70%)' }} />
        <div className="relative z-10 flex items-end justify-between gap-6 flex-wrap">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-violet-300/80 mb-3">
              §01 — Model Audit · Spring 2026
            </div>
            <h2 className="editorial text-4xl mb-2">
              Fatigue Detector v3 · <em className="text-amber-400 not-italic font-display italic">{accuracyPct}% accuracy</em>
            </h2>
            <p className="text-bone/65 max-w-xl">
              Last retrained {new Date(m.trained_at).toLocaleDateString([], { month: 'long', day: 'numeric' })} on
              {' '}<span className="tnum">{m.samples.toLocaleString()}</span> samples across the workforce.
            </p>
          </div>
          <div className="flex gap-2">
            <button className="bg-bone hover:bg-white text-ink-900 rounded-xl px-4 py-2.5 text-sm font-bold flex items-center gap-2 transition">
              <Download className="w-4 h-4" /> CSV
            </button>
            <button className="bg-bone hover:bg-white text-ink-900 rounded-xl px-4 py-2.5 text-sm font-bold flex items-center gap-2 transition">
              <FileBarChart2 className="w-4 h-4" /> Full PDF
            </button>
          </div>
        </div>
      </div>

      {/* Metrics row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPI label="Accuracy"  value={`${accuracyPct}%`} accent="violet" sub="vs. labeled ground truth" />
        <KPI label="Precision" value={`${Math.round(m.precision * 100)}%`} accent="amber" sub="True positives / predicted" />
        <KPI label="Recall"    value={`${Math.round(m.recall * 100)}%`}    accent="mint"  sub="Positives the model caught" />
        <KPI label="F1 Score"  value={m.f1.toFixed(3)} accent="ink" sub="Balanced precision/recall" />
      </div>

      {/* Confusion matrix + radial */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="surface p-6 lg:col-span-3">
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-violet-700/60 mb-2">
            §02 — Confusion matrix
          </div>
          <h3 className="editorial text-xl mb-5">Where the model gets it wrong</h3>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="p-2"></th>
                  <th colSpan={m.labels.length} className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-700/55 text-center pb-2">
                    Predicted →
                  </th>
                </tr>
                <tr>
                  <th className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-700/55 text-left p-2">Actual ↓</th>
                  {m.labels.map((l) => (
                    <th key={l} className="p-2 font-display text-sm">{l}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {m.confusion_matrix.map((row, i) => {
                  const total = row.reduce((s, x) => s + x, 0);
                  return (
                    <tr key={i}>
                      <td className="font-display p-2">{m.labels[i]}</td>
                      {row.map((v, j) => {
                        const correct = i === j;
                        const pct = (v / total) * 100;
                        const intensity = pct / 100;
                        return (
                          <td key={j} className="p-1.5">
                            <div
                              className="rounded-xl p-3 text-center transition-all"
                              style={{
                                background: correct
                                  ? `rgba(31, 184, 122, ${0.1 + intensity * 0.5})`
                                  : `rgba(255, 92, 122, ${0.05 + intensity * 0.4})`,
                                border: `1px solid ${correct ? 'rgba(31,184,122,0.25)' : 'rgba(255,92,122,0.18)'}`,
                              }}
                            >
                              <div className={`editorial text-xl tnum ${correct ? 'text-mint-500' : 'text-rose-600'}`}>
                                {v}
                              </div>
                              <div className="text-[10px] text-ink-700/55 font-mono mt-1">
                                {pct.toFixed(1)}%
                              </div>
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex items-center gap-4 mt-4 text-[11px] text-ink-700/55 flex-wrap">
            <span className="flex items-center gap-1.5"><CheckCircle className="w-3 h-3 text-mint-500" /> Diagonal = correct</span>
            <span className="flex items-center gap-1.5"><AlertCircle className="w-3 h-3 text-rose-500" /> Off-diagonal = misclassified</span>
          </div>
        </div>

        <div className="surface p-6 lg:col-span-2 flex flex-col">
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-violet-700/60 mb-2">
            §03 — Health gauge
          </div>
          <h3 className="editorial text-xl mb-3">Overall accuracy</h3>

          <div className="flex-1 flex items-center justify-center -mt-4">
            <div className="relative w-56 h-56">
              <ResponsiveContainer>
                <RadialBarChart
                  innerRadius="80%"
                  outerRadius="100%"
                  data={[{ name: 'acc', value: accuracyPct, fill: '#7C3AED' }]}
                  startAngle={90}
                  endAngle={-270}
                >
                  <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                  <RadialBar dataKey="value" cornerRadius={20} background={{ fill: 'rgba(124,58,237,0.08)' }} />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="editorial text-5xl tnum">{accuracyPct}<span className="text-xl text-ink-700/55">%</span></div>
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-700/55 mt-1">Accuracy</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
            <div className="bg-violet-500/5 border border-violet-500/10 rounded-lg p-2">
              <div className="font-mono uppercase tracking-[0.15em] text-ink-700/50">Samples</div>
              <div className="font-semibold tnum mt-0.5">{(m.samples / 1000).toFixed(1)}k</div>
            </div>
            <div className="bg-violet-500/5 border border-violet-500/10 rounded-lg p-2">
              <div className="font-mono uppercase tracking-[0.15em] text-ink-700/50">Classes</div>
              <div className="font-semibold tnum mt-0.5">3</div>
            </div>
            <div className="bg-violet-500/5 border border-violet-500/10 rounded-lg p-2">
              <div className="font-mono uppercase tracking-[0.15em] text-ink-700/50">Macro F1</div>
              <div className="font-semibold tnum mt-0.5">{m.f1.toFixed(2)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Department report */}
      <div>
        <SectionHead
          kicker="§04 — Department breakdown"
          title="Per-team summary"
          subtitle="Pull this for monthly board reports — or pipe it straight into a CSV."
        />
        <div className="surface overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-violet-500/5 border-b border-violet-500/10 text-left">
              <tr>
                <th className="px-5 py-3 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-700/55">Department</th>
                <th className="px-5 py-3 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-700/55">Headcount</th>
                <th className="px-5 py-3 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-700/55">Avg Fatigue</th>
                <th className="px-5 py-3 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-700/55">Avg Productivity</th>
                <th className="px-5 py-3 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-700/55">Status</th>
              </tr>
            </thead>
            <tbody>
              {departmentMetrics.map((d) => {
                const tone = d.avg_fatigue >= 0.55 ? 'rose' : d.avg_fatigue >= 0.4 ? 'amber' : 'mint';
                const label = d.avg_fatigue >= 0.55 ? 'Strained' : d.avg_fatigue >= 0.4 ? 'Watch' : 'Healthy';
                return (
                  <tr key={d.department} className="border-b border-violet-500/5 last:border-0">
                    <td className="px-5 py-4 font-display text-base">{d.department}</td>
                    <td className="px-5 py-4 tnum">{d.headcount}</td>
                    <td className="px-5 py-4 tnum">{d.avg_fatigue.toFixed(2)}</td>
                    <td className="px-5 py-4 tnum">{d.avg_productivity}%</td>
                    <td className="px-5 py-4"><Pill tone={tone}>{label}</Pill></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
