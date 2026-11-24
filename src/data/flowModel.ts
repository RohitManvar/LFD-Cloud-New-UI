/** Flow Management (LFD step 5): every product stream on one sheet, what they share, and the transportation index in ton-metres — the live app's arithmetic. */

export type StreamColour = 'amber' | 'sky' | 'green' | 'pink' | 'violet' | 'slate';
export const STREAM_COLOURS: Record<StreamColour, { fill: string; edge: string; ink: string }> = {
  amber: { fill: '#fef3c7', edge: '#d97706', ink: '#78350f' },
  sky: { fill: '#dbeafe', edge: '#2563eb', ink: '#1e3a8a' },
  green: { fill: '#d9f5e3', edge: '#059669', ink: '#065f46' },
  pink: { fill: '#fce7f3', edge: '#db2777', ink: '#831843' },
  violet: { fill: '#ede9fe', edge: '#7c3aed', ink: '#4c1d95' },
  slate: { fill: '#e8edf3', edge: '#475569', ink: '#1e293b' },
};

export type ResourceType = 'machine' | 'manual' | 'none';
export interface FlowStep { id: string; label: string; resource: ResourceType; count?: number; distance?: number; area?: string; }
export interface FlowStream { id: string; name: string; product: string; colour: StreamColour; volume: number; uom: string; steps: FlowStep[]; }

let seq = 0;
const machine = (label: string, count: number, distance?: number, area?: string): FlowStep => ({ id: 's' + ++seq, label, resource: 'machine', count, distance, area });
const manual = (label: string, distance?: number, area?: string): FlowStep => ({ id: 's' + ++seq, label, resource: 'manual', distance, area });
const marker = (label: string, distance?: number, area?: string): FlowStep => ({ id: 's' + ++seq, label, resource: 'none', distance, area });

export const flowStudy = { name: 'Chakan plant — transmission line', daysPerMonth: 25, unit: 'm' };

export const flowStreams: FlowStream[] = [
  {
    id: 'A', name: 'Transmission gears', product: 'GR-24 gear family', colour: 'amber', volume: 58, uom: 'MT',
    steps: [
      marker('RM store', undefined, 'Bar store'), machine('CNC Turning', 4, 35, 'Machine shop'), machine('Gear Hobbing', 5, 20, 'Machine shop'),
      machine('Deburring', 2, 10, 'Machine shop'), machine('Heat Treatment', 2, 85, 'HT shop'), machine('Grinding', 3, 70, 'Grinding bay'),
      manual('Wash & Inspect', 15, 'Grinding bay'), manual('Test & Pack', 20, 'Despatch'), marker('F.G.', 40, 'FG store'),
    ],
  },
  {
    id: 'B', name: 'Input shafts', product: 'IS-12 shaft family', colour: 'sky', volume: 30, uom: 'MT',
    steps: [
      marker('Bar store', undefined, 'Bar store'), machine('Bar Cutting', 2, 25, 'Bar store'), machine('CNC Turning', 3, 30, 'Machine shop'),
      machine('Spline Rolling', 1, 20, 'Machine shop'), machine('Heat Treatment', 1, 90, 'HT shop'), machine('Grinding', 2, 75, 'Grinding bay'),
      manual('Wash & Inspect', 15, 'Grinding bay'), manual('Test & Pack', 20, 'Despatch'), marker('F.G.', 40, 'FG store'),
    ],
  },
  {
    id: 'C', name: 'Gearbox housings', product: 'HX-3 aluminium housings', colour: 'green', volume: 45, uom: 'MT',
    steps: [
      marker('Casting store', undefined, 'Casting store'), machine('VMC Machining', 4, 50, 'Housing line'), machine('Drilling & Tapping', 2, 15, 'Housing line'),
      machine('Leak Testing', 1, 20, 'Housing line'), manual('Wash & Inspect', 35, 'Grinding bay'), machine('Painting', 1, 40, 'Paint shop'),
      manual('Test & Pack', 30, 'Despatch'), marker('F.G.', 40, 'FG store'),
    ],
  },
];

