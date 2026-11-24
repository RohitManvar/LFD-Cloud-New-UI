import { createContext, useContext, useState, type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  supermarketNavigation, supermarketDescriptions, supermarketParts as initialParts,
  lineSideStations as initialStations, type SupermarketPart, type LineSideStation,
} from '../data/mock';
import Icon from '../components/Icon';
import { PageHeading, Panel, PillButton, StatCard } from '../components/UI';
import { usePreview } from '../components/PreviewDialog';

interface SupermarketContextType {
  parts: SupermarketPart[];
  stations: LineSideStation[];
}

const SupermarketContext = createContext<SupermarketContextType>({
  parts: initialParts,
  stations: initialStations,
});

export function SupermarketProvider({ children }: { children: ReactNode }) {
  const [parts] = useState<SupermarketPart[]>(initialParts);
  const [stations] = useState<LineSideStation[]>(initialStations);

  return (
    <SupermarketContext.Provider value={{ parts, stations }}>
      {children}
    </SupermarketContext.Provider>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   00. SUPERMARKET OVERVIEW & REPLENISHMENT POLICIES
   ───────────────────────────────────────────────────────────────────────────── */
function SupermarketOverview() {
  const { parts } = useContext(SupermarketContext);
  const preview = usePreview();

  const totalGiven = parts.reduce((acc, p) => acc + p.givenLocations, 0);
  const totalNeeded = parts.reduce((acc, p) => acc + p.neededLocations, 0);
  const overallSpaceSavings = Math.round(((totalGiven - totalNeeded) / totalGiven) * 100);

  const operatingChecks = [
    { title: 'Fixed & Labelled Locations', desc: 'Parts split by type, each in a dedicated visual lane.' },
    { title: 'Strict FIFO Enforced', desc: 'Lanes load at back, pick at front; oldest material consumed first.' },
    { title: 'Consumption-Driven Refill', desc: 'Taking a container triggers production or vendor pull (Kanban).' },
    { title: 'Dynamic Kanban Sizing', desc: 'Kanban card quantities recalculated whenever takt or lead times shift.' },
    { title: 'Lost Kanban Auditing', desc: 'Daily sweep for missing cards to prevent unreplenished line starvation.' },
  ];

  const replenishmentPolicies = [
    { code: 'FTFQ', time: 'Fixed Time', qty: 'Fixed Qty', note: 'Uncontrolled inventory build. Not recommended.', tone: 'danger' },
    { code: 'FTVQ', time: 'Fixed Time', qty: 'Variable Qty', note: 'Periodic top-up matching actual consumption.', tone: 'good' },
    { code: 'VTFQ', time: 'Variable Time', qty: 'Fixed Qty', note: 'Standard Two-Bin supermarket. Trigger-based.', tone: 'recommended' },
    { code: 'VTVQ', time: 'Variable Time', qty: 'Variable Qty', note: 'Floating demand. High supplier coordination.', tone: 'neutral' },
  ];

  return (
    <>
      <section className="stats-grid" aria-label="Flow supermarket summary metrics">
        <StatCard
          label="Parts Sized"
          value={parts.length}
          subline="100% of core streams covered"
          icon="Warehouse"
          to="/supermarket/sizing"
        />
        <StatCard
          label="Space Savings"
          value={`${overallSpaceSavings}%`}
          subline={`${totalGiven} down to ${totalNeeded} locations`}
          icon="Layers"
          dark
          to="/supermarket/sizing"
        />
        <StatCard
          label="Avg Days of Inventory"
          value="3.1 Days"
          subline="Reduced from 17.5 days baseline"
          icon="TrendingUp"
          to="/supermarket/report"
        />
        <StatCard
          label="Line-Side Stations"
          value="4 Cells"
          subline="Ergonomic waist-level presentation"
          icon="SlidersHorizontal"
          to="/supermarket/line-side"
        />
      </section>

      {/* Supermarket Hero Banner */}
      <Panel className="supermarket-hero-panel">
        <div className="between items-start">
          <div>
            <div className="supermarket-hero-badge">
              <span className="supermarket-hero-pill">STEP 10 · FLOW SUPERMARKET & LINE SIDE</span>
              <span className="supermarket-status-chip">SLIDE 62 SIZING COMPLIANT</span>
            </div>
            <h2 className="supermarket-plan-title">Flow Supermarket & Line-Side Buffer Sizing</h2>
            <p className="supermarket-plan-sub">
              Right-sizing container positions between manufacturing cells to decouple process variability and cut WIP
            </p>
          </div>
          <div className="flex gap-8">
            <PillButton
              icon="Download"
              onClick={() => preview('Export Sizing Model', 'Preparing Step 10 flow supermarket rack calculations and CAD coordinates...')}
            >
              Export Sizing
            </PillButton>
            <PillButton
              variant="blue"
              icon="Warehouse"
              onClick={() => preview('Run Kanban Card Recalculation', 'Simulating daily demand swings across all 6 buffer categories...')}
            >
              Recalculate Bins
            </PillButton>
          </div>
        </div>

        {/* 4 Replenishment Policies Grid */}
        <div className="mt-18">
          <span className="eyebrow block mb-8">REPLENISHMENT POLICY ARCHITECTURE</span>
          <div className="replenishment-grid">
            {replenishmentPolicies.map(pol => (
              <div key={pol.code} className={`policy-card ${pol.tone}`}>
                <div className="between items-center mb-4">
                  <span className="mono font-semibold text-sm">{pol.code}</span>
                  {pol.tone === 'recommended' && <span className="rec-tag">Recommended</span>}
                </div>
                <strong className="text-xs block text-ink">{pol.time} · {pol.qty}</strong>
                <p className="text-xs muted mt-4">{pol.note}</p>
              </div>
            ))}
          </div>
        </div>
      </Panel>

      {/* 2-Column: Operating Rules & Line Side Objectives */}
      <div className="supermarket-two-col mt-18">
        <Panel
          title="The 5 Operating Rules of a Lean Supermarket"
          subtitle="Mandatory standard work to prevent card loss and inventory creeping"
        >
          <div className="supermarket-checks-list">
            {operatingChecks.map((chk, idx) => (
              <div key={idx} className="supermarket-check-item">
                <span className="check-num">{String(idx + 1).padStart(2, '0')}</span>
                <div>
                  <strong className="text-sm block">{chk.title}</strong>
                  <p className="text-xs muted mt-2">{chk.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel
          title="Line-Side Design Objectives"
          subtitle="The last meters from the supermarket to the operator workstation"
        >
          <div className="line-objectives-grid">
            <div className="obj-card">
              <Icon name="SlidersHorizontal" size={18} />
              <strong>Controlled Line Inventory</strong>
              <p className="text-xs muted">Eliminates piles of disorganized totes around machines.</p>
            </div>
            <div className="obj-card">
              <Icon name="TrendingUp" size={18} />
              <strong>Reduced Motion & Reaching</strong>
              <p className="text-xs muted">Parts presented within operator 450mm golden reach zone.</p>
            </div>
            <div className="obj-card">
              <Icon name="ShieldCheck" size={18} />
              <strong>Ergonomic Waisted Elevation</strong>
              <p className="text-xs muted">Tilt racks and hydraulic carts eliminate heavy bend & twist.</p>
            </div>
            <div className="obj-card">
              <Icon name="Workflow" size={18} />
              <strong>Continuous Single-Piece Pull</strong>
              <p className="text-xs muted">Directly links to Step 11 Material Handling tugger milk-runs.</p>
            </div>
          </div>
        </Panel>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   01. SUPERMARKET SIZING & STOCK ZONES (SLIDE 62 MODEL)
   ───────────────────────────────────────────────────────────────────────────── */
function SupermarketSizing() {
  const { parts } = useContext(SupermarketContext);

  return (
    <>
      <Panel
        title="Supermarket Sizing Register (Slide 62 Calculation)"
        subtitle="Comparing floor container positions today against lean supermarket sizing"
      >
        <div className="table-wrap">
          <table className="products-table">
            <thead>
              <tr>
                <th style={{ width: '80px' }}>ID</th>
                <th>Part Description</th>
                <th style={{ width: '130px' }}>Stream Type</th>
                <th style={{ width: '90px' }}>Daily Output</th>
                <th style={{ width: '80px' }}>Hold Today</th>
                <th style={{ width: '90px' }}>Proposed</th>
                <th style={{ width: '90px' }}>Qty/Trolley</th>
                <th style={{ width: '80px' }}>Given</th>
                <th style={{ width: '80px' }}>Needed</th>
                <th style={{ width: '90px' }}>Space Saved</th>
                <th style={{ width: '120px' }}>Stock Zone</th>
              </tr>
            </thead>
            <tbody>
              {parts.map(part => (
                <tr key={part.id} className="lift">
                  <td>
                    <span className="mono font-semibold text-xs">{part.id}</span>
                  </td>
                  <td>
                    <span className="font-semibold text-sm">{part.name}</span>
                  </td>
                  <td>
                    <span className="text-xs muted">{part.itemType}</span>
                  </td>
                  <td>
                    <span className="mono text-xs">{part.dailyOutput}</span>
                  </td>
                  <td>
                    <span className="mono text-xs font-semibold text-amber-800">{part.daysToday} days</span>
                  </td>
                  <td>
                    <span className="mono text-xs font-semibold text-emerald-700">{part.daysProposed} days</span>
                  </td>
                  <td>
                    <span className="mono text-xs">{part.qtyPerContainer} pcs</span>
                  </td>
                  <td>
                    <span className="mono text-xs muted">{part.givenLocations}</span>
                  </td>
                  <td>
                    <span className="mono text-xs font-semibold text-bronze-800">{part.neededLocations}</span>
                  </td>
                  <td>
                    <span className="mono text-xs font-semibold text-emerald-700">+{part.spaceImprovementPct}%</span>
                  </td>
                  <td>
                    <span className={`stock-zone-chip ${part.stockZone.toLowerCase().replace(' ', '-')}`}>
                      {part.stockZone}
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
   02. LINE SIDE DESIGN & WORKCELL PRESENTATION
   ───────────────────────────────────────────────────────────────────────────── */
function LineSideDesignScreen() {
  const { stations } = useContext(SupermarketContext);

  return (
    <>
      <Panel
        title="Line-Side Presentation Stations"
        subtitle="Workcell infeed parameters: Delivery intervals, container standards, reach distances, and ergonomic rating"
      >
        <div className="table-wrap">
          <table className="products-table">
            <thead>
              <tr>
                <th style={{ width: '80px' }}>Station</th>
                <th>Description</th>
                <th style={{ width: '140px' }}>Workcell</th>
                <th style={{ width: '110px' }}>Interval</th>
                <th style={{ width: '180px' }}>Container Standard</th>
                <th>Presentation Equipment</th>
                <th style={{ width: '110px' }}>Reach (mm)</th>
                <th style={{ width: '140px' }}>Ergonomics</th>
              </tr>
            </thead>
            <tbody>
              {stations.map(st => (
                <tr key={st.id} className="lift">
                  <td>
                    <span className="mono font-semibold text-xs">{st.id}</span>
                  </td>
                  <td>
                    <strong className="text-sm">{st.name}</strong>
                  </td>
                  <td>
                    <span className="text-xs font-medium">{st.workcell}</span>
                  </td>
                  <td>
                    <span className="mono text-xs font-semibold">{st.deliveryIntervalMins} mins</span>
                  </td>
                  <td>
                    <span className="text-xs muted">{st.containerType}</span>
                  </td>
                  <td>
                    <span className="text-xs">{st.presentationRack}</span>
                  </td>
                  <td>
                    <span className="mono text-xs font-semibold">{st.operatorReachMm} mm</span>
                  </td>
                  <td>
                    <span className="text-xs text-emerald-700 font-semibold">{st.ergonomicScore}</span>
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
   03. CURRENT VS FUTURE REPORT & HANDOFF
   ───────────────────────────────────────────────────────────────────────────── */
function SupermarketReport() {
  const { parts } = useContext(SupermarketContext);
  const preview = usePreview();

  const totalGiven = parts.reduce((acc, p) => acc + p.givenLocations, 0);
  const totalNeeded = parts.reduce((acc, p) => acc + p.neededLocations, 0);

  return (
    <>
      <Panel className="report-cover-panel">
        <div className="between items-start">
          <div>
            <div className="supermarket-hero-badge">
              <span className="supermarket-hero-pill">STEP 10 · DELIVERABLE</span>
              <span className="supermarket-status-chip">EXECUTIVE SIGN-OFF READY</span>
            </div>
            <h1 className="report-main-title">Flow Supermarket & Line-Side Design Report</h1>
            <p className="report-main-sub">
              Floor Sizing Validation, Two-Bin Supermarkets & Operator Infeed Systems · Pune Complex Plant 02
            </p>
          </div>
          <PillButton
            variant="blue"
            icon="Download"
            onClick={() => preview('Export Supermarket Master Report', 'Generating complete PDF and Excel sizing model...')}
          >
            Export Sizing Report
          </PillButton>
        </div>

        <div className="report-summary-boxes mt-20">
          <div className="rep-box">
            <span className="mono muted text-xs">FLOOR SPACE FREED</span>
            <strong className="text-amber-900 text-lg">{totalGiven - totalNeeded} Locations Freed</strong>
            <span className="text-xs muted">{totalGiven} given down to {totalNeeded} needed</span>
          </div>
          <div className="rep-box">
            <span className="mono muted text-xs">WIP INVENTORY DROP</span>
            <strong className="text-emerald-800">82% Reduction</strong>
            <span className="text-xs muted">From 17.5 days to 3.1 days cover</span>
          </div>
          <div className="rep-box">
            <span className="mono muted text-xs">REPLENISHMENT LOOP</span>
            <strong className="text-bronze-800">VTFQ Two-Bin Pull</strong>
            <span className="text-xs muted">Standardized container quantities</span>
          </div>
          <div className="rep-box">
            <span className="mono muted text-xs">DOWNSTREAM LINK</span>
            <strong className="text-pink-800">Step 11 Material Handling</strong>
            <span className="text-xs muted">Tugger milk-run sizing ready</span>
          </div>
        </div>
      </Panel>
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN SUPERMARKET ROUTER
   ───────────────────────────────────────────────────────────────────────────── */
export default function SupermarketDesign() {
  const location = useLocation();
  const preview = usePreview();
  const desc = supermarketDescriptions[location.pathname] || supermarketDescriptions['/supermarket'];

  const getActiveTab = () => {
    if (location.pathname === '/supermarket/sizing') return 'sizing';
    if (location.pathname === '/supermarket/line-side') return 'line-side';
    if (location.pathname === '/supermarket/report') return 'report';
    return 'overview';
  };

  const activeTab = getActiveTab();

  return (
    <>
      <PageHeading
        title="Flow Supermarket & Line Design"
        description={desc}
        actions={
          <div className="flex gap-8">
            <PillButton
              icon="Download"
              onClick={() => preview('Export Sizing Model', 'Preparing XLSX spreadsheet of supermarket rack calculations...')}
            >
              Export Sizing
            </PillButton>
            <PillButton
              variant="blue"
              icon="Warehouse"
              onClick={() => preview('Supermarket Sizing Audit', 'Auditing buffer sizes against Step 03 daily takt demand...')}
            >
              Audit Buffers
            </PillButton>
          </div>
        }
      >
        <div className="supermarket-hero-mark">
          <span className="step-tag">STEP 10</span>
          <span className="hero-divider">/</span>
          <span className="hero-module-title">FLOW SUPERMARKET & LINE DESIGN</span>
        </div>
      </PageHeading>

      {/* Pill tabs strip */}
      <div className="vsi-step-strip">
        <Link
          to="/supermarket"
          className={`ppq-step-strip-item ${activeTab === 'overview' ? 'active' : ''}`}
        >
          <span className="step-num">00</span>
          <strong>Overview & Policies</strong>
          <span className="step-sub">Replenishment Architecture</span>
        </Link>
        <Link
          to="/supermarket/sizing"
          className={`ppq-step-strip-item ${activeTab === 'sizing' ? 'active' : ''}`}
        >
          <span className="step-num">01</span>
          <strong>Sizing & Stock Zones</strong>
          <span className="step-sub">Slide 62 Sizing Table</span>
        </Link>
        <Link
          to="/supermarket/line-side"
          className={`ppq-step-strip-item ${activeTab === 'line-side' ? 'active' : ''}`}
        >
          <span className="step-num">02</span>
          <strong>Line Side Design</strong>
          <span className="step-sub">Workstation Racks</span>
        </Link>
        <Link
          to="/supermarket/report"
          className={`ppq-step-strip-item ${activeTab === 'report' ? 'active' : ''}`}
        >
          <span className="step-num">03</span>
          <strong>Current vs Future</strong>
          <span className="step-sub">Space Freed & Charter</span>
        </Link>
      </div>

      {activeTab === 'overview' && <SupermarketOverview />}
      {activeTab === 'sizing' && <SupermarketSizing />}
      {activeTab === 'line-side' && <LineSideDesignScreen />}
      {activeTab === 'report' && <SupermarketReport />}
    </>
  );
}
