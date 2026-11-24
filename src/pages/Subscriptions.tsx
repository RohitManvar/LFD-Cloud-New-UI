import { useState } from 'react';
import { pageDescriptions, subscriptions, subscriptionSummary } from '../data/mock';
import { EmptyState, IconCircleButton, Meter, PageHeading, Panel, PillButton, PillTabs, SearchPill, StatCard, StatusChip } from '../components/UI';
import { usePreview } from '../components/PreviewDialog';
export default function Subscriptions() {
  const [tab, setTab] = useState('subscriptions');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const preview = usePreview();
  const filtered = subscriptions.filter(s => s.org_name.toLowerCase().includes(search.toLowerCase()) && (!status || (status === 'expiring' ? s.effective_status === 'active' && s.days_remaining <= 30 : s.effective_status === status)));
  const date = (value: string) => new Date(value + 'T00:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
  return <>
    <PageHeading description={pageDescriptions.Subscriptions} title="Subscriptions" actions={<PillTabs label="Subscription views" active={tab} onChange={setTab} tabs={[{ id: 'subscriptions', label: 'Subscriptions' }, { id: 'plans', label: 'Plans' }]} />}>
      <Meter label="Subscriptions in good standing" used={subscriptionSummary.active} limit={subscriptions.length} left={<><b>{subscriptionSummary.active}</b> active</>} right={<><b>{subscriptionSummary.expired}</b> expired</>} />
    </PageHeading>
    {tab === 'plans' ? <Panel><EmptyState title="Design coming soon" description="Plans will be available here in a future design preview." /><div className="center"><PillButton to="/plans">Plans & Limits</PillButton></div></Panel> : <>
      <section className="stats-grid" aria-label="Subscription summary"><StatCard label="Active" value={subscriptionSummary.active} subline="Current subscriptions" icon="Check" /><StatCard label="Expiring soon" value={subscriptionSummary.expiring} subline="Within 30 days" icon="History" /><StatCard label="Expired" value={subscriptionSummary.expired} subline="Need renewal" icon="CirclePause" dark /><StatCard label="Monthly recurring revenue" value={'₹' + subscriptionSummary.mrr} subline="This month: ₹0" icon="CreditCard" /></section>
      <Panel title="All subscriptions" subtitle={filtered.length + ' organizations'} action={<div className="filters"><SearchPill placeholder="Search organization" value={search} onChange={setSearch} /><label className="select-pill"><span>Status</span><select aria-label="Subscription status" value={status} onChange={e => setStatus(e.target.value)}><option value="">All</option><option value="active">Active</option><option value="expiring">Expiring soon</option><option value="expired">Expired</option></select></label></div>} className="subscriptions-panel">
        <div className="table-scroll" tabIndex={0} role="region" aria-label="Subscriptions table, scroll horizontally for all columns"><table><thead><tr>{['Organization', 'Plan', 'Status', 'Expires', 'Users', 'Streams', 'Actions'].map(label => <th scope="col" key={label}>{label}</th>)}</tr></thead><tbody>{filtered.map(sub => <tr key={sub.subscription_id}>
          <th scope="row">{sub.org_name}</th><td><span>{sub.plan_name}</span><small>Payment waived</small></td><td><StatusChip status={sub.effective_status} /></td><td><span className="mono date">{date(sub.end_date)}</span><small className={sub.days_remaining > 0 && sub.days_remaining <= 7 ? 'orange-text' : ''}>{sub.days_remaining > 0 ? sub.days_remaining + ' days left' : 'Ended'}</small></td>
          <td><span className="mono">{sub.usage.users.used}<span className="muted"> / {sub.usage.users.limit}</span></span></td>
          <td><span className={'mono ' + (sub.usage.projects.used > sub.usage.projects.limit ? 'orange-text' : '')}>{sub.usage.projects.used}<span className="muted"> / {sub.usage.projects.limit}</span></span><small className={sub.usage.projects.used > sub.usage.projects.limit ? 'orange-text' : ''}>{sub.usage.projects.used > sub.usage.projects.limit ? 'Over limit' : 'At limit'}</small></td>
          <td><div className="table-actions">{['Plan', 'Renew', 'Extend'].map(action => <PillButton key={action} small onClick={() => preview(action + ' subscription', sub.org_name)}>{action}</PillButton>)}<IconCircleButton icon="CirclePause" danger label={'Suspend subscription for ' + sub.org_name} onClick={() => preview('Suspend subscription', sub.org_name)} /><IconCircleButton icon="History" label={'Subscription history for ' + sub.org_name} onClick={() => preview('Subscription history', sub.org_name)} /></div></td>
        </tr>)}</tbody></table></div>{filtered.length === 0 && <EmptyState />}
      </Panel>
    </>}
  </>;
}
