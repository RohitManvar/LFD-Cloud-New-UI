import { createContext, useContext, useState, type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  supplyNavigation, supplyDescriptions, supplyInventoryItems as initialItems,
  supplySuppliers as initialSuppliers, supplyKaizens as initialKaizens,
  type SupplyItem, type SupplyVendor, type SupplyKaizen,
} from '../data/mock';
import Icon from '../components/Icon';
import { PageHeading, Panel, PillButton, StatCard } from '../components/UI';
import { usePreview } from '../components/PreviewDialog';

interface SupplyContextType {
  items: SupplyItem[];
  suppliers: SupplyVendor[];
  kaizens: SupplyKaizen[];
}

const SupplyContext = createContext<SupplyContextType>({
  items: initialItems,
  suppliers: initialSuppliers,
  kaizens: initialKaizens,
});

export function SupplyProvider({ children }: { children: ReactNode }) {
  const [items] = useState<SupplyItem[]>(initialItems);
  const [suppliers] = useState<SupplyVendor[]>(initialSuppliers);
  const [kaizens] = useState<SupplyKaizen[]>(initialKaizens);

  return (
    <SupplyContext.Provider value={{ items, suppliers, kaizens }}>
      {children}
    </SupplyContext.Provider>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   00. OVERVIEW & NETWORK ARCHITECTURE
   ───────────────────────────────────────────────────────────────────────────── */
function SupplyOverview() {
  const { items, suppliers, kaizens } = useContext(SupplyContext);
  const preview = usePreview();

  const gradeACount = suppliers.filter(s => s.tierStatus.includes('Grade A')).length;

  return (
    <>
      <section className="stats-grid" aria-label="Supply chain summary metrics">
        <StatCard
          label="Catalogued SKUs"
          value="847"
          subline="100% PFEP categorized"
          icon="Boxes"
          to="/supply-chain/inventory"
        />
        <StatCard
          label="Supplier Quality"
          value="94.2%"
          subline={`${gradeACount} of ${suppliers.length} Grade A preferred`}
          icon="Network"
          dark
          to="/supply-chain/suppliers"
        />
        <StatCard
          label="Inventory Value"
          value="₹1.84 Cr"
          subline="18 days cover · Down from 35 days"
          icon="Warehouse"
          to="/supply-chain/inventory"
        />
        <StatCard
          label="Kaizen Run-Rate"
          value="₹39.3 L"
          subline="Annual recurring savings"
          icon="Sparkles"
          to="/supply-chain/kaizens"
        />
      </section>

      {/* Hero: 5-Stage Supply Chain Network */}
      <Panel className="supply-hero-panel">
        <div className="between items-start">
          <div>
            <div className="supply-hero-badge">
              <span className="supply-hero-pill">STEP 09 · END-TO-END NETWORK DESIGN</span>
              <span className="supply-status-chip">SIOP SYNCHRONIZED</span>
            </div>
            <h2 className="supply-plan-title">Plant 02 Supply Chain & Supplier Rating Architecture</h2>
            <p className="supply-plan-sub">
              Structuring the upstream supply base to support JIT pull flow and zero assembly line starvation
            </p>
          </div>
          <div className="flex gap-8">
            <PillButton
              icon="Download"
              onClick={() => preview('Export Supply Chain Deck', 'Preparing Step 09 supply chain study & supplier scorecards...')}
            >
              Export Deck
            </PillButton>
            <PillButton
              variant="blue"
              icon="Boxes"
              onClick={() => preview('PFEP Replenishment Simulator', 'Recalculating safety buffers based on 3-month demand variance...')}
            >
              PFEP Simulator
            </PillButton>
          </div>
        </div>

        {/* 5-Stage Network Flow Diagram */}
        <div className="supply-flow-strip mt-18">
          <div className="flow-stage-card active">
            <div className="flow-stage-header">
              <span className="stage-num">01</span>
              <strong>Tier 1 Suppliers</strong>
            </div>
            <p className="text-xs muted">Sourcing, vendor quality ratings & milk-run logistics</p>
            <span className="flow-stage-tag covered">Covered Here</span>
          </div>

          <div className="flow-arrow">→</div>

          <div className="flow-stage-card">
            <div className="flow-stage-header">
              <span className="stage-num">02</span>
              <strong>Receiving & Stores</strong>
            </div>
            <p className="text-xs muted">Dock bypass, FIFO bins & raw material safety stock</p>
            <span className="flow-stage-tag covered">PFEP Model</span>
          </div>

          <div className="flow-arrow">→</div>

          <div className="flow-stage-card">
            <div className="flow-stage-header">
              <span className="stage-num">03</span>
              <strong>Factory Infeed</strong>
            </div>
            <p className="text-xs muted">2-bin pull kanban feeding Steps 04–08 machine cells</p>
            <span className="flow-stage-tag steps">Steps 05–08</span>
          </div>

          <div className="flow-arrow">→</div>

          <div className="flow-stage-card">
            <div className="flow-stage-header">
              <span className="stage-num">04</span>
              <strong>Supermarket</strong>
            </div>
            <p className="text-xs muted">Intermediate buffer sizing & gravity rack storage</p>
            <span className="flow-stage-tag steps">Step 10 Link</span>
          </div>

          <div className="flow-arrow">→</div>

          <div className="flow-stage-card">
            <div className="flow-stage-header">
              <span className="stage-num">05</span>
              <strong>Customer Dispatch</strong>
            </div>
            <p className="text-xs muted">On-time in-full delivery & demand reliability</p>
            <span className="flow-stage-tag kpi">KPI Tracking</span>
          </div>
        </div>
      </Panel>

      {/* 2-Column: Key Purchasing Tactics & SIOP Core Concepts */}
      <div className="supply-two-col mt-18">
        <Panel
          title="Strategic Purchasing & Supply Tactics"
          subtitle="How the supply base is structured to protect production lines"
        >
          <div className="tactics-list">
            <div className="tactic-item">
              <strong className="text-sm">Strategic Sourcing Partnerships</strong>
              <p className="text-xs muted">Moving beyond single-order price hunting to long-term partner agreements with volume tiering and vendor-managed buffers.</p>
            </div>
            <div className="tactic-item">
              <strong className="text-sm">Total Cost of Ownership (TCO)</strong>
              <p className="text-xs muted">Factoring freight tariffs, handling touches, holding cost, and rework scrap rather than base purchase price alone.</p>
            </div>
            <div className="tactic-item">
              <strong className="text-sm">Supplier Diversification & Nearshoring</strong>
              <p className="text-xs muted">Dual-source tooling and 48-hour local supplier rings for critical high-volume bar stock and billets.</p>
            </div>
          </div>
        </Panel>

        <Panel
          title="Plan for Every Part (PFEP) Framework"
          subtitle="Inventory classification criteria"
        >
          <div className="pfep-pills-grid">
            <div className="pfep-pill-box runner">
              <span className="pfep-badge runner">RUNNERS</span>
              <strong>High Volume / Steady Demand</strong>
              <p className="text-xs muted">Fast replenishment, frequent milk-runs, minimal safety stock (3 days).</p>
            </div>
            <div className="pfep-pill-box repeater">
              <span className="pfep-badge repeater">REPEATERS</span>
              <strong>Moderate Predictability</strong>
              <p className="text-xs muted">Fixed reorder point (ROP) with 7-day safety buffer.</p>
            </div>
            <div className="pfep-pill-box stranger">
              <span className="pfep-badge stranger">STRANGERS</span>
              <strong>Infrequent / Erratic Call-off</strong>
              <p className="text-xs muted">Order-on-demand with supplier SLA to avoid trapped capital.</p>
            </div>
            <div className="pfep-pill-box non-moving">
              <span className="pfep-badge non-moving">NON-MOVING</span>
              <strong>Obsolete / Dormant Stock</strong>
              <p className="text-xs muted">Scrap, return to vendor, or re-allocate to clear floor square footage.</p>
            </div>
          </div>
        </Panel>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   01. INVENTORY ANALYSIS & PFEP REGISTER
   ───────────────────────────────────────────────────────────────────────────── */
function SupplyInventoryScreen() {
  const { items } = useContext(SupplyContext);
  const [filterClass, setFilterClass] = useState<'all' | 'Runner' | 'Repeater' | 'Stranger' | 'Non-Moving'>('all');

  const filtered = items.filter(i => filterClass === 'all' || i.classification === filterClass);

  return (
    <>
      <div className="between vsi-filter-bar">
        <div className="pill-tabs" role="tablist">
          <button
            className={filterClass === 'all' ? 'active' : ''}
            onClick={() => setFilterClass('all')}
          >
            All Items ({items.length})
          </button>
          <button
            className={filterClass === 'Runner' ? 'active' : ''}
            onClick={() => setFilterClass('Runner')}
          >
            Runners ({items.filter(i => i.classification === 'Runner').length})
          </button>
          <button
            className={filterClass === 'Repeater' ? 'active' : ''}
            onClick={() => setFilterClass('Repeater')}
          >
            Repeaters ({items.filter(i => i.classification === 'Repeater').length})
          </button>
          <button
            className={filterClass === 'Stranger' ? 'active' : ''}
            onClick={() => setFilterClass('Stranger')}
          >
            Strangers ({items.filter(i => i.classification === 'Stranger').length})
          </button>
          <button
            className={filterClass === 'Non-Moving' ? 'active' : ''}
            onClick={() => setFilterClass('Non-Moving')}
          >
            Non-Moving ({items.filter(i => i.classification === 'Non-Moving').length})
          </button>
        </div>

        <div className="flex gap-8 items-center text-xs">
          <span className="health-dot healthy" /> Healthy
          <span className="health-dot buffer-low ml-8" /> Low Buffer
          <span className="health-dot overstocked ml-8" /> Overstocked
        </div>
      </div>

      <Panel
        title="Plan for Every Part (PFEP) Inventory Register"
        subtitle="Replenishment parameters: Consumption, lead times, MOQ, reorder levels, and Kanban card allocations"
      >
        <div className="table-wrap">
          <table className="products-table">
            <thead>
              <tr>
                <th style={{ width: '100px' }}>Part Code</th>
                <th>Description</th>
                <th style={{ width: '150px' }}>Supplier</th>
                <th style={{ width: '90px' }}>Class</th>
                <th style={{ width: '80px' }}>Monthly</th>
                <th style={{ width: '80px' }}>Stock</th>
                <th style={{ width: '80px' }}>Lead Time</th>
                <th style={{ width: '80px' }}>Reorder</th>
                <th style={{ width: '80px' }}>Kanban</th>
                <th style={{ width: '110px' }}>Health</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(item => (
                <tr key={item.id} className="lift">
                  <td>
                    <span className="mono font-semibold text-xs">{item.code}</span>
                  </td>
                  <td>
                    <div className="visual-item-title-cell">
                      <strong>{item.name}</strong>
                      <span className="text-xs muted">₹{item.unitCost.toLocaleString()} / unit · MOQ {item.moq}</span>
                    </div>
                  </td>
                  <td>
                    <span className="text-xs">{item.supplier}</span>
                  </td>
                  <td>
                    <span className={`pfep-class-badge ${item.classification.toLowerCase().replace(' ', '-')}`}>
                      {item.classification}
                    </span>
                  </td>
                  <td>
                    <span className="mono text-xs">{item.monthlyUsage}</span>
                  </td>
                  <td>
                    <span className="mono text-xs font-semibold">{item.currentStock}</span>
                  </td>
                  <td>
                    <span className="mono text-xs">{item.leadTimeDays}d</span>
                  </td>
                  <td>
                    <span className="mono text-xs font-semibold">{item.reorderLevel}</span>
                  </td>
                  <td>
                    <span className="mono text-xs">{item.kanbanBins} bins</span>
                  </td>
                  <td>
                    <span className={`health-pill ${item.health.toLowerCase().replace(' ', '-')}`}>
                      {item.health}
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
   02. SUPPLIER QUALITY & DELIVERY RATINGS (SQR)
   ───────────────────────────────────────────────────────────────────────────── */
function SupplySuppliersScreen() {
  const { suppliers } = useContext(SupplyContext);
  const preview = usePreview();

  return (
    <>
      <Panel
        title="Supplier Quality Rating (SQR) Matrix"
        subtitle="Incoming quality ppm, on-time delivery (OTIF), and active corrective action requests (CAR)"
      >
        <div className="table-wrap">
          <table className="products-table">
            <thead>
              <tr>
                <th style={{ width: '80px' }}>ID</th>
                <th style={{ width: '180px' }}>Supplier Name</th>
                <th>Category / Commodity</th>
                <th style={{ width: '110px' }}>Annual Spend</th>
                <th style={{ width: '100px' }}>Quality %</th>
                <th style={{ width: '100px' }}>OTIF %</th>
                <th style={{ width: '90px' }}>PPM</th>
                <th style={{ width: '100px' }}>Composite</th>
                <th style={{ width: '150px' }}>Tier Status</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.map(sup => (
                <tr
                  key={sup.id}
                  className="lift cursor-pointer"
                  onClick={() => preview(`Supplier Audit: ${sup.name}`, `Category: ${sup.category}\nAnnual Spend: ${sup.annualSpend}\nQuality Score: ${sup.qualityScore}%\nOTIF Delivery: ${sup.otifPct}%\nRejection PPM: ${sup.rejectionPpm}\nActive CARs: ${sup.carActionCount}`)}
                >
                  <td>
                    <span className="mono font-semibold text-xs">{sup.id}</span>
                  </td>
                  <td>
                    <span className="font-semibold text-sm">{sup.name}</span>
                  </td>
                  <td>
                    <span className="text-xs muted">{sup.category}</span>
                  </td>
                  <td>
                    <span className="mono text-xs font-medium">{sup.annualSpend}</span>
                  </td>
                  <td>
                    <span className="mono text-xs font-semibold text-emerald-700">{sup.qualityScore}%</span>
                  </td>
                  <td>
                    <span className="mono text-xs font-semibold text-sky-800">{sup.otifPct}%</span>
                  </td>
                  <td>
                    <span className={`mono text-xs font-semibold ${sup.rejectionPpm > 1000 ? 'text-amber-800' : 'text-slate-600'}`}>
                      {sup.rejectionPpm}
                    </span>
                  </td>
                  <td>
                    <span className="mono font-semibold text-xs">{sup.compositeRating} / 100</span>
                  </td>
                  <td>
                    <span className={`tier-badge ${sup.tierStatus.includes('Grade A') ? 'grade-a' : sup.tierStatus.includes('Grade B') ? 'grade-b' : 'grade-c'}`}>
                      {sup.tierStatus}
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
   03. SUPPLY CHAIN KAIZEN SHEETS
   ───────────────────────────────────────────────────────────────────────────── */
function SupplyKaizensScreen() {
  const { kaizens } = useContext(SupplyContext);
  const preview = usePreview();

  return (
    <>
      <div className="section-heading mb-14">
        <div>
          <h2>Supply Chain Kaizen Sheets</h2>
          <p className="muted">Standard LFD Slide 57–58 format: Before vs. After condition, Muda eliminated & savings</p>
        </div>
        <PillButton
          variant="blue"
          icon="Plus"
          onClick={() => preview('New Supply Kaizen', 'Opening standard Kaizen Sheet editor for Step 09...')}
        >
          New Kaizen Sheet
        </PillButton>
      </div>

      <div className="kaizens-cards-grid">
        {kaizens.map(kzn => (
          <div key={kzn.id} className="kaizen-sheet-card">
            <div className="between">
              <span className="mono font-semibold text-xs text-sky-800">{kzn.id}</span>
              <span className={`kaizen-status-badge ${kzn.status.toLowerCase().replace(' ', '-')}`}>
                {kzn.status}
              </span>
            </div>
            <h3 className="kaizen-title">{kzn.title}</h3>
            <span className="text-xs font-medium text-slate-500">Area: {kzn.targetArea} · Waste: {kzn.wasteEliminated}</span>

            {/* Before vs After comparison */}
            <div className="before-after-grid mt-10">
              <div className="cond-box before">
                <span className="cond-tag before">BEFORE CONDITION</span>
                <p className="text-xs muted leading-relaxed">{kzn.beforeCondition}</p>
              </div>
              <div className="cond-box after">
                <span className="cond-tag after">AFTER IMPROVEMENT</span>
                <p className="text-xs leading-relaxed text-sky-900">{kzn.afterCondition}</p>
              </div>
            </div>

            <div className="kaizen-savings-strip mt-10">
              <div>
                <span className="mono muted text-xs">ANNUAL SAVINGS</span>
                <strong className="text-emerald-700 font-semibold">{kzn.annualSavings}</strong>
              </div>
              <div>
                <span className="mono muted text-xs">LEAD TIME DROP</span>
                <strong className="text-sky-800 font-semibold">{kzn.leadTimeReduction}</strong>
              </div>
              <div className="ml-auto text-right">
                <span className="mono muted text-xs">CHAMPION</span>
                <span className="text-xs font-medium block">{kzn.champion}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   04. EXECUTIVE REPORT & HANDOFF
   ───────────────────────────────────────────────────────────────────────────── */
function SupplyReportScreen() {
  const { items, suppliers, kaizens } = useContext(SupplyContext);
  const preview = usePreview();

  return (
    <>
      <Panel className="report-cover-panel">
        <div className="between items-start">
          <div>
            <div className="supply-hero-badge">
              <span className="supply-hero-pill">STEP 09 · EXECUTIVE CHARTER</span>
              <span className="supply-status-chip">RECOMMENDATION READY</span>
            </div>
            <h1 className="report-main-title">Supply Chain Design & Replenishment Charter</h1>
            <p className="report-main-sub">
              Master Sourcing, PFEP Inventory Models & Supplier Performance · Pune Plant 02
            </p>
          </div>
          <PillButton
            variant="blue"
            icon="Download"
            onClick={() => preview('Export Supply Chain Master Plan', 'Generating comprehensive PDF and Excel PFEP model...')}
          >
            Export Master Plan
          </PillButton>
        </div>

        <div className="report-summary-boxes mt-20">
          <div className="rep-box">
            <span className="mono muted text-xs">PFEP COVERAGE</span>
            <strong className="text-sky-800 text-lg">847 SKUs Mapped</strong>
            <span className="text-xs muted">100% Kanban parameters set</span>
          </div>
          <div className="rep-box">
            <span className="mono muted text-xs">SUPPLIER QUALITY</span>
            <strong className="text-emerald-800">94.2% Composite</strong>
            <span className="text-xs muted">Average PPM: 420 across base</span>
          </div>
          <div className="rep-box">
            <span className="mono muted text-xs">INVENTORY TRIMMING</span>
            <strong className="text-sky-800">₹39.3 L / yr Saved</strong>
            <span className="text-xs muted">Lead time cut from 35d to 18d</span>
          </div>
          <div className="rep-box">
            <span className="mono muted text-xs">NEXT STEP LINK</span>
            <strong className="text-purple-800">Step 10 Supermarket</strong>
            <span className="text-xs muted">Sizing ready for warehouse layout</span>
          </div>
        </div>
      </Panel>

      {/* Downstream Integrations */}
      <Panel
        title="Downstream LFD Methodology Handoffs"
        subtitle="How Step 09 Supply Chain feeds the remaining methodology steps"
      >
        <div className="supply-handoff-grid">
          <div className="handoff-card">
            <div className="icon-badge sky">
              <Icon name="Warehouse" size={18} />
            </div>
            <div>
              <strong className="text-sm">Step 10: Flow Supermarket & Line Design</strong>
              <p className="text-xs muted">Replenishment batch sizes, Kanban bin counts, and MOQ data directly size the raw material supermarket and infeed racks.</p>
            </div>
          </div>

          <div className="handoff-card">
            <div className="icon-badge sky">
              <Icon name="Truck" size={18} />
            </div>
            <div>
              <strong className="text-sm">Step 11: Material Handling Equipment</strong>
              <p className="text-xs muted">Milk-run delivery frequencies and returnable carton specs set the required tugger train routes and pallet jack fleet sizing.</p>
            </div>
          </div>

          <div className="handoff-card">
            <div className="icon-badge purple">
              <Icon name="CalendarRange" size={18} />
            </div>
            <div>
              <strong className="text-sm">Step 15: Project Plan & Rollout</strong>
              <p className="text-xs muted">Strategic 3-day raw material safety buffers insulate Phase 2 stores shifting to prevent zero downtime during facility relocation.</p>
            </div>
          </div>
        </div>
      </Panel>
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN SUPPLY CHAIN ROUTER
   ───────────────────────────────────────────────────────────────────────────── */
export default function SupplyChainDesign() {
  const location = useLocation();
  const preview = usePreview();
  const desc = supplyDescriptions[location.pathname] || supplyDescriptions['/supply-chain'];

  const getActiveTab = () => {
    if (location.pathname === '/supply-chain/inventory') return 'inventory';
    if (location.pathname === '/supply-chain/suppliers') return 'suppliers';
    if (location.pathname === '/supply-chain/kaizens') return 'kaizens';
    if (location.pathname === '/supply-chain/report') return 'report';
    return 'overview';
  };

  const activeTab = getActiveTab();

  return (
    <>
      <PageHeading
        title="Supply Chain Design"
        description={desc}
        actions={
          <div className="flex gap-8">
            <PillButton
              icon="Download"
              onClick={() => preview('Export Supply Chain Model', 'Preparing PFEP spreadsheet and supplier ratings report...')}
            >
              Export PFEP
            </PillButton>
            <PillButton
              variant="blue"
              icon="Network"
              onClick={() => preview('Supplier Quality Review', 'Running automated PPM and delivery compliance scorecard...')}
            >
              Supplier Audit
            </PillButton>
          </div>
        }
      >
        <div className="supply-hero-mark">
          <span className="step-tag">STEP 09</span>
          <span className="hero-divider">/</span>
          <span className="hero-module-title">SUPPLY CHAIN DESIGN</span>
        </div>
      </PageHeading>

      {/* Pill tabs strip */}
      <div className="vsi-step-strip">
        <Link
          to="/supply-chain"
          className={`ppq-step-strip-item ${activeTab === 'overview' ? 'active' : ''}`}
        >
          <span className="step-num">00</span>
          <strong>Overview & Network</strong>
          <span className="step-sub">5-Stage Flow & SIOP</span>
        </Link>
        <Link
          to="/supply-chain/inventory"
          className={`ppq-step-strip-item ${activeTab === 'inventory' ? 'active' : ''}`}
        >
          <span className="step-num">01</span>
          <strong>Inventory & PFEP</strong>
          <span className="step-sub">847 SKUs · Kanban Bins</span>
        </Link>
        <Link
          to="/supply-chain/suppliers"
          className={`ppq-step-strip-item ${activeTab === 'suppliers' ? 'active' : ''}`}
        >
          <span className="step-num">02</span>
          <strong>Supplier Ratings</strong>
          <span className="step-sub">SQR Scorecards & PPM</span>
        </Link>
        <Link
          to="/supply-chain/kaizens"
          className={`ppq-step-strip-item ${activeTab === 'kaizens' ? 'active' : ''}`}
        >
          <span className="step-num">03</span>
          <strong>Kaizen Sheets</strong>
          <span className="step-sub">Muda Elimination</span>
        </Link>
        <Link
          to="/supply-chain/report"
          className={`ppq-step-strip-item ${activeTab === 'report' ? 'active' : ''}`}
        >
          <span className="step-num">04</span>
          <strong>Executive Report</strong>
          <span className="step-sub">Purchasing Charter</span>
        </Link>
      </div>

      {activeTab === 'overview' && <SupplyOverview />}
      {activeTab === 'inventory' && <SupplyInventoryScreen />}
      {activeTab === 'suppliers' && <SupplySuppliersScreen />}
      {activeTab === 'kaizens' && <SupplyKaizensScreen />}
      {activeTab === 'report' && <SupplyReportScreen />}
    </>
  );
}
