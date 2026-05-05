const HOURS_BACK = 24 * 30;
const NOW = new Date();

function seeded(i) {
  return Math.abs(Math.sin(i * 12.9898) * 43758.5453) % 1;
}

function genFatigueSeries(employeeId, baseline = 0.32) {
  const out = [];
  for (let i = HOURS_BACK; i >= 0; i--) {
    const t = new Date(NOW.getTime() - i * 60 * 60 * 1000);
    const hour = t.getHours();

    const circadian =
      hour < 7 ? 0.55 :
      hour < 11 ? 0.22 :
      hour < 14 ? 0.40 :
      hour < 17 ? 0.58 :
      hour < 20 ? 0.45 : 0.50;
    const noise = (seeded(i + employeeId.charCodeAt(0)) - 0.5) * 0.18;
    const score = Math.max(0.05, Math.min(0.95, baseline + circadian * 0.4 + noise));
    let level = 'Normal';
    if (score >= 0.65) level = 'High';
    else if (score >= 0.4) level = 'Mild';
    out.push({
      timestamp: t.toISOString(),
      employee_id: employeeId,
      overall_score: +score.toFixed(3),
      productivity: +((1 - score) * 100).toFixed(1),
      fatigue_level: level,
    });
  }
  return out;
}

export const employees = [
  { employee_id: 'E0001', name: 'Aiman Hakimi',     department: 'Engineering', role: 'employee', email: 'aiman@smartwork.io',  joined: '2024-03-12' },
  { employee_id: 'E0002', name: 'Nur Aisyah',       department: 'Engineering', role: 'employee', email: 'aisyah@smartwork.io', joined: '2023-11-04' },
  { employee_id: 'E0003', name: 'Tan Wei Ming',     department: 'Design',      role: 'employee', email: 'wei@smartwork.io',    joined: '2024-01-22' },
  { employee_id: 'E0004', name: 'Priya Selvam',     department: 'Operations',  role: 'employee', email: 'priya@smartwork.io',  joined: '2024-06-15' },
  { employee_id: 'E0005', name: 'Marcus Lim',       department: 'Engineering', role: 'employee', email: 'marcus@smartwork.io', joined: '2023-08-30' },
  { employee_id: 'E0006', name: 'Siti Khadijah',    department: 'Operations',  role: 'employee', email: 'siti@smartwork.io',   joined: '2024-09-01' },
  { employee_id: 'E0007', name: 'Daniel Cheong',    department: 'Design',      role: 'employee', email: 'daniel@smartwork.io', joined: '2025-01-10' },
  { employee_id: 'E0008', name: 'Farah Iskandar',   department: 'Engineering', role: 'employee', email: 'farah@smartwork.io',  joined: '2024-05-20' },
  { employee_id: 'H0001', name: 'Rachel Voss',      department: 'HR',          role: 'hr',       email: 'rachel@smartwork.io', joined: '2022-04-04' },
];

const baselines = { E0001: 0.28, E0002: 0.62, E0003: 0.34, E0004: 0.45, E0005: 0.38, E0006: 0.71, E0007: 0.30, E0008: 0.42 };

export const fatigueRecords = employees
  .filter((e) => e.role === 'employee')
  .flatMap((e) => genFatigueSeries(e.employee_id, baselines[e.employee_id] ?? 0.4));

function genSessions() {
  const out = [];
  let id = 1;
  employees.filter((e) => e.role === 'employee').forEach((e) => {
    for (let d = 14; d >= 0; d--) {
      const day = new Date(NOW);
      day.setDate(day.getDate() - d);
      const startH = 8 + Math.floor(seeded(id) * 2);
      const dur = 60 + Math.floor(seeded(id + 1) * 360);
      const start = new Date(day); start.setHours(startH, Math.floor(seeded(id) * 60), 0, 0);
      const end = new Date(start.getTime() + dur * 60 * 1000);
      const score = baselines[e.employee_id] + (seeded(id + 7) - 0.5) * 0.3;
      const lvl = score >= 0.65 ? 'High' : score >= 0.4 ? 'Mild' : 'Normal';
      out.push({
        id: id++,
        employee_id: e.employee_id,
        start_time: start.toISOString(),
        end_time: end.toISOString(),
        avg_fatigue: +Math.max(0.05, Math.min(0.95, score)).toFixed(3),
        fatigue_level: lvl,
        task_summary: ['Reviewing pull requests', 'Designing wireframes', 'Customer email triage', 'Sprint planning', 'Database refactor', 'QA on staging'][id % 6],
        keystrokes: 200 + Math.floor(seeded(id + 2) * 800),
        clicks: 30 + Math.floor(seeded(id + 3) * 200),
      });
    }
  });
  return out.sort((a, b) => new Date(b.start_time) - new Date(a.start_time));
}

