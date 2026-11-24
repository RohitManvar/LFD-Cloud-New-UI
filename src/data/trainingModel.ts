/** Training & Orientation (LFD step 1): sample session plus the arithmetic the main app uses for mood, coverage and the VSM charter. */

export interface TrainingSession {
  client: string; site: string; trainer: string; dates: string; mode: string; curriculum: string; joinCode: string;
}
export const trainingSession: TrainingSession = {
  client: 'Sahyadri Auto Components Pvt. Ltd.',
  site: 'Chakan plant · Training hall B',
  trainer: 'Faber Infinite',
  dates: '27–28 Oct 2026',
  mode: 'On site',
  curriculum: 'Both decks · two-day orientation',
  joinCode: 'SAC-4827',
};

export type Attendance = 'present' | 'partial' | 'absent';
export type VsmRole = '' | 'mapping-team' | 'on-call-sme' | 'sponsor' | 'champion';
export interface Participant {
  id: string; name: string; department: string; designation: string; attendance: Attendance; vsm_role: VsmRole; source: 'self' | 'trainer'; signed_in: string;
}

export const ATTENDANCE_OPTIONS: { key: Attendance; label: string }[] = [
  { key: 'present', label: 'Present' }, { key: 'partial', label: 'Part' }, { key: 'absent', label: 'Absent' },
];
export const VSM_ROLES: { key: Exclude<VsmRole, ''>; label: string; hint: string }[] = [
  { key: 'mapping-team', label: 'Mapping team', hint: 'Draws the map' },
  { key: 'on-call-sme', label: 'On-call SME', hint: 'Pulled in for their area' },
  { key: 'sponsor', label: 'Executive sponsor', hint: 'Clears the way' },
  { key: 'champion', label: 'Value stream champion', hint: 'Owns the stream' },
];

export const trainingParticipants: Participant[] = [
  { id: 'P-01', name: 'Anand Kulkarni', department: 'Operations', designation: 'Plant Head', attendance: 'present', vsm_role: 'sponsor', source: 'self', signed_in: '09:02' },
  { id: 'P-02', name: 'Meera Joshi', department: 'Production', designation: 'Production Manager', attendance: 'present', vsm_role: 'champion', source: 'self', signed_in: '09:05' },
  { id: 'P-03', name: 'Rahul Deshpande', department: 'Production', designation: 'Line Supervisor', attendance: 'present', vsm_role: 'mapping-team', source: 'self', signed_in: '09:06' },
  { id: 'P-04', name: 'Sneha Patil', department: 'Quality', designation: 'QA Engineer', attendance: 'present', vsm_role: 'mapping-team', source: 'self', signed_in: '09:07' },
  { id: 'P-05', name: 'Vikram Shinde', department: 'Maintenance', designation: 'Maintenance Engineer', attendance: 'present', vsm_role: 'mapping-team', source: 'self', signed_in: '09:09' },
  { id: 'P-06', name: 'Pooja Gaikwad', department: 'Planning (PPC)', designation: 'PPC Executive', attendance: 'present', vsm_role: 'mapping-team', source: 'self', signed_in: '09:10' },
  { id: 'P-07', name: 'Suresh Pawar', department: 'Stores', designation: 'Stores In-charge', attendance: 'present', vsm_role: 'on-call-sme', source: 'self', signed_in: '09:11' },
  { id: 'P-08', name: 'Kiran More', department: 'Engineering', designation: 'Process Engineer', attendance: 'present', vsm_role: 'on-call-sme', source: 'self', signed_in: '09:12' },
  { id: 'P-09', name: 'Amit Jadhav', department: 'Production', designation: 'Operator – CNC', attendance: 'present', vsm_role: '', source: 'self', signed_in: '09:14' },
  { id: 'P-10', name: 'Neha Kale', department: 'Quality', designation: 'Inspector', attendance: 'present', vsm_role: '', source: 'self', signed_in: '09:15' },
  { id: 'P-11', name: 'Sachin Bhosale', department: 'Production', designation: 'Operator – Hobbing', attendance: 'present', vsm_role: '', source: 'self', signed_in: '09:15' },
  { id: 'P-12', name: 'Priya Naik', department: 'HR', designation: 'L&D Coordinator', attendance: 'present', vsm_role: '', source: 'self', signed_in: '09:16' },
  { id: 'P-13', name: 'Ganesh Salunkhe', department: 'Maintenance', designation: 'Technician', attendance: 'present', vsm_role: '', source: 'self', signed_in: '09:18' },
  { id: 'P-14', name: 'Rutuja Mane', department: 'Planning (PPC)', designation: 'Planner', attendance: 'present', vsm_role: '', source: 'self', signed_in: '09:19' },
  { id: 'P-15', name: 'Nitin Chavan', department: 'Production', designation: 'Shift Incharge', attendance: 'present', vsm_role: '', source: 'self', signed_in: '09:21' },
  { id: 'P-16', name: 'Shweta Kadam', department: 'Finance', designation: 'Cost Accountant', attendance: 'present', vsm_role: '', source: 'trainer', signed_in: '09:24' },
  { id: 'P-17', name: 'Omkar Thorat', department: 'Stores', designation: 'Store Keeper', attendance: 'present', vsm_role: '', source: 'self', signed_in: '09:26' },
  { id: 'P-18', name: 'Deepak Sawant', department: 'Engineering', designation: 'Tool Room Lead', attendance: 'present', vsm_role: '', source: 'trainer', signed_in: '09:31' },
  { id: 'P-19', name: 'Kavita Ghule', department: 'Quality', designation: 'Supplier Quality', attendance: 'partial', vsm_role: '', source: 'self', signed_in: '09:40' },
  { id: 'P-20', name: 'Manoj Lokhande', department: 'Production', designation: 'Operator – Assembly', attendance: 'present', vsm_role: '', source: 'self', signed_in: '09:44' },
  { id: 'P-21', name: 'Tejas Wagh', department: 'Logistics', designation: 'Dispatch Executive', attendance: 'absent', vsm_role: '', source: 'trainer', signed_in: '—' },
  { id: 'P-22', name: 'Asha Dhumal', department: 'Purchase', designation: 'Buyer', attendance: 'absent', vsm_role: '', source: 'trainer', signed_in: '—' },
];

