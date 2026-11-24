import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import Icon from './Icon';
import { PillButton } from './UI';

/** The Risk Assessment page pattern, shared so every module reads the same way; colours come from the module's --mod-* variables. */

export function HeroMark({ icon, step }: { icon: string; step: string }) {
  return <div className="mod-hero-mark"><Icon name={icon} size={48} /><div><span>STEP</span><strong>{step}</strong></div></div>;
}

export function ModuleContext({ org, name, site, label }: { org: string; name: string; site: string; label: string }) {
  return <div className="assessment-context"><span className="icon-box mod-icon"><Icon name="Building2" size={20} /></span><div className="assessment-name"><span className="muted">{org}</span><strong>{name}</strong></div><span className="assessment-location"><Icon name="PanelsTopLeft" size={15} />{site}</span><span className="mod-sample-label">{label}</span></div>;
}

export type ChipTone = 'critical' | 'high' | 'medium' | 'low' | 'good' | 'neutral';
export function Chip({ tone, children }: { tone: ChipTone; children: ReactNode }) {
  return <span className={'mod-chip tone-' + tone}><i />{children}</span>;
}

export interface FocusItem { key: string; title: string; meta: string; value: ReactNode; chip: { tone: ChipTone; label: string }; to: string; }
export function FocusList({ items }: { items: FocusItem[] }) {
  return <div className="focus-list">{items.map((f, i) => <Link to={f.to} className="focus-row" key={f.key}>
    <span className="focus-rank">{String(i + 1).padStart(2, '0')}</span>
    <div><h3>{f.title}</h3><p className="muted">{f.meta}</p></div>
    <div className="focus-score"><strong>{f.value}</strong><Chip tone={f.chip.tone}>{f.chip.label}</Chip></div>
    <Icon name="ArrowUpRight" size={16} />
  </Link>)}</div>;
}

export function NextStep({ children }: { children: ReactNode }) {
  return <div className="mod-note"><Icon name="CircleHelp" /><p><strong>One clear next step.</strong> {children}</p></div>;
}

export function Readiness({ items }: { items: { icon: string; title: string; detail: string; to: string }[] }) {
  return <div className="readiness-list mod-readiness">{items.map(r => <Link key={r.title} to={r.to}><span className="icon-box"><Icon name={r.icon} /></span><div><h3>{r.title}</h3><p className="muted">{r.detail}</p></div><Icon name="ArrowUpRight" size={16} /></Link>)}</div>;
}

export function ResultCard({ icon, label, value, suffix, detail, cta }: { icon: string; label: string; value: ReactNode; suffix?: string; detail: string; cta: { label: string; to: string } }) {
  return <div className="mod-result-card"><span className="icon-box"><Icon name={icon} size={22} /></span><p>{label}</p><div className="big-number">{value}{suffix && <span>{suffix}</span>}</div><p className="muted">{detail}</p><PillButton to={cta.to} small>{cta.label}<Icon name="ArrowUpRight" size={14} /></PillButton></div>;
}

/** A labelled bar per row — the module's answer to Risk's "Every risk has a place". */
export function DistributionBars({ rows }: { rows: { label: string; value: number; display?: string; color?: string }[] }) {
  const max = Math.max(1, ...rows.map(r => r.value));
  return <div className="mod-distribution">{rows.map(r => <div key={r.label}><div className="between"><span>{r.label}</span><span className="mono">{r.display ?? r.value}</span></div><div className="mod-distribution-track"><span style={{ width: r.value / max * 100 + '%', background: r.color }} /></div></div>)}</div>;
}

export function StepFooter({ nav, pathname, label }: { nav: { label: string; path: string }[]; pathname: string; label: string }) {
  const current = nav.find(n => n.path === pathname) || nav[0];
  const index = nav.indexOf(current);
  return <nav className="mod-step-footer" aria-label={label}>
    {index > 0 ? <Link to={nav[index - 1].path}><Icon name="ArrowLeft" size={16} /><span>Previous<strong>{nav[index - 1].label}</strong></span></Link> : <Link to="/services"><Icon name="ArrowLeft" size={16} />All services</Link>}
    {index < nav.length - 1 && <Link to={nav[index + 1].path}><span>Next<strong>{nav[index + 1].label}</strong></span><Icon name="ArrowRight" size={16} /></Link>}
  </nav>;
}
