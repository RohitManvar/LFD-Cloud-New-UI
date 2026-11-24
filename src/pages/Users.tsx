import { useState } from 'react';
import { organizations, pageDescriptions, userSummary } from '../data/mock';
import Icon from '../components/Icon';
import { EmptyState, IconCircleButton, PageHeading, Panel, PillTabs, SearchPill, StatusChip, cssVar } from '../components/UI';
import { usePreview } from '../components/PreviewDialog';
export default function Users() {
  const [tab, setTab] = useState('manage');
  const [search, setSearch] = useState('');
  const preview = usePreview();
  const filtered = organizations.filter(o => o.name.toLowerCase().includes(search.toLowerCase()));
  const showInternal = 'internal team'.includes(search.toLowerCase());
  return <>
    <PageHeading description={pageDescriptions.Users} title="Users" actions={<PillTabs label="User views" active={tab} onChange={setTab} tabs={[{ id: 'manage', label: 'Manage users' }, { id: 'pending', label: 'Pending approvals', count: userSummary.pending }, { id: 'deleted', label: 'Recently deleted' }]} />} />
    <section className="user-summary" aria-label="User summary">
      <div className="summary-card lift"><div className="between"><span>Total users</span><span className="muted">by role</span></div><div className="big-number">{userSummary.total}</div><div className="role-bar">{userSummary.roles.map(role => <span key={role.label} style={{ ...cssVar(role.color), flex: role.count }} />)}</div><div className="role-legend">{userSummary.roles.map(role => <div key={role.label}><span className="inline"><i style={cssVar(role.color)} />{role.label}</span><span className="mono">{role.count}</span></div>)}</div></div>
      <div className="summary-card lift"><div className="between"><span>Account type</span><span className="muted">internal vs client</span></div><div className="account-types"><div><span className="icon-box"><Icon name="ShieldCheck" /></span><div className="big-number">{userSummary.internal}</div><span className="muted">Internal</span></div><div><span className="icon-box blue"><Icon name="Building2" /></span><div className="big-number">{userSummary.client}</div><span className="muted">Client</span></div></div></div>
      <div className="summary-card dark lift"><div className="between"><span>Status</span><span className="muted">all accounts</span></div><div className="status-summary">{[['Active', userSummary.active], ['Inactive', userSummary.inactive], ['Pending', userSummary.pending]].map(([label, count]) => <div key={label}><span><i className={label === 'Active' ? 'live-dot' : 'neutral-dot'} />{label}</span><strong>{count}</strong></div>)}</div></div>
    </section>
    {tab !== 'manage' ? <Panel><EmptyState title={tab === 'pending' ? 'No pending approvals' : 'No recently deleted users'} description={tab === 'pending' ? 'You are all caught up. New requests will appear here.' : 'Recently deleted accounts will appear here.'} /></Panel> : <>
      <div className="section-heading filter-heading"><div><h2>Users by organization</h2><p className="muted">{filtered.length + Number(showInternal)} groups</p></div><SearchPill value={search} onChange={setSearch} /></div>
      <div className="user-org-grid">
        {showInternal && <article className="user-org-card dark lift"><div className="between"><span className="icon-box"><Icon name="Users" size={24} /></span><IconCircleButton label="View internal team" onClick={() => preview('Internal team', '3 internal users across all organizations.')} /></div><div className="user-count"><span>{userSummary.internal}</span><span>users</span></div><h3>Internal team</h3><p className="muted">Across all organizations</p></article>}
        {filtered.map(org => <article className="user-org-card lift" key={org.org_id}><div className="between"><span className="org-initial">{org.initials}</span><IconCircleButton label={'View users at ' + org.name} onClick={() => preview(org.name, org.preview_user_count + ' users in this organization.')} /></div><div className={'user-count ' + (org.preview_user_count === 0 ? 'zero' : '')}><span>{org.preview_user_count}</span><span>{org.preview_user_count === 1 ? 'user' : 'users'}</span></div><h3>{org.name}</h3>{org.org_type === 'internal' && <StatusChip status="internal" />}</article>)}
      </div>{filtered.length === 0 && !showInternal && <Panel><EmptyState /></Panel>}
    </>}
  </>;
}
