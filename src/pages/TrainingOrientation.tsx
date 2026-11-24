import { createContext, useContext, useState, type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { trainingDescriptions, trainingNavigation } from '../data/mock';
import {
  ATTENDANCE_OPTIONS, DECKS, MOODS, VSM_ROLES, charterChecks, charterText, coverageStats, formatMinutes, gaugeGeometry, isPresent,
  moodBand, moodScore, moodTotal, rosterStats, trainingMood, trainingMoodSelf, trainingParticipants, trainingSession, trainingTopics,
  type Attendance, type MoodCounts, type MoodKey, type Participant, type TrainingTopic, type VsmRole,
} from '../data/trainingModel';
import Icon from '../components/Icon';
import { IconCircleButton, PageHeading, Panel, PillButton, StatCard } from '../components/UI';
import { usePreview } from '../components/PreviewDialog';
import { DistributionBars, FocusList, HeroMark, ModuleContext, NextStep, Readiness, ResultCard, StepFooter, type ChipTone, type FocusItem } from '../components/ModulePattern';

interface TrainingContextType {
  participants: Participant[];
  setParticipants: React.Dispatch<React.SetStateAction<Participant[]>>;
  topics: TrainingTopic[];
  setTopics: React.Dispatch<React.SetStateAction<TrainingTopic[]>>;
  mood: MoodCounts;
  setMood: React.Dispatch<React.SetStateAction<MoodCounts>>;
}
const TrainingContext = createContext<TrainingContextType>({
  participants: trainingParticipants, setParticipants: () => {},
  topics: trainingTopics, setTopics: () => {},
  mood: trainingMood, setMood: () => {},
});
export function TrainingProvider({ children }: { children: ReactNode }) {
  const [participants, setParticipants] = useState(trainingParticipants);
  const [topics, setTopics] = useState(trainingTopics);
  const [mood, setMood] = useState(trainingMood);
  return <TrainingContext.Provider value={{ participants, setParticipants, topics, setTopics, mood, setMood }}>{children}</TrainingContext.Provider>;
}

function MoodGauge({ score }: { score: number | null }) {
  const g = gaugeGeometry(score);
  const band = moodBand(score);
  return <div className="training-gauge">
    <svg viewBox="0 0 200 116" role="img" aria-label={'Mood score ' + (score ?? 'not recorded')}>
      {g.arcs.map(a => <path key={a.key} d={`M ${a.start.x} ${a.start.y} A 78 78 0 0 1 ${a.end.x} ${a.end.y}`} stroke={a.color} strokeWidth="16" fill="none" opacity={band?.key === a.key ? 1 : .28} />)}
      {score !== null && <line x1="100" y1="100" x2={g.needle.x} y2={g.needle.y} stroke="var(--ink)" strokeWidth="3" strokeLinecap="round" />}
      <circle cx="100" cy="100" r="6" fill="var(--ink)" />
    </svg>
    <div className="training-gauge-value"><strong>{score ?? '—'}</strong><span style={{ color: band?.color }}>{band?.label || 'No responses yet'}</span></div>
  </div>;
}

/** Decorative stand-in for the session's sign-in QR: three finder squares and a seeded module pattern. */
function JoinQr({ code }: { code: string }) {
  const size = 21;
  let seed = [...code].reduce((a, c) => a * 31 + c.charCodeAt(0), 7);
  const rand = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; };
  const finder = (x: number, y: number) => (x < 7 && y < 7) || (x >= size - 7 && y < 7) || (x < 7 && y >= size - 7);
  const cells: ReactNode[] = [];
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    if (finder(x, y)) continue;
    if (rand() > .52) cells.push(<rect key={x + '-' + y} x={x} y={y} width="1" height="1" />);
  }
  const square = (x: number, y: number) => <g key={x + ':' + y}><rect x={x} y={y} width="7" height="7" /><rect x={x + 1} y={y + 1} width="5" height="5" fill="var(--surface)" /><rect x={x + 2} y={y + 2} width="3" height="3" /></g>;
  return <svg className="training-qr" viewBox={`-1 -1 ${size + 2} ${size + 2}`} role="img" aria-label={'Sign-in QR for session ' + code} shapeRendering="crispEdges">
    <rect x="-1" y="-1" width={size + 2} height={size + 2} fill="var(--surface)" />
    <g fill="var(--ink)">{square(0, 0)}{square(size - 7, 0)}{square(0, size - 7)}{cells}</g>
  </svg>;
}

