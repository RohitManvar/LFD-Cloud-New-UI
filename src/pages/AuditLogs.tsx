import { useEffect, useRef, useState } from 'react';
import {
  auditLogs,
  pageDescriptions,
  type AuditAction,
  type AuditLogEntry,
} from '../data/mock';
import Icon from '../components/Icon';
import {
  EmptyState,
  Meter,
  PageHeading,
  Panel,
  PillButton,
  PillTabs,
  SearchPill,
  StatCard,
  StatusChip,
} from '../components/UI';

const actionMeta: Record<AuditAction, { chip: string; label: string; icon: string }> = {
  created: { chip: 'created', label: 'Created', icon: 'Plus' },
  updated: { chip: 'updated', label: 'Updated', icon: 'Pencil' },
  exported: { chip: 'internal', label: 'Exported', icon: 'Download' },
  auth: { chip: 'active', label: 'Auth', icon: 'ShieldCheck' },
  suspended: { chip: 'suspended', label: 'Flagged', icon: 'CircleAlert' },
};

export default function AuditLogs() {
  const [tab, setTab] = useState<'all' | 'mutations' | 'security' | 'exports'>('all');
  const [search, setSearch] = useState('');
  const [resourceFilter, setResourceFilter] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [orgFilter, setOrgFilter] = useState('');
  const [selected, setSelected] = useState<AuditLogEntry | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (selected) dialogRef.current?.showModal();
    else dialogRef.current?.close();
  }, [selected]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const uniqueOrgs = Array.from(new Set(auditLogs.map((e) => e.organization)));

  const baseList = auditLogs.filter((entry) => {
    if (tab === 'mutations') return entry.action === 'created' || entry.action === 'updated';
    if (tab === 'security') return entry.action === 'auth' || entry.action === 'suspended';
    if (tab === 'exports') return entry.action === 'exported';
    return true;
  });

  const filtered = baseList.filter((entry) => {
    const q = search.trim().toLowerCase();
    const matchesSearch =
      !q ||
      (
        entry.id +
        ' ' +
        entry.actor.name +
        ' ' +
        entry.actor.email +
        ' ' +
        entry.target +
        ' ' +
        entry.organization +
        ' ' +
        entry.summary +
        ' ' +
        entry.ip_address
      )
        .toLowerCase()
        .includes(q);
    const matchesResource = !resourceFilter || entry.resource_type === resourceFilter;
    const matchesAction = !actionFilter || entry.action === actionFilter;
    const matchesOrg = !orgFilter || entry.organization === orgFilter;
    return matchesSearch && matchesResource && matchesAction && matchesOrg;
  });

  const mutationCount = auditLogs.filter(
    (e) => e.action === 'created' || e.action === 'updated'
  ).length;
  const securityCount = auditLogs.filter(
    (e) => e.action === 'auth' || e.action === 'suspended'
  ).length;
  const exportCount = auditLogs.filter((e) => e.action === 'exported').length;

  const handleExportCsv = () => {
    const headers = ['Event ID', 'Timestamp', 'Actor', 'Email', 'Role', 'Action', 'Resource Type', 'Target', 'Organization', 'Source', 'IP Address', 'Summary'];
    const escape = (v: string) => `"${v.replace(/"/g, '""')}"`;
    const rows = filtered.map((e) =>
      [
        e.id,
        e.timestamp,
        e.actor.name,
        e.actor.email,
        e.actor.role,
        e.action,
        e.resource_type,
        e.target,
        e.organization,
        e.source,
        e.ip_address,
        e.summary,
      ]
        .map(escape)
        .join(',')
    );
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lfd-cloud-audit-logs.csv';
    a.click();
    URL.revokeObjectURL(url);
    showToast(`Exported ${filtered.length} audit events to CSV.`);
  };

  return (
    <>
      <PageHeading
        description={pageDescriptions['Audit Logs']}
        title="Audit Logs"
        actions={
          <PillTabs
            label="Audit log views"
            active={tab}
            onChange={(t) => setTab(t as 'all' | 'mutations' | 'security' | 'exports')}
            tabs={[
              { id: 'all', label: 'All', count: auditLogs.length },
              { id: 'mutations', label: 'Mutations', count: mutationCount },
              { id: 'security', label: 'Security', count: securityCount },
              { id: 'exports', label: 'Exports', count: exportCount },
            ]}
          />
        }
      >
        <Meter
          label="Audit retention window"
          used={auditLogs.length}
          limit={90}
          left={
            <>
              <b>90-day</b> retention
            </>
          }
          right={
            <>
              <b>100%</b> immutable
            </>
          }
        />
      </PageHeading>

      {toast && (
        <div className="save-toast-banner" role="status">
          <Icon name="CheckCircle2" size={16} />
          <span>{toast}</span>
        </div>
      )}

      <section className="stats-grid" aria-label="Audit summary">
        <StatCard
          label="Recorded events"
          value={auditLogs.length}
          subline="Last 30 days across platform"
          icon="History"
        />
        <StatCard
          label="Entity mutations"
          value={mutationCount}
          subline="Orgs, streams & permissions"
          icon="Workflow"
        />
        <StatCard
          label="Security & auth"
          value={securityCount}
          subline="2FA sessions, tokens & flags"
          icon="ShieldCheck"
        />
        <StatCard
          label="Study exports"
          value={exportCount}
          subline="Excel & audit snapshots"
          icon="Download"
          dark
        />
      </section>

      <Panel
        title="Platform event trail"
        subtitle={`${filtered.length} ${filtered.length === 1 ? 'event' : 'events'} shown`}
        className="audit-panel"
        action={
          <div className="filters">
            <SearchPill
              placeholder="Search actor, target, org, IP…"
              value={search}
              onChange={setSearch}
            />
            <label className="select-pill">
              <span>Resource</span>
              <select
                aria-label="Resource type"
                value={resourceFilter}
                onChange={(e) => setResourceFilter(e.target.value)}
              >
                <option value="">All</option>
                <option value="Value stream">Value stream</option>
                <option value="Organization">Organization</option>
                <option value="Subscription">Subscription</option>
                <option value="User & Role">User &amp; Role</option>
                <option value="Security & Auth">Security &amp; Auth</option>
                <option value="Study & Export">Study &amp; Export</option>
              </select>
            </label>
            <label className="select-pill">
              <span>Action</span>
              <select
                aria-label="Audit action"
                value={actionFilter}
                onChange={(e) => setActionFilter(e.target.value)}
              >
                <option value="">All</option>
                <option value="created">Created</option>
                <option value="updated">Updated</option>
                <option value="exported">Exported</option>
                <option value="auth">Auth</option>
                <option value="suspended">Flagged</option>
              </select>
            </label>
            <label className="select-pill">
              <span>Organization</span>
              <select
                aria-label="Organization filter"
                value={orgFilter}
                onChange={(e) => setOrgFilter(e.target.value)}
              >
                <option value="">All organizations</option>
                {uniqueOrgs.map((org) => (
                  <option key={org} value={org}>
                    {org}
                  </option>
                ))}
              </select>
            </label>
            <PillButton small icon="Download" onClick={handleExportCsv}>
              Export CSV
            </PillButton>
          </div>
        }
      >
        {filtered.length === 0 ? (
          <EmptyState
            title="No audit events match"
            description="Try clearing your search or switching resource and action filters."
          />
        ) : (
          <div
            className="table-scroll"
            tabIndex={0}
            role="region"
            aria-label="Audit log events table, scroll horizontally for all columns"
          >
            <table className="audit-table">
              <thead>
                <tr>
                  {['Event & Target', 'Actor', 'Action', 'Organization', 'Source & IP', 'Timestamp', 'Details'].map(
                    (label) => (
                      <th scope="col" key={label}>
                        {label}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {filtered.map((entry) => {
                  const meta = actionMeta[entry.action];
                  return (
                    <tr key={entry.id}>
                      <th scope="row">
                        <div className="audit-target-cell">
                          <span className="audit-target-title">{entry.target}</span>
                          <small>
                            {entry.resource_type} · <span className="mono">{entry.id}</span>
                          </small>
                        </div>
                      </th>
                      <td>
                        <div className="audit-actor">
                          <span className="audit-avatar">{entry.actor.initials}</span>
                          <div>
                            <strong>{entry.actor.name}</strong>
                            <small>{entry.actor.role}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <StatusChip status={meta.chip} label={meta.label} />
                      </td>
                      <td>
                        <span>{entry.organization}</span>
                        <small>{entry.summary}</small>
                      </td>
                      <td>
                        <span>{entry.source}</span>
                        <small className="mono">{entry.ip_address}</small>
                      </td>
                      <td>
                        <span className="mono date">{entry.timestamp.split(' ')[0]}</span>
                        <small>{entry.relativeTime}</small>
                      </td>
                      <td>
                        <div className="table-actions">
                          <PillButton small onClick={() => setSelected(entry)}>
                            Inspect
                          </PillButton>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className="subscription-banner">
          <div className="inline">
            <div className="icon-box">
              <Icon name="Lock" />
            </div>
            <div>
              <p className="muted">Compliance ledger</p>
              <h3>Immutable multi-tenant audit trail</h3>
            </div>
          </div>
          <div className="inline muted">
            <span>Actor identity</span>
            <span>·</span>
            <span>Field-level diffs</span>
            <span>·</span>
            <span>Source IP tracking</span>
          </div>
          <PillButton to="/profile?tab=security" small>
            Security &amp; 2FA settings
            <Icon name="ArrowUpRight" size={14} />
          </PillButton>
        </div>
      </Panel>

      <dialog
        ref={dialogRef}
        className="preview-dialog audit-dialog"
        onCancel={() => setSelected(null)}
        onClick={(e) => {
          if (e.target === e.currentTarget) setSelected(null);
        }}
      >
        {selected && (
          <>
            <div className="dialog-header">
              <div className="inline">
                <StatusChip
                  status={actionMeta[selected.action].chip}
                  label={actionMeta[selected.action].label}
                />
                <span className="mono muted">{selected.id}</span>
              </div>
              <button
                type="button"
                className="circle-button"
                aria-label="Close audit detail"
                onClick={() => setSelected(null)}
              >
                <Icon name="X" />
              </button>
            </div>

            <h2>{selected.target}</h2>
            <p className="muted">{selected.summary}</p>

            <dl className="audit-meta-grid">
              <div>
                <dt>Actor</dt>
                <dd>
                  {selected.actor.name} ({selected.actor.role})
                </dd>
              </div>
              <div>
                <dt>Actor Email</dt>
                <dd className="mono">{selected.actor.email}</dd>
              </div>
              <div>
                <dt>Organization</dt>
                <dd>{selected.organization}</dd>
              </div>
              <div>
                <dt>Resource Type</dt>
                <dd>{selected.resource_type}</dd>
              </div>
              <div>
                <dt>Timestamp</dt>
                <dd className="mono">{selected.timestamp}</dd>
              </div>
              <div>
                <dt>Source &amp; IP</dt>
                <dd className="mono">
                  {selected.source} · {selected.ip_address}
                </dd>
              </div>
            </dl>

            {selected.changes && selected.changes.length > 0 && (
              <div className="audit-diff-box">
                <span className="meta-label">Recorded Field Changes</span>
                <div className="audit-diff-list">
                  {selected.changes.map((c) => (
                    <div className="audit-diff-row" key={c.field}>
                      <code className="audit-diff-field">{c.field}</code>
                      <span className="audit-diff-before">{c.before}</span>
                      <Icon name="ArrowRight" size={13} />
                      <span className="audit-diff-after">{c.after}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="audit-dialog-actions">
              <PillButton
                icon="Copy"
                onClick={() => {
                  navigator.clipboard?.writeText(selected.id).catch(() => {});
                  showToast(`Copied event ID ${selected.id}.`);
                }}
              >
                Copy event ID
              </PillButton>
              <button
                type="button"
                className="pill-button dark"
                onClick={() => setSelected(null)}
              >
                Close
              </button>
            </div>
          </>
        )}
      </dialog>
    </>
  );
}
