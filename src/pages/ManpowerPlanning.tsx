import { createContext, useContext, useState, type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  manpowerNavigation, manpowerDescriptions, manpowerDepartments as initialDepartments,
  type ManpowerDept,
} from '../data/mock';
import Icon from '../components/Icon';
import { PageHeading, Panel, PillButton, StatCard } from '../components/UI';
import { usePreview } from '../components/PreviewDialog';

interface ManpowerContextType {
  departments: ManpowerDept[];
  setDepartments: React.Dispatch<React.SetStateAction<ManpowerDept[]>>;
}

const ManpowerContext = createContext<ManpowerContextType>({
  departments: initialDepartments,
  setDepartments: () => {},
});

export function ManpowerProvider({ children }: { children: ReactNode }) {
  const [departments, setDepartments] = useState<ManpowerDept[]>(initialDepartments);

  return (
    <ManpowerContext.Provider value={{ departments, setDepartments }}>
      {children}
    </ManpowerContext.Provider>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   00. MANPOWER PLANNING OVERVIEW
   ───────────────────────────────────────────────────────────────────────────── */
function ManpowerOverview() {
  const { departments } = useContext(ManpowerContext);
  const preview = usePreview();

  const totalCurrent = departments.reduce((acc, d) => acc + d.currentHeadcount, 0);
  const totalProposed = departments.reduce((acc, d) => acc + d.proposedHeadcount, 0);
  const netVariance = totalProposed - totalCurrent; // -26
  const totalSavings = departments.reduce((acc, d) => acc + d.annualSavingsLakhs, 0).toFixed(1);
  const avgProductivityGain = Math.round(departments.reduce((acc, d) => acc + d.productivityGainPct, 0) / departments.length);

  const pillars = [
    { title: 'Cellular Work Balancing', desc: 'Transitions operators from isolated 1-person-1-machine stations into agile U-shaped multi-machine cells.' },
    { title: 'Non-Value-Added (NVA) Elimination', desc: 'Replaces manual part handling, cart pushing, and waiting with automated gravity chutes and tugger milk runs.' },
    { title: 'Multi-Skilling & Cross-Training', desc: 'Upskills machinists to handle roughing, finishing, in-process gauging, and basic preventive maintenance.' },
    { title: 'Zero-Layoff Strategic Redeployment', desc: 'Redeploys 26 experienced machinists to staff new high-growth EV component lines and PDI inspection.' },
  ];

  return (
    <>
      <section className="stats-grid" aria-label="Manpower Planning summary metrics">
        <StatCard
          label="Current Total Staffing"
          value={`${totalCurrent} Staff`}
          subline="Across 6 shopfloor departments"
          icon="Users"
          to="/manpower/deployment"
        />
        <StatCard
          label="Lean Target Staffing"
          value={`${totalProposed} Staff`}
          subline={`${Math.abs(netVariance)} operators redeployed`}
          icon="UserCheck"
          to="/manpower/deployment"
        />
        <StatCard
          label="Productivity Gain"
          value={`+${avgProductivityGain}%`}
          subline="Average output per operator leap"
          icon="TrendingUp"
          dark
          to="/manpower/productivity"
        />
        <StatCard
          label="Annual Payroll Savings"
          value={`₹${totalSavings} L`}
          subline="Recurring operational savings/yr"
          icon="CreditCard"
          to="/manpower/report"
        />
      </section>

      <Panel
        title="Manpower Requirement Planning Charter"
        subtitle="Step 08 · Workforce optimization, cellular multi-machine staffing, and productivity modeling"
        action={
          <div className="manpower-hero-mark">
            <Icon name="Users" size={16} />
            <span>MAGENTA THEME · STEP 08</span>
          </div>
        }
        className="manpower-hero-panel"
      >
        <div className="manpower-hero-badge">
          <span className="manpower-hero-pill">LFD STEP 08</span>
          <span className="manpower-status-chip">REDEPLOYMENT APPROVED</span>
        </div>
        <h2 className="manpower-plan-title">Plant Workforce Modernization & Cellular Staffing</h2>
        <p className="manpower-plan-sub">
          Right-sizing plant headcount through U-shaped workcells, standard work combination sheets, and automated material handling.
        </p>

        <div className="manpower-alert-banner">
          <div className="alert-icon-box">
            <Icon name="ShieldCheck" size={20} />
          </div>
          <div className="alert-content">
            <strong>Lean Industrial Engineering Principle: Zero Involuntary Layoffs</strong>
            <p>
              The net reduction of 26 headcount from legacy machining and manual cart handling is fully absorbed into the new high-precision assembly lines and metrology inspection cells, delivering ₹124.8 L/year in avoided hiring and contractor expenditure.
            </p>
          </div>
          <Link to="/manpower/report" className="alert-action-btn">
            View Redeployment Plan <Icon name="ArrowRight" size={14} />
          </Link>
        </div>

        <div className="manpower-pillars-grid">
          {pillars.map((p, idx) => (
            <div key={idx} className="manpower-pillar-card">
              <span className="pillar-idx">0{idx + 1}</span>
              <strong>{p.title}</strong>
              <p>{p.desc}</p>
            </div>
          ))}
        </div>
      </Panel>

      <div className="manpower-two-col">
        <Panel title="Department Headcount Variance" subtitle="Current staffing vs proposed cellular workforce">
          <div className="dept-variance-list">
            {departments.map(dept => (
              <div key={dept.id} className="dept-variance-row">
                <div className="dept-info">
                  <span className="dept-id-badge">{dept.id}</span>
                  <div>
                    <strong>{dept.department}</strong>
                    <div className="muted">{dept.shiftPattern}</div>
                  </div>
                </div>
                <div className="headcount-figures">
                  <span className="current-count">{dept.currentHeadcount}</span>
                  <Icon name="ArrowRight" size={14} className="muted" />
                  <span className="proposed-count">{dept.proposedHeadcount}</span>
                  <span className={`variance-tag ${dept.netVariance < 0 ? 'reduced' : 'neutral'}`}>
                    {dept.netVariance < 0 ? `${dept.netVariance}` : '0'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Productivity Leap Highlights" subtitle="Output per operator per shift">
          <div className="productivity-highlights-grid">
            <div className="prod-highlight-card">
              <span className="cat-name">INTERNAL LOGISTICS</span>
              <div className="prod-stat-row">
                <span className="before">85 pcs</span>
                <Icon name="ArrowRight" size={16} />
                <span className="after">180 pcs</span>
              </div>
              <div className="gain-pill">+112% Productivity</div>
              <p className="muted">Tugger milk runs replace 6 manual pushcart runners.</p>
            </div>
            <div className="prod-highlight-card">
              <span className="cat-name">ASSEMBLY U-CELLS</span>
              <div className="prod-stat-row">
                <span className="before">45 pcs</span>
                <Icon name="ArrowRight" size={16} />
                <span className="after">78 pcs</span>
              </div>
              <div className="gain-pill">+73% Productivity</div>
              <p className="muted">Standard work combination balances assembly across 4 U-cells.</p>
            </div>
            <div className="prod-highlight-card">
              <span className="cat-name">CNC MACHINING CELL</span>
              <div className="prod-stat-row">
                <span className="before">38 pcs</span>
                <Icon name="ArrowRight" size={16} />
                <span className="after">65 pcs</span>
              </div>
              <div className="gain-pill">+71% Productivity</div>
              <p className="muted">Multi-machine operation: 1 machinist runs 2 lathes concurrently.</p>
            </div>
          </div>
        </Panel>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   01. DEPLOYMENT MATRIX
   ───────────────────────────────────────────────────────────────────────────── */
function ManpowerDeploymentView() {
  const { departments } = useContext(ManpowerContext);

  return (
    <Panel
      title="Departmental Headcount Deployment Matrix"
      subtitle="Shift-by-shift staffing distribution, net variances, and annual payroll cost impact"
    >
      <div className="table-responsive">
        <table className="manpower-table">
          <thead>
            <tr>
              <th>Dept ID</th>
              <th>Department Name</th>
              <th>Shift Pattern</th>
              <th>Current Headcount</th>
              <th>Lean Proposed</th>
              <th>Net Variance</th>
              <th>Productivity Gain</th>
              <th>Annual Payroll Savings</th>
            </tr>
          </thead>
          <tbody>
            {departments.map(dept => (
              <tr key={dept.id}>
                <td><span className="mono-badge">{dept.id}</span></td>
                <td><strong>{dept.department}</strong></td>
                <td><span className="shift-badge">{dept.shiftPattern}</span></td>
                <td><strong>{dept.currentHeadcount}</strong></td>
                <td><strong>{dept.proposedHeadcount}</strong></td>
                <td>
                  <span className={`variance-pill ${dept.netVariance < 0 ? 'lean' : 'same'}`}>
                    {dept.netVariance < 0 ? `${dept.netVariance} Staff` : '0 Even'}
                  </span>
                </td>
                <td>
                  <span className="prod-gain-pill">+{dept.productivityGainPct}%</span>
                </td>
                <td>
                  <strong>{dept.annualSavingsLakhs > 0 ? `₹${dept.annualSavingsLakhs.toFixed(1)} L` : '₹0.0 L'}</strong>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   02. PRODUCTIVITY COMPARISON
   ───────────────────────────────────────────────────────────────────────────── */
function ManpowerProductivityView() {
  const { departments } = useContext(ManpowerContext);

  return (
    <>
      <Panel
        title="Output Per Person Comparative Benchmarks"
        subtitle="Measuring labor efficiency leaps before vs after lean cellular layout integration"
      >
        <div className="productivity-bars-list">
          {departments.map(dept => {
            const currentPct = Math.min((dept.outputPerPersonCurrent / 200) * 100, 100);
            const proposedPct = Math.min((dept.outputPerPersonProposed / 200) * 100, 100);
            return (
              <div key={dept.id} className="prod-bar-item">
                <div className="between">
                  <div>
                    <strong>{dept.department}</strong>
                    <span className="muted"> ({dept.id})</span>
                  </div>
                  <span className="gain-tag">+{dept.productivityGainPct}% Lift</span>
                </div>
                <div className="bar-comparison-row">
                  <div className="bar-label-group">
                    <span className="bar-sub-label">Current: {dept.outputPerPersonCurrent} pcs/shift</span>
                    <div className="bar-track">
                      <div className="bar-fill current" style={{ width: `${currentPct}%` }} />
                    </div>
                  </div>
                  <div className="bar-label-group">
                    <span className="bar-sub-label proposed">Lean State: {dept.outputPerPersonProposed} pcs/shift</span>
                    <div className="bar-track">
                      <div className="bar-fill proposed" style={{ width: `${proposedPct}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Panel>
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   03. STAFFING REPORT & REDEPLOYMENT CHARTER
   ───────────────────────────────────────────────────────────────────────────── */
function ManpowerReportView() {
  const { departments } = useContext(ManpowerContext);
  const totalSavings = departments.reduce((acc, d) => acc + d.annualSavingsLakhs, 0).toFixed(1);
  const totalRedeployed = Math.abs(departments.reduce((acc, d) => acc + d.netVariance, 0));

  return (
    <>
      <div className="report-summary-boxes">
        <div className="rep-box">
          <span className="muted">Total Redeployed Staff</span>
          <strong style={{ color: '#A21CAF' }}>{totalRedeployed} Operators</strong>
        </div>
        <div className="rep-box">
          <span className="muted">Annual Payroll Savings</span>
          <strong style={{ color: '#15803D' }}>₹{totalSavings} Lakhs/Yr</strong>
        </div>
        <div className="rep-box">
          <span className="muted">Cross-Training Program</span>
          <strong>100% Certified</strong>
        </div>
        <div className="rep-box">
          <span className="muted">Average Labor Efficiency</span>
          <strong>88.5% (Lean Standard)</strong>
        </div>
      </div>

      <Panel
        title="Workforce Redeployment Allocation Plan"
        subtitle="Strategic absorption of freed capacity into high-growth plant initiatives"
      >
        <div className="redeployment-grid">
          <div className="redeploy-card">
            <span className="redeploy-count">12 Operators</span>
            <strong>EV Drive Unit Assembly Line</strong>
            <p className="muted">Staffing newly commissioned electric transaxle line without hiring external contract labor.</p>
          </div>
          <div className="redeploy-card">
            <span className="redeploy-count">8 Operators</span>
            <strong>In-Cell Quality Metrology & PDI</strong>
            <p className="muted">Upskilled as certified inline inspectors with Zeiss CMM and roughness tester proficiency.</p>
          </div>
          <div className="redeploy-card">
            <span className="redeploy-count">6 Operators</span>
            <strong>Tugger & Supermarket Logistics</strong>
            <p className="muted">Certified as route drivers for electric tugger trains supporting Step 10 & 11 replenishment loops.</p>
          </div>
        </div>
      </Panel>

      <Panel title="Executive Sign-Off & Integration Handoff" subtitle="Formal approval to initiate Step 09 Supply Chain Design">
        <div className="signoff-grid">
          <div className="signoff-box">
            <span className="signoff-role">VP HUMAN RESOURCES</span>
            <span className="signoff-name">Meenakshi Sundaram</span>
            <span className="signoff-status signed">✓ Redeployment Signed</span>
            <span className="signoff-date">28 Oct 2026</span>
          </div>
          <div className="signoff-box">
            <span className="signoff-role">PLANT OPERATIONS HEAD</span>
            <span className="signoff-name">Sanjay Kulkarni</span>
            <span className="signoff-status signed">✓ Staffing Approved</span>
            <span className="signoff-date">29 Oct 2026</span>
          </div>
          <div className="signoff-box">
            <span className="signoff-role">NEXT STEP PIPELINE</span>
            <span className="signoff-name">Step 09 Supply Chain</span>
            <span className="signoff-status active">Ready to Execute</span>
            <Link to="/supply-chain" className="mini-link">Open Step 09 →</Link>
          </div>
        </div>
      </Panel>
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN COMPONENT & SUB-ROUTING
   ───────────────────────────────────────────────────────────────────────────── */
export default function ManpowerPlanning() {
  const location = useLocation();
  const subPath = location.pathname.replace('/manpower', '') || '/';
  const preview = usePreview();

  const activeNav = manpowerNavigation.find(n => n.path === location.pathname) || manpowerNavigation[0];
  const desc = manpowerDescriptions[location.pathname] || manpowerDescriptions['/manpower'];

  return (
    <>
      <PageHeading
        title={activeNav.label === 'Overview' ? 'Manpower Requirement Planning' : activeNav.label}
        description={desc}
        actions={
          <div className="heading-actions">
            <PillButton
              variant="blue"
              icon="FileDown"
              onClick={() => preview('Export Staffing Matrix', 'Download complete departmental headcount roll and redeployment rosters.')}
            >
              Export Matrix
            </PillButton>
            <PillButton
              variant="outline"
              icon="Users"
              onClick={() => preview('Skill Gap Analyzer', 'Assess cross-training competency gaps for cellular machinists.')}
            >
              Skill Matrix
            </PillButton>
          </div>
        }
      />

      <div className="module-subnav">
        {manpowerNavigation.map(item => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`module-subnav-pill ${isActive ? 'active' : ''}`}
            >
              <Icon name={item.icon} size={15} />
              <span>{item.label}</span>
              {'step' in item && <span className="pill-step">{item.step}</span>}
            </Link>
          );
        })}
      </div>

      <div className="module-content">
        {subPath === '/' && <ManpowerOverview />}
        {subPath === '/deployment' && <ManpowerDeploymentView />}
        {subPath === '/productivity' && <ManpowerProductivityView />}
        {subPath === '/report' && <ManpowerReportView />}
      </div>
    </>
  );
}
