import { Fragment, createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { vsmDescriptions, vsmNavigation } from '../data/mock';
import {
  BREAK_PRESETS, IMP_FIELDS, IMP_PRIORITIES, IMP_TARGET_TYPES, IMP_TYPES, INV_FIELD, applyImprovements, generateRecommendations, CUSTOMER_CATEGORIES, DEMAND_PERIODS, FLOW_CONNECT_OPTIONS, FREQUENCIES, INDUSTRIES, INFO_CHANNELS, KAIZEN_STATUS, MAP_LEVEL_LABEL, PLANNING_METHODS,
  PRODUCTION_UNITS, ROMAN, SHIPPING_METHODS, SUPPLIER_CATEGORIES, TAKT_UNITS, TRANSPORT_METHODS,
  availableSeconds, currentProcesses, currentRawMaterialDays, customerDailyDemand, dailyDemand, emptyCustomer, emptySupplier, formatPce, futureProcesses, futureRawMaterialDays,
  mapMetrics, newProcess, pctChange, productionPerDay, shiftBreakMinutes, taktSeconds, totalChangeover, unitShort, uptime, valueStreams, vsmContext, vsmKaizens, vsmOrganizations, vsmSetup, vsmTakt,
  type ImpParam, type Improvement, type InfoFlow, type Kaizen, type MapLevel, type Recommendation, type KaizenStatus, type StreamStatus, type TaktInputs, type ValueStreamRow, type VsmCustomer, type VsmProcess, type VsmSetup, type VsmShift, type VsmSupplier,
} from '../data/vsmModel';
import Icon from '../components/Icon';
import { EmptyState, IconCircleButton, PageHeading, Panel, PillButton, PillTabs, SearchPill, StatCard, StatusChip } from '../components/UI';
import { usePreview } from '../components/PreviewDialog';
import { Chip, DistributionBars, FocusList, HeroMark, ModuleContext, NextStep, Readiness, ResultCard, StepFooter, type ChipTone } from '../components/ModulePattern';

export interface BuilderState {
  mapLevel: MapLevel | null; pickingLevel: boolean; flowType: 'sequential' | 'parallel';
  invUnit: string; rmUnit: string; fgUnit: string; rmType: string; fgType: string; inboundName: string; outboundName: string;
  boxMode: 'default' | 'custom'; boxFields: string[]; customCols: { key: string; label: string; unit: string }[];
}
const defaultBuilder: BuilderState = {
  mapLevel: null, pickingLevel: false, flowType: 'sequential', invUnit: 'days', rmUnit: 'days', fgUnit: 'days', rmType: 'Raw', fgType: 'Finished Goods',
  inboundName: 'Material WH', outboundName: 'FG Warehouse', boxMode: 'default', boxFields: ['Cycle Time (sec)', 'Avg C/O (min)', 'Operators'], customCols: [],
};
interface VsmContextType {
  setup: VsmSetup; setSetup: React.Dispatch<React.SetStateAction<VsmSetup>>;
  takt: TaktInputs; setTakt: React.Dispatch<React.SetStateAction<TaktInputs>>;
  processes: VsmProcess[]; setProcesses: React.Dispatch<React.SetStateAction<VsmProcess[]>>;
  rawDays: number; setRawDays: React.Dispatch<React.SetStateAction<number>>;
  kaizens: Kaizen[]; setKaizens: React.Dispatch<React.SetStateAction<Kaizen[]>>;
  builder: BuilderState; setBuilder: React.Dispatch<React.SetStateAction<BuilderState>>;
  improvements: Improvement[]; setImprovements: React.Dispatch<React.SetStateAction<Improvement[]>>;
}
const VsmCtx = createContext<VsmContextType>({
  setup: vsmSetup, setSetup: () => {}, takt: vsmTakt, setTakt: () => {}, processes: currentProcesses, setProcesses: () => {},
  rawDays: currentRawMaterialDays, setRawDays: () => {}, kaizens: vsmKaizens, setKaizens: () => {}, builder: defaultBuilder, setBuilder: () => {}, improvements: [], setImprovements: () => {},
});
export function VSMProvider({ children }: { children: ReactNode }) {
  const [setup, setSetup] = useState(vsmSetup);
  const [takt, setTakt] = useState(vsmTakt);
  const [processes, setProcesses] = useState(currentProcesses);
  const [rawDays, setRawDays] = useState(currentRawMaterialDays);
  const [kaizens, setKaizens] = useState(vsmKaizens);
  const [builder, setBuilder] = useState(defaultBuilder);
  const [improvements, setImprovements] = useState<Improvement[]>([]);
  return <VsmCtx.Provider value={{ setup, setSetup, takt, setTakt, processes, setProcesses, rawDays, setRawDays, kaizens, setKaizens, builder, setBuilder, improvements, setImprovements }}>{children}</VsmCtx.Provider>;
}
function useMaps() {
  const { takt, processes, rawDays } = useContext(VsmCtx);
  return { current: mapMetrics(processes, rawDays, takt), future: mapMetrics(futureProcesses, futureRawMaterialDays, takt), taktValue: taktSeconds(takt) };
}

/* ── The map: the standard VSM icon set drawn to scale from the process data ── */
const BOX_W = 116, STEP = 172, X0 = 160;
function Factory({ x, y, label, sub }: { x: number; y: number; label: string; sub: string }) {
  return <g transform={`translate(${x} ${y})`}>
    <path className="vsm-line" d="M0 62 V24 L26 8 V24 L52 8 V24 L78 8 V24 H110 V62 Z" />
    <text x="55" y="46" className="vsm-text strong" textAnchor="middle">{label.length > 18 ? label.slice(0, 17) + '…' : label}</text>
    <text x="55" y="78" className="vsm-text muted" textAnchor="middle">{sub}</text>
  </g>;
}
function Inventory({ x, y, days, label }: { x: number; y: number; days: number; label?: string }) {
  return <g>
    <path className="vsm-inventory" d={`M${x} ${y - 15} L${x + 15} ${y + 11} L${x - 15} ${y + 11} Z`} />
    <text x={x} y={y + 7} className="vsm-text strong" textAnchor="middle">I</text>
    <text x={x} y={y + 28} className="vsm-text" textAnchor="middle">{days} d</text>
    {label && <text x={x} y={y + 41} className="vsm-text muted" textAnchor="middle">{label}</text>}
  </g>;
}
function Supermarket({ x, y, days }: { x: number; y: number; days: number }) {
  return <g>
    <path className="vsm-supermarket" d={`M${x + 14} ${y - 16} H${x - 14} V${y + 14} H${x + 14} M${x - 14} ${y - 6} H${x + 14} M${x - 14} ${y + 4} H${x + 14}`} />
    <text x={x} y={y + 30} className="vsm-text" textAnchor="middle">{days} d</text>
  </g>;
}
function Fifo({ x, y, days }: { x: number; y: number; days: number }) {
  return <g>
    <path className="vsm-line" d={`M${x - 24} ${y - 9} H${x + 24} M${x - 24} ${y + 9} H${x + 24}`} />
    <text x={x} y={y + 4} className="vsm-text strong accent" textAnchor="middle">FIFO</text>
    <text x={x} y={y + 28} className="vsm-text" textAnchor="middle">{days} d</text>
  </g>;
}
function Burst({ x, y, label }: { x: number; y: number; label: string }) {
  const pts = Array.from({ length: 16 }, (_, i) => { const r = i % 2 ? 9 : 17, a = i / 16 * Math.PI * 2; return (x + Math.cos(a) * r * 1.6).toFixed(1) + ',' + (y + Math.sin(a) * r).toFixed(1); }).join(' ');
  return <g><polygon className="vsm-burst" points={pts} /><text x={x} y={y + 4} className="vsm-text strong" textAnchor="middle">{label}</text></g>;
}
function VsmMap({ processes, rawDays, future = false, takt }: { processes: VsmProcess[]; rawDays: number; future?: boolean; takt: number | null }) {
  const n = processes.length;
  const W = X0 + n * STEP + 150;
  const boxX = (i: number) => X0 + i * STEP;
  const gapX = (i: number) => boxX(i) + BOX_W + (STEP - BOX_W) / 2;
  const { setup, takt: taktInputs } = useContext(VsmCtx);
  const m = mapMetrics(processes, rawDays, taktInputs);
  const supplier = setup.suppliers[0], customer = setup.customers[0];
  const ladderY = 318;
  return <svg className="vsm-svg" viewBox={`0 0 ${W} 400`} role="img" aria-label={(future ? 'Future' : 'Current') + ' state value stream map'} style={{ minWidth: Math.min(W, 1100) }}>
    <defs>
      <marker id={'arrow-' + (future ? 'f' : 'c')} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 Z" className="vsm-arrowhead" /></marker>
      <pattern id="push-stripes" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="4" height="8" className="vsm-stripe" /></pattern>
    </defs>
    {/* top row: supplier, production control, customer and the information flow */}
    <Factory x={20} y={14} label={supplier?.name || 'Supplier'} sub={future ? 'Daily milk run' : (supplier ? supplier.deliveryFrequency + ' ' + supplier.transport.toLowerCase() : '')} />
    <Factory x={W - 130} y={14} label={customer?.name || 'Customer'} sub={customer ? customer.deliveryFrequency + ' ' + customer.shipping.toLowerCase() : ''} />
    <g>
      <rect className="vsm-box" x={W / 2 - 110} y={18} width={220} height={52} rx={4} />
      <text x={W / 2} y={40} className="vsm-text strong" textAnchor="middle">{setup.info.ppcsName}</text>
      <text x={W / 2} y={58} className="vsm-text muted" textAnchor="middle">{future ? 'Heijunka at the pacemaker' : setup.info.flows.length + ' planning flows'}</text>
    </g>
    <line className="vsm-info" x1={W / 2 - 110} y1={44} x2={136} y2={44} markerEnd={`url(#arrow-${future ? 'f' : 'c'})`} />
    <text x={(W / 2 - 110 + 136) / 2} y={38} className="vsm-text muted" textAnchor="middle">{future ? 'Kanban signals' : 'Weekly forecast'}</text>
    <line className="vsm-info" x1={W - 136} y1={44} x2={W / 2 + 110} y2={44} markerEnd={`url(#arrow-${future ? 'f' : 'c'})`} />
    <text x={(W - 136 + W / 2 + 110) / 2} y={38} className="vsm-text muted" textAnchor="middle">Daily orders</text>
    {future
      ? <line className="vsm-info" x1={W / 2} y1={70} x2={boxX(processes.findIndex(p => p.pacemaker)) + BOX_W / 2} y2={150} markerEnd="url(#arrow-f)" />
      : (setup.info.routing === 'parallel' ? processes : processes.slice(0, 1)).map((p, i) => <line key={p.id} className="vsm-info faint" x1={W / 2} y1={70} x2={boxX(i) + BOX_W / 2} y2={150} />)}
    {/* raw material and finished goods */}
    {future ? <Supermarket x={X0 - 52} y={196} days={rawDays} /> : <Inventory x={X0 - 52} y={196} days={rawDays} label="Raw material" />}
    {/* process boxes, data boxes and what sits between them */}
    {processes.map((p, i) => {
      const x = boxX(i), over = takt !== null && p.cycleTime > takt;
      const last = i === n - 1;
      return <g key={p.id}>
        {p.pacemaker && <g><rect className="vsm-pacemaker" x={x + 14} y={128} width={BOX_W - 28} height={18} rx={9} /><text x={x + BOX_W / 2} y={141} className="vsm-text strong on-accent" textAnchor="middle">PACEMAKER</text></g>}
        {p.kaizens && <Burst x={x + BOX_W - 8} y={p.pacemaker ? 112 : 136} label={p.kaizens.length > 2 ? p.kaizens[0] + '–' + p.kaizens[p.kaizens.length - 1] : p.kaizens.join(' ')} />}
        <rect className={'vsm-box' + (over ? ' over' : '')} x={x} y={154} width={BOX_W} height={30} />
        <text x={x + BOX_W / 2} y={173} className="vsm-text strong" textAnchor="middle">{p.name.length > 19 ? p.name.slice(0, 18) + '…' : p.name}</text>
        <rect className="vsm-box" x={x} y={184} width={BOX_W} height={80} />
        {[['C/T', p.cycleTime + ' s'], ['C/O', p.changeover + ' min'], ['Uptime', uptime(p) + '%'], ['Operators', String(p.operators)]].map(([k, v], r) =>
          <g key={k}><text x={x + 8} y={202 + r * 18} className="vsm-text muted">{k}</text><text x={x + BOX_W - 8} y={202 + r * 18} className={'vsm-text' + (k === 'C/T' && over ? ' danger strong' : '')} textAnchor="end">{v}</text></g>)}
        {!last && (future
          ? (p.link === 'supermarket' ? <Supermarket x={gapX(i)} y={196} days={p.inventoryAfter} /> : <Fifo x={gapX(i)} y={196} days={p.inventoryAfter} />)
          : <><Inventory x={gapX(i)} y={196} days={p.inventoryAfter} /><rect x={x + BOX_W + 4} y={248} width={STEP - BOX_W - 18} height={10} fill="url(#push-stripes)" className="vsm-push" /><path className="vsm-arrowhead" d={`M${x + STEP - 14} ${244} L${x + STEP - 4} ${253} L${x + STEP - 14} ${262} Z`} /></>)}
        {last && (future ? <Supermarket x={x + BOX_W + 46} y={196} days={p.inventoryAfter} /> : <Inventory x={x + BOX_W + 46} y={196} days={p.inventoryAfter} label="Finished goods" />)}
      </g>;
    })}
    <line className="vsm-ship" x1={75} y1={96} x2={X0 - 52} y2={170} markerEnd={`url(#arrow-${future ? 'f' : 'c'})`} />
    <line className="vsm-ship" x1={boxX(n - 1) + BOX_W + 46} y1={170} x2={W - 75} y2={96} markerEnd={`url(#arrow-${future ? 'f' : 'c'})`} />
    {/* lead-time ladder: waiting days up, value-added seconds down */}
    <g className="vsm-ladder">
      {(() => {
        const segs: { x1: number; x2: number; high: boolean; label: string }[] = [{ x1: 20, x2: X0, high: true, label: rawDays + ' d' }];
        processes.forEach((p, i) => {
          segs.push({ x1: boxX(i), x2: boxX(i) + BOX_W, high: false, label: p.cycleTime + ' s' });
          segs.push({ x1: boxX(i) + BOX_W, x2: i === n - 1 ? boxX(i) + BOX_W + 96 : boxX(i + 1), high: true, label: p.inventoryAfter + ' d' });
        });
        const y = (high: boolean) => high ? ladderY : ladderY + 30;
        return segs.map((s, i) => <g key={i}>
          <line className="vsm-line" x1={s.x1} y1={y(s.high)} x2={s.x2} y2={y(s.high)} />
          {i > 0 && <line className="vsm-line" x1={s.x1} y1={y(segs[i - 1].high)} x2={s.x1} y2={y(s.high)} />}
          <text x={(s.x1 + s.x2) / 2} y={s.high ? y(true) - 7 : y(false) + 16} className={'vsm-text' + (s.high ? '' : ' muted')} textAnchor="middle">{s.label}</text>
        </g>);
      })()}
    </g>
    <g>
      <rect className="vsm-summary" x={W - 136} y={290} width={124} height={96} rx={6} />
      <text x={W - 126} y={310} className="vsm-text muted">Lead time</text><text x={W - 22} y={310} className="vsm-text strong" textAnchor="end">{m.leadTimeDays} d</text>
      <text x={W - 126} y={330} className="vsm-text muted">VA time</text><text x={W - 22} y={330} className="vsm-text strong" textAnchor="end">{m.vaSeconds} s</text>
      <text x={W - 126} y={350} className="vsm-text muted">PCE</text><text x={W - 22} y={350} className="vsm-text strong" textAnchor="end">{formatPce(m.pce)}</text>
      <text x={W - 126} y={370} className="vsm-text muted">Operators</text><text x={W - 22} y={370} className="vsm-text strong" textAnchor="end">{m.operators}</text>
    </g>
  </svg>;
}

function MapLegend({ future }: { future?: boolean }) {
  const items = future
    ? [['vsm-key-fifo', 'FIFO lane'], ['vsm-key-super', 'Supermarket (pull)'], ['vsm-key-burst', 'Kaizen burst'], ['vsm-key-pace', 'Pacemaker']]
    : [['vsm-key-inv', 'Inventory (days)'], ['vsm-key-push', 'Push arrow'], ['vsm-key-over', 'C/T over takt'], ['vsm-key-info', 'Information flow']];
  return <div className="vsm-legend">{items.map(([cls, label]) => <span key={label}><i className={cls} />{label}</span>)}</div>;
}

/* ── VSM Dashboard: same placement as the live app (banner, four stats, recent value streams) ── */
const STREAM_STATUS: Record<StreamStatus, string> = { Completed: 'active', 'In Progress': 'updated', 'On Hold': 'on-hold' };
function VsmDashboard() {
  const total = valueStreams.length;
  const completed = valueStreams.filter(v => v.status === 'Completed').length;
  const inProgress = valueStreams.filter(v => v.status === 'In Progress').length;
  const recent = valueStreams.slice(0, 5);
  return <>
    <section className="stats-grid" aria-label="Value stream summary">
      <StatCard label="Organizations" value={vsmOrganizations.length} icon="Building2" />
      <StatCard label="Total value streams" value={total} subline={inProgress + ' active'} icon="Workflow" dark />
      <StatCard label="Completed" value={completed} icon="CheckCircle2" />
      <StatCard label="In progress" value={inProgress} icon="Clock" />
    </section>
    <Panel title="Recent value streams" subtitle={'Showing ' + recent.length + ' recent value streams'} action={<PillButton small icon="ArrowUpRight" to="/vsm/streams">View all</PillButton>}>
      <div className="table-scroll" tabIndex={0} role="region" aria-label="Recent value streams"><table className="vsm-streams">
        <thead><tr>{['Value stream', 'Level', 'Organization', 'Status', 'Progress', 'Updated', 'Actions'].map(h => <th scope="col" key={h}>{h}</th>)}</tr></thead>
        <tbody>{recent.map(v => <tr key={v.id}>
          <th scope="row">{v.name}<small>{v.detail}</small></th>
          <td>{v.level ? <span className={'vsm-level ' + v.level}>{MAP_LEVEL_LABEL[v.level]}</span> : <span className="muted">—</span>}</td>
          <td>{v.org}</td>
          <td><StatusChip status={STREAM_STATUS[v.status]} label={v.status} /></td>
          <td><StreamProgress value={v.progress} /></td>
          <td><span className="mono date">{v.updated}</span></td>
          <td><StreamActions v={v} /></td>
        </tr>)}</tbody>
      </table></div>
      {recent.length === 0 && <EmptyState title="No value streams yet" description="You have no projects assigned yet. Contact your admin." />}
    </Panel>
  </>;
}

/* ── My Value Streams: same placement as the live app's list (filters row, cards / table, footer count) ── */
function StreamProgress({ value }: { value: number }) {
  return <div className="vsm-progress"><div><span className={value >= 100 ? 'done' : value >= 50 ? 'mid' : 'low'} style={{ width: value + '%' }} /></div><span className="mono">{value}%</span></div>;
}
function StreamActions({ v }: { v: ValueStreamRow }) {
  const navigate = useNavigate();
  const preview = usePreview();
  return <div className="table-actions">
    {v.status === 'Completed' && <IconCircleButton icon="Workflow" label={'View CSM map of ' + v.name} onClick={() => navigate('/vsm/current')} />}
    <IconCircleButton icon="Pencil" label={'Edit ' + v.name} onClick={() => navigate('/vsm/setup')} />
    <IconCircleButton icon="Eye" label={'View ' + v.name} onClick={() => navigate('/vsm/setup')} />
    <IconCircleButton icon="BarChart3" label={'Analytics for ' + v.name} onClick={() => navigate('/vsm/analytics')} />
    <IconCircleButton icon="Trash2" danger label={'Delete ' + v.name} onClick={() => preview('Delete value stream', 'Permanently delete ' + v.name + '? This cannot be undone. This preview does not delete it.')} />
  </div>;
}
function StreamsView() {
  const preview = usePreview();
  const [status, setStatus] = useState('All');
  const [search, setSearch] = useState('');
  const [org, setOrg] = useState('All organizations');
  const [date, setDate] = useState('');
  const [view, setView] = useState<'cards' | 'table'>('table');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const q = search.toLowerCase();
  const filtered = valueStreams.filter(v => (v.name.toLowerCase().includes(q) || v.org.toLowerCase().includes(q) || v.createdBy.toLowerCase().includes(q))
    && (org === 'All organizations' || v.org === org) && (status === 'All' || v.status === status) && (!date || v.created >= date));
  const toggle = (id: string) => setSelected(s => { const n = new Set(s); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  const allOn = filtered.length > 0 && filtered.every(v => selected.has(v.id));
  const toggleAll = () => setSelected(allOn ? new Set() : new Set(filtered.map(v => v.id)));
  const level = (v: ValueStreamRow) => v.level ? <span className={'vsm-level ' + v.level}>{MAP_LEVEL_LABEL[v.level]}</span> : <span className="muted">—</span>;
  const footer = 'Showing ' + filtered.length + ' of ' + valueStreams.length + ' value streams' + (selected.size ? ' · ' + selected.size + ' selected' : '');
  return <>
    <div className="filters vsm-stream-filters">
      <label className="select-pill"><span>Status</span><select aria-label="Status" value={status} onChange={e => setStatus(e.target.value)}>{['All', 'In Progress', 'Completed', 'On Hold'].map(o => <option key={o}>{o}</option>)}</select></label>
      <SearchPill placeholder="Search value streams, orgs, admins…" value={search} onChange={setSearch} />
      <label className="select-pill"><span>Organization</span><select aria-label="Organization" value={org} onChange={e => setOrg(e.target.value)}>{['All organizations', ...vsmOrganizations].map(o => <option key={o}>{o}</option>)}</select></label>
      <label className="select-pill"><Icon name="CalendarDays" size={16} /><input type="date" aria-label="Created on or after" value={date} onChange={e => setDate(e.target.value)} /></label>
      <div className="vsm-view-toggle" role="group" aria-label="Layout">
        <button type="button" aria-pressed={view === 'cards'} aria-label="Cards" title="Cards" onClick={() => setView('cards')}><Icon name="Grid3X3" size={16} /></button>
        <button type="button" aria-pressed={view === 'table'} aria-label="Table" title="Table" onClick={() => setView('table')}><Icon name="ClipboardList" size={16} /></button>
      </div>
      {selected.size > 0 && <span className="vsm-bulk"><PillButton small icon="Trash2" onClick={() => preview('Delete value streams', selected.size + ' value streams and all their data will be permanently deleted. This preview does not delete them.')}>Delete ({selected.size})</PillButton></span>}
    </div>
    {view === 'cards'
      ? <section className="vsm-stream-cards" aria-label="Value streams">
          {filtered.map(v => <article key={v.id} className="vsm-stream-card">
            <div className="between"><h3>{v.name}</h3><StatusChip status={STREAM_STATUS[v.status]} label={v.status} /></div>
            <dl><div><dt>Organization</dt><dd>{v.org}</dd></div><div><dt>Level</dt><dd>{level(v)}</dd></div><div><dt>Created by</dt><dd>{v.createdBy}</dd></div><div><dt>Created</dt><dd className="mono">{v.created}</dd></div></dl>
            <StreamProgress value={v.progress} />
            <StreamActions v={v} />
          </article>)}
          {filtered.length === 0 && <Panel><EmptyState title="No value streams match your filters" /></Panel>}
        </section>
      : <Panel>
          <div className="table-scroll" tabIndex={0} role="region" aria-label="Value streams"><table className="vsm-streams">
            <thead><tr><th scope="col" className="vsm-check"><input type="checkbox" aria-label="Select all" checked={allOn} onChange={toggleAll} /></th>{['Value stream name', 'Level', 'Organization', 'Created by', 'Created at', 'Progress', 'Status', 'Actions'].map(h => <th scope="col" key={h}>{h}</th>)}</tr></thead>
            <tbody>{filtered.map(v => <tr key={v.id} className={selected.has(v.id) ? 'selected' : ''}>
              <td className="vsm-check"><input type="checkbox" aria-label={'Select ' + v.name} checked={selected.has(v.id)} onChange={() => toggle(v.id)} /></td>
              <th scope="row">{v.name}</th>
              <td>{level(v)}</td>
              <td>{v.org}</td>
              <td>{v.createdBy}</td>
              <td><span className="mono date">{v.created}</span></td>
              <td><StreamProgress value={v.progress} /></td>
              <td><StatusChip status={STREAM_STATUS[v.status]} label={v.status} /></td>
              <td><StreamActions v={v} /></td>
            </tr>)}</tbody>
          </table></div>
          {filtered.length === 0 && <EmptyState title="No value streams match your filters" />}
        </Panel>}
    <p className="vsm-stream-foot muted">{footer}</p>
  </>;
}

/* ── Shared form fields: the live app's FieldLabel + input, in the new look ── */
function FieldLabel({ children, required }: { children: ReactNode; required?: boolean }) {
  return <span className="vsm-label">{children}{required && <b aria-hidden="true"> *</b>}</span>;
}
function NumberField({ label, value, onChange, suffix, step = 1, required, readOnly }: { label: string; value: number | string; onChange?: (v: number) => void; suffix?: string; step?: number; required?: boolean; readOnly?: boolean }) {
  return <label className="vsm-field"><FieldLabel required={required}>{label}</FieldLabel><div className={readOnly ? 'readonly' : ''}><input type={readOnly ? 'text' : 'number'} min={0} step={step} readOnly={readOnly} value={value} onChange={e => onChange?.(Math.max(0, Number(e.target.value) || 0))} />{suffix && <em>{suffix}</em>}</div></label>;
}
function TextField({ label, value, onChange, placeholder, required }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; required?: boolean }) {
  return <label className="vsm-field"><FieldLabel required={required}>{label}</FieldLabel><div><input type="text" className="text" value={value} placeholder={placeholder} onChange={e => onChange(e.target.value)} /></div></label>;
}
function SelectField({ label, value, options, onChange, required, placeholder }: { label: string; value: string; options: (string | { value: string; label: string })[]; onChange: (v: string) => void; required?: boolean; placeholder?: string }) {
  return <label className="vsm-field"><FieldLabel required={required}>{label}</FieldLabel><div><select value={value} onChange={e => onChange(e.target.value)}>{placeholder !== undefined && <option value="">{placeholder}</option>}{options.map(o => typeof o === 'string' ? <option key={o}>{o}</option> : <option key={o.value} value={o.value}>{o.label}</option>)}</select></div></label>;
}
/** Number with a unit dropdown beside it (Lead Time, Transport Time, Customer Demand, Shift Duration). */
function NumberUnitField({ label, value, unit, units, onValue, onUnit, required, step = 1 }: { label: string; value: number; unit: string; units: string[]; onValue: (v: number) => void; onUnit: (u: string) => void; required?: boolean; step?: number }) {
  return <div className="vsm-field"><FieldLabel required={required}>{label}</FieldLabel><div className="vsm-unit-pair"><div><input type="number" min={0} step={step} aria-label={label} value={value} onChange={e => onValue(Math.max(0, Number(e.target.value) || 0))} /></div><div><select aria-label={label + ' unit'} value={unit} onChange={e => onUnit(e.target.value)}>{units.map(u => <option key={u}>{u}</option>)}</select></div></div></div>;
}
const nextId = (prefix: string, ids: string[]) => prefix + (Math.max(0, ...ids.map(id => Number(id.replace(/\D/g, '')) || 0)) + 1);

/* ── The live app's 5-step workflow bar, shown above Setup, Process Builder and the canvases ── */
const WORKFLOW = [
  { n: 1, label: 'Setup', to: '/vsm/setup' }, { n: 2, label: 'Process Builder', to: '/vsm/processes' }, { n: 3, label: 'CSM Canvas', to: '/vsm/current' },
  { n: 4, label: 'FSM Planner', to: '/vsm/planner' }, { n: 5, label: 'FSM Map', to: '/vsm/future' },
];
function WorkflowProgress({ current }: { current: number }) {
  return <nav className="vsm-workflow" aria-label="Value stream workflow"><ol>{WORKFLOW.map(s => {
    const state = s.n < current ? 'done' : s.n === current ? 'active' : 'todo';
    return <li key={s.n} className={state}><Link to={s.to} aria-current={state === 'active' ? 'step' : undefined}><span className="vsm-step-dot">{state === 'done' ? <Icon name="Check" size={13} /> : s.n}</span>{s.label}</Link></li>;
  })}</ol></nav>;
}

function SectionCard({ id, icon, title, tone, actions, children }: { id?: string; icon: string; title: string; tone?: string; actions?: ReactNode; children: ReactNode }) {
  return <section id={id} className={'panel vsm-section' + (tone ? ' tone-' + tone : '')}>
    <div className="vsm-section-head"><span className="vsm-section-icon"><Icon name={icon} size={18} /></span><h2>{title}</h2>{actions && <div className="inline">{actions}</div>}</div>
    {children}
  </section>;
}

/* ── 01 Setup: the live app's ProjectSetup — section menu on the left, every section stacked on the right ── */
const SETUP_NAV = [
  { id: 'basics', icon: 'ClipboardList', label: 'Value Stream Basics' }, { id: 'production', icon: 'TrendingUp', label: 'Production Profile' },
  { id: 'shifts', icon: 'Clock', label: 'Shift Configuration' }, { id: 'supplier', icon: 'Truck', label: 'Supplier Setup' },
  { id: 'customer', icon: 'Package', label: 'Customer & Demand' }, { id: 'flows', icon: 'Network', label: 'Production / Information Setup' },
];
const TIME_UNITS = ['days', 'hrs', 'mins'];

function OrganizationSection() {
  const { setup, setSetup } = useContext(VsmCtx);
  const set = (patch: Partial<VsmSetup['org']>) => setSetup(s => ({ ...s, org: { ...s.org, ...patch } }));
  const o = setup.org;
  return <SectionCard icon="Building2" title="Organization">
    <div className="vsm-toggle-pair">
      <button type="button" className={o.mode === 'existing' ? 'on' : ''} aria-pressed={o.mode === 'existing'} onClick={() => set({ mode: 'existing' })}><Icon name="Building2" size={17} />Select Existing Organization</button>
      <button type="button" className={o.mode === 'new' ? 'on' : ''} aria-pressed={o.mode === 'new'} onClick={() => set({ mode: 'new' })}><Icon name="Plus" size={17} />Create New Organization</button>
    </div>
    {o.mode === 'existing'
      ? <div className="vsm-fields"><SelectField required label="Select Organization" value={o.selected} options={vsmOrganizations} onChange={v => set({ selected: v })} /></div>
      : <div className="vsm-fields">
          <TextField required label="Organization Name" value={o.name} onChange={v => set({ name: v })} placeholder="e.g. TechCorp Industries" />
          <TextField required label="Organization Location" value={o.location} onChange={v => set({ location: v })} placeholder="e.g. Austin, TX" />
          <SelectField required label="Organization Industry" value={o.industry} options={INDUSTRIES} placeholder="Select industry" onChange={v => set({ industry: v })} />
        </div>}
  </SectionCard>;
}

function DetailsSection() {
  const { setup, setSetup } = useContext(VsmCtx);
  const set = (key: keyof VsmSetup['basics']) => (v: string) => setSetup(s => ({ ...s, basics: { ...s.basics, [key]: v } }));
  return <SectionCard icon="ClipboardList" title="Value Stream Details">
    <div className="vsm-fields">
      <TextField required label="Value Stream Name" value={setup.basics.name} onChange={set('name')} placeholder="e.g. EV Battery Line Expansion" />
      <TextField required label="Product Line / Family" value={setup.basics.productLine} onChange={set('productLine')} placeholder="High-Voltage Modules" />
      <TextField required label="Facility Location" value={setup.basics.facility} onChange={set('facility')} placeholder="Berlin, Germany" />
    </div>
  </SectionCard>;
}

function ProductionSection() {
  const { takt, setTakt } = useContext(VsmCtx);
  const [customUnits, setCustomUnits] = useState<string[]>([]);
  const [adding, setAdding] = useState(false);
  const [newUnit, setNewUnit] = useState('');
  const unit = unitShort(takt.unit);
  const addUnit = () => { const u = newUnit.trim(); if (!u) return; setCustomUnits(c => c.includes(u) ? c : [...c, u]); setTakt(t => ({ ...t, unit: u })); setNewUnit(''); setAdding(false); };
  return <SectionCard id="production" icon="BarChart3" title="Production Profile">
    <div className="vsm-fields">
      <div>
        <SelectField label="Production Unit of Measure (UoM)" value={takt.unit} options={[...PRODUCTION_UNITS.map(u => u.value), ...customUnits, '+ Other (Custom)...']} onChange={v => v === '+ Other (Custom)...' ? setAdding(true) : setTakt(t => ({ ...t, unit: v }))} />
        {adding && <form className="vsm-inline-add" onSubmit={e => { e.preventDefault(); addUnit(); }}>
          <strong><Icon name="Plus" size={14} />Add Custom Unit of Measure</strong>
          <div><input autoFocus value={newUnit} onChange={e => setNewUnit(e.target.value)} onKeyDown={e => { if (e.key === 'Escape') { setAdding(false); setNewUnit(''); } }} placeholder="e.g. Boxes (box), Meters (m), Pallets" aria-label="Custom unit name" />
            <PillButton small variant="dark" onClick={addUnit}>Add</PillButton><PillButton small onClick={() => { setAdding(false); setNewUnit(''); }}>Cancel</PillButton></div>
        </form>}
      </div>
      <NumberField label="Working Days / Month" value={takt.workingDays} onChange={v => setTakt(t => ({ ...t, workingDays: v }))} />
      <NumberField label="Rate of Production (Month)" value={takt.monthlyDemand} onChange={v => setTakt(t => ({ ...t, monthlyDemand: v }))} suffix={unit} step={100} />
      <NumberField label="Per Day Production" value={productionPerDay(takt).toLocaleString('en-IN')} readOnly suffix={unit + '/Day'} />
    </div>
  </SectionCard>;
}

function ShiftSection() {
  const { takt, setTakt } = useContext(VsmCtx);
  const [adding, setAdding] = useState(false);
  const [breakName, setBreakName] = useState('');
  const [availUnit, setAvailUnit] = useState('sec');
  const setShift = (id: string, patch: (s: VsmShift) => VsmShift) => setTakt(t => ({ ...t, shifts: t.shifts.map(s => s.id === id ? patch(s) : s) }));
  const addShift = () => setTakt(t => ({ ...t, shifts: [...t.shifts, { id: nextId('S', t.shifts.map(s => s.id)), name: 'Shift ' + (ROMAN[t.shifts.length] ?? t.shifts.length + 1), duration: 8, durationUnit: 'hrs', breaks: {} }] }));
  const addBreak = (name = breakName) => {
    const label = name.trim();
    if (!label) return;
    setTakt(t => t.breakCols.some(c => c.label.toLowerCase().startsWith(label.toLowerCase())) ? t : { ...t, breakCols: [...t.breakCols, { key: 'custom-' + Date.now(), label: label + ' (min)' }] });
    setBreakName(''); setAdding(false);
  };
  const totalBreak = takt.shifts.reduce((a, s) => a + shiftBreakMinutes(s, takt.breakCols), 0);
  const div: Record<string, number> = { sec: 1, min: 60, hrs: 3600, days: 86400 };
  const avail = availableSeconds(takt);
  return <SectionCard id="shifts" icon="CalendarDays" title="Shift Configuration">
    <div className="vsm-fields">
      <NumberField label="Working Days / Month" value={takt.workingDays || '—'} readOnly suffix="days" />
      <NumberField label="Shifts per Day" value={takt.shifts.length} readOnly />
    </div>
    <div className="table-scroll" tabIndex={0} role="region" aria-label="Shifts"><table className="vsm-table vsm-shift-table">
      <thead><tr><th>Shift</th><th>Shift Duration</th>
        {takt.breakCols.map(c => <th key={c.key}><span className="vsm-col-head">{c.label}<button type="button" aria-label={'Remove column ' + c.label} title={'Remove column "' + c.label + '"'} onClick={() => setTakt(t => ({ ...t, breakCols: t.breakCols.filter(b => b.key !== c.key) }))}><Icon name="X" size={12} /></button></span></th>)}
        <th><button type="button" className="vsm-add-col-btn" title="Add Break Column" aria-label="Add break column" onClick={() => setAdding(true)}><Icon name="Plus" size={14} /></button></th><th aria-label="Actions" /></tr></thead>
      <tbody>{takt.shifts.map(s => <tr key={s.id}>
        <th scope="row">{s.name}</th>
        <td><div className="vsm-duration"><input type="number" min={0} step={0.5} aria-label={s.name + ' duration'} value={s.duration} onChange={e => setShift(s.id, x => ({ ...x, duration: Math.max(0, Number(e.target.value) || 0) }))} /><select aria-label={s.name + ' duration unit'} value={s.durationUnit} onChange={e => setShift(s.id, x => ({ ...x, durationUnit: e.target.value as VsmShift['durationUnit'] }))}><option value="hrs">Hours</option><option value="min">Minutes</option><option value="sec">Seconds</option></select></div></td>
        {takt.breakCols.map(c => <td key={c.key}><input type="number" min={0} placeholder="0" aria-label={s.name + ' ' + c.label} value={s.breaks[c.key] || ''} onChange={e => setShift(s.id, x => ({ ...x, breaks: { ...x.breaks, [c.key]: Math.max(0, Number(e.target.value) || 0) } }))} /></td>)}
        <td />
        <td><button type="button" className="vsm-row-action danger" aria-label={'Delete ' + s.name} title={takt.shifts.length <= 1 ? 'Cannot delete the last shift' : 'Delete shift'} disabled={takt.shifts.length <= 1} onClick={() => setTakt(t => ({ ...t, shifts: t.shifts.filter(x => x.id !== s.id) }))}><Icon name="Trash2" size={14} /></button></td>
      </tr>)}</tbody>
    </table></div>
    {adding && <form className="vsm-inline-add" onSubmit={e => { e.preventDefault(); addBreak(); }}>
      <strong><Icon name="Plus" size={14} />Add Break Column</strong>
      <FieldLabel required>Break Column Name</FieldLabel>
      <div><input autoFocus value={breakName} onChange={e => setBreakName(e.target.value)} placeholder="e.g. Shift C/O, 5S, TBT, Cleaning, Meeting" aria-label="Break column name" /></div>
      <div className="vsm-presets">{BREAK_PRESETS.map(p => { const added = takt.breakCols.some(c => c.label.toLowerCase().startsWith(p.toLowerCase())); return <button key={p} type="button" disabled={added} onClick={() => addBreak(p)}>+ {p}</button>; })}</div>
      <div className="vsm-inline-actions"><PillButton small onClick={() => { setAdding(false); setBreakName(''); }}>Cancel</PillButton><PillButton small variant="dark" onClick={() => addBreak()}>Add Column</PillButton></div>
    </form>}
    <div><PillButton small icon="Plus" onClick={addShift}>Add Shift</PillButton></div>
    <div className="vsm-fields">
      <NumberField label="Total Break Time (min)" value={totalBreak || ''} readOnly />
      <div className="vsm-field"><FieldLabel>{'Total Available Time (' + availUnit + ')'}</FieldLabel><div className="vsm-unit-pair"><div className="readonly"><input readOnly aria-label="Total available time" value={avail ? String(+(avail / div[availUnit]).toFixed(4)) : ''} /></div><div><select aria-label="Available time unit" value={availUnit} onChange={e => setAvailUnit(e.target.value)}>{['sec', 'min', 'hrs', 'days'].map(u => <option key={u}>{u}</option>)}</select></div></div></div>
    </div>
  </SectionCard>;
}

function SupplierCard({ s, idx, total, onChange, onRemove }: { s: VsmSupplier; idx: number; total: number; onChange: (patch: Partial<VsmSupplier>) => void; onRemove: () => void }) {
  return <div className="vsm-party tone-supplier">
    <div className="vsm-party-head"><Icon name="Warehouse" size={17} /><strong>Supplier {idx + 1}{s.name ? ' — ' + s.name : ''}</strong>{total > 1 && <button type="button" className="vsm-remove" onClick={onRemove}><Icon name="Trash2" size={14} />Remove</button>}</div>
    <h4>Supplier Information</h4>
    <div className="vsm-fields">
      <TextField label="Supplier Name" value={s.name} onChange={v => onChange({ name: v })} placeholder="e.g. Raw Materials Inc" />
      <TextField label="Location" value={s.location} onChange={v => onChange({ location: v })} placeholder="e.g. Detroit, MI" />
      <NumberField label="Distance (km)" value={s.distanceKm} onChange={v => onChange({ distanceKm: v })} suffix="km" />
      <SelectField label="Supplier Category" value={s.category} options={SUPPLIER_CATEGORIES} onChange={v => onChange({ category: v })} />
    </div>
    <h4>Logistics</h4>
    <div className="vsm-fields">
      <SelectField label="Transportation Method" value={s.transport} options={TRANSPORT_METHODS} onChange={v => onChange({ transport: v })} />
      <NumberUnitField label="Lead Time" value={s.leadTime} unit={s.leadTimeUnit} units={TIME_UNITS} onValue={v => onChange({ leadTime: v })} onUnit={u => onChange({ leadTimeUnit: u })} step={0.5} />
      <SelectField label="Delivery Frequency" value={s.deliveryFrequency} options={FREQUENCIES} onChange={v => onChange({ deliveryFrequency: v })} />
      <NumberUnitField label="Transport Time" value={s.transportTime} unit={s.transportTimeUnit} units={TIME_UNITS} onValue={v => onChange({ transportTime: v })} onUnit={u => onChange({ transportTimeUnit: u })} step={0.5} />
    </div>
    <h4>Ordering &amp; Information Flow</h4>
    <div className="vsm-fields">
      <NumberField label="MOQ" value={s.moq} onChange={v => onChange({ moq: v })} suffix="units" step={100} />
      <SelectField label="Order Frequency" value={s.orderFrequency} options={FREQUENCIES} placeholder="Select" onChange={v => onChange({ orderFrequency: v })} />
      <SelectField label="Forecast Frequency" value={s.forecastFrequency} options={FREQUENCIES} placeholder="Select" onChange={v => onChange({ forecastFrequency: v })} />
      <SelectField label="Information Channel" value={s.infoChannel} options={INFO_CHANNELS} placeholder="Select" onChange={v => onChange({ infoChannel: v })} />
    </div>
  </div>;
}
function SupplierTable({ list, update, remove }: { list: VsmSupplier[]; update: (id: string, patch: Partial<VsmSupplier>) => void; remove: (id: string) => void }) {
  const cell = (s: VsmSupplier, key: keyof VsmSupplier, type: 'text' | 'number' = 'text') => <input type={type} min={0} aria-label={key} value={s[key] as string | number} onChange={e => update(s.id, { [key]: type === 'number' ? Math.max(0, Number(e.target.value) || 0) : e.target.value })} />;
  const sel = (s: VsmSupplier, key: keyof VsmSupplier, options: string[]) => <select aria-label={key} value={s[key] as string} onChange={e => update(s.id, { [key]: e.target.value })}><option value="">—</option>{options.map(o => <option key={o}>{o}</option>)}</select>;
  return <div className="table-scroll" tabIndex={0} role="region" aria-label="Suppliers"><table className="vsm-table vsm-entity-table">
    <thead><tr>{['#', 'Name', 'Location', 'Distance (km)', 'Category', 'Transport', 'Lead time (days)', 'Delivery freq.', 'MOQ', 'Info channel', ''].map((h, i) => <th key={i}>{h}</th>)}</tr></thead>
    <tbody>{list.map((s, i) => <tr key={s.id}><td className="mono">{i + 1}</td><td>{cell(s, 'name')}</td><td>{cell(s, 'location')}</td><td>{cell(s, 'distanceKm', 'number')}</td><td>{sel(s, 'category', SUPPLIER_CATEGORIES)}</td><td>{sel(s, 'transport', TRANSPORT_METHODS)}</td><td>{cell(s, 'leadTime', 'number')}</td><td>{sel(s, 'deliveryFrequency', FREQUENCIES)}</td><td>{cell(s, 'moq', 'number')}</td><td>{sel(s, 'infoChannel', INFO_CHANNELS)}</td>
      <td><button type="button" className="vsm-row-action danger" aria-label={'Remove supplier ' + (i + 1)} title="Remove" disabled={list.length === 1} onClick={() => remove(s.id)}><Icon name="Trash2" size={14} /></button></td></tr>)}</tbody>
  </table></div>;
}
function SupplierSection() {
  const { setup, setSetup } = useContext(VsmCtx);
  const preview = usePreview();
  const update = (id: string, patch: Partial<VsmSupplier>) => setSetup(s => ({ ...s, suppliers: s.suppliers.map(x => x.id === id ? { ...x, ...patch } : x) }));
  const remove = (id: string) => setSetup(s => ({ ...s, suppliers: s.suppliers.filter(x => x.id !== id) }));
  const add = () => setSetup(s => ({ ...s, suppliers: [...s.suppliers, emptySupplier(nextId('SUP', s.suppliers.map(x => x.id)))] }));
  const list = setup.suppliers;
  return <SectionCard id="supplier" icon="Truck" title="Supplier Setup" tone="supplier" actions={<><PillButton small icon="Upload" onClick={() => preview('Import suppliers', 'Upload an Excel sheet of suppliers; columns are matched to the supplier fields and the list switches to the table view.')}>Import Excel</PillButton><PillButton small variant="dark" icon="Plus" onClick={add}>Add Supplier</PillButton></>}>
    {list.length <= 2 ? list.map((s, i) => <SupplierCard key={s.id} s={s} idx={i} total={list.length} onChange={p => update(s.id, p)} onRemove={() => remove(s.id)} />) : <SupplierTable list={list} update={update} remove={remove} />}
  </SectionCard>;
}

const TAKT_SECONDS = (wd: number): Record<string, number> => ({ sec: 1, min: 60, hrs: 3600, days: 86400, monthly: 86400 * wd, yearly: 86400 * wd * 12 });
const TAKT_LABEL: Record<string, string> = { sec: 'sec', min: 'min', hrs: 'hr', days: 'day', monthly: 'monthly', yearly: 'yearly' };
function CustomerCard({ c, idx, total, onChange, onRemove }: { c: VsmCustomer; idx: number; total: number; onChange: (patch: Partial<VsmCustomer>) => void; onRemove: () => void }) {
  const { takt } = useContext(VsmCtx);
  const u = unitShort(takt.unit);
  const daily = dailyDemand(takt);
  const base = taktSeconds(takt);
  const t = base ? +(base / (TAKT_SECONDS(takt.workingDays || 25)[c.taktUnit] || 1)).toFixed(6) : null;
  return <div className="vsm-party tone-customer">
    <div className="vsm-party-head"><Icon name="Building2" size={17} /><strong>Customer {idx + 1}{c.name ? ' — ' + c.name : ''}</strong>{total > 1 && <button type="button" className="vsm-remove" onClick={onRemove}><Icon name="Trash2" size={14} />Remove</button>}</div>
    {t !== null && <div className="vsm-takt-strip">
      <Icon name="Activity" size={20} />
      <div><span>Takt Time</span><strong>{t} <em>{TAKT_LABEL[c.taktUnit]}/{u}</em></strong></div>
      <div><span>{total > 1 ? 'Total Demand / day' : 'Demand / day'}</span><strong className="plain">{+daily.toFixed(2)} <em>{u}/day</em></strong></div>
      <select aria-label="Takt time unit" value={c.taktUnit} onChange={e => onChange({ taktUnit: e.target.value })}>{TAKT_UNITS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
    </div>}
    <h4>Customer Information</h4>
    <div className="vsm-fields">
      <TextField required label="Customer Name" value={c.name} onChange={v => onChange({ name: v })} placeholder="e.g. Auto Assembly Inc" />
      <TextField required label="Location" value={c.location} onChange={v => onChange({ location: v })} placeholder="e.g. Munich, Germany" />
      <NumberField required label="Distance (km)" value={c.distanceKm} onChange={v => onChange({ distanceKm: v })} suffix="km" />
      <SelectField required label="Customer Category" value={c.category} options={CUSTOMER_CATEGORIES} onChange={v => onChange({ category: v })} />
    </div>
    <h4>Demand</h4>
    <div className="vsm-fields"><NumberUnitField required label="Customer Demand" value={c.demand} unit={c.demandPeriod} units={DEMAND_PERIODS} onValue={v => onChange({ demand: v })} onUnit={p => onChange({ demandPeriod: p })} step={100} /></div>
    <h4>Delivery</h4>
    <div className="vsm-fields three">
      <SelectField required label="Delivery Frequency" value={c.deliveryFrequency} options={FREQUENCIES} onChange={v => onChange({ deliveryFrequency: v })} />
      <SelectField required label="Shipping Method" value={c.shipping} options={SHIPPING_METHODS} onChange={v => onChange({ shipping: v })} />
      <NumberField required label="Expected Lead Time (days)" value={c.leadTimeDays} onChange={v => onChange({ leadTimeDays: v })} suffix="days" step={0.5} />
    </div>
    <h4>Planning &amp; Information Flow</h4>
    <div className="vsm-fields">
      <SelectField required label="Order Frequency" value={c.orderFrequency} options={FREQUENCIES} onChange={v => onChange({ orderFrequency: v })} />
      <SelectField required label="Forecast Frequency" value={c.forecastFrequency} options={FREQUENCIES} onChange={v => onChange({ forecastFrequency: v })} />
      <SelectField required label="Planning Method" value={c.planningMethod} options={PLANNING_METHODS} onChange={v => onChange({ planningMethod: v })} />
      <SelectField required label="Information Channel" value={c.infoChannel} options={INFO_CHANNELS} placeholder="Select" onChange={v => onChange({ infoChannel: v })} />
    </div>
  </div>;
}
function CustomerTable({ list, update, remove }: { list: VsmCustomer[]; update: (id: string, patch: Partial<VsmCustomer>) => void; remove: (id: string) => void }) {
  const cell = (c: VsmCustomer, key: keyof VsmCustomer, type: 'text' | 'number' = 'text') => <input type={type} min={0} aria-label={key} value={c[key] as string | number} onChange={e => update(c.id, { [key]: type === 'number' ? Math.max(0, Number(e.target.value) || 0) : e.target.value })} />;
  const sel = (c: VsmCustomer, key: keyof VsmCustomer, options: string[]) => <select aria-label={key} value={c[key] as string} onChange={e => update(c.id, { [key]: e.target.value })}>{options.map(o => <option key={o}>{o}</option>)}</select>;
  return <div className="table-scroll" tabIndex={0} role="region" aria-label="Customers"><table className="vsm-table vsm-entity-table">
    <thead><tr>{['#', 'Name', 'Location', 'Distance (km)', 'Category', 'Demand', 'Period', 'Delivery freq.', 'Lead time (days)', 'Shipping', ''].map((h, i) => <th key={i}>{h}</th>)}</tr></thead>
    <tbody>{list.map((c, i) => <tr key={c.id}><td className="mono">{i + 1}</td><td>{cell(c, 'name')}</td><td>{cell(c, 'location')}</td><td>{cell(c, 'distanceKm', 'number')}</td><td>{sel(c, 'category', CUSTOMER_CATEGORIES)}</td><td>{cell(c, 'demand', 'number')}</td><td>{sel(c, 'demandPeriod', DEMAND_PERIODS)}</td><td>{sel(c, 'deliveryFrequency', FREQUENCIES)}</td><td>{cell(c, 'leadTimeDays', 'number')}</td><td>{sel(c, 'shipping', SHIPPING_METHODS)}</td>
      <td><button type="button" className="vsm-row-action danger" aria-label={'Remove customer ' + (i + 1)} title="Remove" disabled={list.length === 1} onClick={() => remove(c.id)}><Icon name="Trash2" size={14} /></button></td></tr>)}</tbody>
  </table></div>;
}
function CustomerSection() {
  const { setup, setSetup } = useContext(VsmCtx);
  const preview = usePreview();
  const update = (id: string, patch: Partial<VsmCustomer>) => setSetup(s => ({ ...s, customers: s.customers.map(x => x.id === id ? { ...x, ...patch } : x) }));
  const remove = (id: string) => setSetup(s => ({ ...s, customers: s.customers.filter(x => x.id !== id) }));
  const add = () => setSetup(s => ({ ...s, customers: [...s.customers, emptyCustomer(nextId('CUS', s.customers.map(x => x.id)))] }));
  const list = setup.customers;
  return <SectionCard id="customer" icon="Package" title="Customer & Demand" tone="customer" actions={<><PillButton small icon="Upload" onClick={() => preview('Import customers', 'Upload an Excel sheet of customers; columns are matched to the customer fields and the list switches to the table view.')}>Import Excel</PillButton><PillButton small variant="dark" icon="Plus" onClick={add}>Add Customer</PillButton></>}>
    {list.length <= 2 ? list.map((c, i) => <CustomerCard key={c.id} c={c} idx={i} total={list.length} onChange={p => update(c.id, p)} onRemove={() => remove(c.id)} />) : <CustomerTable list={list} update={update} remove={remove} />}
  </SectionCard>;
}

function ConnectChips({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  return <div className="vsm-connect" role="group" aria-label="Connect to">{FLOW_CONNECT_OPTIONS.map(o => { const on = value.includes(o); return <button key={o} type="button" aria-pressed={on} className={on ? 'on' : ''} onClick={() => onChange(on ? value.filter(x => x !== o) : [...value, o])}>{o}</button>; })}</div>;
}
function FlowsSection() {
  const { setup, setSetup } = useContext(VsmCtx);
  const info = setup.info;
  const set = (patch: Partial<VsmSetup['info']>) => setSetup(s => ({ ...s, info: { ...s.info, ...patch } }));
  const updateFlow = (id: string, patch: Partial<InfoFlow>) => set({ flows: info.flows.map(f => f.id === id ? { ...f, ...patch } : f) });
  const addFlow = () => set({ flows: [...info.flows, { id: nextId('FL', info.flows.map(f => f.id)), name: '', connectTo: [] }] });
  const removeFlow = (id: string) => set({ flows: info.flows.filter(f => f.id !== id) });
  return <SectionCard id="flows" icon="Network" title="Production / Information Setup" tone="flows">
    <div className="vsm-routing">
      <FieldLabel>Information Flow Routing Architecture</FieldLabel>
      <div className="vsm-toggle-pair">
        <button type="button" className={info.routing === 'parallel' ? 'on parallel' : ''} aria-pressed={info.routing === 'parallel'} onClick={() => set({ routing: 'parallel' })}><Icon name="GitBranch" size={18} />Parallel Branching (Central PPCS → Departments)</button>
        <button type="button" className={info.routing === 'sequential' ? 'on' : ''} aria-pressed={info.routing === 'sequential'} onClick={() => set({ routing: 'sequential' })}><Icon name="ArrowRight" size={18} />Sequential Chain (Department → Department)</button>
      </div>
    </div>
    {info.routing === 'parallel'
      ? <div className="vsm-hierarchy">
          <div className="vsm-ppcs"><Icon name="Network" size={16} /><input aria-label="Central PPCS name" value={info.ppcsName} onChange={e => set({ ppcsName: e.target.value })} /></div>
          <div className="vsm-dept-row">{info.flows.map(f => <div key={f.id} className="vsm-dept">
            <div className="vsm-dept-top"><input aria-label="Department name" placeholder="Department name" value={f.name} onChange={e => updateFlow(f.id, { name: e.target.value })} />{info.flows.length > 1 && <button type="button" className="vsm-row-action danger" aria-label={'Remove ' + (f.name || 'department')} title="Remove flow" onClick={() => removeFlow(f.id)}><Icon name="Trash2" size={14} /></button>}</div>
            <ConnectChips value={f.connectTo} onChange={v => updateFlow(f.id, { connectTo: v })} />
          </div>)}
            <button type="button" className="vsm-dept add" onClick={addFlow}><Icon name="Plus" size={18} />Add department</button>
          </div>
        </div>
      : <div className="vsm-seq">
          <strong>Sequential Flow Blocks</strong>
          {info.flows.map((f, i) => <Fragment key={f.id}>
            <div className="vsm-seq-row"><span className="vsm-seq-n">{i + 1}</span><input aria-label={'Flow ' + (i + 1) + ' name'} placeholder="Flow field name" value={f.name} onChange={e => updateFlow(f.id, { name: e.target.value })} /><ConnectChips value={f.connectTo} onChange={v => updateFlow(f.id, { connectTo: v })} />{info.flows.length > 1 && <button type="button" className="vsm-row-action danger" aria-label={'Remove flow ' + (i + 1)} title="Remove flow" onClick={() => removeFlow(f.id)}><Icon name="Trash2" size={14} /></button>}</div>
            {i < info.flows.length - 1 && <div className="vsm-seq-arrow"><Icon name="ChevronDown" size={18} /></div>}
          </Fragment>)}
          <div><PillButton small icon="Plus" onClick={addFlow}>Add Flow Block</PillButton></div>
        </div>}
    <div className="vsm-scm">
      <span className="vsm-sync-tag"><Icon name="Network" size={13} />Synchronized with Canvas: Purchase Box</span>
      <TextField label="Purchase / Supply Chain box name" value={info.scmName} onChange={v => set({ scmName: v })} placeholder="e.g. Supply Chain Management" />
      <p className="muted">Shown as a box on the map for flows connected to “Purchase”.</p>
    </div>
  </SectionCard>;
}

function SetupView() {
  const { setup, setSetup, takt, setTakt } = useContext(VsmCtx);
  const navigate = useNavigate();
  const preview = usePreview();
  const [active, setActive] = useState('basics');
  // Takt uses the combined daily demand of every customer, as the live app does.
  const demand = setup.customers.reduce((a, c) => a + customerDailyDemand(c, takt.workingDays), 0);
  useEffect(() => { if (Math.abs(demand - takt.demandPerDay) > 1e-9) setTakt(t => ({ ...t, demandPerDay: demand })); }, [demand, takt.demandPerDay, setTakt]);
  useEffect(() => {
    const els = SETUP_NAV.map(n => document.getElementById(n.id)).filter((e): e is HTMLElement => !!e);
    const io = new IntersectionObserver(entries => { const hit = entries.filter(e => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]; if (hit) setActive(hit.target.id); }, { rootMargin: '-15% 0px -70% 0px' });
    els.forEach(e => io.observe(e));
    return () => io.disconnect();
  }, []);
  const go = (id: string) => { setActive(id); document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); };
  const reset = () => { setSetup(vsmSetup); setTakt(vsmTakt); };
  return <>
    <WorkflowProgress current={1} />
    <div className="vsm-setup-layout">
      <aside className="vsm-section-nav" aria-label="Setup sections">
        <div className="vsm-section-nav-title"><strong>Value Stream Setup</strong><span>{(setup.basics.name || 'New Value Stream').slice(0, 24)}</span></div>
        {SETUP_NAV.map(n => <button key={n.id} type="button" className={active === n.id ? 'active' : ''} aria-current={active === n.id ? 'true' : undefined} onClick={() => go(n.id)}><span><Icon name={n.icon} size={16} /></span>{n.label}</button>)}
      </aside>
      <div className="vsm-stack">
        <div id="basics" className="vsm-stack"><OrganizationSection /><DetailsSection /></div>
        <ProductionSection />
        <ShiftSection />
        <SupplierSection />
        <CustomerSection />
        <FlowsSection />
      </div>
    </div>
    <div className="vsm-setup-footer">
      <PillButton icon="ArrowLeft" to="/vsm">Previous</PillButton>
      <div className="inline">
        <PillButton icon="History" onClick={reset}>Reset All</PillButton>
        <PillButton onClick={() => preview('Save draft', 'Saves this setup as a draft so you can come back to it. Drafts are not saved in this preview.')}>Save Draft</PillButton>
        <PillButton variant="blue" icon="ArrowRight" onClick={() => navigate('/vsm/processes')}>Continue to Process Builder</PillButton>
      </div>
    </div>
  </>;
}

function CycleChart({ processes, takt }: { processes: VsmProcess[]; takt: number | null }) {
  const scale = Math.max(takt ?? 0, ...processes.map(p => p.cycleTime)) * 1.15 || 1;
  return <div className="vsm-cycle-chart">
    {processes.map(p => { const over = takt !== null && p.cycleTime > takt; return <div key={p.id} className="vsm-cycle-row">
      <span className="vsm-cycle-name">{p.name}</span>
      <div className="vsm-cycle-track"><span className={'vsm-cycle-bar' + (over ? ' over' : '')} style={{ width: p.cycleTime / scale * 100 + '%' }} />{takt !== null && <i className="vsm-takt-line" style={{ left: takt / scale * 100 + '%' }} />}</div>
      <span className={'mono' + (over ? ' vsm-danger' : '')}>{p.cycleTime} s</span>
    </div>; })}
    {takt !== null && <p className="vsm-cycle-foot muted"><i className="vsm-takt-swatch" />Takt {takt} s — anything to the right of the line cannot keep up with the customer.</p>}
  </div>;
}

/* ── 02 Process Builder: the live app's Process Sequence Builder — same sections, same order ── */
const BUILDER_NAV = [
  { id: 'flow-section', icon: 'GitBranch', label: 'Process Flow Type' },
  { id: 'machines-section', icon: 'Cog', label: 'Machine Configuration' },
  { id: 'inventory-section', icon: 'Package', label: 'Inventory Configuration' },
];
const MAP_LEVELS: { key: MapLevel; icon: string; label: string; desc: string; best: string }[] = [
  { key: 'process', icon: 'Workflow', label: 'Process Level VSM', desc: 'Map a single product/part flow through individual process steps.', best: 'Detailed cycle-time analysis, single value stream.' },
  { key: 'facility', icon: 'Building2', label: 'Facility Level VSM', desc: 'Map multiple product families / substreams side-by-side.', best: 'Plant-wide overview, comparing multiple value streams.' },
  { key: 'extended', icon: 'Network', label: 'Extended Level VSM', desc: 'Map multiple product families / substreams with extended detail.', best: 'In-depth multi-stream analysis across the facility.' },
];
/** The live app's default machine columns, in its order; "Time (sec) Total" is hours × 3600. */
type ColKey = 'hours' | 'seconds' | 'rework' | 'rejection' | 'breakdown' | 'changeoverCount' | 'changeover' | 'totalChangeover' | 'cycleTime' | 'operators' | 'machines' | 'oee';
const MACHINE_COLS: { key: ColKey; label: string; step?: number; readOnly?: boolean }[] = [
  { key: 'hours', label: 'Hours/Day Avail.', step: 0.5 }, { key: 'seconds', label: 'Time (sec) Total', readOnly: true },
  { key: 'rework', label: 'Rework %', step: 0.1 }, { key: 'rejection', label: 'Rejection %', step: 0.1 }, { key: 'breakdown', label: 'Breakdown %', step: 0.5 },
  { key: 'changeoverCount', label: 'C/O Count / Day' }, { key: 'changeover', label: 'Avg C/O (min)' }, { key: 'totalChangeover', label: 'Total C/O (min)' },
  { key: 'cycleTime', label: 'Cycle Time (sec)' }, { key: 'operators', label: 'Operators' }, { key: 'machines', label: 'Machines' }, { key: 'oee', label: 'OEE %', step: 0.5 },
];
/** Fields the CSM process box shows in Default mode (the live app's DEFAULT_BOX_META). */
const DEFAULT_BOX_FIELDS = ['Operators', 'Machines', 'Cycle Time (sec)', 'Available Time (sec)', 'Avg C/O (min)', 'OEE %', 'Rejection %', 'Rework %'];
const BOX_FIELD_CHOICES = ['Hours/Day Avail.', 'Time (sec) Total', 'Rework %', 'Rejection %', 'Breakdown %', 'C/O Count / Day', 'Avg C/O (min)', 'Total C/O (min)', 'Cycle Time (sec)', 'Operators', 'Machines', 'OEE %'];
const INV_UNITS = [{ value: 'qty', label: 'Qty' }, { value: 'sec', label: 'Seconds' }, { value: 'min', label: 'Minutes' }, { value: 'hrs', label: 'Hours' }, { value: 'days', label: 'Days' }];
const INV_TYPES = ['Raw', 'WIP', 'Finished Goods'];

function MapTypeModal({ open, onPick, onClose }: { open: boolean; onPick: (l: MapLevel) => void; onClose?: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => { if (open) ref.current?.showModal(); else ref.current?.close(); }, [open]);
  return <dialog ref={ref} className="preview-dialog vsm-maptype" onCancel={e => { e.preventDefault(); onClose?.(); }}>
    <div className="vsm-maptype-head"><Icon name="Workflow" size={30} /><h2>Select Map Type</h2><p className="muted">Choose the level of detail for your Value Stream Map</p></div>
    <div className="vsm-maptype-list">{MAP_LEVELS.map(l => <button key={l.key} type="button" className={'lvl-' + l.key} onClick={() => onPick(l.key)}>
      <span className="vsm-maptype-icon"><Icon name={l.icon} size={20} /></span>
      <span><strong>{l.label}</strong><small>{l.desc}</small><small>Best for: {l.best}</small></span>
      <Icon name="ChevronRight" size={16} />
    </button>)}</div>
    {onClose && <button type="button" className="pill-button outline small vsm-maptype-close" onClick={onClose}>Cancel</button>}
  </dialog>;
}

function ProcessView() {
  const { processes, setProcesses, rawDays, setRawDays, takt, setup, builder, setBuilder } = useContext(VsmCtx);
  const navigate = useNavigate();
  const preview = usePreview();
  const [active, setActive] = useState('flow-section');
  const [addingCol, setAddingCol] = useState(false);
  const [colName, setColName] = useState('');
  const [colUnit, setColUnit] = useState('');
  const set = (patch: Partial<BuilderState>) => setBuilder(b => ({ ...b, ...patch }));
  const m = mapMetrics(processes, rawDays, takt);
  const totalCt = processes.reduce((a, p) => a + p.cycleTime, 0);
  // Stock is kept in days; the unit dropdown converts for display like the live app's inventory unit.
  const perDaySec = availableSeconds(takt) || 86400;
  const factor = (u: string) => ({ days: 1, hrs: perDaySec / 3600, min: perDaySec / 60, sec: perDaySec, qty: dailyDemand(takt) || 1 } as Record<string, number>)[u] ?? 1;
  const show = (days: number, u: string) => +(days * factor(u)).toFixed(2);
  const store = (v: number, u: string) => v / factor(u);
  useEffect(() => {
    const els = BUILDER_NAV.map(n => document.getElementById(n.id)).filter((e): e is HTMLElement => !!e);
    const io = new IntersectionObserver(entries => { const hit = entries.filter(e => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]; if (hit) setActive(hit.target.id); }, { rootMargin: '-15% 0px -70% 0px' });
    els.forEach(e => io.observe(e));
    return () => io.disconnect();
  }, [builder.mapLevel]);
  const go = (id: string) => { setActive(id); document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); };
  const update = (id: string, patch: Partial<VsmProcess>) => setProcesses(list => list.map(p => p.id === id ? { ...p, ...patch } : p));
  const cellValue = (p: VsmProcess, k: ColKey) => k === 'seconds' ? p.hours * 3600 : k === 'totalChangeover' ? totalChangeover(p) : p[k];
  const setCell = (p: VsmProcess, k: ColKey, v: number) => {
    if (k === 'totalChangeover') update(p.id, { changeover: p.changeoverCount > 0 ? Math.round(v / p.changeoverCount * 100) / 100 : v });
    else if (k !== 'seconds') update(p.id, { [k]: v });
  };
  const addStep = () => setProcesses(list => [...list, newProcess(nextId('P', list.map(p => p.id)), 'Process ' + (list.length + 1))]);
  const addColumn = () => { const name = colName.trim(); if (!name) return; set({ customCols: [...builder.customCols, { key: 'col-' + Date.now(), label: name, unit: colUnit.trim() }] }); setColName(''); setColUnit(''); setAddingCol(false); };
  const reset = () => { setProcesses(currentProcesses); setRawDays(currentRawMaterialDays); setBuilder(b => ({ ...defaultBuilder, mapLevel: b.mapLevel })); };
  const level = MAP_LEVELS.find(l => l.key === builder.mapLevel);
  const boxFields = builder.boxMode === 'default' ? DEFAULT_BOX_FIELDS : builder.boxFields;
  const totalCols = MACHINE_COLS.length + 1 + builder.customCols.length;
  const first = processes[0], last = processes[processes.length - 1];
  return <>
    <MapTypeModal open={builder.mapLevel === null || builder.pickingLevel} onPick={l => set({ mapLevel: l, pickingLevel: false })} onClose={builder.mapLevel ? () => set({ pickingLevel: false }) : undefined} />
    <WorkflowProgress current={2} />
    <div className="vsm-setup-layout">
      <aside className="vsm-section-nav" aria-label="Process Builder sections">
        <div className="vsm-section-nav-title"><small>VALUE STREAM</small><strong>{setup.basics.name || 'Line A'}</strong><span>{setup.basics.productLine || 'Manufacturing Line'}</span></div>
        {BUILDER_NAV.map(n => <button key={n.id} type="button" className={active === n.id ? 'active' : ''} aria-current={active === n.id ? 'true' : undefined} onClick={() => go(n.id)}><span><Icon name={n.icon} size={16} /></span>{n.label}</button>)}
      </aside>
      <div className="vsm-stack">
        <section className="vsm-metric-row" aria-label="Value stream metrics">
          {[['Clock', 'Total Cycle Time', totalCt.toFixed(1) + ' sec'], ['History', 'Total Lead Time', m.leadTimeDays + ' days'], ['ClipboardList', 'Process Steps', processes.length + ' steps']].map(([icon, label, value]) =>
            <div key={label} className="vsm-metric"><span><Icon name={icon} size={16} />{label}</span><strong>{value}</strong></div>)}
        </section>
        {level && <div className={'vsm-level-bar lvl-' + level.key}><Icon name={level.icon} size={17} /><strong>{level.label}</strong><button type="button" onClick={() => set({ pickingLevel: true })}>Change</button></div>}
        {level && level.key !== 'process' && <div className="vsm-note"><Icon name="CircleAlert" size={16} /><span>The {level.label.replace(' VSM', '').toLowerCase()} substream builder (several product families side by side) is not in this preview yet. The single-stream builder below is shown instead.</span></div>}

        <section id="flow-section" className="panel vsm-section">
          <h2 className="vsm-card-title">Process Flow Type</h2>
          <div className="vsm-flow-options">{[
            { key: 'sequential' as const, icon: 'ArrowRight', label: 'Sequential', desc: ['Machines connected in order (1→2→3→4...)', 'Inventory inputs per connection'] },
            { key: 'parallel' as const, icon: 'Network', label: 'Parallel / Custom', desc: ['Manual connections with custom paths', 'Configure each connection separately'] },
          ].map(o => <button key={o.key} type="button" className={'vsm-flow-option ' + o.key + (builder.flowType === o.key ? ' on' : '')} aria-pressed={builder.flowType === o.key} onClick={() => set({ flowType: o.key })}>
            <span className="vsm-flow-option-title"><Icon name={o.icon} size={20} />{o.label}</span>
            {o.desc.map(d => <small key={d}>{d}</small>)}
          </button>)}</div>
        </section>

        <section id="machines-section" className="panel vsm-section">
          <div className="vsm-section-head"><span className="vsm-section-icon"><Icon name="Cog" size={18} /></span><h2>Machine Configuration <span className="vsm-badge">{totalCols} columns</span></h2>
            <div className="inline"><PillButton small icon="Upload" onClick={() => preview('Import Excel', 'Upload a time study or standard work sheet (.xlsx / .csv). Columns are matched to the machine fields; append to or replace the existing steps.')}>Import Excel</PillButton><PillButton small icon="Plus" onClick={() => setAddingCol(true)}>Add Column</PillButton></div></div>
          {builder.customCols.length > 0 && <div className="vsm-custom-cols"><span>Custom columns:</span>{builder.customCols.map(c => <span key={c.key} className="vsm-chip">{c.label}{c.unit && ' (' + c.unit + ')'}<button type="button" aria-label={'Remove column ' + c.label} title="Remove column" onClick={() => set({ customCols: builder.customCols.filter(x => x.key !== c.key) })}><Icon name="X" size={12} /></button></span>)}</div>}
          {addingCol && <form className="vsm-inline-add" onSubmit={e => { e.preventDefault(); addColumn(); }}>
            <strong><Icon name="Plus" size={14} />Add Column</strong>
            <div><input autoFocus value={colName} onChange={e => setColName(e.target.value)} placeholder="Column name, e.g. Scrap" aria-label="Column name" /><input value={colUnit} onChange={e => setColUnit(e.target.value)} placeholder="Unit (optional), e.g. kg" aria-label="Column unit" className="short" /></div>
            <div className="vsm-inline-actions"><PillButton small onClick={() => { setAddingCol(false); setColName(''); setColUnit(''); }}>Cancel</PillButton><PillButton small variant="dark" onClick={addColumn}>Add Column</PillButton></div>
          </form>}
          <div className="table-scroll" tabIndex={0} role="region" aria-label="Machine configuration"><table className="vsm-table vsm-machine-table">
            <thead><tr><th>#</th><th>Process Name</th>{MACHINE_COLS.map(c => <th key={c.key}>{c.label}</th>)}{builder.customCols.map(c => <th key={c.key}>{c.label}{c.unit && ' (' + c.unit + ')'}</th>)}<th>Actions</th></tr></thead>
            <tbody>{processes.map((p, i) => <tr key={p.id}>
              <td><span className="vsm-num">{i + 1}</span></td>
              <th scope="row"><input className="vsm-name-input" aria-label={'Step ' + (i + 1) + ' name'} value={p.name} onChange={e => update(p.id, { name: e.target.value })} /></th>
              {MACHINE_COLS.map(c => <td key={c.key}>{c.readOnly ? <span className="mono muted">{cellValue(p, c.key).toLocaleString('en-IN')}</span> : <input type="number" min={0} step={c.step ?? 1} aria-label={p.name + ' ' + c.label} value={cellValue(p, c.key)} onChange={e => setCell(p, c.key, Math.max(0, Number(e.target.value) || 0))} />}</td>)}
              {builder.customCols.map(c => <td key={c.key}><input type="number" min={0} aria-label={p.name + ' ' + c.label} value={p.custom?.[c.key] ?? ''} placeholder="—" onChange={e => update(p.id, { custom: { ...p.custom, [c.key]: Math.max(0, Number(e.target.value) || 0) } })} /></td>)}
              <td><button type="button" className="vsm-row-action danger" aria-label={'Delete ' + p.name} title="Delete step" disabled={processes.length === 1} onClick={() => setProcesses(list => list.filter(x => x.id !== p.id))}><Icon name="Trash2" size={15} /></button></td>
            </tr>)}</tbody>
          </table></div>
          <button type="button" className="vsm-add-row" onClick={addStep}><Icon name="Plus" size={18} /><span><strong>Add New Step</strong><small>Add new process step</small></span></button>
        </section>

        <section className="panel vsm-section">
          <div className="vsm-section-head"><span className="vsm-section-icon purple"><Icon name="PanelsTopLeft" size={18} /></span><h2>Process Box Display<small>Configure what fields appear inside each CSM map process box</small></h2><span className="vsm-badge purple">{boxFields.length} fields active</span></div>
          <div className="vsm-box-display">
            <div>
              <span className="vsm-label">FIELD SELECTION</span>
              <div className="vsm-seg" role="group" aria-label="Field selection">{(['default', 'custom'] as const).map(k => <button key={k} type="button" aria-pressed={builder.boxMode === k} className={builder.boxMode === k ? 'on' : ''} onClick={() => set({ boxMode: k })}><Icon name={k === 'default' ? 'Sparkles' : 'SlidersHorizontal'} size={14} />{k === 'default' ? 'Default' : 'Custom'}</button>)}</div>
              {builder.boxMode === 'custom'
                ? <div className="vsm-connect vsm-box-fields">{[...BOX_FIELD_CHOICES, ...builder.customCols.map(c => c.label)].map(f => { const on = builder.boxFields.includes(f); return <button key={f} type="button" aria-pressed={on} className={on ? 'on' : ''} onClick={() => set({ boxFields: on ? builder.boxFields.filter(x => x !== f) : [...builder.boxFields, f] })}>{f}</button>; })}</div>
                : <p className="muted vsm-box-hint">The standard VSM data box: {DEFAULT_BOX_FIELDS.join(', ')}.</p>}
            </div>
            <div className="vsm-box-preview" aria-label="Process box preview">
              <strong>{first?.name || 'Process Name'}</strong>
              {boxFields.length ? boxFields.map(f => <div key={f}><span>{f.replace(/ \((sec|min)\)| %/g, '')}</span><span>—</span></div>) : <div className="muted"><span>No fields selected</span></div>}
            </div>
          </div>
        </section>

        <div id="inventory-section" className="vsm-stack">
          <section className="panel vsm-section">
            <div className="vsm-section-head"><span className="vsm-section-icon"><Icon name={builder.flowType === 'sequential' ? 'ArrowRight' : 'Network'} size={18} /></span><h2>{builder.flowType === 'sequential' ? 'Sequential Flow Inventory' : 'Process Flow Connections'} <small className="inline-small">(Inventory per connection)</small></h2>
              <label className="vsm-unit-select"><span>Unit:</span><select value={builder.invUnit} onChange={e => set({ invUnit: e.target.value })}>{INV_UNITS.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}</select></label></div>
            {builder.flowType === 'sequential' ? <>
              <span className="vsm-label">INVENTORY BETWEEN STEPS (PER CONNECTION)</span>
              {processes.length <= 1 ? <p className="muted">Add at least 2 steps to define inventory between processes.</p>
                : <div className="vsm-inv-grid">{processes.slice(0, -1).map((p, i) => <label key={p.id} className="vsm-inv-card"><strong>{p.name || 'Process ' + (i + 1)} → {processes[i + 1].name || 'Process ' + (i + 2)}</strong>
                    <span><input type="number" min={0} step={0.1} aria-label={'Inventory after ' + p.name} value={show(p.inventoryAfter, builder.invUnit)} onChange={e => update(p.id, { inventoryAfter: store(Math.max(0, Number(e.target.value) || 0), builder.invUnit) })} /><em>{INV_UNITS.find(u => u.value === builder.invUnit)?.label}</em></span></label>)}</div>}
              <div className="vsm-info-note"><Icon name="CircleHelp" size={15} /><span>Sequential mode auto-connects steps in order. Total connections: <strong>{Math.max(0, processes.length - 1)}</strong></span></div>
            </> : <div className="vsm-note"><Icon name="CircleAlert" size={16} /><span>The split / branch / merge builder for custom paths is not in this preview yet. Switch to Sequential to edit inventory between steps.</span></div>}
          </section>

          <section className="panel vsm-section">
            <div className="vsm-section-head"><span className="vsm-section-icon sky"><Icon name="Truck" size={18} /></span><h2>Supplier / Customer Connections</h2>
              <div className="vsm-wh-names">
                <label className="in">Inbound WH<input value={builder.inboundName} placeholder="Material WH" onChange={e => set({ inboundName: e.target.value })} /></label>
                <label className="out">Outbound WH<input value={builder.outboundName} placeholder="FG Warehouse" onChange={e => set({ outboundName: e.target.value })} /></label>
              </div></div>
            <div className="vsm-conn-row">
              <div className="in"><span>{builder.inboundName || 'Material WH'}</span>
                <input type="number" min={0} step={0.1} aria-label="Inbound stock" value={show(rawDays, builder.rmUnit)} onChange={e => setRawDays(store(Math.max(0, Number(e.target.value) || 0), builder.rmUnit))} />
                <select aria-label="Inbound stock unit" value={builder.rmUnit} onChange={e => set({ rmUnit: e.target.value })}>{INV_UNITS.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}</select>
                <select aria-label="Inbound stock type" value={builder.rmType} onChange={e => set({ rmType: e.target.value })}>{INV_TYPES.map(t => <option key={t}>{t}</option>)}</select></div>
              <i aria-hidden="true" />
              <div className="out"><span>{builder.outboundName || 'FG Warehouse'}</span>
                <input type="number" min={0} step={0.1} aria-label="Outbound stock" value={last ? show(last.inventoryAfter, builder.fgUnit) : 0} onChange={e => last && update(last.id, { inventoryAfter: store(Math.max(0, Number(e.target.value) || 0), builder.fgUnit) })} />
                <select aria-label="Outbound stock unit" value={builder.fgUnit} onChange={e => set({ fgUnit: e.target.value })}>{INV_UNITS.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}</select>
                <select aria-label="Outbound stock type" value={builder.fgType} onChange={e => set({ fgType: e.target.value })}>{INV_TYPES.map(t => <option key={t}>{t}</option>)}</select></div>
            </div>
          </section>
        </div>
      </div>
    </div>
    <div className="vsm-setup-footer">
      <PillButton icon="ArrowLeft" to="/vsm/setup">Previous</PillButton>
      <div className="inline">
        <PillButton icon="History" onClick={reset}>Reset All</PillButton>
        <PillButton onClick={() => preview('Draft saved', 'Saves the process steps as a draft. Drafts are not saved in this preview.')}>Save Draft</PillButton>
        <PillButton variant="blue" icon="Workflow" onClick={() => navigate('/vsm/current')}>Generate Current State Map</PillButton>
      </div>
    </div>
  </>;
}

function MapStats({ m }: { m: ReturnType<typeof mapMetrics> }) {
  return <div className="vsm-map-stats">{[['Lead time', m.leadTimeDays + ' days'], ['Value-added time', m.vaSeconds + ' s'], ['PCE', formatPce(m.pce)], ['WIP between steps', m.wipDays + ' days'], ['Operators', String(m.operators)]].map(([k, v]) => <div key={k}><span className="muted">{k}</span><strong>{v}</strong></div>)}</div>;
}

/* ── 03 CSM Canvas: the live app's current state canvas — summary sidebar, floating toolbar, the map, footer ── */
const CSM_LAYERS = [
  { key: 'pc', label: 'Production Control' }, { key: 'ends', label: 'Supplier & Customer' }, { key: 'info', label: 'Information Flow' },
  { key: 'schedule', label: 'PC Schedule Lines' }, { key: 'boxes', label: 'Process Boxes' }, { key: 'ladder', label: 'Lead-Time Ladder' }, { key: 'summary', label: 'Summary Box' },
] as const;
type CsmLayer = typeof CSM_LAYERS[number]['key'];
/** What a data-box field shows, keyed by the Process Box Display labels. */
const BOX_VALUE: Record<string, (p: VsmProcess) => string> = {
  'Cycle Time (sec)': p => 'Cycle Time= ' + p.cycleTime + ' sec', 'Avg C/O (min)': p => 'C/O= ' + p.changeover + ' min', 'Available Time (sec)': p => 'Available Time= ' + (p.hours * 3600).toLocaleString('en-IN') + ' sec',
  'Time (sec) Total': p => 'Available Time= ' + (p.hours * 3600).toLocaleString('en-IN') + ' sec', 'Hours/Day Avail.': p => 'Hours/Day= ' + p.hours, 'OEE %': p => 'OEE= ' + p.oee + '%',
  'Rejection %': p => 'Rejection= ' + p.rejection + '%', 'Rework %': p => 'Rework= ' + p.rework + '%', 'Breakdown %': p => 'Uptime= ' + uptime(p) + '%', 'Operators': p => 'Operators= ' + p.operators,
  'Machines': p => 'Machines= ' + p.machines, 'C/O Count / Day': p => 'C/O Count= ' + p.changeoverCount, 'Total C/O (min)': p => 'Total C/O= ' + totalChangeover(p) + ' min',
};
const CSM_DEFAULT_ROWS = ['Cycle Time (sec)', 'Avg C/O (min)', 'Available Time (sec)', 'Breakdown %', 'Rejection %', 'Rework %'];

function csmSummary(processes: VsmProcess[], rawDays: number, takt: TaktInputs) {
  const m = mapMetrics(processes, rawDays, takt);
  const perDay = availableSeconds(takt) || 86400;
  const leadSec = m.leadTimeDays * perDay;
  const nva = Math.max(0, leadSec - m.vaSeconds);
  const yieldPct = processes.reduce((a, p) => a * (1 - p.rejection / 100) * (1 - p.rework / 100), 1) * 100;
  return { m, nva, vaRatio: nva ? m.vaSeconds / nva * 100 : 0, yieldPct, takt: taktSeconds(takt) };
}

function Truck({ x, y }: { x: number; y: number }) {
  return <g className="csm-truck" transform={`translate(${x - 7} ${y - 5})`}><rect x={0} y={0} width={9} height={7} /><path d="M9 2 H12 L14 5 V7 H9 Z" /><circle cx={3} cy={8.5} r={1.5} /><circle cx={11} cy={8.5} r={1.5} /></g>;
}
interface MapGeo { bx: (i: number) => number; BW: number; boxY: number; boxH: number; W: number; H: number; fgX: number; ladderY: number; }
function CsmMap({ layers, fields, zoom, procs, raw, extraRows = [], overlay, onMapClick, label = 'Current state value stream map', addMode }: { layers: Record<CsmLayer, boolean>; fields: string[]; zoom: number; procs?: VsmProcess[]; raw?: number; extraRows?: string[][]; overlay?: (g: MapGeo) => ReactNode; onMapClick?: (x: number, y: number) => void; label?: string; addMode?: boolean }) {
  const ctx = useContext(VsmCtx);
  const { takt, setup, builder } = ctx;
  const processes = procs ?? ctx.processes, rawDays = raw ?? ctx.rawDays;
  const n = processes.length;
  const BW = 168, GAP = 70, X0 = 200;
  const rows = fields.filter(f => BOX_VALUE[f]);
  const boxY = 250, headH = 26, opH = 22, rowH = 19;
  const boxH = headH + opH + rows.length * rowH + 6;
  const bx = (i: number) => X0 + i * (BW + GAP);
  const lastRight = bx(n - 1) + BW;
  const fgX = lastRight + 50, W = Math.max(fgX + 260, 900);
  const ladderY = boxY + boxH + 70;
  const H = ladderY + 210;
  const s = csmSummary(processes, rawDays, takt);
  const supplier = setup.suppliers[0], customer = setup.customers[0];
  const pcX = W / 2 - 120, pcW = 240;
  const days = (d: number) => (Math.round(d * 100) / 100) + 'd';
  const scheduleTargets = setup.info.routing === 'parallel' ? processes.map((_, i) => i) : [0];
  const sumRows = 7 + extraRows.length;
  const click = (e: React.MouseEvent<SVGSVGElement>) => { if (!onMapClick) return; const pt = e.currentTarget.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY; const m = e.currentTarget.getScreenCTM(); if (!m) return; const q = pt.matrixTransform(m.inverse()); onMapClick(q.x, q.y); };
  return <svg className={'vsm-svg csm-svg' + (addMode ? ' adding' : '')} viewBox={`0 0 ${W} ${H + (sumRows - 7) * 21}`} width={W * zoom} height={(H + (sumRows - 7) * 21) * zoom} data-w={W} role="img" aria-label={label} onClick={click}>
    <defs>
      <marker id="csm-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 Z" className="csm-arrowhead" /></marker>
    </defs>
    {layers.ends && <>
      <g className="csm-factory supplier" transform="translate(30 30)"><path d="M0 120 V40 L50 10 V40 L100 10 V40 L150 10 V120 Z" /><text x="75" y="85" textAnchor="middle" className="vsm-text strong">{supplier?.name || 'Suppliers'}</text></g>
      <g className="csm-factory customer" transform={`translate(${W - 190} 30)`}><path d="M0 120 V40 L50 10 V40 L100 10 V40 L150 10 V120 Z" /><text x="75" y="85" textAnchor="middle" className="vsm-text strong">{customer?.name || 'Customers'}</text></g>
      {/* material WH and FG warehouse with their transport links */}
      <line className="csm-flow" x1={105} y1={150} x2={105} y2={boxY - 8} markerEnd="url(#csm-arrow)" />
      <g><circle cx={105} cy={(150 + boxY) / 2} r={11} className="csm-transport" /><Truck x={105} y={(150 + boxY) / 2} /></g>
      <line className="csm-flow" x1={fgX + 70} y1={boxY - 8} x2={W - 115} y2={150} markerEnd="url(#csm-arrow)" />
      <g><circle cx={(fgX + 70 + W - 115) / 2} cy={(150 + boxY) / 2} r={11} className="csm-transport" /><Truck x={(fgX + 70 + W - 115) / 2} y={(150 + boxY) / 2} /></g>
      <g className="csm-wh in"><rect x={40} y={boxY} width={130} height={56} /><line x1={40} y1={boxY + 14} x2={170} y2={boxY + 14} /><text x={105} y={boxY + 40} textAnchor="middle" className="vsm-text strong">{builder.inboundName || 'Material WH'}</text><text x={105} y={boxY + 74} textAnchor="middle" className="vsm-text csm-in-t">Total Stock: {days(rawDays).replace('d', ' days')}</text></g>
      <g className="csm-wh out"><rect x={fgX} y={boxY} width={140} height={56} /><line x1={fgX} y1={boxY + 14} x2={fgX + 140} y2={boxY + 14} /><text x={fgX + 70} y={boxY + 40} textAnchor="middle" className="vsm-text strong">{builder.outboundName || 'FG Warehouse'}</text><text x={fgX + 70} y={boxY + 74} textAnchor="middle" className="vsm-text csm-out-t">Total Stock: {days(processes[n - 1]?.inventoryAfter ?? 0).replace('d', ' days')}</text></g>
    </>}
    {layers.pc && <g><rect className="csm-pc" x={pcX} y={50} width={pcW} height={64} rx={6} /><text x={W / 2} y={76} textAnchor="middle" className="vsm-text strong">{setup.info.ppcsName || 'Production Control'}</text><text x={W / 2} y={96} textAnchor="middle" className="vsm-text muted">MRP / ERP System</text></g>}
    {layers.info && <>
      <line className="csm-info" x1={W - 190} y1={80} x2={pcX + pcW} y2={80} markerEnd="url(#csm-arrow)" /><text x={(W - 190 + pcX + pcW) / 2} y={72} textAnchor="middle" className="vsm-text csm-info-t">{(customer?.orderFrequency || 'Daily') + ' Orders'}</text>
      <line className="csm-info" x1={pcX} y1={80} x2={180} y2={80} markerEnd="url(#csm-arrow)" /><text x={(pcX + 180) / 2} y={72} textAnchor="middle" className="vsm-text csm-info-t">{(supplier?.forecastFrequency || 'Monthly') + ' Forecast'}</text>
    </>}
    {layers.schedule && scheduleTargets.map(i => <line key={i} className="csm-info faint" x1={W / 2} y1={114} x2={bx(i) + BW / 2} y2={boxY - 4} markerEnd="url(#csm-arrow)" />)}
    {layers.boxes && <>
      {processes.length > 0 && <><line className="csm-flow" x1={170} y1={boxY + 28} x2={bx(0) - 4} y2={boxY + 28} markerEnd="url(#csm-arrow)" /></>}
      {processes.map((p, i) => {
        const x = bx(i);
        return <g key={p.id}>
          <rect className="csm-box" x={x} y={boxY} width={BW} height={boxH} />
          <text x={x + BW / 2} y={boxY + 18} textAnchor="middle" className="vsm-text strong">{p.name.length > 20 ? p.name.slice(0, 19) + '…' : p.name}</text>
          <line className="csm-box-line" x1={x} y1={boxY + headH} x2={x + BW} y2={boxY + headH} />
          <g className="csm-operator" transform={`translate(${x + 12} ${boxY + headH + 4})`}><circle cx={5} cy={4} r={3.2} /><path d="M0 14 Q5 6 10 14" /></g><text x={x + 28} y={boxY + headH + 15} className="vsm-text">= {p.operators}</text>
          <rect className="csm-box-band" x={x} y={boxY + headH + opH - 4} width={BW} height={4} />
          {rows.map((f, r) => <g key={f}><line className="csm-box-line" x1={x} y1={boxY + headH + opH + r * rowH} x2={x + BW} y2={boxY + headH + opH + r * rowH} /><text x={x + 8} y={boxY + headH + opH + r * rowH + 13} className="vsm-text csm-row-t">{BOX_VALUE[f](p)}</text></g>)}
          {i < n - 1
            ? <g><line className="csm-flow" x1={x + BW + 4} y1={boxY + 28} x2={bx(i + 1) - 4} y2={boxY + 28} markerEnd="url(#csm-arrow)" /><path className="vsm-inventory" d={`M${x + BW + GAP / 2} ${boxY + 6} L${x + BW + GAP / 2 + 13} ${boxY + 28} L${x + BW + GAP / 2 - 13} ${boxY + 28} Z`} /><text x={x + BW + GAP / 2} y={boxY + 24} textAnchor="middle" className="vsm-text strong csm-inv-i">I</text><text x={x + BW + GAP / 2} y={boxY + 44} textAnchor="middle" className="vsm-text csm-inv-t">{days(p.inventoryAfter)}</text></g>
            : <line className="csm-flow" x1={x + BW + 4} y1={boxY + 28} x2={fgX - 4} y2={boxY + 28} markerEnd="url(#csm-arrow)" />}
        </g>;
      })}
    </>}
    {layers.ladder && <g className="csm-ladder">{(() => {
      const segs: { x1: number; x2: number; high: boolean; label: string; sub?: string }[] = [{ x1: 60, x2: bx(0), high: true, label: days(rawDays) }];
      processes.forEach((p, i) => {
        segs.push({ x1: bx(i), x2: bx(i) + BW, high: false, label: p.cycleTime + 's', sub: 'M' + (i + 1) });
        segs.push({ x1: bx(i) + BW, x2: i === n - 1 ? fgX + 140 : bx(i + 1), high: true, label: days(p.inventoryAfter) });
      });
      const y = (h: boolean) => h ? ladderY : ladderY + 60;
      return segs.map((g, i) => <g key={i}>
        <line className="csm-ladder-line" x1={g.x1} y1={y(g.high)} x2={g.x2} y2={y(g.high)} />
        {i > 0 && <line className="csm-ladder-line" x1={g.x1} y1={y(segs[i - 1].high)} x2={g.x1} y2={y(g.high)} />}
        <text x={(g.x1 + g.x2) / 2} y={g.high ? y(true) - 8 : y(false) - 8} textAnchor="middle" className={'vsm-text ' + (g.high ? 'csm-lad-hi' : 'csm-lad-lo')}>{g.label}</text>
        {g.sub && <text x={(g.x1 + g.x2) / 2} y={y(false) + 16} textAnchor="middle" className="vsm-text muted">{g.sub}</text>}
      </g>);
    })()}</g>}
    {layers.summary && <g>
      <rect className="csm-summary" x={W - 250} y={ladderY - 20} width={230} height={196 + extraRows.length * 21} rx={4} />
      <text x={W - 135} y={ladderY + 4} textAnchor="middle" className="vsm-text strong csm-sum-h">SUMMARY</text>
      <line className="csm-box-line" x1={W - 240} y1={ladderY + 14} x2={W - 30} y2={ladderY + 14} />
      {[['Total Lead Time:', s.m.leadTimeDays + ' days', ''], ['Total VA Time:', s.m.vaSeconds + ' sec', ''], ['Total NVA Time:', Math.round(s.nva).toLocaleString('en-IN') + ' sec', 'red'],
        ['VA Ratio:', s.vaRatio.toFixed(2) + ' %', 'green'], ['PCE:', formatPce(s.m.pce), 'green'], ['Throughput Yield:', s.yieldPct.toFixed(2) + ' %', 'blue'], ['Takt Time:', s.takt === null ? 'NA' : s.takt + ' sec', ''], ...extraRows].map(([k, v, tone], r) =>
        <g key={k}><text x={W - 238} y={ladderY + 36 + r * 21} className="vsm-text muted">{k}</text><text x={W - 32} y={ladderY + 36 + r * 21} textAnchor="end" className={'vsm-text strong ' + (tone ? 'csm-' + tone : '')}>{v}</text></g>)}
    </g>}
    {overlay?.({ bx, BW, boxY, boxH, W, H, fgX, ladderY })}
  </svg>;
}

function CsmSidebar({ procs }: { procs?: VsmProcess[] } = {}) {
  const ctx = useContext(VsmCtx);
  const { rawDays, takt, setup } = ctx;
  const processes = procs ?? ctx.processes;
  const s = csmSummary(processes, rawDays, takt);
  const u = unitShort(takt.unit);
  const card = (tone: string, icon: string, label: string, value: ReactNode, unit: string) => <div className={'csm-card ' + tone}><span><Icon name={icon} size={14} />{label}</span><strong>{value}<em>{unit}</em></strong></div>;
  return <aside className="csm-sidebar" aria-label="Value stream summary">
    <h3>Value Stream Summary</h3>
    <div className="csm-info-row"><Icon name="BarChart3" size={16} /><div><small>VALUE STREAM NAME</small><span>{setup.basics.name || '—'}</span></div></div>
    <div className="csm-info-row green"><Icon name="TrendingUp" size={16} /><div><small>PRODUCTION LINE</small><span>{setup.basics.productLine || '—'}</span></div></div>
    <h3>Production</h3>
    {card('green', 'CalendarDays', 'Working Days/Month', takt.workingDays || 25, 'days')}
    {card('indigo', 'TrendingUp', 'Monthly Production', dailyDemand(takt) ? Math.round(dailyDemand(takt) * (takt.workingDays || 25)).toLocaleString('en-IN') : '—', u)}
    {card('purple', 'Target', 'Daily Target', dailyDemand(takt) ? (+dailyDemand(takt).toFixed(2)).toLocaleString('en-IN') : '—', u)}
    <h3>Key Metrics</h3>
    {card('green', 'Clock', 'Total Cycle Time', s.m.vaSeconds, 'sec')}
    {card('red', 'Clock', 'Total Lead Time', s.m.leadTimeDays, 'days')}
    {card('blue', 'Activity', 'Value-Added Ratio', s.vaRatio.toFixed(2), '%')}
    {card('amber', 'PanelsTopLeft', 'Process Steps', processes.length, 'steps')}
    <h3>Process Flow</h3>
    <ol className="csm-flow-list">{processes.map((p, i) => <li key={p.id}>{p.name || 'Process ' + (i + 1)}</li>)}</ol>
  </aside>;
}

function CurrentView() {
  const { builder } = useContext(VsmCtx);
  const preview = usePreview();
  const navigate = useNavigate();
  const [zoom, setZoom] = useState(1);
  const [full, setFull] = useState(false);
  const [side, setSide] = useState(true);
  const [layersOpen, setLayersOpen] = useState(false);
  const [layers, setLayers] = useState<Record<CsmLayer, boolean>>({ pc: true, ends: true, info: true, schedule: true, boxes: true, ladder: true, summary: true });
  const stage = useRef<HTMLDivElement>(null);
  const fields = builder.boxMode === 'default' ? CSM_DEFAULT_ROWS : builder.boxFields;
  const fit = () => { const el = stage.current; const svg = el?.querySelector('svg'); if (el && svg) setZoom(Math.max(0.3, Math.min(2, Math.floor((el.clientWidth - 24) / Number(svg.getAttribute('data-w')) * 100) / 100))); };
  useEffect(() => { fit(); }, [full, side]);
  useEffect(() => { if (!full) return; const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') setFull(false); }; addEventListener('keydown', esc); return () => removeEventListener('keydown', esc); }, [full]);
  const btn = (icon: string, label: string, onClick: () => void, opts: { on?: boolean; disabled?: boolean } = {}) =>
    <button type="button" className={'csm-tool' + (opts.on ? ' on' : '')} aria-label={label} title={label} disabled={opts.disabled} onClick={onClick}><Icon name={icon} size={16} /></button>;
  return <>
    {!full && <WorkflowProgress current={3} />}
    <div className={'csm-shell' + (full ? ' full' : '') + (side ? '' : ' no-side')}>
      {side && !full && <CsmSidebar />}
      <div className="csm-canvas">
        <div className="csm-topbar">
          {!full && <button type="button" className="csm-tool" aria-label={side ? 'Collapse sidebar' : 'Expand sidebar'} title={side ? 'Collapse sidebar' : 'Expand sidebar'} onClick={() => setSide(v => !v)}><Icon name={side ? 'ChevronLeft' : 'ChevronRight'} size={16} /></button>}
          <span className="csm-title">Current State Map</span>
          <div className="csm-toolbar" role="toolbar" aria-label="Canvas tools">
            <div className="csm-group">{btn('Undo2', 'Undo (Ctrl+Z)', () => {}, { disabled: true })}{btn('Redo2', 'Redo (Ctrl+Y)', () => {}, { disabled: true })}</div>
            <div className="csm-group">{btn('ZoomOut', 'Zoom out', () => setZoom(z => Math.max(0.3, +(z - 0.1).toFixed(2))))}<span className="csm-zoom mono">{Math.round(zoom * 100)}%</span>{btn('ZoomIn', 'Zoom in', () => setZoom(z => Math.min(2, +(z + 0.1).toFixed(2))))}</div>
            <div className="csm-group">{btn('Scan', 'Fit view', fit)}{btn(full ? 'Minimize2' : 'Maximize2', full ? 'Exit Full View' : 'Full View', () => setFull(f => !f), { on: full })}</div>
            <div className="csm-group">{btn('Move', 'Drag single box', () => preview('Drag single box', 'Move one process box on the canvas; positions are saved with Save layout.'))}{btn('Rows3', 'Drag entire row', () => preview('Drag entire row', 'Move a whole lane of boxes together.'))}{btn('RotateCcw', 'Reset all positions', () => preview('Reset all positions', 'Puts every box back in its calculated place.'))}{btn('Save', 'Save layout', () => preview('Save layout', 'Saves box positions for this map. Not saved in this preview.'))}</div>
            <div className="csm-group csm-layers-wrap">{btn('Layers', 'Map Layers', () => setLayersOpen(o => !o), { on: layersOpen })}
              {layersOpen && <div className="csm-layers" role="group" aria-label="Map Layers"><strong>Map Layers</strong>{CSM_LAYERS.map(l => <label key={l.key}><input type="checkbox" checked={layers[l.key]} onChange={() => setLayers(x => ({ ...x, [l.key]: !x[l.key] }))} />{l.label}</label>)}</div>}</div>
            <div className="csm-group">{btn('Pencil', 'Edit Inventory', () => navigate('/vsm/processes'))}{btn('Tag', 'Add Label / Text', () => preview('Add label', 'Click on the canvas to drop a text annotation.'))}</div>
          </div>
          {btn('Download', 'Export', () => preview('Export', 'Export the current state map as a PDF (with page preview) or as an image.'))}
        </div>
        <div className="csm-stage" ref={stage} tabIndex={0} role="region" aria-label="Current state map canvas">
          <CsmMap layers={layers} fields={fields} zoom={zoom} />
        </div>
      </div>
    </div>
    {!full && <div className="vsm-setup-footer">
      <PillButton icon="ArrowLeft" to="/vsm/processes">Previous</PillButton>
      <PillButton variant="dark" icon="ArrowRight" to="/vsm/future">Future State Planner</PillButton>
    </div>}
  </>;
}

/* ── 04 FSM Planner: the live app's Future State Planner — CSM canvas plus improvement points and AI recommendations ── */
const BLANK_IMP = { title: '', type: 'Process', priority: 'Medium', description: '', solution: '', cost: 0, benefit: 0, target: 'on_process', processId: '', param: '' as ImpParam | '', method: '' as string, value: '' as string };
type ImpDraft = typeof BLANK_IMP;

function ImprovementDialog({ open, editing, onClose, onSave, onDelete }: { open: boolean; editing: Improvement | null; onClose: () => void; onSave: (d: ImpDraft) => void; onDelete?: () => void }) {
  const { processes } = useContext(VsmCtx);
  const ref = useRef<HTMLDialogElement>(null);
  const [d, setD] = useState<ImpDraft>(BLANK_IMP);
  const [err, setErr] = useState('');
  useEffect(() => {
    if (open) { setErr(''); setD(editing ? { ...BLANK_IMP, ...editing, processId: editing.processId ?? '', param: editing.param ?? '', method: editing.method ?? '', value: editing.value === undefined ? '' : String(editing.value) } : BLANK_IMP); ref.current?.showModal(); }
    else ref.current?.close();
  }, [open, editing]);
  const set = (patch: Partial<ImpDraft>) => setD(x => ({ ...x, ...patch }));
  const field = d.target === 'between_processes' ? INV_FIELD : IMP_FIELDS.find(f => f.key === d.param);
  const needsProcess = d.target === 'on_process' || d.target === 'between_processes';
  const save = () => {
    if (!d.title.trim()) return setErr('Give the improvement a title.');
    if (needsProcess && !d.processId) return setErr(d.target === 'on_process' ? 'Choose the target process.' : 'Choose the connection.');
    if (d.target === 'on_process' && d.param && (!d.method || d.value === '')) return setErr('Choose how to improve and enter a value.');
    if (d.target === 'between_processes' && (!d.method || d.value === '')) return setErr('Choose how to improve and enter a value.');
    onSave(d);
  };
  return <dialog ref={ref} className="preview-dialog vsm-imp-dialog" onCancel={e => { e.preventDefault(); onClose(); }}>
    <div className="dialog-header"><span className="vsm-imp-dot" /><h2>{editing ? 'Improvement Point' : 'New Improvement Point'}</h2><button type="button" className="circle-button" aria-label="Close" onClick={onClose}><Icon name="X" /></button></div>
    <div className="vsm-imp-form">
      <TextField required label="Title" value={d.title} onChange={v => set({ title: v })} placeholder="e.g. Reduce changeover time" />
      <div className="vsm-fields"><SelectField label="Type" value={d.type} options={IMP_TYPES} onChange={v => set({ type: v })} /><SelectField label="Priority" value={d.priority} options={IMP_PRIORITIES} onChange={v => set({ priority: v })} /></div>
      <label className="vsm-field"><FieldLabel>Description</FieldLabel><textarea rows={2} value={d.description} placeholder="Describe the problem or observation…" onChange={e => set({ description: e.target.value })} /></label>
      <label className="vsm-field"><FieldLabel>Proposed Solution</FieldLabel><textarea rows={2} value={d.solution} placeholder="What change would fix this?…" onChange={e => set({ solution: e.target.value })} /></label>
      <div className="vsm-fields"><NumberField label="Cost" value={d.cost} onChange={v => set({ cost: v })} step={500} /><NumberField label="Benefit (ROI)" value={d.benefit} onChange={v => set({ benefit: v })} step={500} /></div>
      <SelectField label="Target Location" value={d.target} options={IMP_TARGET_TYPES.map(t => ({ value: t.key, label: t.label }))} onChange={v => set({ target: v, processId: '', param: '', method: '', value: '' })} />
      {d.target === 'on_process' && <SelectField label="Target Process" value={d.processId} placeholder="Select process" options={processes.map(p => ({ value: p.id, label: p.name }))} onChange={v => set({ processId: v })} />}
      {d.target === 'between_processes' && <SelectField label="Connection" value={d.processId} placeholder="Select connection" options={processes.slice(0, -1).map((p, i) => ({ value: p.id, label: p.name + ' → ' + processes[i + 1].name }))} onChange={v => set({ processId: v })} />}
      {d.target === 'on_process' && d.processId && <SelectField label="Parameter to Improve" value={d.param} placeholder="Select parameter (optional)" options={IMP_FIELDS.map(f => ({ value: f.key, label: f.label }))} onChange={v => set({ param: v as ImpParam, method: '', value: '' })} />}
      {field && (d.target === 'between_processes' ? d.processId : d.param) && <SelectField label="How to Improve" value={d.method} placeholder="Select method" options={field.methods.map(m => ({ value: m.key, label: m.label }))} onChange={v => set({ method: v, value: '' })} />}
      {field && d.method && <label className="vsm-field"><FieldLabel>Value</FieldLabel><div><input type="number" min={0} step={0.1} value={d.value} placeholder={field.methods.find(m => m.key === d.method)?.hint} onChange={e => set({ value: e.target.value })} />{field.unit && <em>{field.unit}</em>}</div></label>}
      {err && <p className="vsm-imp-err">{err}</p>}
    </div>
    <div className="vsm-imp-actions">
      {onDelete && <PillButton small icon="Trash2" onClick={onDelete}>Delete</PillButton>}
      <PillButton small onClick={onClose}>Cancel</PillButton>
      <PillButton small variant="dark" icon="Check" onClick={save}>{editing ? 'Save' : 'Add'}</PillButton>
    </div>
  </dialog>;
}

function RecommendationsPanel({ recs, applied, onApply, onRemove, deep, setDeep }: { recs: Recommendation[]; applied: Set<string>; onApply: (r: Recommendation) => void; onRemove: (r: Recommendation) => void; deep: boolean; setDeep: (v: boolean) => void }) {
  const preview = usePreview();
  const [sort, setSort] = useState('impact');
  const rank: Record<string, number> = { High: 0, Medium: 1, Low: 2 };
  const list = [...recs].sort((a, b) => sort === 'cost' ? rank[b.cost] - rank[a.cost] : sort === 'roi' ? (rank[a.impact] - rank[a.cost]) - (rank[b.impact] - rank[b.cost]) : rank[a.impact] - rank[b.impact]);
  const high = recs.filter(r => r.impact === 'High').length;
  return <aside className="vsm-recs" aria-label="AI Smart Recommendations">
    <div className="vsm-recs-head"><Icon name="Sparkles" size={18} /><strong>AI Smart Recommendations</strong></div>
    <div className="vsm-seg" role="group" aria-label="Analysis depth"><button type="button" className={!deep ? 'on' : ''} aria-pressed={!deep} onClick={() => setDeep(false)}>Standard analysis</button><button type="button" className={deep ? 'on' : ''} aria-pressed={deep} onClick={() => setDeep(true)}>Deep analysis</button></div>
    <div className="vsm-recs-stats">{[['Findings', recs.length], ['High', high], ['Applied', applied.size], ['Open', recs.length - [...applied].filter(id => recs.some(r => r.id === id)).length]].map(([k, v]) => <div key={k as string}><strong>{v}</strong><span>{k}</span></div>)}</div>
    <select className="vsm-recs-sort" aria-label="Sort recommendations" value={sort} onChange={e => setSort(e.target.value)}><option value="impact">Sort — highest impact</option><option value="roi">Sort — best ROI</option><option value="cost">Sort — lowest cost</option></select>
    {deep && <div className="vsm-info-note"><Icon name="CircleHelp" size={15} /><span>Deep analysis also checks map design and flow. Not run in this preview.</span></div>}
    <div className="vsm-recs-list">{list.map(r => { const on = applied.has(r.id); return <article key={r.id} className={'vsm-rec' + (on ? ' applied' : '')}>
      <div className="vsm-rec-top"><span className="vsm-rec-type">{r.type}</span><Chip tone={r.impact === 'High' ? 'critical' : 'medium'}>{r.impact} impact</Chip><Chip tone="neutral">{r.cost} cost</Chip></div>
      <h4>{r.title}</h4><p>{r.description}</p><p className="vsm-rec-fix"><Icon name="Sparkles" size={13} />{r.suggestion}</p>
      <div className="vsm-rec-actions">{r.fix ? (on ? <><span className="vsm-rec-on"><Icon name="CheckCircle2" size={14} />On map</span><PillButton small onClick={() => onRemove(r)}>Remove</PillButton></> : <PillButton small variant="dark" icon="Plus" onClick={() => onApply(r)}>Apply</PillButton>) : <PillButton small to="/vsm/processes">Open Process Builder</PillButton>}
        <button type="button" className="vsm-rec-link" onClick={() => preview('What did you see?', 'Add what you saw on the floor; the AI refines this suggestion with it. Not available in this preview.')}><Icon name="Pencil" size={13} />What did you see?</button></div>
    </article>; })}
      {list.length === 0 && <EmptyState title="No findings" description="Every step is within the usual limits." />}
    </div>
  </aside>;
}

function PlannerView() {
  const { processes, rawDays, builder, improvements, setImprovements, takt } = useContext(VsmCtx);
  const preview = usePreview();
  const navigate = useNavigate();
  const [zoom, setZoom] = useState(1);
  const [full, setFull] = useState(false);
  const [side, setSide] = useState(true);
  const [showRecs, setShowRecs] = useState(true);
  const [deep, setDeep] = useState(false);
  const [addMode, setAddMode] = useState(false);
  const [layersOpen, setLayersOpen] = useState(false);
  const [layers, setLayers] = useState<Record<CsmLayer, boolean>>({ pc: true, ends: true, info: true, schedule: true, boxes: true, ladder: true, summary: true });
  const [dialog, setDialog] = useState<{ open: boolean; at?: { x: number; y: number }; editing: Improvement | null }>({ open: false, editing: null });
  const [history, setHistory] = useState<{ past: Improvement[][]; future: Improvement[][] }>({ past: [], future: [] });
  const stage = useRef<HTMLDivElement>(null);
  const future = applyImprovements(processes, improvements);
  const recs = generateRecommendations(processes, taktSeconds(takt));
  const applied = new Set(improvements.filter(i => i.recId).map(i => i.recId!));
  const commit = (next: Improvement[]) => { setHistory(h => ({ past: [...h.past, improvements], future: [] })); setImprovements(next); };
  const undo = () => setHistory(h => { if (!h.past.length) return h; setImprovements(h.past[h.past.length - 1]); return { past: h.past.slice(0, -1), future: [improvements, ...h.future] }; });
  const redo = () => setHistory(h => { if (!h.future.length) return h; setImprovements(h.future[0]); return { past: [...h.past, improvements], future: h.future.slice(1) }; });
  const fields = builder.boxMode === 'default' ? CSM_DEFAULT_ROWS : builder.boxFields;
  const fit = () => { const el = stage.current; const svg = el?.querySelector('svg'); if (el && svg) setZoom(Math.max(0.3, Math.min(2, Math.floor((el.clientWidth - 24) / Number(svg.getAttribute('data-w')) * 100) / 100))); };
  useEffect(() => { fit(); }, [full, side, showRecs]);
  useEffect(() => { const k = (e: KeyboardEvent) => { if (e.key === 'Escape') { setFull(false); setAddMode(false); } if ((e.ctrlKey || e.metaKey) && e.key === 'z') undo(); if ((e.ctrlKey || e.metaKey) && e.key === 'y') redo(); }; addEventListener('keydown', k); return () => removeEventListener('keydown', k); });
  const save = (d: ImpDraft) => {
    const base: Improvement = { id: dialog.editing?.id ?? 'IMP' + Date.now(), title: d.title.trim(), type: d.type, priority: d.priority, description: d.description, solution: d.solution, cost: d.cost, benefit: d.benefit, target: d.target,
      processId: d.processId || undefined, param: (d.target === 'between_processes' ? 'inventory' : d.param) || undefined, method: (d.method || undefined) as Improvement['method'], value: d.value === '' ? undefined : Number(d.value),
      x: dialog.editing?.x ?? dialog.at?.x, y: dialog.editing?.y ?? dialog.at?.y, recId: dialog.editing?.recId };
    commit(dialog.editing ? improvements.map(i => i.id === base.id ? base : i) : [...improvements, base]);
    setDialog({ open: false, editing: null }); setAddMode(false);
  };
  const applyRec = (r: Recommendation) => commit([...improvements, { id: 'IMP' + Date.now(), title: r.title, type: r.type === 'Cycle time' ? 'Cycle Time' : 'Process', priority: r.impact, description: r.description, solution: r.suggestion, cost: 0, benefit: 0, target: 'on_process', processId: r.processId ?? undefined, ...r.fix, recId: r.id }]);
  const removeRec = (r: Recommendation) => commit(improvements.filter(i => i.recId !== r.id));
  const btn = (icon: string, label: string, onClick: () => void, opts: { on?: boolean; disabled?: boolean; text?: string } = {}) =>
    <button type="button" className={'csm-tool' + (opts.on ? ' on' : '') + (opts.text ? ' wide' : '')} aria-label={label} title={label} disabled={opts.disabled} onClick={onClick}><Icon name={icon} size={16} />{opts.text}</button>;
  const overlay = (g: MapGeo) => <g>{improvements.map((imp, n) => {
    const idx = future.findIndex(p => p.id === imp.processId);
    const x = imp.x ?? (idx >= 0 ? g.bx(idx) + g.BW - 6 + (imp.target === 'between_processes' ? 35 : 0) : g.W / 2);
    const y = imp.y ?? (g.boxY - 26 - (improvements.filter((o, j) => j < n && o.processId === imp.processId && o.x === undefined).length * 26));
    return <g key={imp.id} className={'csm-burst pri-' + imp.priority.toLowerCase()} transform={`translate(${x} ${y})`} role="button" tabIndex={0} aria-label={'Improvement ' + (n + 1) + ': ' + imp.title} onClick={e => { e.stopPropagation(); setDialog({ open: true, editing: imp }); }} onKeyDown={e => { if (e.key === 'Enter') setDialog({ open: true, editing: imp }); }}>
      <path d="M0 -15 L4 -6 L14 -9 L8 0 L14 9 L4 6 L0 15 L-4 6 L-14 9 L-8 0 L-14 -9 L-4 -6 Z" /><text y={4} textAnchor="middle">{n + 1}</text><title>{imp.title}</title>
    </g>;
  })}</g>;
  return <>
    {!full && <WorkflowProgress current={4} />}
    <div className={'csm-shell planner' + (full ? ' full' : '') + (side ? '' : ' no-side') + (showRecs && !full ? ' with-recs' : '')}>
      {side && !full && <CsmSidebar procs={future} />}
      <div className="csm-canvas">
        <div className="csm-topbar">
          {!full && <button type="button" className="csm-tool" aria-label={side ? 'Collapse sidebar' : 'Expand sidebar'} title={side ? 'Collapse sidebar' : 'Expand sidebar'} onClick={() => setSide(v => !v)}><Icon name={side ? 'ChevronLeft' : 'ChevronRight'} size={16} /></button>}
          <span className="csm-title">Future State Planner</span>
          <div className="csm-toolbar" role="toolbar" aria-label="Planner tools">
            <div className="csm-group">{btn('Undo2', 'Undo (Ctrl+Z)', undo, { disabled: !history.past.length })}{btn('Redo2', 'Redo (Ctrl+Y)', redo, { disabled: !history.future.length })}</div>
            <div className="csm-group">{btn('ZoomOut', 'Zoom out', () => setZoom(z => Math.max(0.3, +(z - 0.1).toFixed(2))))}<span className="csm-zoom mono">{Math.round(zoom * 100)}%</span>{btn('ZoomIn', 'Zoom in', () => setZoom(z => Math.min(2, +(z + 0.1).toFixed(2))))}</div>
            <div className="csm-group">{btn('Scan', 'Fit view', fit)}{btn(full ? 'Minimize2' : 'Maximize2', full ? 'Exit Full View' : 'Full View', () => setFull(f => !f), { on: full })}</div>
            <div className="csm-group">{btn('Move', 'Drag single box', () => preview('Adjust layout', 'Drag a single box to a new position.'))}{btn('Rows3', 'Drag entire lane row', () => preview('Adjust layout', 'Drag a whole lane of boxes together.'))}{btn('RotateCcw', 'Reset all positions', () => preview('Reset all positions', 'Puts every box back in its calculated place.'))}{btn('Save', 'Save layout', () => preview('Save layout', 'Saves box positions. Not saved in this preview.'))}</div>
            <div className="csm-group csm-layers-wrap">{btn('Layers', 'Map Layers', () => setLayersOpen(o => !o), { on: layersOpen })}
              {layersOpen && <div className="csm-layers" role="group" aria-label="Map Layers"><strong>Map Layers</strong>{CSM_LAYERS.map(l => <label key={l.key}><input type="checkbox" checked={layers[l.key]} onChange={() => setLayers(x => ({ ...x, [l.key]: !x[l.key] }))} />{l.label}</label>)}</div>}</div>
            <div className="csm-group">{btn('Pencil', 'Edit flow triangles', () => navigate('/vsm/processes'))}{btn('Activity', 'Edit ladder values', () => navigate('/vsm/processes'))}</div>
            <div className="csm-group">{btn(addMode ? 'X' : 'Sparkles', addMode ? 'Cancel Add Mode' : 'Improvement Point' + (improvements.length ? ' (' + improvements.length + ')' : ''), () => setAddMode(a => !a), { on: addMode, text: addMode ? 'Cancel' : 'Improvement' + (improvements.length ? ' (' + improvements.length + ')' : '') })}{btn('Workflow', 'Spaghetti Mode', () => preview('Spaghetti Mode', 'Draws the physical path material takes between processes over the map.'))}</div>
            <div className="csm-group">{btn('Sparkles', showRecs ? 'Hide recommendations' : 'Show recommendations', () => setShowRecs(v => !v), { on: showRecs })}</div>
          </div>
          {btn('Download', 'Export', () => preview('Export', 'Export the planner map with its improvement points as a PDF or an image.'))}
        </div>
        {addMode && <div className="csm-addmode"><Icon name="Sparkles" size={15} />Improvement Add Mode active — click anywhere on the map to place an Improvement Point</div>}
        <div className="csm-stage" ref={stage} tabIndex={0} role="region" aria-label="Future state planner canvas">
          <CsmMap layers={layers} fields={fields} zoom={zoom} procs={future} raw={rawDays} label="Future state planner map" addMode={addMode}
            extraRows={[['Improvements:', improvements.length + ' applied', 'cyan']]} overlay={overlay}
            onMapClick={addMode ? (x, y) => setDialog({ open: true, at: { x, y }, editing: null }) : undefined} />
        </div>
      </div>
      {showRecs && !full && <RecommendationsPanel recs={recs} applied={applied} onApply={applyRec} onRemove={removeRec} deep={deep} setDeep={setDeep} />}
    </div>
    <ImprovementDialog open={dialog.open} editing={dialog.editing} onClose={() => setDialog({ open: false, editing: null })} onSave={save}
      onDelete={dialog.editing ? () => { const id = dialog.editing!.id; commit(improvements.filter(i => i.id !== id)); setDialog({ open: false, editing: null }); } : undefined} />
    {!full && <div className="vsm-setup-footer">
      <PillButton icon="ArrowLeft" to="/vsm/current">Previous</PillButton>
      <PillButton variant="dark" icon="ArrowRight" to="/vsm/future">Generate FSM</PillButton>
    </div>}
  </>;
}

/* ── 05 FSM Map: the live app's Future State Map — the planned map, its improvement points and their status ── */
const IMP_STATUSES = ['Open', 'In Progress', 'Implemented'];
function ImprovementDetail({ imp, index, onClose }: { imp: Improvement | null; index: number; onClose: () => void }) {
  const { setImprovements, processes } = useContext(VsmCtx);
  const navigate = useNavigate();
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => { if (imp) ref.current?.showModal(); else ref.current?.close(); }, [imp]);
  const status = imp?.status || 'Open';
  const target = IMP_TARGET_TYPES.find(t => t.key === imp?.target)?.label;
  const proc = processes.find(p => p.id === imp?.processId)?.name;
  const field = imp?.param === 'inventory' ? INV_FIELD : IMP_FIELDS.find(f => f.key === imp?.param);
  const method = field?.methods.find(m => m.key === imp?.method)?.label;
  return <dialog ref={ref} className="preview-dialog vsm-imp-dialog" onCancel={e => { e.preventDefault(); onClose(); }}>
    {imp && <>
      <div className="dialog-header"><span className="vsm-imp-dot" /><h2>Improvement Point {index + 1}</h2><button type="button" className="circle-button" aria-label="Close" onClick={onClose}><Icon name="X" /></button></div>
      <div className="vsm-imp-view">
        <h3>{imp.title}</h3>
        <div className="vsm-imp-tags"><span className="t-type">{imp.type}</span><span className={'t-pri ' + imp.priority.toLowerCase()}>{imp.priority} Priority</span><span className={'t-status s-' + status.toLowerCase().replace(' ', '-')}>{status}</span></div>
        <dl>{target && <div><dt>Target</dt><dd>{target}{proc ? ' · ' + proc : ''}</dd></div>}{field && method && <div><dt>Change</dt><dd>{field.label}: {method} {imp.value}{field.unit && ' ' + field.unit}</dd></div>}
          {(imp.cost > 0 || imp.benefit > 0) && <div><dt>Cost / Benefit</dt><dd>₹{imp.cost.toLocaleString('en-IN')} / ₹{imp.benefit.toLocaleString('en-IN')}</dd></div>}</dl>
        {imp.description && <div><span className="vsm-label">Description</span><p>{imp.description}</p></div>}
        {imp.solution && <div><span className="vsm-label">Proposed Solution</span><p>{imp.solution}</p></div>}
        <div><span className="vsm-label">Change Status</span><div className="vsm-status-row">{IMP_STATUSES.map(s => <button key={s} type="button" aria-pressed={status === s} className={status === s ? 'on s-' + s.toLowerCase().replace(' ', '-') : ''} onClick={() => setImprovements(list => list.map(i => i.id === imp.id ? { ...i, status: s } : i))}>{s}</button>)}</div></div>
      </div>
      <div className="vsm-imp-actions">
        <PillButton small icon="Trash2" onClick={() => { setImprovements(list => list.filter(i => i.id !== imp.id)); onClose(); }}>Delete</PillButton>
        <PillButton small icon="Pencil" onClick={() => { onClose(); navigate('/vsm/planner'); }}>Edit in planner</PillButton>
        <PillButton small variant="dark" onClick={onClose}>Done</PillButton>
      </div>
    </>}
  </dialog>;
}

function FutureView() {
  const { processes, rawDays, builder, improvements } = useContext(VsmCtx);
  const preview = usePreview();
  const [zoom, setZoom] = useState(1);
  const [full, setFull] = useState(false);
  const [side, setSide] = useState(true);
  const [open, setOpen] = useState<string | null>(null);
  const stage = useRef<HTMLDivElement>(null);
  const future = applyImprovements(processes, improvements);
  const fields = builder.boxMode === 'default' ? CSM_DEFAULT_ROWS : builder.boxFields;
  const fit = () => { const el = stage.current; const svg = el?.querySelector('svg'); if (el && svg) setZoom(Math.max(0.3, Math.min(2, Math.floor((el.clientWidth - 24) / Number(svg.getAttribute('data-w')) * 100) / 100))); };
  useEffect(() => { fit(); }, [full, side]);
  useEffect(() => { if (!full) return; const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') setFull(false); }; addEventListener('keydown', esc); return () => removeEventListener('keydown', esc); }, [full]);
  const btn = (icon: string, label: string, onClick: () => void, on = false) => <button type="button" className={'csm-tool' + (on ? ' on' : '')} aria-label={label} title={label} onClick={onClick}><Icon name={icon} size={16} /></button>;
  const openIdx = improvements.findIndex(i => i.id === open);
  const overlay = (g: MapGeo) => <g>{improvements.map((imp, n) => {
    const idx = future.findIndex(p => p.id === imp.processId);
    const x = imp.x ?? (idx >= 0 ? g.bx(idx) + g.BW - 6 + (imp.target === 'between_processes' ? 35 : 0) : g.W / 2);
    const y = imp.y ?? (g.boxY - 26 - (improvements.filter((o, j) => j < n && o.processId === imp.processId && o.x === undefined).length * 26));
    const st = (imp.status || 'Open').toLowerCase().replace(' ', '-');
    return <g key={imp.id} className={'csm-burst pri-' + imp.priority.toLowerCase() + ' st-' + st} transform={`translate(${x} ${y})`} role="button" tabIndex={0} aria-label={'Improvement ' + (n + 1) + ': ' + imp.title} onClick={() => setOpen(imp.id)} onKeyDown={e => { if (e.key === 'Enter') setOpen(imp.id); }}>
      <path d="M0 -15 L4 -6 L14 -9 L8 0 L14 9 L4 6 L0 15 L-4 6 L-14 9 L-8 0 L-14 -9 L-4 -6 Z" /><text y={4} textAnchor="middle">{st === 'implemented' ? '✓' : n + 1}</text><title>{imp.title + ' — ' + (imp.status || 'Open')}</title>
    </g>;
  })}</g>;
  const done = improvements.filter(i => i.status === 'Implemented').length;
  return <>
    {!full && <WorkflowProgress current={5} />}
    <div className={'csm-shell' + (full ? ' full' : '') + (side ? '' : ' no-side')}>
      {side && !full && <CsmSidebar procs={future} />}
      <div className="csm-canvas">
        <div className="csm-topbar">
          {!full && <button type="button" className="csm-tool" aria-label={side ? 'Collapse sidebar' : 'Expand sidebar'} title={side ? 'Collapse sidebar' : 'Expand sidebar'} onClick={() => setSide(v => !v)}><Icon name={side ? 'ChevronLeft' : 'ChevronRight'} size={16} /></button>}
          <span className="csm-title">Future State Map</span>
          <div className="csm-toolbar" role="toolbar" aria-label="Map tools">
            <div className="csm-group">{btn('ZoomOut', 'Zoom out', () => setZoom(z => Math.max(0.3, +(z - 0.1).toFixed(2))))}<span className="csm-zoom mono">{Math.round(zoom * 100)}%</span>{btn('ZoomIn', 'Zoom in', () => setZoom(z => Math.min(2, +(z + 0.1).toFixed(2))))}</div>
            <div className="csm-group">{btn('Scan', 'Fit view', fit)}{btn(full ? 'Minimize2' : 'Maximize2', full ? 'Exit Full View' : 'Full View', () => setFull(f => !f), full)}</div>
          </div>
          {btn('Download', 'Export', () => preview('Export', 'Export the future state map as a PDF (with page preview) or as an image.'))}
        </div>
        {improvements.length === 0 && <div className="csm-addmode empty"><Icon name="CircleAlert" size={15} />No improvement points yet — this is the current state. Add them in the FSM Planner.<Link to="/vsm/planner">Open planner</Link></div>}
        <div className="csm-stage" ref={stage} tabIndex={0} role="region" aria-label="Future state map canvas">
          <CsmMap layers={{ pc: true, ends: true, info: true, schedule: true, boxes: true, ladder: true, summary: true }} fields={fields} zoom={zoom} procs={future} raw={rawDays} label="Future state value stream map"
            extraRows={[['Improvements:', improvements.length + ' (' + done + ' done)', 'cyan']]} overlay={overlay} />
        </div>
      </div>
    </div>
    <ImprovementDetail imp={improvements.find(i => i.id === open) ?? null} index={openIdx} onClose={() => setOpen(null)} />
    {!full && <div className="vsm-setup-footer">
      <PillButton icon="ArrowLeft" to="/vsm/planner">Previous</PillButton>
      <PillButton variant="dark" icon="TrendingUp" to="/vsm/analytics">Analytics &amp; Report</PillButton>
    </div>}
  </>;
}

function AnalyticsView() {
  const { processes, rawDays } = useContext(VsmCtx);
  const { current, future, taktValue } = useMaps();
  const rows: { label: string; cur: number; fut: number; fmt: (v: number) => string; better: 'lower' | 'higher' }[] = [
    { label: 'Lead time', cur: current.leadTimeDays, fut: future.leadTimeDays, fmt: v => v + ' days', better: 'lower' },
    { label: 'Value-added time', cur: current.vaSeconds, fut: future.vaSeconds, fmt: v => v + ' s', better: 'lower' },
    { label: 'Process cycle efficiency', cur: current.pce ?? 0, fut: future.pce ?? 0, fmt: v => formatPce(v), better: 'higher' },
    { label: 'WIP between steps', cur: current.wipDays, fut: future.wipDays, fmt: v => v + ' days', better: 'lower' },
    { label: 'Operators', cur: current.operators, fut: future.operators, fmt: v => String(v), better: 'lower' },
    { label: 'Process steps', cur: current.steps, fut: future.steps, fmt: v => String(v), better: 'lower' },
  ];
  const buffers = (list: VsmProcess[], raw: number, rawLabel: string) => [{ label: rawLabel, days: raw }, ...list.map((p, i) => ({ label: i === list.length - 1 ? 'Finished goods' : 'After ' + p.name, days: p.inventoryAfter }))];
  const curBuffers = buffers(processes, rawDays, 'Raw material');
  const futBuffers = buffers(futureProcesses, futureRawMaterialDays, 'Raw material');
  const maxLt = Math.max(current.leadTimeDays, future.leadTimeDays);
  return <>
    <section className="vsm-kpi-grid" aria-label="Current against future state">{rows.map(r => {
      const change = pctChange(r.cur, r.fut);
      const good = r.better === 'lower' ? change <= 0 : change >= 0;
      return <div key={r.label} className="vsm-kpi"><span className="muted">{r.label}</span><div className="vsm-kpi-values"><span className="mono muted">{r.fmt(r.cur)}</span><Icon name="ArrowRight" size={14} /><strong>{r.fmt(r.fut)}</strong></div><span className={'vsm-change ' + (good ? 'good' : 'bad')}>{change > 0 ? '+' : ''}{change}%</span></div>;
    })}</section>
    <div className="vsm-two-col">
      <Panel title="Where the lead time sits" subtitle="Days of stock in each buffer, current against future">
        {[['Current state', curBuffers, current.leadTimeDays], ['Future state', futBuffers, future.leadTimeDays]].map(([label, list, total]) =>
          <div key={label as string} className="vsm-composition"><div className="between"><span>{label as string}</span><span className="mono">{total as number} days</span></div>
            <div className="vsm-stack-bar" style={{ width: (total as number) / maxLt * 100 + '%' }}>{(list as { label: string; days: number }[]).filter(b => b.days > 0).map((b, i) => <span key={b.label} title={b.label + ': ' + b.days + ' days'} className={'seg-' + (i % 6)} style={{ flexGrow: b.days }} />)}</div>
          </div>)}
        <div className="vsm-composition-key">{curBuffers.filter(b => b.days > 0).map((b, i) => <span key={b.label}><i className={'seg-' + (i % 6)} />{b.label} · {b.days} d</span>)}</div>
      </Panel>
      <Panel title="Station balance" subtitle={'Cycle time per station against takt ' + (taktValue ?? '—') + ' s'}>
        <div className="vsm-balance">{[['Current', processes], ['Future', futureProcesses]].map(([label, list]) => <div key={label as string}><span className="muted">{label as string}</span><CycleChart processes={list as VsmProcess[]} takt={taktValue} /></div>)}</div>
      </Panel>
    </div>
  </>;
}

export default function ValueStreamMapping() {
  const location = useLocation();
  const preview = usePreview();
  const subPath = location.pathname.replace('/vsm', '') || '/';
  const active = vsmNavigation.find(n => n.path === location.pathname) || vsmNavigation[0];
  const isOverview = subPath === '/';
  const isList = isOverview || subPath === '/streams';
  const isSetup = subPath === '/setup' || subPath === '/processes' || subPath === '/current' || subPath === '/planner' || subPath === '/future';
  const { setup } = useContext(VsmCtx);
  return <>
    <PageHeading title={isOverview ? 'Value Stream Mapping' : subPath === '/setup' ? 'Configure Value Stream & Demand' : subPath === '/processes' ? 'Process Sequence Builder' : subPath === '/planner' ? 'Future State Planner' : subPath === '/future' ? 'Future State Map' : active.label} description={vsmDescriptions[location.pathname] || vsmDescriptions['/vsm']}>
      {isOverview && <PillButton variant="blue" icon="Plus" to="/vsm/setup">New value stream</PillButton>}
    </PageHeading>
    {!isList && !isSetup && <ModuleContext org="Sahyadri Auto Components Pvt. Ltd." name={setup.basics.name + ' · ' + setup.basics.productLine} site={setup.basics.facility} label="Sample value stream" />}
    {isOverview && <VsmDashboard />}
    {subPath === '/streams' && <StreamsView />}
    {subPath === '/setup' && <SetupView />}
    {subPath === '/processes' && <ProcessView />}
    {subPath === '/current' && <CurrentView />}
    {subPath === '/planner' && <PlannerView />}
    {subPath === '/future' && <FutureView />}
    {subPath === '/analytics' && <AnalyticsView />}
    {!isSetup && <StepFooter nav={vsmNavigation} pathname={location.pathname} label="Value stream mapping steps" />}
  </>;
}
