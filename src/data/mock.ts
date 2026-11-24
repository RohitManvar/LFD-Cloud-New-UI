/**
 * Static reference snapshot. No APIs, credentials, or production connections.
 * Dates/counts intentionally match the provided October 2026 design references.
 * Dashboard platform totals and Users page sample totals have different scopes.
 */
export const profile = { full_name: 'Rohit Manvar', initials: 'RM', global_role: 'super_admin', role_label: 'Super Admin' };
export const navigation = [
  { label: 'Search', path: '/search', icon: 'Search' },
  { label: 'Dashboard', path: '/home', icon: 'LayoutDashboard' },
  { label: 'Organizations', path: '/hub/organizations', icon: 'Building2' },
  { label: 'Subscriptions', path: '/hub/subscriptions', icon: 'CreditCard' },
  { label: 'Users', path: '/hub/users', icon: 'Users' },
  { label: 'Plans & Limits', path: '/plans', icon: 'SlidersHorizontal' },
  { label: 'Services', path: '/services', icon: 'Layers3' },
  { label: 'Notifications', path: '/hub/notifications', icon: 'Bell', account: true },
  { label: 'Audit Logs', path: '/audit-logs', icon: 'History', account: true },
];
export const pageDescriptions: Record<string, string> = {
  Dashboard: 'Super Admin · Full access to organizations, plans, users and subscriptions',
  Organizations: 'Multi-tenant client management — plans, limits & admin allocation',
  Subscriptions: 'Manage customer plans, renewals and billing',
  Users: 'Manage accounts, roles and permission controls',
  Services: 'Lean Flow Design · 15 steps · 5 supporting modules',
  'Plans & Limits': 'Manage platform plans and capacity limits',
  Notifications: 'Your platform updates, all in one place',
  'Audit Logs': 'A history of changes across your platform',
  Search: 'Find your way around LFD Cloud',
};
export interface Organization {
  org_id: string; name: string; industry: string; sub_sector: string; location: string;
  status: 'active' | 'suspended'; org_type: 'internal' | 'client'; created_by: string;
  created_at: string; admin_count: number; user_count: number; project_count: number;
  preview_user_count: number; initials: string;
}
export const organizations: Organization[] = [
  { org_id: 'org-narmada', name: 'Narmada Pharma Formulations Pvt. Ltd.', industry: 'Pharma', sub_sector: 'Formulations (Solid Dose)', location: 'Sarigam GIDC, Valsad, Gujarat', status: 'active', org_type: 'internal', created_by: 'Faber Infinite', created_at: '2026-10-09', admin_count: 0, user_count: 0, project_count: 3, preview_user_count: 0, initials: 'NP' },
  { org_id: 'org-sahyadri', name: 'Sahyadri Auto Components Pvt. Ltd.', industry: 'Automotive', sub_sector: 'Auto Components (Tier-1)', location: 'Chakan MIDC, Pune, Maharashtra', status: 'active', org_type: 'internal', created_by: 'Faber Infinite', created_at: '2026-10-09', admin_count: 0, user_count: 0, project_count: 3, preview_user_count: 0, initials: 'SA' },
  { org_id: 'org-kalinga-pvt', name: 'Kalinga Metal Treatment Pvt. Ltd.', industry: 'Heavy Engineering and Metal Treatment', sub_sector: 'Surface Treatment and Heat Treatment', location: 'Jamshedpur, India', status: 'active', org_type: 'internal', created_by: 'Faber Infinite', created_at: '2026-10-09', admin_count: 0, user_count: 0, project_count: 9, preview_user_count: 0, initials: 'KM' },
  { org_id: 'org-shivamshree', name: 'SHIVAMSHREE BUSINESSES LTD.', industry: 'FIBC', sub_sector: '', location: 'Ahmedabad', status: 'active', org_type: 'client', created_by: 'Rohit Manvar', created_at: '2026-10-01', admin_count: 2, user_count: 0, project_count: 2, preview_user_count: 2, initials: 'SB' },
  { org_id: 'org-brw', name: 'BRW', industry: 'Products industry', sub_sector: '', location: 'Delhi', status: 'active', org_type: 'internal', created_by: 'Rohit Manvar', created_at: '2026-09-15', admin_count: 2, user_count: 0, project_count: 7, preview_user_count: 1, initials: 'B' },
  { org_id: 'org-ashgrove', name: 'Ashgrove Hardware Works', industry: 'Builders and architectural hardware', sub_sector: 'Locks, hinges and door hardware', location: 'Rajkot, India', status: 'active', org_type: 'client', created_by: 'Seed', created_at: '2026-09-11', admin_count: 1, user_count: 0, project_count: 10, preview_user_count: 0, initials: 'AH' },
  { org_id: 'org-kalinga', name: 'Kalinga Metal Treatment', industry: 'Heavy engineering and metal treatment', sub_sector: 'Surface treatment and heat treatment', location: 'Jamshedpur, India', status: 'active', org_type: 'client', created_by: 'Seed', created_at: '2026-09-11', admin_count: 1, user_count: 0, project_count: 9, preview_user_count: 0, initials: 'KM' },
  { org_id: 'org-nordvik', name: 'Nordvik Precision Components', industry: 'Automotive components', sub_sector: 'Precision machining & assembly', location: 'Pune, India', status: 'active', org_type: 'client', created_by: 'Seed', created_at: '2026-09-11', admin_count: 1, user_count: 0, project_count: 10, preview_user_count: 0, initials: 'NP' },
  { org_id: 'org-test', name: 'Test PPQ', industry: 'Automotive', sub_sector: '', location: 'Test_Location', status: 'active', org_type: 'internal', created_by: 'Rohit Manvar', created_at: '2026-08-22', admin_count: 1, user_count: 0, project_count: 2, preview_user_count: 1, initials: 'TP' },
];
export const platform = { organizations: 9, users: 17, projects: 55, admins: 7, services: 19, max_services: 19, max_orgs: 50, max_users: 1000, max_projects: 2000, max_admins: 200, plan: 'Trial', plan_users: 8 };
export const usageTiles = [
  { label: 'Users', used: platform.users, limit: platform.max_users, percent: 2, icon: 'Users' },
  { label: 'Value streams', used: platform.projects, limit: platform.max_projects, percent: 3, icon: 'Workflow' },
  { label: 'Organizations', used: platform.organizations, limit: platform.max_orgs, percent: 18, icon: 'Building2' },
  { label: 'Admins', used: platform.admins, limit: platform.max_admins, percent: 4, icon: 'ShieldCheck' },
];
export const health = [
  { label: 'System status', value: 'Healthy', icon: 'Activity' },
  { label: 'Database', value: 'Healthy', icon: 'Database' },
  { label: 'Storage usage', value: '10%', icon: 'HardDrive' },
  { label: 'API status', value: 'Operational', icon: 'Globe' },
];
export const projects = [
  { project_id: 'project-white-new', org_id: 'org-shivamshree', project_name: 'White FIBC 90X90X120 CM (New)', status: 'In Progress', progress: 65 },
  { project_id: 'project-wire', org_id: 'org-kalinga', project_name: 'Wire Drawing and Galvanizing', status: 'In Progress', progress: 40 },
  { project_id: 'project-white', org_id: 'org-shivamshree', project_name: 'White FIBC 90X90X120 CM', status: 'In Progress', progress: 30 },
];
export const activities = [
  { title: projects[0].project_name, organization: organizations[3].name, kind: 'Value stream', action: 'updated', status: 'in-progress', time: '11 days ago' },
  ...organizations.slice(0, 3).map(o => ({ title: o.name, organization: '', kind: 'Organization', action: 'created', status: '', time: '18 days ago' })),
  { title: projects[1].project_name, organization: organizations[6].name, kind: 'Value stream', action: 'updated', status: 'in-progress', time: '25 days ago' },
  { title: projects[0].project_name, organization: organizations[3].name, kind: 'Value stream', action: 'created', status: '', time: '25 days ago' },
  { title: projects[2].project_name, organization: organizations[3].name, kind: 'Value stream', action: 'created', status: '', time: '25 days ago' },
  { title: organizations[3].name, organization: '', kind: 'Organization', action: 'created', status: '', time: '25 days ago' },
];
export const services = [
  { step: 1, title: 'Training & Orientation', short: 'Run the session, record who was trained, and carry that team into the map.', icon: 'GraduationCap' },
  { step: 2, title: 'Product, Process & Quantity Analysis', short: 'Rank the portfolio, run pareto, and pick the product family to map.', icon: 'FlaskConical' },
  { step: 3, title: 'Value Stream Identification', short: 'Group the ranked portfolio into families, pick the stream to map, and hand it to VSM.', icon: 'Compass', ai: true },
  { step: 4, title: 'Value Stream Mapping', short: 'Map current & future state value streams (VSM).', icon: 'Workflow', ai: true },
  { step: 5, title: 'Flow Management', short: 'Put every product stream on one sheet: what they share, and how far material walks.', icon: 'Waves' },
  { step: 6, title: 'Capacity Planning & Ramp-up', short: 'Rate every machine against demand, find the constraint, plan the ramp-up.', icon: 'TrendingUp' },
  { step: 7, title: 'Equipment Planning Guidelines', short: 'Keep, upgrade or replace every machine — and price what has to be bought.', icon: 'Cog' },
  { step: 8, title: 'Manpower Requirement Planning', short: 'Current deployment against improved — and what it does to output per person.', icon: 'Users' },
  { step: 9, title: 'Supply Chain Design', short: 'Write up the kaizens, and score the suppliers feeding the plant.', icon: 'Network' },
  { step: 10, title: 'Flow Supermarket & Line Design', short: 'Size the supermarket from what the line consumes, against the space the floor gives.', icon: 'Warehouse' },
  { step: 11, title: 'Material Handling Design', short: 'Plan the new equipment the operation needs: current against proposed, the total investment.', icon: 'Truck', ai: true },
  { step: 12, title: 'Layout Design', short: 'Import the plant layout, divide it into areas and present it slide by slide.', icon: 'PanelsTopLeft', ai: true },
  { step: 13, title: 'Visual Management Guidelines', short: 'Score the visual checksheet, place the V1–V10 controls on the plant layout and plan their installation.', icon: 'Eye', ai: true },
  { step: 14, title: 'Risk Assessment', short: 'Score every risk S × O × D, rank it, and plan the mitigation.', icon: 'ShieldAlert', ai: true },
  { step: 15, title: 'Project Plan', short: 'Schedule every action into a weekly plan, without stopping the plant twice.', icon: 'CalendarRange' },
];
export const modules = [
  { title: 'Sustainability Building', short: 'Track environmental & sustainability metrics', icon: 'Leaf' },
  { title: 'LFD Guidelines', short: 'Assess a facility against the 17 sections', icon: 'BookOpen' },
  { title: 'Process Flow Diagram', short: 'List steps in Excel; the flowchart draws itself', icon: 'GitBranch' },
  { title: 'LFD Activity Roadmap', short: 'Weekly schedule, activities and reviews', icon: 'CalendarRange' },
  { title: 'SOP', short: 'Step-by-step guides for every module', icon: 'ClipboardList' },
];
export const plan = { plan_id: 'plan-trial', name: 'Trial', price_inr: 0, max_users: 3, max_projects: 2, max_orgs: 50 };
const subscriptionRows = [
  { org_id: 'org-test', end_date: '2026-09-21', days_remaining: -36, users: 1 },
  { org_id: 'org-nordvik', end_date: '2026-10-11', days_remaining: -16, users: 1 },
  { org_id: 'org-kalinga', end_date: '2026-10-11', days_remaining: -16, users: 1 },
  { org_id: 'org-ashgrove', end_date: '2026-10-11', days_remaining: -16, users: 1 },
  { org_id: 'org-brw', end_date: '2026-10-15', days_remaining: -12, users: 2 },
  { org_id: 'org-shivamshree', end_date: '2026-10-31', days_remaining: 4, users: 2 },
  { org_id: 'org-sahyadri', end_date: '2026-11-08', days_remaining: 12, users: 0 },
  { org_id: 'org-narmada', end_date: '2026-11-08', days_remaining: 12, users: 0 },
  { org_id: 'org-kalinga-pvt', end_date: '2026-11-08', days_remaining: 12, users: 0 },
];
export const subscriptions = subscriptionRows.map((row, i) => {
  const org = organizations.find(o => o.org_id === row.org_id)!;
  return { subscription_id: 'subscription-' + i, org_id: org.org_id, org_name: org.name,
    plan_name: plan.name, effective_status: row.days_remaining > 0 ? 'active' : 'expired',
    end_date: row.end_date, days_remaining: row.days_remaining, payment_status: 'waived',
    usage: { users: { used: row.users, limit: plan.max_users }, projects: { used: org.project_count, limit: plan.max_projects } } };
});
export const subscriptionSummary = { active: 4, expiring: 4, expired: 5, mrr: 0 };
export const userSummary = {
  total: 6, internal: 3, client: 3, active: 6, inactive: 0, pending: 0,
  roles: [{ label: 'Super admins', count: 1, color: 'orange' }, { label: 'Admins', count: 2, color: 'blue' }, { label: 'Users', count: 3, color: 'green' }],
};
// Profile sample uses the application's real user field names.
export const users = [{ user_id: 'user-rohit', full_name: profile.full_name, email: '', global_role: 'super_admin', user_type: 'internal', status: 'active', position: 'Super Admin', orgs: [] }];


