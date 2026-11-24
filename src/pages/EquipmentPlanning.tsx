import { createContext, useContext, useState, type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  equipmentNavigation, equipmentDescriptions, equipmentPlanItems as initialEquipmentItems,
  type EquipmentPlanItem,
} from '../data/mock';
import Icon from '../components/Icon';
import { PageHeading, Panel, PillButton, StatCard } from '../components/UI';
import { usePreview } from '../components/PreviewDialog';

interface EquipmentContextType {
  items: EquipmentPlanItem[];
  setItems: React.Dispatch<React.SetStateAction<EquipmentPlanItem[]>>;
}

const EquipmentContext = createContext<EquipmentContextType>({
  items: initialEquipmentItems,
  setItems: () => {},
});

export function EquipmentProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<EquipmentPlanItem[]>(initialEquipmentItems);

  return (
    <EquipmentContext.Provider value={{ items, setItems }}>
      {children}
    </EquipmentContext.Provider>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   00. EQUIPMENT PLANNING OVERVIEW
   ───────────────────────────────────────────────────────────────────────────── */
function EquipmentOverview() {
  const { items } = useContext(EquipmentContext);
  const preview = usePreview();

  const totalCapex = items.reduce((sum, item) => sum + item.totalCapexLakhs, 0).toFixed(1);
  const totalAssets = items.length;
  const newProcurements = items.filter(i => i.decision === 'Procure Additional' || i.decision === 'Replace (New Buy)').length;
  const approvedItems = items.filter(i => i.status === 'Approved').length;

  const pillars = [
    { title: 'Keep vs Buy Rationalization', desc: 'Prevents wasteful capital spending by retrofitting capable existing machines where tolerances permit.' },
    { title: 'Takt & OEE Specification', desc: 'Directly sizes spindle speeds, tool changers, and fixturing to match Step 06 capacity targets.' },
    { title: 'Total Cost of Ownership (TCO)', desc: 'Evaluates power consumption, consumable tooling, warranty support, and spare parts availability.' },
    { title: 'Vendor Lead-Time Governance', desc: 'Schedules machinery delivery to synchronize with plant civil foundation readiness in Step 15.' },
  ];

  return (
    <>
      <section className="stats-grid" aria-label="Equipment Planning summary metrics">
        <StatCard
          label="Total Capex Investment"
          value={`₹${totalCapex} L`}
          subline="Across 6 asset categories"
          icon="CreditCard"
          dark
          to="/equipment/report"
        />
        <StatCard
          label="Equipment Registers"
          value={`${totalAssets} Asset Classes`}
          subline="Machining, QA, Tooling, Heat Treat"
          icon="Cog"
          to="/equipment/register"
        />
        <StatCard
          label="New Machine Procurements"
          value={`${newProcurements} Programs`}
          subline="Gleason Hobbers, Okuma CNC, Zeiss CMM"
          icon="PlusCircle"
          to="/equipment/plan"
        />
        <StatCard
          label="Board Approvals"
          value={`${approvedItems} of ${totalAssets} Approved`}
          subline="1 item under final tech evaluation"
          icon="CheckCircle2"
          to="/equipment/report"
        />
      </section>

      <Panel
        title="Equipment Planning Guidelines & Capital Budget"
        subtitle="Step 07 · Asset evaluation, machine selection matrix, and procurement justification"
        action={
          <div className="equipment-hero-mark">
            <Icon name="Cog" size={16} />
            <span>STEEL THEME · STEP 07</span>
          </div>
        }
        className="equipment-hero-panel"
      >
        <div className="equipment-hero-badge">
          <span className="equipment-hero-pill">LFD STEP 07</span>
          <span className="equipment-status-chip">BUDGET APPROVED</span>
        </div>
        <h2 className="equipment-plan-title">Machinery Modernization & Expansion Register</h2>
        <p className="equipment-plan-sub">
          Quantitative capital allocation based on Step 06 capacity bottlenecks and lean single-piece flow guidelines.
        </p>

        <div className="equipment-alert-banner">
          <div className="alert-icon-box">
            <Icon name="Link" size={20} />
          </div>
          <div className="alert-content">
            <strong>Input from Step 06 Capacity Planning: OP-02 Hobbing Bottleneck</strong>
            <p>
              Step 06 calculated a 114% utilization bottleneck on Gleason Hobbing. Item EQ-02 allocates ₹130.0 Lakhs to procure 2 additional Phoenix 280G CNC hobbers, lowering utilization to 85% and unlocking 56,000 units/month throughput.
            </p>
          </div>
          <Link to="/capacity" className="alert-action-btn">
            View Capacity Derivation <Icon name="ArrowRight" size={14} />
          </Link>
        </div>

        <div className="equipment-pillars-grid">
          {pillars.map((p, idx) => (
            <div key={idx} className="equipment-pillar-card">
              <span className="pillar-idx">0{idx + 1}</span>
              <strong>{p.title}</strong>
              <p>{p.desc}</p>
            </div>
          ))}
        </div>
      </Panel>

      <div className="equipment-two-col">
        <Panel title="Equipment Decision Distribution" subtitle="Rationalization of installed plant equipment">
          <div className="decision-summary-grid">
            <div className="decision-stat-box procure">
              <span className="stat-label">PROCURE ADDITIONAL</span>
              <strong>3 Assets (5 Machines)</strong>
              <p className="muted">Gleason Hobbers, Okuma CNC Lathes, Zeiss CMM</p>
              <span className="capex-tag">₹269.0 L Capex</span>
            </div>
            <div className="decision-stat-box upgrade">
              <span className="stat-label">UPGRADE / RETROFIT</span>
              <strong>1 Asset (4 Stations)</strong>
              <p className="muted">Induction pyrometer & closed-loop controls</p>
              <span className="capex-tag">₹26.0 L Capex</span>
            </div>
            <div className="decision-stat-box replace">
              <span className="stat-label">REPLACE WITH NEW TECH</span>
              <strong>1 Asset (1 Center)</strong>
              <p className="muted">5-Axis DMG MORI replacing 2 manual mills</p>
              <span className="capex-tag">₹72.0 L Capex</span>
            </div>
            <div className="decision-stat-box keep">
              <span className="stat-label">KEEP / RETAIN EXISTING</span>
              <strong>1 Asset (5 Machines)</strong>
              <p className="muted">Studer S33 Cylindrical Grinders (±3µm capable)</p>
              <span className="capex-tag">₹0.0 L (Zero Capex)</span>
            </div>
          </div>
        </Panel>

        <Panel title="Technical Standards Checklist" subtitle="Equipment procurement guidelines compliance">
          <div className="standards-checklist">
            <div className="std-check-item">
              <Icon name="CheckCircle2" size={16} className="text-emerald" />
              <div>
                <strong>Spindle Vibration & Tool Wear Monitoring (Industry 4.0)</strong>
                <p className="muted">All new CNC turning and hobbing equipment must feature IO-Link vibration sensors.</p>
              </div>
            </div>
            <div className="std-check-item">
              <Icon name="CheckCircle2" size={16} className="text-emerald" />
              <div>
                <strong>CE & ISO 13849 Category 4 Safety Compliance</strong>
                <p className="muted">Interlocked safety guards, dual light curtains, and emergency stop trip loops.</p>
              </div>
            </div>
            <div className="std-check-item">
              <Icon name="CheckCircle2" size={16} className="text-emerald" />
              <div>
                <strong>Ergonomic Loading Height (850mm – 1050mm)</strong>
                <p className="muted">Operator loading trays must comply with ergonomic waist-level single-reach rules.</p>
              </div>
            </div>
            <div className="std-check-item">
              <Icon name="CheckCircle2" size={16} className="text-emerald" />
              <div>
                <strong>SMED Quick-Change Clamping Fixtures</strong>
                <p className="muted">Hydraulic quick-acting chuck jaws and preset zero-point tooling pins.</p>
              </div>
            </div>
          </div>
        </Panel>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   01. ASSET REGISTER & INVENTORY
   ───────────────────────────────────────────────────────────────────────────── */
function EquipmentRegisterView() {
  const { items } = useContext(EquipmentContext);

  return (
    <Panel
      title="Plant Equipment Register & Selection Plan"
      subtitle="Complete asset roster with quantity deltas, capital costs, and technical remarks"
    >
      <div className="table-responsive">
        <table className="equipment-table">
          <thead>
            <tr>
              <th>Asset ID</th>
              <th>Machine Description</th>
              <th>Category</th>
              <th>Current</th>
              <th>Future</th>
              <th>Decision Strategy</th>
              <th>Unit Capex</th>
              <th>Total Capex</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id}>
                <td><span className="mono-badge">{item.id}</span></td>
                <td>
                  <strong>{item.machineType}</strong>
                  <div className="sub-detail">{item.remarks}</div>
                </td>
                <td><span className="cat-pill">{item.category}</span></td>
                <td><strong>{item.currentQty}</strong></td>
                <td><strong>{item.futureNeededQty}</strong></td>
                <td>
                  <span className={`decision-pill ${
                    item.decision === 'Procure Additional' ? 'procure' :
                    item.decision === 'Upgrade (Retrofit)' ? 'upgrade' :
                    item.decision === 'Replace (New Buy)' ? 'replace' : 'keep'
                  }`}>
                    {item.decision}
                  </span>
                </td>
                <td>{item.unitCostLakhs > 0 ? `₹${item.unitCostLakhs.toFixed(1)} L` : '—'}</td>
                <td><strong>{item.totalCapexLakhs > 0 ? `₹${item.totalCapexLakhs.toFixed(1)} L` : '₹0.0 L'}</strong></td>
                <td>
                  <span className={`status-pill ${item.status === 'Approved' ? 'approved' : 'eval'}`}>
                    {item.status}
                  </span>
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
   02. SELECTION PLAN & TECHNICAL JUSTIFICATIONS
   ───────────────────────────────────────────────────────────────────────────── */
function EquipmentSelectionPlanView() {
  const { items } = useContext(EquipmentContext);

  return (
    <>
      <Panel
        title="Technical Selection & Engineering Justifications"
        subtitle="Detailed engineering rationale behind Keep, Upgrade, Replace, or Procure decisions"
      >
        <div className="justification-cards-grid">
          {items.map(item => (
            <div key={item.id} className="justification-card">
              <div className="between">
                <span className="mono-badge">{item.id}</span>
                <span className={`decision-pill ${
                  item.decision === 'Procure Additional' ? 'procure' :
                  item.decision === 'Upgrade (Retrofit)' ? 'upgrade' :
                  item.decision === 'Replace (New Buy)' ? 'replace' : 'keep'
                }`}>
                  {item.decision}
                </span>
              </div>
              <h3 className="card-title">{item.machineType}</h3>
              <p className="card-desc">{item.remarks}</p>

              <div className="card-metrics-strip">
                <div>
                  <span className="label">Current Fleet</span>
                  <strong>{item.currentQty} Units</strong>
                </div>
                <div>
                  <span className="label">Future Target</span>
                  <strong>{item.futureNeededQty} Units</strong>
                </div>
                <div>
                  <span className="label">Allocated Capex</span>
                  <strong>₹{item.totalCapexLakhs.toFixed(1)} L</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   03. INVESTMENT REPORT & VENDOR TIMELINES
   ───────────────────────────────────────────────────────────────────────────── */
function EquipmentReportView() {
  const { items } = useContext(EquipmentContext);
  const totalCapex = items.reduce((sum, item) => sum + item.totalCapexLakhs, 0).toFixed(1);

  return (
    <>
      <div className="report-summary-boxes">
        <div className="rep-box">
          <span className="muted">Total Capex Approved</span>
          <strong style={{ color: '#44546A' }}>₹{totalCapex} Lakhs</strong>
        </div>
        <div className="rep-box">
          <span className="muted">Total Net Machines Added</span>
          <strong>+5 Units</strong>
        </div>
        <div className="rep-box">
          <span className="muted">Longest Vendor Lead Time</span>
          <strong>24 Weeks (Gleason USA)</strong>
        </div>
        <div className="rep-box">
          <span className="muted">ROI Payback Period</span>
          <strong style={{ color: '#15803D' }}>14.8 Months</strong>
        </div>
      </div>

      <Panel
        title="Vendor Procurement Timelines & Lead Times"
        subtitle="Delivery windows, foundation civil requirements, and commissioning milestones"
      >
        <div className="vendor-lead-list">
          <div className="vendor-row">
            <div className="vendor-meta">
              <strong>Gleason Works Inc. (Rochester, NY, USA)</strong>
              <span className="muted">2x Gleason Phoenix 280G CNC Hobbers · Capex: ₹130.0 L</span>
            </div>
            <div className="lead-tag critical">24 Weeks Lead Time</div>
            <div className="vendor-status">PO Issued · Production Slotted</div>
          </div>
          <div className="vendor-row">
            <div className="vendor-meta">
              <strong>DMG MORI India (Bengaluru Tech Center)</strong>
              <span className="muted">1x DMU 50 5-Axis Machining Center · Capex: ₹72.0 L</span>
            </div>
            <div className="lead-tag medium">20 Weeks Lead Time</div>
            <div className="vendor-status">Final Technical Evaluation</div>
          </div>
          <div className="vendor-row">
            <div className="vendor-meta">
              <strong>Carl Zeiss India (Metrology Division)</strong>
              <span className="muted">1x Zeiss CONTURA CNC Coordinate Measuring Machine · Capex: ₹55.0 L</span>
            </div>
            <div className="lead-tag medium">16 Weeks Lead Time</div>
            <div className="vendor-status">Approved · Foundation Trench Ready</div>
          </div>
          <div className="vendor-row">
            <div className="vendor-meta">
              <strong>Okuma Machine Tools (Japan / India Distributor)</strong>
              <span className="muted">2x Okuma LB3000 EX II Space Center Lathes · Capex: ₹84.0 L</span>
            </div>
            <div className="lead-tag standard">12 Weeks Lead Time</div>
            <div className="vendor-status">Approved · Shipping Q1 2027</div>
          </div>
        </div>
      </Panel>

      <Panel title="Executive Sign-Off & Integration Handoff" subtitle="Formal approval to initiate Step 08 Manpower Planning">
        <div className="signoff-grid">
          <div className="signoff-box">
            <span className="signoff-role">CHIEF MANUFACTURING ENGINEER</span>
            <span className="signoff-name">Anand Vardhan</span>
            <span className="signoff-status signed">✓ Technical Signoff</span>
            <span className="signoff-date">26 Oct 2026</span>
          </div>
          <div className="signoff-box">
            <span className="signoff-role">FINANCE DIRECTOR & CFO</span>
            <span className="signoff-name">Sunil Nambiar</span>
            <span className="signoff-status signed">✓ Capex Approved</span>
            <span className="signoff-date">27 Oct 2026</span>
          </div>
          <div className="signoff-box">
            <span className="signoff-role">NEXT STEP PIPELINE</span>
            <span className="signoff-name">Step 08 Manpower Plan</span>
            <span className="signoff-status active">Ready to Execute</span>
            <Link to="/manpower" className="mini-link">Open Step 08 →</Link>
          </div>
        </div>
      </Panel>
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN COMPONENT & SUB-ROUTING
   ───────────────────────────────────────────────────────────────────────────── */
export default function EquipmentPlanning() {
  const location = useLocation();
  const subPath = location.pathname.replace('/equipment', '') || '/';
  const preview = usePreview();

  const activeNav = equipmentNavigation.find(n => n.path === location.pathname) || equipmentNavigation[0];
  const desc = equipmentDescriptions[location.pathname] || equipmentDescriptions['/equipment'];

  return (
    <>
      <PageHeading
        title={activeNav.label === 'Overview' ? 'Equipment Planning Guidelines' : activeNav.label}
        description={desc}
        actions={
          <div className="heading-actions">
            <PillButton
              variant="blue"
              icon="FileDown"
              onClick={() => preview('Export Equipment Plan', 'Download complete machinery specifications and Capex quotation sheets.')}
            >
              Export Register
            </PillButton>
            <PillButton
              variant="outline"
              icon="FileSpreadsheet"
              onClick={() => preview('Vendor RfQ Pack', 'Generate standardized RfQ technical requirements packages.')}
            >
              Generate RfQs
            </PillButton>
          </div>
        }
      />

      <div className="module-subnav">
        {equipmentNavigation.map(item => {
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
        {subPath === '/' && <EquipmentOverview />}
        {subPath === '/register' && <EquipmentRegisterView />}
        {subPath === '/plan' && <EquipmentSelectionPlanView />}
        {subPath === '/report' && <EquipmentReportView />}
      </div>
    </>
  );
}
