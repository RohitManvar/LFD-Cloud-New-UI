/** Value Stream Mapping (LFD step 4): the gear line from Capacity Planning, mapped current and future, with the live app's takt and lead-time arithmetic. */

export interface TaktInputs {
  monthlyDemand: number; workingDays: number; shifts: number; shiftMinutes: number; lunchMinutes: number; teaBreaks: number; teaMinutes: number;
}
export const vsmTakt: TaktInputs = { monthlyDemand: 48000, workingDays: 25, shifts: 2, shiftMinutes: 480, lunchMinutes: 30, teaBreaks: 2, teaMinutes: 10 };

export const vsmContext = {
  family: 'Transmission gear — GR-24 family',
  customer: 'Tier-1 transmission OEM', customerShort: 'Tier-1 OEM', customerShipping: '2 trucks / day',
  supplier: 'Bar-stock mill, Pune', supplierShort: 'Bar-stock mill', supplierShipping: 'Weekly truck',
  control: 'SAP MRP · weekly schedule',
};

export interface VsmProcess {
  id: string; name: string; cycleTime: number; changeover: number; uptime: number; operators: number;
  /** Days of WIP waiting after this process; the last one is finished goods. */
  inventoryAfter: number;
  /** Future state only: how the material moves to the next step. */
  link?: 'push' | 'fifo' | 'supermarket';
  pacemaker?: boolean;
  /** Future state only: kaizen bursts drawn on this box. */
  kaizens?: string[];
}

export const currentRawMaterialDays = 5.0;
export const currentProcesses: VsmProcess[] = [
  { id: 'P1', name: 'CNC Turning', cycleTime: 24, changeover: 45, uptime: 88, operators: 2, inventoryAfter: 1.5 },
  { id: 'P2', name: 'Gear Hobbing', cycleTime: 31, changeover: 60, uptime: 82, operators: 2, inventoryAfter: 2.0 },
  { id: 'P3', name: 'Deburring', cycleTime: 18, changeover: 10, uptime: 95, operators: 1, inventoryAfter: 0.8 },
  { id: 'P4', name: 'Heat Treatment', cycleTime: 22, changeover: 120, uptime: 90, operators: 2, inventoryAfter: 2.5 },
  { id: 'P5', name: 'Grinding', cycleTime: 26, changeover: 30, uptime: 86, operators: 2, inventoryAfter: 1.2 },
  { id: 'P6', name: 'Wash & Inspect', cycleTime: 15, changeover: 5, uptime: 97, operators: 1, inventoryAfter: 0.5 },
  { id: 'P7', name: 'Test & Pack', cycleTime: 20, changeover: 15, uptime: 96, operators: 2, inventoryAfter: 3.0 },
];

export const futureRawMaterialDays = 2.0;
export const futureProcesses: VsmProcess[] = [
  { id: 'F1', name: 'Turn–Hob–Deburr', cycleTime: 26, changeover: 20, uptime: 92, operators: 4, inventoryAfter: 0.3, link: 'fifo', kaizens: ['K1', 'K2', 'K3', 'K4'] },
  { id: 'F2', name: 'Heat Treatment', cycleTime: 22, changeover: 30, uptime: 93, operators: 1, inventoryAfter: 1.0, link: 'supermarket', kaizens: ['K5', 'K6'] },
  { id: 'F3', name: 'Grinding', cycleTime: 24, changeover: 15, uptime: 92, operators: 2, inventoryAfter: 0.2, link: 'fifo', pacemaker: true, kaizens: ['K7'] },
  { id: 'F4', name: 'Wash & Inspect', cycleTime: 15, changeover: 5, uptime: 97, operators: 1, inventoryAfter: 0.1, link: 'fifo' },
  { id: 'F5', name: 'Test & Pack', cycleTime: 20, changeover: 10, uptime: 96, operators: 2, inventoryAfter: 1.5, link: 'supermarket' },
];

