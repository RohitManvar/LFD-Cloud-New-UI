import { createContext, useContext, useState, type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  capacityNavigation, capacityDescriptions, capacityOperations as initialOperations,
  type CapacityOperation,
} from '../data/mock';
import Icon from '../components/Icon';
import { PageHeading, Panel, PillButton, StatCard } from '../components/UI';
import { usePreview } from '../components/PreviewDialog';

interface CapacityContextType {
  operations: CapacityOperation[];
  setOperations: React.Dispatch<React.SetStateAction<CapacityOperation[]>>;
}

const CapacityContext = createContext<CapacityContextType>({
  operations: initialOperations,
  setOperations: () => {},
});

export function CapacityProvider({ children }: { children: ReactNode }) {
  const [operations, setOperations] = useState<CapacityOperation[]>(initialOperations);

  return (
    <CapacityContext.Provider value={{ operations, setOperations }}>
      {children}
    </CapacityContext.Provider>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   00. CAPACITY PLANNING OVERVIEW
   ───────────────────────────────────────────────────────────────────────────── */
function CapacityOverview() {
  const { operations } = useContext(CapacityContext);
  const preview = usePreview();

  const totalDemand = 48000;
  const bottleneckOp = operations.find(o => o.isBottleneck);
  const totalMachines = operations.reduce((sum, o) => sum + o.availableMachines, 0);
  const requiredMachines = operations.reduce((sum, o) => sum + o.requiredMachines, 0);
  const machineDeficit = requiredMachines - totalMachines;

  const pillars = [
    { title: 'Takt vs Cycle Synchronisation', desc: 'Balances operation cycle times against customer demand rate to eliminate line starvation and blocking.' },
    { title: 'Effective Available Time', desc: 'Accounts for planned maintenance, changeover loss, and real-world 85% OEE operating factors.' },
    { title: 'Theory of Constraints (TOC)', desc: 'Identifies the single pacemaker bottleneck that limits plant-wide throughput and revenue.' },
    { title: 'Phased Capex Ramp', desc: 'Directly informs Step 07 Equipment specifications with quantitative machine shortfall calculations.' },
  ];

  return (
    <>
      <section className="stats-grid" aria-label="Capacity Planning summary metrics">
        <StatCard
          label="Monthly Target Demand"
          value={`${(totalDemand / 1000).toFixed(0)}k Units`}
          subline="2 Shifts × 25 Days/month"
          icon="TrendingUp"
          to="/capacity/operations"
        />
        <StatCard
          label="System Bottleneck"
          value={bottleneckOp ? `${bottleneckOp.utilizationPct}% Util` : 'None'}
          subline={bottleneckOp ? bottleneckOp.operationName : 'Balanced'}
          icon="AlertTriangle"
          dark
          to="/capacity/calculation"
        />
        <StatCard
          label="Installed Machines"
          value={`${totalMachines} Units`}
          subline="Across 7 key manufacturing ops"
          icon="Cog"
          to="/capacity/operations"
        />
        <StatCard
          label="Machine Shortfall"
          value={`+${machineDeficit} Units`}
          subline="Gleason Hobbing constraint"
          icon="PlusCircle"
          to="/capacity/report"
        />
      </section>

      <Panel
        title="Capacity Planning & Ramp-Up Charter"
        subtitle="Step 06 · Mathematical modeling of cycle times, equipment loading, and throughput bottlenecks"
        action={
          <div className="capacity-hero-mark">
            <Icon name="TrendingUp" size={16} />
            <span>OLIVE THEME · STEP 06</span>
          </div>
        }
        className="capacity-hero-panel"
      >
        <div className="capacity-hero-badge">
          <span className="capacity-hero-pill">LFD STEP 06</span>
          <span className="capacity-status-chip">SIMULATION ACTIVE</span>
        </div>
        <h2 className="capacity-plan-title">Transmission Component Line Capacity Model</h2>
        <p className="capacity-plan-sub">
          Continuous flow simulation across CNC turning, gear hobbing, induction hardening, grinding, washing, and testing workcells.
        </p>

        <div className="capacity-alert-banner">
          <div className="alert-icon-box">
            <Icon name="AlertOctagon" size={20} />
          </div>
          <div className="alert-content">
            <strong>Critical Throughput Constraint Identified: OP-02 Heavy Gear Hobbing</strong>
            <p>
              Current equipment inventory of 6 Gleason Phoenix 280G machines yields only 24,500 units/mo against 28,000 gear sets demanded (114% utilization). OP-02 starves downstream assembly cells by 12.5%. Proceed to Step 07 to procure 2 additional machines.
            </p>
          </div>
          <Link to="/equipment" className="alert-action-btn">
            Open Equipment Plan <Icon name="ArrowRight" size={14} />
          </Link>
        </div>

        <div className="capacity-pillars-grid">
          {pillars.map((p, idx) => (
            <div key={idx} className="capacity-pillar-card">
              <span className="pillar-idx">0{idx + 1}</span>
              <strong>{p.title}</strong>
              <p>{p.desc}</p>
            </div>
          ))}
        </div>
      </Panel>

      <div className="capacity-two-col">
        <Panel title="Operation Loading Snapshot" subtitle="Current machine utilization % vs 100% capacity limit">
          <div className="op-loading-list">
            {operations.map(op => (
              <div key={op.id} className="op-loading-row">
                <div className="op-meta">
                  <span className="op-id-tag">{op.id}</span>
                  <div className="op-names">
                    <strong>{op.operationName}</strong>
                    <span className="muted">{op.machineModel} ({op.availableMachines} machines)</span>
                  </div>
                  <span className={`util-percent ${op.utilizationPct > 100 ? 'over' : op.utilizationPct > 90 ? 'tight' : 'healthy'}`}>
                    {op.utilizationPct}%
                  </span>
                </div>
                <div className="util-bar-bg">
                  <div
                    className={`util-bar-fill ${op.utilizationPct > 100 ? 'over' : op.utilizationPct > 90 ? 'tight' : 'healthy'}`}
                    style={{ width: `${Math.min(op.utilizationPct, 120) * 0.833}%` }}
                  />
                  <div className="limit-marker" style={{ left: '83.3%' }} title="100% limit" />
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Ramp-Up Trajectory" subtitle="3-year volume expansion plan & constraint resolution">
          <div className="ramp-summary-cards">
            <div className="ramp-step-card">
              <span className="ramp-phase">PHASE 1 · IMMEDIATE (2026)</span>
              <strong>48,000 Units/Month</strong>
              <p className="muted">Run OP-02 on interim 3rd weekend shift to prevent supply disruption.</p>
              <div className="ramp-badge pending">Overtime Active</div>
            </div>
            <div className="ramp-step-card highlight">
              <span className="ramp-phase">PHASE 2 · MID-TERM (2027)</span>
              <strong>56,000 Units/Month</strong>
              <p className="muted">Commission 2x Gleason 280G hobbers (₹130 L Capex). Line utilization normalizes to 85%.</p>
              <div className="ramp-badge approved">Approved in Step 07</div>
            </div>
            <div className="ramp-step-card">
              <span className="ramp-phase">PHASE 3 · LONG-TERM (2028)</span>
              <strong>70,000 Units/Month</strong>
              <p className="muted">Implement automated gantry loading & robotic U-cell deburring.</p>
              <div className="ramp-badge horizon">Planning</div>
            </div>
          </div>
        </Panel>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   01. OPERATIONS & TAKT TIME MATRIX
   ───────────────────────────────────────────────────────────────────────────── */
function CapacityOperationsView() {
  const { operations } = useContext(CapacityContext);
  const taktSeconds = 120; // 48k units across 25 days * 2 shifts * 8h

  return (
    <>
      <div className="takt-banner-card">
        <div className="takt-metric">
          <span className="label">CUSTOMER TAKT TIME</span>
          <strong className="value">{taktSeconds}s</strong>
          <span className="sub">1 finished unit every 2.0 minutes</span>
        </div>
        <div className="takt-divider" />
        <div className="takt-metric">
          <span className="label">PLANNED PRODUCTION TIME</span>
          <strong className="value">400 hrs/mo</strong>
          <span className="sub">25 days × 2 shifts × 8.0 hrs</span>
        </div>
        <div className="takt-divider" />
        <div className="takt-metric">
          <span className="label">PLANT OEE FACTOR</span>
          <strong className="value">85.0%</strong>
          <span className="sub">Availability × Performance × Quality</span>
        </div>
      </div>

      <Panel
        title="Manufacturing Operations Matrix"
        subtitle="Cycle time vs available capacity across all line processing stations"
      >
        <div className="table-responsive">
          <table className="capacity-table">
            <thead>
              <tr>
                <th>Op ID</th>
                <th>Operation & Machine</th>
                <th>Cycle Time</th>
                <th>Available</th>
                <th>Monthly Demand</th>
                <th>Monthly Cap</th>
                <th>Utilization</th>
                <th>Bottleneck?</th>
              </tr>
            </thead>
            <tbody>
              {operations.map(op => (
                <tr key={op.id} className={op.isBottleneck ? 'bottleneck-row' : ''}>
                  <td><span className="mono-badge">{op.id}</span></td>
                  <td>
                    <strong>{op.operationName}</strong>
                    <div className="sub-detail">{op.machineModel}</div>
                  </td>
                  <td><strong>{op.cycleTimeSec}s</strong></td>
                  <td>{op.availableMachines} units</td>
                  <td>{op.monthlyDemand.toLocaleString()}</td>
                  <td>{op.capacityUnits.toLocaleString()}</td>
                  <td>
                    <span className={`util-pill ${op.utilizationPct > 100 ? 'over' : op.utilizationPct > 90 ? 'tight' : 'ok'}`}>
                      {op.utilizationPct}%
                    </span>
                  </td>
                  <td>
                    {op.isBottleneck ? (
                      <span className="bottleneck-tag"><Icon name="AlertTriangle" size={13} /> Bottleneck</span>
                    ) : (
                      <span className="ok-tag"><Icon name="CheckCircle2" size={13} /> Balanced</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   02. CAPACITY CALCULATION & BOTTLENECK ANALYSIS
   ───────────────────────────────────────────────────────────────────────────── */
function CapacityCalculationView() {
  const { operations } = useContext(CapacityContext);

  return (
    <>
      <Panel
        title="Theoretical vs Real-World Capacity Formulas"
        subtitle="Mathematical derivation of machine quantity requirements based on takt and cycle times"
      >
        <div className="formula-cards-grid">
          <div className="formula-card">
            <span className="formula-title">NET AVAILABLE TIME PER MACHINE</span>
            <div className="formula-math">
              T<sub>net</sub> = 25 days × 2 shifts × 8 hrs × 3,600s × 0.85 = <strong>1,224,000 sec</strong>
            </div>
            <p>Effective operating seconds available per equipment unit after 15% planned maintenance & changeover loss.</p>
          </div>
          <div className="formula-card">
            <span className="formula-title">MACHINE CAPACITY CALCULATION</span>
            <div className="formula-math">
              Capacity = (T<sub>net</sub> × Machines) / Cycle Time (s)
            </div>
            <p>Monthly maximum productive units delivered by the current installed equipment fleet.</p>
          </div>
          <div className="formula-card highlight">
            <span className="formula-title">REQUIRED MACHINES FORMULA</span>
            <div className="formula-math">
              Machines<sub>req</sub> = ⌈(Monthly Demand × Cycle Time) / T<sub>net</sub>⌉
            </div>
            <p>Ceiling integer calculation specifying exact Capex requirements for Step 07 equipment planning.</p>
          </div>
        </div>
      </Panel>

      <Panel
        title="Machine Shortfall & Debottlenecking Table"
        subtitle="Comparing installed fleet against future state requirements"
      >
        <div className="table-responsive">
          <table className="capacity-table">
            <thead>
              <tr>
                <th>Operation</th>
                <th>Cycle Time</th>
                <th>Installed Units</th>
                <th>Req. Units</th>
                <th>Variance</th>
                <th>Debottlenecking Recommendation</th>
              </tr>
            </thead>
            <tbody>
              {operations.map(op => {
                const diff = op.requiredMachines - op.availableMachines;
                return (
                  <tr key={op.id}>
                    <td>
                      <strong>{op.operationName}</strong>
                      <div className="sub-detail">{op.id} · {op.machineModel}</div>
                    </td>
                    <td>{op.cycleTimeSec}s</td>
                    <td><strong>{op.availableMachines}</strong></td>
                    <td><strong>{op.requiredMachines}</strong></td>
                    <td>
                      {diff > 0 ? (
                        <span className="diff-pill deficit">+{diff} Deficit</span>
                      ) : (
                        <span className="diff-pill balanced">0 Balanced</span>
                      )}
                    </td>
                    <td>
                      {diff > 0 ? (
                        <span className="action-text critical">
                          Procure 2 additional Gleason 280G machines in Step 07 (Capex: ₹130.0 L).
                        </span>
                      ) : op.utilizationPct > 90 ? (
                        <span className="action-text tight">
                          Monitor tooling life and implement SMED quick-changeover to preserve buffer.
                        </span>
                      ) : (
                        <span className="action-text ok">
                          Adequate capacity headroom to support up to 25% volume expansion.
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Panel>
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   03. RAMP-UP PLAN & EXECUTIVE REPORT
   ───────────────────────────────────────────────────────────────────────────── */
function CapacityReportView() {
  const { operations } = useContext(CapacityContext);

  return (
    <>
      <div className="report-summary-boxes">
        <div className="rep-box">
          <span className="muted">Total Operations</span>
          <strong>{operations.length} Workcells</strong>
        </div>
        <div className="rep-box">
          <span className="muted">Installed Machine Fleet</span>
          <strong>39 Machine Units</strong>
        </div>
        <div className="rep-box">
          <span className="muted">Identified Bottlenecks</span>
          <strong style={{ color: '#B91C1C' }}>1 (OP-02 Hobbing)</strong>
        </div>
        <div className="rep-box">
          <span className="muted">Capex to Debottleneck</span>
          <strong style={{ color: '#4D7C0F' }}>₹130.0 Lakhs</strong>
        </div>
      </div>

      <Panel
        title="3-Year Capacity Ramp-Up Master Schedule"
        subtitle="Quarter-by-quarter capacity expansion and equipment commissioning milestones"
      >
        <div className="ramp-gantt-list">
          <div className="ramp-milestone-item">
            <div className="milestone-dot active" />
            <div className="milestone-info">
              <div className="between">
                <strong>Q1-Q2 2027 · Debottlenecking Procurement & Site Prep</strong>
                <span className="milestone-status in-progress">In Progress</span>
              </div>
              <p className="muted">Issue PO for 2x Gleason 280G CNC Hobbers. Prepare pneumatic, 415V 3-phase power, and coolant foundation trenches.</p>
            </div>
          </div>
          <div className="ramp-milestone-item">
            <div className="milestone-dot" />
            <div className="milestone-info">
              <div className="between">
                <strong>Q3 2027 · Equipment Delivery, Installation & SAT Commissioning</strong>
                <span className="milestone-status pending">Pending Delivery</span>
              </div>
              <p className="muted">Site Acceptance Testing (SAT), Cpk ≥ 1.67 validation on pilot batches, operator CNC programming training.</p>
            </div>
          </div>
          <div className="ramp-milestone-item">
            <div className="milestone-dot" />
            <div className="milestone-info">
              <div className="between">
                <strong>Q4 2027 · Full Ramp-Up to 56,000 Units/Month</strong>
                <span className="milestone-status pending">Scheduled</span>
              </div>
              <p className="muted">8 hobbers running concurrently. Eliminates all overtime shifts; line throughput balanced at 120s takt.</p>
            </div>
          </div>
        </div>
      </Panel>

      <Panel title="Executive Sign-Off & Integration Handoff" subtitle="Formal approval to initiate Step 07 Equipment Planning">
        <div className="signoff-grid">
          <div className="signoff-box">
            <span className="signoff-role">CAPACITY PLANNING LEAD</span>
            <span className="signoff-name">Rajesh Sharma</span>
            <span className="signoff-status signed">✓ Verified & Validated</span>
            <span className="signoff-date">24 Oct 2026</span>
          </div>
          <div className="signoff-box">
            <span className="signoff-role">HEAD OF MANUFACTURING</span>
            <span className="signoff-name">Vikramaditya Rao</span>
            <span className="signoff-status signed">✓ Approved for Capex</span>
            <span className="signoff-date">25 Oct 2026</span>
          </div>
          <div className="signoff-box">
            <span className="signoff-role">NEXT STEP PIPELINE</span>
            <span className="signoff-name">Step 07 Equipment Plan</span>
            <span className="signoff-status active">Ready to Execute</span>
            <Link to="/equipment" className="mini-link">Open Step 07 →</Link>
          </div>
        </div>
      </Panel>
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN COMPONENT & SUB-ROUTING
   ───────────────────────────────────────────────────────────────────────────── */
export default function CapacityPlanning() {
  const location = useLocation();
  const subPath = location.pathname.replace('/capacity', '') || '/';
  const preview = usePreview();

  const activeNav = capacityNavigation.find(n => n.path === location.pathname) || capacityNavigation[0];
  const desc = capacityDescriptions[location.pathname] || capacityDescriptions['/capacity'];

  return (
    <>
      <PageHeading
        title={activeNav.label === 'Overview' ? 'Capacity Planning & Ramp-Up' : activeNav.label}
        description={desc}
        actions={
          <div className="heading-actions">
            <PillButton
              variant="blue"
              icon="FileDown"
              onClick={() => preview('Export Capacity Model', 'Download consolidated Excel simulation with cycle time distributions.')}
            >
              Export Model
            </PillButton>
            <PillButton
              variant="outline"
              icon="Sparkles"
              onClick={() => preview('AI Capacity Advisor', 'Run constraint simulation with 10% demand surge scenario.')}
            >
              Simulate Surge
            </PillButton>
          </div>
        }
      />

      <div className="module-subnav">
        {capacityNavigation.map(item => {
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
        {subPath === '/' && <CapacityOverview />}
        {subPath === '/operations' && <CapacityOperationsView />}
        {subPath === '/calculation' && <CapacityCalculationView />}
        {subPath === '/report' && <CapacityReportView />}
      </div>
    </>
  );
}
