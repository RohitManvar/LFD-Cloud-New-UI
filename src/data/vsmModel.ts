/** Value Stream Mapping (LFD step 4): the gear line from Capacity Planning, mapped current and future, with the live app's takt and lead-time arithmetic. */

/* ── Project Setup: mirrors the live app's ProjectSetup sections ── */

export const PRODUCTION_UNITS = [
  { value: 'Pieces', label: 'Pieces (Units)', short: 'Units' },
  { value: 'Metric Tons (MT)', label: 'Metric Tons (MT)', short: 'MT' },
  { value: 'Kilograms (kg)', label: 'Kilograms (kg)', short: 'kg' },
  { value: 'Liters (L)', label: 'Liters (L)', short: 'L' },
];
/** The live app's getUnitShort: known units, else the text in brackets, else the name. */
export const unitShort = (unit: string) => PRODUCTION_UNITS.find(u => u.value === unit)?.short ?? (unit.match(/\(([^)]+)\)/)?.[1] || unit || 'Units');

export interface BreakColumn { key: string; label: string; }
/** The live app's default break columns; users can add their own (meetings, gemba, etc.). */
export const DEFAULT_BREAK_COLS: BreakColumn[] = [
  { key: 'lunch', label: 'Lunch (min)' }, { key: 'tea', label: 'Tea (min)' }, { key: 'shiftChangeover', label: 'Shift C/O (min)' },
  { key: 'break5s', label: '5S (min)' }, { key: 'tbt', label: 'TBT (min)' }, { key: 'cleaning', label: 'Cleaning (min)' },
];
export const BREAK_PRESETS = ['Shift C/O', '5S', 'TBT', 'Cleaning', 'Meeting'];

export type TimeUnit = 'hrs' | 'min' | 'sec';
export interface VsmShift { id: string; name: string; duration: number; durationUnit: TimeUnit; breaks: Record<string, number>; }
export interface TaktInputs {
  /** Rate of production per month (Production Profile). */
  monthlyDemand: number; workingDays: number; unit: string; shifts: VsmShift[]; breakCols: BreakColumn[];
  /** Combined customer demand per day; takt is based on this, as in the live app. */
  demandPerDay: number;
}
export const vsmTakt: TaktInputs = {
  monthlyDemand: 48000, workingDays: 25, unit: 'Pieces', breakCols: DEFAULT_BREAK_COLS, demandPerDay: 1920,
  shifts: [
    { id: 'S1', name: 'Shift I', duration: 8, durationUnit: 'hrs', breaks: { lunch: 30, tea: 20 } },
    { id: 'S2', name: 'Shift II', duration: 8, durationUnit: 'hrs', breaks: { lunch: 30, tea: 20 } },
  ],
};
export const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];

export const SUPPLIER_CATEGORIES = ['Strategic', 'Approved', 'Local', 'Global', 'Internal', 'Tier 1', 'Tier 2', 'Commodity'];
export const CUSTOMER_CATEGORIES = ['Strategic', 'OEM', 'Distributor', 'Tier 1', 'Tier 2', 'A Class', 'B Class', 'C Class'];
export const TRANSPORT_METHODS = ['Truck', 'Rail', 'Air', 'Ship', 'Other'];
export const SHIPPING_METHODS = ['Truck', 'Milk Run', 'Rail', 'Air', 'Ship', 'Other'];
export const FREQUENCIES = ['Daily', 'Weekly', 'Bi-Weekly', 'Monthly', 'Custom'];
export const INFO_CHANNELS = ['ERP', 'EDI', 'Email', 'Portal', 'Phone', 'Manual', 'WhatsApp', 'Fax', 'Other'];
export const PLANNING_METHODS = ['MRP', 'Pull', 'Kanban', 'Manual', 'Hybrid', 'JIT'];
export const DEMAND_PERIODS = ['Daily', 'Weekly', 'Monthly'];
export const TAKT_UNITS = [
  { value: 'sec', label: 'Seconds' }, { value: 'min', label: 'Minutes' }, { value: 'hrs', label: 'Hours' },
  { value: 'days', label: 'Days' }, { value: 'monthly', label: 'Monthly' }, { value: 'yearly', label: 'Yearly' },
];
export const FLOW_CONNECT_OPTIONS = ['Process Box', 'Purchase', 'Supplier', 'Customer', 'Inbound Warehouse', 'Outbound Warehouse'];
export const INDUSTRIES = ['Automotive', 'Forging', 'Packaging', 'Electronics', 'Pharmaceuticals', 'Food & Beverage', 'Textiles', 'Other'];