export interface TrainingTopic {
  key: string; deck: 'foundations' | 'vsm'; title: string; blurb: string; slides: string; planned: number; covered: boolean; minutes: number | null;
}
export const DECKS = [
  { key: 'foundations' as const, title: 'Lean Foundations', file: 'Lean Foundations Training Material.pptx', slides: 47 },
  { key: 'vsm' as const, title: 'Value Stream Mapping', file: 'Value Stream Mapping Training Material.pptx', slides: 129 },
];
export const trainingTopics: TrainingTopic[] = [
  { key: 'f-paradigm', deck: 'foundations', title: 'Paradigms & the square exercise', slides: '2–13', planned: 30, covered: true, minutes: 35, blurb: 'Square and number exercises, the five-monkeys story, paradigm shift.' },
  { key: 'f-what-is-lean', deck: 'foundations', title: 'What lean is', slides: '15–17', planned: 20, covered: true, minutes: 20, blurb: 'OpEx as waste elimination plus error-proofing; how to tell VA from NVA.' },
  { key: 'f-eight-wastes', deck: 'foundations', title: 'The 8 wastes (DOWNTIME)', slides: '18–36', planned: 45, covered: true, minutes: 55, blurb: 'One waste per slide with plant examples, then the VA/NVA sorting exercise.' },
  { key: 'f-value-creation', deck: 'foundations', title: 'How value is created', slides: '37–39', planned: 15, covered: true, minutes: 15, blurb: 'The price barrier, and where profit comes from before and after lean.' },
  { key: 'f-three-mu', deck: 'foundations', title: 'Muda · Mura · Muri', slides: '40–44', planned: 25, covered: true, minutes: 25, blurb: 'Waste, unevenness, overburden — and why removing only muda does not hold.' },
  { key: 'f-close', deck: 'foundations', title: 'Close', slides: '45–47', planned: 10, covered: true, minutes: 10, blurb: 'Profit = sales − cost, and the call to start now.' },
  { key: 'v-why', deck: 'vsm', title: 'What a value stream is, and why map it', slides: '2–8', planned: 20, covered: true, minutes: 20, blurb: 'Value, value stream, the language of lean, and what VSM is for.' },
  { key: 'v-charter', deck: 'vsm', title: 'Prerequisites & the VSM charter', slides: '9–17', planned: 30, covered: true, minutes: 40, blurb: 'Forming the cross-functional team, scope, accountability, sponsor and champion.' },
  { key: 'v-flow-types', deck: 'vsm', title: 'Material & information flow', slides: '18–22', planned: 15, covered: true, minutes: 15, blurb: 'The two flows, the levels a map can be drawn at, and the four map phases.' },
  { key: 'v-ppq', deck: 'vsm', title: 'Product–Process–Quantity analysis', slides: '23–27', planned: 15, covered: true, minutes: 20, blurb: 'Choosing the family to map — the hand-off into LFD step 2.' },
  { key: 'v-current-state', deck: 'vsm', title: 'Current state: the walk', slides: '28–32', planned: 25, covered: true, minutes: 30, blurb: 'Walking the flow backwards, VA/NVA/CT/LT definitions, what to carry.' },
  { key: 'v-symbols', deck: 'vsm', title: 'The icon set', slides: '33–40', planned: 30, covered: true, minutes: 25, blurb: 'Process, inventory, pull, kanban, milk run, kaizen burst, control centre.' },
  { key: 'v-loops', deck: 'vsm', title: 'Drawing it: customer, supplier, manufacturing, information', slides: '41–60', planned: 60, covered: true, minutes: 70, blurb: 'The four loops, the data box, the lead-time ladder and the summary box.' },
  { key: 'v-wastes', deck: 'vsm', title: 'Finding the waste on the map', slides: '61–74', planned: 30, covered: true, minutes: 30, blurb: 'The 8 wastes against the drawn map, and where the kaizen bursts go.' },
  { key: 'v-future-state', deck: 'vsm', title: 'Future state', slides: '75–96', planned: 60, covered: true, minutes: 65, blurb: 'Takt, continuous flow, spaghetti, supermarket, pacemaker, heijunka, yamazumi, pitch.' },
  { key: 'v-material-flow', deck: 'vsm', title: 'Designing the material flow', slides: '97–111', planned: 45, covered: false, minutes: null, blurb: 'The seven design questions worked through on the example bracket line.' },
  { key: 'v-kaizen-plan', deck: 'vsm', title: 'Kaizen plan & prioritisation', slides: '112–123', planned: 30, covered: false, minutes: null, blurb: 'Turning bursts into projects, level 1 vs level 2, the implementation plan.' },
  { key: 'v-metrics', deck: 'vsm', title: 'Metrics & close', slides: '124–129', planned: 15, covered: true, minutes: 10, blurb: 'What gets measured gets done; where VSM applies beyond the shop floor.' },
];