export type KaizenStatus = 'planned' | 'in-progress' | 'done';
export interface Kaizen { id: string; title: string; station: string; impact: string; waste: string; status: KaizenStatus; }
export const vsmKaizens: Kaizen[] = [
  { id: 'K1', title: 'SMED on the hobbers', station: 'Gear Hobbing', impact: 'Changeover 60 → 20 min', waste: 'Waiting', status: 'in-progress' },
  { id: 'K2', title: 'TPM on the hobbers', station: 'Gear Hobbing', impact: 'Uptime 82% → 92%', waste: 'Defects', status: 'planned' },
  { id: 'K3', title: 'Turn–hob–deburr cell', station: 'CNC Turning → Deburring', impact: 'Removes 2 WIP buffers (3.5 days)', waste: 'Inventory', status: 'planned' },
  { id: 'K4', title: 'Add a 5th hobber', station: 'Gear Hobbing', impact: 'Cell CT 31 s → 26 s, under takt', waste: 'Overburden', status: 'planned' },
  { id: 'K5', title: 'Continuous furnace loading', station: 'Heat Treatment', impact: 'Changeover 120 → 30 min', waste: 'Overproduction', status: 'planned' },
  { id: 'K6', title: 'Supermarket + kanban after HT', station: 'Heat Treatment → Grinding', impact: 'WIP capped at 1 day', waste: 'Inventory', status: 'planned' },
  { id: 'K7', title: 'Heijunka box at the pacemaker', station: 'Grinding', impact: 'Mix levelled in 20-min pitch', waste: 'Unevenness', status: 'planned' },
  { id: 'K8', title: 'Milk run for bar stock', station: 'Supplier', impact: 'Raw material 5 → 2 days', waste: 'Transport', status: 'done' },
];
export const KAIZEN_STATUS: { key: KaizenStatus; label: string }[] = [
  { key: 'planned', label: 'Planned' }, { key: 'in-progress', label: 'In progress' }, { key: 'done', label: 'Done' },
];

/** Net seconds per day: shifts × (shift − lunch − tea breaks). */
export const availableSeconds = (t: TaktInputs) => Math.max(0, t.shifts * (t.shiftMinutes - t.lunchMinutes - t.teaBreaks * t.teaMinutes) * 60);
export const dailyDemand = (t: TaktInputs) => t.workingDays > 0 ? Math.round(t.monthlyDemand / t.workingDays) : 0;
/** Takt = available seconds ÷ daily demand; null when either is missing. */
export function taktSeconds(t: TaktInputs) {
  const avail = availableSeconds(t), demand = dailyDemand(t);
  return avail > 0 && demand > 0 ? Math.round(avail / demand * 10) / 10 : null;
}

export function mapMetrics(processes: VsmProcess[], rawMaterialDays: number, t: TaktInputs) {
  const leadTimeDays = Math.round((rawMaterialDays + processes.reduce((a, p) => a + p.inventoryAfter, 0)) * 10) / 10;
  const vaSeconds = processes.reduce((a, p) => a + p.cycleTime, 0);
  const avail = availableSeconds(t);
  const takt = taktSeconds(t);
  const bottleneck = processes.reduce((a, p) => p.cycleTime > a.cycleTime ? p : a, processes[0]);
  return {
    leadTimeDays, vaSeconds,
    /** Process cycle efficiency: VA seconds over the lead time in working seconds. */
    pce: avail && leadTimeDays ? vaSeconds / (leadTimeDays * avail) * 100 : null,
    operators: processes.reduce((a, p) => a + p.operators, 0),
    steps: processes.length,
    wipDays: Math.round(processes.slice(0, -1).reduce((a, p) => a + p.inventoryAfter, 0) * 10) / 10,
    bottleneck, overTakt: takt === null ? [] : processes.filter(p => p.cycleTime > takt),
  };
}

export const formatPce = (v: number | null) => v === null ? '—' : v < 0.1 ? v.toFixed(3) + '%' : v.toFixed(2) + '%';
export const pctChange = (from: number, to: number) => from ? Math.round((to - from) / from * 100) : 0;
