import { createContext, useContext, useState, type ReactNode } from 'react';
import {
  initialNotifications,
  pageDescriptions,
  type NotificationCategory,
  type NotificationItem,
  type NotificationPriority,
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
  SearchPill,
  StatCard,
  StatusChip,
} from '../components/UI';

interface NotificationsCtxValue {
  notifications: NotificationItem[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  toggleRead: (id: string) => void;
  markAllRead: () => void;
  archiveNotification: (id: string) => void;
  restoreNotification: (id: string) => void;
  clearArchived: () => void;
}

const NotificationsCtx = createContext<NotificationsCtxValue>({
  notifications: initialNotifications,
  unreadCount: 0,
  markAsRead: () => {},
  toggleRead: () => {},
  markAllRead: () => {},
  archiveNotification: () => {},
  restoreNotification: () => {},
  clearArchived: () => {},
});

export const useNotifications = () => useContext(NotificationsCtx);

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);

  const unreadCount = notifications.filter((n) => n.status === 'unread').length;

  const markAsRead = (id: string) =>
    setNotifications((prev) =>
      prev.map((n) => (n.id === id && n.status === 'unread' ? { ...n, status: 'read' } : n))
    );

  const toggleRead = (id: string) =>
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id
          ? { ...n, status: n.status === 'unread' ? 'read' : 'unread' }
          : n
      )
    );

  const markAllRead = () =>
    setNotifications((prev) =>
      prev.map((n) => (n.status === 'unread' ? { ...n, status: 'read' } : n))
    );

  const archiveNotification = (id: string) =>
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, status: 'archived' } : n))
    );

  const restoreNotification = (id: string) =>
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, status: 'read' } : n))
    );

  const clearArchived = () =>
    setNotifications((prev) => prev.filter((n) => n.status !== 'archived'));

  return (
    <NotificationsCtx.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        toggleRead,
        markAllRead,
        archiveNotification,
        restoreNotification,
        clearArchived,
      }}
    >
      {children}
    </NotificationsCtx.Provider>
  );
}

const categoryLabels: Record<NotificationCategory, string> = {
  subscriptions: 'Subscriptions',
  value_streams: 'Value Streams',
  risk: 'Risk & Compliance',
  organizations: 'Organizations',
  system: 'System',
};

const priorityMeta: Record<NotificationPriority, { chip: string; label: string }> = {
  urgent: { chip: 'expired', label: 'Urgent' },
  warning: { chip: 'in-progress', label: 'Attention' },
  info: { chip: 'updated', label: 'Update' },
};