export type MoodKey = 'excited' | 'positive' | 'neutral' | 'confused' | 'frustrated';
export const MOODS: { key: MoodKey; label: string; weight: number; emoji: string; color: string }[] = [
  { key: 'excited', label: 'Excited', weight: 100, emoji: '🤩', color: '#15803d' },
  { key: 'positive', label: 'Positive', weight: 80, emoji: '🙂', color: '#65a30d' },
  { key: 'neutral', label: 'Neutral', weight: 60, emoji: '😐', color: '#ca8a04' },
  { key: 'confused', label: 'Confused', weight: 40, emoji: '😕', color: '#ea580c' },
  { key: 'frustrated', label: 'Frustrated', weight: 20, emoji: '😣', color: '#b91c1c' },
];
export const MOOD_BANDS = [
  { key: 'poor', min: 0, max: 40, label: 'Poor', color: '#b91c1c' },
  { key: 'needs', min: 41, max: 60, label: 'Needs Improvement', color: '#ea580c' },
  { key: 'good', min: 61, max: 80, label: 'Good', color: '#ca8a04' },
  { key: 'best', min: 81, max: 100, label: 'Excellent', color: '#15803d' },
];
export type MoodCounts = Record<MoodKey, number>;
export const trainingMood: MoodCounts = { excited: 6, positive: 8, neutral: 3, confused: 2, frustrated: 0 };
/** Of the mood readings, how many came from people's own phones; the rest were a show of hands. */
export const trainingMoodSelf = 15;

export const isPresent = (p: Participant) => p.attendance !== 'absent';

export function rosterStats(participants: Participant[]) {
  const present = participants.filter(isPresent);
  const departments = [...new Set(participants.map(p => p.department))].sort();
  return {
    total: participants.length,
    present: present.length,
    absent: participants.length - present.length,
    partial: participants.filter(p => p.attendance === 'partial').length,
    attendancePct: participants.length ? Math.round(present.length / participants.length * 100) : null,
    departments,
    selfSigned: participants.filter(p => p.source === 'self').length,
  };
}

