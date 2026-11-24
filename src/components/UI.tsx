import type { ReactNode, CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import Icon from './Icon';

export function IconCircleButton({ icon = 'ArrowUpRight', label, to, onClick, danger = false, className = '' }: {
  icon?: string; label: string; to?: string; onClick?: () => void; danger?: boolean; className?: string;
}) {
  const cls = 'circle-button ' + (danger ? 'danger ' : '') + className;
  return to ? <Link className={cls} to={to} aria-label={label} title={label}><Icon name={icon} /></Link>
    : <button type="button" className={cls} aria-label={label} title={label} onClick={onClick}><Icon name={icon} /></button>;
}
export function PillButton({ children, icon, to, onClick, variant = 'outline', small = false }: {
  children: ReactNode; icon?: string; to?: string; onClick?: () => void; variant?: 'outline' | 'orange' | 'blue' | 'dark' | 'soft'; small?: boolean;
}) {
  const content = <>{icon && <Icon name={icon} size={small ? 14 : 17} />}{children}</>;
  const cls = 'pill-button ' + variant + (small ? ' small' : '');
  return to ? <Link to={to} className={cls}>{content}</Link> : <button type="button" onClick={onClick} className={cls}>{content}</button>;
}
export function StatusChip({ status, label }: { status: string; label?: string }) {
  const labels: Record<string, string> = { active: 'Active', expired: 'Expired', created: 'Created', updated: 'Updated', internal: 'Internal', 'in-progress': 'In progress', suspended: 'Suspended' };
  return <span className={'status-chip ' + status}><span className="status-dot" />{label || labels[status] || status}</span>;
}
export function Panel({ title, subtitle, action, children, className = '' }: {
  title?: string; subtitle?: string; action?: ReactNode; children: ReactNode; className?: string;
}) {
  return <section className={'panel ' + className}>{title && <div className="panel-heading"><div><h2>{title}</h2>{subtitle && <p className="muted">{subtitle}</p>}</div>{action}</div>}{children}</section>;
}
export function SoftRow({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={'soft-row ' + className}>{children}</div>;
}
export function StatCard({ label, value, suffix, subline, dark, hatched, icon, to }: {
  label: string; value: ReactNode; suffix?: ReactNode; subline?: string; dark?: boolean; hatched?: boolean; icon?: string; to?: string;
}) {
  return <div className={'stat-card lift ' + (dark ? 'dark ' : '') + (hatched ? 'hatched-card' : '')}>
    <div className="stat-top"><span>{label}</span>{icon && <Icon name={icon} />}</div>
    <div className="stat-bottom"><div><div className="big-number">{value}{suffix && <span className="number-suffix">{suffix}</span>}</div>{subline && <p className="muted">{subline}</p>}</div>{to && <IconCircleButton label={'View ' + label.toLowerCase()} to={to} />}</div>
  </div>;
}
export function Meter({ label, used, limit, left, right, blue = false }: {
  label: string; used: number; limit: number; left?: ReactNode; right?: ReactNode; blue?: boolean;
}) {
  const percent = Math.min(100, Math.max(0, used / limit * 100));
  return <div className="meter">
    <div className="meter-heading"><span>{label}</span><span className="meter-number">{used}<span>/{limit}</span></span></div>
    <div className={'meter-track ' + (blue ? 'blue' : '')} role="meter" aria-label={label} aria-valuenow={used} aria-valuemin={0} aria-valuemax={limit}>
      <div className="meter-fill" style={{ width: percent + '%' }} /><span className="meter-marker" style={{ left: 'clamp(2px, ' + percent + '%, calc(100% - 2px))' }} />
    </div><div className="meter-foot"><span>{left}</span><span>{right}</span></div>
  </div>;
}
export function PillTabs({ tabs, active, onChange, label }: {
  tabs: { id: string; label: string; count?: number }[]; active: string; onChange: (id: string) => void; label: string;
}) {
  return <div className="pill-tabs" aria-label={label}>{tabs.map(tab => <button key={tab.id} type="button" aria-pressed={active === tab.id} className={active === tab.id ? 'selected' : ''} onClick={() => onChange(tab.id)}>{tab.label}{tab.count !== undefined && <span className="tab-count">{tab.count}</span>}</button>)}</div>;
}
export function SearchPill({ value, onChange, placeholder = 'Search organizations', shortcut = false }: {
  value: string; onChange: (value: string) => void; placeholder?: string; shortcut?: boolean;
}) {
  return <label className="search-pill"><Icon name="Search" size={17} /><input type="search" aria-label={placeholder} placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)} />{shortcut && <kbd>⌘K</kbd>}</label>;
}
export function PageHeading({ description, title, children, actions }: { description: string; title: string; children?: ReactNode; actions?: ReactNode }) {
  return <section className={'page-hero ' + (children ? 'with-meters' : '')}><div className="hero-copy"><p className="eyebrow">{description}</p><h1>{title}</h1>{actions && <div className="hero-actions">{actions}</div>}</div>{children && <div className="hero-meters">{children}</div>}</section>;
}
export function EmptyState({ title = 'No results found', description = 'Try a different search or filter.' }: { title?: string; description?: string }) {
  return <div className="empty-state"><div className="icon-box"><Icon name="Search" size={24} /></div><h3>{title}</h3><p className="muted">{description}</p></div>;
}
export const cssVar = (name: string) => ({ background: 'var(--' + name + ')' }) as CSSProperties;

