import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  auditLogs,
  modules,
  navigation,
  organizations,
  pageDescriptions,
  projects,
  services,
  subscriptions,
  profile,
} from '../data/mock';
import Icon from '../components/Icon';
import {
  EmptyState,
  IconCircleButton,
  Meter,
  PageHeading,
  Panel,
  PillButton,
  PillTabs,
  SoftRow,
  StatCard,
  StatusChip,
} from '../components/UI';
import { useNotifications } from './Notifications';
import { usePreview } from '../components/PreviewDialog';

const servicePaths: Record<number, string> = {
  1: '/training',
  2: '/ppq',
  3: '/vsi',
  4: '/vsm',
  5: '/flow-management',
  6: '/capacity',
  7: '/equipment',
  8: '/manpower',
  9: '/supply-chain',
  10: '/supermarket',
  11: '/material-handling',
  12: '/layout-design',
  13: '/visual',
  14: '/risk',
  15: '/project-plan',
};

const studyShortcuts = [
  {
    id: 'study-gr24',
    title: 'Transmission gear — GR-24 family',
    subtitle: 'Sahyadri Auto Components Pvt. Ltd. · Chakan MIDC, Pune · Step 04 VSM',
    status: 'in-progress',
    label: 'Sample VSM',
    to: '/vsm/current',
    icon: 'Workflow',
  },
  {
    id: 'study-risk',
    title: 'Plant relocation · Phase 01',
    subtitle: 'Sahyadri Auto Components Pvt. Ltd. · Chakan MIDC, Pune · Step 14 Risk Assessment',
    status: 'in-progress',
    label: 'Risk Study',
    to: '/risk',
    icon: 'ShieldAlert',
  },
];

const directoryPeople = [
  {
    id: 'usr-rohit',
    name: profile.full_name,
    email: profile.email,
    role: 'Super Admin',
    type: 'internal',
    org: profile.organization,
    to: '/profile',
  },
  {
    id: 'usr-priya',
    name: 'Priya Deshmukh',
    email: 'priya.d@sahyadriauto.in',
    role: 'Org Admin',
    type: 'client',
    org: 'Sahyadri Auto Components Pvt. Ltd.',
    to: '/hub/users',
  },
  {
    id: 'usr-ankit',
    name: 'Ankit Mehta',
    email: 'ankit.m@shivamshree.com',
    role: 'Org Admin',
    type: 'client',
    org: 'SHIVAMSHREE BUSINESSES LTD.',
    to: '/hub/users',
  },
  {
    id: 'usr-vikram',
    name: 'Vikram Singh',
    email: 'v.singh@kalingametal.in',
    role: 'Org Admin',
    type: 'client',
    org: 'Kalinga Metal Treatment',
    to: '/hub/users',
  },
];