export const moodTotal = (c: MoodCounts) => MOODS.reduce((a, m) => a + c[m.key], 0);
/** Σ(count × weight) ÷ Σcount to one decimal; null for an empty room because 0 is a real score. */
export function moodScore(c: MoodCounts) {
  const total = moodTotal(c);
  if (!total) return null;
  return Math.round(MOODS.reduce((a, m) => a + c[m.key] * m.weight, 0) / total * 10) / 10;
}
export const moodBand = (score: number | null) => score === null ? null : MOOD_BANDS.find(b => score >= b.min && score <= b.max) || MOOD_BANDS[MOOD_BANDS.length - 1];

/** Points for a 180° gauge split in the sheet's own band proportions. */
export function gaugeGeometry(score: number | null, cx = 100, cy = 100, r = 78) {
  const clamp = Math.min(Math.max(score ?? 0, 0), 100);
  const point = (value: number, radius: number) => {
    const rad = (180 - value / 100 * 180) * Math.PI / 180;
    return { x: cx + Math.cos(rad) * radius, y: cy - Math.sin(rad) * radius };
  };
  return {
    needle: point(clamp, r - 14),
    arcs: MOOD_BANDS.map(b => ({ ...b, start: point(b.key === 'poor' ? 0 : b.min - 1, r), end: point(b.max, r) })),
  };
}

export function coverageStats(topics: TrainingTopic[]) {
  const covered = topics.filter(t => t.covered);
  const sum = (list: TrainingTopic[]) => list.reduce((a, t) => a + t.planned, 0);
  return {
    total: topics.length,
    covered: covered.length,
    pct: topics.length ? Math.round(covered.length / topics.length * 100) : 0,
    plannedMinutes: sum(topics),
    coveredPlannedMinutes: sum(covered),
    actualMinutes: topics.reduce((a, t) => a + (t.minutes || 0), 0),
    skipped: topics.filter(t => !t.covered),
  };
}

export const formatMinutes = (m: number) => m >= 60 ? Math.floor(m / 60) + 'h' + (m % 60 ? ' ' + (m % 60) + 'm' : '') : m + 'm';

/** The VSM deck's own readiness checks for the team step 1 hands to step 4. */
export function charterChecks(participants: Participant[]) {
  const team = participants.filter(p => p.vsm_role && isPresent(p));
  const count = (role: VsmRole) => team.filter(p => p.vsm_role === role).length;
  const teamDepartments = [...new Set(team.map(p => p.department))].sort();
  const stats = rosterStats(participants);
  return [
    { key: 'named', ok: team.length > 0, label: 'A team has been named', detail: team.length ? team.length + ' people carry a charter role.' : 'Nobody on this roster has a charter role yet.' },
    { key: 'mapping', ok: count('mapping-team') >= 2, label: 'The mapping team is more than one person', detail: count('mapping-team') >= 2 ? count('mapping-team') + ' people on the mapping team.' : 'A map drawn by an individual is not a value stream map.' },
    { key: 'cross', ok: teamDepartments.length >= 3, label: 'It crosses departments', detail: teamDepartments.length ? teamDepartments.length + ' departments: ' + teamDepartments.join(', ') + '.' : 'No departments recorded against the team.' },
    { key: 'sponsor', ok: count('sponsor') >= 1, label: 'An executive sponsor is named', detail: count('sponsor') ? 'The person who clears the way is on the charter.' : 'Nobody to unblock the workshop when it stalls.' },
    { key: 'champion', ok: count('champion') >= 1, label: 'A value stream champion is named', detail: count('champion') ? 'The person who owns the stream is on the charter.' : 'Nobody owns the stream between workshops.' },
    { key: 'trained', ok: stats.present >= 3, label: 'Enough of the room was trained', detail: stats.present + ' of ' + stats.total + ' on the register attended.' },
  ];
}

export function charterText(participants: Participant[]) {
  const team = participants.filter(p => p.vsm_role && isPresent(p));
  return VSM_ROLES.map(role => {
    const people = team.filter(p => p.vsm_role === role.key);
    return role.label + ': ' + (people.length ? people.map(p => p.name + ' (' + p.department + ')').join(', ') : '—');
  }).join('\n');
}