function TrainingOverview() {
  const { participants, topics, mood } = useContext(TrainingContext);
  const roster = rosterStats(participants);
  const coverage = coverageStats(topics);
  const score = moodScore(mood);
  const band = moodBand(score);
  const checks = charterChecks(participants);
  const failing = checks.filter(c => !c.ok);
  const absent = participants.filter(p => p.attendance === 'absent');
  const deckTitle = (t: TrainingTopic) => DECKS.find(d => d.key === t.deck)?.title;
  const focus: FocusItem[] = [
    ...failing.map(c => ({ key: c.key, title: c.label, meta: c.detail, value: '!', chip: { tone: 'critical' as ChipTone, label: 'Charter gap' }, to: '/training/attendance' })),
    ...coverage.skipped.map(t => ({ key: t.key, title: t.title, meta: deckTitle(t) + ' · slides ' + t.slides, value: t.planned + 'm', chip: { tone: 'high' as ChipTone, label: 'Skipped' }, to: '/training/curriculum' })),
    ...absent.map(p => ({ key: p.id, title: p.name + ' missed the session', meta: p.designation + ' · ' + p.department, value: '—', chip: { tone: 'medium' as ChipTone, label: 'Absent' }, to: '/training/attendance' })),
  ].slice(0, 4);
  const nextStep = failing.length ? 'Close the charter gap — ' + failing[0].label.toLowerCase() + ' — while the room is still together.'
    : coverage.skipped.length ? 'Cover ' + coverage.skipped.map(t => t.title).join(' and ') + ' before the mapping workshop in Step 04.'
    : 'Send the session pack and move on to Step 02 · PPQ.';
  const byDepartment = roster.departments.map(d => ({ label: d, value: participants.filter(p => p.department === d && isPresent(p)).length })).sort((a, b) => b.value - a.value).slice(0, 6);
  return <>
    <section className="stats-grid" aria-label="Training summary">
      <StatCard label="Attendance" value={roster.present} suffix={'/' + roster.total} subline={roster.attendancePct + '% · ' + roster.departments.length + ' departments'} icon="UserCheck" to="/training/attendance" />
      <StatCard label="Mood score" value={score ?? '—'} suffix="/100" subline={(band?.label || 'No responses') + ' · ' + moodTotal(mood) + ' responses'} icon="Smile" dark to="/training/attendance" />
      <StatCard label="Curriculum covered" value={coverage.pct} suffix="%" subline={coverage.covered + ' of ' + coverage.total + ' modules'} icon="BookOpen" to="/training/curriculum" />
      <StatCard label="Time in the room" value={formatMinutes(coverage.actualMinutes)} subline={'Planned ' + formatMinutes(coverage.coveredPlannedMinutes) + ' for what was covered'} icon="Clock" to="/training/curriculum" />
    </section>
    <div className="mod-overview-grid">
      <Panel title="Where to focus" subtitle="What the session left open, worst first" action={<PillButton small to="/training/curriculum">View all<Icon name="ArrowUpRight" size={14} /></PillButton>}>
        {focus.length ? <FocusList items={focus} /> : <p className="muted">Nothing left open — every module covered and the whole room attended.</p>}
        <NextStep>{nextStep}</NextStep>
      </Panel>
      <Panel title="How the room found it" subtitle={moodTotal(mood) + ' responses · ' + trainingMoodSelf + ' from phones'}>
        <div className="mod-visual"><MoodGauge score={score} /><DistributionBars rows={MOODS.map(m => ({ label: m.emoji + ' ' + m.label, value: mood[m.key], color: m.color }))} /></div>
      </Panel>
    </div>
    <div className="mod-bottom-grid">
      <Panel title="Who was in the room" subtitle={roster.present + ' present across ' + roster.departments.length + ' departments'}><DistributionBars rows={byDepartment} /></Panel>
      <Panel title="Ready to map?" subtitle="A few details make the mapping workshop easier"><Readiness items={[
        { icon: 'BookOpen', title: coverage.skipped.length ? coverage.skipped.length + ' modules skipped' : 'Every module covered', detail: coverage.skipped.length ? 'Cover them before the value stream workshop.' : 'Both decks delivered in full.', to: '/training/curriculum' },
        { icon: 'Users', title: absent.length + ' people absent', detail: 'No certificate until they attend a catch-up.', to: '/training/attendance' },
        { icon: 'CheckCircle2', title: 'Charter team: ' + (checks.length - failing.length) + ' of ' + checks.length + ' checks pass', detail: 'Mapping team, sponsor and champion carry into Step 04.', to: '/training/report' },
      ]} /></Panel>
      <ResultCard icon="Smile" label="Mood score" value={score ?? '—'} suffix="/100" detail={(band?.label || 'No responses yet') + ' · weighted across ' + moodTotal(mood) + ' responses on the session’s own five-point scale.'} cta={{ label: 'Review the report', to: '/training/report' }} />
    </div>
  </>;
}