export const riskAssessment = {
  assessment_id: 'preview-assessment-01', name: 'Plant relocation · Phase 01',
  org_name: 'Sahyadri Auto Components Pvt. Ltd.', plant: 'Chakan MIDC, Pune',
  updated_at: '29 Oct 2026', reference_date: '2026-10-29', lead: 'Rohit Manvar',
};
export const riskNavigation = [
  { label: 'Overview', path: '/risk', icon: 'LayoutDashboard' },
  { label: 'Risk Register', path: '/risk/register', icon: 'ClipboardList', step: '01' },
  { label: 'Statutory Provision', path: '/risk/compliance', icon: 'ShieldCheck', step: '02' },
  { label: 'Scoring', path: '/risk/scoring', icon: 'SlidersHorizontal', step: '03' },
  { label: 'Prioritisation', path: '/risk/priority', icon: 'TrendingUp', step: '04' },
  { label: 'Mitigation Plan', path: '/risk/mitigation', icon: 'CalendarRange', step: '05' },
  { label: 'Report', path: '/risk/report', icon: 'BookOpen', step: '06' },
];
export const riskDescriptions: Record<string, string> = {
  '/risk': 'See the exposure. Set the priorities. Move forward with confidence.',
  '/risk/register': 'Identify what could go wrong, and give every risk a clear place in the register.',
  '/risk/compliance': 'Review facility provisions before moving into scoring.',
  '/risk/scoring': 'A shared language for severity, occurrence and detection.',
  '/risk/priority': 'Focus on the risks that need attention first.',
  '/risk/mitigation': 'Turn every priority into an action, an owner and a date.',
  '/risk/report': 'Bring the findings together for your next review.',
};
export const riskCategories = ['Process Risk', 'People Risk', 'Space Risk', 'Equipment Risk', 'Business Risk', 'Environment Risk'];
export type RiskBand = 'critical' | 'high' | 'medium' | 'low' | 'unscored';
export type RiskItem = {
  item_id: string; title: string; category: string; subcategory: string; area: string;
  severity: number | null; occurrence: number | null; detection: number | null;
  mitigation: string; owner: string; due_date: string; status: 'Open' | 'In progress' | 'Completed';
  residual_severity: number | null; residual_occurrence: number | null; residual_detection: number | null;
};
export const riskBands = { critical: 75, high: 45, medium: 20 };
export const riskBandLabels: Record<RiskBand, string> = { critical: 'Critical', high: 'High', medium: 'Medium', low: 'Low', unscored: 'Unscored' };
// Illustrative workshop records; no live assessment or operational decisions.
export const riskItems: RiskItem[] = [
  { item_id: 'R-001', title: 'Material handling delays', category: 'Process Risk', subcategory: 'Material Flow Risk', area: 'Assembly line', severity: 5, occurrence: 5, detection: 4, mitigation: 'Create a point-of-use supermarket and define a fixed replenishment route.', owner: 'Production lead', due_date: '2026-11-02', status: 'In progress', residual_severity: 5, residual_occurrence: 2, residual_detection: 2 },
  { item_id: 'R-002', title: 'Process capacity bottleneck', category: 'Process Risk', subcategory: 'Bottleneck Risk', area: 'Machining', severity: 5, occurrence: 4, detection: 4, mitigation: 'Balance work at the constraint and validate capacity against peak demand.', owner: 'Engineering lead', due_date: '2026-11-04', status: 'In progress', residual_severity: 5, residual_occurrence: 2, residual_detection: 2 },
  { item_id: 'R-003', title: 'Pedestrian and forklift interaction', category: 'People Risk', subcategory: 'Workplace Safety', area: 'Dispatch', severity: 5, occurrence: 3, detection: 5, mitigation: 'Separate the walking route and review crossing points before commissioning.', owner: 'EHS lead', due_date: '2026-11-01', status: 'Open', residual_severity: null, residual_occurrence: null, residual_detection: null },
  { item_id: 'R-004', title: 'Warehouse space constraints', category: 'Space Risk', subcategory: 'Storage Capacity', area: 'Raw material store', severity: 4, occurrence: 4, detection: 3, mitigation: 'Review racking, pallet heights and the storage layout.', owner: 'Warehouse lead', due_date: '2026-11-06', status: 'In progress', residual_severity: 4, residual_occurrence: 2, residual_detection: 2 },
  { item_id: 'R-005', title: 'Manual crate transfers', category: 'People Risk', subcategory: 'Manual Handling', area: 'Washing station', severity: 4, occurrence: 4, detection: 3, mitigation: 'Reposition the washing station and trial assisted handling.', owner: 'Production lead', due_date: '2026-11-07', status: 'Open', residual_severity: null, residual_occurrence: null, residual_detection: null },
  { item_id: 'R-006', title: 'Equipment downtime during relocation', category: 'Equipment Risk', subcategory: 'Maintenance', area: 'CNC cell', severity: 4, occurrence: 3, detection: 3, mitigation: 'Sequence the move with planned maintenance and verify spare availability.', owner: 'Maintenance lead', due_date: '2026-11-09', status: 'In progress', residual_severity: 4, residual_occurrence: 1, residual_detection: 2 },
  { item_id: 'R-007', title: 'FIFO sequence lost at staging', category: 'Process Risk', subcategory: 'Inventory & FIFO', area: 'WIP staging', severity: 3, occurrence: 3, detection: 3, mitigation: 'Mark FIFO lanes and introduce a daily staging check.', owner: 'Warehouse lead', due_date: '2026-10-28', status: 'Completed', residual_severity: 3, residual_occurrence: 1, residual_detection: 1 },
  { item_id: 'R-008', title: 'Training gaps on revised standard work', category: 'People Risk', subcategory: 'Skills & Training', area: 'Assembly line', severity: 3, occurrence: 2, detection: 3, mitigation: 'Run an operator walkthrough and verify revised standard work.', owner: 'Training lead', due_date: '2026-11-03', status: 'Open', residual_severity: null, residual_occurrence: null, residual_detection: null },
  { item_id: 'R-009', title: 'Outdated station identification', category: 'Process Risk', subcategory: 'Visual Controls', area: 'Finishing', severity: 2, occurrence: 2, detection: 2, mitigation: 'Replace station labels and update the area map.', owner: 'Quality lead', due_date: '2026-10-27', status: 'Completed', residual_severity: 2, residual_occurrence: 1, residual_detection: 1 },
  { item_id: 'R-010', title: 'Lighting at final inspection', category: 'Environment Risk', subcategory: 'Workplace Conditions', area: 'Quality lab', severity: null, occurrence: null, detection: null, mitigation: '', owner: '', due_date: '', status: 'Open', residual_severity: null, residual_occurrence: null, residual_detection: null },
];
export const riskScales = [
  { key: 'severity' as const, title: 'Severity', question: 'If this happens, how bad is it?', labels: ['Negligible', 'Minor', 'Moderate', 'Major', 'Critical'] },
  { key: 'occurrence' as const, title: 'Occurrence', question: 'How likely is it to happen?', labels: ['Remote', 'Unlikely', 'Occasional', 'Likely', 'Frequent'] },
  { key: 'detection' as const, title: 'Detection', question: 'Will we catch it before the impact?', labels: ['Certain', 'High', 'Moderate', 'Low', 'None'] },
];
export const provisionSamples = [
  { title: 'Fire protection', icon: 'ShieldAlert', area: 'Production & warehouse', observed: 8, planned: 10, note: 'Confirm coverage and locations with the facility reviewer.' },
  { title: 'First aid', icon: 'Plus', area: 'Production & administration', observed: 3, planned: 3, note: 'Review accessibility, supplies and assigned responders.' },
  { title: 'Emergency exits', icon: 'ArrowUpRight', area: 'All occupied areas', observed: 4, planned: 4, note: 'Walk the routes and confirm clear access before handover.' },
  { title: 'Inspection lighting', icon: 'Eye', area: 'Quality lab', observed: 1, planned: 2, note: 'Record measurements at the proposed inspection stations.' },
];

export const ppqStudy = {
  study_id: 'PPQ-2026-01',
  name: 'Transmission & Drive Portfolio Profiling',
  org_name: 'Sahyadri Auto Components Pvt. Ltd.',
  plant: 'Chakan Plant · Line 02',
  period: 'FY 2025-26 Annualised',
  selected_family: 'F1 - Heavy Transmission Shafts',
};

export const ppqNavigation = [
  { label: 'Overview', path: '/ppq', icon: 'LayoutDashboard' },
  { label: 'Product Data', path: '/ppq/products', icon: 'Package', step: '01' },
  { label: 'Product Analysis', path: '/ppq/analysis', icon: 'SlidersHorizontal', step: '02' },
  { label: 'Pareto Analysis', path: '/ppq/pareto', icon: 'BarChart3', step: '03' },
  { label: 'Process Matrix', path: '/ppq/process-matrix', icon: 'Grid3X3', step: '04' },
];

export const ppqDescriptions: Record<string, string> = {
  '/ppq': 'Rank the portfolio, run dual-pareto analysis, and select candidate streams for VSM.',
  '/ppq/products': 'Build the product master — import production catalog or enter parts by hand.',
  '/ppq/analysis': 'Revenue and volume contribution, with each product ranked on both axes.',
  '/ppq/pareto': 'The 80/20 view — isolate the vital runners carrying volume and sales value.',
  '/ppq/process-matrix': 'Classic P-Q process routing matrix mapping parts against manufacturing operations.',
  '/ppq/families': 'Cluster products by process similarity and select the candidate stream to map in VSM.',
  '/ppq/report': 'Consolidated PPQ findings, executive summary, and direct handoff into Step 4 (VSM).',
};

export type ABCGrade = 'A' | 'B' | 'C';

export interface PPQProduct {
  code: string;
  name: string;
  family_id: string;
  family_name: string;
  annual_qty: number;
  unit_price: number;
  revenue: number;
  qty_rank: number;
  rev_rank: number;
  abc_qty: ABCGrade;
  abc_rev: ABCGrade;
  route: string[];
}

export interface PPQFamily {
  id: string;
  name: string;
  code: string;
  products_count: number;
  total_qty: number;
  total_revenue: number;
  qty_pct: number;
  rev_pct: number;
  process_count: number;
  selected_for_vsm: boolean;
  rationale: string;
}

export const ppqProcesses = [
  'Cutting',
  'Forging',
  'CNC Turning',
  'Milling',
  'Heat Treat',
  'Grinding',
  'Gear Hobbing',
  'Washing',
  'Final QA',
  'Packing',
];

export const ppqProducts: PPQProduct[] = [
  { code: 'P-101', name: 'Main Input Shaft 24T', family_id: 'F1', family_name: 'Heavy Transmission Shafts', annual_qty: 65000, unit_price: 1850, revenue: 120250000, qty_rank: 1, rev_rank: 1, abc_qty: 'A', abc_rev: 'A', route: ['Cutting', 'CNC Turning', 'Heat Treat', 'Grinding', 'Washing', 'Final QA', 'Packing'] },
  { code: 'P-102', name: 'Counter Shaft Drive 30T', family_id: 'F1', family_name: 'Heavy Transmission Shafts', annual_qty: 52000, unit_price: 1650, revenue: 85800000, qty_rank: 2, rev_rank: 4, abc_qty: 'A', abc_rev: 'A', route: ['Cutting', 'CNC Turning', 'Heat Treat', 'Grinding', 'Washing', 'Final QA', 'Packing'] },
  { code: 'P-103', name: 'Spur Gear Intermediate', family_id: 'F2', family_name: 'Spur & Bevel Gears', annual_qty: 48000, unit_price: 2200, revenue: 105600000, qty_rank: 3, rev_rank: 2, abc_qty: 'A', abc_rev: 'A', route: ['Forging', 'CNC Turning', 'Gear Hobbing', 'Heat Treat', 'Grinding', 'Washing', 'Final QA', 'Packing'] },
  { code: 'P-104', name: 'Output Helical Gear 42T', family_id: 'F2', family_name: 'Spur & Bevel Gears', annual_qty: 38000, unit_price: 2600, revenue: 98800000, qty_rank: 4, rev_rank: 3, abc_qty: 'A', abc_rev: 'A', route: ['Forging', 'CNC Turning', 'Gear Hobbing', 'Heat Treat', 'Grinding', 'Washing', 'Final QA', 'Packing'] },
  { code: 'P-105', name: 'Spline Coupling Sleeve', family_id: 'F1', family_name: 'Heavy Transmission Shafts', annual_qty: 30000, unit_price: 950, revenue: 28500000, qty_rank: 5, rev_rank: 7, abc_qty: 'B', abc_rev: 'B', route: ['Cutting', 'CNC Turning', 'Milling', 'Washing', 'Final QA', 'Packing'] },
  { code: 'P-106', name: 'Differential Pinion Gear', family_id: 'F2', family_name: 'Spur & Bevel Gears', annual_qty: 26000, unit_price: 3100, revenue: 80600000, qty_rank: 6, rev_rank: 5, abc_qty: 'B', abc_rev: 'A', route: ['Forging', 'CNC Turning', 'Gear Hobbing', 'Heat Treat', 'Grinding', 'Final QA', 'Packing'] },
  { code: 'P-107', name: 'Drive Flange Adaptor', family_id: 'F3', family_name: 'Flanges & Adaptors', annual_qty: 22000, unit_price: 1400, revenue: 30800000, qty_rank: 7, rev_rank: 6, abc_qty: 'B', abc_rev: 'B', route: ['Cutting', 'CNC Turning', 'Milling', 'Final QA', 'Packing'] },
  { code: 'P-108', name: 'Reverse Idler Gear 18T', family_id: 'F2', family_name: 'Spur & Bevel Gears', annual_qty: 18000, unit_price: 1750, revenue: 31500000, qty_rank: 8, rev_rank: 8, abc_qty: 'B', abc_rev: 'B', route: ['Forging', 'CNC Turning', 'Gear Hobbing', 'Heat Treat', 'Washing', 'Final QA', 'Packing'] },
  { code: 'P-109', name: 'Bearing Retainer Flange', family_id: 'F3', family_name: 'Flanges & Adaptors', annual_qty: 14000, unit_price: 820, revenue: 11480000, qty_rank: 9, rev_rank: 10, abc_qty: 'C', abc_rev: 'C', route: ['Cutting', 'CNC Turning', 'Milling', 'Washing', 'Packing'] },
  { code: 'P-110', name: 'Synchronizer Hub Ring', family_id: 'F1', family_name: 'Heavy Transmission Shafts', annual_qty: 11000, unit_price: 1900, revenue: 20900000, qty_rank: 10, rev_rank: 9, abc_qty: 'C', abc_rev: 'B', route: ['Cutting', 'CNC Turning', 'Heat Treat', 'Grinding', 'Washing', 'Final QA', 'Packing'] },
  { code: 'P-111', name: 'Selector Fork Bush', family_id: 'F3', family_name: 'Flanges & Adaptors', annual_qty: 7500, unit_price: 640, revenue: 4800000, qty_rank: 11, rev_rank: 12, abc_qty: 'C', abc_rev: 'C', route: ['Cutting', 'CNC Turning', 'Washing', 'Packing'] },
  { code: 'P-112', name: 'Custom Stub Axle Pin', family_id: 'F1', family_name: 'Heavy Transmission Shafts', annual_qty: 4200, unit_price: 2800, revenue: 11760000, qty_rank: 12, rev_rank: 11, abc_qty: 'C', abc_rev: 'C', route: ['Cutting', 'CNC Turning', 'Heat Treat', 'Grinding', 'Packing'] },
];

