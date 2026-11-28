import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { navigation, profile, riskNavigation, ppqNavigation, vsiNavigation, capacityNavigation, equipmentNavigation, manpowerNavigation, supplyNavigation, supermarketNavigation, mhNavigation, layoutNavigation, projectNavigation, visualNavigation, trainingNavigation, vsmNavigation, flowNavigation } from '../data/mock';
import Icon from './Icon';
import { IconCircleButton } from './UI';
import { usePreview } from './PreviewDialog';
import { useNotifications } from '../pages/Notifications';
export default function Layout() {
  const location = useLocation();
  const workspaceRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const preview = usePreview();
  const { notifications, unreadCount, markAsRead, markAllRead } = useNotifications();
  const [search, setSearch] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(() => { try { return localStorage.getItem('lfd-sidebar-collapsed') === '1'; } catch { return false; } });
  const toggleSidebar = () => setCollapsed(c => { try { localStorage.setItem('lfd-sidebar-collapsed', c ? '0' : '1'); } catch { /* storage unavailable */ } return !c; });
  const isRisk = location.pathname === '/risk' || location.pathname.startsWith('/risk/');
  const isPpq = location.pathname === '/ppq' || location.pathname.startsWith('/ppq/');
  const isVsi = location.pathname === '/vsi' || location.pathname.startsWith('/vsi/');
  const isCapacity = location.pathname === '/capacity' || location.pathname.startsWith('/capacity/');
  const isEquipment = location.pathname === '/equipment' || location.pathname.startsWith('/equipment/');
  const isManpower = location.pathname === '/manpower' || location.pathname.startsWith('/manpower/');
  const isSupply = location.pathname === '/supply-chain' || location.pathname.startsWith('/supply-chain/');
  const isSupermarket = location.pathname === '/supermarket' || location.pathname.startsWith('/supermarket/');
  const isMh = location.pathname === '/material-handling' || location.pathname.startsWith('/material-handling/');
  const isLayout = location.pathname === '/layout-design' || location.pathname.startsWith('/layout-design/');
  const isVisual = location.pathname === '/visual' || location.pathname.startsWith('/visual/') || location.pathname === '/visual-management' || location.pathname.startsWith('/visual-management/');
  const isProject = location.pathname === '/project-plan' || location.pathname.startsWith('/project-plan/') || location.pathname === '/rollout' || location.pathname.startsWith('/rollout/');
  const isTraining = location.pathname === '/training' || location.pathname.startsWith('/training/');
  const isVsm = location.pathname === '/vsm' || location.pathname.startsWith('/vsm/');
  const isFlow = location.pathname === '/flow-management' || location.pathname.startsWith('/flow-management/');
  const isModule = isRisk || isPpq || isVsi || isCapacity || isEquipment || isManpower || isSupply || isSupermarket || isMh || isLayout || isVisual || isProject || isTraining || isVsm || isFlow;
  const menu = isTraining ? trainingNavigation : isVsm ? vsmNavigation : isFlow ? flowNavigation : isRisk ? riskNavigation : isPpq ? ppqNavigation : isVsi ? vsiNavigation : isCapacity ? capacityNavigation : isEquipment ? equipmentNavigation : isManpower ? manpowerNavigation : isSupply ? supplyNavigation : isSupermarket ? supermarketNavigation : isMh ? mhNavigation : isLayout ? layoutNavigation : isVisual ? visualNavigation : isProject ? projectNavigation : navigation;
  const page = isFlow
    ? (flowNavigation.find(n => n.path === location.pathname)?.label || 'Flow Management')
    : isVsm
    ? (vsmNavigation.find(n => n.path === location.pathname)?.label || 'Value Stream Mapping')
    : isTraining
    ? (trainingNavigation.find(n => n.path === location.pathname)?.label || 'Training & Orientation')
    : isRisk
    ? (riskNavigation.find(n => n.path === location.pathname)?.label || 'Risk Assessment')
    : isPpq
    ? (ppqNavigation.find(n => n.path === location.pathname)?.label || 'PPQ Analysis')
    : isVsi
    ? (vsiNavigation.find(n => n.path === location.pathname)?.label || 'Value Stream ID')
    : isCapacity
    ? (capacityNavigation.find(n => n.path === location.pathname)?.label || 'Capacity Planning')
    : isEquipment
    ? (equipmentNavigation.find(n => n.path === location.pathname)?.label || 'Equipment Planning')
    : isManpower
    ? (manpowerNavigation.find(n => n.path === location.pathname)?.label || 'Manpower Planning')
    : isSupply
    ? (supplyNavigation.find(n => n.path === location.pathname)?.label || 'Supply Chain Design')
    : isSupermarket
    ? (supermarketNavigation.find(n => n.path === location.pathname)?.label || 'Flow Supermarket')
    : isMh
    ? (mhNavigation.find(n => n.path === location.pathname)?.label || 'Material Handling')
    : isLayout
    ? (layoutNavigation.find(n => n.path === location.pathname)?.label || 'Layout Design')
    : isVisual
    ? (visualNavigation.find(n => n.path === location.pathname)?.label || 'Visual Management')
    : isProject
    ? (projectNavigation.find(n => n.path === location.pathname)?.label || 'Project Plan')
    : location.pathname === '/profile'
    ? 'Profile Settings'
    : navigation.find(n => n.path === location.pathname)?.label || 'Page not found';
  useEffect(() => { window.scrollTo(0, 0); workspaceRef.current?.scrollTo(0, 0); document.title = page + ' · LFD Cloud'; }, [location.pathname, page]);
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); document.getElementById('global-search')?.focus(); } };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        setNotifOpen(false);
      }
    };
    if (menuOpen || notifOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [menuOpen, notifOpen]);
  const shellCls = isTraining ? "app-shell training-module" : isVsm ? "app-shell vsm-module" : isFlow ? "app-shell flow-module" : isRisk ? "app-shell risk-module" : isPpq ? "app-shell ppq-module" : isVsi ? "app-shell vsi-module" : isCapacity ? "app-shell capacity-module" : isEquipment ? "app-shell equipment-module" : isManpower ? "app-shell manpower-module" : isSupply ? "app-shell supply-module" : isSupermarket ? "app-shell supermarket-module" : isMh ? "app-shell mh-module" : isLayout ? "app-shell layout-module" : isVisual ? "app-shell visual-module" : isProject ? "app-shell project-module" : "app-shell";
  return <div className={shellCls}><a className="skip-link" href="#main">Skip to content</a>
    <aside className={collapsed ? 'sidebar collapsed' : 'sidebar'}><div className="sidebar-main"><div className="brand">
      {collapsed
        ? <button type="button" className="brand-toggle" aria-label="Expand sidebar" title="Expand sidebar" onClick={toggleSidebar}><img className="brand-logo" src="/logo.png" alt="" /><Icon name="PanelLeft" size={20} className="brand-toggle-icon" /></button>
        : <><Link className="brand-home" to="/home"><img className="brand-logo" src="/logo.png" alt="" /><span>LFD Cloud</span></Link><button type="button" className="sidebar-toggle" aria-label="Collapse sidebar" title="Collapse sidebar" onClick={toggleSidebar}><Icon name="PanelLeft" size={18} /></button></>}
    </div>
      {isFlow && <div className="module-identity flow-identity"><span className="module-step">STEP 05</span><strong><Icon name="Waves" size={18} />Flow Management</strong><Link to="/services"><Icon name="ArrowLeft" size={14} />All services</Link></div>}
      {isVsm && <div className="module-identity vsm-identity"><span className="module-step">STEP 04</span><strong><Icon name="Workflow" size={18} />Value Stream Mapping</strong><Link to="/services"><Icon name="ArrowLeft" size={14} />All services</Link></div>}
      {isTraining && <div className="module-identity training-identity"><span className="module-step">STEP 01</span><strong><Icon name="GraduationCap" size={18} />Training &amp; Orientation</strong><Link to="/services"><Icon name="ArrowLeft" size={14} />All services</Link></div>}
      {isRisk && <div className="module-identity risk-identity"><span className="module-step">STEP 14</span><strong><Icon name="ShieldAlert" size={18} />Risk Assessment</strong><Link to="/services"><Icon name="ArrowLeft" size={14} />All services</Link></div>}
      {isPpq && <div className="module-identity ppq-identity"><span className="module-step">STEP 02</span><strong><Icon name="FlaskConical" size={18} />PPQ Analysis</strong><Link to="/services"><Icon name="ArrowLeft" size={14} />All services</Link></div>}
      {isVsi && <div className="module-identity vsi-identity"><span className="module-step">STEP 03</span><strong><Icon name="Compass" size={18} />Value Stream ID</strong><Link to="/services"><Icon name="ArrowLeft" size={14} />All services</Link></div>}
      {isCapacity && <div className="module-identity capacity-identity"><span className="module-step">STEP 06</span><strong><Icon name="TrendingUp" size={18} />Capacity Planning</strong><Link to="/services"><Icon name="ArrowLeft" size={14} />All services</Link></div>}
      {isEquipment && <div className="module-identity equipment-identity"><span className="module-step">STEP 07</span><strong><Icon name="Cog" size={18} />Equipment Planning</strong><Link to="/services"><Icon name="ArrowLeft" size={14} />All services</Link></div>}
      {isManpower && <div className="module-identity manpower-identity"><span className="module-step">STEP 08</span><strong><Icon name="Users" size={18} />Manpower Planning</strong><Link to="/services"><Icon name="ArrowLeft" size={14} />All services</Link></div>}
      {isSupply && <div className="module-identity supply-identity"><span className="module-step">STEP 09</span><strong><Icon name="Network" size={18} />Supply Chain</strong><Link to="/services"><Icon name="ArrowLeft" size={14} />All services</Link></div>}
      {isSupermarket && <div className="module-identity supermarket-identity"><span className="module-step">STEP 10</span><strong><Icon name="Warehouse" size={18} />Flow Supermarket</strong><Link to="/services"><Icon name="ArrowLeft" size={14} />All services</Link></div>}
      {isMh && <div className="module-identity mh-identity"><span className="module-step">STEP 11</span><strong><Icon name="Truck" size={18} />Material Handling</strong><Link to="/services"><Icon name="ArrowLeft" size={14} />All services</Link></div>}
      {isLayout && <div className="module-identity layout-identity"><span className="module-step">STEP 12</span><strong><Icon name="PanelsTopLeft" size={18} />Layout Design</strong><Link to="/services"><Icon name="ArrowLeft" size={14} />All services</Link></div>}
      {isVisual && <div className="module-identity visual-identity"><span className="module-step">STEP 13</span><strong><Icon name="Eye" size={18} />Visual Management</strong><Link to="/services"><Icon name="ArrowLeft" size={14} />All services</Link></div>}
      {isProject && <div className="module-identity project-identity"><span className="module-step">STEP 15</span><strong><Icon name="CalendarRange" size={18} />Project Plan</strong><Link to="/services"><Icon name="ArrowLeft" size={14} />All services</Link></div>}
      <nav aria-label="Main navigation">{menu.map((item) => <div key={item.path}>
        {!isModule && item.label === 'Notifications' && <p className="nav-heading">ACCOUNT</p>}
        <NavLink end to={item.path} className={({ isActive }) => 'nav-item ' + (isActive ? 'active' : '')} title={collapsed ? item.label : undefined}><Icon name={item.icon} /><span>{item.label}</span>{"step" in item && <span className="nav-step">{item.step}</span>}</NavLink>
      </div>)}</nav></div>
      <div className="profile-wrapper" ref={profileRef}>
        {menuOpen && (
          <div className="profile-popover" role="menu" aria-label="Account options">
            <div className="popover-user-card">
              <div className="popover-avatar">
                <span>{profile.initials}</span>
              </div>
              <div className="popover-user-details">
                <strong className="popover-user-name">{profile.full_name}</strong>
                <span className="popover-user-email">{profile.email}</span>
                <span className="status-chip internal popover-role-pill"><span className="status-dot" />User</span>
              </div>
            </div>

            <div className="popover-divider" />

            <div className="popover-menu-section">
              <button
                type="button"
                className="popover-menu-btn"
                role="menuitem"
                onClick={() => {
                  setMenuOpen(false);
                  navigate('/profile?tab=personal');
                }}
              >
                <Icon name="CircleUser" size={18} />
                <span>Profile</span>
              </button>
              <button
                type="button"
                className="popover-menu-btn"
                role="menuitem"
                onClick={() => {
                  setMenuOpen(false);
                  navigate('/profile?tab=preferences');
                }}
              >
                <Icon name="Settings" size={18} />
                <span>Settings</span>
              </button>
            </div>

            <div className="popover-divider" />

            <div className="popover-menu-section">
              <button
                type="button"
                className="popover-menu-btn"
                role="menuitem"
                onClick={() => {
                  setMenuOpen(false);
                  preview('Learn More · VSM & LFD Cloud', 'Access interactive documentation, video tutorials, and guides for the 15 Lean Flow Design service steps.');
                }}
              >
                <Icon name="GraduationCap" size={18} />
                <span>Learn More</span>
                <Icon name="ChevronRight" size={15} className="popover-arrow" />
              </button>
              <button
                type="button"
                className="popover-menu-btn"
                role="menuitem"
                onClick={() => {
                  setMenuOpen(false);
                  preview('Help & Support', 'Reach out for Value Stream Mapping support, setup questions, or contact support@vsmstudio.com.');
                }}
              >
                <Icon name="HelpCircle" size={18} />
                <span>Help</span>
                <Icon name="ChevronRight" size={15} className="popover-arrow" />
              </button>
              <button
                type="button"
                className="popover-menu-btn popover-logout"
                role="menuitem"
                onClick={() => {
                  setMenuOpen(false);
                  preview('Log out', 'Sign out of Rohit Manvar (superadmin@vsmstudio.com). You will return to the login screen.');
                }}
              >
                <Icon name="LogOut" size={18} />
                <span>Log out</span>
              </button>
            </div>
          </div>
        )}

        <button
          type="button"
          className={"profile profile-trigger" + (menuOpen ? ' open' : '')}
          title={collapsed ? profile.full_name + ' · ' + profile.role_label : undefined}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-haspopup="menu"
          aria-expanded={menuOpen}
        >
          <span className="avatar">{profile.initials}</span>
          {!collapsed && (
            <div>
              <strong>{profile.full_name}</strong>
              <span>{profile.role_label}</span>
            </div>
          )}
        </button>
      </div>
    </aside>
    <div className="workspace" ref={workspaceRef}><header className="topbar">
      <div className="breadcrumb"><IconCircleButton icon="ArrowLeft" className="back-button" label="Go back" onClick={() => { if (window.history.state?.idx > 0) navigate(-1); else navigate('/home'); }} /><Link to="/home">LFD Cloud</Link><span>/</span>{isFlow && <><Link to="/flow-management">Flow Management</Link><span>/</span></>}{isVsm && <><Link to="/vsm">Value Stream Mapping</Link><span>/</span></>}{isTraining && <><Link to="/training">Training &amp; Orientation</Link><span>/</span></>}{isRisk && <><Link to="/risk">Risk Assessment</Link><span>/</span></>}{isPpq && <><Link to="/ppq">PPQ Analysis</Link><span>/</span></>}{isVsi && <><Link to="/vsi">Value Stream ID</Link><span>/</span></>}{isCapacity && <><Link to="/capacity">Capacity Planning</Link><span>/</span></>}{isEquipment && <><Link to="/equipment">Equipment Planning</Link><span>/</span></>}{isManpower && <><Link to="/manpower">Manpower Planning</Link><span>/</span></>}{isSupply && <><Link to="/supply-chain">Supply Chain</Link><span>/</span></>}{isSupermarket && <><Link to="/supermarket">Flow Supermarket</Link><span>/</span></>}{isMh && <><Link to="/material-handling">Material Handling</Link><span>/</span></>}{isLayout && <><Link to="/layout-design">Layout Design</Link><span>/</span></>}{isVisual && <><Link to="/visual">Visual Management</Link><span>/</span></>}{isProject && <><Link to="/project-plan">Project Plan</Link><span>/</span></>}<span className="current-page">{page}</span></div>
      <div className="topbar-actions"><form className="search-pill global-search" onSubmit={e => { e.preventDefault(); navigate('/search' + (search ? '?q=' + encodeURIComponent(search) : '')); }}><Icon name="Search" size={16} /><input id="global-search" aria-label="Search organizations, users" placeholder="Search organizations, users…" value={search} onChange={e => setSearch(e.target.value)} /><kbd>⌘K</kbd></form>
      <div className="notification-wrapper" ref={notifRef}>
        <button
          type="button"
          className={"circle-button notification-bell" + (notifOpen ? " active" : "")}
          aria-label={unreadCount > 0 ? `Notifications, ${unreadCount} unread` : "Notifications"}
          aria-haspopup="menu"
          aria-expanded={notifOpen}
          onClick={() => setNotifOpen(!notifOpen)}
        >
          <Icon name="Bell" />
          {unreadCount > 0 && <span />}
        </button>
        {notifOpen && (
          <div className="notification-popover" role="menu" aria-label="Notifications">
            <div className="notif-popover-header">
              <h3>
                Notifications
                {unreadCount > 0 && <span className="notif-popover-count">{unreadCount}</span>}
              </h3>
              {unreadCount > 0 && (
                <button
                  type="button"
                  className="notif-mark-all-btn"
                  onClick={markAllRead}
                >
                  Mark all read
                </button>
              )}
            </div>
            <div className="notif-popover-divider" />
            {unreadCount === 0 ? (
              <div className="notif-popover-empty">
                <div className="notif-bell-icon">
                  <Icon name="Bell" size={32} />
                </div>
                <p className="notif-empty-text">No new notifications</p>
              </div>
            ) : (
              <div className="notif-popover-list">
                {notifications
                  .filter(n => n.status === 'unread')
                  .slice(0, 4)
                  .map(item => (
                    <button
                      key={item.id}
                      type="button"
                      className="notif-popover-item"
                      role="menuitem"
                      onClick={() => {
                        markAsRead(item.id);
                        setNotifOpen(false);
                        navigate(item.to);
                      }}
                    >
                      <span className={'notif-popover-item-icon ' + item.priority}>
                        <Icon name={item.icon} size={15} />
                      </span>
                      <div className="notif-popover-item-copy">
                        <strong>{item.title}</strong>
                        <span>{(item.organization ? item.organization + ' · ' : '') + item.time}</span>
                      </div>
                    </button>
                  ))}
              </div>
            )}
            <Link
              to="/hub/notifications"
              className="notif-popover-footer"
              onClick={() => setNotifOpen(false)}
            >
              <span>View all notifications</span>
              <Icon name="ArrowRight" size={14} />
            </Link>
          </div>
        )}
      </div></div>
    </header><main id="main" className="compact-page" tabIndex={-1}><Outlet /></main><footer>LFD Cloud<span>UI preview · October 2026</span></footer></div>
  </div>;
}