export interface VsmSupplier {
  id: string; name: string; location: string; distanceKm: number; category: string; transport: string;
  leadTime: number; leadTimeUnit: string; deliveryFrequency: string; transportTime: number; transportTimeUnit: string;
  moq: number; orderFrequency: string; forecastFrequency: string; infoChannel: string;
}
export interface VsmCustomer {
  id: string; name: string; location: string; distanceKm: number; category: string;
  demand: number; demandPeriod: string; deliveryFrequency: string; shipping: string; leadTimeDays: number;
  orderFrequency: string; forecastFrequency: string; planningMethod: string; infoChannel: string; taktUnit: string;
}
export interface InfoFlow { id: string; name: string; connectTo: string[]; }
export interface VsmSetup {
  org: { mode: 'existing' | 'new'; selected: string; name: string; location: string; industry: string; };
  basics: { name: string; productLine: string; facility: string; };
  suppliers: VsmSupplier[];
  customers: VsmCustomer[];
  info: { routing: 'sequential' | 'parallel'; ppcsName: string; flows: InfoFlow[]; scmName: string; };
}
export const emptySupplier = (id: string): VsmSupplier => ({ id, name: '', location: '', distanceKm: 0, category: 'Approved', transport: 'Truck', leadTime: 0, leadTimeUnit: 'days', deliveryFrequency: 'Daily', transportTime: 0, transportTimeUnit: 'days', moq: 0, orderFrequency: '', forecastFrequency: 'Monthly', infoChannel: '' });
export const emptyCustomer = (id: string): VsmCustomer => ({ id, name: '', location: '', distanceKm: 0, category: 'OEM', demand: 0, demandPeriod: 'Daily', deliveryFrequency: 'Daily', shipping: 'Truck', leadTimeDays: 0, orderFrequency: 'Weekly', forecastFrequency: 'Monthly', planningMethod: 'MRP', infoChannel: '', taktUnit: 'sec' });
export const vsmSetup: VsmSetup = {
  org: { mode: 'existing', selected: 'Sahyadri Auto Components Pvt. Ltd.', name: '', location: '', industry: '' },
  basics: { name: 'GR-24 gear line', productLine: 'Transmission gear — GR-24 family', facility: 'Chakan MIDC, Pune' },
  suppliers: [
    { ...emptySupplier('SUP1'), name: 'Bar-stock mill', location: 'Pune', distanceKm: 42, category: 'Strategic', leadTime: 7, deliveryFrequency: 'Weekly', transportTime: 2, transportTimeUnit: 'hrs', moq: 2000, orderFrequency: 'Weekly', infoChannel: 'Email' },
  ],
  customers: [
    { ...emptyCustomer('CUS1'), name: 'Tier-1 OEM', location: 'Chennai', distanceKm: 1180, demand: 48000, demandPeriod: 'Monthly', leadTimeDays: 5, infoChannel: 'EDI' },
  ],
  info: {
    routing: 'parallel', ppcsName: 'Central PPCS', scmName: 'Purchase',
    flows: [
      { id: 'FL1', name: 'Sales & Distribution Planning', connectTo: ['Customer'] },
      { id: 'FL2', name: 'Supply Chain & Procurement', connectTo: ['Purchase'] },
      { id: 'FL3', name: 'Production Planning (Batch Schedule)', connectTo: ['Process Box'] },
    ],
  },
};
/** The live app's perDayDemand: weekly ÷ 5, monthly ÷ working days. */
export const customerDailyDemand = (c: VsmCustomer, workingDays: number) => c.demandPeriod === 'Weekly' ? c.demand / 5 : c.demandPeriod === 'Monthly' ? c.demand / (workingDays || 25) : c.demand;