export const ppqFamilies: PPQFamily[] = [
  {
    id: 'F1',
    code: 'FAM-01',
    name: 'Heavy Transmission Shafts',
    products_count: 5,
    total_qty: 162200,
    total_revenue: 268210000,
    qty_pct: 48.3,
    rev_pct: 42.6,
    process_count: 6,
    selected_for_vsm: true,
    rationale: 'Carries highest collective volume (48%) and shares identical cell flow across CNC Turning, Heat Treat, and Cylindrical Grinding. Primary candidate for Step 4 value stream mapping.',
  },
  {
    id: 'F2',
    code: 'FAM-02',
    name: 'Spur & Bevel Transmission Gears',
    products_count: 4,
    total_qty: 130000,
    total_revenue: 316500000,
    qty_pct: 38.7,
    rev_pct: 50.3,
    process_count: 7,
    selected_for_vsm: false,
    rationale: 'Generates 50.3% of revenue, but gear hobbing cycle times and forging lead times require a dedicated secondary mapping phase.',
  },
  {
    id: 'F3',
    code: 'FAM-03',
    name: 'Flanges, Adaptors & Retainers',
    products_count: 3,
    total_qty: 43500,
    total_revenue: 47080000,
    qty_pct: 13.0,
    rev_pct: 7.1,
    process_count: 4,
    selected_for_vsm: false,
    rationale: 'Low complexity, secondary machining line without bottleneck equipment.',
  },
];

export const vsiNavigation = [
  { label: 'Overview', path: '/vsi', icon: 'LayoutDashboard' },
  { label: 'VSM Grouping', path: '/vsi/grouping', icon: 'Layers', step: '01' },
  { label: 'AI Suggested Streams', path: '/vsi/suggestions', icon: 'Sparkles', step: '02' },
  { label: 'Handoff & Charter', path: '/vsi/report', icon: 'BookOpen', step: '03' },
];

export const vsiDescriptions: Record<string, string> = {
  '/vsi': 'Identify natural product families, verify readiness, and select the anchor value stream for VSM.',
  '/vsi/grouping': 'Cluster products by routing similarity using Jaccard matrix algorithm with adjustable threshold.',
  '/vsi/suggestions': 'AI-assisted stream candidate evaluation comparing throughput, flow cleanliness, and bottlenecks.',
  '/vsi/report': 'Official Value Stream Charter, takt pace calculations, and direct handoff to Step 4 (VSM).',
};

export interface VSIStream {
  id: string;
  code: string;
  name: string;
  cohesion_pct: number;
  products_count: number;
  annual_qty: number;
  annual_revenue: number;
  qty_pct: number;
  rev_pct: number;
  takt_seconds: number;
  daily_demand: number;
  shared_route: string[];
  all_route: string[];
  selected_for_vsm: boolean;
  verdict: 'Strong Anchor Candidate' | 'Phase 2 Stream' | 'Kanban Loop';
  tradeoff: string;
  products: { code: string; name: string; qty: number; route: string[] }[];
}

export const vsiStreams: VSIStream[] = [
  {
    id: 'VSM-01',
    code: 'VSM-01',
    name: 'Heavy Transmission Shafts',
    cohesion_pct: 94,
    products_count: 5,
    annual_qty: 162200,
    annual_revenue: 268210000,
    qty_pct: 48.3,
    rev_pct: 42.6,
    daily_demand: 648,
    takt_seconds: 74,
    shared_route: ['Cutting', 'CNC Turning', 'Heat Treat', 'Grinding', 'Final QA', 'Packing'],
    all_route: ['Cutting', 'CNC Turning', 'Milling', 'Heat Treat', 'Grinding', 'Washing', 'Final QA', 'Packing'],
    selected_for_vsm: true,
    verdict: 'Strong Anchor Candidate',
    tradeoff: 'Highest collective volume (48%) and shares 6 continuous processes without touching Gear Hobbing.',
    products: [
      { code: 'P-101', name: 'Main Input Shaft 24T', qty: 65000, route: ['Cutting', 'CNC Turning', 'Heat Treat', 'Grinding', 'Washing', 'Final QA', 'Packing'] },
      { code: 'P-102', name: 'Counter Shaft Drive 30T', qty: 52000, route: ['Cutting', 'CNC Turning', 'Heat Treat', 'Grinding', 'Washing', 'Final QA', 'Packing'] },
      { code: 'P-105', name: 'Spline Coupling Sleeve', qty: 30000, route: ['Cutting', 'CNC Turning', 'Milling', 'Washing', 'Final QA', 'Packing'] },
      { code: 'P-110', name: 'Synchronizer Hub Ring', qty: 11000, route: ['Cutting', 'CNC Turning', 'Heat Treat', 'Grinding', 'Washing', 'Final QA', 'Packing'] },
      { code: 'P-112', name: 'Custom Stub Axle Pin', qty: 4200, route: ['Cutting', 'CNC Turning', 'Heat Treat', 'Grinding', 'Packing'] },
    ],
  },
  {
    id: 'VSM-02',
    code: 'VSM-02',
    name: 'Spur & Bevel Transmission Gears',
    cohesion_pct: 88,
    products_count: 4,
    annual_qty: 130000,
    annual_revenue: 316500000,
    qty_pct: 38.7,
    rev_pct: 50.3,
    daily_demand: 520,
    takt_seconds: 92,
    shared_route: ['Forging', 'CNC Turning', 'Gear Hobbing', 'Heat Treat', 'Final QA', 'Packing'],
    all_route: ['Forging', 'CNC Turning', 'Gear Hobbing', 'Heat Treat', 'Grinding', 'Washing', 'Final QA', 'Packing'],
    selected_for_vsm: false,
    verdict: 'Phase 2 Stream',
    tradeoff: 'Generates 50.3% revenue, but long gear hobbing cycle times recommend sequencing after VSM-01 cell stabilisation.',
    products: [
      { code: 'P-103', name: 'Spur Gear Intermediate', qty: 48000, route: ['Forging', 'CNC Turning', 'Gear Hobbing', 'Heat Treat', 'Grinding', 'Washing', 'Final QA', 'Packing'] },
      { code: 'P-104', name: 'Output Helical Gear 42T', qty: 38000, route: ['Forging', 'CNC Turning', 'Gear Hobbing', 'Heat Treat', 'Grinding', 'Washing', 'Final QA', 'Packing'] },
      { code: 'P-106', name: 'Differential Pinion Gear', qty: 26000, route: ['Forging', 'CNC Turning', 'Gear Hobbing', 'Heat Treat', 'Grinding', 'Final QA', 'Packing'] },
      { code: 'P-108', name: 'Reverse Idler Gear 18T', qty: 18000, route: ['Forging', 'CNC Turning', 'Gear Hobbing', 'Heat Treat', 'Washing', 'Final QA', 'Packing'] },
    ],
  },
  {
    id: 'VSM-03',
    code: 'VSM-03',
    name: 'Flanges, Adaptors & Retainers',
    cohesion_pct: 91,
    products_count: 3,
    annual_qty: 43500,
    annual_revenue: 47080000,
    qty_pct: 13.0,
    rev_pct: 7.1,
    daily_demand: 174,
    takt_seconds: 275,
    shared_route: ['Cutting', 'CNC Turning', 'Packing'],
    all_route: ['Cutting', 'CNC Turning', 'Milling', 'Washing', 'Final QA', 'Packing'],
    selected_for_vsm: false,
    verdict: 'Kanban Loop',
    tradeoff: 'Low technical complexity. Best managed through replenishment pull loop rather than complex dedicated VSM.',
    products: [
      { code: 'P-107', name: 'Drive Flange Adaptor', qty: 22000, route: ['Cutting', 'CNC Turning', 'Milling', 'Final QA', 'Packing'] },
      { code: 'P-109', name: 'Bearing Retainer Flange', qty: 14000, route: ['Cutting', 'CNC Turning', 'Milling', 'Washing', 'Packing'] },
      { code: 'P-111', name: 'Selector Fork Bush', qty: 7500, route: ['Cutting', 'CNC Turning', 'Washing', 'Packing'] },
    ],
  },
];

/* ─────────────────────────────────────────────────────────────────────────────
   STEP 06 · CAPACITY PLANNING & RAMP-UP (OLIVE #4D7C0F)
   ───────────────────────────────────────────────────────────────────────────── */
export const capacityNavigation = [
  { label: 'Overview', path: '/capacity', icon: 'LayoutDashboard' },
  { label: 'Operations & Takt', path: '/capacity/operations', icon: 'Cog', step: '01' },
  { label: 'Capacity Calculation', path: '/capacity/calculation', icon: 'TrendingUp', step: '02' },
  { label: 'Ramp-Up Plan', path: '/capacity/report', icon: 'FileText', step: '03' },
];

export const capacityDescriptions: Record<string, string> = {
  '/capacity': 'Rate every machine against demand, identify the system bottleneck, and schedule phased ramp-up.',
  '/capacity/operations': 'Operation-by-operation cycle time, machine models, available hours, and shift schedules.',
  '/capacity/calculation': 'Utilization rates, equipment capacity limits, and machines required to meet future demand.',
  '/capacity/report': 'Phased 3-year capacity ramp-up plan, constraint debottlenecking, and capex requirement.',
};

export interface CapacityOperation {
  id: string;
  operationName: string;
  machineModel: string;
  availableMachines: number;
  cycleTimeSec: number;
  shiftsPerDay: number;
  hoursPerDay: number;
  monthlyDemand: number;
  capacityUnits: number;
  utilizationPct: number;
  isBottleneck: boolean;
  requiredMachines: number;
}

export const capacityOperations: CapacityOperation[] = [
  { id: 'COP-01', operationName: 'CNC Turning Rough & Finish', machineModel: 'Okuma LB3000 EX II', availableMachines: 12, cycleTimeSec: 142, shiftsPerDay: 2, hoursPerDay: 16, monthlyDemand: 48000, capacityUnits: 50400, utilizationPct: 95, isBottleneck: false, requiredMachines: 12 },
  { id: 'COP-02', operationName: 'Heavy Gear Hobbing', machineModel: 'Gleason Phoenix 280G', availableMachines: 6, cycleTimeSec: 310, shiftsPerDay: 2, hoursPerDay: 16, monthlyDemand: 28000, capacityUnits: 24500, utilizationPct: 114, isBottleneck: true, requiredMachines: 8 },
  { id: 'COP-03', operationName: 'Induction Hardening Heat Treat', machineModel: 'Inductoheat 200kW Dual-Spindle', availableMachines: 4, cycleTimeSec: 95, shiftsPerDay: 2, hoursPerDay: 16, monthlyDemand: 52000, capacityUnits: 59000, utilizationPct: 88, isBottleneck: false, requiredMachines: 4 },
  { id: 'COP-04', operationName: 'Cylindrical CNC Grinding', machineModel: 'Studer S33 Universal', availableMachines: 5, cycleTimeSec: 180, shiftsPerDay: 2, hoursPerDay: 16, monthlyDemand: 36000, capacityUnits: 39200, utilizationPct: 92, isBottleneck: false, requiredMachines: 5 },
  { id: 'COP-05', operationName: 'Spline Cold Rolling', machineModel: 'Grob ZR400 Precision', availableMachines: 2, cycleTimeSec: 45, shiftsPerDay: 2, hoursPerDay: 16, monthlyDemand: 48000, capacityUnits: 74000, utilizationPct: 65, isBottleneck: false, requiredMachines: 2 },
  { id: 'COP-06', operationName: 'Industrial Ultrasonic Washing', machineModel: 'Dürr Ecoclean Universal', availableMachines: 2, cycleTimeSec: 60, shiftsPerDay: 2, hoursPerDay: 16, monthlyDemand: 52000, capacityUnits: 70000, utilizationPct: 74, isBottleneck: false, requiredMachines: 2 },
  { id: 'COP-07', operationName: 'Assembly & Poka-Yoke Testing', machineModel: 'U-Cell Torque Angle Benches', availableMachines: 8, cycleTimeSec: 120, shiftsPerDay: 2, hoursPerDay: 16, monthlyDemand: 48000, capacityUnits: 58500, utilizationPct: 82, isBottleneck: false, requiredMachines: 8 },
];

/* ─────────────────────────────────────────────────────────────────────────────
   STEP 07 · EQUIPMENT PLANNING GUIDELINES (STEEL SLATE #44546A)
   ───────────────────────────────────────────────────────────────────────────── */
export const equipmentNavigation = [
  { label: 'Overview', path: '/equipment', icon: 'LayoutDashboard' },
  { label: 'Equipment Register', path: '/equipment/register', icon: 'Cog', step: '01' },
  { label: 'Selection Plan', path: '/equipment/plan', icon: 'ShieldCheck', step: '02' },
  { label: 'Investment Report', path: '/equipment/report', icon: 'FileText', step: '03' },
];

