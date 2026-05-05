import { useState } from 'react';
import { useAuth } from '../hooks/useAuth.jsx';
import { ArrowRight, Zap } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');

  const submit = (e) => {
    e.preventDefault();
    setErr('');
    const res = login(employeeId, password);
    if (!res.ok) setErr(res.error);
  };

  return (
    <div className="min-h-screen bg-ink-950 text-bone flex relative overflow-hidden">
      {}
      <div className="hidden lg:flex flex-col justify-between w-[52%] p-14 relative overflow-hidden">
        {}
        <div className="absolute inset-0 opacity-90"
             style={{
               background: 'radial-gradient(ellipse 70% 60% at 20% 80%, rgba(124,58,237,0.45), transparent 60%), radial-gradient(ellipse 60% 50% at 90% 20%, rgba(245,130,32,0.25), transparent 55%)'
             }} />
        <div className="absolute inset-0 bg-grain opacity-60 pointer-events-none" />

        {}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-violet-400 to-violet-600 flex items-center justify-center shadow-lg shadow-violet-700/40">
            <Zap className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <div className="font-display text-xl tracking-tight">SmartWork</div>
            <div className="text-[11px] uppercase tracking-[0.18em] text-bone/50 font-mono">Workload Intelligence</div>
          </div>
        </div>

        {/* Editorial hero */}
        <div className="relative z-10 max-w-xl">
          <div className="font-mono text-[11px] tracking-[0.22em] uppercase text-violet-300/80 mb-6">
            Vol. 04 · Issue 12 · Spring Edition
          </div>
          <h1 className="editorial text-[5.5rem] leading-[0.9] mb-6">
            The work<br/>
            <em className="text-amber-400 not-italic font-display italic">behind</em> the<br/>
            work.
          </h1>
          <p className="text-bone/65 text-lg leading-relaxed max-w-md">
            A second pair of eyes on your day — measuring fatigue, surfacing rhythm, and protecting the deep hours that actually move the work forward.
          </p>
        </div>

        {/* Footer credits */}
        <div className="relative z-10 flex items-end justify-between text-[11px] font-mono uppercase tracking-[0.18em] text-bone/40">
          <div>An AI-Assisted<br/>Workforce Intelligence Suite</div>
          <div className="text-right">© 2026<br/>SmartWork Labs</div>
        </div>
      </div>

      {/* Right: Auth form */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-14 relative">
        <div className="absolute inset-0 lg:hidden"
             style={{
               background: 'radial-gradient(ellipse 60% 50% at 50% 100%, rgba(124,58,237,0.25), transparent 60%)'
             }} />
        <div className="w-full max-w-sm relative z-10">
          {/* Mobile brand */}
          <div className="flex items-center gap-3 mb-10 lg:hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-400 to-violet-600 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <div className="font-display text-lg">SmartWork</div>
          </div>

          <div className="font-mono text-[11px] tracking-[0.22em] uppercase text-violet-300/70 mb-3">
            §01 — Sign In
          </div>
          <h2 className="editorial text-4xl mb-2">Welcome back.</h2>
          <p className="text-bone/55 mb-10 text-sm">
            Pick up where you left off.
          </p>

          <form onSubmit={submit} className="space-y-5">
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-[0.18em] text-bone/50 mb-2">
                Employee ID
              </label>
              <input
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                placeholder="E0001"
                className="w-full bg-white/[0.04] border border-white/10 focus:border-violet-400 focus:bg-white/[0.07] focus:outline-none rounded-xl px-4 py-3 text-bone placeholder:text-bone/25 transition tnum"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-[0.18em] text-bone/50 mb-2">
                Password
              </label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="••••••••"
                className="w-full bg-white/[0.04] border border-white/10 focus:border-violet-400 focus:bg-white/[0.07] focus:outline-none rounded-xl px-4 py-3 text-bone placeholder:text-bone/25 transition"
              />
            </div>

            {err && (
              <div className="text-rose-500 text-sm bg-rose-500/10 border border-rose-500/20 rounded-lg px-3 py-2">
                {err}
              </div>
            )}

            <button
              type="submit"
              className="group w-full bg-bone text-ink-900 hover:bg-white rounded-xl py-3.5 font-semibold flex items-center justify-center gap-2 transition shadow-lg shadow-violet-900/20"
            >
              Sign in
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
            </button>

            <div className="text-center pt-2">
              <button type="button" className="text-bone/50 hover:text-bone text-sm link-dot">
                Forgot password?
              </button>
            </div>
          </form>

          <div className="mt-12 pt-6 border-t border-white/8">
            <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-bone/40 mb-3">
              Demo accounts
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => { setEmployeeId('E0001'); setPassword('demo'); }}
                className="bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 rounded-lg px-3 py-2 text-left transition"
              >
                <div className="text-bone font-semibold">E0001</div>
                <div className="text-bone/45">Employee view</div>
              </button>
              <button
                type="button"
                onClick={() => { setEmployeeId('H0001'); setPassword('demo'); }}
                className="bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 rounded-lg px-3 py-2 text-left transition"
              >
                <div className="text-bone font-semibold">H0001</div>
                <div className="text-bone/45">HR view</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
