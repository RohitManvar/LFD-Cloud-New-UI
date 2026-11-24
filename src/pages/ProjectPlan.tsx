import { createContext, useContext, useState, type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  projectNavigation, projectDescriptions, projectPlanData, projectPhases as initialPhases,
  projectActions as initialActions, projectCheckpoints as initialCheckpoints,
  projectPractices, type ProjectPlanInfo, type ProjectPhase, type ProjectAction,
} from '../data/mock';
import Icon from '../components/Icon';
import { EmptyState, IconCircleButton, PageHeading, Panel, PillButton, SearchPill, StatCard } from '../components/UI';
import { usePreview } from '../components/PreviewDialog';

interface ProjectContextType {
  plan: ProjectPlanInfo;
  phases: ProjectPhase[];
  actions: ProjectAction[];
  checkpoints: typeof initialCheckpoints;
  addAction: (action: Omit<ProjectAction, 'id'>) => void;
  toggleCheckpoint: (id: string) => void;
  toggleActionStatus: (id: string) => void;
}

const ProjectContext = createContext<ProjectContextType>({
  plan: projectPlanData,
  phases: initialPhases,
  actions: initialActions,
  checkpoints: initialCheckpoints,
  addAction: () => {},
  toggleCheckpoint: () => {},
  toggleActionStatus: () => {},
});

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [plan] = useState<ProjectPlanInfo>(projectPlanData);
  const [phases] = useState<ProjectPhase[]>(initialPhases);
  const [actions, setActions] = useState<ProjectAction[]>(initialActions);
  const [checkpoints, setCheckpoints] = useState(initialCheckpoints);

  const addAction = (newAct: Omit<ProjectAction, 'id'>) => {
    const id = `ACT-${String(actions.length + 1).padStart(2, '0')}`;
    setActions(prev => [{ id, ...newAct }, ...prev]);
  };

  const toggleCheckpoint = (id: string) => {
    setCheckpoints(prev => prev.map(c => {
      if (c.id === id) {
        return {
          ...c,
          status: c.status === 'Approved' ? 'In Review' : c.status === 'In Review' ? 'Pending' : 'Approved',
        };
      }
      return c;
    }));
  };

  const toggleActionStatus = (id: string) => {
    setActions(prev => prev.map(a => {
      if (a.id === id) {
        const next = a.status === 'Completed' ? 'Pending' : a.status === 'Pending' ? 'In Progress' : 'Completed';
        return { ...a, status: next };
      }
      return a;
    }));
  };

  return (
    <ProjectContext.Provider value={{ plan, phases, actions, checkpoints, addAction, toggleCheckpoint, toggleActionStatus }}>
      {children}
    </ProjectContext.Provider>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   00. PROJECT OVERVIEW
   ───────────────────────────────────────────────────────────────────────────── */
function ProjectOverview() {
  const { plan, phases, actions, checkpoints } = useContext(ProjectContext);
  const preview = usePreview();

  const completedCount = actions.filter(a => a.status === 'Completed').length;
  const inProgressCount = actions.filter(a => a.status === 'In Progress').length;
  const criticalRiskCount = actions.filter(a => a.priority === 'Critical').length;
  const approvedCheckpoints = checkpoints.filter(c => c.status === 'Approved').length;

  return (
    <>
      <section className="stats-grid" aria-label="Project plan summary metrics">
        <StatCard
          label="Implementation Phases"
          value={phases.length}
          subline="9 departments mapped"
          icon="CalendarRange"
          to="/project-plan/phases"
        />
        <StatCard
          label="Plan Duration"
          value={`${plan.totalMonths} Mo`}
          subline={`${plan.totalWeeks} scheduled weeks`}
          icon="Layers"
          dark
          to="/project-plan/phases"
        />
        <StatCard
          label="Active Actions"
          value={actions.length}
          subline={`${completedCount} done · ${inProgressCount} active`}
          icon="ClipboardList"
          to="/project-plan/actions"
        />
        <StatCard
          label="Unplanned Downtime"
          value="0 Days"
          subline="Zero plant shutdown target"
          icon="ShieldCheck"
        />
      </section>

      {/* Active Plan Hero Card */}
      <Panel className="project-anchor-panel">
        <div className="project-anchor-content">
          <div className="project-hero-badge">
            <span className="project-hero-pill">STEP 15 · ACTIVE PLAN</span>
            <span className="project-status-chip">ON SCHEDULE</span>
          </div>

          <div className="project-anchor-header">
            <div>
              <h2 className="project-plan-title">{plan.name}</h2>
              <p className="project-plan-sub">{plan.facility} · {plan.orgName}</p>
            </div>
            <div className="project-budget-block">
              <span className="mono muted">ESTIMATED BUDGET</span>
              <strong className="project-budget-val">{plan.estimatedBudget}</strong>
            </div>
          </div>

          <div className="project-links-strip">
            <div className="project-link-item">
              <Icon name="ShieldAlert" size={16} />
              <span>Risk Assessment:</span>
              <Link to="/risk" className="project-link-tag">{plan.riskAssessmentLinked}</Link>
            </div>
            <div className="project-link-item">
              <Icon name="Compass" size={16} />
              <span>Value Stream:</span>
              <Link to="/vsi" className="project-link-tag">{plan.vsmLinked}</Link>
            </div>
            <div className="project-link-item">
              <Icon name="CalendarRange" size={16} />
              <span>Window:</span>
              <strong>{plan.startDate} → {plan.targetDate}</strong>
            </div>
          </div>

          {/* 8-Month Visual Roadmap Bar */}
          <div className="project-roadmap-bar-wrap">
            <div className="between mb-6">
              <span className="eyebrow">8-MONTH RELOCATION ROADMAP</span>
              <span className="mono muted text-xs">{plan.totalWeeks} weeks total · Month 1 to Month 8</span>
            </div>
            <div className="project-roadmap-strip">
              <div className="roadmap-segment civil" style={{ flex: 3 }}>
                <span className="segment-label">M1–M3: Infrastructure</span>
                <span className="segment-bar" />
              </div>
              <div className="roadmap-segment shifting" style={{ flex: 1 }}>
                <span className="segment-label">M4: Stores</span>
                <span className="segment-bar" />
              </div>
              <div className="roadmap-segment shifting" style={{ flex: 2 }}>
                <span className="segment-label">M4–M6: Manufacturing</span>
                <span className="segment-bar" />
              </div>
              <div className="roadmap-segment commissioning" style={{ flex: 1 }}>
                <span className="segment-label">M5: Supermarket</span>
                <span className="segment-bar" />
              </div>
              <div className="roadmap-segment commissioning" style={{ flex: 1 }}>
                <span className="segment-label">M7: Dispatch</span>
                <span className="segment-bar" />
              </div>
              <div className="roadmap-segment commissioning" style={{ flex: 1 }}>
                <span className="segment-label">M8: Ramp-up</span>
                <span className="segment-bar" />
              </div>
            </div>
            <div className="project-roadmap-legend">
              <span><span className="legend-dot civil" /> Civil & Infrastructure</span>
              <span><span className="legend-dot shifting" /> Machine & Line Shifting</span>
              <span><span className="legend-dot commissioning" /> Commissioning & Validation</span>
            </div>
          </div>

          <div className="project-anchor-actions">
            <Link to="/project-plan/phases" className="pill-button primary project-btn">
              <Icon name="CalendarRange" size={15} />
              View Timeline Gantt
            </Link>
            <Link to="/project-plan/actions" className="pill-button secondary">
              <Icon name="ClipboardList" size={15} />
              Review Actions ({actions.length})
            </Link>
            <Link to="/project-plan/report" className="pill-button secondary">
              <Icon name="FileText" size={15} />
              Rollout Charter & Report
            </Link>
          </div>
        </div>
      </Panel>

      {/* Two Standing Pillars: Phase Gate Checkpoints & Continuity Practices */}
      <div className="project-two-col">
        {/* Left: 10 Phase Gate Checkpoints */}
        <Panel
          title="Standing Phase Gate Checkpoints"
          subtitle="Mandatory 10-point checklist before any department begins relocation"
          action={
            <span className="gate-score-pill">
              <Icon name="CheckCircle2" size={14} />
              {approvedCheckpoints} of 10 Approved
            </span>
          }
        >
          <div className="gate-checklist">
            {checkpoints.map((cp, idx) => (
              <div
                key={cp.id}
                className={`gate-check-item ${cp.status === 'Approved' ? 'approved' : cp.status === 'In Review' ? 'review' : 'pending'}`}
                onClick={() => preview(`Gate Check: ${cp.title}`, `Status: ${cp.status}. Verified by: ${cp.verifiedBy}`)}
              >
                <span className="gate-idx">{String(idx + 1).padStart(2, '0')}</span>
                <div className="gate-text">
                  <strong>{cp.title}</strong>
                  <span className="muted text-xs">Sign-off dept: {cp.verifiedBy}</span>
                </div>
                <span className={`gate-badge ${cp.status.toLowerCase().replace(' ', '-')}`}>
                  {cp.status}
                </span>
              </div>
            ))}
          </div>
        </Panel>

        {/* Right: 6 Continuity Rules */}
        <Panel
          title="How to Shift Without Stopping the Plant"
          subtitle="The 6 operational rules to guarantee zero unplanned customer downtime"
        >
          <div className="practices-list">
            {projectPractices.map((p, idx) => (
              <div key={idx} className="practice-card">
                <div className="practice-header">
                  <span className="practice-pill">{p.rule}</span>
                  <strong>{p.title}</strong>
                </div>
                <p className="practice-desc">{p.description}</p>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   01. TIMELINE & PHASES GANTT SCREEN
   ───────────────────────────────────────────────────────────────────────────── */
function ProjectPhases() {
  const { phases, actions } = useContext(ProjectContext);
  const [selectedCat, setSelectedCat] = useState<'all' | 'civil' | 'shifting' | 'commissioning'>('all');
  const preview = usePreview();

  const filteredPhases = phases.filter(p => selectedCat === 'all' || p.category === selectedCat);

  return (
    <>
      <div className="between vsi-filter-bar">
        <div className="pill-tabs" role="tablist">
          <button
            className={selectedCat === 'all' ? 'active' : ''}
            onClick={() => setSelectedCat('all')}
          >
            All Phases ({phases.length})
          </button>
          <button
            className={selectedCat === 'civil' ? 'active' : ''}
            onClick={() => setSelectedCat('civil')}
          >
            Civil Work ({phases.filter(p => p.category === 'civil').length})
          </button>
          <button
            className={selectedCat === 'shifting' ? 'active' : ''}
            onClick={() => setSelectedCat('shifting')}
          >
            Shifting ({phases.filter(p => p.category === 'shifting').length})
          </button>
          <button
            className={selectedCat === 'commissioning' ? 'active' : ''}
            onClick={() => setSelectedCat('commissioning')}
          >
            Commissioning ({phases.filter(p => p.category === 'commissioning').length})
          </button>
        </div>

        <div className="gantt-legend-chips">
          <span className="legend-chip civil"><span className="color-box civil" /> Civil Readiness</span>
          <span className="legend-chip shifting"><span className="color-box shifting" /> Machine Shifting</span>
          <span className="legend-chip commissioning"><span className="color-box commissioning" /> Commissioning</span>
          <span className="legend-chip stop-prod"><span className="color-box stop" /> Production Downtime Risk</span>
        </div>
      </div>

      <Panel
        title="Plant Relocation & Commissioning Timeline"
        subtitle="8-Month client-facing schedule. Phases overlap to prevent prolonged plant shutdowns."
      >
        <div className="gantt-table-container">
          <table className="gantt-table">
            <thead>
              <tr>
                <th style={{ width: '80px' }}>Phase</th>
                <th style={{ width: '180px' }}>Department / Area</th>
                <th style={{ minWidth: '220px' }}>Activities</th>
                <th style={{ width: '110px' }}>Duration</th>
                {Array.from({ length: 8 }, (_, i) => (
                  <th key={i} className="month-col-head" style={{ width: '65px' }}>
                    <span className="month-name">M{i + 1}</span>
                    <span className="month-quarter">Q{Math.floor(i / 3) + 1}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredPhases.map(phase => {
                const phaseActs = actions.filter(a => a.phaseId === phase.id);
                return (
                  <tr
                    key={phase.id}
                    className="gantt-row"
                    onClick={() => preview(`${phase.phaseLabel}: ${phase.title}`, `${phase.activities}\n\nAssigned Actions: ${phaseActs.length}\nDuration: ${phase.durationLabel}\nProduction Stoppage: ${phase.stopsProduction ? 'YES (requires weekend shift)' : 'NO'}`)}
                  >
                    <td>
                      <span className="mono font-semibold text-xs">{phase.phaseLabel}</span>
                    </td>
                    <td>
                      <div className="dept-cell">
                        <strong>{phase.title}</strong>
                        <span className={`phase-cat-badge ${phase.category}`}>{phase.category}</span>
                      </div>
                    </td>
                    <td>
                      <p className="activities-text">{phase.activities}</p>
                    </td>
                    <td>
                      <div className="duration-cell">
                        <span className="duration-pill">{phase.durationLabel}</span>
                        {phase.stopsProduction && (
                          <span className="prod-stop-flag" title="Critical: Production downtime risk. Shift over weekend/planned shutdown.">
                            <Icon name="ShieldAlert" size={12} />
                            Weekend Shift
                          </span>
                        )}
                      </div>
                    </td>
                    {Array.from({ length: 8 }, (_, i) => {
                      const monthNum = i + 1;
                      const isActive = monthNum >= phase.startMonth && monthNum <= phase.endMonth;
                      const isStart = monthNum === phase.startMonth;
                      const isEnd = monthNum === phase.endMonth;
                      return (
                        <td key={i} className={`gantt-month-cell ${isActive ? 'active-span' : ''}`}>
                          {isActive && (
                            <div
                              className={`gantt-bar ${phase.category} ${isStart ? 'start-cap' : ''} ${isEnd ? 'end-cap' : ''}`}
                            >
                              {isStart && <span className="bar-label">{phase.durationLabel}</span>}
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Panel>

      {/* Phase Summary Cards Grid */}
      <div className="section-heading mt-18">
        <div>
          <h2>Phase Execution Summaries</h2>
          <p className="muted">Department-by-department shift sequence, dependencies, and action loads</p>
        </div>
      </div>

      <div className="project-phases-cards-grid">
        {filteredPhases.map(phase => {
          const phaseActs = actions.filter(a => a.phaseId === phase.id);
          return (
            <div key={phase.id} className="project-phase-card">
              <div className="between">
                <span className="mono font-semibold text-sm">{phase.phaseLabel}</span>
                <span className={`phase-cat-badge ${phase.category}`}>{phase.category}</span>
              </div>
              <h3 className="phase-card-title">{phase.title}</h3>
              <p className="phase-card-desc">{phase.activities}</p>

              <div className="phase-card-meta">
                <div>
                  <span className="mono muted text-xs">WINDOW</span>
                  <span className="font-medium text-xs">Month {phase.startMonth}–{phase.endMonth}</span>
                </div>
                <div>
                  <span className="mono muted text-xs">DURATION</span>
                  <span className="font-medium text-xs">{phase.durationLabel}</span>
                </div>
                <div>
                  <span className="mono muted text-xs">ACTIONS</span>
                  <span className="font-medium text-xs">{phaseActs.length} tasks</span>
                </div>
              </div>

              {phase.stopsProduction && (
                <div className="phase-alert-box">
                  <Icon name="ShieldAlert" size={14} />
                  <span>Stops Production: Must relocate during weekend cutover.</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   02. ACTIONS & MITIGATIONS REGISTER
   ───────────────────────────────────────────────────────────────────────────── */
function ProjectActions() {
  const { actions, toggleActionStatus, addAction } = useContext(ProjectContext);
  const [sourceFilter, setSourceFilter] = useState<'all' | 'Risk Assessment' | 'VSM Kaizen' | 'Engineering'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Completed' | 'In Progress' | 'Pending'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newPhase, setNewPhase] = useState('PHASE-03');
  const [newOwner, setNewOwner] = useState('');
  const [newPriority, setNewPriority] = useState<'Critical' | 'High' | 'Medium'>('High');
  const [newStopsProd, setNewStopsProd] = useState(false);
  const preview = usePreview();

  const filtered = actions.filter(a => {
    if (sourceFilter !== 'all' && a.source !== sourceFilter) return false;
    if (statusFilter !== 'all' && a.status !== statusFilter) return false;
    return true;
  });

  const handleSaveAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    addAction({
      phaseId: newPhase,
      phaseName: initialPhases.find(p => p.id === newPhase)?.title || 'Relocation Phase',
      title: newTitle.trim(),
      source: 'Engineering',
      sourceRef: 'ENG-NEW',
      owner: newOwner.trim() || 'Operations Lead',
      targetWeek: 'Week 16',
      priority: newPriority,
      status: 'Pending',
      stopsProduction: newStopsProd,
    });
    setNewTitle('');
    setNewOwner('');
    setShowAddModal(false);
  };

  return (
    <>
      <div className="between vsi-filter-bar">
        <div className="pill-tabs" role="tablist">
          <button
            className={sourceFilter === 'all' ? 'active' : ''}
            onClick={() => setSourceFilter('all')}
          >
            All Sources ({actions.length})
          </button>
          <button
            className={sourceFilter === 'Risk Assessment' ? 'active' : ''}
            onClick={() => setSourceFilter('Risk Assessment')}
          >
            Step 14: Risk Mitigations ({actions.filter(a => a.source === 'Risk Assessment').length})
          </button>
          <button
            className={sourceFilter === 'VSM Kaizen' ? 'active' : ''}
            onClick={() => setSourceFilter('VSM Kaizen')}
          >
            Step 04: VSM Improvements ({actions.filter(a => a.source === 'VSM Kaizen').length})
          </button>
        </div>

        <div className="flex gap-8">
          <select
            className="styled-select"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as any)}
            aria-label="Filter by status"
          >
            <option value="all">All Statuses</option>
            <option value="Completed">Completed</option>
            <option value="In Progress">In Progress</option>
            <option value="Pending">Pending</option>
          </select>
          <PillButton variant="blue" icon="Plus" onClick={() => setShowAddModal(true)}>
            Add Action
          </PillButton>
        </div>
      </div>

      <Panel
        title="Consolidated Implementation Action Register"
        subtitle="Every action is mapped to a phase. Mitigations drawn directly from Step 14 Risk Assessment & Step 04 VSM."
      >
        <div className="table-wrap">
          <table className="products-table">
            <thead>
              <tr>
                <th style={{ width: '80px' }}>ID</th>
                <th style={{ width: '160px' }}>Phase</th>
                <th>Action & Deliverable</th>
                <th style={{ width: '130px' }}>Source Module</th>
                <th style={{ width: '120px' }}>Owner</th>
                <th style={{ width: '90px' }}>Target</th>
                <th style={{ width: '90px' }}>Priority</th>
                <th style={{ width: '110px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(act => (
                <tr key={act.id} className="lift">
                  <td>
                    <span className="mono font-semibold text-xs">{act.id}</span>
                  </td>
                  <td>
                    <span className="text-xs font-medium">{act.phaseName}</span>
                  </td>
                  <td>
                    <div className="action-title-cell">
                      <span>{act.title}</span>
                      {act.stopsProduction && (
                        <span className="prod-stop-badge">
                          <Icon name="ShieldAlert" size={11} />
                          Downtime Risk
                        </span>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className={`source-module-chip ${act.source.toLowerCase().replace(' ', '-')}`}>
                      {act.source} ({act.sourceRef})
                    </span>
                  </td>
                  <td>
                    <span className="text-xs muted">{act.owner}</span>
                  </td>
                  <td>
                    <span className="mono text-xs">{act.targetWeek}</span>
                  </td>
                  <td>
                    <span className={`priority-tag ${act.priority.toLowerCase()}`}>
                      {act.priority}
                    </span>
                  </td>
                  <td>
                    <button
                      className={`status-toggle-btn ${act.status.toLowerCase().replace(' ', '-')}`}
                      onClick={() => toggleActionStatus(act.id)}
                      title="Click to advance status"
                    >
                      {act.status}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      {/* Add Action Modal */}
      {showAddModal && (
        <div className="dialog-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="dialog-card" onClick={e => e.stopPropagation()}>
            <div className="dialog-header">
              <div>
                <h2>Add Implementation Action</h2>
                <p className="muted">Schedule a new action against an implementation phase</p>
              </div>
              <button className="circle-button" onClick={() => setShowAddModal(false)}>
                <Icon name="X" size={16} />
              </button>
            </div>
            <form onSubmit={handleSaveAction} className="dialog-form">
              <label>
                <span>Action Description</span>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Conduct laser foundation leveling for CNC turning cells"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                />
              </label>

              <div className="two-col-inputs">
                <label>
                  <span>Assigned Phase</span>
                  <select value={newPhase} onChange={e => setNewPhase(e.target.value)}>
                    {initialPhases.map(p => (
                      <option key={p.id} value={p.id}>{p.phaseLabel}: {p.title}</option>
                    ))}
                  </select>
                </label>

                <label>
                  <span>Priority</span>
                  <select value={newPriority} onChange={e => setNewPriority(e.target.value as any)}>
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                  </select>
                </label>
              </div>

              <div className="two-col-inputs">
                <label>
                  <span>Responsible Owner</span>
                  <input
                    type="text"
                    placeholder="e.g. R. Kulkarni (Maintenance)"
                    value={newOwner}
                    onChange={e => setNewOwner(e.target.value)}
                  />
                </label>

                <label className="checkbox-label mt-24">
                  <input
                    type="checkbox"
                    checked={newStopsProd}
                    onChange={e => setNewStopsProd(e.target.checked)}
                  />
                  <span>Stops production during move</span>
                </label>
              </div>

              <div className="dialog-actions">
                <button type="button" className="pill-button" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="pill-button primary project-btn">
                  Save Action
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   03. ROLLOUT CHARTER & RECOMMENDATION REPORT
   ───────────────────────────────────────────────────────────────────────────── */
function ProjectReport() {
  const { plan, phases, actions, checkpoints } = useContext(ProjectContext);
  const preview = usePreview();

  const approvedCheckpoints = checkpoints.filter(c => c.status === 'Approved').length;
  const criticalMitigations = actions.filter(a => a.source === 'Risk Assessment' && a.priority === 'Critical').length;

  return (
    <>
      <Panel className="report-cover-panel">
        <div className="between items-start">
          <div>
            <div className="project-hero-badge">
              <span className="project-hero-pill">STEP 15 · FINAL DELIVERABLE</span>
              <span className="project-status-chip">EXECUTIVE SIGN-OFF READY</span>
            </div>
            <h1 className="report-main-title">{plan.name}</h1>
            <p className="report-main-sub">
              Official Master Rollout Recommendation · {plan.facility} · {plan.orgName}
            </p>
          </div>
          <div className="flex gap-8">
            <PillButton variant="blue" icon="Download" onClick={() => preview('Export Rollout Package', 'Generating executive PDF and PowerPoint deck for Step 15 Project Plan...')}>
              Export Executive Deck
            </PillButton>
          </div>
        </div>

        <div className="report-summary-boxes mt-20">
          <div className="rep-box">
            <span className="mono muted text-xs">PROJECT WINDOW</span>
            <strong>{plan.totalMonths} Months ({plan.totalWeeks} Wks)</strong>
            <span className="text-xs muted">{plan.startDate} to {plan.targetDate}</span>
          </div>
          <div className="rep-box">
            <span className="mono muted text-xs">CAPEX BUDGET</span>
            <strong className="text-emerald-700">{plan.estimatedBudget}</strong>
            <span className="text-xs muted">Within approved facility allocation</span>
          </div>
          <div className="rep-box">
            <span className="mono muted text-xs">DOWNTIME RISK</span>
            <strong className="text-blue-700">0 Planned Days Lost</strong>
            <span className="text-xs muted">Insulated by 3-day buffers & weekend shifts</span>
          </div>
          <div className="rep-box">
            <span className="mono muted text-xs">GATE COMPLIANCE</span>
            <strong>{approvedCheckpoints}/10 Criteria Cleared</strong>
            <span className="text-xs muted">Phase 1 infrastructure greenlit</span>
          </div>
        </div>
      </Panel>

      {/* Migration Phasing Overview Table */}
      <Panel
        title="Department Relocation Phasing Matrix"
        subtitle="Sequential departmental migration schedule designed to preserve 100% order fulfillment"
      >
        <div className="table-wrap">
          <table className="products-table">
            <thead>
              <tr>
                <th style={{ width: '80px' }}>Step</th>
                <th style={{ width: '180px' }}>Department</th>
                <th>Relocation Activities & Scope</th>
                <th style={{ width: '100px' }}>Window</th>
                <th style={{ width: '110px' }}>Duration</th>
                <th style={{ width: '110px' }}>Continuity Rule</th>
              </tr>
            </thead>
            <tbody>
              {phases.map(p => (
                <tr key={p.id}>
                  <td>
                    <span className="mono font-semibold text-xs">{p.phaseLabel}</span>
                  </td>
                  <td>
                    <span className="font-semibold text-sm">{p.title}</span>
                  </td>
                  <td>
                    <p className="text-xs text-muted leading-relaxed">{p.activities}</p>
                  </td>
                  <td>
                    <span className="mono text-xs font-medium">Month {p.startMonth}–{p.endMonth}</span>
                  </td>
                  <td>
                    <span className="duration-pill">{p.durationLabel}</span>
                  </td>
                  <td>
                    {p.stopsProduction ? (
                      <span className="prod-stop-badge">Weekend Cutover</span>
                    ) : (
                      <span className="text-xs text-emerald-700 font-medium">Parallel Run</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      {/* Sign-off & Governance Block */}
      <div className="project-two-col mt-18">
        <Panel
          title="Risk & Value Stream Integration"
          subtitle="How upstream steps validate this rollout plan"
        >
          <div className="integration-list">
            <div className="integration-item">
              <div className="icon-badge amber">
                <Icon name="ShieldAlert" size={18} />
              </div>
              <div>
                <strong>Step 14: Risk Assessment Linked</strong>
                <p className="text-xs muted">
                  All {criticalMitigations} critical risks from assessment <code>{plan.riskAssessmentLinked}</code> have
                  been scheduled into dedicated mitigation tasks with assigned department owners.
                </p>
              </div>
            </div>

            <div className="integration-item">
              <div className="icon-badge teal">
                <Icon name="Compass" size={18} />
              </div>
              <div>
                <strong>Step 03: Value Stream ID Aligned</strong>
                <p className="text-xs muted">
                  Anchor stream <code>{plan.vsmLinked}</code> leads Phase 3 primary manufacturing cutover, ensuring 48.3%
                  core volume reaches stabilization before secondary gear families shift.
                </p>
              </div>
            </div>
          </div>
        </Panel>

        <Panel
          title="Steering Committee Sign-Off"
          subtitle="Tripartite governance sign-off for execution launch"
        >
          <div className="signoff-grid">
            <div className="signoff-box">
              <span className="signoff-role">Plant Head</span>
              <strong className="signoff-name">R. Deshpande</strong>
              <span className="signoff-status signed">✓ Approved for Execution</span>
              <span className="signoff-date">28 Oct 2026</span>
            </div>
            <div className="signoff-box">
              <span className="signoff-role">Lead LFD Consultant</span>
              <strong className="signoff-name">A. Kulkarni</strong>
              <span className="signoff-status signed">✓ Methodology Certified</span>
              <span className="signoff-date">29 Oct 2026</span>
            </div>
            <div className="signoff-box">
              <span className="signoff-role">EHS & Safety Director</span>
              <strong className="signoff-name">Dr. S. Nair</strong>
              <span className="signoff-status signed">✓ Safety Gate Cleared</span>
              <span className="signoff-date">29 Oct 2026</span>
            </div>
          </div>
        </Panel>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN PROJECT PLAN ROUTER COMPONENT
   ───────────────────────────────────────────────────────────────────────────── */
export default function ProjectPlan() {
  const location = useLocation();
  const preview = usePreview();
  const desc = projectDescriptions[location.pathname] || projectDescriptions['/project-plan'];

  const getActiveTab = () => {
    if (location.pathname === '/project-plan/phases') return 'phases';
    if (location.pathname === '/project-plan/actions') return 'actions';
    if (location.pathname === '/project-plan/report') return 'report';
    return 'overview';
  };

  const activeTab = getActiveTab();

  return (
    <>
      <PageHeading
        title="Project Plan"
        description={desc}
        actions={
          <div className="flex gap-8">
            <PillButton
              icon="Download"
              onClick={() => preview('Export Rollout Schedule', 'Preparing XLSX Gantt schedule and task breakdown...')}
            >
              Export Gantt
            </PillButton>
            <PillButton
              variant="blue"
              icon="CalendarRange"
              onClick={() => preview('Schedule Simulation', 'Running constraint analysis on 8-month relocation window...')}
            >
              Simulate Schedule
            </PillButton>
          </div>
        }
      >
        <div className="project-hero-mark">
          <span className="step-tag">STEP 15</span>
          <span className="hero-divider">/</span>
          <span className="hero-module-title">PROJECT PLANNING & ROLLOUT</span>
        </div>
      </PageHeading>

      {/* Pill tabs matching other modules */}
      <div className="vsi-step-strip">
        <Link
          to="/project-plan"
          className={`ppq-step-strip-item ${activeTab === 'overview' ? 'active' : ''}`}
        >
          <span className="step-num">00</span>
          <strong>Overview</strong>
          <span className="step-sub">Plan & Roadmaps</span>
        </Link>
        <Link
          to="/project-plan/phases"
          className={`ppq-step-strip-item ${activeTab === 'phases' ? 'active' : ''}`}
        >
          <span className="step-num">01</span>
          <strong>Timeline & Phases</strong>
          <span className="step-sub">8-Month Gantt</span>
        </Link>
        <Link
          to="/project-plan/actions"
          className={`ppq-step-strip-item ${activeTab === 'actions' ? 'active' : ''}`}
        >
          <span className="step-num">02</span>
          <strong>Actions & Mitigations</strong>
          <span className="step-sub">24 Consolidated Tasks</span>
        </Link>
        <Link
          to="/project-plan/report"
          className={`ppq-step-strip-item ${activeTab === 'report' ? 'active' : ''}`}
        >
          <span className="step-num">03</span>
          <strong>Rollout Report</strong>
          <span className="step-sub">Charter & Sign-Off</span>
        </Link>
      </div>

      {activeTab === 'overview' && <ProjectOverview />}
      {activeTab === 'phases' && <ProjectPhases />}
      {activeTab === 'actions' && <ProjectActions />}
      {activeTab === 'report' && <ProjectReport />}
    </>
  );
}