/** Labels the static parts of the screens still use. */
export const vsmContext = { family: vsmSetup.basics.productLine };

/* ── Process Builder: one row per process box, the live app's default columns ── */

export interface VsmProcess {
  id: string; name: string;
  /** Hours per day the process is staffed. */
  hours: number;
  cycleTime: number;
  /** Average changeover, minutes. */
  changeover: number;
  changeoverCount: number;
  machines: number; operators: number;
  oee: number; breakdown: number; rejection: number; rework: number;
  /** Days of stock waiting after this process; the last one is finished goods. */
  inventoryAfter: number;
  /** Future state only: how the material moves to the next step. */
  link?: 'push' | 'fifo' | 'supermarket';
  pacemaker?: boolean;
  /** Future state only: kaizen bursts drawn on this box. */
  kaizens?: string[];
  /** Values for columns added with Add Column. */
  custom?: Record<string, number>;
}
/** The live app draws uptime as 100 − breakdown %. */
export const uptime = (p: VsmProcess) => Math.max(0, Math.round((100 - p.breakdown) * 10) / 10);
export const totalChangeover = (p: VsmProcess) => Math.round(p.changeover * p.changeoverCount * 10) / 10;

const proc = (p: Partial<VsmProcess> & Pick<VsmProcess, 'id' | 'name' | 'cycleTime' | 'changeover' | 'breakdown' | 'operators' | 'inventoryAfter'>): VsmProcess =>
  ({ hours: 16, changeoverCount: 1, machines: 1, oee: 75, rejection: 1, rework: 1, ...p });
export const newProcess = (id: string, name = 'New process'): VsmProcess =>
  proc({ id, name, cycleTime: 0, changeover: 0, changeoverCount: 0, breakdown: 0, operators: 1, inventoryAfter: 0, oee: 0, rejection: 0, rework: 0 });

export const currentRawMaterialDays = 5.0;
export const currentProcesses: VsmProcess[] = [
  proc({ id: 'P1', name: 'CNC Turning', cycleTime: 24, changeover: 45, changeoverCount: 2, breakdown: 12, operators: 2, machines: 3, oee: 71, rejection: 1.5, rework: 2, inventoryAfter: 1.5 }),
  proc({ id: 'P2', name: 'Gear Hobbing', cycleTime: 31, changeover: 60, changeoverCount: 2, breakdown: 18, operators: 2, machines: 4, oee: 62, rejection: 2.5, rework: 3, inventoryAfter: 2.0 }),
  proc({ id: 'P3', name: 'Deburring', cycleTime: 18, changeover: 10, changeoverCount: 1, breakdown: 5, operators: 1, machines: 1, oee: 84, rejection: 0.5, rework: 1, inventoryAfter: 0.8 }),
  proc({ id: 'P4', name: 'Heat Treatment', cycleTime: 22, changeover: 120, changeoverCount: 1, breakdown: 10, operators: 2, machines: 1, hours: 24, oee: 74, rejection: 1, rework: 0.5, inventoryAfter: 2.5 }),
  proc({ id: 'P5', name: 'Grinding', cycleTime: 26, changeover: 30, changeoverCount: 2, breakdown: 14, operators: 2, machines: 3, oee: 70, rejection: 2, rework: 2.5, inventoryAfter: 1.2 }),
  proc({ id: 'P6', name: 'Wash & Inspect', cycleTime: 15, changeover: 5, changeoverCount: 1, breakdown: 3, operators: 1, machines: 1, oee: 88, rejection: 0.5, rework: 0, inventoryAfter: 0.5 }),
  proc({ id: 'P7', name: 'Test & Pack', cycleTime: 20, changeover: 15, changeoverCount: 1, breakdown: 4, operators: 2, machines: 2, oee: 86, rejection: 0.3, rework: 0, inventoryAfter: 3.0 }),
];