export const sessions = genSessions();

export const tasks = [
  { id: 1,  employee_id: 'E0001', task_name: 'Refactor monitoring scheduler', priority: 'high',   status: 'pending',   deadline: '2026-05-08 17:00', estimated_duration_minutes: 90,  fatigue_triggered: 0, rescheduled_count: 0, source: 'hr_assigned' },
  { id: 2,  employee_id: 'E0001', task_name: 'Code review: agent_main.py',    priority: 'medium', status: 'pending',   deadline: '2026-05-07 12:00', estimated_duration_minutes: 45,  fatigue_triggered: 1, rescheduled_count: 1, source: 'hr_assigned' },
  { id: 3,  employee_id: 'E0001', task_name: 'Write unit tests for tracker',  priority: 'low',    status: 'completed', deadline: '2026-05-05 18:00', estimated_duration_minutes: 60,  fatigue_triggered: 0, rescheduled_count: 0, source: 'self' },
  { id: 4,  employee_id: 'E0001', task_name: 'Update API documentation',      priority: 'medium', status: 'pending',   deadline: '2026-05-09 09:00', estimated_duration_minutes: 30,  fatigue_triggered: 0, rescheduled_count: 0, source: 'self' },
  { id: 5,  employee_id: 'E0001', task_name: 'Sync with design on dashboard', priority: 'high',   status: 'completed', deadline: '2026-05-04 16:00', estimated_duration_minutes: 30,  fatigue_triggered: 0, rescheduled_count: 0, source: 'hr_assigned' },
  { id: 6,  employee_id: 'E0002', task_name: 'Train fatigue model v3',        priority: 'high',   status: 'pending',   deadline: '2026-05-10 18:00', estimated_duration_minutes: 240, fatigue_triggered: 1, rescheduled_count: 2, source: 'self' },
];

export const suggestionLogs = [
  { id: 1, employee_id: 'E0001', timestamp: new Date(NOW.getTime() - 1*3600*1000).toISOString(), action: 'accepted', fatigue_score: 0.71, suggestion: '5-minute break' },
  { id: 2, employee_id: 'E0001', timestamp: new Date(NOW.getTime() - 5*3600*1000).toISOString(), action: 'rejected', fatigue_score: 0.62, suggestion: '5-minute break' },
  { id: 3, employee_id: 'E0001', timestamp: new Date(NOW.getTime() - 26*3600*1000).toISOString(), action: 'accepted', fatigue_score: 0.69, suggestion: 'Switch task' },
  { id: 4, employee_id: 'E0001', timestamp: new Date(NOW.getTime() - 49*3600*1000).toISOString(), action: 'accepted', fatigue_score: 0.75, suggestion: 'Stretch break' },
  { id: 5, employee_id: 'E0002', timestamp: new Date(NOW.getTime() - 2*3600*1000).toISOString(), action: 'rejected', fatigue_score: 0.81, suggestion: '5-minute break' },
];

export const departmentMetrics = [
  { department: 'Engineering', headcount: 4, avg_fatigue: 0.42, avg_productivity: 58 },
  { department: 'Design',      headcount: 2, avg_fatigue: 0.32, avg_productivity: 68 },
  { department: 'Operations',  headcount: 2, avg_fatigue: 0.58, avg_productivity: 42 },
];

export const monitoringControl = {
  E0001: { active: true,  break_interval_min: 90, fatigue_threshold: 0.65, last_seen_minutes_ago: 2  },
  E0002: { active: true,  break_interval_min: 60, fatigue_threshold: 0.55, last_seen_minutes_ago: 14 },
  E0003: { active: true,  break_interval_min: 90, fatigue_threshold: 0.65, last_seen_minutes_ago: 4  },
  E0004: { active: false, break_interval_min: 90, fatigue_threshold: 0.65, last_seen_minutes_ago: 124 },
  E0005: { active: true,  break_interval_min: 75, fatigue_threshold: 0.6,  last_seen_minutes_ago: 1  },
  E0006: { active: true,  break_interval_min: 45, fatigue_threshold: 0.5,  last_seen_minutes_ago: 7  },
  E0007: { active: true,  break_interval_min: 90, fatigue_threshold: 0.65, last_seen_minutes_ago: 11 },
  E0008: { active: false, break_interval_min: 90, fatigue_threshold: 0.65, last_seen_minutes_ago: 360 },
};

export const modelMetrics = {
  accuracy: 0.873,
  precision: 0.851,
  recall: 0.886,
  f1: 0.868,
  trained_at: '2026-04-29T10:14:00Z',
  samples: 28401,
  confusion_matrix: [
    [842, 38, 6],
    [44,  611, 31],
    [9,   28, 487],
  ],
  labels: ['Normal', 'Mild', 'High'],
};
