import { createContext, useContext, useState, type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  mhNavigation, mhDescriptions, mhEquipmentItems as initialEquipments,
  mhCaseComparisons as initialCases, type MHEquipmentItem, type MHCaseComparison,
} from '../data/mock';
import Icon from '../components/Icon';
import { PageHeading, Panel, PillButton, StatCard } from '../components/UI';
import { usePreview } from '../components/PreviewDialog';

interface MHContextType {
  equipments: MHEquipmentItem[];
  cases: MHCaseComparison[];
}

const MHContext = createContext<MHContextType>({
  equipments: initialEquipments,
  cases: initialCases,
});

export function MHProvider({ children }: { children: ReactNode }) {
  const [equipments] = useState<MHEquipmentItem[]>(initialEquipments);
  const [cases] = useState<MHCaseComparison[]>(initialCases);

  return (
    <MHContext.Provider value={{ equipments, cases }}>
      {children}
    </MHContext.Provider>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   00. MATERIAL HANDLING OVERVIEW & 5 CORE OBJECTIVES
   ───────────────────────────────────────────────────────────────────────────── */
function MHOverview() {
  const { equipments, cases } = useContext(MHContext);
  const preview = usePreview();

  const totalCapex = equipments.reduce((acc, eq) => acc + eq.totalCostLakhs, 0).toFixed(2);
  const totalUnits = equipments.reduce((acc, eq) => acc + eq.qty, 0);

  const objectives = [
    { title: 'Minimize Movement Distance', desc: 'Shorter, designated tugger transit routes eliminate criss-cross floor congestion.' },
    { title: 'Reduce Handling Time & Cost', desc: 'Tugger trains replace single-load forklift trips; 65% faster batch transfer.' },
    { title: 'Prevent Product Damage', desc: 'Standardized nesting carts and foam dunnage eliminate metal-on-metal gear scratches.' },
    { title: 'Improve Workplace Safety', desc: 'Eliminates high-risk diesel forklifts from indoor production pedestrian zones.' },
    { title: 'Support Continuous Flow', desc: 'Synchronized hourly milk-run schedules keep workcells supplied at takt pace.' },
  ];

  return (
    <>
      <section className="stats-grid" aria-label="Material handling summary metrics">
        <StatCard
          label="Equipment Required"
          value={totalUnits}
          subline="19 units across 5 categories"
          icon="Truck"
          to="/material-handling/design"
        />
        <StatCard
          label="Total Capex"
          value={`₹${totalCapex} L`}
          subline="Payback in 6.2 months"
          icon="CreditCard"
          dark
          to="/material-handling/report"
        />
        <StatCard
          label="Forklifts Eliminated"
          value="2 Trucks"
          subline="Replaced by electric tugger trains"
          icon="ShieldAlert"
          to="/material-handling/cases"
        />
        <StatCard
          label="Handling Time Drop"
          value="62%"
          subline="Operator spends 100% time at spindle"
          icon="TrendingUp"
          to="/material-handling/cases"
        />
      </section>

      {/* Hero Banner */}
      <Panel className="mh-hero-panel">
        <div className="between items-start">
          <div>
            <div className="mh-hero-badge">
              <span className="mh-hero-pill">STEP 11 · MATERIAL HANDLING DESIGN</span>
              <span className="mh-status-chip">LEAN FLOW VALIDATED</span>
            </div>
            <h2 className="mh-plan-title">Plant 02 Material Handling Equipment Architecture</h2>
            <p className="mh-plan-sub">
              Systematic movement, storage, control, and protection of materials throughout machining, heat treat, and assembly
            </p>
          </div>
          <div className="flex gap-8">
            <PillButton
              icon="Download"
              onClick={() => preview('Export Equipment Specification', 'Generating Step 11 Capex quotation package...')}
            >
              Export Spec
            </PillButton>
            <PillButton
              variant="blue"
              icon="Truck"
              onClick={() => preview('Simulate Tugger Milk-Run', 'Simulating 45-minute scheduled tugger loop through bays A, B, and C...')}
            >
              Simulate Routes
            </PillButton>
          </div>
        </div>

        {/* 5 Core Objectives */}
        <div className="mt-18">
          <span className="eyebrow block mb-8">THE 5 CORE OBJECTIVES OF LEAN MATERIAL HANDLING</span>
          <div className="mh-objectives-grid">
            {objectives.map((obj, idx) => (
              <div key={idx} className="mh-obj-card">
                <span className="mh-obj-num">0{idx + 1}</span>
                <strong className="text-sm block text-ink">{obj.title}</strong>
                <p className="text-xs muted mt-4">{obj.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Panel>

      {/* Quick Access to Cases & Equipment Register */}
      <div className="mh-two-col mt-18">
        <Panel
          title="Forklift-Free Plant Transition"
          subtitle="How tuggers and gravity lanes eliminate heavy indoor fork trucks"
        >
          <div className="transition-list">
            <div className="trans-item">
              <strong className="text-sm">Eliminate Pedestrian Hazards</strong>
              <p className="text-xs muted">Forklifts cause 85% of industrial factory transit accidents. Electric tugger trains stay inside dedicated 1.8m safety transit lines.</p>
            </div>
            <div className="trans-item">
              <strong className="text-sm">Decoupled Operator Work</strong>
              <p className="text-xs muted">Machine operators no longer leave their CNC machines to fetch steel bars or hunt for pallets; material handlers deliver directly to gravity infeed racks.</p>
            </div>
          </div>
        </Panel>

        <Panel
          title="Return on Investment"
          subtitle="Financial payback justification"
        >
          <div className="roi-summary-box">
            <div className="between mb-6">
              <span className="text-xs muted">Total Equipment Investment:</span>
              <strong className="mono text-sm">₹28.00 Lakhs</strong>
            </div>
            <div className="between mb-6">
              <span className="text-xs muted">Annual Forklift Rental & Fuel Savings:</span>
              <strong className="mono text-sm text-emerald-700">₹32.40 Lakhs / yr</strong>
            </div>
            <div className="between mb-6">
              <span className="text-xs muted">Product Scratches & Scrap Prevented:</span>
              <strong className="mono text-sm text-emerald-700">₹21.80 Lakhs / yr</strong>
            </div>
            <div className="between pt-8 border-t border-border">
              <span className="font-semibold text-sm">Net Simple Payback:</span>
              <strong className="mono text-base text-rose-700 font-bold">6.2 Months</strong>
            </div>
          </div>
        </Panel>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   01. EQUIPMENT PLAN & CAPEX SPECIFICATION
   ───────────────────────────────────────────────────────────────────────────── */
function MHEquipmentPlanScreen() {
  const { equipments } = useContext(MHContext);

  return (
    <>
      <Panel
        title="New Equipment Required for Operations"
        subtitle="Capex proposal: Tuggers, scissor lift carts, roller tracks, AMRs, and zero-gravity balancers"
      >
        <div className="table-wrap">
          <table className="products-table">
            <thead>
              <tr>
                <th style={{ width: '80px' }}>ID</th>
                <th style={{ width: '160px' }}>Area / Route</th>
                <th style={{ width: '130px' }}>Activity</th>
                <th>Equipment Specification</th>
                <th style={{ width: '100px' }}>Category</th>
                <th style={{ width: '100px' }}>Capacity</th>
                <th style={{ width: '70px' }}>Qty</th>
                <th style={{ width: '100px' }}>Unit (₹ L)</th>
                <th style={{ width: '100px' }}>Total (₹ L)</th>
                <th style={{ width: '100px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {equipments.map(eq => (
                <tr key={eq.id} className="lift">
                  <td>
                    <span className="mono font-semibold text-xs">{eq.id}</span>
                  </td>
                  <td>
                    <span className="text-xs font-medium">{eq.area}</span>
                  </td>
                  <td>
                    <span className="text-xs">{eq.activity}</span>
                  </td>
                  <td>
                    <div className="visual-item-title-cell">
                      <strong>{eq.equipmentName}</strong>
                      <span className="text-xs muted">{eq.justification}</span>
                    </div>
                  </td>
                  <td>
                    <span className="mh-cat-pill">{eq.category}</span>
                  </td>
                  <td>
                    <span className="mono text-xs">{eq.capacity}</span>
                  </td>
                  <td>
                    <span className="mono text-xs font-semibold">{eq.qty}</span>
                  </td>
                  <td>
                    <span className="mono text-xs">₹{eq.unitCostLakhs.toFixed(2)}</span>
                  </td>
                  <td>
                    <span className="mono text-xs font-semibold text-rose-800">₹{eq.totalCostLakhs.toFixed(2)}</span>
                  </td>
                  <td>
                    <span className={`mh-status-tag ${eq.status.toLowerCase().replace(' ', '-')}`}>
                      {eq.status}
                    </span>
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
   02. BROWNFIELD CASE COMPARISONS
   ───────────────────────────────────────────────────────────────────────────── */
function MHCasesScreen() {
  const { cases } = useContext(MHContext);

  return (
    <>
      <div className="section-heading mb-14">
        <div>
          <h2>Brownfield Equipment Transformations</h2>
          <p className="muted">Current operational bottlenecks transformed into standard lean material handling solutions</p>
        </div>
      </div>

      <div className="kaizens-cards-grid">
        {cases.map(cs => (
          <div key={cs.id} className="kaizen-sheet-card">
            <div className="between">
              <span className="mono font-semibold text-xs text-rose-800">{cs.id}</span>
              <span className="mh-cat-pill">Process: {cs.process}</span>
            </div>

            <div className="before-after-grid mt-10">
              <div className="cond-box before">
                <span className="cond-tag before">CURRENT PRACTICE & DRAWBACK</span>
                <strong className="text-xs block text-ink">{cs.currentPractice}</strong>
                <p className="text-xs text-amber-900 mt-4 leading-relaxed">{cs.currentDrawback}</p>
              </div>

              <div className="cond-box after">
                <span className="cond-tag after">PROPOSED LEAN SOLUTION</span>
                <strong className="text-xs block text-ink">{cs.proposedSolution}</strong>
                <p className="text-xs text-emerald-900 mt-4 leading-relaxed">{cs.proposedBenefit}</p>
              </div>
            </div>

            <div className="kaizen-savings-strip mt-10">
              <div>
                <span className="mono muted text-xs">TRAVEL DISTANCE CUT</span>
                <strong className="text-emerald-700 font-semibold">-{cs.distanceReductionPct}% Shorter</strong>
              </div>
              <div>
                <span className="mono muted text-xs">HANDLING TIME DROP</span>
                <strong className="text-rose-800 font-semibold">-{cs.handlingTimeDropPct}% Faster</strong>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   03. INVESTMENT REPORT & DECK
   ───────────────────────────────────────────────────────────────────────────── */
function MHReportScreen() {
  const { equipments } = useContext(MHContext);
  const preview = usePreview();

  const totalCapex = equipments.reduce((acc, eq) => acc + eq.totalCostLakhs, 0).toFixed(2);

  return (
    <>
      <Panel className="report-cover-panel">
        <div className="between items-start">
          <div>
            <div className="mh-hero-badge">
              <span className="mh-hero-pill">STEP 11 · CAPEX DELIVERABLE</span>
              <span className="mh-status-chip">EXECUTIVE DECK READY</span>
            </div>
            <h1 className="report-main-title">Material Handling Equipment Investment Plan</h1>
            <p className="report-main-sub">
              Forklift-Free Modernization, Electric Tugger Milk-Runs & Ergonomic Infeed Carts · Pune Plant 02
            </p>
          </div>
          <PillButton
            variant="blue"
            icon="Download"
            onClick={() => preview('Export Material Handling Deck', 'Generating comprehensive PDF and PowerPoint presentation...')}
          >
            Export Investment Deck
          </PillButton>
        </div>

        <div className="report-summary-boxes mt-20">
          <div className="rep-box">
            <span className="mono muted text-xs">TOTAL CAPEX</span>
            <strong className="text-rose-800 text-lg">₹{totalCapex} Lakhs</strong>
            <span className="text-xs muted">19 total equipment units</span>
          </div>
          <div className="rep-box">
            <span className="mono muted text-xs">PAYBACK PERIOD</span>
            <strong className="text-emerald-800">6.2 Months</strong>
            <span className="text-xs muted">Insulated by fuel & scrap savings</span>
          </div>
          <div className="rep-box">
            <span className="mono muted text-xs">SAFETY CLEARANCE</span>
            <strong className="text-rose-800">100% Forklift-Free</strong>
            <span className="text-xs muted">Zero indoor diesel emissions</span>
          </div>
          <div className="rep-box">
            <span className="mono muted text-xs">STEP 12 LINK</span>
            <strong className="text-emerald-800">Layout Design Ready</strong>
            <span className="text-xs muted">Aisle widths & tugger turning radii set</span>
          </div>
        </div>
      </Panel>
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN MATERIAL HANDLING ROUTER
   ───────────────────────────────────────────────────────────────────────────── */
export default function MaterialHandling() {
  const location = useLocation();
  const preview = usePreview();
  const desc = mhDescriptions[location.pathname] || mhDescriptions['/material-handling'];

  const getActiveTab = () => {
    if (location.pathname === '/material-handling/design') return 'design';
    if (location.pathname === '/material-handling/cases') return 'cases';
    if (location.pathname === '/material-handling/report') return 'report';
    return 'overview';
  };

  const activeTab = getActiveTab();

  return (
    <>
      <PageHeading
        title="Material Handling Design"
        description={desc}
        actions={
          <div className="flex gap-8">
            <PillButton
              icon="Download"
              onClick={() => preview('Export Equipment Plan', 'Preparing XLSX equipment specifications and RFQ package...')}
            >
              Export RFQ
            </PillButton>
            <PillButton
              variant="blue"
              icon="Truck"
              onClick={() => preview('MHE Safety Audit', 'Verifying turning radii against Step 12 aisle layout...')}
            >
              Safety Audit
            </PillButton>
          </div>
        }
      >
        <div className="mh-hero-mark">
          <span className="step-tag">STEP 11</span>
          <span className="hero-divider">/</span>
          <span className="hero-module-title">MATERIAL HANDLING DESIGN</span>
        </div>
      </PageHeading>

      {/* Pill tabs strip */}
      <div className="vsi-step-strip">
        <Link
          to="/material-handling"
          className={`ppq-step-strip-item ${activeTab === 'overview' ? 'active' : ''}`}
        >
          <span className="step-num">00</span>
          <strong>Overview & Objectives</strong>
          <span className="step-sub">5 Core Lean Rules</span>
        </Link>
        <Link
          to="/material-handling/design"
          className={`ppq-step-strip-item ${activeTab === 'design' ? 'active' : ''}`}
        >
          <span className="step-num">01</span>
          <strong>Equipment Plan</strong>
          <span className="step-sub">Tuggers, AMRs & Balancers</span>
        </Link>
        <Link
          to="/material-handling/cases"
          className={`ppq-step-strip-item ${activeTab === 'cases' ? 'active' : ''}`}
        >
          <span className="step-num">02</span>
          <strong>Brownfield Cases</strong>
          <span className="step-sub">Current vs Proposed</span>
        </Link>
        <Link
          to="/material-handling/report"
          className={`ppq-step-strip-item ${activeTab === 'report' ? 'active' : ''}`}
        >
          <span className="step-num">03</span>
          <strong>Investment Report</strong>
          <span className="step-sub">Capex & 6.2 Mo Payback</span>
        </Link>
      </div>

      {activeTab === 'overview' && <MHOverview />}
      {activeTab === 'design' && <MHEquipmentPlanScreen />}
      {activeTab === 'cases' && <MHCasesScreen />}
      {activeTab === 'report' && <MHReportScreen />}
    </>
  );
}
