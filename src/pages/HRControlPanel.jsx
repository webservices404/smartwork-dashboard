import { useState } from 'react';
import { employees, monitoringControl } from '../data/mock.js';
import { Avatar, Pill, SectionHead } from '../components/UI.jsx';
import { Power, Settings2, AlertCircle, Save } from 'lucide-react';

export default function HRControlPanel() {
  const [controls, setControls] = useState(monitoringControl);
  const [saved, setSaved] = useState(false);

  const update = (id, key, value) => {
    setControls((prev) => ({ ...prev, [id]: { ...prev[id], [key]: value } }));
    setSaved(false);
  };

  const employeesList = employees.filter((e) => e.role === 'employee');

  return (
    <div className="space-y-7">
      <div className="surface p-6 lg:p-7 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-violet-700/60 mb-2">
            §01 — Per-employee controls
          </div>
          <h2 className="editorial text-2xl">Tune the agent</h2>
          <p className="text-sm text-ink-700/55 mt-1 max-w-xl">
            Pause monitoring for time-off, adjust break frequency, and set the fatigue threshold that triggers a suggestion popup.
          </p>
        </div>
        <button
          onClick={() => setSaved(true)}
          className={`flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold transition shrink-0 ${
            saved ? 'bg-mint-500/15 text-mint-500 border border-mint-500/30' : 'bg-ink-900 text-bone hover:bg-ink-800'
          }`}
        >
          <Save className="w-4 h-4" />
          {saved ? 'All changes saved' : 'Save changes'}
        </button>
      </div>

      <div className="surface overflow-hidden">
        <div className="grid grid-cols-12 px-6 py-3 bg-violet-500/5 border-b border-violet-500/10 text-[10px] font-mono uppercase tracking-[0.18em] text-ink-700/55">
          <div className="col-span-4">Employee</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-3">Break interval</div>
          <div className="col-span-3">Fatigue threshold</div>
        </div>
        {employeesList.map((e) => {
          const c = controls[e.employee_id];
          return (
            <div key={e.employee_id} className="grid grid-cols-12 px-6 py-4 items-center border-b border-violet-500/5 last:border-0 hover:bg-violet-500/3">
              <div className="col-span-4 flex items-center gap-3">
                <Avatar name={e.name} id={e.employee_id} size={32} />
                <div className="min-w-0">
                  <div className="font-semibold text-sm truncate">{e.name}</div>
                  <div className="text-[11px] text-ink-700/55 font-mono">{e.employee_id} · {e.department}</div>
                </div>
              </div>

              <div className="col-span-2">
                <button
                  onClick={() => update(e.employee_id, 'active', !c.active)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                    c.active
                      ? 'bg-mint-500/15 text-mint-500 border border-mint-500/30'
                      : 'bg-ink-900/8 text-ink-700/60 border border-ink-900/15'
                  }`}
                >
                  <Power className="w-3 h-3" />
                  {c.active ? 'Active' : 'Paused'}
                </button>
              </div>

              <div className="col-span-3 flex items-center gap-3">
                <input
                  type="range"
                  min={15}
                  max={180}
                  step={15}
                  value={c.break_interval_min}
                  onChange={(ev) => update(e.employee_id, 'break_interval_min', +ev.target.value)}
                  className="flex-1 accent-violet-500"
                />
                <span className="font-mono text-xs tnum text-ink-700/65 w-12">{c.break_interval_min}m</span>
              </div>

              <div className="col-span-3 flex items-center gap-3">
                <input
                  type="range"
                  min={0.3}
                  max={0.9}
                  step={0.05}
                  value={c.fatigue_threshold}
                  onChange={(ev) => update(e.employee_id, 'fatigue_threshold', +ev.target.value)}
                  className="flex-1 accent-amber-500"
                />
                <span className="font-mono text-xs tnum text-ink-700/65 w-10">{c.fatigue_threshold.toFixed(2)}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="surface p-6 bg-amber-500/5 border-amber-500/20">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <div className="font-display text-base mb-1">A reminder on consent</div>
            <p className="text-sm text-ink-700/65 leading-relaxed">
              Monitoring should be transparent. Make sure each employee has been briefed on what the agent collects (keystroke counts, mouse activity, app categories — never content), and that they can pause it themselves.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
