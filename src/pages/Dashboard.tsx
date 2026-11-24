import { activities, health, organizations, pageDescriptions, platform, usageTiles } from '../data/mock';
import Icon from '../components/Icon';
import { IconCircleButton, Meter, PageHeading, Panel, PillButton, SoftRow, StatCard, StatusChip } from '../components/UI';
export default function Dashboard() {
  return <>
    <PageHeading description={pageDescriptions.Dashboard} title="Welcome back, Rohit" actions={<PillButton variant="blue" icon="ArrowUpRight" to="/vsm">Launch VSM</PillButton>}>
      <Meter label="Services available" used={platform.services} limit={platform.max_services} left={<><b>0</b> coming soon</>} right={<><b>100%</b> live</>} />
      <Meter label="Organizations, plan limit" used={platform.organizations} limit={platform.max_orgs} blue left={<><b>41</b> remaining</>} right={<><b>18%</b> used</>} />
    </PageHeading>
    <section className="stats-grid" aria-label="Platform overview">
      <StatCard label="Organizations" value={platform.organizations} subline="All active" icon="Building2" to="/hub/organizations" />
      <StatCard label="Total users" value={platform.users} subline="Across all organizations" icon="Users" to="/hub/users" />
      <StatCard label="Value streams" value={platform.projects} subline="Across all organizations" icon="Workflow" to="/services" />
      <StatCard label="Active services" value={platform.services} suffix={'/' + platform.max_services} subline="All services live" icon="Layers3" dark to="/services" />
    </section>
    <div className="dashboard-columns">
      <Panel title="Recent organizations" subtitle="5 newest of 9" action={<IconCircleButton label="View all organizations" to="/hub/organizations" />}>
        <div className="stack recent-list">{organizations.slice(0, 5).map(org => <SoftRow key={org.org_id}><span className="org-initial">{org.name[0]}</span><div className="row-copy"><h3>{org.name}</h3><p className="muted">{org.industry}</p></div><StatusChip status="active" /><IconCircleButton label={'View ' + org.name} to={'/hub/organizations?q=' + encodeURIComponent(org.name)} /></SoftRow>)}</div>
      </Panel>
      <Panel title="Platform activity" subtitle="Latest changes across all organizations" action={<PillButton small to="/audit-logs">Audit log<Icon name="ArrowUpRight" size={14} /></PillButton>}>
        <div className="activity-list">{activities.map((item, i) => <div className="activity-row" key={i}><span className={'activity-symbol ' + item.action}><Icon name={item.kind === 'Organization' ? 'Building2' : 'Workflow'} size={16} /></span><div className="row-copy"><h3>{item.title}{item.organization && <span className="activity-org"> · {item.organization}</span>}</h3><div className="activity-meta"><span>{item.kind}</span><StatusChip status={item.action} />{item.status && <StatusChip status={item.status} />}</div></div><time>{item.time}</time></div>)}</div>
      </Panel>
    </div>
    <div className="usage-columns">
      <Panel title="Platform usage" subtitle="Against plan limits" action={<IconCircleButton label="View plans and limits" to="/plans" />}>
        <div className="usage-grid">{usageTiles.map(tile => <div className="usage-tile" key={tile.label}><div className="between"><span className="inline"><Icon name={tile.icon} size={16} />{tile.label}</span><span className="mono muted">{tile.percent}%</span></div><div className="mini-track"><span style={{ width: tile.percent + '%' }} /></div><span className="mono">{tile.used} <span className="muted">/ {tile.limit.toLocaleString('en-IN')}</span></span></div>)}</div>
        <div className="subscription-banner"><div className="inline"><div className="icon-box"><Icon name="CreditCard" /></div><div><p className="muted">Subscription plan</p><h3>{platform.plan}</h3></div></div><div className="inline muted"><span>{platform.organizations} organizations</span><span>{platform.plan_users} users</span></div><PillButton to="/hub/subscriptions" small>View subscriptions<Icon name="ArrowUpRight" size={14} /></PillButton></div>
      </Panel>
      <Panel title="System health" subtitle="All systems operational" action={<StatusChip status="active" label="Live" />}>
        <div className="stack">{health.map(item => <SoftRow key={item.label}><Icon name={item.icon} /><span className="row-copy">{item.label}</span><span className="health-value"><i />{item.value}</span></SoftRow>)}</div>
      </Panel>
    </div>
  </>;
}