const quickChips = ['Sahyadri', 'VSM', 'PPQ', 'Trial', 'Risk', 'Gujarat', 'AI-assisted', 'Audit'];

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQ = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQ);
  const [scope, setScope] = useState<'all' | 'orgs' | 'services' | 'streams' | 'accounts' | 'logs'>('all');
  const { notifications } = useNotifications();
  const preview = usePreview();

  useEffect(() => {
    const paramQ = searchParams.get('q') || '';
    if (paramQ !== query) setQuery(paramQ);
  }, [searchParams]);

  const updateQuery = (next: string) => {
    setQuery(next);
    if (next.trim()) setSearchParams({ q: next }, { replace: true });
    else setSearchParams({}, { replace: true });
  };

  const q = query.trim().toLowerCase();

  const matchedOrgs = organizations.filter(
    (o) =>
      !q ||
      (o.name + ' ' + o.industry + ' ' + o.sub_sector + ' ' + o.location + ' ' + o.org_type + ' ' + o.created_by)
        .toLowerCase()
        .includes(q)
  );

  const matchedServices = services.filter(
    (s) =>
      !q ||
      (`step ${String(s.step).padStart(2, '0')} ${s.title} ${s.short} ${s.ai ? 'ai-assisted ai' : 'manual'}`)
        .toLowerCase()
        .includes(q)
  );

  const matchedModules = modules.filter(
    (m) => !q || (m.title + ' ' + m.short + ' module').toLowerCase().includes(q)
  );

  const combinedStreams = [
    ...projects.map((p) => {
      const org = organizations.find((o) => o.org_id === p.org_id);
      return {
        id: p.project_id,
        title: p.project_name,
        subtitle: `${org?.name || 'Organization'} · ${p.progress}% complete`,
        status: 'in-progress',
        label: p.status,
        to: p.project_id === 'project-wire' ? '/vsi/grouping' : '/vsm',
        icon: 'Workflow',
      };
    }),
    ...studyShortcuts,
  ];
  const matchedStreams = combinedStreams.filter(
    (st) => !q || (st.title + ' ' + st.subtitle + ' ' + st.label + ' value stream').toLowerCase().includes(q)
  );

  const matchedSubscriptions = subscriptions.filter(
    (sub) =>
      !q ||
      (sub.org_name + ' ' + sub.plan_name + ' ' + sub.effective_status + ' subscription')
        .toLowerCase()
        .includes(q)
  );

  const matchedPeople = directoryPeople.filter(
    (u) => !q || (u.name + ' ' + u.email + ' ' + u.role + ' ' + u.org + ' ' + u.type).toLowerCase().includes(q)
  );

  const matchedPages = navigation.filter(
    (n) => n.path !== '/search' && (!q || n.label.toLowerCase().includes(q))
  );

  const matchedNotifications = notifications.filter(
    (n) =>
      n.status !== 'archived' &&
      (!q || (n.title + ' ' + n.message + ' ' + (n.organization || '') + ' ' + n.category).toLowerCase().includes(q))
  );

  const matchedAudits = auditLogs.filter(
    (a) =>
      !q ||
      (a.id + ' ' + a.target + ' ' + a.summary + ' ' + a.actor.name + ' ' + a.organization + ' ' + a.action + ' audit')
        .toLowerCase()
        .includes(q)
  );

  const totalIndexed =
    organizations.length +
    services.length +
    modules.length +
    combinedStreams.length +
    subscriptions.length +
    directoryPeople.length +
    notifications.filter((n) => n.status !== 'archived').length +
    auditLogs.length;

  const totalMatches =
    matchedOrgs.length +
    matchedServices.length +
    matchedModules.length +
    matchedStreams.length +
    matchedSubscriptions.length +
    matchedPeople.length +
    matchedNotifications.length +
    matchedAudits.length;

  const showOrgs = scope === 'all' || scope === 'orgs';
  const showServices = scope === 'all' || scope === 'services';
  const showStreams = scope === 'all' || scope === 'streams';
  const showAccounts = scope === 'all' || scope === 'accounts';
  const showLogs = scope === 'all' || scope === 'logs';

  const visibleMatchesCount =
    (showOrgs ? matchedOrgs.length : 0) +
    (showServices ? matchedServices.length + matchedModules.length : 0) +
    (showStreams ? matchedStreams.length : 0) +
    (showAccounts ? matchedSubscriptions.length + matchedPeople.length : 0) +
    (showLogs ? matchedNotifications.length + matchedAudits.length : 0);

  return (
    <>
      <PageHeading
        description={pageDescriptions.Search}
        title="Search"
      >
        <Meter
          label="Indexed workspace items"
          used={totalMatches}
          limit={totalIndexed}
          blue
          left={
            <>
              <b>{totalMatches}</b> matching
            </>
          }
          right={
            <>
              <b>{totalIndexed}</b> indexed
            </>
          }
        />
      </PageHeading>

      <Panel className="search-command-panel">
        <div className="search-command-bar">
          <label className="search-pill search-hero-pill">
            <Icon name="Search" size={18} />
            <input
              type="search"
              autoFocus
              aria-label="Search organizations, value streams, LFD steps, users, and audit logs"
              placeholder="Search organizations, value streams, LFD steps, users, subscriptions, or audit IDs…"
              value={query}
              onChange={(e) => updateQuery(e.target.value)}
            />
            {query && (
              <button
                type="button"
                className="search-clear-btn"
                aria-label="Clear search"
                onClick={() => updateQuery('')}
              >
                <Icon name="X" size={14} />
              </button>
            )}
          </label>
          {query && (
            <PillButton icon="X" onClick={() => updateQuery('')}>
              Reset
            </PillButton>
          )}
        </div>

        <div className="search-controls-row">
          <div className="search-scope-tabs">
            <PillTabs
              label="Search scopes"
              active={scope}
              onChange={(s) => setScope(s as typeof scope)}
              tabs={[
                { id: 'all', label: 'All', count: totalMatches },
                { id: 'orgs', label: 'Organizations', count: matchedOrgs.length },
                { id: 'services', label: 'Services', count: matchedServices.length + matchedModules.length },
                { id: 'streams', label: 'Streams', count: matchedStreams.length },
                { id: 'accounts', label: 'Users & Plans', count: matchedPeople.length + matchedSubscriptions.length },
                { id: 'logs', label: 'Alerts & Logs', count: matchedNotifications.length + matchedAudits.length },
              ]}
            />
          </div>
        </div>

        <div className="search-chip-row">
          <span className="muted">Quick filters:</span>
          {quickChips.map((chip) => (
            <button
              key={chip}
              type="button"
              className={'search-quick-chip' + (query.toLowerCase() === chip.toLowerCase() ? ' active' : '')}
              onClick={() => updateQuery(query.toLowerCase() === chip.toLowerCase() ? '' : chip)}
            >
              {chip}
            </button>
          ))}
        </div>
      </Panel>

      {!q && scope === 'all' && (
        <section className="stats-grid" aria-label="Workspace index summary">
          <StatCard label="Organizations" value={organizations.length} subline="Internal & client plants" icon="Building2" to="/hub/organizations" />
          <StatCard label="LFD services" value={services.length} subline="15-step lean framework" icon="Layers3" to="/services" />
          <StatCard label="Value streams" value={combinedStreams.length} subline="Active preview studies" icon="Workflow" to="/vsm" />
          <StatCard label="Audit events" value={auditLogs.length} subline="Logged platform mutations" icon="History" dark to="/audit-logs" />
        </section>
      )}

      {visibleMatchesCount === 0 ? (
        <Panel>
          <EmptyState
            title="No matching workspace records"
            description={`Nothing in LFD Cloud matched "${query}". Try a plant name, service step (like VSM or PPQ), or clear your scope filter.`}
          />
          <div className="center">
            <PillButton onClick={() => { updateQuery(''); setScope('all'); }}>
              Clear search &amp; filters
            </PillButton>
          </div>
        </Panel>
      ) : (
        <div className="search-results-stack">
          {showOrgs && matchedOrgs.length > 0 && (
            <Panel
              title="Organizations"
              subtitle={`${matchedOrgs.length} ${matchedOrgs.length === 1 ? 'organization' : 'organizations'}`}
              action={<PillButton small to="/hub/organizations">All organizations<Icon name="ArrowUpRight" size={13} /></PillButton>}
            >
              <div className="search-two-col">
                {matchedOrgs.map((org) => (
                  <SoftRow key={org.org_id}>
                    <span className="org-initial">{org.initials}</span>
                    <div className="row-copy">
                      <div className="inline">
                        <h3>{org.name}</h3>
                        <StatusChip status={org.status} />
                        {org.org_type === 'internal' && <StatusChip status="internal" />}
                      </div>
                      <p className="muted">
                        {org.industry} · {org.location} · {org.project_count} value streams
                      </p>
                    </div>
                    <IconCircleButton
                      label={'Inspect ' + org.name}
                      to={'/hub/organizations?q=' + encodeURIComponent(org.name)}
                    />
                  </SoftRow>
                ))}
              </div>
            </Panel>
          )}

          {showStreams && matchedStreams.length > 0 && (
            <Panel
              title="Value Streams & Active Studies"
              subtitle={`${matchedStreams.length} ${matchedStreams.length === 1 ? 'study' : 'studies'}`}
              action={<PillButton small to="/vsm">Open VSM<Icon name="ArrowUpRight" size={13} /></PillButton>}
            >
              <div className="stack">
                {matchedStreams.map((st) => (
                  <SoftRow key={st.id}>
                    <span className="icon-box blue">
                      <Icon name={st.icon} size={18} />
                    </span>
                    <div className="row-copy">
                      <div className="inline">
                        <h3>{st.title}</h3>
                        <StatusChip status={st.status} label={st.label} />
                      </div>
                      <p className="muted">{st.subtitle}</p>
                    </div>
                    <IconCircleButton label={'Open ' + st.title} to={st.to} />
                  </SoftRow>
                ))}
              </div>
            </Panel>
          )}

          {showServices && (matchedServices.length > 0 || matchedModules.length > 0) && (
            <Panel
              title="LFD Methodology & Modules"
              subtitle={`${matchedServices.length} steps · ${matchedModules.length} supporting modules`}
              action={<PillButton small to="/services">Full framework<Icon name="ArrowUpRight" size={13} /></PillButton>}
            >
              <div className="search-two-col">
                {matchedServices.map((service) => (
                  <SoftRow key={service.step}>
                    <span className="icon-box">
                      <Icon name={service.icon} size={18} />
                    </span>
                    <div className="row-copy">
                      <div className="inline">
                        <h3>
                          <span className="mono muted">Step {String(service.step).padStart(2, '0')}</span> · {service.title}
                        </h3>
                        {service.ai && (
                          <span className="ai-chip">
                            <Icon name="Sparkles" size={11} />
                            AI-assisted
                          </span>
                        )}
                      </div>
                      <p className="muted">{service.short}</p>
                    </div>
                    <IconCircleButton
                      label={'Open ' + service.title}
                      to={servicePaths[service.step] || '/services'}
                    />
                  </SoftRow>
                ))}
                {matchedModules.map((mod) => (
                  <SoftRow key={mod.title}>
                    <span className="icon-box">
                      <Icon name={mod.icon} size={18} />
                    </span>
                    <div className="row-copy">
                      <div className="inline">
                        <h3>{mod.title}</h3>
                        <span className="notif-cat-chip">Supporting module</span>
                      </div>
                      <p className="muted">{mod.short}</p>
                    </div>
                    <IconCircleButton
                      label={'Preview ' + mod.title}
                      onClick={() => preview(mod.title, mod.short)}
                    />
                  </SoftRow>
                ))}
              </div>
            </Panel>
          )}

          {showAccounts && (matchedPeople.length > 0 || matchedSubscriptions.length > 0) && (
            <Panel
              title="Users & Subscriptions"
              subtitle={`${matchedPeople.length} users · ${matchedSubscriptions.length} subscriptions`}
              action={<PillButton small to="/hub/subscriptions">View subscriptions<Icon name="ArrowUpRight" size={13} /></PillButton>}
            >
              <div className="search-two-col">
                {matchedPeople.map((person) => (
                  <SoftRow key={person.id}>
                    <span className="icon-box">
                      <Icon name="UserCheck" size={18} />
                    </span>
                    <div className="row-copy">
                      <div className="inline">
                        <h3>{person.name}</h3>
                        <StatusChip status={person.type === 'internal' ? 'internal' : 'active'} label={person.role} />
                      </div>
                      <p className="muted">
                        {person.email} · {person.org}
                      </p>
                    </div>
                    <IconCircleButton label={'View ' + person.name} to={person.to} />
                  </SoftRow>
                ))}
                {matchedSubscriptions.map((sub) => (
                  <SoftRow key={sub.subscription_id}>
                    <span className="icon-box">
                      <Icon name="CreditCard" size={18} />
                    </span>
                    <div className="row-copy">
                      <div className="inline">
                        <h3>{sub.org_name}</h3>
                        <StatusChip status={sub.effective_status} />
                      </div>
                      <p className="muted">
                        {sub.plan_name} plan ·{' '}
                        {sub.days_remaining > 0 ? `${sub.days_remaining} days left` : 'Expired'} ·{' '}
                        {sub.usage.projects.used}/{sub.usage.projects.limit} streams
                      </p>
                    </div>
                    <IconCircleButton label={'Manage ' + sub.org_name} to="/hub/subscriptions" />
                  </SoftRow>
                ))}
              </div>
            </Panel>
          )}

          {showLogs && (matchedNotifications.length > 0 || matchedAudits.length > 0) && (
            <Panel
              title="Notifications & Audit Trail"
              subtitle={`${matchedNotifications.length} alerts · ${matchedAudits.length} audit entries`}
              action={<PillButton small to="/audit-logs">Open audit log<Icon name="ArrowUpRight" size={13} /></PillButton>}
            >
              <div className="stack">
                {matchedNotifications.map((n) => (
                  <SoftRow key={n.id}>
                    <span className={'icon-box notif-icon ' + n.priority}>
                      <Icon name="Bell" size={17} />
                    </span>
                    <div className="row-copy">
                      <div className="inline">
                        <h3>{n.title}</h3>
                        <StatusChip status={n.status === 'unread' ? 'updated' : 'active'} label={n.status} />
                      </div>
                      <p className="muted">
                        {n.organization ? `${n.organization} · ` : ''}
                        {n.time}
                      </p>
                    </div>
                    <IconCircleButton label="View notifications" to="/hub/notifications" />
                  </SoftRow>
                ))}
                {matchedAudits.map((a) => (
                  <SoftRow key={a.id}>
                    <span className="icon-box">
                      <Icon name="History" size={17} />
                    </span>
                    <div className="row-copy">
                      <div className="inline">
                        <h3>{a.target}</h3>
                        <span className="mono muted">{a.id}</span>
                        <StatusChip status={a.action === 'suspended' ? 'suspended' : a.action === 'exported' ? 'internal' : a.action === 'auth' ? 'active' : a.action} />
                      </div>
                      <p className="muted">
                        {a.actor.name} · {a.organization} · {a.relativeTime}
                      </p>
                    </div>
                    <IconCircleButton label={'Inspect ' + a.id} to="/audit-logs" />
                  </SoftRow>
                ))}
              </div>
            </Panel>
          )}

          {scope === 'all' && matchedPages.length > 0 && q && (
            <Panel title="Navigation Pages" subtitle={`${matchedPages.length} quick links`}>
              <div className="search-chip-row">
                {matchedPages.map((nav) => (
                  <PillButton key={nav.path} small icon={nav.icon} to={nav.path}>
                    {nav.label}
                  </PillButton>
                ))}
              </div>
            </Panel>
          )}
        </div>
      )}
    </>
  );
}