function CurriculumView() {
  const { topics, setTopics } = useContext(TrainingContext);
  const coverage = coverageStats(topics);
  const update = (key: string, patch: Partial<TrainingTopic>) => setTopics(list => list.map(t => t.key === key ? { ...t, ...patch } : t));
  const variance = coverage.actualMinutes - coverage.coveredPlannedMinutes;
  return <>
    <section className="stats-grid" aria-label="Curriculum summary">
      <StatCard label="Modules covered" value={coverage.covered} suffix={'/' + coverage.total} subline={coverage.pct + '% of both decks'} icon="CheckCircle2" />
      <StatCard label="Skipped" value={coverage.skipped.length} subline={coverage.skipped.length ? formatMinutes(coverage.skipped.reduce((a, t) => a + t.planned, 0)) + ' of planned content' : 'Nothing left out'} icon="CircleAlert" hatched />
      <StatCard label="Actual time" value={formatMinutes(coverage.actualMinutes)} subline={'Against ' + formatMinutes(coverage.coveredPlannedMinutes) + ' planned'} icon="Clock" />
      <StatCard label="Over / under plan" value={(variance > 0 ? '+' : '') + variance + 'm'} subline={variance > 0 ? 'Ran long — quote more next time' : 'On or under plan'} icon="TrendingUp" dark />
    </section>
    {DECKS.map(deck => {
      const rows = topics.filter(t => t.deck === deck.key);
      const done = rows.filter(t => t.covered).length;
      return <Panel key={deck.key} title={deck.title} subtitle={deck.file + ' · ' + deck.slides + ' slides · ' + done + ' of ' + rows.length + ' modules covered'}>
        <div className="table-scroll" tabIndex={0} role="region" aria-label={deck.title + ' modules'}><table className="training-table">
          <thead><tr><th>Covered</th><th>Module</th><th>Slides</th><th>Planned</th><th>Actual (min)</th></tr></thead>
          <tbody>{rows.map(t => <tr key={t.key} className={t.covered ? '' : 'skipped'}>
            <td><label className="training-toggle"><input type="checkbox" checked={t.covered} onChange={e => update(t.key, { covered: e.target.checked, minutes: e.target.checked ? (t.minutes ?? t.planned) : null })} /><span className="sr-only">Covered {t.title}</span></label></td>
            <th scope="row">{t.title}<small>{t.blurb}</small></th>
            <td className="mono">{t.slides}</td>
            <td className="mono">{t.planned}m</td>
            <td><input className="training-minutes" type="number" min={0} aria-label={'Actual minutes for ' + t.title} disabled={!t.covered} value={t.minutes ?? ''} onChange={e => update(t.key, { minutes: e.target.value === '' ? null : Math.max(0, Number(e.target.value)) })} /></td>
          </tr>)}</tbody>
        </table></div>
      </Panel>;
    })}
  </>;
}