export const equipmentDescriptions: Record<string, string> = {
  '/equipment': 'Keep, upgrade, or replace every machine — and price the capital investment needed for future volume.',
  '/equipment/register': 'Asset register: Machine models, age, current quantities, and future state requirements.',
  '/equipment/plan': 'Decision matrix: Keep, upgrade, replace, or buy new to support Step 06 capacity.',
  '/equipment/report': 'Consolidated equipment budget, quotation estimates, vendor lead times, and executive approval.',
};

export interface EquipmentPlanItem {
  id: string;
  machineType: string;
  category: string;
  currentQty: number;
  futureNeededQty: number;
  decision: 'Keep (Retain)' | 'Upgrade (Retrofit)' | 'Replace (New Buy)' | 'Procure Additional';
  unitCostLakhs: number;
  totalCapexLakhs: number;
  remarks: string;
  status: 'Approved' | 'In Evaluation';
}

export const equipmentPlanItems: EquipmentPlanItem[] = [
  { id: 'EQ-01', machineType: 'CNC Turning Centers (Okuma LB3000)', category: 'Primary Machining', currentQty: 12, futureNeededQty: 14, decision: 'Procure Additional', unitCostLakhs: 42.0, totalCapexLakhs: 84.0, remarks: 'Add 2 units to support VSM-01 volume ramp-up without second-shift overtime.', status: 'Approved' },
  { id: 'EQ-02', machineType: 'CNC Gear Hobbing (Gleason 280G)', category: 'Primary Machining', currentQty: 6, futureNeededQty: 8, decision: 'Procure Additional', unitCostLakhs: 65.0, totalCapexLakhs: 130.0, remarks: 'Relieves Step 06 OP-02 constraint (114% utilization bottleneck).', status: 'Approved' },
  { id: 'EQ-03', machineType: 'Induction Hardening Stations', category: 'Heat Treatment', currentQty: 4, futureNeededQty: 4, decision: 'Upgrade (Retrofit)', unitCostLakhs: 6.5, totalCapexLakhs: 26.0, remarks: 'Retrofit optical pyrometer closed-loop temperature control & dual-coil fixtures.', status: 'Approved' },
  { id: 'EQ-04', machineType: 'Cylindrical Grinders (Studer S33)', category: 'Finishing', currentQty: 5, futureNeededQty: 5, decision: 'Keep (Retain)', unitCostLakhs: 0.0, totalCapexLakhs: 0.0, remarks: 'Current precision capability within ±3µm; adequate capacity through 2028.', status: 'Approved' },
  { id: 'EQ-05', machineType: 'Zeiss CNC CMM Metrology Scanner', category: 'Quality QA', currentQty: 1, futureNeededQty: 2, decision: 'Procure Additional', unitCostLakhs: 55.0, totalCapexLakhs: 55.0, remarks: 'Dedicated in-bay metrology unit to eliminate 45-min transport to central QC lab.', status: 'Approved' },
  { id: 'EQ-06', machineType: 'Tool Room Milling Machine', category: 'Tooling & Maintenance', currentQty: 2, futureNeededQty: 1, decision: 'Replace (New Buy)', unitCostLakhs: 72.0, totalCapexLakhs: 72.0, remarks: 'Replace 2 legacy manual knee mills with single 5-axis DMG MORI machining center.', status: 'In Evaluation' },
];

/* ─────────────────────────────────────────────────────────────────────────────
   STEP 08 · MANPOWER REQUIREMENT PLANNING (MAGENTA #A21CAF)
   ───────────────────────────────────────────────────────────────────────────── */
export const manpowerNavigation = [
  { label: 'Overview', path: '/manpower', icon: 'LayoutDashboard' },
  { label: 'Deployment Matrix', path: '/manpower/deployment', icon: 'Users', step: '01' },
  { label: 'Productivity Comparison', path: '/manpower/productivity', icon: 'TrendingUp', step: '02' },
  { label: 'Staffing Report', path: '/manpower/report', icon: 'FileText', step: '03' },
];

export const manpowerDescriptions: Record<string, string> = {
  '/manpower': 'Right-size workforce deployment, calculate output per person, and eliminate non-value added staffing.',
  '/manpower/deployment': 'Departmental headcount: Current staffing versus lean future state across all shifts.',
  '/manpower/productivity': 'Output per person comparisons: Current output per operator against lean cell productivity.',
  '/manpower/report': 'Executive staffing plan, redeployment schedules, and annual payroll cost savings.',
};

export interface ManpowerDept {
  id: string;
  department: string;
  shiftPattern: string;
  currentHeadcount: number;
  proposedHeadcount: number;
  netVariance: number;
  outputPerPersonCurrent: number;
  outputPerPersonProposed: number;
  productivityGainPct: number;
  annualSavingsLakhs: number;
}

export const manpowerDepartments: ManpowerDept[] = [
  { id: 'MP-01', department: 'CNC Machining & Turning Cell', shiftPattern: '2 Shifts (8h)', currentHeadcount: 28, proposedHeadcount: 20, netVariance: -8, outputPerPersonCurrent: 38, outputPerPersonProposed: 65, productivityGainPct: 71, annualSavingsLakhs: 38.4 },
  { id: 'MP-02', department: 'Gear Hobbing & Shaping Cell', shiftPattern: '2 Shifts (8h)', currentHeadcount: 14, proposedHeadcount: 12, netVariance: -2, outputPerPersonCurrent: 42, outputPerPersonProposed: 58, productivityGainPct: 38, annualSavingsLakhs: 9.6 },
  { id: 'MP-03', department: 'Heat Treatment & Hardening', shiftPattern: '2 Shifts (8h)', currentHeadcount: 10, proposedHeadcount: 8, netVariance: -2, outputPerPersonCurrent: 65, outputPerPersonProposed: 90, productivityGainPct: 38, annualSavingsLakhs: 9.6 },
  { id: 'MP-04', department: 'Assembly & Testing U-Cells', shiftPattern: '2 Shifts (8h)', currentHeadcount: 24, proposedHeadcount: 16, netVariance: -8, outputPerPersonCurrent: 45, outputPerPersonProposed: 78, productivityGainPct: 73, annualSavingsLakhs: 38.4 },
  { id: 'MP-05', department: 'Quality Assurance & PDI Inspection', shiftPattern: '2 Shifts (8h)', currentHeadcount: 8, proposedHeadcount: 8, netVariance: 0, outputPerPersonCurrent: 120, outputPerPersonProposed: 145, productivityGainPct: 21, annualSavingsLakhs: 0.0 },
  { id: 'MP-06', department: 'Internal Logistics & Supermarkets', shiftPattern: '2 Shifts (8h)', currentHeadcount: 12, proposedHeadcount: 6, netVariance: -6, outputPerPersonCurrent: 85, outputPerPersonProposed: 180, productivityGainPct: 112, annualSavingsLakhs: 28.8 },
];

export const supplyNavigation = [
  { label: 'Overview & Network', path: '/supply-chain', icon: 'LayoutDashboard' },
  { label: 'Inventory & PFEP', path: '/supply-chain/inventory', icon: 'Boxes', step: '01' },
  { label: 'Supplier Ratings', path: '/supply-chain/suppliers', icon: 'Network', step: '02' },
  { label: 'Kaizen Sheets', path: '/supply-chain/kaizens', icon: 'Sparkles', step: '03' },
  { label: 'Executive Report', path: '/supply-chain/report', icon: 'FileText', step: '04' },
];

export const supplyDescriptions: Record<string, string> = {
  '/supply-chain': 'End-to-end supply chain architecture, SIOP alignment, and 5-stage tier flow from supplier to customer.',
  '/supply-chain/inventory': 'Plan for Every Part (PFEP): Runners/Repeaters/Strangers segmentation, safety buffer calculation, and reorder levels.',
  '/supply-chain/suppliers': 'Supplier Quality Rating (SQR): PPM defect rates, on-time in-full (OTIF) delivery, and corrective action scorecards.',
  '/supply-chain/kaizens': 'Supply Chain Kaizen sheets documenting Muda elimination, inventory reduction, and lead-time breakthroughs.',
  '/supply-chain/report': 'Consolidated supply chain master report with purchasing tactics, KPI benchmarks, and replenishment charter.',
};

export interface SupplyItem {
  id: string;
  code: string;
  name: string;
  supplier: string;
  classification: 'Runner' | 'Repeater' | 'Stranger' | 'Non-Moving';
  unitCost: number;
  monthlyUsage: number;
  currentStock: number;
  leadTimeDays: number;
  moq: number;
  reorderLevel: number;
  kanbanBins: number;
  health: 'Healthy' | 'Buffer Low' | 'Overstocked' | 'Excess Stock';
}

export const supplyInventoryItems: SupplyItem[] = [
  { id: 'ITM-01', code: 'RM-EN8-50', name: 'EN8 Carbon Steel Round Bar 50mm', supplier: 'Kalyani Steels Ltd.', classification: 'Runner', unitCost: 4200, monthlyUsage: 1450, currentStock: 980, leadTimeDays: 7, moq: 200, reorderLevel: 450, kanbanBins: 12, health: 'Healthy' },
  { id: 'ITM-02', code: 'RM-20MNCR5', name: '20MnCr5 Alloy Steel Forging Billets', supplier: 'Bharat Forge Ltd.', classification: 'Runner', unitCost: 6800, monthlyUsage: 920, currentStock: 710, leadTimeDays: 14, moq: 150, reorderLevel: 510, kanbanBins: 10, health: 'Healthy' },
  { id: 'ITM-03', code: 'BO-SKF-6205', name: 'SKF Deep Groove Ball Bearing 6205-2RS', supplier: 'SKF India Ltd.', classification: 'Runner', unitCost: 380, monthlyUsage: 2200, currentStock: 1400, leadTimeDays: 5, moq: 500, reorderLevel: 800, kanbanBins: 16, health: 'Healthy' },
  { id: 'ITM-04', code: 'BO-OILSEAL-35', name: 'NBR Rotary Shaft Oil Seal 35x52x8', supplier: 'Freudenberg NOK', classification: 'Repeater', unitCost: 145, monthlyUsage: 850, currentStock: 1600, leadTimeDays: 10, moq: 400, reorderLevel: 350, kanbanBins: 8, health: 'Overstocked' },
  { id: 'ITM-05', code: 'HD-CIRCLIP-25', name: 'Internal Retaining Circlip 25mm DIN 472', supplier: 'Suprajit Engineering', classification: 'Repeater', unitCost: 18, monthlyUsage: 3400, currentStock: 1100, leadTimeDays: 7, moq: 1000, reorderLevel: 1200, kanbanBins: 6, health: 'Buffer Low' },
  { id: 'ITM-06', code: 'CS-CAST-FLG', name: 'SG Iron Flange Casting Raw Blanks', supplier: 'Jayashree Castings', classification: 'Stranger', unitCost: 1250, monthlyUsage: 180, currentStock: 240, leadTimeDays: 21, moq: 100, reorderLevel: 150, kanbanBins: 4, health: 'Healthy' },
  { id: 'ITM-07', code: 'PK-BOX-T1', name: 'Heavy Duty 5-Ply Corrugated Export Carton', supplier: 'WIPRO Packaging', classification: 'Runner', unitCost: 85, monthlyUsage: 1200, currentStock: 800, leadTimeDays: 4, moq: 500, reorderLevel: 300, kanbanBins: 10, health: 'Healthy' },
  { id: 'ITM-08', code: 'RM-BRASS-B1', name: 'High Tensile Brass Bush Extruded Bar', supplier: 'Metals & Alloys Corp', classification: 'Non-Moving', unitCost: 890, monthlyUsage: 0, currentStock: 450, leadTimeDays: 30, moq: 100, reorderLevel: 0, kanbanBins: 0, health: 'Excess Stock' },
];

export interface SupplyVendor {
  id: string;
  name: string;
  category: string;
  annualSpend: string;
  qualityScore: number;
  deliveryScore: number;
  compositeRating: number;
  rejectionPpm: number;
  otifPct: number;
  tierStatus: 'Grade A (Preferred)' | 'Grade B (Approved)' | 'Grade C (Under Watch)';
  carActionCount: number;
}

export const supplySuppliers: SupplyVendor[] = [
  { id: 'SUP-01', name: 'Kalyani Steels Ltd.', category: 'Raw Material (Bar Stock)', annualSpend: '₹4.20 Cr', qualityScore: 98, deliveryScore: 96, compositeRating: 97, rejectionPpm: 240, otifPct: 98.4, tierStatus: 'Grade A (Preferred)', carActionCount: 0 },
  { id: 'SUP-02', name: 'Bharat Forge Ltd.', category: 'Raw Material (Billets)', annualSpend: '₹6.85 Cr', qualityScore: 95, deliveryScore: 94, compositeRating: 94.5, rejectionPpm: 480, otifPct: 95.8, tierStatus: 'Grade A (Preferred)', carActionCount: 1 },
  { id: 'SUP-03', name: 'SKF India Ltd.', category: 'Bought-out Parts (Bearings)', annualSpend: '₹1.15 Cr', qualityScore: 99, deliveryScore: 98, compositeRating: 98.5, rejectionPpm: 80, otifPct: 99.1, tierStatus: 'Grade A (Preferred)', carActionCount: 0 },
  { id: 'SUP-04', name: 'Freudenberg NOK', category: 'Bought-out Parts (Seals)', annualSpend: '₹0.48 Cr', qualityScore: 91, deliveryScore: 88, compositeRating: 89.5, rejectionPpm: 850, otifPct: 89.0, tierStatus: 'Grade B (Approved)', carActionCount: 2 },
  { id: 'SUP-05', name: 'Jayashree Castings', category: 'Subcontract (Foundry Blanks)', annualSpend: '₹0.85 Cr', qualityScore: 78, deliveryScore: 72, compositeRating: 75.0, rejectionPpm: 3200, otifPct: 76.5, tierStatus: 'Grade C (Under Watch)', carActionCount: 5 },
  { id: 'SUP-06', name: 'WIPRO Packaging', category: 'Consumables & Packaging', annualSpend: '₹0.32 Cr', qualityScore: 96, deliveryScore: 95, compositeRating: 95.5, rejectionPpm: 310, otifPct: 96.2, tierStatus: 'Grade A (Preferred)', carActionCount: 0 },
];