export const futureRawMaterialDays = 2.0;
export const futureProcesses: VsmProcess[] = [
  proc({ id: 'F1', name: 'Turn–Hob–Deburr', cycleTime: 26, changeover: 20, breakdown: 8, operators: 4, machines: 5, oee: 80, inventoryAfter: 0.3, link: 'fifo', kaizens: ['K1', 'K2', 'K3', 'K4'] }),
  proc({ id: 'F2', name: 'Heat Treatment', cycleTime: 22, changeover: 30, breakdown: 7, operators: 1, hours: 24, oee: 82, inventoryAfter: 1.0, link: 'supermarket', kaizens: ['K5', 'K6'] }),
  proc({ id: 'F3', name: 'Grinding', cycleTime: 24, changeover: 15, breakdown: 8, operators: 2, machines: 3, oee: 80, inventoryAfter: 0.2, link: 'fifo', pacemaker: true, kaizens: ['K7'] }),
  proc({ id: 'F4', name: 'Wash & Inspect', cycleTime: 15, changeover: 5, breakdown: 3, operators: 1, oee: 88, inventoryAfter: 0.1, link: 'fifo' }),
  proc({ id: 'F5', name: 'Test & Pack', cycleTime: 20, changeover: 10, breakdown: 4, operators: 2, machines: 2, oee: 86, inventoryAfter: 1.5, link: 'supermarket' }),
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

/* ── Arithmetic ── */

/** Break minutes in one shift, across every break column. */
export const shiftMinutes = (s: VsmShift) => s.durationUnit === 'hrs' ? s.duration * 60 : s.durationUnit === 'sec' ? s.duration / 60 : s.duration;
export const shiftBreakMinutes = (s: VsmShift, cols: BreakColumn[]) => cols.reduce((a, c) => a + (s.breaks[c.key] || 0), 0);
export const shiftNetMinutes = (s: VsmShift, cols: BreakColumn[]) => Math.max(0, shiftMinutes(s) - shiftBreakMinutes(s, cols));
/** Net seconds per day: every shift's length less its breaks. */
export const availableSeconds = (t: TaktInputs) => t.shifts.reduce((a, s) => a + shiftNetMinutes(s, t.breakCols), 0) * 60;
export const dailyDemand = (t: TaktInputs) => t.demandPerDay > 0 ? Math.round(t.demandPerDay * 100) / 100 : t.workingDays > 0 ? Math.round(t.monthlyDemand / t.workingDays) : 0;
/** Per Day Production in Production Profile: rate of production ÷ working days. */
export const productionPerDay = (t: TaktInputs) => t.workingDays > 0 ? Math.round(t.monthlyDemand / t.workingDays * 100) / 100 : 0;
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

/* ── VSM Dashboard: the live app's "Recent Value Streams" list ── */
export type MapLevel = 'process' | 'facility' | 'extended';
export type StreamStatus = 'Completed' | 'In Progress' | 'On Hold';
export interface ValueStreamRow { id: string; name: string; detail: string; level: MapLevel | null; org: string; status: StreamStatus; progress: number; updated: string; createdBy: string; created: string; }
export const MAP_LEVEL_LABEL: Record<MapLevel, string> = { process: 'Process', facility: 'Facility', extended: 'Extended' };
export const vsmOrganizations = ['Sahyadri Auto Components Pvt. Ltd.', 'Deccan Precision Forgings', 'Konkan Packaging Works'];
export const valueStreams: ValueStreamRow[] = [
  { id: 'VS-108', name: 'GR-24 gear line', detail: 'Automotive · Chakan MIDC, Pune', level: 'process', org: vsmOrganizations[0], status: 'In Progress', progress: 60, updated: '2026-11-22', createdBy: 'Rohit Manvar', created: '2026-10-30' },
  { id: 'VS-107', name: 'Bearing Assembly Line', detail: 'Wheel bearings · Chakan MIDC, Pune', level: 'process', org: vsmOrganizations[0], status: 'Completed', progress: 100, updated: '2026-11-18', createdBy: 'Anita Kulkarni', created: '2026-09-12' },
  { id: 'VS-106', name: 'Forge shop — crankshafts', detail: 'Forging · Satara', level: 'facility', org: vsmOrganizations[1], status: 'In Progress', progress: 40, updated: '2026-11-15', createdBy: 'Sameer Joshi', created: '2026-10-02' },
  { id: 'VS-105', name: 'Plant-wide flow 2027', detail: 'Forging · Satara', level: 'extended', org: vsmOrganizations[1], status: 'On Hold', progress: 20, updated: '2026-11-04', createdBy: 'Anita Kulkarni', created: '2026-09-20' },
  { id: 'VS-104', name: 'Corrugated box line', detail: 'Packaging · Ratnagiri', level: 'process', org: vsmOrganizations[2], status: 'Completed', progress: 100, updated: '2026-10-28', createdBy: 'Priya Deshmukh', created: '2026-08-14' },
  { id: 'VS-103', name: 'Brake disc machining', detail: 'Automotive · Chakan MIDC, Pune', level: 'process', org: vsmOrganizations[0], status: 'In Progress', progress: 80, updated: '2026-10-21', createdBy: 'Rohit Manvar', created: '2026-08-01' },
  { id: 'VS-102', name: 'Label printing cell', detail: 'Packaging · Ratnagiri', level: null, org: vsmOrganizations[2], status: 'In Progress', progress: 0, updated: '2026-10-09', createdBy: 'Priya Deshmukh', created: '2026-10-05' },
  { id: 'VS-101', name: 'Connecting rod line', detail: 'Forging · Satara', level: 'process', org: vsmOrganizations[1], status: 'Completed', progress: 100, updated: '2026-09-30', createdBy: 'Sameer Joshi', created: '2026-07-18' },
];

/* ── FSM Planner: improvement points, as in the live app's FSPlanner ── */
export const IMP_TARGET_TYPES = [
  { key: 'on_process', label: 'On Process' }, { key: 'between_processes', label: 'Between Processes' }, { key: 'on_supplier', label: 'On Supplier' },
  { key: 'supplier_to_first', label: 'Supplier → First Machine' }, { key: 'on_customer', label: 'On Customer' }, { key: 'last_to_customer', label: 'Last Machine → Customer' },
  { key: 'production_control', label: 'Production Control' }, { key: 'information_flow', label: 'Information Flow' }, { key: 'on_transportation', label: 'On Transportation' },
];
export type ImpParam = 'cycleTime' | 'operators' | 'rework' | 'rejection' | 'breakdown' | 'changeover' | 'inventory';
export const IMP_FIELDS: { key: ImpParam; label: string; unit: string; methods: { key: 'percentage' | 'fixed' | 'set'; label: string; hint: string }[] }[] = [
  { key: 'cycleTime', label: 'Cycle Time', unit: 'sec', methods: [{ key: 'percentage', label: '% Reduction', hint: 'e.g. 20 → cut by 20%' }, { key: 'fixed', label: 'Reduce by (sec)', hint: 'e.g. 30' }, { key: 'set', label: 'Set to (sec)', hint: 'e.g. 60' }] },
  { key: 'operators', label: 'Operators', unit: '', methods: [{ key: 'fixed', label: 'Reduce headcount by', hint: 'e.g. 1' }, { key: 'set', label: 'Set to', hint: 'e.g. 2' }] },
  { key: 'rework', label: 'Rework %', unit: '%', methods: [{ key: 'fixed', label: 'Reduce by % pts', hint: 'e.g. 5 → cut by 5 pts' }, { key: 'set', label: 'Set to %', hint: 'e.g. 2' }] },
  { key: 'rejection', label: 'Rejection %', unit: '%', methods: [{ key: 'fixed', label: 'Reduce by % pts', hint: 'e.g. 2 → cut by 2 pts' }, { key: 'set', label: 'Set to %', hint: 'e.g. 0.5' }] },
  { key: 'breakdown', label: 'Breakdown %', unit: '%', methods: [{ key: 'fixed', label: 'Reduce by % pts', hint: 'e.g. 5 → cut by 5 pts' }, { key: 'set', label: 'Set to %', hint: 'e.g. 1' }] },
  { key: 'changeover', label: 'Changeover Time', unit: 'min', methods: [{ key: 'percentage', label: '% Reduction', hint: 'e.g. 30 → cut by 30%' }, { key: 'fixed', label: 'Reduce by (min)', hint: 'e.g. 10' }, { key: 'set', label: 'Set to (min)', hint: 'e.g. 15' }] },
];
/** Between Processes changes the stock in that connection. */
export const INV_FIELD = { key: 'inventory' as ImpParam, label: 'Inventory (days)', unit: 'days', methods: [{ key: 'percentage' as const, label: '% Reduction', hint: 'e.g. 50 → halve the buffer' }, { key: 'fixed' as const, label: 'Reduce by (days)', hint: 'e.g. 1' }, { key: 'set' as const, label: 'Set to (days)', hint: 'e.g. 0.5' }] };
export const IMP_TYPES = ['Process', 'Layout', 'Cycle Time'];
export const IMP_PRIORITIES = ['High', 'Medium', 'Low'];
export interface Improvement {
  id: string; title: string; type: string; priority: string; description: string; solution: string; cost: number; benefit: number;
  target: string; processId?: string; param?: ImpParam; method?: 'percentage' | 'fixed' | 'set'; value?: number;
  /** Where the burst sits on the map (map coordinates); recommendations pin to their process box. */
  x?: number; y?: number; recId?: string;
  /** Open / In Progress / Implemented, set on the FSM Map. */
  status?: string;
}
const KEY_OF: Record<ImpParam, keyof VsmProcess> = { cycleTime: 'cycleTime', operators: 'operators', rework: 'rework', rejection: 'rejection', breakdown: 'breakdown', changeover: 'changeover', inventory: 'inventoryAfter' };
/** The future-state steps: every numeric improvement applied in order. */
export function applyImprovements(processes: VsmProcess[], imps: Improvement[]): VsmProcess[] {
  return imps.reduce((list, imp) => {
    if (!imp.processId || !imp.param || !imp.method || imp.value === undefined) return list;
    const k = KEY_OF[imp.param];
    return list.map(p => {
      if (p.id !== imp.processId) return p;
      const cur = Number(p[k]) || 0;
      const val = imp.value ?? 0;
      const v = imp.method === 'percentage' ? cur * (1 - val / 100) : imp.method === 'fixed' ? cur - val : val;
      return { ...p, [k]: Math.max(0, Math.round(v * 100) / 100) };
    });
  }, processes);
}
export interface Recommendation { id: string; type: string; processId: string | null; processName: string | null; title: string; description: string; suggestion: string; impact: string; cost: string; fix?: Pick<Improvement, 'param' | 'method' | 'value'>; }
/** The live app's rule-based recommendations (RecommendationsPanel.generateRecommendations), with the fix each one applies. */
export function generateRecommendations(steps: VsmProcess[], taktTime: number | null): Recommendation[] {
  const recs: Recommendation[] = [];
  steps.forEach((s, idx) => {
    const name = s.name || 'Process ' + (idx + 1);
    const base = { processId: s.id, processName: name };
    if (taktTime && s.cycleTime > taktTime) recs.push({ ...base, id: 'rec_bottleneck_' + s.id, type: 'Cycle time', title: 'Bottleneck detected at ' + name, description: `Cycle time (${s.cycleTime}s) exceeds TAKT time (${taktTime.toFixed(1)}s), causing flow disruption and downstream starvation.`, suggestion: `Add a parallel workstation or reduce cycle time by ${(s.cycleTime - taktTime).toFixed(1)}s to meet TAKT.`, impact: 'High', cost: s.cycleTime - taktTime > taktTime * 0.5 ? 'High' : 'Medium', fix: { param: 'cycleTime', method: 'set', value: Math.floor(taktTime) } });
    if (s.rework > 5) recs.push({ ...base, id: 'rec_rework_' + s.id, type: 'Rework', title: 'High rework rate at ' + name, description: `Rework is ${s.rework}%, causing hidden capacity loss and increased cycle time.`, suggestion: 'Implement poka-yoke (error-proofing) or add in-process quality checks to catch defects earlier.', impact: s.rework > 15 ? 'High' : 'Medium', cost: 'Medium', fix: { param: 'rework', method: 'set', value: 2 } });
    if (s.rejection > 3) recs.push({ ...base, id: 'rec_rejection_' + s.id, type: 'Rejection', title: 'High rejection rate at ' + name, description: `Rejection rate of ${s.rejection}% leads to material waste and increased cost per unit.`, suggestion: 'Root cause analysis (5-Why or Ishikawa) recommended. Consider SPC monitoring or fixture improvements.', impact: s.rejection > 10 ? 'High' : 'Medium', cost: 'Low', fix: { param: 'rejection', method: 'set', value: 1 } });
    if (s.breakdown > 5) recs.push({ ...base, id: 'rec_breakdown_' + s.id, type: 'Breakdown', title: 'High breakdown rate at ' + name, description: `Machine breakdown rate is ${s.breakdown}%, reducing effective available time and OEE.`, suggestion: 'Implement Planned Preventive Maintenance (PPM) schedule to reduce unplanned downtime.', impact: s.breakdown > 15 ? 'High' : 'Medium', cost: 'Medium', fix: { param: 'breakdown', method: 'set', value: 3 } });
    const total = s.changeover * s.changeoverCount;
    if (total > 60) recs.push({ ...base, id: 'rec_changeover_' + s.id, type: 'Changeover', title: 'Excessive changeover time at ' + name, description: `Total changeover is ${total} min (${s.changeoverCount} setups × ${s.changeover} min each), reducing available production time.`, suggestion: 'Apply SMED (Single-Minute Exchange of Die) to reduce internal setup time. Target: < 10 min per changeover.', impact: total > 120 ? 'High' : 'Medium', cost: 'Low', fix: { param: 'changeover', method: 'set', value: 10 } });
    if (s.operators > 3 && s.cycleTime > 0) recs.push({ ...base, id: 'rec_operator_' + s.id, type: 'Operators', title: 'High operator count at ' + name, description: `${s.operators} operators assigned. Consider if automation or process redesign can reduce headcount without impacting throughput.`, suggestion: 'Analyze value-added vs non-value-added tasks per operator. Consider semi-automation for repetitive steps.', impact: 'Medium', cost: 'High', fix: { param: 'operators', method: 'fixed', value: 1 } });
  });
  const empty = steps.filter(s => !s.cycleTime);
  if (empty.length) recs.push({ id: 'rec_missing_data', type: 'Map design', processId: null, processName: null, title: 'Missing cycle time data', description: `${empty.length} process step(s) have no cycle time entered. Metrics may be inaccurate.`, suggestion: 'Fill in cycle time for every step in Process Builder.', impact: 'Medium', cost: 'Low' });
  return recs;
}
