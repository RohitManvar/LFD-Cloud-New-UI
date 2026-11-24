import { createContext, useContext, useState, type CSSProperties, type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { flowDescriptions, flowNavigation } from '../data/mock';
import {
  STREAM_COLOURS, flowFindings, flowMoves, flowStreams, flowStudy, fmtPct, fmtTonM, isShared, rateMove, rateMoves, rateStream, sharedOperations,
  type FlowMove, type FlowStep, type FlowStream,
} from '../data/flowModel';
import Icon from '../components/Icon';
import { PageHeading, Panel, PillButton, StatCard } from '../components/UI';
import { usePreview } from '../components/PreviewDialog';
import { DistributionBars, FocusList, HeroMark, ModuleContext, NextStep, Readiness, ResultCard, StepFooter, type ChipTone } from '../components/ModulePattern';

interface FlowContextType {
  streams: FlowStream[]; setStreams: React.Dispatch<React.SetStateAction<FlowStream[]>>;
  moves: FlowMove[]; setMoves: React.Dispatch<React.SetStateAction<FlowMove[]>>;
}
const FlowCtx = createContext<FlowContextType>({ streams: flowStreams, setStreams: () => {}, moves: flowMoves, setMoves: () => {} });
export function FlowProvider({ children }: { children: ReactNode }) {
  const [streams, setStreams] = useState(flowStreams);
  const [moves, setMoves] = useState(flowMoves);
  return <FlowCtx.Provider value={{ streams, setStreams, moves, setMoves }}>{children}</FlowCtx.Provider>;
}

const streamStyle = (s: FlowStream) => { const c = STREAM_COLOURS[s.colour]; return { '--stream-fill': c.fill, '--stream-edge': c.edge, '--stream-ink': c.ink } as CSSProperties; };
function ResourceBadge({ step }: { step: FlowStep }) {
  if (step.resource === 'machine') return <span className="flow-badge" title={step.count + ' machines'}>{step.count}</span>;
  if (step.resource === 'manual') return <span className="flow-badge manual" title="Manual station">M</span>;
  return <span className="flow-badge none" title="Store / marker">—</span>;
}
function FindingList({ findings }: { findings: ReturnType<typeof flowFindings> }) {
  return <div className="flow-findings">{findings.map(f => <div key={f.title} className={'flow-finding ' + f.tone}><Icon name={f.tone === 'info' ? 'CheckCircle2' : 'CircleAlert'} size={18} /><div><h3>{f.title}</h3><p className="muted">{f.detail}</p></div></div>)}</div>;
}

function FlowOverview() {
  const { streams, moves } = useContext(FlowCtx);
  const rated = streams.map(rateStream);
  const shared = sharedOperations(streams);
  const index = rateMoves(moves, flowStudy.daysPerMonth);
  const longest = rated.reduce((a, r) => r.distance > a.distance ? r : a, rated[0]);
  const focus = [...index.rated].sort((a, b) => b.asIs - a.asIs).slice(0, 4).map(r => ({
    key: r.move.id, title: r.move.material, meta: r.move.from + ' → ' + r.move.to + ' · ' + r.move.asIs + (r.move.toBe === null ? ' m' : ' → ' + r.move.toBe + ' m'),
    value: Math.round(r.asIs).toLocaleString('en-IN'),
    chip: r.savingPct === null ? { tone: 'high' as ChipTone, label: 'No route' } : { tone: 'good' as ChipTone, label: '−' + fmtPct(r.savingPct) },
    to: '/flow-management/transport',
  }));
  const worstShare = index.asIs ? Math.round(index.worst.asIs / index.asIs * 100) : 0;
  const unrouted = index.rated.filter(r => r.toBe === null).length;
  return <>
    <section className="stats-grid" aria-label="Flow summary">
      <StatCard label="Transportation index, to-be" value={Math.round(index.toBe).toLocaleString('en-IN')} suffix=" ton·m" subline={'From ' + fmtTonM(index.asIs) + ' (−' + fmtPct(index.savingPct) + ')'} icon="Truck" dark to="/flow-management/transport" />
      <StatCard label="Product streams" value={streams.length} subline={rated.reduce((a, r) => a + r.machines, 0) + ' machines · ' + rated.reduce((a, r) => a + r.manualStations, 0) + ' manual stations'} icon="Layers" to="/flow-management/streams" />
      <StatCard label="Shared operations" value={shared.length} subline={shared[0] ? shared[0].label + ' carries ' + shared[0].streamCount : 'None shared'} icon="Network" to="/flow-management/analysis" />
      <StatCard label="Longest route" value={longest.distance} suffix=" m" subline={longest.stream.name} icon="MapPin" hatched to="/flow-management/analysis" />
    </section>
    <div className="mod-overview-grid">
      <Panel title="Where to focus" subtitle="Heaviest material movements, in ton·m a month" action={<PillButton small to="/flow-management/transport">View all<Icon name="ArrowUpRight" size={14} /></PillButton>}>
        <FocusList items={focus} />
        <NextStep>Re-route {index.worst.move.material.toLowerCase()} first — {index.worst.move.from} to {index.worst.move.to} is {worstShare}% of all the handling in the plant.</NextStep>
      </Panel>
      <Panel title="What the streams share" subtitle={shared.length + ' operations serve more than one stream'}>
        <div className="mod-shared-list">{shared.map(op => <div key={op.label} className="mod-shared-row"><span>{op.label}</span><span className="mod-shared-dots">{streams.map(s => <i key={s.id} className={op.entries.some(e => e.stream.id === s.id) ? 'on' : ''} style={streamStyle(s)} title={s.name} />)}</span><span className="flow-count">{op.streamCount}</span></div>)}</div>
      </Panel>
    </div>
    <div className="mod-bottom-grid">
      <Panel title="How far the material walks" subtitle="Route length per stream"><DistributionBars rows={rated.map(r => ({ label: r.stream.name, value: r.distance, display: r.distance + ' m', color: STREAM_COLOURS[r.stream.colour].edge }))} /></Panel>
      <Panel title="Ready to hand over?" subtitle="A few details make the report stronger"><Readiness items={[
        { icon: 'Truck', title: unrouted + ' movements without a new route', detail: unrouted ? 'Counted at their as-is distance until a to-be route is drawn.' : 'Every movement has a redesigned route.', to: '/flow-management/transport' },
        { icon: 'Network', title: shared.length + ' shared operations', detail: shared[0] ? shared[0].label + ' serves ' + shared[0].streamCount + ' streams — size it for all of them.' : 'The streams run independently.', to: '/flow-management/analysis' },
        { icon: 'MapPin', title: 'Longest route: ' + longest.stream.name + ', ' + longest.distance + ' m', detail: 'Check it against the layout in Step 12.', to: '/flow-management/streams' },
      ]} /></Panel>
      <ResultCard icon="TrendingUp" label="Handling reduction" value={Math.round(index.savingPct * 100)} suffix="%" detail={fmtTonM(index.asIs) + ' → ' + fmtTonM(index.toBe) + ' a month once the redesigned routes are in place.'} cta={{ label: 'Review the report', to: '/flow-management/report' }} />
    </div>
  </>;
}

function StreamsView() {
  const { streams, setStreams } = useContext(FlowCtx);
  const preview = usePreview();
  const update = (sid: string, stepId: string, patch: Partial<FlowStep>) => setStreams(list => list.map(s => s.id !== sid ? s : { ...s, steps: s.steps.map(st => st.id === stepId ? { ...st, ...patch } : st) }));
  return <>
    <div className="flow-heading-actions"><PillButton small icon="Upload" onClick={() => preview('Import streams', 'Upload an Excel sheet: one column per product, operations in order.')}>Import Excel</PillButton><PillButton small variant="dark" icon="Plus" onClick={() => preview('Add stream', 'A new product column with its own colour.')}>Add stream</PillButton></div>
    <div className="flow-stream-grid">{streams.map(s => { const r = rateStream(s); return <section key={s.id} className="panel flow-stream" style={streamStyle(s)}>
      <div className="flow-stream-head"><span className="flow-stream-dot" /><div><h2>{s.name}</h2><p className="muted">{s.product} · {s.volume} {s.uom}/month</p></div></div>
      <div className="flow-stream-meta"><span><strong>{r.steps}</strong> ops</span><span><strong>{r.machines}</strong> machines</span><span><strong>{r.distance}</strong> m travel</span></div>
      <ol className="flow-op-list">{s.steps.map((st, i) => <li key={st.id} className={st.resource === 'none' ? 'marker' : ''}>
        <span className="mono muted">{String(i + 1).padStart(2, '0')}</span>
        <div className="flow-op-name"><strong>{st.label}</strong>{st.area && <small className="muted">{st.area}</small>}</div>
        {st.resource === 'machine' ? <input type="number" min={0} aria-label={'Machines at ' + st.label} value={st.count ?? 0} onChange={e => update(s.id, st.id, { count: Math.max(0, Number(e.target.value) || 0) })} /> : <ResourceBadge step={st} />}
        {i > 0 ? <label className="flow-distance"><input type="number" min={0} aria-label={'Distance to ' + st.label} value={st.distance ?? 0} onChange={e => update(s.id, st.id, { distance: Math.max(0, Number(e.target.value) || 0) })} /><em>m</em></label> : <span />}
      </li>)}</ol>
    </section>; })}</div>
  </>;
}

function ChartView() {
  const { streams } = useContext(FlowCtx);
  const preview = usePreview();
  return <Panel title="Flow chart" subtitle="The whole wall — one column per stream, the distance walked between each note" action={<PillButton small icon="Download" onClick={() => preview('Export flow chart', 'The wall as an A3 landscape PDF, stream colours kept.')}>Export</PillButton>}>
    <div className="flow-legend"><span><i className="flow-badge">4</i>Machines</span><span><i className="flow-badge manual">M</i>Manual station</span><span><i className="flow-shared-key" />Shared with another stream</span></div>
    <div className="table-scroll flow-wall-scroll" tabIndex={0} role="region" aria-label="Flow chart"><div className="flow-wall">{streams.map(s => <div key={s.id} className="flow-column" style={streamStyle(s)}>
      <div className="flow-column-head"><strong>{s.name}</strong><span>{s.volume} {s.uom}/month</span></div>
      {s.steps.map((st, i) => <div key={st.id} className="flow-note-wrap">
        {i > 0 && <div className="flow-connector"><span>{st.distance ?? 0} m</span></div>}
        <div className={'flow-note' + (st.resource === 'none' ? ' marker' : '') + (st.resource !== 'none' && isShared(streams, st.label) ? ' shared' : '')}><span>{st.label}</span><ResourceBadge step={st} /></div>
      </div>)}
    </div>)}</div></div>
  </Panel>;
}

function TransportView() {
  const { moves, setMoves } = useContext(FlowCtx);
  const preview = usePreview();
  const index = rateMoves(moves, flowStudy.daysPerMonth);
  const update = (id: string, key: 'asIs' | 'toBe' | 'trips' | 'qty', raw: string) => setMoves(list => list.map(m => m.id !== id ? m : { ...m, [key]: key === 'toBe' && raw === '' ? null : Math.max(0, Number(raw) || 0) }));
  const num = (v: number) => Math.round(v).toLocaleString('en-IN');
  return <>
    <section className="stats-grid" aria-label="Transportation index">
      <StatCard label="As-is handling" value={num(index.asIs)} suffix=" ton·m" subline={index.distanceAsIs + ' m across ' + moves.length + ' movements'} icon="Truck" />
      <StatCard label="After the redesign" value={num(index.toBe)} suffix=" ton·m" subline={index.distanceToBe + ' m · ' + index.redesigned + ' of ' + moves.length + ' re-routed'} icon="MapPin" />
      <StatCard label="Saving" value={fmtPct(index.savingPct)} subline={fmtTonM(index.saving) + ' a month'} icon="TrendingUp" dark />
      <StatCard label="Heaviest movement" value={Math.round(index.worst.asIs).toLocaleString('en-IN')} suffix=" ton·m" subline={index.worst.move.material} icon="CircleAlert" hatched />
    </section>
    <Panel title="Transportation index" subtitle={'Monthly load = kg per trip × trips per day × ' + flowStudy.daysPerMonth + ' days · ton·m = distance × load ÷ 1000'} action={<div className="inline"><PillButton small icon="Download" onClick={() => preview('Export transportation index', 'The index in the official template layout (.xlsx).')}>Export</PillButton><PillButton small variant="dark" icon="Plus" onClick={() => preview('Add movement', 'Material, from, to, distances, trips and quantity.')}>Add movement</PillButton></div>}>
      <div className="table-scroll" tabIndex={0} role="region" aria-label="Transportation index"><table className="flow-table">
        <thead><tr><th>Material</th><th>From → To</th><th>As-is (m)</th><th>To-be (m)</th><th>Trips/day</th><th>kg/trip</th><th>Load/month</th><th>As-is ton·m</th><th>To-be ton·m</th><th>Saving</th></tr></thead>
        {index.groups.map(g => <tbody key={g.group}>
          <tr className="flow-group"><th colSpan={7} scope="rowgroup">{g.group}</th><td className="mono">{num(g.asIs)}</td><td className="mono">{num(g.toBe)}</td><td className="mono">{fmtPct(g.asIs ? (g.asIs - g.toBe) / g.asIs : null)}</td></tr>
          {g.rows.map(({ move: m }) => { const r = rateMove(m, flowStudy.daysPerMonth); return <tr key={m.id}>
            <th scope="row">{m.material}<small>{m.id}</small></th>
            <td>{m.from} → {m.to}</td>
            <td><input type="number" min={0} aria-label={m.material + ' as-is distance'} value={m.asIs} onChange={e => update(m.id, 'asIs', e.target.value)} /></td>
            <td><input type="number" min={0} aria-label={m.material + ' to-be distance'} placeholder="—" value={m.toBe ?? ''} onChange={e => update(m.id, 'toBe', e.target.value)} /></td>
            <td><input type="number" min={0} aria-label={m.material + ' trips per day'} value={m.trips} onChange={e => update(m.id, 'trips', e.target.value)} /></td>
            <td><input type="number" min={0} aria-label={m.material + ' kg per trip'} value={m.qty} onChange={e => update(m.id, 'qty', e.target.value)} /></td>
            <td className="mono">{num(r.load)} kg</td>
            <td className="mono">{num(r.asIs)}</td>
            <td className="mono">{r.toBe === null ? '—' : num(r.toBe)}</td>
            <td>{r.savingPct === null ? <span className="muted">No route</span> : <span className="flow-saving">−{fmtPct(r.savingPct)}</span>}</td>
          </tr>; })}
        </tbody>)}
        <tfoot><tr><th colSpan={7} scope="row">Plant total</th><td className="mono">{num(index.asIs)}</td><td className="mono">{num(index.toBe)}</td><td><span className="flow-saving strong">−{fmtPct(index.savingPct)}</span></td></tr></tfoot>
      </table></div>
    </Panel>
  </>;
}

function AnalysisView() {
  const { streams } = useContext(FlowCtx);
  const shared = sharedOperations(streams);
  const rated = streams.map(rateStream);
  const maxDist = Math.max(...rated.map(r => r.distance), 1);
  return <>
    <Panel title="What the streams share" subtitle={shared.length + ' operations appear in more than one stream — the machines there serve every stream through them'}>
      <div className="table-scroll" tabIndex={0} role="region" aria-label="Shared operations"><table className="flow-table matrix">
        <thead><tr><th>Operation</th>{streams.map(s => <th key={s.id}><span className="flow-th-dot" style={streamStyle(s)} />{s.name}</th>)}<th>Streams</th><th>Area</th></tr></thead>
        <tbody>{shared.map(op => <tr key={op.label}>
          <th scope="row">{op.label}</th>
          {streams.map(s => { const e = op.entries.find(x => x.stream.id === s.id); return <td key={s.id}>{e ? <ResourceBadge step={e.step} /> : <span className="muted">·</span>}</td>; })}
          <td><span className="flow-count">{op.streamCount}</span></td>
          <td className="muted">{op.areas.join(', ') || '—'}</td>
        </tr>)}</tbody>
      </table></div>
    </Panel>
    <div className="flow-two-col">
      <Panel title="How far the material walks" subtitle="Route length per stream, store to finished goods">
        <div className="flow-bars">{rated.map(r => <div key={r.stream.id} style={streamStyle(r.stream)}><div className="between"><span>{r.stream.name}</span><span className="mono">{r.distance} m</span></div><div className="flow-bar-track"><span style={{ width: r.distance / maxDist * 100 + '%' }} /></div></div>)}</div>
      </Panel>
      <Panel title="Machines and people" subtitle="What runs each stream">
        <div className="flow-mix">{rated.map(r => <div key={r.stream.id} className="flow-mix-row" style={streamStyle(r.stream)}><span className="flow-stream-dot" /><strong>{r.stream.name}</strong><span className="mono">{r.machines} machines</span><span className="mono muted">{r.manualStations} manual</span></div>)}</div>
      </Panel>
    </div>
  </>;
}

function ReportView() {
  const { streams, moves } = useContext(FlowCtx);
  const preview = usePreview();
  const index = rateMoves(moves, flowStudy.daysPerMonth);
  const findings = flowFindings(streams, moves, flowStudy.daysPerMonth);
  const pack = [
    { icon: 'Layers', title: 'Streams', detail: streams.length + ' product streams, ' + streams.reduce((a, s) => a + s.steps.length, 0) + ' operations, written in order.' },
    { icon: 'Workflow', title: 'Flow chart', detail: 'The wall on one A3 sheet, stream colours kept.' },
    { icon: 'Truck', title: 'Transportation index', detail: fmtTonM(index.asIs) + ' → ' + fmtTonM(index.toBe) + ' a month, ' + fmtPct(index.savingPct) + ' less handling.' },
    { icon: 'Network', title: 'Analysis', detail: sharedOperations(streams).length + ' shared operations and the travel per stream.' },
  ];
  return <div className="flow-two-col">
    <Panel title="Findings" subtitle={findings.length + ' things the client should hear, worst first'}><FindingList findings={findings} /></Panel>
    <Panel title="The export" subtitle={flowStudy.name} action={<PillButton small variant="dark" icon="Download" onClick={() => preview('Download report', 'One PDF: findings, the flow chart, the transportation index and the analysis.')}>Download PDF</PillButton>}>
      <div className="flow-pack">{pack.map(p => <div key={p.title} className="flow-pack-row"><span className="flow-step-icon"><Icon name={p.icon} size={18} /></span><div><h3>{p.title}</h3><p className="muted">{p.detail}</p></div><Icon name="Check" size={16} className="flow-pack-check" /></div>)}</div>
      <PillButton small to="/capacity" icon="ArrowRight">Continue to Step 06 · Capacity</PillButton>
    </Panel>
  </div>;
}

export default function FlowManagement() {
  const location = useLocation();
  const preview = usePreview();
  const subPath = location.pathname.replace('/flow-management', '') || '/';
  const active = flowNavigation.find(n => n.path === location.pathname) || flowNavigation[0];
  const isOverview = subPath === '/';
  const { streams } = useContext(FlowCtx);
  return <>
    <PageHeading title={isOverview ? 'Flow Management' : active.label} description={flowDescriptions[location.pathname] || flowDescriptions['/flow-management']}
      actions={isOverview ? <><PillButton variant="blue" icon="Workflow" to="/flow-management/chart">Open flow chart</PillButton><PillButton icon="Plus" onClick={() => preview('New study', 'Start a new flow study: name, days per month and distance unit.')}>New study</PillButton></> : undefined}>
      {isOverview && <HeroMark icon="Waves" step="05" />}
    </PageHeading>
    <ModuleContext org="Sahyadri Auto Components Pvt. Ltd." name={'Transmission line · ' + streams.length + ' product streams'} site="Chakan MIDC, Pune" label="Sample study" />
    {isOverview && <FlowOverview />}
    {subPath === '/streams' && <StreamsView />}
    {subPath === '/chart' && <ChartView />}
    {subPath === '/transport' && <TransportView />}
    {subPath === '/analysis' && <AnalysisView />}
    {subPath === '/report' && <ReportView />}
    <StepFooter nav={flowNavigation} pathname={location.pathname} label="Flow management steps" />
  </>;
}
