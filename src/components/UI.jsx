import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export function KPI({ label, value, sub, trend, accent = 'violet', highlight = false }) {
  const accents = {
    violet: 'text-violet-600',
    amber:  'text-amber-500',
    mint:   'text-mint-500',
    rose:   'text-rose-500',
    ink:    'text-ink-900',
  };
  const trendIcon =
    trend > 0 ? <TrendingUp className="w-3.5 h-3.5" /> :
    trend < 0 ? <TrendingDown className="w-3.5 h-3.5" /> :
                <Minus className="w-3.5 h-3.5" />;
  const trendColor =
    trend > 0 ? 'text-mint-500' : trend < 0 ? 'text-rose-500' : 'text-ink-700/50';

  return (
    <div className={`surface p-5 transition hover:shadow-lift ${highlight ? 'ring-2 ring-amber-400/40' : ''}`}>
      <div className="flex items-start justify-between">
        <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-700/55">
          {label}
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-xs font-semibold tnum ${trendColor}`}>
            {trendIcon}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <div className={`mt-2 editorial text-[2.2rem] leading-none tnum ${accents[accent]}`}>
        {value}
      </div>
      {sub && (
        <div className="mt-2 text-xs text-ink-700/55">{sub}</div>
      )}
    </div>
  );
}

export function SectionHead({ kicker, title, subtitle, right }) {
  return (
    <div className="flex items-end justify-between mb-5 mt-10 first:mt-2">
      <div>
        {kicker && (
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-violet-700/60 mb-2">
            {kicker}
          </div>
        )}
        <h2 className="editorial text-2xl">{title}</h2>
        {subtitle && (
          <p className="text-sm text-ink-700/55 mt-1 max-w-xl">{subtitle}</p>
        )}
      </div>
      {right}
    </div>
  );
}

export function PeriodSelector({ value, onChange, options = ['D', 'W', 'M', '6M', 'Y'] }) {
  return (
    <div className="inline-flex items-center bg-white/70 border border-violet-500/10 rounded-full p-1 backdrop-blur-sm">
      {options.map((o) => (
        <button
          key={o}
          onClick={() => onChange(o)}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition tnum
            ${value === o
              ? 'bg-ink-900 text-bone shadow-sm'
              : 'text-ink-700/60 hover:text-ink-900'}
          `}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

export function Pill({ children, tone = 'violet', icon: Icon }) {
  const tones = {
    violet: 'bg-violet-500/10 text-violet-700 border-violet-500/20',
    amber:  'bg-amber-500/10 text-amber-600 border-amber-500/25',
    mint:   'bg-mint-500/10 text-mint-500 border-mint-500/25',
    rose:   'bg-rose-500/10 text-rose-600 border-rose-500/25',
    ink:    'bg-ink-900/8 text-ink-900 border-ink-900/15',
  };
  return (
    <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold border rounded-full px-2.5 py-1 ${tones[tone]}`}>
      {Icon && <Icon className="w-3 h-3" />}
      {children}
    </span>
  );
}

export function Avatar({ name, id, size = 36 }) {
  const initials = (name || id || '').split(' ').map((s) => s[0]).slice(0, 2).join('').toUpperCase();
  // Hash to a hue
  const hash = (id || name || '').split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const hues = ['from-violet-400 to-violet-600', 'from-amber-400 to-amber-600', 'from-mint-400 to-mint-500', 'from-rose-500 to-rose-600', 'from-ink-700 to-ink-900'];
  const cls = hues[hash % hues.length];
  return (
    <div
      style={{ width: size, height: size, fontSize: size * 0.36 }}
      className={`rounded-full bg-gradient-to-br ${cls} flex items-center justify-center text-white font-bold shrink-0`}
    >
      {initials}
    </div>
  );
}

export function Bar({ value, max = 100, color = 'violet' }) {
  const colors = {
    violet: 'from-violet-400 to-violet-600',
    amber:  'from-amber-400 to-amber-500',
    mint:   'from-mint-400 to-mint-500',
    rose:   'from-rose-500 to-rose-600',
  };
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className="h-2 bg-violet-500/8 rounded-full overflow-hidden">
      <div
        style={{ width: `${pct}%` }}
        className={`h-full bg-gradient-to-r ${colors[color]} rounded-full transition-all duration-700`}
      />
    </div>
  );
}