function AttendanceView() {
  const { participants, setParticipants, mood, setMood } = useContext(TrainingContext);
  const preview = usePreview();
  const roster = rosterStats(participants);
  const score = moodScore(mood);
  const total = moodTotal(mood);
  const max = Math.max(1, ...MOODS.map(m => mood[m.key]));
  const update = (id: string, patch: Partial<Participant>) => setParticipants(list => list.map(p => p.id === id ? { ...p, ...patch } : p));
  const bump = (key: MoodKey, by: number) => setMood(m => ({ ...m, [key]: Math.max(0, m[key] + by) }));
  return <>
    <div className="training-two-col join-row">
      <Panel title="Sign in from a phone" subtitle="Scan, sign the register and leave a mood in one visit">
        <div className="training-join"><JoinQr code={trainingSession.joinCode} /><div className="training-join-copy">
          <span className="muted">Join code</span><strong className="mono">{trainingSession.joinCode}</strong>
          <p className="muted">{roster.selfSigned} of {roster.total} signed in on their own phone; the trainer added the rest.</p>
          <div className="training-join-actions"><PillButton small icon="Download" onClick={() => preview('Download QR poster', 'A printable A4 poster with the QR and join code for the training room.')}>QR poster</PillButton><PillButton small icon="Copy" onClick={() => preview('Copy join link', 'lfd.cloud/join/' + trainingSession.joinCode)}>Copy link</PillButton></div>
        </div></div>
      </Panel>
      <Panel title="Mood meter" subtitle={total + ' responses · ' + trainingMoodSelf + ' from phones, ' + Math.max(0, total - trainingMoodSelf) + ' by show of hands'}>
        <div className="training-mood">
          <MoodGauge score={score} />
          <div className="training-mood-bars">{MOODS.map(m => <div key={m.key} className="training-mood-row">
            <span className="training-mood-label"><span aria-hidden="true">{m.emoji}</span>{m.label}<small className="mono muted">×{m.weight}</small></span>
            <div className="training-mood-track"><span style={{ width: mood[m.key] / max * 100 + '%', background: m.color }} /></div>
            <div className="training-stepper"><button type="button" aria-label={'Remove one ' + m.label} onClick={() => bump(m.key, -1)}><Icon name="Minus" size={13} /></button><span className="mono">{mood[m.key]}</span><button type="button" aria-label={'Add one ' + m.label} onClick={() => bump(m.key, 1)}><Icon name="Plus" size={13} /></button></div>
          </div>)}</div>
        </div>
      </Panel>
    </div>
    <Panel title="Register" subtitle={roster.present + ' present · ' + roster.partial + ' part day · ' + roster.absent + ' absent · ' + roster.departments.length + ' departments'} action={<div className="inline"><PillButton small icon="Upload" onClick={() => preview('Import roster', 'Upload the client attendance sheet (.xlsx) — names, departments and designations are matched automatically.')}>Import</PillButton><PillButton small icon="Plus" variant="dark" onClick={() => preview('Add participant', 'Add someone who could not sign in from a phone.')}>Add participant</PillButton></div>}>
      <div className="table-scroll" tabIndex={0} role="region" aria-label="Attendance register"><table className="training-table register">
        <thead><tr><th>Name</th><th>Department</th><th>Attendance</th><th>VSM charter role</th><th>Signed in</th></tr></thead>
        <tbody>{participants.map(p => <tr key={p.id} className={p.attendance === 'absent' ? 'skipped' : ''}>
          <th scope="row">{p.name}<small>{p.designation}</small></th>
          <td>{p.department}</td>
          <td><div className="training-segment" role="group" aria-label={'Attendance for ' + p.name}>{ATTENDANCE_OPTIONS.map(o => <button key={o.key} type="button" aria-pressed={p.attendance === o.key} className={p.attendance === o.key ? 'on ' + o.key : ''} onClick={() => update(p.id, { attendance: o.key as Attendance })}>{o.label}</button>)}</div></td>
          <td><select className="training-select" aria-label={'VSM role for ' + p.name} value={p.vsm_role} onChange={e => update(p.id, { vsm_role: e.target.value as VsmRole })}><option value="">—</option>{VSM_ROLES.map(r => <option key={r.key} value={r.key}>{r.label}</option>)}</select></td>
          <td className="mono">{p.signed_in}{p.source === 'self' && p.attendance !== 'absent' && <Icon name="QrCode" size={12} className="training-self-icon" />}</td>
        </tr>)}</tbody>
      </table></div>
    </Panel>
  </>;
}