export interface FlowMove { id: string; group: string; material: string; from: string; to: string; asIs: number; toBe: number | null; trips: number; qty: number; }
export const flowMoves: FlowMove[] = [
  { id: 'M01', group: 'Raw material', material: 'Bar stock (gears)', from: 'Bar store', to: 'CNC Turning', asIs: 95, toBe: 30, trips: 4, qty: 500 },
  { id: 'M02', group: 'Raw material', material: 'Bar stock (shafts)', from: 'Bar store', to: 'Bar Cutting', asIs: 80, toBe: 25, trips: 2, qty: 400 },
  { id: 'M03', group: 'Raw material', material: 'Housing castings', from: 'Casting store', to: 'VMC Machining', asIs: 120, toBe: 40, trips: 3, qty: 600 },
  { id: 'M04', group: 'Between processes', material: 'Hobbed gears', from: 'Deburring', to: 'Heat Treatment', asIs: 85, toBe: 20, trips: 8, qty: 180 },
  { id: 'M05', group: 'Between processes', material: 'Rolled shafts', from: 'Spline Rolling', to: 'Heat Treatment', asIs: 90, toBe: 25, trips: 4, qty: 150 },
  { id: 'M06', group: 'Between processes', material: 'Hardened gears', from: 'Heat Treatment', to: 'Grinding', asIs: 70, toBe: 15, trips: 8, qty: 175 },
  { id: 'M07', group: 'Between processes', material: 'Hardened shafts', from: 'Heat Treatment', to: 'Grinding', asIs: 75, toBe: 15, trips: 4, qty: 145 },
  { id: 'M08', group: 'Between processes', material: 'Machined housings', from: 'Leak Testing', to: 'Wash & Inspect', asIs: 35, toBe: 10, trips: 6, qty: 120 },
  { id: 'M09', group: 'Finished goods', material: 'Packed gears', from: 'Test & Pack', to: 'FG store', asIs: 40, toBe: 15, trips: 6, qty: 220 },
  { id: 'M10', group: 'Finished goods', material: 'Packed shafts', from: 'Test & Pack', to: 'FG store', asIs: 40, toBe: 15, trips: 3, qty: 200 },
  { id: 'M11', group: 'Finished goods', material: 'Packed housings', from: 'Test & Pack', to: 'FG store', asIs: 30, toBe: null, trips: 4, qty: 260 },
];

const normalise = (label: string) => label.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

export function rateStream(s: FlowStream) {
  const machines = s.steps.filter(st => st.resource === 'machine').reduce((a, st) => a + (st.count || 0), 0);
  const manualStations = s.steps.filter(st => st.resource === 'manual').length;
  const distance = s.steps.reduce((a, st) => a + (st.distance || 0), 0);
  return { stream: s, steps: s.steps.length, machines, manualStations, distance, travelPerMonth: distance * s.volume };
}

/** Operations in more than one stream, most streams first, then most machines. */
export function sharedOperations(streams: FlowStream[]) {
  const byOp = new Map<string, { label: string; entries: { stream: FlowStream; step: FlowStep }[] }>();
  streams.forEach(stream => stream.steps.forEach(step => {
    if (step.resource === 'none') return;
    const key = normalise(step.label);
    if (!byOp.has(key)) byOp.set(key, { label: step.label, entries: [] });
    byOp.get(key)!.entries.push({ stream, step });
  }));
  return [...byOp.values()].map(op => ({
    ...op,
    streamCount: new Set(op.entries.map(e => e.stream.id)).size,
    machines: op.entries.reduce((a, e) => a + (e.step.resource === 'machine' ? e.step.count || 0 : 0), 0),
    areas: [...new Set(op.entries.map(e => e.step.area).filter(Boolean))] as string[],
  })).filter(op => op.streamCount > 1).sort((a, b) => b.streamCount - a.streamCount || b.machines - a.machines);
}
export const isShared = (streams: FlowStream[], label: string) => sharedOperations(streams).some(op => normalise(op.label) === normalise(label));

