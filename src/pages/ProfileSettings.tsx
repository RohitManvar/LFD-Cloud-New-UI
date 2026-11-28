import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { organizations, pageDescriptions, profile as initialProfile, profilePermissions, profileSessions } from '../data/mock';
import Icon from '../components/Icon';
import { IconCircleButton, PageHeading, Panel, PillButton, PillTabs, SoftRow, StatusChip } from '../components/UI';
import { usePreview } from '../components/PreviewDialog';

export default function ProfileSettings() {
  const preview = usePreview();
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState<'personal' | 'security' | 'preferences' | 'sessions' | 'organizations'>(() => {
    if (tabParam === 'preferences' || tabParam === 'security' || tabParam === 'sessions' || tabParam === 'organizations') return tabParam;
    return 'personal';
  });

  useEffect(() => {
    if (tabParam === 'preferences' || tabParam === 'security' || tabParam === 'sessions' || tabParam === 'organizations' || tabParam === 'personal') {
      setActiveTab(tabParam);
    }
  }, [tabParam]);
  const [profileData, setProfileData] = useState(initialProfile);
  const [sessions, setSessions] = useState(profileSessions);
  const [saveToast, setSaveToast] = useState<string | null>(null);

  // Form state
  const [firstName, setFirstName] = useState(profileData.first_name);
  const [lastName, setLastName] = useState(profileData.last_name);
  const [email, setEmail] = useState(profileData.email);
  const [phone, setPhone] = useState(profileData.phone);
  const [position, setPosition] = useState(profileData.position);
  const [department, setDepartment] = useState(profileData.department);
  const [organization, setOrganization] = useState(profileData.organization);
  const [location, setLocation] = useState(profileData.location);
  const [timezone, setTimezone] = useState(profileData.timezone);
  const [bio, setBio] = useState(profileData.bio);

  // Security form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(profileData.two_factor_enabled);

  // Preferences state
  const [themePreference, setThemePreference] = useState(profileData.theme_preference);
  const [density, setDensity] = useState(profileData.density);
  const [defaultLanding, setDefaultLanding] = useState(profileData.default_landing);
  const [dateFormat, setDateFormat] = useState(profileData.date_format);
  const [numberSystem, setNumberSystem] = useState(profileData.number_system);
  const [notifyRiskAlerts, setNotifyRiskAlerts] = useState(profileData.notify_risk_alerts);
  const [notifyStudyExport, setNotifyStudyExport] = useState(profileData.notify_study_export);
  const [notifyWeeklyDigest, setNotifyWeeklyDigest] = useState(profileData.notify_weekly_digest);

  const handleSavePersonal = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileData(prev => ({
      ...prev,
      first_name: firstName,
      last_name: lastName,
      full_name: `${firstName} ${lastName}`.trim(),
      email,
      phone,
      position,
      department,
      organization,
      location,
      timezone,
      bio,
    }));
    triggerToast('Profile information saved successfully.');
  };

  const handleSaveSecurity = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword && newPassword !== confirmPassword) {
      triggerToast('Passwords do not match. Please verify your entries.');
      return;
    }
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    triggerToast('Security credentials updated successfully.');
  };

  const handleSavePreferences = () => {
    setProfileData(prev => ({
      ...prev,
      theme_preference: themePreference,
      density,
      default_landing: defaultLanding,
      date_format: dateFormat,
      number_system: numberSystem,
      notify_risk_alerts: notifyRiskAlerts,
      notify_study_export: notifyStudyExport,
      notify_weekly_digest: notifyWeeklyDigest,
    }));
    triggerToast('Workspace preferences updated successfully.');
  };

  const triggerToast = (msg: string) => {
    setSaveToast(msg);
    setTimeout(() => {
      setSaveToast(null);
    }, 4000);
  };

  const handleRevokeSession = (sessionId: string) => {
    setSessions(prev => prev.filter(s => s.id !== sessionId));
    triggerToast('Session revoked successfully.');
  };

  const handleRevokeAllOther = () => {
    setSessions(prev => prev.filter(s => s.current));
    triggerToast('All other active sessions have been terminated.');
  };

  // Organizations Rohit is associated with or created
  const myOrganizations = organizations.filter(
    o => o.created_by.toLowerCase().includes('rohit') || o.org_type === 'internal'
  );

  return (
    <>
      <PageHeading
        description={pageDescriptions['Profile Settings']}
        title="Profile & Settings"
        actions={
          <div className="inline">
            <PillButton
              icon="Download"
              onClick={() => preview('Export Profile Data', 'Exported full JSON and audit trail of account configurations.')}
            >
              Export data
            </PillButton>
            <PillButton
              variant="blue"
              icon="Check"
              onClick={() => {
                if (activeTab === 'personal') handleSavePersonal({ preventDefault: () => {} } as any);
                else if (activeTab === 'security') handleSaveSecurity({ preventDefault: () => {} } as any);
                else handleSavePreferences();
              }}
            >
              Save changes
            </PillButton>
          </div>
        }
      />

      {saveToast && (
        <div className="save-toast-banner" role="status">
          <Icon name="CheckCircle2" size={16} />
          <span>{saveToast}</span>
        </div>
      )}

      {/* Hero Profile Overview Card */}
      <section className="profile-hero-card" aria-label="Profile summary">
        <div className="profile-hero-left">
          <div className="profile-avatar-large" aria-hidden="true">
            <span>{profileData.initials}</span>
            <span className="profile-avatar-badge" title="Super Administrator">
              <Icon name="ShieldCheck" size={14} />
            </span>
          </div>
          <div className="profile-hero-identity">
            <div className="inline">
              <h2>{profileData.full_name}</h2>
              <StatusChip status="internal" label={profileData.role_label} />
              <span className="status-chip active"><span className="status-dot" />{profileData.last_active}</span>
            </div>
            <p className="profile-hero-title">{profileData.position}</p>
            <div className="profile-hero-tags">
              <span><Icon name="Building2" size={14} />{profileData.organization}</span>
              <span><Icon name="MapPin" size={14} />{profileData.location}</span>
              <span><Icon name="Mail" size={14} />{profileData.email}</span>
            </div>
          </div>
        </div>

        <div className="profile-hero-meta">
          <div>
            <span className="meta-label">Member Since</span>
            <strong>{profileData.member_since}</strong>
          </div>
          <div>
            <span className="meta-label">Two-Factor Auth</span>
            <strong className="text-green"><Icon name="ShieldCheck" size={14} /> Enabled</strong>
          </div>
          <div>
            <span className="meta-label">Organizations Scope</span>
            <strong>{organizations.length} Tenancies</strong>
          </div>
        </div>
      </section>

      {/* Pill Tabs for Section Navigation */}
      <div className="profile-tabs-wrapper">
        <PillTabs
          label="Profile sections"
          active={activeTab}
          onChange={(tab) => {
            setActiveTab(tab as any);
            setSearchParams({ tab });
          }}
          tabs={[
            { id: 'personal', label: 'Personal Details' },
            { id: 'security', label: 'Security & Access' },
            { id: 'preferences', label: 'Preferences' },
            { id: 'sessions', label: 'Active Sessions', count: sessions.length },
            { id: 'organizations', label: 'My Organizations', count: myOrganizations.length },
          ]}
        />
      </div>

      {/* TAB 1: PERSONAL DETAILS */}
      {activeTab === 'personal' && (
        <div className="profile-grid">
          <Panel title="Personal Information" subtitle="Update your personal identification, contact details, and role specifications.">
            <form onSubmit={handleSavePersonal} className="profile-form">
              <div className="form-row-two">
                <div className="form-group">
                  <label className="form-label" htmlFor="first-name">First name</label>
                  <input
                    id="first-name"
                    className="form-input"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="last-name">Last name</label>
                  <input
                    id="last-name"
                    className="form-input"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-row-two">
                <div className="form-group">
                  <label className="form-label" htmlFor="email-address">Email address</label>
                  <div className="input-with-chip">
                    <input
                      id="email-address"
                      type="email"
                      className="form-input"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <span className="verified-badge" title="Verified enterprise account">
                      <Icon name="CheckCircle2" size={13} /> Verified
                    </span>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="phone-number">Phone number</label>
                  <input
                    id="phone-number"
                    className="form-input"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-row-two">
                <div className="form-group">
                  <label className="form-label" htmlFor="job-position">Designation / Role</label>
                  <input
                    id="job-position"
                    className="form-input"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="job-department">Department</label>
                  <input
                    id="job-department"
                    className="form-input"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-row-two">
                <div className="form-group">
                  <label className="form-label" htmlFor="primary-org">Organization</label>
                  <input
                    id="primary-org"
                    className="form-input"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="work-location">Work location</label>
                  <input
                    id="work-location"
                    className="form-input"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="timezone-select">Primary timezone</label>
                <select
                  id="timezone-select"
                  className="form-select"
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                >
                  <option value="Asia/Kolkata (IST, UTC+5:30)">Asia/Kolkata (IST, UTC+5:30)</option>
                  <option value="Asia/Dubai (GST, UTC+4:00)">Asia/Dubai (GST, UTC+4:00)</option>
                  <option value="Asia/Singapore (SGT, UTC+8:00)">Asia/Singapore (SGT, UTC+8:00)</option>
                  <option value="Europe/London (BST/GMT, UTC+0:00)">Europe/London (BST/GMT, UTC+0:00)</option>
                  <option value="America/New_York (EST, UTC-5:00)">America/New_York (EST, UTC-5:00)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="professional-bio">Professional bio & scope</label>
                <textarea
                  id="professional-bio"
                  className="form-textarea"
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
                <span className="muted">Appears in audit entries, project plan authorship, and shared VSM reports.</span>
              </div>

              <div className="form-actions">
                <PillButton variant="blue" icon="Check">Save changes</PillButton>
                <PillButton onClick={() => {
                  setFirstName(initialProfile.first_name);
                  setLastName(initialProfile.last_name);
                  setEmail(initialProfile.email);
                  setPhone(initialProfile.phone);
                  setPosition(initialProfile.position);
                  setDepartment(initialProfile.department);
                  setOrganization(initialProfile.organization);
                  setLocation(initialProfile.location);
                  setTimezone(initialProfile.timezone);
                  setBio(initialProfile.bio);
                  triggerToast('Reverted to saved profile details.');
                }}>
                  Reset
                </PillButton>
              </div>
            </form>
          </Panel>

          <div className="profile-side-column">
            <Panel title="Avatar & Identity" subtitle="Manage your visual presence on LFD Cloud.">
              <div className="avatar-edit-card">
                <div className="avatar-large-preview">
                  <span>{profileData.initials}</span>
                </div>
                <div className="avatar-edit-actions">
                  <PillButton
                    small
                    icon="Camera"
                    onClick={() => preview('Upload Avatar', 'Select a new PNG or JPG image up to 4MB.')}
                  >
                    Change photo
                  </PillButton>
                  <PillButton
                    small
                    onClick={() => triggerToast('Reset avatar to initial monogram.')}
                  >
                    Use monogram
                  </PillButton>
                </div>
                <p className="muted">Recommended: Square PNG or JPG, at least 400x400px.</p>
              </div>
            </Panel>

            <Panel title="Account Badges" subtitle="Platform-level verified designations.">
              <div className="badge-list">
                <SoftRow>
                  <span className="icon-box blue"><Icon name="ShieldCheck" /></span>
                  <div className="row-copy">
                    <h3>Super Administrator</h3>
                    <p className="muted">Highest platform authority</p>
                  </div>
                  <StatusChip status="active" label="Granted" />
                </SoftRow>
                <SoftRow>
                  <span className="icon-box"><Icon name="Workflow" /></span>
                  <div className="row-copy">
                    <h3>Master VSM Modeler</h3>
                    <p className="muted">All 15 service modules unlocked</p>
                  </div>
                  <StatusChip status="internal" label="Internal" />
                </SoftRow>
              </div>
            </Panel>
          </div>
        </div>
      )}

      {/* TAB 2: SECURITY & ACCESS */}
      {activeTab === 'security' && (
        <div className="profile-grid">
          <div className="stack">
            <Panel title="Password & Authentication" subtitle="Maintain strong security credentials for your account.">
              <form onSubmit={handleSaveSecurity} className="profile-form">
                <div className="form-group">
                  <label className="form-label" htmlFor="curr-password">Current password</label>
                  <input
                    id="curr-password"
                    type="password"
                    className="form-input"
                    placeholder="Enter current password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>

                <div className="form-row-two">
                  <div className="form-group">
                    <label className="form-label" htmlFor="new-password">New password</label>
                    <input
                      id="new-password"
                      type="password"
                      className="form-input"
                      placeholder="At least 12 characters"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="confirm-password">Confirm new password</label>
                    <input
                      id="confirm-password"
                      type="password"
                      className="form-input"
                      placeholder="Repeat new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </div>

                <div className="password-requirements">
                  <span className="muted">Requirements: Minimum 12 characters, including uppercase, lowercase, numbers, and symbols.</span>
                </div>

                <div className="form-actions">
                  <PillButton variant="blue" icon="Lock">Update password</PillButton>
                </div>
              </form>
            </Panel>

            <Panel title="Two-Factor Authentication (2FA)" subtitle="Protect your account with multi-factor verification.">
              <div className="two-factor-box">
                <div className="between">
                  <div className="inline">
                    <span className="icon-box green-tint"><Icon name="ShieldCheck" /></span>
                    <div>
                      <h3>Authenticator App (TOTP)</h3>
                      <p className="muted">Configured with Google Authenticator / 1Password · Active</p>
                    </div>
                  </div>
                  <StatusChip status="active" label="Enabled" />
                </div>

                <div className="two-factor-meta">
                  <div className="recovery-box">
                    <span className="mono">8 of 10</span>
                    <span className="muted">emergency recovery codes unused</span>
                  </div>
                  <div className="inline">
                    <PillButton
                      small
                      icon="KeyRound"
                      onClick={() => preview('Emergency Recovery Codes', 'Active recovery backup codes: \n\n1. 4A89-99E1-2F10\n2. 7B12-44C9-8801\n3. 99D1-33A2-11FE\n4. 2381-88FA-77B4\n5. 66BC-12DA-3399\n6. 01EA-55CC-4482\n7. 8831-29FA-9910\n8. 55E2-77D1-44B8')}
                    >
                      View backup codes
                    </PillButton>
                    <PillButton
                      small
                      icon="RefreshCw"
                      onClick={() => preview('Reconfigure 2FA', 'Scan the QR code with your authenticator application to reset credentials.')}
                    >
                      Reconfigure 2FA
                    </PillButton>
                  </div>
                </div>
              </div>
            </Panel>
          </div>

          <div className="stack">
            <Panel title="Role Privileges & Permissions" subtitle="Your active system capabilities as Super Administrator.">
              <div className="permissions-list">
                {profilePermissions.map((perm) => (
                  <div className="permission-item" key={perm.id}>
                    <div className="permission-icon-box">
                      <Icon name="CheckCircle2" size={16} />
                    </div>
                    <div className="row-copy">
                      <div className="between">
                        <h3>{perm.label}</h3>
                        <span className="permission-category">{perm.category}</span>
                      </div>
                      <p className="muted">{perm.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Panel>

            <Panel title="Developer & API Access" subtitle="Tokens for automated CI/CD and export scripts.">
              <div className="api-token-card">
                <div className="between">
                  <div className="inline">
                    <Icon name="KeyRound" size={16} />
                    <strong>Personal Access Token</strong>
                  </div>
                  <span className="status-chip internal">Active</span>
                </div>
                <div className="token-display">
                  <code>pat_lfd_live_9a7f••••••••••••••88e2</code>
                  <IconCircleButton
                    icon="Copy"
                    label="Copy token"
                    onClick={() => triggerToast('Token copied to clipboard.')}
                  />
                </div>
                <p className="muted">Expires on 31 Dec 2026 · Scope: Full Read/Write API access</p>
              </div>
            </Panel>
          </div>
        </div>
      )}

      {/* TAB 3: PREFERENCES & WORKSPACE */}
      {activeTab === 'preferences' && (
        <div className="profile-grid">
          <Panel title="Interface & Theme" subtitle="Choose how LFD Cloud looks and feels on your displays.">
            <div className="theme-selector-grid">
              <button
                type="button"
                className={`theme-card ${themePreference === 'light' ? 'selected' : ''}`}
                onClick={() => setThemePreference('light')}
              >
                <div className="theme-preview-box light">
                  <span className="preview-nav" />
                  <span className="preview-main" />
                </div>
                <div className="theme-card-info">
                  <strong>LFD Classic (Light)</strong>
                  <span className="muted">Optimized for high-contrast engineering environments</span>
                </div>
                {themePreference === 'light' && <span className="selection-dot"><Icon name="Check" size={12} /></span>}
              </button>

              <button
                type="button"
                className={`theme-card ${themePreference === 'system' ? 'selected' : ''}`}
                onClick={() => setThemePreference('system')}
              >
                <div className="theme-preview-box system">
                  <span className="preview-nav" />
                  <span className="preview-main" />
                </div>
                <div className="theme-card-info">
                  <strong>System Default</strong>
                  <span className="muted">Matches your operating system's light/dark schedule</span>
                </div>
                {themePreference === 'system' && <span className="selection-dot"><Icon name="Check" size={12} /></span>}
              </button>

              <button
                type="button"
                className={`theme-card ${themePreference === 'dark' ? 'selected' : ''}`}
                onClick={() => setThemePreference('dark')}
              >
                <div className="theme-preview-box dark">
                  <span className="preview-nav" />
                  <span className="preview-main" />
                </div>
                <div className="theme-card-info">
                  <strong>Dark Mode (Preview)</strong>
                  <span className="muted">Low-light workstation palette with deep slate tones</span>
                </div>
                {themePreference === 'dark' && <span className="selection-dot"><Icon name="Check" size={12} /></span>}
              </button>
            </div>

            <div className="settings-divider" />

            <div className="settings-row">
              <div>
                <h3>Workspace Density</h3>
                <p className="muted">Controls row spacing, padding, and data density across tables and cards.</p>
              </div>
              <div className="inline">
                <button
                  type="button"
                  className={`density-pill ${density === 'comfortable' ? 'active' : ''}`}
                  onClick={() => setDensity('comfortable')}
                >
                  Comfortable
                </button>
                <button
                  type="button"
                  className={`density-pill ${density === 'compact' ? 'active' : ''}`}
                  onClick={() => setDensity('compact')}
                >
                  Compact
                </button>
              </div>
            </div>

            <div className="settings-divider" />

            <div className="settings-row">
              <div>
                <h3>Default Landing Module</h3>
                <p className="muted">The starting view loaded whenever you open or refresh LFD Cloud.</p>
              </div>
              <select
                className="form-select inline-select"
                value={defaultLanding}
                onChange={(e) => setDefaultLanding(e.target.value)}
              >
                <option value="/home">Executive Dashboard (/home)</option>
                <option value="/vsm">Value Stream Mapping (/vsm)</option>
                <option value="/services">Services Catalog (/services)</option>
                <option value="/ppq">PPQ Analysis (/ppq)</option>
                <option value="/flow-management">Flow Management (/flow-management)</option>
              </select>
            </div>
          </Panel>

          <div className="stack">
            <Panel title="Regional & Number Formatting" subtitle="Configure currency, date syntax, and numbering scales.">
              <div className="stack">
                <div className="form-group">
                  <label className="form-label" htmlFor="number-system">Numbering System</label>
                  <select
                    id="number-system"
                    className="form-select"
                    value={numberSystem}
                    onChange={(e) => setNumberSystem(e.target.value)}
                  >
                    <option value="indian">Indian System (Lakhs &amp; Crores, e.g. 12,50,000)</option>
                    <option value="international">International System (Thousands &amp; Millions, e.g. 1,250,000)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="date-format">Date Presentation</label>
                  <select
                    id="date-format"
                    className="form-select"
                    value={dateFormat}
                    onChange={(e) => setDateFormat(e.target.value)}
                  >
                    <option value="DD/MM/YYYY">DD/MM/YYYY (e.g. 27/11/2026)</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD (ISO standard, e.g. 2026-11-27)</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY (e.g. 11/27/2026)</option>
                  </select>
                </div>
              </div>
            </Panel>

            <Panel title="Notification Alerts" subtitle="Control which system events send alerts to your inbox.">
              <div className="notification-options">
                <label className="toggle-row">
                  <div>
                    <strong>Risk Assessment Escalations</strong>
                    <p className="muted">Alerts when a value stream risk score transitions to High or Critical</p>
                  </div>
                  <input
                    type="checkbox"
                    className="lfd-checkbox"
                    checked={notifyRiskAlerts}
                    onChange={(e) => setNotifyRiskAlerts(e.target.checked)}
                  />
                </label>

                <label className="toggle-row">
                  <div>
                    <strong>Study Exports &amp; Reports</strong>
                    <p className="muted">Notifies when bulk Excel downloads or VSM reports are generated</p>
                  </div>
                  <input
                    type="checkbox"
                    className="lfd-checkbox"
                    checked={notifyStudyExport}
                    onChange={(e) => setNotifyStudyExport(e.target.checked)}
                  />
                </label>

                <label className="toggle-row">
                  <div>
                    <strong>Weekly Operational Digest</strong>
                    <p className="muted">Summary email of platform activity, new orgs, and VSM progress</p>
                  </div>
                  <input
                    type="checkbox"
                    className="lfd-checkbox"
                    checked={notifyWeeklyDigest}
                    onChange={(e) => setNotifyWeeklyDigest(e.target.checked)}
                  />
                </label>
              </div>
            </Panel>
          </div>
        </div>
      )}

      {/* TAB 4: SESSIONS & DEVICES */}
      {activeTab === 'sessions' && (
        <Panel
          title="Active Login Sessions"
          subtitle="Signed-in devices and browser sessions currently authorized for your account."
          action={
            sessions.length > 1 ? (
              <PillButton small onClick={handleRevokeAllOther}>
                Revoke all other sessions
              </PillButton>
            ) : undefined
          }
        >
          <div className="session-list">
            {sessions.map((sess) => (
              <div className="session-card" key={sess.id}>
                <div className="session-left">
                  <div className={`session-icon-box ${sess.current ? 'current' : ''}`}>
                    <Icon name={sess.icon} size={20} />
                  </div>
                  <div className="session-info">
                    <div className="inline">
                      <strong>{sess.device}</strong>
                      {sess.current ? (
                        <span className="status-chip active"><span className="status-dot" />Current session</span>
                      ) : (
                        <span className="status-chip">Signed in</span>
                      )}
                    </div>
                    <p className="muted">{sess.os}</p>
                    <div className="session-submeta">
                      <span><Icon name="MapPin" size={12} /> {sess.location}</span>
                      <span><Icon name="Globe" size={12} /> IP {sess.ip}</span>
                      <span><Icon name="Clock" size={12} /> {sess.last_active}</span>
                    </div>
                  </div>
                </div>

                <div className="session-action">
                  {sess.current ? (
                    <span className="current-badge">This device</span>
                  ) : (
                    <PillButton
                      small
                      variant="outline"
                      onClick={() => handleRevokeSession(sess.id)}
                    >
                      Revoke
                    </PillButton>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Panel>
      )}

      {/* TAB 5: ORGANIZATIONS & TENANCY */}
      {activeTab === 'organizations' && (
        <Panel
          title="My Supervised Organizations"
          subtitle="Client and internal manufacturing organizations under your administration."
          action={
            <PillButton icon="ArrowUpRight" to="/hub/organizations">
              All 9 organizations
            </PillButton>
          }
        >
          <div className="org-list">
            {myOrganizations.map((org) => (
              <article className="org-card lift" key={org.org_id}>
                <div className="org-card-top">
                  <span className="org-initial large">{org.initials}</span>
                  <div className="org-title">
                    <div className="inline">
                      <h3>{org.name}</h3>
                      <StatusChip status={org.status} />
                      {org.org_type === 'internal' && <StatusChip status="internal" />}
                    </div>
                    <p className="muted">{org.industry}{org.sub_sector && ' · ' + org.sub_sector}</p>
                  </div>
                  <div className="org-actions">
                    <IconCircleButton
                      icon="ArrowUpRight"
                      label={`Open ${org.name}`}
                      to={`/hub/organizations?q=${encodeURIComponent(org.name)}`}
                    />
                  </div>
                </div>
                <div className="org-details">
                  <dl className="info-band">
                    <div><dt>Location</dt><dd>{org.location}</dd></div>
                    <div><dt>Created By</dt><dd>{org.created_by}</dd></div>
                    <div><dt>Created On</dt><dd className="mono">{org.created_at}</dd></div>
                  </dl>
                  <div className="count-tiles">
                    <div><span>Admins</span><strong>{org.admin_count}</strong></div>
                    <div><span>Users</span><strong>{org.user_count}</strong></div>
                    <div><span>Value streams</span><strong>{org.project_count}</strong></div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </Panel>
      )}
    </>
  );
}
