import { pageDescriptions } from '../data/mock';
import Icon from '../components/Icon';
import { PageHeading, Panel, PillButton } from '../components/UI';
export default function Placeholder({ title }: { title: string }) {
  return <><PageHeading title={title} description={pageDescriptions[title] || 'Find your way back to your workspace'} /><Panel className="placeholder-panel"><span className="placeholder-icon"><Icon name="PanelsTopLeft" size={32} /></span><p className="eyebrow">LFD CLOUD</p><h2>{title === 'Page not found' ? 'This page is not available' : 'Design coming soon'}</h2><p className="muted">A little more clarity. A little less complexity.<br />Your next workspace experience is taking shape.</p><PillButton to="/home" icon="ArrowLeft">Back to dashboard</PillButton></Panel></>;
}
