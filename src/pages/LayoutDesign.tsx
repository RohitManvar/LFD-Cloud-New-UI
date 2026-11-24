import { createContext, useContext, useState, type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  layoutNavigation, layoutDescriptions, layoutAreaZones as initialAreas,
  type LayoutAreaZone,
} from '../data/mock';
import Icon from '../components/Icon';
import { PageHeading, Panel, PillButton, StatCard } from '../components/UI';
import { usePreview } from '../components/PreviewDialog';

interface LayoutContextType {
  areas: LayoutAreaZone[];
}

const LayoutContext = createContext<LayoutContextType>({
  areas: initialAreas,
});

export function LayoutProvider({ children }: { children: ReactNode }) {
  const [areas] = useState<LayoutAreaZone[]>(initialAreas);

  return (
    <LayoutContext.Provider value={{ areas }}>
      {children}
    </LayoutContext.Provider>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   00. LAYOUT DESIGN OVERVIEW & PLANT METRICS
   ───────────────────────────────────────────────────────────────────────────── */
function LayoutOverview() {
  const { areas } = useContext(LayoutContext);
  const preview = usePreview();

  const totalSqM = areas.reduce((acc, a) => acc + a.areaSqM, 0);
  const totalMachines = areas.reduce((acc, a) => acc + a.equipmentCount, 0);
  const totalOperators = areas.reduce((acc, a) => acc + a.operatorCount, 0);

  return (
    <>
      <section className="stats-grid" aria-label="Layout design summary metrics">
        <StatCard
          label="Total Plant Footprint"
          value="7,800 m²"
          subline="120m × 65m industrial complex"
          icon="PanelsTopLeft"
          to="/layout-design/areas"
        />
        <StatCard
          label="Zoned Departments"
          value={areas.length}
          subline="4 bays (A, B, C, D) divided"
          icon="Layers"
          dark
          to="/layout-design/areas"
        />
        <StatCard
          label="Machines Placed"
          value={totalMachines}
          subline={`${totalOperators} operators deployed`}
          icon="Cog"
          to="/layout-design/drafter"
        />
        <StatCard
          label="Flow Travel Index"
          value="0.88 / 1.0"
          subline="42% shorter walking paths"
          icon="Workflow"
          to="/layout-design/drafter"
        />
      </section>

      {/* Hero Banner */}
      <Panel className="layout-hero-panel">
        <div className="between items-start">
          <div>
            <div className="layout-hero-badge">
              <span className="layout-hero-pill">STEP 12 · PLANT MASTER LAYOUT</span>
              <span className="layout-status-chip">DXF / CAD VALIDATED</span>
            </div>
            <h2 className="layout-plan-title">Plant 02 Future-State Master Layout Design</h2>
            <p className="layout-plan-sub">
              Dividing the manufacturing facility into optimized workcells, dedicated tugger aisles, and presentation slides
            </p>
          </div>
          <div className="flex gap-8">
            <PillButton
              icon="Download"
              onClick={() => preview('Export CAD Layout Package', 'Generating full-resolution DXF, DWG, and high-res PDF drawings...')}
            >
              Export CAD
            </PillButton>
            <PillButton
              variant="blue"
              icon="PanelsTopLeft"
              onClick={() => preview('Launch 3D Plant Walkthrough', 'Rendering 3D digital twin of Pune Complex Plant 02...')}
            >
              3D Digital Twin
            </PillButton>
          </div>
        </div>

        {/* 4 Bays Overview Grid */}
        <div className="mt-18">
          <span className="eyebrow block mb-8">FACILITY QUADRANT ZONING</span>
          <div className="bays-overview-grid">
            <div className="bay-card bay-a">
              <span className="bay-badge">BAY A · SOUTH</span>
              <strong>Raw Materials & Inward Receiving</strong>
              <p className="text-xs muted mt-4">850 m² · Direct dock infeed, quarantine staging, bar stock racking.</p>
            </div>
            <div className="bay-card bay-b">
              <span className="bay-badge">BAY B · CENTER</span>
              <strong>CNC Turning & Gear Hobbing Cells</strong>
              <p className="text-xs muted mt-4">2,020 m² · U-shaped workcells, cellular infeed, SMED tooling carts.</p>
            </div>
            <div className="bay-card bay-c">
              <span className="bay-badge">BAY C · NORTH</span>
              <strong>Heat Treatment & Precision Grinding</strong>
              <p className="text-xs muted mt-4">2,030 m² · Enclosed induction hardening, refractory pits, wash bays.</p>
            </div>
            <div className="bay-card bay-d">
              <span className="bay-badge">BAY D · EAST</span>
              <strong>Assembly, PDI Metrology & Dispatch</strong>
              <p className="text-xs muted mt-4">2,520 m² · Single-piece assembly lines, finished goods supermarket.</p>
            </div>
          </div>
        </div>
      </Panel>

      {/* 2-Column: Layout Design Principles & AI Features */}
      <div className="layout-two-col mt-18">
        <Panel
          title="Flow Optimization Principles Applied"
          subtitle="How the future state design achieves continuous rectilinear flow"
        >
          <div className="principles-list">
            <div className="principle-item">
              <strong className="text-sm">Unidirectional Material Progression</strong>
              <p className="text-xs muted">Zero backtracking: Materials travel South to North from raw receiving to machining, then West to East into assembly and export loading docks.</p>
            </div>
            <div className="principle-item">
              <strong className="text-sm">Main Tugger Arteries & Pedestrian Clearways</strong>
              <p className="text-xs muted">Central 2.5m main transport corridor with dedicated two-way tugger lanes, bordered by 1.0m yellow-painted pedestrian zebra safe walkways.</p>
            </div>
            <div className="principle-item">
              <strong className="text-sm">Direct Flow Into Step 13 Visual Management</strong>
              <p className="text-xs muted">Every bay ceiling truss and machine flank identified here provides the coordinates where V1–V10 signage is placed.</p>
            </div>
          </div>
        </Panel>

        <Panel
          title="Department Floor Share"
          subtitle="Allocation of 7,800 m² footprint"
        >
          <div className="floor-share-breakdown">
            {areas.slice(0, 5).map(a => (
              <div key={a.id} className="share-row mb-8">
                <div className="between text-xs mb-2">
                  <span className="font-medium text-ink">{a.name}</span>
                  <span className="mono text-muted">{a.areaSqM} m² ({Math.round((a.areaSqM / totalSqM) * 100)}%)</span>
                </div>
                <div className="share-bar-track">
                  <div className="share-bar-fill" style={{ width: `${(a.areaSqM / totalSqM) * 100}%`, background: a.colorCode }} />
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   01. DEPARTMENT AREAS REGISTER
   ───────────────────────────────────────────────────────────────────────────── */
function LayoutAreasScreen() {
  const { areas } = useContext(LayoutContext);

  return (
    <>
      <Panel
        title="Departmental Areas & Floor Allocation"
        subtitle="14 distinct operational zones: Square meters, machine load, headcount, and material flow lines"
      >
        <div className="table-wrap">
          <table className="products-table">
            <thead>
              <tr>
                <th style={{ width: '80px' }}>ID</th>
                <th>Department / Work Area</th>
                <th style={{ width: '150px' }}>Facility Quadrant</th>
                <th style={{ width: '100px' }}>Area (m²)</th>
                <th style={{ width: '90px' }}>Machines</th>
                <th style={{ width: '90px' }}>Operators</th>
                <th style={{ width: '180px' }}>Flow Direction</th>
                <th style={{ width: '160px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {areas.map(a => (
                <tr key={a.id} className="lift">
                  <td>
                    <span className="mono font-semibold text-xs">{a.id}</span>
                  </td>
                  <td>
                    <div className="area-title-cell">
                      <span className="area-color-pip" style={{ background: a.colorCode }} />
                      <strong className="text-sm">{a.name}</strong>
                    </div>
                  </td>
                  <td>
                    <span className="text-xs font-medium text-slate-600">{a.bay}</span>
                  </td>
                  <td>
                    <span className="mono text-xs font-semibold">{a.areaSqM} m²</span>
                  </td>
                  <td>
                    <span className="mono text-xs font-semibold">{a.equipmentCount} units</span>
                  </td>
                  <td>
                    <span className="mono text-xs">{a.operatorCount} staff</span>
                  </td>
                  <td>
                    <span className="text-xs text-muted">{a.flowDirection}</span>
                  </td>
                  <td>
                    <span className="layout-status-tag reviewed">
                      ✓ {a.status}
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
   02. 2D CAD DRAFTER & FLOOR CANVAS
   ───────────────────────────────────────────────────────────────────────────── */
function LayoutDrafterScreen() {
  const { areas } = useContext(LayoutContext);
  const preview = usePreview();

  return (
    <>
      <Panel
        title="2D Scaled Layout Canvas (1:200 Scale)"
        subtitle="Machining bays, intermediate supermarkets, main transit gangways, and equipment footprints"
      >
        {/* Interactive CAD Canvas */}
        <div className="cad-floor-canvas">
          <div className="cad-canvas-toolbar">
            <span className="mono text-xs text-emerald-400 font-semibold">GRID: 5.0m × 5.0m · SNAP ACTIVE · 120m × 65m</span>
            <div className="flex gap-6">
              <button className="cad-tool-btn active">Pan</button>
              <button className="cad-tool-btn">Measure</button>
              <button className="cad-tool-btn">Layers</button>
              <button className="cad-tool-btn">Aisle 2.5m</button>
            </div>
          </div>

          <div className="cad-grid-layout">
            <div className="cad-zone bay-a">
              <span className="cad-zone-label">BAY A: RAW INWARD (850 m²)</span>
              <div className="cad-sub-block">Dock 1 & 2</div>
              <div className="cad-sub-block">Bar Racks</div>
            </div>
            <div className="cad-zone bay-b">
              <span className="cad-zone-label">BAY B: MACHINING CELLS (2,020 m²)</span>
              <div className="cad-sub-block">12 CNC Turning Centers</div>
              <div className="cad-sub-block">8 Gear Hobbers</div>
            </div>
            <div className="cad-zone bay-c">
              <span className="cad-zone-label">BAY C: HEAT TREAT (2,030 m²)</span>
              <div className="cad-sub-block">Induction Pits</div>
              <div className="cad-sub-block">Grinding Cells</div>
            </div>
            <div className="cad-zone bay-d">
              <span className="cad-zone-label">BAY D: ASSEMBLY & DISPATCH (2,520 m²)</span>
              <div className="cad-sub-block">U-Cell Lines</div>
              <div className="cad-sub-block">Export Docks</div>
            </div>
          </div>

          <div className="cad-canvas-footer">
            <span className="text-xs text-slate-300">Transit Corridor: 2.5m Two-Way Electric Tugger Artery</span>
            <span className="text-xs text-emerald-400">Walking path reduction: 42%</span>
          </div>
        </div>
      </Panel>
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   03. EXECUTIVE PRESENTATION DECK
   ───────────────────────────────────────────────────────────────────────────── */
function LayoutPresentationScreen() {
  const { areas } = useContext(LayoutContext);
  const preview = usePreview();

  return (
    <>
      <Panel className="report-cover-panel">
        <div className="between items-start">
          <div>
            <div className="layout-hero-badge">
              <span className="layout-hero-pill">STEP 12 · EXECUTIVE PRESENTATION</span>
              <span className="layout-status-chip">SLIDE-BY-SLIDE READY</span>
            </div>
            <h1 className="report-main-title">Plant Master Layout Design Presentation</h1>
            <p className="report-main-sub">
              Slide-by-Slide Executive Deck: Full facility floor view and detailed quadrant breakdowns · Pune Plant 02
            </p>
          </div>
          <PillButton
            variant="blue"
            icon="Download"
            onClick={() => preview('Export Layout Presentation Deck', 'Generating 16:9 widescreen PowerPoint deck and PDF slides...')}
          >
            Export Presentation Deck
          </PillButton>
        </div>

        <div className="report-summary-boxes mt-20">
          <div className="rep-box">
            <span className="mono muted text-xs">TOTAL AREA</span>
            <strong className="text-emerald-800 text-lg">7,800 m² Built-Up</strong>
            <span className="text-xs muted">14 zoned departments</span>
          </div>
          <div className="rep-box">
            <span className="mono muted text-xs">FLOW INDEX</span>
            <strong className="text-emerald-800">0.88 Clean Flow</strong>
            <span className="text-xs muted">Zero cross-traffic backtracking</span>
          </div>
          <div className="rep-box">
            <span className="mono muted text-xs">OPERATOR TRAVEL</span>
            <strong className="text-emerald-800">42% Shorter Distance</strong>
            <span className="text-xs muted">Compact U-shape workcells</span>
          </div>
          <div className="rep-box">
            <span className="mono muted text-xs">HANDOFF TO STEP 13</span>
            <strong className="text-cyan-800">Step 13 Visual Ready</strong>
            <span className="text-xs muted">V1–V10 signage placement</span>
          </div>
        </div>
      </Panel>
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN LAYOUT DESIGN ROUTER
   ───────────────────────────────────────────────────────────────────────────── */
export default function LayoutDesign() {
  const location = useLocation();
  const preview = usePreview();
  const desc = layoutDescriptions[location.pathname] || layoutDescriptions['/layout-design'];

  const getActiveTab = () => {
    if (location.pathname === '/layout-design/areas') return 'areas';
    if (location.pathname === '/layout-design/drafter') return 'drafter';
    if (location.pathname === '/layout-design/presentation') return 'presentation';
    return 'overview';
  };

  const activeTab = getActiveTab();

  return (
    <>
      <PageHeading
        title="Layout Design"
        description={desc}
        actions={
          <div className="flex gap-8">
            <PillButton
              icon="Download"
              onClick={() => preview('Export DXF Floor Plan', 'Exporting scaled plant master layout in DXF and DWG format...')}
            >
              Export CAD
            </PillButton>
            <PillButton
              variant="blue"
              icon="PanelsTopLeft"
              onClick={() => preview('Validate Flow Lines', 'Checking linear material travel vectors across all 14 departments...')}
            >
              Validate Flow
            </PillButton>
          </div>
        }
      >
        <div className="layout-hero-mark">
          <span className="step-tag">STEP 12</span>
          <span className="hero-divider">/</span>
          <span className="hero-module-title">LAYOUT DESIGN</span>
        </div>
      </PageHeading>

      {/* Pill tabs strip */}
      <div className="vsi-step-strip">
        <Link
          to="/layout-design"
          className={`ppq-step-strip-item ${activeTab === 'overview' ? 'active' : ''}`}
        >
          <span className="step-num">00</span>
          <strong>Overview & Bays</strong>
          <span className="step-sub">Plant Dimensions & Flow</span>
        </Link>
        <Link
          to="/layout-design/areas"
          className={`ppq-step-strip-item ${activeTab === 'areas' ? 'active' : ''}`}
        >
          <span className="step-num">01</span>
          <strong>Department Areas</strong>
          <span className="step-sub">14 Zoned Departments</span>
        </Link>
        <Link
          to="/layout-design/drafter"
          className={`ppq-step-strip-item ${activeTab === 'drafter' ? 'active' : ''}`}
        >
          <span className="step-num">02</span>
          <strong>2D CAD Drafter</strong>
          <span className="step-sub">Scaled 1:200 Floor Plan</span>
        </Link>
        <Link
          to="/layout-design/presentation"
          className={`ppq-step-strip-item ${activeTab === 'presentation' ? 'active' : ''}`}
        >
          <span className="step-num">03</span>
          <strong>Presentation</strong>
          <span className="step-sub">Projector Slide Deck</span>
        </Link>
      </div>

      {activeTab === 'overview' && <LayoutOverview />}
      {activeTab === 'areas' && <LayoutAreasScreen />}
      {activeTab === 'drafter' && <LayoutDrafterScreen />}
      {activeTab === 'presentation' && <LayoutPresentationScreen />}
    </>
  );
}
