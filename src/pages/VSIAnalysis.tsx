import { createContext, useContext, useState, type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ppqStudy, vsiNavigation, vsiDescriptions, vsiStreams as initialStreams,
  type VSIStream,
} from '../data/mock';
import { fmtCurrency, fmtNum } from '../data/ppqModel';
import Icon from '../components/Icon';
import { EmptyState, IconCircleButton, PageHeading, Panel, PillButton, SearchPill, StatCard } from '../components/UI';
import { usePreview } from '../components/PreviewDialog';

interface VSIContextType {
  streams: VSIStream[];
  threshold: number;
  setThreshold: (val: number) => void;
  selectAnchor: (id: string) => void;
}

const VSIContext = createContext<VSIContextType>({
  streams: initialStreams,
  threshold: 0.60,
  setThreshold: () => {},
  selectAnchor: () => {},
});

export function VSIProvider({ children }: { children: ReactNode }) {
  const [streams, setStreams] = useState<VSIStream[]>(initialStreams);
  const [threshold, setThreshold] = useState<number>(0.60);

  const selectAnchor = (id: string) => {
    setStreams(prev => prev.map(s => ({ ...s, selected_for_vsm: s.id === id })));
  };

  return (
    <VSIContext.Provider value={{ streams, threshold, setThreshold, selectAnchor }}>
      {children}
    </VSIContext.Provider>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   00. VSI OVERVIEW
   ───────────────────────────────────────────────────────────────────────────── */
function VSIOverview({ streams }: { streams: VSIStream[] }) {
  const preview = usePreview();
  const anchor = streams.find(s => s.selected_for_vsm) || streams[0];

  const checks = [
    { label: 'Portfolio analysed', detail: '12 products from PPQ Step 1', done: true, path: '/ppq/products' },
    { label: 'Process routes complete', detail: '12 of 12 parts routed in Step 4', done: true, path: '/ppq/process-matrix' },
    { label: 'VSMs grouped', detail: '3 stream families grouped', done: true, path: '/vsi/grouping' },
    { label: 'Value stream chosen', detail: `${anchor.code} selected for VSM`, done: true, path: '/vsi/report' },
  ];

  return (
    <>
      <section className="stats-grid" aria-label="VSI summary metrics">
        <StatCard
          label="Identified Streams"
          value={streams.length}
          subline="100% of portfolio mapped"
          icon="Workflow"
          to="/vsi/grouping"
        />
        <StatCard
          label="Selected Value Stream"
          value={anchor.code}
          subline={`${anchor.name} (94% Cohesion)`}
          icon="Compass"
          dark
          to="/vsi/report"
        />
        <StatCard
          label="Anchor Volume Share"
          value={`${anchor.qty_pct}%`}
          subline={`${fmtNum(anchor.annual_qty)} pcs / year`}
          icon="TrendingUp"
          to="/vsi/grouping"
        />
        <StatCard
          label="Daily Takt Demand"
          value={anchor.daily_demand}
          suffix=" pcs"
          subline={`Takt pace: ${anchor.takt_seconds}s (250 days)`}
          icon="Activity"
          to="/vsi/report"
        />
      </section>

      {/* 4 Readiness Checks */}
      <div className="vsi-readiness-strip">
        {checks.map(c => (
          <Link key={c.label} to={c.path} className="vsi-check-item">
            <span className="vsi-check-icon"><Icon name="Check" size={14} /></span>
            <div>
              <strong>{c.label}</strong>
              <p className="muted font-micro">{c.detail}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="vsi-overview-grid">
        {/* Selected Anchor Stream Card */}
        <div className="vsi-anchor-card">
          <div className="between">
            <span className="vsi-pill-chip">
              <Icon name="Compass" size={13} />
              Selected Anchor Value Stream
            </span>
            <span className="mono muted font-small">Target for Step 4 (VSM)</span>
          </div>

          <div>
            <h3>{anchor.name} ({anchor.code})</h3>
            <p className="muted font-small">{anchor.tradeoff}</p>
          </div>

          <div className="vsi-anchor-metrics">
            <div>
              <span className="muted font-micro">Cohesion Index</span>
              <strong>{anchor.cohesion_pct}% Match</strong>
            </div>
            <div>
              <span className="muted font-micro">Annual Volume</span>
              <strong>{fmtNum(anchor.annual_qty)} pcs</strong>
            </div>
            <div>
              <span className="muted font-micro">Sales Value</span>
              <strong>{fmtCurrency(anchor.annual_revenue)}</strong>
            </div>
            <div>
              <span className="muted font-micro">Daily Takt</span>
              <strong>{anchor.daily_demand} pcs/day</strong>
            </div>
          </div>

          <div className="vsi-route-bar">
            <span className="muted font-micro">Shared Cell Flow:</span>
            <div className="inline" style={{ gap: 6 }}>
              {anchor.shared_route.map((op, idx) => (
                <span key={op} className="vsi-op-chip">
                  <small>{idx + 1}</small>{op}
                </span>
              ))}
            </div>
          </div>

          <div className="between" style={{ marginTop: 'auto', paddingTop: 8 }}>
            <span className="vsi-status-badge active"><Icon name="CheckCircle2" size={14} />Charter Approved</span>
            <PillButton to="/vsi/report" small>View Value Stream Charter<Icon name="ArrowUpRight" size={14} /></PillButton>
          </div>
        </div>

        {/* Portfolio Stream Split */}
        <Panel title="Stream Portfolio Breakdown" subtitle="How plant volume and revenue divide across the 3 streams" action={<PillButton small to="/vsi/grouping">Adjust Grouping<Icon name="ArrowUpRight" size={14} /></PillButton>}>
          <div className="vsi-stream-split-list">
            {streams.map(s => (
              <div key={s.id} className={'vsi-split-row ' + (s.selected_for_vsm ? 'selected' : '')}>
                <div className="between">
                  <div className="inline" style={{ gap: 8 }}>
                    <span className="vsi-stream-code">{s.code}</span>
                    <strong>{s.name}</strong>
                  </div>
                  {s.selected_for_vsm && <span className="vsi-tag green">Anchor VSM</span>}
                </div>
                <div className="vsi-split-bars">
                  <div className="vsi-split-bar-item">
                    <span className="font-micro muted">Volume: {s.qty_pct}%</span>
                    <div className="vsi-mini-track"><span style={{ width: `${s.qty_pct}%` }} className="qty" /></div>
                  </div>
                  <div className="vsi-split-bar-item">
                    <span className="font-micro muted">Revenue: {s.rev_pct}%</span>
                    <div className="vsi-mini-track"><span style={{ width: `${s.rev_pct}%` }} className="rev" /></div>
                  </div>
                </div>
                <div className="between muted font-micro" style={{ paddingTop: 4 }}>
                  <span>{s.products_count} parts · {s.shared_route.length} shared ops</span>
                  <span>Cohesion: {s.cohesion_pct}%</span>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div className="vsi-bottom-grid">
        <Panel title="Recommended Next Steps" subtitle="Roadmap from Value Stream Identification to Shopfloor Implementation">
          <div className="vsi-roadmap-list">
            <div className="vsi-roadmap-item">
              <span className="vsi-step-badge">1</span>
              <div>
                <strong>Form the Cross-Functional Mapping Team</strong>
                <p className="muted font-small">Include production supervisor, tool setter, maintenance lead, and quality engineer for {anchor.name}.</p>
              </div>
            </div>
            <div className="vsi-roadmap-item">
              <span className="vsi-step-badge">2</span>
              <div>
                <strong>Prepare for Step 4 (VSM Walk)</strong>
                <p className="muted font-small">Walk the physical route from Raw Material cutting to final packing with a stopwatch and count staging WIP.</p>
              </div>
            </div>
            <div className="vsi-roadmap-item">
              <span className="vsi-step-badge">3</span>
              <div>
                <strong>Establish Customer Takt Baseline</strong>
                <p className="muted font-small">Target pace is {anchor.takt_seconds} seconds per piece. Current bottleneck cycle time is estimated at 88 seconds.</p>
              </div>
            </div>
          </div>
        </Panel>

        <Panel title="AI Stream Intelligence" subtitle="Opportunity suggestions from process route overlap analysis" action={<PillButton small to="/vsi/suggestions">Review Suggestions<Icon name="ArrowUpRight" size={14} /></PillButton>}>
          <div className="vsi-ai-preview-card">
            <div className="between">
              <span className="vsi-pill-chip"><Icon name="Sparkles" size={13} />Clean Cell Opportunity</span>
              <span className="vsi-tag green">94% Cohesion</span>
            </div>
            <h3>Pure Shaft Turning & Grinding Cell</h3>
            <p className="muted font-small">VSM-01 products follow a strictly linear sequence with zero backtracking. Consolidating these 5 products into an adjacent U-cell will eliminate 280 meters of inter-bay forklift transfers.</p>
            <div className="between" style={{ marginTop: 10 }}>
              <span className="font-micro muted">Lead Part: Main Input Shaft (P-101)</span>
              <PillButton to="/vsi/suggestions" small>Inspect Opportunity</PillButton>
            </div>
          </div>
        </Panel>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   01. VSM GROUPING SCREEN
   ───────────────────────────────────────────────────────────────────────────── */
function VSIMappingGrouping({ streams, threshold, setThreshold, onSelect }: { streams: VSIStream[]; threshold: number; setThreshold: (val: number) => void; onSelect: (id: string) => void }) {
  const preview = usePreview();

  return (
    <>
      <div className="filter-heading">
        <div>
          <h2>Product Routing Similarity Clustering</h2>
          <p className="muted font-small">Adjust the similarity threshold slider to govern cluster tightness. Higher values create tighter cells with more groups.</p>
        </div>
        <div className="filters">
          <div className="vsi-slider-box">
            <span className="muted font-small">Similarity Threshold: <b>{(threshold * 100).toFixed(0)}%</b></span>
            <input
              type="range"
              min="0.3"
              max="0.9"
              step="0.05"
              value={threshold}
              onChange={e => setThreshold(parseFloat(e.target.value))}
            />
          </div>
          <button type="button" className="pill-button vsi-primary" onClick={() => preview('Re-cluster Streams', 'Recomputed Jaccard similarity matrix across all 12 parts at threshold ' + threshold.toFixed(2))}>
            <Icon name="Workflow" size={16} />Regenerate VSMs
          </button>
        </div>
      </div>

      <div className="vsi-grouping-grid">
        {streams.map(s => (
          <article key={s.id} className={'vsi-group-card ' + (s.selected_for_vsm ? 'selected' : '')}>
            <div className="between">
              <div className="inline" style={{ gap: 8 }}>
                <span className="vsi-stream-code">{s.code}</span>
                <span className="vsi-cohesion-pill">Cohesion: {s.cohesion_pct}%</span>
              </div>
              {s.selected_for_vsm ? (
                <span className="vsi-tag green"><Icon name="Check" size={12} />Selected Anchor</span>
              ) : (
                <button type="button" className="vsi-select-btn" onClick={() => onSelect(s.id)}>
                  Select as Anchor VSM
                </button>
              )}
            </div>

            <div style={{ marginTop: 8 }}>
              <h3>{s.name}</h3>
              <p className="muted font-small">{s.tradeoff}</p>
            </div>

            <div className="vsi-group-stats">
              <div>
                <span className="muted font-micro">Products</span>
                <strong>{s.products_count} parts</strong>
              </div>
              <div>
                <span className="muted font-micro">Volume</span>
                <strong>{fmtNum(s.annual_qty)} pcs</strong>
              </div>
              <div>
                <span className="muted font-micro">Sales</span>
                <strong>{fmtCurrency(s.annual_revenue)}</strong>
              </div>
              <div>
                <span className="muted font-micro">Takt Pace</span>
                <strong>{s.takt_seconds}s</strong>
              </div>
            </div>

            <div className="vsi-shared-route-box">
              <span className="muted font-micro">Shared by 100% of member parts:</span>
              <div className="vsi-route-tags">
                {s.shared_route.map(op => (
                  <span key={op} className="vsi-op-chip active">{op}</span>
                ))}
              </div>
            </div>

            <div className="vsi-products-table-wrap">
              <span className="muted font-micro">Member Parts in Stream ({s.products.length}):</span>
              <div className="vsi-mini-products-list">
                {s.products.map(p => (
                  <div key={p.code} className="vsi-mini-prod-row">
                    <span className="mono font-bold vsi-accent-text">{p.code}</span>
                    <span className="vsi-prod-name">{p.name}</span>
                    <span className="mono muted font-micro">{fmtNum(p.qty)} pcs</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="vsi-card-footer">
              <span className="font-micro muted">Route overlap: {s.shared_route.length} of {s.all_route.length} operations</span>
              <PillButton small onClick={() => preview(s.name + ' Stream Flow', 'Full route map and machine requirements for ' + s.code)}>Inspect Flow</PillButton>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   02. AI SUGGESTIONS SCREEN
   ───────────────────────────────────────────────────────────────────────────── */
function VSISuggestionsScreen({ streams, onSelect }: { streams: VSIStream[]; onSelect: (id: string) => void }) {
  const preview = usePreview();

  const suggestions = [
    {
      id: 'VSM-01',
      title: 'Dedicated Transmission Shaft Cell',
      verdict: 'Strong Anchor Candidate',
      size: '5 parts · 48% volume · ₹26.8 Cr',
      summary: 'Cleanest linear flow without bottleneck equipment competition. Optimal anchor stream for initial Lean layout deployment.',
      route: ['Cutting', 'CNC Turning', 'Heat Treat', 'Grinding', 'Final QA', 'Packing'],
      sharedCount: 6,
      caveat: 'Requires dedicated washing station at the end of grinding cell to prevent batch transport delays.',
    },
    {
      id: 'VSM-02',
      title: 'Transmission Gear Hobbing Line',
      verdict: 'Candidate for Phase 2 VSM',
      size: '4 parts · 39% volume · ₹31.6 Cr',
      summary: 'Generates highest revenue but hobbing cutter changeover times create batching. Best scheduled for Phase 2 SMED optimization.',
      route: ['Forging', 'CNC Turning', 'Gear Hobbing', 'Heat Treat', 'Grinding', 'Final QA', 'Packing'],
      sharedCount: 6,
      caveat: 'Do not deploy cellular layout until quick changeover (SMED) reduces hobbing setup from 45 min to under 10 min.',
    },
    {
      id: 'VSM-03',
      title: 'Flange & Adaptor Kanban Pull Loop',
      verdict: 'Recommend Replenishment Pull Loop',
      size: '3 parts · 13% volume · ₹4.7 Cr',
      summary: 'Low-runner parts with standard machining. Do not map complex VSM; manage as point-of-use supermarket replenishment.',
      route: ['Cutting', 'CNC Turning', 'Milling', 'Final QA', 'Packing'],
      sharedCount: 4,
      caveat: 'Simple FIFO rack in the assembly area will solve parts shortage without dedicated machinery.',
    },
  ];

  return (
    <>
      <div className="vsi-intro-strip">
        <Icon name="Sparkles" size={24} />
        <div>
          <h3>AI Stream Recommendation Engine</h3>
          <p className="muted font-small">Evaluates routing cleanliness, equipment bottlenecks, setup times, and demand stability to identify the highest-ROI value stream for Step 4.</p>
        </div>
      </div>

      <div className="vsi-suggestions-list">
        {suggestions.map((item, idx) => (
          <article key={item.title} className="vsi-suggestion-card">
            <div className="between">
              <div className="inline" style={{ gap: 8 }}>
                <span className="vsi-suggestion-rank">Option {idx + 1}</span>
                <span className={'vsi-tag ' + (idx === 0 ? 'green' : 'amber')}>{item.verdict}</span>
              </div>
              <span className="mono font-micro muted">{item.size}</span>
            </div>

            <div style={{ marginTop: 8 }}>
              <h3>{item.title}</h3>
              <p className="muted font-small">{item.summary}</p>
            </div>

            <div className="vsi-suggestion-route">
              <span className="muted font-micro">Shared Operations Sequence:</span>
              <div className="inline" style={{ gap: 6 }}>
                {item.route.map((r, i) => (
                  <span key={r} className="vsi-op-chip active">
                    <small>{i + 1}</small>{r}
                  </span>
                ))}
              </div>
            </div>

            <div className="vsi-caveat-box">
              <Icon name="CircleHelp" size={16} />
              <p><strong>Implementation Caveat:</strong> {item.caveat}</p>
            </div>

            <div className="between" style={{ marginTop: 'auto', paddingTop: 10 }}>
              <button type="button" className="pill-button vsi-primary" onClick={() => onSelect(item.id)}>
                <Icon name="Check" size={14} />Choose as Value Stream 01
              </button>
              <PillButton small onClick={() => preview(item.title + ' Analysis', item.summary)}>View AI Tradeoff Matrix</PillButton>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   03. VALUE STREAM CHARTER & REPORT SCREEN
   ───────────────────────────────────────────────────────────────────────────── */
function VSICharterReport({ streams }: { streams: VSIStream[] }) {
  const preview = usePreview();
  const anchor = streams.find(s => s.selected_for_vsm) || streams[0];

  return (
    <div className="vsi-report-container">
      <Panel className="vsi-report-card">
        <div className="between">
          <div className="inline">
            <span className="vsi-report-pill">Value Stream Charter</span>
            <span className="muted mono font-small">Step 03 of 15 Outcome</span>
          </div>
          <PillButton icon="Download" onClick={() => preview('Export Charter PDF', 'Downloading signed Value Stream Charter document.')}>
            Export Charter PDF
          </PillButton>
        </div>

        <div className="vsi-report-header">
          <h2>Official Value Stream Charter: {anchor.name}</h2>
          <p className="muted font-small">{ppqStudy.org_name} · {ppqStudy.plant} · Approved for Step 4 (VSM)</p>
        </div>

        <div className="vsi-charter-box">
          <div className="between">
            <div>
              <span className="muted font-micro">Chosen Value Stream</span>
              <h3>{anchor.name} ({anchor.code})</h3>
            </div>
            <span className="vsi-tag green">100% Ready for Step 4</span>
          </div>

          <div className="vsi-charter-kpis">
            <div>
              <span className="muted font-micro">Annual Demand</span>
              <strong>{fmtNum(anchor.annual_qty)} pcs</strong>
            </div>
            <div>
              <span className="muted font-micro">Daily Production</span>
              <strong>{anchor.daily_demand} pcs/day</strong>
            </div>
            <div>
              <span className="muted font-micro">Takt Time</span>
              <strong>{anchor.takt_seconds} seconds</strong>
            </div>
            <div>
              <span className="muted font-micro">Annual Sales</span>
              <strong>{fmtCurrency(anchor.annual_revenue)}</strong>
            </div>
          </div>
        </div>

        <div className="vsi-report-section">
          <h3>1. Scope of Products in Stream</h3>
          <p>
            The value stream encompasses <strong>{anchor.products_count} heavy runner shafts</strong> representing <strong>{anchor.qty_pct}% of plant throughput</strong>.
          </p>
          <div className="vsi-charter-products-grid">
            {anchor.products.map(p => (
              <div key={p.code} className="vsi-charter-prod">
                <span className="mono font-bold vsi-accent-text">{p.code}</span>
                <strong>{p.name}</strong>
                <span className="muted font-micro">{fmtNum(p.qty)} pcs/yr</span>
              </div>
            ))}
          </div>
        </div>

        <div className="vsi-report-section">
          <h3>2. Process Boundary (Door-to-Door)</h3>
          <p>
            The value stream mapping walk starts at <strong>Raw Material Bar Cutting</strong> and finishes at <strong>Finished Component Packaging</strong>.
          </p>
          <div className="vsi-route-chain">
            {anchor.shared_route.map((op, idx) => (
              <div key={op} className="vsi-chain-node">
                <span className="vsi-node-num">{idx + 1}</span>
                <span className="vsi-node-name">{op}</span>
                {idx < anchor.shared_route.length - 1 && <span className="vsi-node-arrow">→</span>}
              </div>
            ))}
          </div>
        </div>

        <div className="vsi-report-section">
          <h3>3. Target Improvement Objectives in Step 4</h3>
          <ul className="vsi-objectives-list">
            <li><strong>Reduce Lead Time:</strong> Current estimated manufacturing lead time of 14.5 days to under 4 days.</li>
            <li><strong>Eliminate Staging WIP:</strong> Reduce batch size from 500 pcs to one-piece-flow in cellular formation.</li>
            <li><strong>Constraint Management:</strong> Balance the Cylindrical Grinding operation to match the 74-second customer takt pace.</li>
          </ul>
        </div>

        <div className="ppq-panel-footer" style={{ borderTop: '1px solid var(--border)', paddingTop: 16 }}>
          <PillButton to="/services" icon="ArrowLeft">Back to Services</PillButton>
          <button
            type="button"
            className="pill-button vsi-primary"
            onClick={() => preview('Handoff to VSM', 'Value Stream Charter transmitted. Initializing Step 4: Value Stream Mapping for ' + anchor.name)}
          >
            <Icon name="ArrowRight" size={16} />Begin Step 4: Value Stream Mapping
          </button>
        </div>
      </Panel>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN VSI ROUTER PAGE
   ───────────────────────────────────────────────────────────────────────────── */
export default function VSIAnalysis() {
  const location = useLocation();
  const { pathname } = location;
  const { streams, threshold, setThreshold, selectAnchor } = useContext(VSIContext);

  const current = vsiNavigation.find(n => n.path === pathname) || vsiNavigation[0];
  const index = vsiNavigation.indexOf(current);

  return (
    <>
      <PageHeading
        title={pathname === '/vsi' ? 'Value Stream Identification (VSI)' : current.label}
        description={vsiDescriptions[pathname] || vsiDescriptions['/vsi']}
        actions={
          pathname === '/vsi' ? (
            <>
              <PillButton to="/vsi/grouping" icon="Workflow">Adjust Grouping</PillButton>
              <PillButton to="/vsi/report" icon="BookOpen">View Charter</PillButton>
            </>
          ) : undefined
        }
      >
        {pathname === '/vsi' && (
          <div className="vsi-hero-mark">
            <Icon name="Compass" size={44} />
            <div>
              <span>STEP</span>
              <strong>03</strong>
            </div>
          </div>
        )}
      </PageHeading>

      {/* Context Bar */}
      <div className="assessment-context vsi-context">
        <span className="icon-box vsi-icon">
          <Icon name="Building2" size={18} />
        </span>
        <div className="assessment-name">
          <span className="muted">{ppqStudy.org_name}</span>
          <strong>{ppqStudy.name} · Value Stream ID</strong>
        </div>
        <span className="assessment-location">
          <Icon name="PanelsTopLeft" size={14} />
          {ppqStudy.plant}
        </span>
        <span className="vsi-sample-label">Step 03 Study</span>
      </div>

      {pathname === '/vsi/grouping' ? (
        <VSIMappingGrouping
          streams={streams}
          threshold={threshold}
          setThreshold={setThreshold}
          onSelect={selectAnchor}
        />
      ) : pathname === '/vsi/suggestions' ? (
        <VSISuggestionsScreen streams={streams} onSelect={selectAnchor} />
      ) : pathname === '/vsi/report' ? (
        <VSICharterReport streams={streams} />
      ) : (
        <VSIOverview streams={streams} />
      )}

      {/* Footer Navigation */}
      <nav className="risk-step-footer vsi-step-footer" aria-label="VSI steps">
        {index > 0 ? (
          <Link to={vsiNavigation[index - 1].path}>
            <Icon name="ArrowLeft" size={16} />
            <span>
              Previous
              <strong>{vsiNavigation[index - 1].label}</strong>
            </span>
          </Link>
        ) : (
          <Link to="/ppq">
            <Icon name="ArrowLeft" size={16} />Step 2: PPQ Analysis
          </Link>
        )}
        {index < vsiNavigation.length - 1 ? (
          <Link to={vsiNavigation[index + 1].path}>
            <span>
              Next
              <strong>{vsiNavigation[index + 1].label}</strong>
            </span>
            <Icon name="ArrowRight" size={16} />
          </Link>
        ) : (
          <Link to="/services">
            <span>
              Next Step
              <strong>Step 4: Value Stream Mapping</strong>
            </span>
            <Icon name="ArrowRight" size={16} />
          </Link>
        )}
      </nav>
    </>
  );
}
