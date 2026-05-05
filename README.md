# SmartWork Dashboard

A workforce-wellness dashboard with two roles (Employee / HR), built around fatigue detection, productivity tracking, task management, and live monitoring.

Stack: **React 18 + Vite + Tailwind CSS + Recharts + Lucide**.
All data is mocked in `src/data/mock.js` so it runs standalone — no backend required.

## Quick start

```bash
npm install
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173).

## Demo accounts

| ID    | Role     | Sees                                                |
|-------|----------|-----------------------------------------------------|
| E0001 | Employee | Personal fatigue dashboard, tasks, recent sessions  |
| H0001 | HR       | Workforce overview, live monitoring, control, reports |

Password is anything non-empty (demo auth).

## Pages

**Employee**
- `Dashboard` — Hero greeting, fatigue/productivity KPIs, area chart, hour-of-day bars, distribution
- `My Tasks` — Pending tasks as cards with priority, deadline, fatigue-rescheduled flag; completed tasks table
- `Recent Sessions` — Per-day timeline with gantt bars, engagement %, keystrokes/clicks

**HR**
- `Dashboard` — Smart insights banner, workforce KPIs, daily trend, department gauges, productivity-vs-fatigue scatter, at-risk register
- `Live Monitoring` — Sparkline cards for every employee, online/idle indicator, refreshes every 10s
- `Control Panel` — Toggle monitoring, set break interval, set fatigue threshold per employee
- `Recent Sessions` — All workforce sessions, filterable by employee and level
- `Reports` — Model accuracy/precision/recall/F1, confusion matrix heatmap, department summary

## Design notes

- Aesthetic: editorial / cream-paper. Fraunces display + Inter Tight body + JetBrains Mono for labels.
- Cream `#F5F0E6` canvas with subtle radial gradients and SVG grain overlay.
- Section numbering (§01, §02, …) and uppercase mono kickers for a print-magazine feel.
- Violet (#7C3AED) primary, amber (#F58220) secondary, rose (#FF5C7A) for danger, mint (#1FB87A) for healthy.

## Wiring it to a real backend

All mock data lives in `src/data/mock.js`. To connect to a Flask/REST API:

1. Replace the `import { ... } from '../data/mock.js'` calls in each page with `fetch()` calls.
2. The expected shapes match a typical fatigue-monitoring API:
   - `GET /fatigue/:employee_id` → `[{ timestamp, employee_id, overall_score, productivity, fatigue_level }]`
   - `GET /sessions` → `[{ id, employee_id, start_time, end_time, avg_fatigue, fatigue_level, task_summary, keystrokes, clicks }]`
   - `GET /my_tasks/:employee_id` → `[{ id, task_name, priority, status, deadline, estimated_duration_minutes, ... }]`
   - `POST /login` → `{ role, name, token }`
3. `src/hooks/useAuth.jsx` is the single place to swap in a real `fetch('/login', ...)` call.
