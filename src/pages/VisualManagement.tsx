import { createContext, useContext, useState, type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  visualNavigation, visualDescriptions, visualCategories as initialCats,
  visualCheckItems as initialItems, visualPlacements as initialPlacements,
  type VisualCategoryScore, type VisualCheckItem, type VisualPlacement,
} from '../data/mock';
import Icon from '../components/Icon';
import { EmptyState, PageHeading, Panel, PillButton, StatCard } from '../components/UI';
import { usePreview } from '../components/PreviewDialog';

interface VisualContextType {
  categories: VisualCategoryScore[];
  items: VisualCheckItem[];
  placements: VisualPlacement[];
  toggleItemStatus: (id: string) => void;
}

const VisualContext = createContext<VisualContextType>({
  categories: initialCats,
  items: initialItems,
  placements: initialPlacements,
  toggleItemStatus: () => {},
});

export function VisualProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<VisualCategoryScore[]>(initialCats);
  const [items, setItems] = useState<VisualCheckItem[]>(initialItems);
  const [placements] = useState<VisualPlacement[]>(initialPlacements);

  const toggleItemStatus = (id: string) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        const nextStatus = item.status === 'Present' ? 'Missing' : item.status === 'Missing' ? 'Not Applicable' : 'Present';
        return { ...item, status: nextStatus };
      }
      return item;
    }));
  };

  return (
    <VisualContext.Provider value={{ categories, items, placements, toggleItemStatus }}>
      {children}
    </VisualContext.Provider>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   00. OVERVIEW & CHECKSHEET ASSESSMENT
   ───────────────────────────────────────────────────────────────────────────── */
function VisualOverview() {
  const { categories, items, toggleItemStatus } = useContext(VisualContext);
  const [selectedCat, setSelectedCat] = useState<number | 'all'>('all');
  const preview = usePreview();

  const presentCount = items.filter(i => i.status === 'Present').length;
  const missingCount = items.filter(i => i.status === 'Missing').length;
  const naCount = items.filter(i => i.status === 'Not Applicable').length;
  const compliancePct = Math.round((presentCount / (items.length - naCount)) * 100);

  const filteredItems = items.filter(i => selectedCat === 'all' || i.categoryNum === selectedCat);

  return (
    <>
      <section className="stats-grid" aria-label="Visual management summary metrics">
        <StatCard
          label="Checksheet Assessed"
          value="55/55"
          subline="100% of standard evaluated"
          icon="ClipboardList"
          to="/visual"
        />
        <StatCard
          label="Visual Compliance"
          value={`${compliancePct}%`}
          subline={`${presentCount} present · ${missingCount} missing`}
          icon="Eye"
          dark
          to="/visual/report"
        />
        <StatCard
          label="Visual Gaps to Close"
          value={missingCount}
          subline="Moved to Installation Plan"
          icon="ShieldAlert"
          to="/visual/deployment"
        />
        <StatCard
          label="Signage Estimation"
          value="₹1.76 L"
          subline="7 V-Code specs quotable"
          icon="Boxes"
          to="/visual/deployment"
        />
      </section>

      {/* Active Assessment Hero Banner */}
      <Panel className="visual-hero-panel">
        <div className="between items-start">
          <div>
            <div className="visual-hero-badge">
              <span className="visual-hero-pill">STEP 13 · VISUAL FACTORY GUIDELINES</span>
              <span className="visual-status-chip">LEVEL 3 TARGET: VISUAL CONTROL</span>
            </div>
            <h2 className="visual-plan-title">Plant 02 Visual Standards & 5S Checksheet</h2>
            <p className="visual-plan-sub">
              55-item implementation standard across 8 operational categories · Slide 87 Standard
            </p>
          </div>
          <div className="flex gap-8">
            <PillButton
              icon="Download"
              onClick={() => preview('Export Checksheet', 'Exporting 55-item visual checksheet to Excel and PDF...')}
            >
              Export Checksheet
            </PillButton>
            <PillButton
              variant="blue"
              icon="Eye"
              onClick={() => preview('Launch Visual AI Placement', 'Analyzing Step 12 Plant Layout for V1–V10 visual control coordinates...')}
            >
              AI Placement Scan
            </PillButton>
          </div>
        </div>

        {/* 8 Categories Progress Grid */}
        <div className="visual-cats-summary-grid mt-18">
          {categories.map(cat => (
            <button
              key={cat.id}
              className={`visual-cat-box ${selectedCat === cat.num ? 'selected' : ''}`}
              onClick={() => setSelectedCat(selectedCat === cat.num ? 'all' : cat.num)}
            >
              <div className="between text-xs mb-4">
                <span className="mono muted font-semibold">CAT {cat.num}</span>
                <span className="font-semibold text-cyan-700">{cat.compliancePct}%</span>
              </div>
              <strong className="cat-title">{cat.title}</strong>
              <div className="cat-progress-track">
                <div className="cat-progress-bar" style={{ width: `${cat.compliancePct}%` }} />
              </div>
              <div className="cat-codes-row">
                {cat.vCodes.map(code => (
                  <span key={code} className="vcode-tag">{code}</span>
                ))}
                <span className="text-xs muted ml-auto">{cat.present}/{cat.total} in place</span>
              </div>
            </button>
          ))}
        </div>
      </Panel>

      {/* Checksheet Items Register */}
      <Panel
        title="Visual Implementation Checksheet"
        subtitle="Click any status badge to cycle between Present, Missing, or Not Applicable"
        action={
          <div className="flex gap-8 items-center">
            <span className="text-xs muted">Showing {filteredItems.length} items</span>
            {selectedCat !== 'all' && (
              <button className="pill-button text-xs" onClick={() => setSelectedCat('all')}>
                Show All 8 Categories
              </button>
            )}
          </div>
        }
      >
        <div className="table-wrap">
          <table className="products-table">
            <thead>
              <tr>
                <th style={{ width: '80px' }}>ID</th>
                <th style={{ width: '150px' }}>Category</th>
                <th style={{ width: '90px' }}>V-Code</th>
                <th>Standard Control & Description</th>
                <th style={{ width: '160px' }}>Target Location</th>
                <th style={{ width: '150px' }}>Signage Spec</th>
                <th style={{ width: '120px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map(item => (
                <tr key={item.id} className="lift">
                  <td>
                    <span className="mono font-semibold text-xs">{item.id}</span>
                  </td>
                  <td>
                    <span className="text-xs font-medium">{item.categoryName}</span>
                  </td>
                  <td>
                    <span className="vcode-pill" title={item.vCodeTitle}>{item.vCode}</span>
                  </td>
                  <td>
                    <div className="visual-item-title-cell">
                      <strong>{item.title}</strong>
                      <span className="text-xs muted">{item.notes}</span>
                    </div>
                  </td>
                  <td>
                    <span className="text-xs">{item.targetLocation}</span>
                  </td>
                  <td>
                    <span className="mono text-xs muted">{item.specLabel}</span>
                  </td>
                  <td>
                    <button
                      className={`visual-status-toggle ${item.status.toLowerCase().replace(' ', '-')}`}
                      onClick={() => toggleItemStatus(item.id)}
                      title="Click to toggle status"
                    >
                      {item.status === 'Present' && '✓ Present'}
                      {item.status === 'Missing' && '⚠ Missing'}
                      {item.status === 'Not Applicable' && '— N/A'}
                    </button>
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
   01. VISUAL PLACEMENT ON PLANT LAYOUT
   ───────────────────────────────────────────────────────────────────────────── */
function VisualPlacementScreen() {
  const { placements } = useContext(VisualContext);
  const preview = usePreview();

  const vCodesLegend = [
    { code: 'V1', label: 'Corporate Title Boards', desc: 'Main gate & corporate entrance' },
    { code: 'V2', label: 'Policies & Instructions', desc: 'Quality, safety & ISO policies' },
    { code: 'V3', label: 'Safety Compliance Standards', desc: 'Fire, PPE, arc flash zones' },
    { code: 'V4', label: 'Signs & Directions', desc: 'Pedestrian routes & forklift traffic' },
    { code: 'V5', label: 'Area Identification Boards', desc: 'Ceiling suspended bay markers' },
    { code: 'V6', label: 'Daily Monitoring Boards', desc: 'Tier 1 SQDCM daily standup' },
    { code: 'V7', label: 'Tags & Labels', desc: 'Kanban cards, bin limits & floor lines' },
    { code: 'V8', label: 'GMP & 5S Shadow Boards', desc: 'Tool silhouettes & machine hygiene' },
    { code: 'V9', label: 'Display Posters', desc: 'Kaizen recognition & visitor maps' },
    { code: 'V10', label: 'Obeya Room / Gallery', desc: 'War room project management wall' },
  ];

  return (
    <>
      <Panel
        title="V1–V10 Visual Control Layout Placement"
        subtitle="Visual controls mapped to Step 12 Plant Layout drawing coordinates with standard mounting heights"
      >
        {/* Layout Floor Map Preview Card */}
        <div className="visual-layout-canvas">
          <div className="layout-canvas-header">
            <span className="mono font-semibold text-xs">PUNE COMPLEX · UNIT 2 SHOP FLOOR PLAN</span>
            <span className="text-xs muted">Scale: 1:200 · 7 Control Zones Active</span>
          </div>
          <div className="layout-grid-zones">
            <div className="layout-zone gate">
              <span className="zone-tag">ZONE A: MAIN GATE</span>
              <span className="zone-marker v1">V1 Title Board</span>
              <span className="zone-marker v4">V4 Visitor Path</span>
            </div>
            <div className="layout-zone machining">
              <span className="zone-tag">ZONE B: CNC TURNING & HOBBING</span>
              <span className="zone-marker v5">V5 Area ID (5m)</span>
              <span className="zone-marker v6">V6 SQDCM Standup</span>
              <span className="zone-marker v8">V8 Tool Shadow Board</span>
            </div>
            <div className="layout-zone supermarket">
              <span className="zone-tag">ZONE C: INTERMEDIATE SUPERMARKET</span>
              <span className="zone-marker v7">V7 Min/Max Tape</span>
              <span className="zone-marker v7">V7 FIFO Lanes</span>
            </div>
            <div className="layout-zone obeya">
              <span className="zone-tag">ZONE D: OBEYA WAR ROOM</span>
              <span className="zone-marker v10">V10 4-Wall Gallery</span>
              <span className="zone-marker v9">V9 Kaizen Tree</span>
            </div>
          </div>
        </div>

        {/* V-Code Taxonomy Strip */}
        <div className="mt-18">
          <h3 className="text-sm font-semibold mb-8">V-Code Control Taxonomy (V1 to V10)</h3>
          <div className="vcode-legend-grid">
            {vCodesLegend.map(v => (
              <div key={v.code} className="vcode-legend-card">
                <span className="vcode-pill">{v.code}</span>
                <div>
                  <strong className="text-xs block">{v.label}</strong>
                  <span className="text-xs muted">{v.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Panel>

      {/* Placed Controls Register Table */}
      <Panel
        title="Plant Control Placement Register"
        subtitle="Physical coordinates, mounting elevation, and procurement line items"
      >
        <div className="table-wrap">
          <table className="products-table">
            <thead>
              <tr>
                <th style={{ width: '80px' }}>ID</th>
                <th style={{ width: '90px' }}>Code</th>
                <th style={{ width: '160px' }}>Zone</th>
                <th>Signage Specification</th>
                <th style={{ width: '140px' }}>Mounting Height</th>
                <th style={{ width: '80px' }}>Qty</th>
                <th style={{ width: '100px' }}>Est. Cost</th>
                <th style={{ width: '130px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {placements.map(pl => (
                <tr key={pl.id} className="lift">
                  <td>
                    <span className="mono font-semibold text-xs">{pl.id}</span>
                  </td>
                  <td>
                    <span className="vcode-pill">{pl.vCode}</span>
                  </td>
                  <td>
                    <span className="text-xs font-semibold">{pl.zone}</span>
                  </td>
                  <td>
                    <div className="visual-item-title-cell">
                      <strong>{pl.itemTitle}</strong>
                      <span className="mono text-xs muted">{pl.spec}</span>
                    </div>
                  </td>
                  <td>
                    <span className="mono text-xs">{pl.mountingHeight}</span>
                  </td>
                  <td>
                    <span className="mono text-xs font-semibold">{pl.quantity}</span>
                  </td>
                  <td>
                    <span className="mono text-xs font-semibold text-cyan-800">{pl.estimatedCost}</span>
                  </td>
                  <td>
                    <span className={`placement-status-chip ${pl.status.toLowerCase().replace(' ', '-')}`}>
                      {pl.status}
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
   02. INSTALLATION & DEPLOYMENT PLAN
   ───────────────────────────────────────────────────────────────────────────── */
function VisualDeploymentPlan() {
  const { items } = useContext(VisualContext);
  const preview = usePreview();

  const missingGaps = items.filter(i => i.status === 'Missing');

  return (
    <>
      <Panel className="visual-hero-panel">
        <div className="between items-start">
          <div>
            <div className="visual-hero-badge">
              <span className="visual-hero-pill">GAP CLOSURE SCHEDULE</span>
              <span className="visual-status-chip">{missingGaps.length} CONTROLS TO INSTALL</span>
            </div>
            <h2 className="visual-plan-title">Visual Management Installation Plan</h2>
            <p className="visual-plan-sub">
              Every missing control is paired with quotable vendor specifications and scheduled for Step 15 rollout.
            </p>
          </div>
          <PillButton
            variant="blue"
            icon="ClipboardList"
            onClick={() => preview('Push to Step 15', 'Pushed 16 visual installation deliverables into Step 15 Project Plan Phase 4!')}
          >
            Handoff to Step 15 Plan
          </PillButton>
        </div>
      </Panel>

      <Panel
        title="Quotable Board Specifications for Signage Vendors"
        subtitle="Standard ACP substrates, mounting brackets, and typography heights"
      >
        <div className="specs-cards-grid">
          <div className="spec-card">
            <span className="spec-badge">AREA-ID SPEC</span>
            <strong>Area Identification Board</strong>
            <p className="text-xs muted">Dimension: 36" × 24" · Letters: 3" high · 5m truss mounting</p>
            <span className="mono text-xs font-semibold text-cyan-800 mt-4 block">Vinyl print on 4mm ACP</span>
          </div>

          <div className="spec-card">
            <span className="spec-badge">MACHINE-ID SPEC</span>
            <strong>Machine & Workstation ID</strong>
            <p className="text-xs muted">Dimension: 24" × 18" · Letters: 2" high · 2m eye level</p>
            <span className="mono text-xs font-semibold text-cyan-800 mt-4 block">Vinyl print on 4mm ACP with L-bracket</span>
          </div>

          <div className="spec-card">
            <span className="spec-badge">STANDUP SPEC</span>
            <strong>Tier 1 Daily SQDCM Board</strong>
            <p className="text-xs muted">Dimension: 48" × 36" · Magnetic dry-erase · 1.4m center</p>
            <span className="mono text-xs font-semibold text-cyan-800 mt-4 block">Custom printed porcelain steel whiteboard</span>
          </div>
        </div>
      </Panel>

      <Panel
        title="Installation Action Matrix (16 Visual Gaps)"
        subtitle="Assigned contractors, target implementation weeks, and validation checkpoints"
      >
        <div className="table-wrap">
          <table className="products-table">
            <thead>
              <tr>
                <th style={{ width: '80px' }}>Item</th>
                <th style={{ width: '160px' }}>Category</th>
                <th>Deliverable & Scope</th>
                <th style={{ width: '150px' }}>Signage Spec</th>
                <th style={{ width: '140px' }}>Location</th>
                <th style={{ width: '110px' }}>Target Week</th>
                <th style={{ width: '100px' }}>Step 15 Link</th>
              </tr>
            </thead>
            <tbody>
              {missingGaps.map((gap, idx) => (
                <tr key={gap.id}>
                  <td>
                    <span className="mono font-semibold text-xs">{gap.id}</span>
                  </td>
                  <td>
                    <span className="text-xs font-medium">{gap.categoryName}</span>
                  </td>
                  <td>
                    <div className="visual-item-title-cell">
                      <strong>{gap.title}</strong>
                      <span className="text-xs muted">{gap.notes}</span>
                    </div>
                  </td>
                  <td>
                    <span className="mono text-xs muted">{gap.specLabel}</span>
                  </td>
                  <td>
                    <span className="text-xs">{gap.targetLocation}</span>
                  </td>
                  <td>
                    <span className="mono text-xs font-semibold">Week {12 + (idx % 6)}</span>
                  </td>
                  <td>
                    <span className="text-xs text-purple-700 font-semibold">Phase 04 · Ready</span>
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
   03. EVALUATION SUMMARY & REPORT
   ───────────────────────────────────────────────────────────────────────────── */
function VisualReportScreen() {
  const { categories, items } = useContext(VisualContext);
  const preview = usePreview();

  const presentCount = items.filter(i => i.status === 'Present').length;
  const missingCount = items.filter(i => i.status === 'Missing').length;
  const naCount = items.filter(i => i.status === 'Not Applicable').length;
  const compliancePct = Math.round((presentCount / (items.length - naCount)) * 100);

  return (
    <>
      <Panel className="report-cover-panel">
        <div className="between items-start">
          <div>
            <div className="visual-hero-badge">
              <span className="visual-hero-pill">STEP 13 · OFFICIAL EVALUATION REPORT</span>
              <span className="visual-status-chip">AUDIT COMPLETE</span>
            </div>
            <h1 className="report-main-title">Visual Management Guidelines Audit Report</h1>
            <p className="report-main-sub">
              Pune Complex Plant 02 · Evaluated against the 10 Visual Factory Standards (V1–V10)
            </p>
          </div>
          <PillButton
            variant="blue"
            icon="Download"
            onClick={() => preview('Export Visual Guidelines Report', 'Preparing comprehensive PDF and high-res layout drawings...')}
          >
            Export Audit Report
          </PillButton>
        </div>

        <div className="report-summary-boxes mt-20">
          <div className="rep-box">
            <span className="mono muted text-xs">OVERALL SCORE</span>
            <strong className="text-cyan-800 text-lg">{compliancePct}% Compliant</strong>
            <span className="text-xs muted">{presentCount} of {items.length - naCount} standards met</span>
          </div>
          <div className="rep-box">
            <span className="mono muted text-xs">VISUAL MATURITY</span>
            <strong>Level 3: Visual Control</strong>
            <span className="text-xs muted">Target: Level 4 Autonomous</span>
          </div>
          <div className="rep-box">
            <span className="mono muted text-xs">GAPS SCHEDULED</span>
            <strong className="text-amber-800">{missingCount} Signs to Procure</strong>
            <span className="text-xs muted">100% mapped to vendor specs</span>
          </div>
          <div className="rep-box">
            <span className="mono muted text-xs">STEP 15 HANDOFF</span>
            <strong className="text-emerald-800">100% Synchronized</strong>
            <span className="text-xs muted">Direct handoff to Project Plan</span>
          </div>
        </div>
      </Panel>

      {/* Category Breakdown Table */}
      <Panel
        title="Category Compliance Breakdown"
        subtitle="Results across the 8 standard manufacturing categories"
      >
        <div className="table-wrap">
          <table className="products-table">
            <thead>
              <tr>
                <th style={{ width: '80px' }}>Category</th>
                <th>Standard Category Name</th>
                <th style={{ width: '120px' }}>V-Codes</th>
                <th style={{ width: '100px' }}>Total Items</th>
                <th style={{ width: '100px' }}>Present</th>
                <th style={{ width: '100px' }}>Missing</th>
                <th style={{ width: '130px' }}>Compliance %</th>
              </tr>
            </thead>
            <tbody>
              {categories.map(cat => (
                <tr key={cat.id}>
                  <td>
                    <span className="mono font-semibold text-xs">CAT {cat.num}</span>
                  </td>
                  <td>
                    <span className="font-semibold text-sm">{cat.title}</span>
                  </td>
                  <td>
                    <div className="flex gap-4">
                      {cat.vCodes.map(c => (
                        <span key={c} className="vcode-pill">{c}</span>
                      ))}
                    </div>
                  </td>
                  <td>
                    <span className="mono text-xs">{cat.total}</span>
                  </td>
                  <td>
                    <span className="mono text-xs text-emerald-700 font-semibold">{cat.present}</span>
                  </td>
                  <td>
                    <span className="mono text-xs text-amber-700 font-semibold">{cat.missing}</span>
                  </td>
                  <td>
                    <div className="flex items-center gap-8">
                      <span className="mono text-xs font-semibold">{cat.compliancePct}%</span>
                      <div className="cat-progress-track" style={{ width: '60px' }}>
                        <div className="cat-progress-bar" style={{ width: `${cat.compliancePct}%` }} />
                      </div>
                    </div>
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
   MAIN VISUAL MANAGEMENT ROUTER
   ───────────────────────────────────────────────────────────────────────────── */
export default function VisualManagement() {
  const location = useLocation();
  const preview = usePreview();
  const desc = visualDescriptions[location.pathname] || visualDescriptions['/visual'];

  const getActiveTab = () => {
    if (location.pathname === '/visual/placement') return 'placement';
    if (location.pathname === '/visual/deployment') return 'deployment';
    if (location.pathname === '/visual/report') return 'report';
    return 'overview';
  };

  const activeTab = getActiveTab();

  return (
    <>
      <PageHeading
        title="Visual Management Guidelines"
        description={desc}
        actions={
          <div className="flex gap-8">
            <PillButton
              icon="Download"
              onClick={() => preview('Export Checksheet', 'Generating visual standards checksheet and BOQ...')}
            >
              Export BOQ
            </PillButton>
            <PillButton
              variant="blue"
              icon="Eye"
              onClick={() => preview('Visual Guidelines AI Check', 'Running AI consistency audit across placed signage...')}
            >
              AI Visual Audit
            </PillButton>
          </div>
        }
      >
        <div className="visual-hero-mark">
          <span className="step-tag">STEP 13</span>
          <span className="hero-divider">/</span>
          <span className="hero-module-title">VISUAL MANAGEMENT GUIDELINES</span>
        </div>
      </PageHeading>

      {/* Pill tabs strip matching other modules */}
      <div className="vsi-step-strip">
        <Link
          to="/visual"
          className={`ppq-step-strip-item ${activeTab === 'overview' ? 'active' : ''}`}
        >
          <span className="step-num">00</span>
          <strong>Checksheet Assessment</strong>
          <span className="step-sub">55 Standards · 8 Categories</span>
        </Link>
        <Link
          to="/visual/placement"
          className={`ppq-step-strip-item ${activeTab === 'placement' ? 'active' : ''}`}
        >
          <span className="step-num">01</span>
          <strong>Visual Placement</strong>
          <span className="step-sub">V1–V10 on Plant Layout</span>
        </Link>
        <Link
          to="/visual/deployment"
          className={`ppq-step-strip-item ${activeTab === 'deployment' ? 'active' : ''}`}
        >
          <span className="step-num">02</span>
          <strong>Installation Plan</strong>
          <span className="step-sub">16 Gaps · Vendor Specs</span>
        </Link>
        <Link
          to="/visual/report"
          className={`ppq-step-strip-item ${activeTab === 'report' ? 'active' : ''}`}
        >
          <span className="step-num">03</span>
          <strong>Evaluation Report</strong>
          <span className="step-sub">Category Audit & Scores</span>
        </Link>
      </div>

      {activeTab === 'overview' && <VisualOverview />}
      {activeTab === 'placement' && <VisualPlacementScreen />}
      {activeTab === 'deployment' && <VisualDeploymentPlan />}
      {activeTab === 'report' && <VisualReportScreen />}
    </>
  );
}