export interface SupplyKaizen {
  id: string;
  title: string;
  targetArea: string;
  wasteEliminated: string;
  beforeCondition: string;
  afterCondition: string;
  annualSavings: string;
  leadTimeReduction: string;
  status: 'Implemented' | 'In Progress' | 'Planned';
  champion: string;
}

export const supplyKaizens: SupplyKaizen[] = [
  { id: 'KZN-SC-01', title: 'Milk-run Logistics for Daily Fastener Replenishment', targetArea: 'Receiving & Hardware Store', wasteEliminated: 'Transport & Excess Inventory', beforeCondition: 'Vendors delivered large monthly batch deliveries resulting in ₹42L trapped inventory and floor congestion.', afterCondition: 'Instituted 2x weekly consolidated milk-run with returnable bins, slashing inventory from 30 days to 5 days.', annualSavings: '₹18.4 Lakhs', leadTimeReduction: '24 days → 3 days', status: 'Implemented', champion: 'P. Joshi (Logistics)' },
  { id: 'KZN-SC-02', title: 'Two-Bin Kanban Pull System at Shaft Cell Infeed', targetArea: 'Primary Machining (VSM-01)', wasteEliminated: 'Waiting & Overproduction', beforeCondition: 'Operators generated manual requisition slips daily when raw bars emptied, causing 45 min idle wait.', afterCondition: 'Automated 2-bin visual kanban where empty cart triggers supplier barcode scan and replenishment delivery.', annualSavings: '₹8.7 Lakhs', leadTimeReduction: '4.5 hrs → 15 mins', status: 'Implemented', champion: 'K. Verma (Machine Ops)' },
  { id: 'KZN-SC-03', title: 'Supplier Direct-to-Line (D2L) Quality Dock Bypass', targetArea: 'Raw Material Inward Inspection', wasteEliminated: 'Process & Motion Waste', beforeCondition: '100% of SKF bearings underwent 3-day receiving inspection hold in quarantine cage.', afterCondition: 'Certified supplier self-inspection quality agreement allowing bearings to go directly to assembly benches.', annualSavings: '₹12.2 Lakhs', leadTimeReduction: '3 days → 0 hrs', status: 'In Progress', champion: 'N. Patil (QA Lead)' },
];

export const visualNavigation = [
  { label: 'Overview & Assessment', path: '/visual', icon: 'LayoutDashboard' },
  { label: 'Visual Placement', path: '/visual/placement', icon: 'Layers', step: '01' },
  { label: 'Installation Plan', path: '/visual/deployment', icon: 'ClipboardList', step: '02' },
  { label: 'Evaluation Report', path: '/visual/report', icon: 'FileText', step: '03' },
];

export const visualDescriptions: Record<string, string> = {
  '/visual': '55-item visual implementation checksheet scored across the 8 standard manufacturing categories.',
  '/visual/placement': 'V1–V10 visual control placement on the plant layout with AI-assisted location coordinates.',
  '/visual/deployment': 'Actionable installation schedule and quotable signage vendor specifications for all missing controls.',
  '/visual/report': 'Category compliance summary, visual maturity scoring, and client-ready handoff to Step 15.',
};

export interface VisualCategoryScore {
  id: string;
  num: number;
  slug: string;
  title: string;
  total: number;
  present: number;
  missing: number;
  na: number;
  compliancePct: number;
  vCodes: string[];
}

export const visualCategories: VisualCategoryScore[] = [
  { id: 'CAT-1', num: 1, slug: 'organisation-standard', title: 'Organisation Standard', total: 6, present: 5, missing: 1, na: 0, compliancePct: 83, vCodes: ['V1', 'V2'] },
  { id: 'CAT-2', num: 2, slug: 'visitor-standard', title: 'Visitor Standard', total: 5, present: 3, missing: 2, na: 0, compliancePct: 60, vCodes: ['V4', 'V9'] },
  { id: 'CAT-3', num: 3, slug: 'cultural-standard', title: 'Cultural Standard', total: 5, present: 2, missing: 3, na: 0, compliancePct: 40, vCodes: ['V9', 'V10'] },
  { id: 'CAT-4', num: 4, slug: 'shop-floor-standard', title: 'Shop Floor Standard', total: 10, present: 7, missing: 3, na: 0, compliancePct: 70, vCodes: ['V5', 'V6', 'V7'] },
  { id: 'CAT-5', num: 5, slug: 'signs-direction', title: 'Signs & Direction Standard', total: 7, present: 5, missing: 2, na: 0, compliancePct: 71, vCodes: ['V4', 'V5'] },
  { id: 'CAT-6', num: 6, slug: 'material-standard', title: 'Material Standard', total: 8, present: 6, missing: 2, na: 0, compliancePct: 75, vCodes: ['V7', 'V8'] },
  { id: 'CAT-7', num: 7, slug: 'safety-standard', title: 'Safety Standard', total: 8, present: 7, missing: 1, na: 0, compliancePct: 88, vCodes: ['V3', 'V4'] },
  { id: 'CAT-8', num: 8, slug: 'workplace-standard', title: 'Workplace Standard', total: 6, present: 4, missing: 2, na: 0, compliancePct: 67, vCodes: ['V5', 'V7', 'V8'] },
];

export interface VisualCheckItem {
  id: string;
  categoryNum: number;
  categoryName: string;
  title: string;
  vCode: string;
  vCodeTitle: string;
  status: 'Present' | 'Missing' | 'Not Applicable';
  specKey: string;
  specLabel: string;
  targetLocation: string;
  notes: string;
}

export const visualCheckItems: VisualCheckItem[] = [
  { id: 'VM-01', categoryNum: 1, categoryName: 'Organisation Standard', title: 'Main factory gate corporate title board with logo & plant name', vCode: 'V1', vCodeTitle: 'Corporate Title Boards', status: 'Present', specKey: 'area-id', specLabel: '36" × 24" Vinyl on 4mm ACP', targetLocation: 'Main Plant Entrance', notes: 'Existing signage in good condition.' },
  { id: 'VM-02', categoryNum: 1, categoryName: 'Organisation Standard', title: 'Quality, Environmental & Safety Policy display at reception & shop entrance', vCode: 'V2', vCodeTitle: 'Policies & Instructions', status: 'Present', specKey: 'area-id', specLabel: '36" × 24" Vinyl on 4mm ACP', targetLocation: 'Main Lobby & Gangway', notes: 'Updated ISO 9001:2015 & 14001 policies mounted.' },
  { id: 'VM-03', categoryNum: 1, categoryName: 'Organisation Standard', title: 'Department hierarchy organization chart with passport photos', vCode: 'V2', vCodeTitle: 'Policies & Instructions', status: 'Missing', specKey: 'area-id', specLabel: '36" × 24" Vinyl on 4mm ACP', targetLocation: 'Operations Office Corridor', notes: 'Missing updated organogram board for Unit 2 team.' },

  { id: 'VM-04', categoryNum: 2, categoryName: 'Visitor Standard', title: 'Visitor PPE briefing board and mandatory safety footwear notice', vCode: 'V4', vCodeTitle: 'Signs & Directions', status: 'Present', specKey: 'area-id', specLabel: '36" × 24" Vinyl on 4mm ACP', targetLocation: 'Security Gate & Visitor Lounge', notes: 'Clear visual iconography for safety shoes & ear defenders.' },
  { id: 'VM-05', categoryNum: 2, categoryName: 'Visitor Standard', title: 'Plant layout tour map highlighting pedestrian safe walkway zones', vCode: 'V9', vCodeTitle: 'Display Posters', status: 'Missing', specKey: 'area-id', specLabel: '48" × 36" Acrylic Wall Board', targetLocation: 'Main Shop Floor Entrance', notes: 'Need illuminated plant overview layout showing customer tour path.' },

  { id: 'VM-06', categoryNum: 3, categoryName: 'Cultural Standard', title: 'Monthly Kaizen suggestion board with reward recognition photos', vCode: 'V9', vCodeTitle: 'Display Posters', status: 'Missing', specKey: 'area-id', specLabel: '48" × 36" Magnetic Whiteboard', targetLocation: 'Central Canteen & Rest Area', notes: 'Canteen board damaged; need standard magnetic Kaizen tree.' },
  { id: 'VM-07', categoryNum: 3, categoryName: 'Cultural Standard', title: 'Dedicated Obeya / Lean War Room visual project management gallery', vCode: 'V10', vCodeTitle: 'Obeya Room / Gallery', status: 'Missing', specKey: 'area-id', specLabel: 'Multi-panel Wall Display System', targetLocation: 'Conference Room 02 (New Obeya)', notes: 'Establish 4-wall Obeya for Step 15 rollout progress tracking.' },

  { id: 'VM-08', categoryNum: 4, categoryName: 'Shop Floor Standard', title: 'Suspended Area Identification boards (36" × 24") at 5m height', vCode: 'V5', vCodeTitle: 'Area Identification Boards', status: 'Missing', specKey: 'area-id', specLabel: '36" × 24" Vinyl on 4mm ACP', targetLocation: 'Bays A, B, C & D Ceilings', notes: 'Ceiling truss mounting required for CNC Machining and Heat Treat.' },
  { id: 'VM-09', categoryNum: 4, categoryName: 'Shop Floor Standard', title: 'Tier 1 Daily SQDCM monitoring boards at each production workcell', vCode: 'V6', vCodeTitle: 'Daily Monitoring Boards', status: 'Missing', specKey: 'area-id', specLabel: '48" × 36" Magnetic Dry-Erase Board', targetLocation: 'Shafts Cell, Gears Cell, Flanges Cell', notes: 'Daily standup boards with Safety, Quality, Delivery, Cost, Morale charts.' },
  { id: 'VM-10', categoryNum: 4, categoryName: 'Shop Floor Standard', title: 'Machine ID plates (24" × 18") with preventive maintenance schedule clip', vCode: 'V5', vCodeTitle: 'Area Identification Boards', status: 'Present', specKey: 'machine-id-large', specLabel: '24" × 18" Vinyl on 4mm ACP', targetLocation: 'CNC Turning & Hobbing Centers', notes: 'Machine codes OK; lubrication frequency tags updated.' },

  { id: 'VM-11', categoryNum: 5, categoryName: 'Signs & Direction Standard', title: 'Emergency evacuation directional signage with photoluminescent arrows', vCode: 'V4', vCodeTitle: 'Signs & Directions', status: 'Present', specKey: 'area-id', specLabel: 'Glow-in-the-dark Photoluminescent', targetLocation: 'All Main Aisles & Exit Doors', notes: 'Complies with fire safety clearance norms.' },
  { id: 'VM-12', categoryNum: 5, categoryName: 'Signs & Direction Standard', title: 'Forklift cross-traffic hazard warnings & convex mirror markers', vCode: 'V4', vCodeTitle: 'Signs & Directions', status: 'Missing', specKey: 'area-id', specLabel: '24" Diameter Reflective Hazard Disc', targetLocation: 'Intersection of Bay B and Central Dispatch', notes: 'Blind spot near warehouse aisle 3 needs dome mirror & caution sign.' },

  { id: 'VM-13', categoryNum: 6, categoryName: 'Material Standard', title: 'WIP buffer visual min/max floor tape boundaries and capacity indicators', vCode: 'V7', vCodeTitle: 'Tags & Labels', status: 'Missing', specKey: 'area-id', specLabel: 'ToughStripe Epoxy Floor Tape', targetLocation: 'Intermediate Supermarket (VSM-01)', notes: 'Floor markings needed for 24-bin maximum buffer limit.' },
  { id: 'VM-14', categoryNum: 6, categoryName: 'Material Standard', title: 'Raw material grade color-coding bar end painting standards', vCode: 'V8', vCodeTitle: 'Good Manufacturing Practice Products', status: 'Present', specKey: 'area-id', specLabel: 'Color Code Chart (Enamel Paint)', targetLocation: 'Raw Material Yard', notes: 'EN8 (Yellow), EN24 (Blue), EN353 (Red) paint codes active.' },

  { id: 'VM-15', categoryNum: 7, categoryName: 'Safety Standard', title: 'Fire extinguisher location indicators at 2.5m elevation with inspection tags', vCode: 'V3', vCodeTitle: 'Safety Compliance Standards', status: 'Present', specKey: 'area-id', specLabel: 'Reflective Red Indicator Sign', targetLocation: '18 Fire Points across Plant', notes: 'Monthly hydro-test tags current.' },
  { id: 'VM-16', categoryNum: 7, categoryName: 'Safety Standard', title: 'High voltage electrical panel danger signage & arc flash boundary lines', vCode: 'V3', vCodeTitle: 'Safety Compliance Standards', status: 'Present', specKey: 'area-id', specLabel: 'Polycarbonate Hazard Warning', targetLocation: 'Sub-station & Distribution Boards', notes: 'Rubber matting & arc flash warning labels in place.' },

  { id: 'VM-17', categoryNum: 8, categoryName: 'Workplace Standard', title: 'Tool shadow boards with silhouette outlines for 5S hand tools', vCode: 'V8', vCodeTitle: 'Good Manufacturing Practice Products', status: 'Missing', specKey: 'machine-id-large', specLabel: 'Perforated Tool Board with Shadow Vinyl', targetLocation: 'Machine Maintenance & Setup Trolleys', notes: 'Mechanics currently keeping loose toolboxes; convert to shadow boards.' },
  { id: 'VM-18', categoryNum: 8, categoryName: 'Workplace Standard', title: 'Gauges and calibration status color stickers (Green=Valid, Red=Due)', vCode: 'V7', vCodeTitle: 'Tags & Labels', status: 'Present', specKey: 'area-id', specLabel: 'Tamper-evident Calibration Labels', targetLocation: 'Micrometers, Verniers, Bore Gauges', notes: 'Managed by QA calibration lab.' },
];

