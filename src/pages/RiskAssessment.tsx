import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../components/Icon';
import { EmptyState, IconCircleButton, PageHeading, Panel, PillButton, SearchPill, StatCard } from '../components/UI';
import { usePreview } from '../components/PreviewDialog';
import { riskAssessment, riskBandLabels, riskCategories, riskDescriptions, riskItems, riskNavigation, riskScales, provisionSamples, type RiskBand, type RiskItem } from '../data/mock';
import { bandOf, rankedRisks, residualOf, riskSummary, scoreOf } from '../data/riskModel';

const RiskContext = createContext<{ items: RiskItem[]; update: (id: string, patch: Partial<RiskItem>) => void; add: (item: RiskItem) => void }>({ items: [], update: () => {}, add: () => {} });
export function RiskProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState(riskItems);
  return <RiskContext.Provider value={{ items, update: (id, patch) => setItems(rows => rows.map(r => r.item_id === id ? { ...r, ...patch } : r)), add: item => setItems(rows => [...rows, item]) }}>{children}</RiskContext.Provider>;
}
function Band({ value }: { value: RiskBand }) {
  return <span className={'risk-band band-' + value}><i />{riskBandLabels[value]}</span>;
}
function Action({ children, icon = 'ArrowUpRight', onClick, to }: { children: ReactNode; icon?: string; onClick?: () => void; to?: string }) {
  const content = <><Icon name={icon} size={16} />{children}</>;
  return to ? <Link className="pill-button risk-primary" to={to}>{content}</Link> : <button type="button" className="pill-button risk-primary" onClick={onClick}>{content}</button>;
}
function Matrix({ items }: { items: RiskItem[] }) {
  const [selected, setSelected] = useState<string | null>(null);
  return <><div className="risk-matrix-wrap"><span className="matrix-y">Severity</span><div className="risk-matrix">
    {[5, 4, 3, 2, 1].map(s => <div className="matrix-row" key={s}><span className="axis-value">{s}</span>{[1, 2, 3, 4, 5].map(o => {
      const count = items.filter(r => r.severity === s && r.occurrence === o).length;
      const product = s * o;
      const band = product >= 15 ? 'critical' : product >= 9 ? 'high' : product >= 4 ? 'medium' : 'low';
      return <button key={o} className={'matrix-cell band-' + band + (selected === s + '-' + o ? ' chosen' : '')} aria-label={'Severity ' + s + ', occurrence ' + o + ', ' + count + ' risks'} aria-pressed={selected === s + '-' + o} onClick={() => setSelected(selected === s + '-' + o ? null : s + '-' + o)}>{count > 0 ? <b>{count}</b> : <span>·</span>}</button>;
    })}</div>)}
    <div className="matrix-row x-axis"><span />{[1, 2, 3, 4, 5].map(n => <span key={n}>{n}</span>)}</div><p className="matrix-x">Occurrence</p>
  </div></div><p className="muted">Cell colors show Severity × Occurrence. Detection is included in RPN, not this map.</p>{selected && <div className="matrix-selection">{items.filter(r => r.severity + '-' + r.occurrence === selected).map(r => <Link key={r.item_id} to="/risk/scoring">{r.item_id} · {r.title}<Icon name="ArrowUpRight" size={14} /></Link>)}{!items.some(r => r.severity + '-' + r.occurrence === selected) && <p className="muted">No risks in this cell.</p>}</div>}</>;
}
function Distribution({ items }: { items: RiskItem[] }) {
  const stats = riskSummary(items);
  return <div className="risk-distribution">{(['critical', 'high', 'medium', 'low', 'unscored'] as RiskBand[]).map(band => <div key={band}><div className="between"><Band value={band} /><span className="mono">{stats.counts[band]}</span></div><div className="distribution-track"><span className={'band-' + band} style={{ width: (stats.total ? stats.counts[band] / stats.total * 100 : 0) + '%' }} /></div></div>)}</div>;
}
function Overview({ items }: { items: RiskItem[] }) {
  const stats = riskSummary(items);
  return <>
    <section className="stats-grid" aria-label="Assessment summary">
      <StatCard label="Risks identified" value={stats.total} subline={stats.scored + ' scored · ' + stats.counts.unscored + ' to review'} icon="ClipboardList" to="/risk/register" />
      <StatCard label="Highest RPN" value={stats.max || '—'} suffix="/125" subline="Severity × Occurrence × Detection" icon="Activity" dark to="/risk/scoring" />
      <StatCard label="Need attention" value={stats.urgent} subline={stats.counts.critical + ' critical · ' + stats.counts.high + ' high'} icon="ShieldAlert" to="/risk/priority" />
      <StatCard label="Mitigation planned" value={stats.mitigated} suffix={'/' + stats.total} subline={stats.owners + ' with an assigned owner'} icon="ShieldCheck" to="/risk/mitigation" />
    </section>
    <div className="risk-overview-grid"><Panel title="Where to focus" subtitle="Highest priority risks in this assessment" action={<PillButton small to="/risk/priority">View all<Icon name="ArrowUpRight" size={14} /></PillButton>}>
      <div className="focus-list">{rankedRisks(items).slice(0, 4).map((r, i) => <Link to="/risk/mitigation" className="focus-row" key={r.item_id}><span className="focus-rank">{String(i + 1).padStart(2, '0')}</span><div><h3>{r.title}</h3><p className="muted">{r.area} · {r.owner || 'Owner needed'}</p></div><div className="focus-score"><strong>{scoreOf(r) ?? '—'}</strong><Band value={bandOf(scoreOf(r))} /></div><Icon name="ArrowUpRight" size={16} /></Link>)}</div>
      <div className="risk-note"><Icon name="CircleHelp" /><p><strong>One clear next step.</strong> Review the urgent risks with their owners before the next relocation milestone.</p></div>
    </Panel><Panel title="Risk landscape" subtitle="Severity × Occurrence · click a cell"><Matrix items={items} /></Panel></div>
    <div className="risk-bottom-grid"><Panel title="Risk distribution" subtitle="Every risk has a place"><Distribution items={items} /></Panel>
      <Panel title="Register readiness" subtitle="A few details make the next review easier"><div className="readiness-list">
        <Link to="/risk/scoring"><span className="icon-box"><Icon name="SlidersHorizontal" /></span><div><h3>{stats.counts.unscored} risks need scoring</h3><p className="muted">Complete all three scores before prioritising.</p></div><Icon name="ArrowUpRight" size={16} /></Link>
        <Link to="/risk/mitigation"><span className="icon-box"><Icon name="Users" /></span><div><h3>{stats.total - stats.owners} risks need an owner</h3><p className="muted">Make responsibility clear for every action.</p></div><Icon name="ArrowUpRight" size={16} /></Link>
        <Link to="/risk/mitigation"><span className="icon-box"><Icon name="ShieldCheck" /></span><div><h3>{stats.completed} actions completed</h3><p className="muted">Review the residual score after the change.</p></div><Icon name="ArrowUpRight" size={16} /></Link>
      </div></Panel><div className="risk-reduction-card"><span className="icon-box"><Icon name="TrendingUp" size={22} /></span><p>Potential risk reduction</p><div className="big-number">{stats.reduction ?? '—'}<span>%</span></div><p className="muted">Across {stats.reassessed} re-scored risks. Planned residual scores are subject to verification.</p><PillButton to="/risk/report" small>Review the report<Icon name="ArrowUpRight" size={14} /></PillButton></div>
    </div>
  </>;
}
function Register({ items, onAdd }: { items: RiskItem[]; onAdd: () => void }) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const preview = usePreview();
  const rows = items.filter(r => (!category || r.category === category) && (r.title + ' ' + r.area).toLowerCase().includes(search.toLowerCase()));
  return <Panel title="Risk register" subtitle={rows.length + ' risks · identify first, score next'} action={<div className="filters"><SearchPill value={search} onChange={setSearch} placeholder="Search risks or areas" /><select className="risk-select" aria-label="Filter risk category" value={category} onChange={e => setCategory(e.target.value)}><option value="">All categories</option>{riskCategories.map(c => <option key={c}>{c}</option>)}</select><Action icon="Plus" onClick={onAdd}>Add risk</Action></div>}>
    <div className="table-scroll" tabIndex={0} role="region" aria-label="Risk register table"><table className="risk-table"><thead><tr>{['ID', 'Risk / observation', 'Category', 'Area', 'RPN', 'Band', ''].map((t, i) => <th key={i} scope="col">{t}</th>)}</tr></thead><tbody>{rows.map(r => <tr key={r.item_id}><td className="mono risk-id">{r.item_id}</td><th scope="row">{r.title}<small>{r.subcategory}</small></th><td>{r.category}</td><td>{r.area}</td><td className="risk-rpn">{scoreOf(r) ?? '—'}</td><td><Band value={bandOf(scoreOf(r))} /></td><td><IconCircleButton icon="Eye" label={'View ' + r.title} onClick={() => preview(r.title, r.mitigation || 'Score this risk and add a mitigation plan during your review.')} /></td></tr>)}</tbody></table></div>{!rows.length && <EmptyState />}
    <div className="risk-panel-footer"><span className="muted">Illustrative assessment · edits last until this page is refreshed.</span><Action to="/risk/scoring">Continue to scoring</Action></div>
  </Panel>;
}
function Scoring({ items }: { items: RiskItem[] }) {
  const { update } = useContext(RiskContext);
  const [showScales, setShowScales] = useState(false);
  return <><div className="risk-info-strip"><Icon name="SlidersHorizontal" /><span><strong>RPN = S × O × D</strong> · Each axis uses a 1–5 scale. Higher detection means less chance of catching the issue.</span><button onClick={() => setShowScales(!showScales)} aria-expanded={showScales}>{showScales ? 'Hide' : 'View'} scoring anchors</button></div>
    {showScales && <div className="scale-grid">{riskScales.map(axis => <Panel key={axis.key} title={axis.title} subtitle={axis.question}><ol className="scale-list">{axis.labels.map((label, i) => <li key={label}><span className="mono">{i + 1}</span>{label}</li>)}</ol></Panel>)}</div>}
    <Panel title="Score the register" subtitle="Select a score to update RPN, bands and the overview instantly"><div className="table-scroll" tabIndex={0} role="region" aria-label="Risk scoring table"><table className="risk-table scoring-table"><thead><tr><th>Risk</th>{riskScales.map(axis => <th key={axis.key}>{axis.title}</th>)}<th>RPN</th><th>Band</th></tr></thead><tbody>{items.map(r => <tr key={r.item_id}><th scope="row"><span className="mono risk-id">{r.item_id}</span><br />{r.title}</th>{riskScales.map(axis => <td key={axis.key}><select className="score-select" aria-label={axis.title + ' for ' + r.item_id} value={r[axis.key] ?? ''} onChange={e => update(r.item_id, { [axis.key]: e.target.value ? Number(e.target.value) : null })}><option value="">—</option>{axis.labels.map((label, i) => <option key={label} value={i + 1}>{i + 1} · {label}</option>)}</select></td>)}<td className="risk-rpn">{scoreOf(r) ?? '—'}</td><td><Band value={bandOf(scoreOf(r))} /></td></tr>)}</tbody></table></div><div className="risk-panel-footer"><span className="muted">Incomplete scores stay unscored; they are never shown as zero risk.</span><Action to="/risk/priority">View priorities</Action></div></Panel></>;
}
function Priority({ items }: { items: RiskItem[] }) {
  return <><div className="risk-overview-grid"><Panel title="Risk landscape" subtitle="Select a cell to inspect the risks"><Matrix items={items} /></Panel><Panel title="Exposure by band" subtitle="Assessment thresholds · RPN out of 125"><Distribution items={items} /><div className="band-thresholds"><span>Low &lt;20</span><span>Medium 20–44</span><span>High 45–74</span><span>Critical ≥75</span></div></Panel></div><Panel title="Act on these first" subtitle="Ranked by RPN, with severity breaking ties"><div className="priority-list">{rankedRisks(items).map((r, i) => <Link to="/risk/mitigation" className="priority-row" key={r.item_id}><span className="focus-rank">{String(i + 1).padStart(2, '0')}</span><div><h3>{r.title}</h3><p className="muted">{r.area}</p></div><div className="priority-track"><span style={{ width: ((scoreOf(r) ?? 0) / 125 * 100) + '%' }} className={'band-' + bandOf(scoreOf(r))} /></div><strong className="mono">{scoreOf(r) ?? '—'}</strong><Band value={bandOf(scoreOf(r))} /><Icon name="ArrowUpRight" size={16} /></Link>)}</div></Panel></>;
}
function Mitigation({ items }: { items: RiskItem[] }) {
  const { update } = useContext(RiskContext);
  const [filter, setFilter] = useState('');
  const preview = usePreview();
  const rows = rankedRisks(items).filter(r => !filter || r.status === filter);
  return <><div className="section-heading"><div><h2>From risk to action</h2><p className="muted">Clear ownership. Visible progress. A score after the change.</p></div><select className="risk-select" aria-label="Filter mitigation status" value={filter} onChange={e => setFilter(e.target.value)}><option value="">All actions</option>{['Open', 'In progress', 'Completed'].map(s => <option key={s}>{s}</option>)}</select></div><div className="mitigation-grid">{rows.map(r => <article className="mitigation-card lift" key={r.item_id}><div className="between"><span className="mono risk-id">{r.item_id}</span><Band value={bandOf(scoreOf(r))} /></div><h3>{r.title}</h3><p className={r.mitigation ? '' : 'muted'}>{r.mitigation || 'Add a countermeasure after scoring this risk.'}</p><div className="mitigation-meta"><div><span>Responsible</span><strong>{r.owner || 'Unassigned'}</strong></div><div><span>Due date</span><strong className="mono">{r.due_date || 'Not set'}</strong></div></div><div className="mitigation-footer"><select className="risk-select" aria-label={'Action status for ' + r.item_id} value={r.status} onChange={e => update(r.item_id, { status: e.target.value as RiskItem['status'] })}>{['Open', 'In progress', 'Completed'].map(s => <option key={s}>{s}</option>)}</select><div className="residual-score"><span className="muted">RPN</span><strong>{scoreOf(r) ?? '—'}</strong><Icon name="ArrowRight" size={14} /><strong>{residualOf(r) ?? '—'}</strong></div><IconCircleButton icon="Pencil" label={'Edit mitigation for ' + r.item_id} onClick={() => preview('Mitigation · ' + r.item_id, r.mitigation || 'Define the action, owner and due date for ' + r.title + '.')} /></div></article>)}</div>{!rows.length && <Panel><EmptyState /></Panel>}</>;
}
function Compliance() {
  const preview = usePreview();
  return <><div className="risk-info-strip"><Icon name="ShieldCheck" /><span>Illustrative provision checklist. Quantities are sample planning inputs; no statutory compliance is asserted.</span></div><div className="provision-grid">{provisionSamples.map(p => <Panel title={p.title} subtitle={p.area} key={p.title} action={<span className="icon-box risk-icon"><Icon name={p.icon} size={22} /></span>}><div className="provision-count"><div className="big-number">{p.observed}<span>/{p.planned}</span></div><span className="muted">observed / planned</span></div><div className="provision-track"><span style={{ width: p.observed / p.planned * 100 + '%' }} /></div><p className="muted">{p.note}</p><div className="between"><span className="risk-band band-unscored">Review pending</span><PillButton small onClick={() => preview(p.title + ' review', p.note)}>Review<Icon name="ArrowUpRight" size={14} /></PillButton></div></Panel>)}</div><Panel title="Before you score" subtitle="Bring the observations into your register"><div className="risk-note"><Icon name="ClipboardList" /><p>Capture any observed shortfall as a risk, record the area and evidence, then agree the score with the assessment team.</p></div><div><Action to="/risk/register">Open the risk register</Action></div></Panel></>;
}
function Report({ items }: { items: RiskItem[] }) {
  const stats = riskSummary(items);
  const preview = usePreview();
  return <Panel className="risk-report"><div className="report-masthead"><div><img src="/logo.png" alt="LFD Cloud" /><span>RISK ASSESSMENT<br /><small>Review summary · {riskAssessment.updated_at}</small></span></div><span className="risk-band band-unscored">Draft · sample assessment</span></div><div className="report-title"><p className="eyebrow">{riskAssessment.org_name}</p><h2>{riskAssessment.name}</h2><p className="muted">{riskAssessment.plant} · Prepared by {riskAssessment.lead}</p></div><div className="report-verdict"><span className="icon-box risk-icon"><Icon name="ShieldAlert" size={24} /></span><div><h3>{stats.urgent} risks need priority attention.</h3><p>{stats.counts.critical} critical and {stats.counts.high} high risks in the scored register. {stats.counts.unscored} risks remain unscored.</p></div></div><div className="report-metrics"><div><strong>{stats.total}</strong><span>Risks identified</span></div><div><strong>{stats.mitigated}</strong><span>Mitigations planned</span></div><div><strong>{stats.completed}</strong><span>Actions completed</span></div><div><strong>{stats.reduction ?? '—'}%</strong><span>Potential RPN reduction*</span></div></div><div className="report-columns"><div><h3>Review priorities</h3><ol>{rankedRisks(items).slice(0, 3).map(r => <li key={r.item_id}><strong>{r.title}</strong><p className="muted">{r.mitigation || 'Agree an action with the assessment team.'}</p></li>)}</ol></div><div><h3>Readiness for handover</h3><div className="report-check"><Icon name="Check" />{stats.scored} of {stats.total} risks fully scored</div><div className="report-check"><Icon name="Users" />{stats.owners} of {stats.total} assigned to an owner</div><div className="report-check"><Icon name="ShieldCheck" />{stats.reassessed} risks have residual scores</div><p className="muted">*Compared across re-scored risks only. Verify planned controls before accepting residual scores.</p></div></div><div className="risk-panel-footer"><span className="muted">Visual preview · illustrative records</span><Action icon="Download" onClick={() => preview('Export assessment report', 'The report layout is ready for design review. PDF and presentation exports are not connected in this preview.')}>Export report</Action></div></Panel>;
}
function NewRisk({ open, close }: { open: boolean; close: () => void }) {
  const { add, items } = useContext(RiskContext);
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => { if (open) dialog.current?.showModal(); else dialog.current?.close(); }, [open]);
  return <dialog ref={dialog} className="preview-dialog risk-dialog" onCancel={close}><form onSubmit={e => {
    e.preventDefault(); const data = new FormData(e.currentTarget); const title = String(data.get('title') || '').trim(); if (!title) return;
    add({ item_id: 'R-' + String(items.length + 1).padStart(3, '0'), title, category: String(data.get('category')), subcategory: 'To be classified', area: String(data.get('area') || 'Not specified'), severity: null, occurrence: null, detection: null, mitigation: '', owner: '', due_date: '', status: 'Open', residual_severity: null, residual_occurrence: null, residual_detection: null });
    e.currentTarget.reset(); close();
  }}><div className="dialog-header"><span className="risk-band band-unscored">Risk register</span><button type="button" className="circle-button" aria-label="Close add risk" onClick={close}><Icon name="X" /></button></div><h2>Add a risk</h2><p className="muted">Capture the observation now. Agree the scores next.</p><label>Risk or observation<input name="title" required maxLength={180} placeholder="What could go wrong?" autoFocus /></label><label>Category<select name="category">{riskCategories.map(c => <option key={c}>{c}</option>)}</select></label><label>Area<input name="area" placeholder="e.g. Assembly line" maxLength={100} /></label><div className="risk-panel-footer"><PillButton onClick={close}>Cancel</PillButton><button className="pill-button risk-primary" type="submit"><Icon name="Plus" size={16} />Add to register</button></div></form></dialog>;
}
export default function RiskAssessment() {
  const { items } = useContext(RiskContext);
  const { pathname } = useLocation();
  const [adding, setAdding] = useState(false);
  const current = riskNavigation.find(n => n.path === pathname) || riskNavigation[0];
  const index = riskNavigation.indexOf(current);
  return <>
    <PageHeading title={pathname === '/risk' ? 'Risk Assessment' : current.label} description={riskDescriptions[pathname] || riskDescriptions['/risk']} actions={pathname === '/risk' ? <><Action icon="Plus" onClick={() => setAdding(true)}>Add a risk</Action><PillButton to="/risk/report" icon="BookOpen">View report</PillButton></> : undefined}>
      {pathname === '/risk' && <div className="risk-hero-mark"><Icon name="ShieldAlert" size={48} /><div><span>STEP</span><strong>14</strong></div></div>}
    </PageHeading>
    <div className="assessment-context"><span className="icon-box risk-icon"><Icon name="Building2" size={20} /></span><div className="assessment-name"><span className="muted">{riskAssessment.org_name}</span><strong>{riskAssessment.name}</strong></div><span className="assessment-location"><Icon name="PanelsTopLeft" size={15} />{riskAssessment.plant}</span><span className="risk-sample-label">Sample assessment</span></div>
    {pathname === '/risk/register' ? <Register items={items} onAdd={() => setAdding(true)} /> : pathname === '/risk/scoring' ? <Scoring items={items} /> : pathname === '/risk/priority' ? <Priority items={items} /> : pathname === '/risk/mitigation' ? <Mitigation items={items} /> : pathname === '/risk/compliance' ? <Compliance /> : pathname === '/risk/report' ? <Report items={items} /> : <Overview items={items} />}
    <nav className="risk-step-footer" aria-label="Assessment steps">{index > 0 ? <Link to={riskNavigation[index - 1].path}><Icon name="ArrowLeft" size={16} /><span>Previous<strong>{riskNavigation[index - 1].label}</strong></span></Link> : <Link to="/services"><Icon name="ArrowLeft" size={16} />All services</Link>}{index < riskNavigation.length - 1 && <Link to={riskNavigation[index + 1].path}><span>Next<strong>{riskNavigation[index + 1].label}</strong></span><Icon name="ArrowRight" size={16} /></Link>}</nav>
    <NewRisk open={adding} close={() => setAdding(false)} />
  </>;
}

