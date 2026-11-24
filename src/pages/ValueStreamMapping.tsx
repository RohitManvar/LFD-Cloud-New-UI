import { createContext, useContext, useState, type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { vsmDescriptions, vsmNavigation } from '../data/mock';
import {
  KAIZEN_STATUS, availableSeconds, currentProcesses, currentRawMaterialDays, dailyDemand, formatPce, futureProcesses, futureRawMaterialDays,
  mapMetrics, pctChange, taktSeconds, vsmContext, vsmKaizens, vsmTakt,
  type Kaizen, type KaizenStatus, type TaktInputs, type VsmProcess,
} from '../data/vsmModel';
import Icon from '../components/Icon';
import { PageHeading, Panel, PillButton, StatCard } from '../components/UI';
import { usePreview } from '../components/PreviewDialog';
import { DistributionBars, FocusList, HeroMark, ModuleContext, NextStep, Readiness, ResultCard, StepFooter, type ChipTone } from '../components/ModulePattern';

interface VsmContextType {
  takt: TaktInputs; setTakt: React.Dispatch<React.SetStateAction<TaktInputs>>;
  processes: VsmProcess[]; setProcesses: React.Dispatch<React.SetStateAction<VsmProcess[]>>;
  rawDays: number; setRawDays: React.Dispatch<React.SetStateAction<number>>;
  kaizens: Kaizen[]; setKaizens: React.Dispatch<React.SetStateAction<Kaizen[]>>;
}
const VsmCtx = createContext<VsmContextType>({
  takt: vsmTakt, setTakt: () => {}, processes: currentProcesses, setProcesses: () => {},
  rawDays: currentRawMaterialDays, setRawDays: () => {}, kaizens: vsmKaizens, setKaizens: () => {},
});
export function VSMProvider({ children }: { children: ReactNode }) {
  const [takt, setTakt] = useState(vsmTakt);
  const [processes, setProcesses] = useState(currentProcesses);
  const [rawDays, setRawDays] = useState(currentRawMaterialDays);
  const [kaizens, setKaizens] = useState(vsmKaizens);
  return <VsmCtx.Provider value={{ takt, setTakt, processes, setProcesses, rawDays, setRawDays, kaizens, setKaizens }}>{children}</VsmCtx.Provider>;
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
  const m = mapMetrics(processes, rawDays, vsmTakt);
  const ladderY = 318;
  return <svg className="vsm-svg" viewBox={`0 0 ${W} 400`} role="img" aria-label={(future ? 'Future' : 'Current') + ' state value stream map'} style={{ minWidth: Math.min(W, 1100) }}>
    <defs>
      <marker id={'arrow-' + (future ? 'f' : 'c')} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 Z" className="vsm-arrowhead" /></marker>
      <pattern id="push-stripes" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="4" height="8" className="vsm-stripe" /></pattern>
    </defs>
    {/* top row: supplier, production control, customer and the information flow */}
    <Factory x={20} y={14} label={vsmContext.supplierShort} sub={future ? 'Daily milk run' : vsmContext.supplierShipping} />
    <Factory x={W - 130} y={14} label={vsmContext.customerShort} sub={vsmContext.customerShipping} />
    <g>
      <rect className="vsm-box" x={W / 2 - 110} y={18} width={220} height={52} rx={4} />
      <text x={W / 2} y={40} className="vsm-text strong" textAnchor="middle">Production Control</text>
      <text x={W / 2} y={58} className="vsm-text muted" textAnchor="middle">{future ? 'Heijunka at the pacemaker' : vsmContext.control}</text>
    </g>
    <line className="vsm-info" x1={W / 2 - 110} y1={44} x2={136} y2={44} markerEnd={`url(#arrow-${future ? 'f' : 'c'})`} />
    <text x={(W / 2 - 110 + 136) / 2} y={38} className="vsm-text muted" textAnchor="middle">{future ? 'Kanban signals' : 'Weekly forecast'}</text>
    <line className="vsm-info" x1={W - 136} y1={44} x2={W / 2 + 110} y2={44} markerEnd={`url(#arrow-${future ? 'f' : 'c'})`} />
    <text x={(W - 136 + W / 2 + 110) / 2} y={38} className="vsm-text muted" textAnchor="middle">Daily orders</text>
    {future
      ? <line className="vsm-info" x1={W / 2} y1={70} x2={boxX(processes.findIndex(p => p.pacemaker)) + BOX_W / 2} y2={150} markerEnd="url(#arrow-f)" />
      : processes.map((p, i) => <line key={p.id} className="vsm-info faint" x1={W / 2} y1={70} x2={boxX(i) + BOX_W / 2} y2={150} />)}
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
        {[['C/T', p.cycleTime + ' s'], ['C/O', p.changeover + ' min'], ['Uptime', p.uptime + '%'], ['Operators', String(p.operators)]].map(([k, v], r) =>
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

function VsmOverview() {
  const { kaizens } = useContext(VsmCtx);
  const { current, future, taktValue } = useMaps();
  const ltChange = pctChange(current.leadTimeDays, future.leadTimeDays);
  const { processes } = useContext(VsmCtx);
  const counts = KAIZEN_STATUS.map(s => ({ ...s, n: kaizens.filter(k => k.status === s.key).length }));
  const max = Math.max(current.leadTimeDays, future.leadTimeDays);
  const load = (p: VsmProcess) => taktValue ? Math.round(p.cycleTime / taktValue * 100) : 0;
  const focus = [...processes].sort((a, b) => b.cycleTime - a.cycleTime).slice(0, 4).map(p => {
    const l = load(p);
    return { key: p.id, title: p.name, meta: 'C/T ' + p.cycleTime + ' s · C/O ' + p.changeover + ' min · uptime ' + p.uptime + '%', value: l + '%', chip: { tone: (l > 100 ? 'critical' : l >= 90 ? 'high' : 'low') as ChipTone, label: l > 100 ? 'Over takt' : l >= 90 ? 'Near takt' : 'Keeps up' }, to: '/vsm/processes' };
  });
  const notStarted = kaizens.filter(k => k.status === 'planned').length;
  const nextStep = current.overTakt.length ? current.overTakt.map(p => p.name).join(' and ') + ' cannot keep up with takt — start its kaizens before redrawing the future state.' : 'Every process keeps up with takt — move on to the future state.';
  return <>
    <section className="stats-grid" aria-label="Value stream summary">
      <StatCard label="Lead time, future state" value={future.leadTimeDays} suffix=" days" subline={'From ' + current.leadTimeDays + ' days today (' + ltChange + '%)'} icon="Clock" dark to="/vsm/analytics" />
      <StatCard label="Takt time" value={taktValue ?? '—'} suffix=" s" subline={dailyDemand(vsmTakt).toLocaleString('en-IN') + ' units/day · ' + vsmTakt.shifts + ' shifts'} icon="Activity" to="/vsm/setup" />
      <StatCard label="Process cycle efficiency" value={formatPce(future.pce)} subline={'From ' + formatPce(current.pce) + ' today'} icon="TrendingUp" to="/vsm/analytics" />
      <StatCard label="Bottleneck" value={current.bottleneck.cycleTime} suffix=" s" subline={current.bottleneck.name + ' · takt ' + (taktValue ?? '—') + ' s'} icon="CircleAlert" hatched to="/vsm/processes" />
    </section>
    <div className="mod-overview-grid">
      <Panel title="Where to focus" subtitle={'Busiest processes against takt ' + (taktValue ?? '—') + ' s'} action={<PillButton small to="/vsm/processes">View all<Icon name="ArrowUpRight" size={14} /></PillButton>}>
        <FocusList items={focus} />
        <NextStep>{nextStep}</NextStep>
      </Panel>
      <Panel title="Lead time" subtitle="Raw material in to finished goods out">
        <div className="vsm-compare-bars">{[['Current state', current.leadTimeDays, 'current'], ['Future state', future.leadTimeDays, 'future']].map(([label, v, cls]) =>
          <div key={label as string}><div className="between"><span>{label}</span><span className="mono">{v} days</span></div><div className="vsm-bar-track"><span className={'vsm-bar ' + cls} style={{ width: (v as number) / max * 100 + '%' }} /></div></div>)}</div>
        <MapStats m={current} />
      </Panel>
    </div>
    <div className="mod-bottom-grid">
      <Panel title="Kaizen bursts" subtitle={kaizens.length + ' improvements behind the future state'}><DistributionBars rows={counts.map(c => ({ label: c.label, value: c.n }))} /></Panel>
      <Panel title="Ready for the future state?" subtitle="A few details make the next review easier"><Readiness items={[
        { icon: 'CircleAlert', title: current.overTakt.length + ' processes over takt', detail: current.overTakt.length ? 'Bring them under ' + (taktValue ?? '—') + ' s before the map is final.' : 'Every station keeps up with the customer.', to: '/vsm/processes' },
        { icon: 'Sparkles', title: notStarted + ' kaizens not started', detail: 'Give each burst an owner and a date.', to: '/vsm/future' },
        { icon: 'Clock', title: 'Takt set from demand: ' + (taktValue ?? '—') + ' s', detail: dailyDemand(vsmTakt).toLocaleString('en-IN') + ' units/day over ' + vsmTakt.shifts + ' shifts.', to: '/vsm/setup' },
      ]} /></Panel>
      <ResultCard icon="TrendingUp" label="Lead time reduction" value={Math.abs(ltChange)} suffix="%" detail={current.leadTimeDays + ' → ' + future.leadTimeDays + ' days once the future state holds. Projected, subject to the kaizens landing.'} cta={{ label: 'Review analytics', to: '/vsm/analytics' }} />
    </div>
  </>;
}

function NumberField({ label, value, onChange, suffix, step = 1 }: { label: string; value: number; onChange: (v: number) => void; suffix?: string; step?: number }) {
  return <label className="vsm-field"><span>{label}</span><div><input type="number" min={0} step={step} value={value} onChange={e => onChange(Math.max(0, Number(e.target.value) || 0))} />{suffix && <em>{suffix}</em>}</div></label>;
}

function SetupView() {
  const { takt, setTakt } = useContext(VsmCtx);
  const set = (key: keyof TaktInputs) => (v: number) => setTakt(t => ({ ...t, [key]: v }));
  const value = taktSeconds(takt);
  const perShift = takt.shiftMinutes - takt.lunchMinutes - takt.teaBreaks * takt.teaMinutes;
  return <div className="vsm-two-col">
    <Panel title="Customer demand" subtitle="What the plant has to ship, and the time it has to ship it in">
      <div className="vsm-fields">
        <NumberField label="Monthly demand" value={takt.monthlyDemand} onChange={set('monthlyDemand')} suffix="units" step={100} />
        <NumberField label="Working days / month" value={takt.workingDays} onChange={set('workingDays')} suffix="days" />
        <NumberField label="Shifts / day" value={takt.shifts} onChange={set('shifts')} />
        <NumberField label="Shift length" value={takt.shiftMinutes} onChange={set('shiftMinutes')} suffix="min" step={15} />
        <NumberField label="Lunch break" value={takt.lunchMinutes} onChange={set('lunchMinutes')} suffix="min" />
        <NumberField label="Tea breaks / shift" value={takt.teaBreaks} onChange={set('teaBreaks')} />
        <NumberField label="Tea break length" value={takt.teaMinutes} onChange={set('teaMinutes')} suffix="min" />
      </div>
    </Panel>
    <div className="vsm-stack">
      <Panel title="Takt time" subtitle="Available seconds per day ÷ daily demand">
        <div className="vsm-takt"><strong>{value ?? '—'}</strong><span>seconds per unit</span></div>
        <div className="vsm-takt-sum">
          <div><span className="muted">Net time / shift</span><strong className="mono">{perShift} min</strong></div>
          <div><span className="muted">Available / day</span><strong className="mono">{availableSeconds(takt).toLocaleString('en-IN')} s</strong></div>
          <div><span className="muted">Daily demand</span><strong className="mono">{dailyDemand(takt).toLocaleString('en-IN')}</strong></div>
        </div>
      </Panel>
      <Panel title="Supply chain ends" subtitle={vsmContext.family}>
        <dl className="vsm-facts">{[['Customer', vsmContext.customer], ['Shipping', vsmContext.customerShipping], ['Supplier', vsmContext.supplier], ['Receiving', vsmContext.supplierShipping], ['Scheduling', vsmContext.control]].map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
      </Panel>
    </div>
  </div>;
}

function CycleChart({ processes, takt }: { processes: VsmProcess[]; takt: number | null }) {
  const scale = Math.max(takt ?? 0, ...processes.map(p => p.cycleTime)) * 1.15;
  return <div className="vsm-cycle-chart">
    {processes.map(p => { const over = takt !== null && p.cycleTime > takt; return <div key={p.id} className="vsm-cycle-row">
      <span className="vsm-cycle-name">{p.name}</span>
      <div className="vsm-cycle-track"><span className={'vsm-cycle-bar' + (over ? ' over' : '')} style={{ width: p.cycleTime / scale * 100 + '%' }} />{takt !== null && <i className="vsm-takt-line" style={{ left: takt / scale * 100 + '%' }} />}</div>
      <span className={'mono' + (over ? ' vsm-danger' : '')}>{p.cycleTime} s</span>
    </div>; })}
    {takt !== null && <p className="vsm-cycle-foot muted"><i className="vsm-takt-swatch" />Takt {takt} s — anything to the right of the line cannot keep up with the customer.</p>}
  </div>;
}

function ProcessView() {
  const { processes, setProcesses, rawDays, setRawDays, takt } = useContext(VsmCtx);
  const preview = usePreview();
  const taktValue = taktSeconds(takt);
  const m = mapMetrics(processes, rawDays, takt);
  const update = (id: string, key: keyof VsmProcess, v: number) => setProcesses(list => list.map(p => p.id === id ? { ...p, [key]: v } : p));
  return <>
    <Panel title="Process boxes" subtitle={'One row per data box on the map · raw material ' + rawDays + ' days before the first step'} action={<div className="inline"><PillButton small icon="Upload" onClick={() => preview('Import process data', 'Upload a time study or standard work sheet (.xlsx / .csv); columns are matched to C/T, C/O, uptime and operators.')}>Import Excel</PillButton><PillButton small variant="dark" icon="Plus" onClick={() => preview('Add process', 'Insert a work centre into the stream.')}>Add process</PillButton></div>}>
      <div className="table-scroll" tabIndex={0} role="region" aria-label="Process data"><table className="vsm-table">
        <thead><tr><th>#</th><th>Process</th><th>C/T (s)</th><th>C/O (min)</th><th>Uptime (%)</th><th>Operators</th><th>WIP after (days)</th></tr></thead>
        <tbody>
          <tr className="vsm-raw"><td className="mono">RM</td><th scope="row">Raw material<small>{vsmContext.supplier}</small></th><td colSpan={4} className="muted">Stock before the first process</td><td><input type="number" min={0} step={0.1} aria-label="Raw material days" value={rawDays} onChange={e => setRawDays(Math.max(0, Number(e.target.value) || 0))} /></td></tr>
          {processes.map((p, i) => { const over = taktValue !== null && p.cycleTime > taktValue; return <tr key={p.id} className={over ? 'over' : ''}>
            <td className="mono">{String(i + 1).padStart(2, '0')}</td>
            <th scope="row">{p.name}{over && <small className="vsm-danger">Over takt by {Math.round((p.cycleTime - taktValue) * 10) / 10} s</small>}</th>
            {(['cycleTime', 'changeover', 'uptime', 'operators', 'inventoryAfter'] as const).map(key => <td key={key}><input type="number" min={0} step={key === 'inventoryAfter' ? 0.1 : 1} aria-label={p.name + ' ' + key} value={p[key]} onChange={e => update(p.id, key, Math.max(0, Number(e.target.value) || 0))} /></td>)}
          </tr>; })}
        </tbody>
      </table></div>
    </Panel>
    <Panel title="Cycle time against takt" subtitle={m.overTakt.length ? m.overTakt.map(p => p.name).join(', ') + ' cannot keep up — the bottleneck is ' + m.bottleneck.name : 'Every process keeps up with the customer'}>
      <CycleChart processes={processes} takt={taktValue} />
    </Panel>
  </>;
}

function MapStats({ m }: { m: ReturnType<typeof mapMetrics> }) {
  return <div className="vsm-map-stats">{[['Lead time', m.leadTimeDays + ' days'], ['Value-added time', m.vaSeconds + ' s'], ['PCE', formatPce(m.pce)], ['WIP between steps', m.wipDays + ' days'], ['Operators', String(m.operators)]].map(([k, v]) => <div key={k}><span className="muted">{k}</span><strong>{v}</strong></div>)}</div>;
}

function CurrentView() {
  const { processes, rawDays } = useContext(VsmCtx);
  const { current, taktValue } = useMaps();
  const preview = usePreview();
  return <Panel title="Current state map" subtitle={vsmContext.family + ' · as walked on the floor'} action={<div className="inline"><PillButton small icon="Download" onClick={() => preview('Export current state', 'High-resolution SVG, a 16:9 presentation PDF and the Excel metrics.')}>Export</PillButton><PillButton small variant="dark" to="/vsm/future" icon="ArrowRight">Future state</PillButton></div>}>
    <MapStats m={current} />
    <div className="table-scroll vsm-map-scroll" tabIndex={0} role="region" aria-label="Current state map"><VsmMap processes={processes} rawDays={rawDays} takt={taktValue} /></div>
    <MapLegend />
  </Panel>;
}

function FutureView() {
  const { kaizens, setKaizens } = useContext(VsmCtx);
  const { future, current, taktValue } = useMaps();
  const preview = usePreview();
  const setStatus = (id: string, status: KaizenStatus) => setKaizens(list => list.map(k => k.id === id ? { ...k, status } : k));
  return <>
    <Panel title="Future state map" subtitle={'Pull, flow and a single scheduling point · lead time ' + current.leadTimeDays + ' → ' + future.leadTimeDays + ' days'} action={<PillButton small icon="Download" onClick={() => preview('Export future state', 'Before / after slides for the steering committee.')}>Export</PillButton>}>
      <MapStats m={future} />
      <div className="table-scroll vsm-map-scroll" tabIndex={0} role="region" aria-label="Future state map"><VsmMap processes={futureProcesses} rawDays={futureRawMaterialDays} takt={taktValue} future /></div>
      <MapLegend future />
    </Panel>
    <Panel title="Kaizen bursts" subtitle="What has to change on the floor for the future map to be true" action={<PillButton small icon="Sparkles" onClick={() => preview('AI improvement suggestions', 'Context-aware suggestions from the current map: the wastes it sees and where a burst would pay back first.')}>Suggest more</PillButton>}>
      <div className="table-scroll" tabIndex={0} role="region" aria-label="Kaizen bursts"><table className="vsm-table kaizens">
        <thead><tr><th>ID</th><th>Kaizen</th><th>Waste</th><th>Impact</th><th>Status</th></tr></thead>
        <tbody>{kaizens.map(k => <tr key={k.id}>
          <td><span className="vsm-burst-chip">{k.id}</span></td>
          <th scope="row">{k.title}<small>{k.station}</small></th>
          <td>{k.waste}</td><td>{k.impact}</td>
          <td><select className={'vsm-status ' + k.status} aria-label={'Status of ' + k.title} value={k.status} onChange={e => setStatus(k.id, e.target.value as KaizenStatus)}>{KAIZEN_STATUS.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}</select></td>
        </tr>)}</tbody>
      </table></div>
    </Panel>
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
  return <>
    <PageHeading title={isOverview ? 'Value Stream Mapping' : active.label} description={vsmDescriptions[location.pathname] || vsmDescriptions['/vsm']}
      actions={isOverview ? <><PillButton variant="blue" icon="Workflow" to="/vsm/current">Open current map</PillButton><PillButton icon="Sparkles" onClick={() => preview('Feature walkthrough', 'A guided tour: takt sizing, process builder, current state canvas, future state planner, future state canvas and analytics.')}>Walkthrough</PillButton></> : undefined}>
      {isOverview && <HeroMark icon="Workflow" step="04" />}
    </PageHeading>
    <ModuleContext org="Sahyadri Auto Components Pvt. Ltd." name={vsmContext.family} site="Chakan MIDC, Pune" label="Sample value stream" />
    {isOverview && <VsmOverview />}
    {subPath === '/setup' && <SetupView />}
    {subPath === '/processes' && <ProcessView />}
    {subPath === '/current' && <CurrentView />}
    {subPath === '/future' && <FutureView />}
    {subPath === '/analytics' && <AnalyticsView />}
    <StepFooter nav={vsmNavigation} pathname={location.pathname} label="Value stream mapping steps" />
  </>;
}