export interface VisualPlacement {
  id: string;
  vCode: string;
  codeTitle: string;
  zone: string;
  itemTitle: string;
  spec: string;
  mountingHeight: string;
  quantity: number;
  status: 'Placed' | 'Pending Installation' | 'Installed';
  estimatedCost: string;
}

export const visualPlacements: VisualPlacement[] = [
  { id: 'PL-01', vCode: 'V1', codeTitle: 'Corporate Title Boards', zone: 'Plant Gate', itemTitle: 'Main Facility Entrance Title Board', spec: '72" × 36" ACP with 3D Acrylic Letters', mountingHeight: '4.5 m', quantity: 1, status: 'Installed', estimatedCost: '₹35,000' },
  { id: 'PL-02', vCode: 'V5', codeTitle: 'Area Identification Boards', zone: 'Machining Bay', itemTitle: 'CNC Turning & Gear Hobbing Bay Identification', spec: '36" × 24" Vinyl print on 4mm ACP', mountingHeight: '5.0 m from truss', quantity: 4, status: 'Pending Installation', estimatedCost: '₹14,000' },
  { id: 'PL-03', vCode: 'V6', codeTitle: 'Daily Monitoring Boards', zone: 'Production Cells', itemTitle: 'Tier 1 SQDCM Standup Boards', spec: '48" × 36" Magnetic Dry-Erase Whiteboard', mountingHeight: '1.4 m eye-level', quantity: 3, status: 'Pending Installation', estimatedCost: '₹18,500' },
  { id: 'PL-04', vCode: 'V8', codeTitle: 'Good Manufacturing Practice Products', zone: 'Workcells', itemTitle: 'Standard 5S Tool Shadow Boards', spec: 'Perforated ACP Board with Tool Cutouts', mountingHeight: '1.2 m at machine flank', quantity: 6, status: 'Pending Installation', estimatedCost: '₹22,000' },
  { id: 'PL-05', vCode: 'V4', codeTitle: 'Signs & Directions', zone: 'Crossroads', itemTitle: 'Forklift Safety Dome Mirror & Speed Limit Signs', spec: '600mm Convex Mirror + 18" Refl. Sign', mountingHeight: '3.0 m on building column', quantity: 2, status: 'Pending Installation', estimatedCost: '₹9,800' },
  { id: 'PL-06', vCode: 'V10', codeTitle: 'Obeya Room / Gallery', zone: 'War Room', itemTitle: 'Obeya Project Management Wall Modular System', spec: 'Full Room Magnetic Vinyl Wall System (4 Walls)', mountingHeight: 'Floor to 2.4 m', quantity: 1, status: 'Pending Installation', estimatedCost: '₹65,000' },
  { id: 'PL-07', vCode: 'V7', codeTitle: 'Tags & Labels', zone: 'Supermarket', itemTitle: 'FIFO Flow Lane Capacity Markers & Kanban Holders', spec: 'Heavy Duty PVC Floor Markers & Acrylic Sleeves', mountingHeight: 'Floor & Shelf lip', quantity: 28, status: 'Pending Installation', estimatedCost: '₹12,400' },
];

export const projectNavigation = [
  { label: 'Overview', path: '/project-plan', icon: 'LayoutDashboard' },
  { label: 'Timeline & Phases', path: '/project-plan/phases', icon: 'CalendarRange', step: '01' },
  { label: 'Actions & Mitigations', path: '/project-plan/actions', icon: 'ClipboardList', step: '02' },
  { label: 'Rollout Report', path: '/project-plan/report', icon: 'FileText', step: '03' },
];

export const projectDescriptions: Record<string, string> = {
  '/project-plan': 'Executive rollout dashboard, phased milestones, production continuity rules, and gate checklists.',
  '/project-plan/phases': 'Client-facing 8-month timeline chart detailing department sequence, activities, and duration ranges.',
  '/project-plan/actions': 'Mitigation register from Risk Assessment (Step 14) and improvements from VSM (Step 04) mapped to phases.',
  '/project-plan/report': 'Formal plant relocation & expansion recommendation report ready for executive sign-off.',
};

export interface ProjectPlanInfo {
  id: string;
  name: string;
  facility: string;
  orgName: string;
  startDate: string;
  targetDate: string;
  totalMonths: number;
  totalWeeks: number;
  totalPhases: number;
  totalActions: number;
  completedActions: number;
  unplannedDowntimeTarget: string;
  estimatedBudget: string;
  riskAssessmentLinked: string;
  vsmLinked: string;
}

export const projectPlanData: ProjectPlanInfo = {
  id: 'PLAN-2026-01',
  name: 'Unit 2 Expansion & Plant Relocation',
  facility: 'Pune Manufacturing Complex · Plant 02',
  orgName: 'ForgeTech Dynamics Ltd.',
  startDate: '2026-11-01',
  targetDate: '2027-06-30',
  totalMonths: 8,
  totalWeeks: 34,
  totalPhases: 9,
  totalActions: 24,
  completedActions: 7,
  unplannedDowntimeTarget: '0 Days (Zero Plant Shutdown)',
  estimatedBudget: '₹14.80 Cr',
  riskAssessmentLinked: 'RA-2026-Q4 (Unit 2 Facility Safety & Relocation)',
  vsmLinked: 'VSM-01 (Heavy Transmission Shafts Flow)',
};

export interface ProjectPhase {
  id: string;
  stepNum: number;
  phaseLabel: string;
  title: string;
  category: 'civil' | 'shifting' | 'commissioning';
  startMonth: number;
  endMonth: number;
  durationLabel: string;
  durationWeeks: number;
  progressPct: number;
  status: 'In Progress' | 'Scheduled' | 'Completed';
  activities: string;
  stopsProduction: boolean;
  actionsCount: number;
}

export const projectPhases: ProjectPhase[] = [
  {
    id: 'PHASE-01',
    stepNum: 1,
    phaseLabel: 'Step 1',
    title: 'Infrastructure Readiness',
    category: 'civil',
    startMonth: 1,
    endMonth: 3,
    durationLabel: '2–3 Months',
    durationWeeks: 12,
    progressPct: 65,
    status: 'In Progress',
    activities: 'Complete civil work, electrical sub-station, compressed air, HVAC, lighting, IT network, fire protection, floor marking & crane rails',
    stopsProduction: false,
    actionsCount: 5,
  },
  {
    id: 'PHASE-02',
    stepNum: 2,
    phaseLabel: 'Step 2',
    title: 'Warehouse & Stores',
    category: 'shifting',
    startMonth: 4,
    endMonth: 4,
    durationLabel: '1 Month',
    durationWeeks: 4,
    progressPct: 0,
    status: 'Scheduled',
    activities: 'Shift Raw Material Store, Bought-out Store, Consumables Store, Packing Material Store, Warehouse Management System (WMS)',
    stopsProduction: false,
    actionsCount: 3,
  },
  {
    id: 'PHASE-03',
    stepNum: 3,
    phaseLabel: 'Step 3',
    title: 'Primary Manufacturing',
    category: 'shifting',
    startMonth: 4,
    endMonth: 6,
    durationLabel: '2–3 Months',
    durationWeeks: 10,
    progressPct: 0,
    status: 'Scheduled',
    activities: 'Relocate CNC Turning, Machine Shop, Press Shop, Forging cell, Casting, Deburring, Shot Blast, Job Work Coordination',
    stopsProduction: true,
    actionsCount: 6,
  },
  {
    id: 'PHASE-04',
    stepNum: 4,
    phaseLabel: 'Step 4',
    title: 'Intermediate Storage',
    category: 'commissioning',
    startMonth: 5,
    endMonth: 5,
    durationLabel: '3–5 Weeks',
    durationWeeks: 4,
    progressPct: 0,
    status: 'Scheduled',
    activities: 'Establish Supermarket for semi-finished components, FIFO gravity lanes, Kanban card loop, visual buffer tags',
    stopsProduction: false,
    actionsCount: 2,
  },
  {
    id: 'PHASE-05',
    stepNum: 5,
    phaseLabel: 'Step 5',
    title: 'Surface Finishing',
    category: 'shifting',
    startMonth: 4,
    endMonth: 5,
    durationLabel: '2 Months',
    durationWeeks: 8,
    progressPct: 0,
    status: 'Scheduled',
    activities: 'Barrel Polishing, Electroplating lines (Auto & Manual), Powder Coating, Lacquer Paint line, Brushing/Red Buff & PVD chambers',
    stopsProduction: true,
    actionsCount: 3,
  },
  {
    id: 'PHASE-06',
    stepNum: 6,
    phaseLabel: 'Step 6',
    title: 'Quality & Holding',
    category: 'commissioning',
    startMonth: 5,
    endMonth: 5,
    durationLabel: '3–5 Weeks',
    durationWeeks: 4,
    progressPct: 0,
    status: 'Scheduled',
    activities: 'Metrology lab, Quality Inspection station, Observation holding zone, Finished Component Supermarket',
    stopsProduction: false,
    actionsCount: 2,
  },
  {
    id: 'PHASE-07',
    stepNum: 7,
    phaseLabel: 'Step 7',
    title: 'Assembly & Packaging',
    category: 'shifting',
    startMonth: 5,
    endMonth: 6,
    durationLabel: '3–5 Weeks',
    durationWeeks: 5,
    progressPct: 0,
    status: 'Scheduled',
    activities: 'Shift assembly lines family by family — sub-assembly cells, IPQC inline stations, final packaging cell',
    stopsProduction: true,
    actionsCount: 2,
  },
  {
    id: 'PHASE-08',
    stepNum: 8,
    phaseLabel: 'Step 8',
    title: 'Final Inspection & Dispatch',
    category: 'commissioning',
    startMonth: 7,
    endMonth: 7,
    durationLabel: '3–5 Weeks',
    durationWeeks: 4,
    progressPct: 0,
    status: 'Scheduled',
    activities: 'Third-party PDI Inspection Area, Finished Goods Store, Automated Dispatch Bay, 40ft Container Loading Docks',
    stopsProduction: false,
    actionsCount: 1,
  },
  {
    id: 'PHASE-09',
    stepNum: 9,
    phaseLabel: 'Step 9',
    title: 'Stabilization & Ramp-up',
    category: 'commissioning',
    startMonth: 8,
    endMonth: 8,
    durationLabel: '3–5 Weeks',
    durationWeeks: 4,
    progressPct: 0,
    status: 'Scheduled',
    activities: 'Trial production runs, OEE validation, process audit, safety audit, layout micro-optimization, daily takt monitoring',
    stopsProduction: false,
    actionsCount: 0,
  },
];

export interface ProjectAction {
  id: string;
  phaseId: string;
  phaseName: string;
  title: string;
  source: 'Risk Assessment' | 'VSM Kaizen' | 'Engineering';
  sourceRef: string;
  owner: string;
  targetWeek: string;
  priority: 'Critical' | 'High' | 'Medium';
  status: 'Completed' | 'In Progress' | 'Pending';
  stopsProduction: boolean;
}