function ReportView() {
  const { participants, topics, mood } = useContext(TrainingContext);
  const preview = usePreview();
  const [copied, setCopied] = useState(false);
  const roster = rosterStats(participants);
  const coverage = coverageStats(topics);
  const score = moodScore(mood);
  const band = moodBand(score);
  const checks = charterChecks(participants);
  const certificates = participants.filter(isPresent);
  const team = participants.filter(p => p.vsm_role && isPresent(p));
  const copyCharter = async () => {
    try { await navigator.clipboard.writeText(charterText(participants)); setCopied(true); setTimeout(() => setCopied(false), 1800); }
    catch { preview('Charter team', charterText(participants)); }
  };
  const pack = [
    { icon: 'UserCheck', title: 'Attendance', detail: roster.present + ' of ' + roster.total + ' attended (' + roster.attendancePct + '%) across ' + roster.departments.length + ' departments.' },
    { icon: 'Smile', title: 'Mood meter', detail: moodTotal(mood) + ' responses, scoring ' + (score ?? '—') + (band ? ' (' + band.label + ')' : '') + '.' },
    { icon: 'BookOpen', title: 'Coverage', detail: coverage.covered + ' of ' + coverage.total + ' modules in ' + formatMinutes(coverage.actualMinutes) + (coverage.skipped.length ? '; skipped: ' + coverage.skipped.map(t => t.title).join(', ') + '.' : '.') },
    { icon: 'Award', title: 'Certificates', detail: certificates.length + ' certificates of participation, one per person present.' },
  ];
  return <>
    <div className="training-two-col">
      <Panel title="Session pack" subtitle={trainingSession.client + ' · ' + trainingSession.dates} action={<PillButton small variant="dark" icon="Download" onClick={() => preview('Download session pack', 'A single PDF: cover, attendance register, mood gauge, curriculum coverage and the charter team.')}>Download PDF</PillButton>}>
        <div className="training-pack">{pack.map(item => <div key={item.title} className="training-pack-row"><span className="training-step-icon"><Icon name={item.icon} size={18} /></span><div><h3>{item.title}</h3><p className="muted">{item.detail}</p></div><Icon name="Check" size={16} className="training-pack-check" /></div>)}</div>
      </Panel>
      <Panel title="VSM charter team" subtitle={'Carried into Step 04 · ' + checks.filter(c => c.ok).length + ' of ' + checks.length + ' checks pass'} action={<PillButton small icon={copied ? 'Check' : 'Copy'} onClick={copyCharter}>{copied ? 'Copied' : 'Copy team'}</PillButton>}>
        <div className="training-charter">{VSM_ROLES.map(role => {
          const people = team.filter(p => p.vsm_role === role.key);
          return <div key={role.key}><span className="muted">{role.label}<small> · {role.hint}</small></span><p>{people.length ? people.map(p => p.name).join(', ') : <em className="muted">Not named yet</em>}</p></div>;
        })}</div>
        <PillButton small to="/ppq" icon="ArrowRight">Continue to Step 02 · PPQ</PillButton>
      </Panel>
    </div>
    <Panel title="Certificates" subtitle={certificates.length + ' people present · absentees get none'} action={<PillButton small icon="Award" onClick={() => preview('Download certificates', certificates.length + ' certificates of participation as one PDF, one page each.')}>Download all</PillButton>}>
      <div className="training-cert-grid">{certificates.map(p => <div key={p.id} className="training-cert"><span className="org-initial">{p.name.split(' ').map(w => w[0]).join('').slice(0, 2)}</span><div className="row-copy"><h3>{p.name}</h3><p className="muted">{p.designation} · {p.department}</p></div><IconCircleButton icon="Download" label={'Certificate for ' + p.name} onClick={() => preview('Certificate of participation', p.name + ' — Lean Foundations & Value Stream Mapping, ' + trainingSession.dates + '.')} /></div>)}</div>
    </Panel>
  </>;
}

export default function TrainingOrientation() {
  const location = useLocation();
  const preview = usePreview();
  const subPath = location.pathname.replace('/training', '') || '/';
  const active = trainingNavigation.find(n => n.path === location.pathname) || trainingNavigation[0];
  const isOverview = subPath === '/';
  return <>
    <PageHeading title={isOverview ? 'Training & Orientation' : active.label} description={trainingDescriptions[location.pathname] || trainingDescriptions['/training']}
      actions={isOverview ? <><PillButton variant="blue" icon="QrCode" onClick={() => preview('Start live session', 'Opens the sign-in QR full screen for the training room and starts collecting attendance and moods.')}>Start live session</PillButton><PillButton icon="Download" onClick={() => preview('Training deck', 'Lean Foundations (47 slides) and Value Stream Mapping (129 slides).')}>Training decks</PillButton></> : undefined}>
      {isOverview && <HeroMark icon="GraduationCap" step="01" />}
    </PageHeading>
    <ModuleContext org={trainingSession.client} name={'Lean Foundations & VSM orientation · ' + trainingSession.dates} site="Chakan MIDC, Pune" label="Sample session" />
    {isOverview && <TrainingOverview />}
    {subPath === '/curriculum' && <CurriculumView />}
    {subPath === '/attendance' && <AttendanceView />}
    {subPath === '/report' && <ReportView />}
    <StepFooter nav={trainingNavigation} pathname={location.pathname} label="Training steps" />
  </>;
}