/** monthly load (kg) = qty per trip × trips per day × days; ton-metres = distance × load ÷ 1000. */
export function rateMove(m: FlowMove, days: number) {
  const load = m.qty * m.trips * days;
  const asIs = m.asIs * load / 1000;
  const toBe = m.toBe === null ? null : m.toBe * load / 1000;
  return { move: m, load, asIs, toBe, saving: toBe === null ? null : asIs - toBe, savingPct: toBe === null || !asIs ? null : (asIs - toBe) / asIs };
}
export function rateMoves(moves: FlowMove[], days: number) {
  const rated = moves.map(m => rateMove(m, days));
  const asIs = rated.reduce((a, r) => a + r.asIs, 0);
  const toBe = rated.reduce((a, r) => a + (r.toBe ?? r.asIs), 0);
  const groups = [...new Set(moves.map(m => m.group))].map(group => {
    const rows = rated.filter(r => r.move.group === group);
    return { group, rows, asIs: rows.reduce((a, r) => a + r.asIs, 0), toBe: rows.reduce((a, r) => a + (r.toBe ?? r.asIs), 0) };
  });
  const worst = rated.reduce((a, r) => r.asIs > a.asIs ? r : a, rated[0]);
  return {
    rated, groups, worst, asIs, toBe, saving: asIs - toBe, savingPct: asIs ? (asIs - toBe) / asIs : 0,
    redesigned: rated.filter(r => r.toBe !== null).length,
    distanceAsIs: moves.reduce((a, m) => a + m.asIs, 0), distanceToBe: moves.reduce((a, m) => a + (m.toBe ?? m.asIs), 0),
  };
}

export const fmtTonM = (v: number) => Math.round(v).toLocaleString('en-IN') + ' ton·m';
export const fmtPct = (v: number | null) => v === null ? '—' : Math.round(v * 100) + '%';

export type FindingTone = 'danger' | 'warn' | 'info';
export function flowFindings(streams: FlowStream[], moves: FlowMove[], days: number) {
  const out: { tone: FindingTone; title: string; detail: string }[] = [];
  const shared = sharedOperations(streams);
  const rated = streams.map(rateStream);
  const index = rateMoves(moves, days);
  if (shared[0]) out.push({ tone: 'warn', title: shared[0].label + ' carries ' + shared[0].streamCount + ' streams', detail: 'Shared by ' + shared[0].entries.map(e => e.stream.name).join(', ') + ' — one bottleneck here stops every stream through it.' });
  const longest = rated.reduce((a, r) => r.distance > a.distance ? r : a, rated[0]);
  out.push({ tone: 'danger', title: longest.stream.name + ' travels ' + longest.distance + ' m', detail: 'The longest route on the wall, ' + Math.round(longest.travelPerMonth).toLocaleString('en-IN') + ' m·MT a month at ' + longest.stream.volume + ' ' + longest.stream.uom + '.' });
  out.push({ tone: 'info', title: 'The redesigned routes take ' + fmtPct(index.savingPct) + ' out of the handling', detail: fmtTonM(index.asIs) + ' a month as-is against ' + fmtTonM(index.toBe) + ' after the redesign.' });
  const share = index.asIs ? index.worst.asIs / index.asIs : 0;
  out.push({ tone: share >= .2 ? 'danger' : 'warn', title: index.worst.move.material + ': ' + index.worst.move.from + ' → ' + index.worst.move.to, detail: 'The heaviest single movement — ' + fmtPct(share) + ' of all the handling in the plant.' });
  const unplanned = index.rated.filter(r => r.toBe === null);
  if (unplanned.length) out.push({ tone: 'warn', title: unplanned.length + ' movement' + (unplanned.length > 1 ? 's have' : ' has') + ' no redesigned route', detail: unplanned.map(r => r.move.material).join(', ') + ' — counted at its as-is distance until a to-be route is drawn.' });
  return out;
}