export const projectActions: ProjectAction[] = [
  { id: 'ACT-01', phaseId: 'PHASE-01', phaseName: 'Infrastructure Readiness', title: 'Install dedicated dual 11kV busbar and backup DG synchronization for induction furnaces', source: 'Risk Assessment', sourceRef: 'RA-002', owner: 'M. Shinde (Plant Eng)', targetWeek: 'Week 04', priority: 'Critical', status: 'Completed', stopsProduction: false },
  { id: 'ACT-02', phaseId: 'PHASE-01', phaseName: 'Infrastructure Readiness', title: 'Epoxy flooring with antistatic discharge paths in CNC machining bay', source: 'Engineering', sourceRef: 'ENG-101', owner: 'R. Kulkarni', targetWeek: 'Week 06', priority: 'Medium', status: 'Completed', stopsProduction: false },
  { id: 'ACT-03', phaseId: 'PHASE-01', phaseName: 'Infrastructure Readiness', title: 'Compressed air ring main validation at 7.5 bar pressure stability', source: 'Risk Assessment', sourceRef: 'RA-007', owner: 'M. Shinde', targetWeek: 'Week 08', priority: 'High', status: 'In Progress', stopsProduction: false },
  { id: 'ACT-04', phaseId: 'PHASE-01', phaseName: 'Infrastructure Readiness', title: 'EOT crane load testing (15T capacity) across heavy bay bays A & B', source: 'Risk Assessment', sourceRef: 'RA-011', owner: 'T. Deshmukh', targetWeek: 'Week 10', priority: 'High', status: 'In Progress', stopsProduction: false },
  { id: 'ACT-05', phaseId: 'PHASE-01', phaseName: 'Infrastructure Readiness', title: 'Fiber optic LAN backbone and Wi-Fi 6 access points across shop floor', source: 'Engineering', sourceRef: 'IT-04', owner: 'P. Joshi', targetWeek: 'Week 11', priority: 'Medium', status: 'Pending', stopsProduction: false },

  { id: 'ACT-06', phaseId: 'PHASE-02', phaseName: 'Warehouse & Stores', title: 'Erect high-density racking with barcode bin location mapping for raw bar stock', source: 'VSM Kaizen', sourceRef: 'VSM-K03', owner: 'S. Patwardhan', targetWeek: 'Week 13', priority: 'High', status: 'Pending', stopsProduction: false },
  { id: 'ACT-07', phaseId: 'PHASE-02', phaseName: 'Warehouse & Stores', title: 'WMS integration test with SAP ERP for real-time stock booking', source: 'Engineering', sourceRef: 'IT-09', owner: 'P. Joshi', targetWeek: 'Week 14', priority: 'Medium', status: 'Pending', stopsProduction: false },
  { id: 'ACT-08', phaseId: 'PHASE-02', phaseName: 'Warehouse & Stores', title: 'Pre-build 3-day raw material safety buffer before shifting central receiving', source: 'Risk Assessment', sourceRef: 'RA-014', owner: 'S. Patwardhan', targetWeek: 'Week 14', priority: 'Critical', status: 'Pending', stopsProduction: false },

  { id: 'ACT-09', phaseId: 'PHASE-03', phaseName: 'Primary Manufacturing', title: 'Pre-shift calibration & laser foundation alignment for Okuma CNC Turning centers', source: 'Risk Assessment', sourceRef: 'RA-003', owner: 'K. Verma (Machine Ops)', targetWeek: 'Week 16', priority: 'Critical', status: 'Pending', stopsProduction: true },
  { id: 'ACT-10', phaseId: 'PHASE-03', phaseName: 'Primary Manufacturing', title: 'Execute CNC Turning Line 1 shifting over extended Diwali weekend shutdown', source: 'Engineering', sourceRef: 'OPS-22', owner: 'K. Verma', targetWeek: 'Week 17', priority: 'Critical', status: 'Pending', stopsProduction: true },
  { id: 'ACT-11', phaseId: 'PHASE-03', phaseName: 'Primary Manufacturing', title: 'Establish parallel production run in Unit 1 while commissioning Unit 2 Gear Hobbers', source: 'Risk Assessment', sourceRef: 'RA-008', owner: 'A. Thorat', targetWeek: 'Week 18', priority: 'High', status: 'Pending', stopsProduction: false },
  { id: 'ACT-12', phaseId: 'PHASE-03', phaseName: 'Primary Manufacturing', title: 'First-off component CMM validation protocol before releasing machine batch', source: 'Risk Assessment', sourceRef: 'RA-005', owner: 'N. Patil (QA)', targetWeek: 'Week 19', priority: 'High', status: 'Pending', stopsProduction: false },
  { id: 'ACT-13', phaseId: 'PHASE-03', phaseName: 'Primary Manufacturing', title: 'Implement quick-changeover SMED carts for gear tooling at new workcells', source: 'VSM Kaizen', sourceRef: 'VSM-K06', owner: 'A. Thorat', targetWeek: 'Week 20', priority: 'Medium', status: 'Pending', stopsProduction: false },
  { id: 'ACT-14', phaseId: 'PHASE-03', phaseName: 'Primary Manufacturing', title: 'Operator ergonomic shadow boards and crane hoist placement at cell 3', source: 'VSM Kaizen', sourceRef: 'VSM-K09', owner: 'R. Kulkarni', targetWeek: 'Week 21', priority: 'Medium', status: 'Pending', stopsProduction: false },

  { id: 'ACT-15', phaseId: 'PHASE-04', phaseName: 'Intermediate Storage', title: 'Set up 2-lane FIFO gravity flow racks between Turning and Hobbing cells', source: 'VSM Kaizen', sourceRef: 'VSM-K01', owner: 'S. Patwardhan', targetWeek: 'Week 20', priority: 'High', status: 'Pending', stopsProduction: false },
  { id: 'ACT-16', phaseId: 'PHASE-04', phaseName: 'Intermediate Storage', title: 'Calibrate visual kanban trigger limits (Max 24 bins, Min 6 bins) for VSM-01', source: 'VSM Kaizen', sourceRef: 'VSM-K02', owner: 'A. Thorat', targetWeek: 'Week 21', priority: 'Medium', status: 'Pending', stopsProduction: false },

  { id: 'ACT-17', phaseId: 'PHASE-05', phaseName: 'Surface Finishing', title: 'Automated barrel plating line chemical bath drainage, transport, and refractory lining inspection', source: 'Risk Assessment', sourceRef: 'RA-019', owner: 'V. Mehta (Plating)', targetWeek: 'Week 17', priority: 'Critical', status: 'Pending', stopsProduction: true },
  { id: 'ACT-18', phaseId: 'PHASE-05', phaseName: 'Surface Finishing', title: 'PCB effluent treatment plant (ETP) connection and zero liquid discharge consent sign-off', source: 'Risk Assessment', sourceRef: 'RA-022', owner: 'V. Mehta', targetWeek: 'Week 18', priority: 'Critical', status: 'Pending', stopsProduction: false },
  { id: 'ACT-19', phaseId: 'PHASE-05', phaseName: 'Surface Finishing', title: 'Pre-build 10 days of finished plated inventory before decommissioning legacy line', source: 'Risk Assessment', sourceRef: 'RA-020', owner: 'S. Patwardhan', targetWeek: 'Week 16', priority: 'Critical', status: 'Pending', stopsProduction: false },

  { id: 'ACT-20', phaseId: 'PHASE-06', phaseName: 'Quality & Holding', title: 'Cleanroom HVAC stabilization and vibration isolation pad testing for Zeiss CMM', source: 'Risk Assessment', sourceRef: 'RA-015', owner: 'N. Patil', targetWeek: 'Week 21', priority: 'High', status: 'Pending', stopsProduction: false },
  { id: 'ACT-21', phaseId: 'PHASE-06', phaseName: 'Quality & Holding', title: 'Install digital visual display boards for hourly scrap and first-pass yield tracking', source: 'VSM Kaizen', sourceRef: 'VSM-K08', owner: 'N. Patil', targetWeek: 'Week 22', priority: 'Medium', status: 'Pending', stopsProduction: false },

  { id: 'ACT-22', phaseId: 'PHASE-07', phaseName: 'Assembly & Packaging', title: 'Single-piece flow U-shaped assembly bench erection with integrated torque angle DC guns', source: 'VSM Kaizen', sourceRef: 'VSM-K04', owner: 'H. Sharma', targetWeek: 'Week 23', priority: 'High', status: 'Pending', stopsProduction: true },
  { id: 'ACT-23', phaseId: 'PHASE-07', phaseName: 'Assembly & Packaging', title: 'Poka-yoke sensor gates on component pick bins to prevent missing dowel pins', source: 'Risk Assessment', sourceRef: 'RA-027', owner: 'H. Sharma', targetWeek: 'Week 24', priority: 'High', status: 'Pending', stopsProduction: false },

  { id: 'ACT-24', phaseId: 'PHASE-08', phaseName: 'Final Inspection & Dispatch', title: 'Automated strapping machine commissioning and bay door leveler dock verification', source: 'Engineering', sourceRef: 'OPS-33', owner: 'T. Deshmukh', targetWeek: 'Week 28', priority: 'Medium', status: 'Pending', stopsProduction: false },
];

export const projectCheckpoints = [
  { id: 'CP-01', title: 'Utility readiness (power, air, water, gas)', status: 'Approved', verifiedBy: 'Plant Eng' },
  { id: 'CP-02', title: 'Machine installation & laser alignment completed', status: 'Approved', verifiedBy: 'Maintenance' },
  { id: 'CP-03', title: 'Raw material & tooling buffer availability', status: 'Approved', verifiedBy: 'Supply Chain' },
  { id: 'CP-04', title: 'Cold trial run & dry cycle completed', status: 'Approved', verifiedBy: 'Operations' },
  { id: 'CP-05', title: 'Process parameter validation approved', status: 'In Review', verifiedBy: 'Process Eng' },
  { id: 'CP-06', title: 'Quality approval & first-off CMM report signed', status: 'In Review', verifiedBy: 'QA Dept' },
  { id: 'CP-07', title: 'EHS & industrial safety clearance issued', status: 'Approved', verifiedBy: 'Safety Officer' },
  { id: 'CP-08', title: 'Operator SOP training & certification logged', status: 'In Review', verifiedBy: 'HR / L&D' },
  { id: 'CP-09', title: 'Material flow & visual route marking verified', status: 'Approved', verifiedBy: 'Lean Office' },
  { id: 'CP-10', title: 'ERP bin master & WMS inventory updated', status: 'Approved', verifiedBy: 'IT Systems' },
];

export const projectPractices = [
  {
    title: 'Shift one product family at a time',
    description: 'Never move the entire machine line at once. Relocate product streams incrementally (e.g. VSM-01 shafts first) to keep other product lines supplying customers.',
    rule: 'Rule 1: Family-by-Family',
  },
  {
    title: 'Maintain 2–3 days buffer inventory before shifting each department',
    description: 'Build strategic bank inventory in the buffer store ahead of time so downstream processing or shipping is completely insulated during machine transit.',
    rule: 'Rule 2: Strategic Buffer',
  },
  {
    title: 'Run old and new facilities in parallel for critical processes',
    description: 'Keep the legacy station powered until the new line passes first-piece inspection and PPAP run-at-rate validation.',
    rule: 'Rule 3: Parallel Validation',
  },
  {
    title: 'Shift on weekends or planned shutdown days',
    description: 'Schedule heavy rigging, electrical tap-offs, and crane shifts Friday night through Sunday evening to preserve 100% scheduled production hours.',
    rule: 'Rule 4: Weekend Cutover',
  },
  {
    title: 'Validate first-off production before full-scale manufacturing',
    description: 'Conduct comprehensive 10-piece CMM inspection and metallurgical checks before handing the machine back to standard production operators.',
    rule: 'Rule 5: Zero-Defect Handshake',
  },
  {
    title: 'Conduct daily 15-minute cross-functional war room meetings',
    description: 'Track daily shift milestones, immediate blockers, contractor punch lists, and safety compliance each morning at 08:30 AM.',
    rule: 'Rule 6: Daily Governance',
  },
];

/* ─────────────────────────────────────────────────────────────────────────────
   STEP 10 · FLOW SUPERMARKET & LINE DESIGN (BRONZE #78350F)
   ───────────────────────────────────────────────────────────────────────────── */
export const supermarketNavigation = [
  { label: 'Overview', path: '/supermarket', icon: 'LayoutDashboard' },
  { label: 'Sizing & Stock Zones', path: '/supermarket/sizing', icon: 'Warehouse', step: '01' },
  { label: 'Line Side Design', path: '/supermarket/line-side', icon: 'SlidersHorizontal', step: '02' },
  { label: 'Current vs Future', path: '/supermarket/report', icon: 'FileText', step: '03' },
];

export const supermarketDescriptions: Record<string, string> = {
  '/supermarket': 'Flow supermarket architecture, 5-zone inventory sizing, and lean replenishment loops.',
  '/supermarket/sizing': 'Slide 62 sizing model: parts, pieces per container, inventory days today vs proposed, and floor footprint.',
  '/supermarket/line-side': 'Line-side delivery intervals, operator presentation racks, pick-to-light bins, and ergonomic turntables.',
  '/supermarket/report': 'Consolidated current vs future storage comparison, floor space freed, and WIP capital reduction.',
};

export interface SupermarketPart {
  id: string;
  name: string;
  itemType: 'Finished Goods' | 'Raw Material' | 'Semi-Finished';
  dailyOutput: number;
  daysToday: number;
  daysProposed: number;
  qtyPerContainer: number;
  stackHeight: number;
  givenLocations: number;
  neededLocations: number;
  spaceImprovementPct: number;
  stockZone: 'Desired' | 'Below Safety' | 'Below Buffer' | 'Above Max';
}

export const supermarketParts: SupermarketPart[] = [
  { id: 'SM-01', name: 'Heavy Transmission Shafts (VSM-01)', itemType: 'Finished Goods', dailyOutput: 480, daysToday: 7, daysProposed: 2, qtyPerContainer: 24, stackHeight: 2, givenLocations: 70, neededLocations: 20, spaceImprovementPct: 71, stockZone: 'Desired' },
  { id: 'SM-02', name: 'Helical Output Gears 42T', itemType: 'Finished Goods', dailyOutput: 320, daysToday: 8, daysProposed: 2, qtyPerContainer: 32, stackHeight: 3, givenLocations: 40, neededLocations: 10, spaceImprovementPct: 75, stockZone: 'Desired' },
  { id: 'SM-03', name: 'EN8 Steel Bar Stock 50mm', itemType: 'Raw Material', dailyOutput: 1200, daysToday: 25, daysProposed: 5, qtyPerContainer: 100, stackHeight: 2, givenLocations: 150, neededLocations: 30, spaceImprovementPct: 80, stockZone: 'Above Max' },
  { id: 'SM-04', name: '20MnCr5 Forged Billets', itemType: 'Raw Material', dailyOutput: 650, daysToday: 21, daysProposed: 4, qtyPerContainer: 50, stackHeight: 2, givenLocations: 136, neededLocations: 26, spaceImprovementPct: 81, stockZone: 'Desired' },
  { id: 'SM-05', name: 'Intermediate Supermarket Turned Shafts', itemType: 'Semi-Finished', dailyOutput: 510, daysToday: 12, daysProposed: 1.5, qtyPerContainer: 30, stackHeight: 2, givenLocations: 102, neededLocations: 13, spaceImprovementPct: 87, stockZone: 'Below Safety' },
  { id: 'SM-06', name: 'SG Iron Flange Castings', itemType: 'Raw Material', dailyOutput: 240, daysToday: 18, daysProposed: 4, qtyPerContainer: 40, stackHeight: 2, givenLocations: 54, neededLocations: 12, spaceImprovementPct: 78, stockZone: 'Desired' },
];

export interface LineSideStation {
  id: string;
  name: string;
  workcell: string;
  deliveryIntervalMins: number;
  containerType: string;
  presentationRack: string;
  operatorReachMm: number;
  ergonomicScore: string;
}