export default function Notifications() {
  const {
    notifications,
    unreadCount,
    markAsRead,
    toggleRead,
    markAllRead,
    archiveNotification,
    restoreNotification,
    clearArchived,
  } = useNotifications();

  const [tab, setTab] = useState<'all' | 'unread' | 'archived'>('all');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('');
  const [priority, setPriority] = useState<string>('');

  const activeItems = notifications.filter((n) => n.status !== 'archived');
  const archivedItems = notifications.filter((n) => n.status === 'archived');
  const readCount = activeItems.filter((n) => n.status === 'read').length;

  const baseList =
    tab === 'unread'
      ? activeItems.filter((n) => n.status === 'unread')
      : tab === 'archived'
      ? archivedItems
      : activeItems;

  const filtered = baseList.filter((n) => {
    const matchesSearch = (n.title + ' ' + n.message + ' ' + (n.organization || ''))
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesCat = !category || n.category === category;
    const matchesPri = !priority || n.priority === priority;
    return matchesSearch && matchesCat && matchesPri;
  });

  const subscriptionAlerts = activeItems.filter((n) => n.category === 'subscriptions').length;
  const workflowUpdates = activeItems.filter(
    (n) => n.category === 'value_streams' || n.category === 'risk'
  ).length;
  const urgentCount = activeItems.filter((n) => n.priority === 'urgent').length;

  return (
    <>
      <PageHeading
        description={pageDescriptions.Notifications}
        title="Notifications"
        actions={
          <PillTabs
            label="Notification views"
            active={tab}
            onChange={(t) => setTab(t as 'all' | 'unread' | 'archived')}
            tabs={[
              { id: 'all', label: 'All updates', count: activeItems.length },
              { id: 'unread', label: 'Unread', count: unreadCount },
              { id: 'archived', label: 'Archived', count: archivedItems.length },
            ]}
          />
        }
      >
        <Meter
          label="Reviewed notifications"
          used={readCount}
          limit={Math.max(1, activeItems.length)}
          blue
          left={
            <>
              <b>{unreadCount}</b> unread
            </>
          }
          right={
            <>
              <b>{readCount}</b> reviewed
            </>
          }
        />
      </PageHeading>

      <section className="stats-grid" aria-label="Notification summary">
        <StatCard
          label="Unread alerts"
          value={unreadCount}
          subline={unreadCount === 0 ? 'All caught up' : 'Require review'}
          icon="Bell"
        />
        <StatCard
          label="Subscriptions & limits"
          value={subscriptionAlerts}
          subline="Renewals & quotas"
          icon="CreditCard"
          to="/hub/subscriptions"
        />
        <StatCard
          label="Streams & risk"
          value={workflowUpdates}
          subline="VSM, VSI & RPN flags"
          icon="Workflow"
          to="/vsm"
        />
        <StatCard
          label="Urgent action"
          value={urgentCount}
          subline="Expiring & critical items"
          icon="CircleAlert"
          dark
        />
      </section>

      <Panel
        title={
          tab === 'unread'
            ? 'Unread alerts'
            : tab === 'archived'
            ? 'Archived notifications'
            : 'Activity & alerts'
        }
        subtitle={`${filtered.length} ${filtered.length === 1 ? 'notification' : 'notifications'} shown`}
        className="notifications-panel"
        action={
          <div className="filters">
            <SearchPill
              placeholder="Search alerts, orgs…"
              value={search}
              onChange={setSearch}
            />
            <label className="select-pill">
              <span>Category</span>
              <select
                aria-label="Notification category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">All</option>
                <option value="subscriptions">Subscriptions</option>
                <option value="value_streams">Value Streams</option>
                <option value="risk">Risk &amp; Compliance</option>
                <option value="organizations">Organizations</option>
                <option value="system">System</option>
              </select>
            </label>
            <label className="select-pill">
              <span>Priority</span>
              <select
                aria-label="Notification priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="">All</option>
                <option value="urgent">Urgent</option>
                <option value="warning">Attention</option>
                <option value="info">Update</option>
              </select>
            </label>
            {tab !== 'archived' && unreadCount > 0 && (
              <PillButton small icon="CheckCheck" onClick={markAllRead}>
                Mark all read
              </PillButton>
            )}
            {tab === 'archived' && archivedItems.length > 0 && (
              <PillButton small icon="Trash2" onClick={clearArchived}>
                Clear archive
              </PillButton>
            )}
          </div>
        }
      >
        {filtered.length === 0 ? (
          <EmptyState
            title={
              tab === 'unread' && !search && !category && !priority
                ? 'No new notifications'
                : tab === 'archived' && !search && !category && !priority
                ? 'Archive is empty'
                : 'No matching notifications'
            }
            description={
              tab === 'unread' && !search && !category && !priority
                ? "You're all caught up across every organization and value stream."
                : tab === 'archived' && !search && !category && !priority
                ? 'Dismissed notifications will appear here for reference.'
                : 'Try clearing your search query or switching filters.'
            }
          />
        ) : (
          <div className="stack notif-feed">
            {filtered.map((item) => {
              const pri = priorityMeta[item.priority];
              const isUnread = item.status === 'unread';
              return (
                <article
                  key={item.id}
                  className={
                    'soft-row notif-row' +
                    (isUnread ? ' is-unread' : '') +
                    (item.priority === 'urgent' && isUnread ? ' is-urgent' : '')
                  }
                >
                  <div className={'icon-box notif-icon ' + item.priority}>
                    <Icon name={item.icon} size={19} />
                  </div>

                  <div className="row-copy notif-copy">
                    <div className="notif-title-line">
                      <h3>{item.title}</h3>
                      {isUnread && <span className="notif-unread-dot" aria-label="Unread" />}
                      <StatusChip status={pri.chip} label={pri.label} />
                      <span className="notif-cat-chip">{categoryLabels[item.category]}</span>
                    </div>
                    <p className="notif-message">{item.message}</p>
                    <div className="notif-meta">
                      {item.organization && (
                        <span className="notif-org">
                          <Icon name="Building2" size={12} />
                          {item.organization}
                        </span>
                      )}
                      <span className="mono notif-time">
                        <Icon name="Clock" size={12} />
                        {item.time}
                      </span>
                    </div>
                  </div>

                  <div className="notif-actions">
                    <PillButton
                      small
                      variant={isUnread ? 'blue' : 'outline'}
                      to={item.to}
                      onClick={() => markAsRead(item.id)}
                    >
                      {item.actionLabel}
                      <Icon name="ArrowUpRight" size={13} />
                    </PillButton>

                    {tab === 'archived' ? (
                      <IconCircleButton
                        icon="RefreshCw"
                        label={'Restore ' + item.title}
                        onClick={() => restoreNotification(item.id)}
                      />
                    ) : (
                      <>
                        <IconCircleButton
                          icon={isUnread ? 'Check' : 'Bell'}
                          label={isUnread ? 'Mark as read' : 'Mark as unread'}
                          onClick={() => toggleRead(item.id)}
                        />
                        <IconCircleButton
                          icon="Archive"
                          label={'Archive ' + item.title}
                          onClick={() => archiveNotification(item.id)}
                        />
                      </>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}

        <div className="subscription-banner notif-pref-banner">
          <div className="inline">
            <div className="icon-box">
              <Icon name="SlidersHorizontal" />
            </div>
            <div>
              <p className="muted">Alert routing</p>
              <h3>Notification delivery preferences</h3>
            </div>
          </div>
          <div className="inline muted">
            <span>Risk escalations</span>
            <span>·</span>
            <span>Study exports</span>
            <span>·</span>
            <span>Weekly digest</span>
          </div>
          <PillButton to="/profile?tab=preferences" small>
            Configure preferences
            <Icon name="ArrowUpRight" size={14} />
          </PillButton>
        </div>
      </Panel>
    </>
  );
}
