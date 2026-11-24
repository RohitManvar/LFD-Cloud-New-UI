import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { organizations, pageDescriptions, platform } from '../data/mock';
import { EmptyState, IconCircleButton, PageHeading, PillButton, SearchPill, StatCard, StatusChip } from '../components/UI';
import { usePreview } from '../components/PreviewDialog';
export default function Organizations() {
  const [params] = useSearchParams();
  const [search, setSearch] = useState(params.get('q') || '');
  const [status, setStatus] = useState('');
  const preview = usePreview();
  const filtered = organizations.filter(o => (!status || o.status === status) && (o.name + ' ' + o.industry + ' ' + o.location).toLowerCase().includes(search.toLowerCase()));
  return <>
    <PageHeading description={pageDescriptions.Organizations} title="Organizations" actions={<>
      <PillButton icon="Upload" onClick={() => preview('Import organizations')}>Import</PillButton><PillButton icon="History" onClick={() => preview('Recently deleted organizations', 'No recently deleted organizations in this preview.')}>Recently deleted</PillButton><PillButton variant="blue" icon="Plus" onClick={() => preview('Create organization')}>Create organization</PillButton>
    </>} />
    <section className="stats-grid" aria-label="Organization summary">
      <StatCard label="Total organizations" value={platform.organizations} icon="Building2" />
      <StatCard label="Total value streams" value={platform.projects} icon="Workflow" />
      <StatCard label="Active" value={organizations.filter(o => o.status === 'active').length} dark icon="Check" />
      <StatCard label="Suspended" value={organizations.filter(o => o.status === 'suspended').length} hatched icon="CirclePause" />
    </section>
    <div className="section-heading filter-heading"><div><h2>All organizations</h2><p className="muted">{filtered.length} shown</p></div><div className="filters"><SearchPill value={search} onChange={setSearch} /><label className="select-pill"><span>Status</span><select aria-label="Organization status" value={status} onChange={e => setStatus(e.target.value)}><option value="">All</option><option value="active">Active</option><option value="suspended">Suspended</option></select></label></div></div>
    <div className="org-list">{filtered.map(org => <article className="org-card lift" key={org.org_id}>
      <div className="org-card-top"><span className="org-initial large">{org.name[0]}</span><div className="org-title"><div className="inline"><h3>{org.name}</h3><StatusChip status={org.status} /></div><p className="muted">{org.industry}{org.sub_sector && ' · ' + org.sub_sector}</p></div><div className="org-actions">
        <IconCircleButton icon="Pencil" label={'Edit ' + org.name} onClick={() => preview('Edit organization', org.name)} />
        <IconCircleButton icon="Download" label={'Export ' + org.name} onClick={() => preview('Export organization', org.name)} />
        <IconCircleButton icon="CirclePause" label={'Suspend ' + org.name} onClick={() => preview('Suspend organization', 'This preview does not change access to ' + org.name + '.')} />
        <IconCircleButton icon="Trash2" danger label={'Delete ' + org.name} onClick={() => preview('Delete organization', 'This preview does not delete ' + org.name + '.')} />
      </div></div>
      <div className="org-details"><dl className="info-band"><div><dt>Location</dt><dd>{org.location}</dd></div><div><dt>Created by</dt><dd>{org.created_by}</dd></div><div><dt>Created</dt><dd className="mono">{org.created_at}</dd></div></dl><div className="count-tiles">
        {[['Admins', org.admin_count], ['Users', org.user_count], ['Value streams', org.project_count]].map(([label, count]) => <div key={label}><span>{label}</span><strong>{count}</strong></div>)}
      </div></div>
    </article>)}{filtered.length === 0 && <div className="panel"><EmptyState /></div>}</div>
  </>;
}