export const lineSideStations: LineSideStation[] = [
  { id: 'LS-01', name: 'CNC Turning Infeed Gravity Rack', workcell: 'Shafts Cell A', deliveryIntervalMins: 45, containerType: 'Modular Plastic Tote (400x300)', presentationRack: 'Flow Rack with Roller Track (15° Tilt)', operatorReachMm: 420, ergonomicScore: 'Optimal (Green Zone)' },
  { id: 'LS-02', name: 'Gear Hobbing Point-of-Use Carousel', workcell: 'Gears Cell B', deliveryIntervalMins: 60, containerType: 'Custom Wooden Peg Pallet', presentationRack: 'Rotating Turntable Table', operatorReachMm: 380, ergonomicScore: 'Optimal (Green Zone)' },
  { id: 'LS-03', name: 'Assembly Sub-Station Pick Bins', workcell: 'Final Cell C', deliveryIntervalMins: 30, containerType: 'Colour-Coded Kanban Bins', presentationRack: 'Ergonomic Louvred Panel Stand', operatorReachMm: 450, ergonomicScore: 'Good' },
  { id: 'LS-04', name: 'Quality Inspection PDI Buffer', workcell: 'QA Gate', deliveryIntervalMins: 90, containerType: 'Foam Cushioned Tray', presentationRack: 'Height Adjustable Hydraulic Table', operatorReachMm: 400, ergonomicScore: 'Optimal (Green Zone)' },
];

/* ─────────────────────────────────────────────────────────────────────────────
   STEP 11 · MATERIAL HANDLING DESIGN (ROSE #BE185D)
   ───────────────────────────────────────────────────────────────────────────── */
export const mhNavigation = [
  { label: 'Overview', path: '/material-handling', icon: 'LayoutDashboard' },
  { label: 'Equipment Plan', path: '/material-handling/design', icon: 'Truck', step: '01' },
  { label: 'Brownfield Cases', path: '/material-handling/cases', icon: 'Workflow', step: '02' },
  { label: 'Investment Report', path: '/material-handling/report', icon: 'FileText', step: '03' },
];

export const mhDescriptions: Record<string, string> = {
  '/material-handling': 'Systematic movement, storage, and protection of materials throughout manufacturing and dispatch.',
  '/material-handling/design': 'New equipment requirements: suggested from the equipment repository and AI for modern lean flow.',
  '/material-handling/cases': 'Current brownfield practice vs proposed solution: fork truck elimination and milk-run towing.',
  '/material-handling/report': 'Executive Capex equipment table, unit costs, total investment, and payback period calculation.',
};

export interface MHEquipmentItem {
  id: string;
  area: string;
  activity: string;
  equipmentName: string;
  category: 'Towing' | 'Lifting' | 'Storage' | 'Transfer';
  capacity: string;
  qty: number;
  unitCostLakhs: number;
  totalCostLakhs: number;
  justification: string;
  status: 'Approved' | 'In Review';
}

export const mhEquipmentItems: MHEquipmentItem[] = [
  { id: 'MHE-01', area: 'Central Receiving → Supermarket', activity: 'Raw Material Towing', equipmentName: 'Electric Tugger Train (3-Trolley)', category: 'Towing', capacity: '3,000 kg', qty: 2, unitCostLakhs: 4.80, totalCostLakhs: 9.60, justification: 'Replaces 2 diesel fork trucks; eliminates indoor exhaust fumes and pedestrian collisions.', status: 'Approved' },
  { id: 'MHE-02', area: 'Machining Workcells', activity: 'Infeed Presentation', equipmentName: 'Hydraulic Mobile Scissor Lift Cart', category: 'Lifting', capacity: '500 kg', qty: 6, unitCostLakhs: 0.65, totalCostLakhs: 3.90, justification: 'Maintains constant operator waist-level picking; prevents back strain injuries.', status: 'Approved' },
  { id: 'MHE-03', area: 'Intermediate Supermarket', activity: 'FIFO Component Holding', equipmentName: 'Modular Gravity Roller Flow Track Lanes', category: 'Storage', capacity: '1,200 kg / lane', qty: 8, unitCostLakhs: 0.45, totalCostLakhs: 3.60, justification: 'Enforces strict First-In First-Out sequence; eliminates buried pallets.', status: 'Approved' },
  { id: 'MHE-04', area: 'Assembly to Final Packaging', activity: 'WIP Cart Transport', equipmentName: 'Autonomous Mobile Robot (AMR 250)', category: 'Transfer', capacity: '250 kg', qty: 1, unitCostLakhs: 8.50, totalCostLakhs: 8.50, justification: 'Autonomous scheduled delivery of completed shaft assemblies to washing and packaging.', status: 'In Review' },
  { id: 'MHE-05', area: 'Inspection Bay', activity: 'Shaft CMM Transfer', equipmentName: 'Zero-Gravity Pneumatic Arm Balancer', category: 'Lifting', capacity: '60 kg', qty: 2, unitCostLakhs: 1.20, totalCostLakhs: 2.40, justification: 'Allows effortless single-operator loading of heavy shafts onto metrology granite table.', status: 'Approved' },
];

export interface MHCaseComparison {
  id: string;
  process: string;
  currentPractice: string;
  currentDrawback: string;
  proposedSolution: string;
  proposedBenefit: string;
  distanceReductionPct: number;
  handlingTimeDropPct: number;
}

export const mhCaseComparisons: MHCaseComparison[] = [
  { id: 'CASE-01', process: 'Raw Material Yard to Turning Cell', currentPractice: 'Counterbalance diesel forklift carrying loose stacked bundles on wooden pallets.', currentDrawback: 'Heavy pedestrian safety risk, frequent oil spills, random delivery timing causing cell starvation.', proposedSolution: 'Timed electric tugger milk-run using standardized wheeled nesting carts on painted transit lanes.', proposedBenefit: 'Scheduled hourly delivery, zero indoor carbon emissions, 100% predictable supply pace.', distanceReductionPct: 45, handlingTimeDropPct: 60 },
  { id: 'CASE-02', process: 'Machining to Heat Treatment Bay', currentPractice: 'Manual push trolley pushed over 120m rough concrete path by machine operator.', currentDrawback: 'Takes machinists away from spindle runtime for 25 minutes per batch; severe operator fatigue.', proposedSolution: 'Dedicated central transfer trolley circuit coupled with intermediate gravity buffer racks.', proposedBenefit: 'Machinist stays at machine cycle; material movement handled by dedicated logistics handler.', distanceReductionPct: 35, handlingTimeDropPct: 75 },
  { id: 'CASE-03', process: 'Shaft Loading onto Induction Hardener', currentPractice: 'Two operators manually lifting 38kg shafts from low pallet onto fixture clamps.', currentDrawback: 'High risk of lower back injury, accidental dropped shafts damaging gear teeth.', proposedSolution: 'Pneumatic zero-gravity hoist balancer with custom magnetic gripper tool.', proposedBenefit: 'Effortless single-operator fingertip positioning with zero product drop hazard.', distanceReductionPct: 20, handlingTimeDropPct: 50 },
];

/* ─────────────────────────────────────────────────────────────────────────────
   STEP 12 · LAYOUT DESIGN (EMERALD #059669)
   ───────────────────────────────────────────────────────────────────────────── */
export const layoutNavigation = [
  { label: 'Overview', path: '/layout-design', icon: 'LayoutDashboard' },
  { label: 'Department Areas', path: '/layout-design/areas', icon: 'PanelsTopLeft', step: '01' },
  { label: '2D Layout Drafter', path: '/layout-design/drafter', icon: 'Grid3X3', step: '02' },
  { label: 'Executive Presentation', path: '/layout-design/presentation', icon: 'FileText', step: '03' },
];

export const layoutDescriptions: Record<string, string> = {
  '/layout-design': 'Plant master layout drawing, departmental boundary zoning, and slide-by-slide executive presentation.',
  '/layout-design/areas': 'Floor area breakdown across the 14 operational departments: sq. metres, equipment loads, and flow index.',
  '/layout-design/drafter': 'Scaled CAD drawing canvas in metres: machines, gangways, buffer supermarkets, and travel routes.',
  '/layout-design/presentation': 'High-resolution projector slides showing the complete facility floor and zoomed departmental views.',
};

export interface LayoutAreaZone {
  id: string;
  name: string;
  bay: string;
  areaSqM: number;
  equipmentCount: number;
  operatorCount: number;
  flowDirection: string;
  colorCode: string;
  status: 'Reviewed & Approved' | 'Adjustments Needed';
}

export const layoutAreaZones: LayoutAreaZone[] = [
  { id: 'AREA-01', name: 'Raw Material Inward & Yard', bay: 'Bay A (South)', areaSqM: 850, equipmentCount: 4, operatorCount: 3, flowDirection: 'Inward Dock → Inspection', colorCode: '#3B82F6', status: 'Reviewed & Approved' },
  { id: 'AREA-02', name: 'CNC Turning Cell A (Shafts)', bay: 'Bay B (Center)', areaSqM: 1100, equipmentCount: 12, operatorCount: 8, flowDirection: 'Linear U-Shape Flow', colorCode: '#10B981', status: 'Reviewed & Approved' },
  { id: 'AREA-03', name: 'Gear Hobbing & Shaping Cell', bay: 'Bay B (Center)', areaSqM: 920, equipmentCount: 8, operatorCount: 6, flowDirection: 'Parallel Workcells', colorCode: '#F59E0B', status: 'Reviewed & Approved' },
  { id: 'AREA-04', name: 'Intermediate Flow Supermarket', bay: 'Bay B-C Corridor', areaSqM: 380, equipmentCount: 16, operatorCount: 2, flowDirection: 'Gravity FIFO Lanes', colorCode: '#8B5CF6', status: 'Reviewed & Approved' },
  { id: 'AREA-05', name: 'Heat Treatment & Induction Hardening', bay: 'Bay C (North)', areaSqM: 1250, equipmentCount: 6, operatorCount: 4, flowDirection: 'Batch Carousel Chamber', colorCode: '#EF4444', status: 'Reviewed & Approved' },
  { id: 'AREA-06', name: 'Precision Grinding & Washing', bay: 'Bay C (North)', areaSqM: 780, equipmentCount: 7, operatorCount: 5, flowDirection: 'In-line Enclosed Bay', colorCode: '#06B6D4', status: 'Reviewed & Approved' },
  { id: 'AREA-07', name: 'Sub-Assembly & Final QA Metrology', bay: 'Bay D (East)', areaSqM: 950, equipmentCount: 10, operatorCount: 10, flowDirection: 'One-Piece Flow Line', colorCode: '#EC4899', status: 'Reviewed & Approved' },
  { id: 'AREA-08', name: 'Finished Goods & Export Dispatch Bay', bay: 'Bay D (East)', areaSqM: 1570, equipmentCount: 5, operatorCount: 4, flowDirection: 'Outward Container Docks', colorCode: '#64748B', status: 'Reviewed & Approved' },
];




export const trainingNavigation = [
  { label: 'Overview', path: '/training', icon: 'LayoutDashboard' },
  { label: 'Curriculum', path: '/training/curriculum', icon: 'BookOpen', step: '01' },
  { label: 'Attendance & Mood Meter', path: '/training/attendance', icon: 'Users', step: '02' },
  { label: 'Report', path: '/training/report', icon: 'FileText', step: '03' },
];
export const trainingDescriptions: Record<string, string> = {
  '/training': 'Run the session, record who was trained, and carry that team into the map.',
  '/training/curriculum': 'What the two decks cover, what today actually got through, and how long it took.',
  '/training/attendance': 'Who was in the room, from where — and how they found the day.',
  '/training/report': 'The session pack: attendance, mood, coverage — and the certificates.',
};
export const vsmNavigation = [
  { label: 'Overview', path: '/vsm', icon: 'LayoutDashboard' },
  { label: 'Demand & Takt', path: '/vsm/setup', icon: 'Clock', step: '01' },
  { label: 'Process Data', path: '/vsm/processes', icon: 'Cog', step: '02' },
  { label: 'Current State Map', path: '/vsm/current', icon: 'Workflow', step: '03' },
  { label: 'Future State', path: '/vsm/future', icon: 'Sparkles', step: '04' },
  { label: 'Analytics', path: '/vsm/analytics', icon: 'BarChart3', step: '05' },
];
export const vsmDescriptions: Record<string, string> = {
  '/vsm': 'Map current and future state value streams, and measure what the change is worth.',
  '/vsm/setup': 'Size the plant tempo to the customer: demand, shifts and breaks give the takt time.',
  '/vsm/processes': 'One data box per work centre: cycle time, changeover, uptime, operators and the WIP after it.',
  '/vsm/current': 'The unvarnished reality: push arrows, WIP buffers and the lead-time ladder.',
  '/vsm/future': 'Pull, flow and one scheduling point — and the kaizen bursts that make it true.',
  '/vsm/analytics': 'Current against future: lead time, cycle efficiency, inventory and station balance.',
};
export const flowNavigation = [
  { label: 'Overview', path: '/flow-management', icon: 'LayoutDashboard' },
  { label: 'Streams', path: '/flow-management/streams', icon: 'Layers', step: '01' },
  { label: 'Flow Chart', path: '/flow-management/chart', icon: 'Workflow', step: '02' },
  { label: 'Transportation Index', path: '/flow-management/transport', icon: 'Truck', step: '03' },
  { label: 'Analysis', path: '/flow-management/analysis', icon: 'BarChart3', step: '04' },
  { label: 'Report', path: '/flow-management/report', icon: 'FileText', step: '05' },
];
export const flowDescriptions: Record<string, string> = {
  '/flow-management': 'Put every product stream on one sheet: what they share, and how far material walks.',
  '/flow-management/streams': 'One column per product. The operations in order, and what runs each one.',
  '/flow-management/chart': 'The whole wall in one picture — every stream side by side.',
  '/flow-management/transport': 'Every material movement in ton-metres — as-is against the redesign.',
  '/flow-management/analysis': 'What the streams share, where they collide, and how far the material travels.',
  '/flow-management/report': 'The findings and the export the client receives.',
};
