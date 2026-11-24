import { modules, pageDescriptions, services } from '../data/mock';
import Icon from '../components/Icon';
import { IconCircleButton, Meter, PageHeading, Panel, PillButton } from '../components/UI';
import { usePreview } from '../components/PreviewDialog';
export default function Services() {
  const preview = usePreview();
  return <>
    <PageHeading description={pageDescriptions.Services} title="LFD Methodology" actions={<PillButton variant="blue" icon="ArrowRight" onClick={() => document.getElementById('step-1')?.focus()}>Start at Step 1</PillButton>}>
      <Meter label="AI-assisted steps" used={services.filter(s => s.ai).length} limit={services.length} left={<><b>9</b> manual</>} right={<><b>40%</b> with AI</>} />
    </PageHeading>
    <div className="section-heading"><div><h2>LFD Framework</h2><p className="muted">15 steps, in the order they are run</p></div><span className="mono muted">01 — 15</span></div>
    <div className="service-grid">{services.map(service => <article id={'step-' + service.step} tabIndex={-1} className={'service-card lift ' + (service.step === 1 ? 'first-step training-service-card' : service.step === 14 ? 'risk-service-card' : service.step === 2 ? 'ppq-service-card' : service.step === 3 ? 'vsi-service-card' : service.step === 4 ? 'vsm-service-card' : service.step === 5 ? 'flow-service-card' : service.step === 6 ? 'capacity-service-card' : service.step === 7 ? 'equipment-service-card' : service.step === 8 ? 'manpower-service-card' : service.step === 9 ? 'supply-service-card' : service.step === 10 ? 'supermarket-service-card' : service.step === 11 ? 'mh-service-card' : service.step === 12 ? 'layout-service-card' : service.step === 13 ? 'visual-service-card' : service.step === 15 ? 'project-service-card' : '')} key={service.step}>
      <div className="between"><div className="icon-box"><Icon name={service.icon} size={23} /></div><span className="step-number">{String(service.step).padStart(2, '0')}</span></div>
      <h3>{service.title}</h3><p>{service.short}</p>
      <div className="service-bottom"><div>{service.step === 1 && <span className="start-chip">Start here</span>}{service.ai && <span className="ai-chip"><Icon name="Sparkles" size={13} />AI-assisted</span>}</div><IconCircleButton to={service.step === 1 ? '/training' : service.step === 4 ? '/vsm' : service.step === 5 ? '/flow-management' : service.step === 14 ? '/risk' : service.step === 2 ? '/ppq' : service.step === 3 ? '/vsi' : service.step === 6 ? '/capacity' : service.step === 7 ? '/equipment' : service.step === 8 ? '/manpower' : service.step === 9 ? '/supply-chain' : service.step === 10 ? '/supermarket' : service.step === 11 ? '/material-handling' : service.step === 12 ? '/layout-design' : service.step === 13 ? '/visual' : service.step === 15 ? '/project-plan' : undefined} label={'Open ' + service.title} onClick={() => preview(service.title, service.short)} /></div>
    </article>)}</div>
    <Panel title="Supporting modules" subtitle="Outside the sequence — open them whenever a project needs them" className="supporting-panel">
      <div className="module-grid">{modules.map(module => <button className="module-tile" key={module.title} onClick={() => preview(module.title, module.short)}><div className="between"><Icon name={module.icon} size={22} /><Icon name="ArrowUpRight" size={17} /></div><h3>{module.title}</h3><p className="muted">{module.short}</p></button>)}</div>
    </Panel>
  </>;
}

