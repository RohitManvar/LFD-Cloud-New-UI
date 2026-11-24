import {Link,useLocation} from 'react-router-dom';
import {ppqNavigation,ppqDescriptions} from '../data/mock';
import {EmptyState,PageHeading,Panel,StatCard} from '../components/UI';
import Icon from '../components/Icon';
import {usePPQ} from '../ppq/State';
import StudyBar from '../ppq/StudyBar';
import Products from '../ppq/Products';
import AnalysisScreen from '../ppq/Analysis';
import Pareto,{ParetoChart} from '../ppq/Pareto';
import Matrix from '../ppq/Matrix';
import {money,percent} from '../ppq/Controls';
import {recommendations} from '../ppq/core/analysis.js';
import '../ppq/ppq.css';
export {PPQProvider} from '../ppq/State';

function Overview() {
 const {study,analysis:a}=usePPQ();
 if(!study)return null;
 const routed=a.rows.filter(p=>p.processCount>0).length;
 const stages=[
  {title:'Product data',detail:a.rows.length+' products',path:'/ppq/products',ready:a.rows.length>0},
  {title:'Product analysis',detail:'Revenue + volume ranking',path:'/ppq/analysis',ready:a.totals.revenue>0||a.totals.qty>0},
  {title:'Pareto analysis',detail:a.totals.vitalFewCount+' revenue Class A products',path:'/ppq/pareto',ready:a.totals.revenue>0||a.totals.qty>0},
  {title:'Process matrix',detail:routed+' / '+a.rows.length+' products routed',path:'/ppq/process-matrix',ready:a.vsiRows.length>0&&a.vsiRows.every(p=>p.processCount>0)}
 ];
 return <>
  <section className="stats-grid pq-stats"><StatCard label="Product portfolio" value={a.rows.length} subline={new Set(a.rows.map(p=>p.group_name).filter(Boolean)).size+' product groups'} icon="Package" to="/ppq/products"/><StatCard label="Annual sales value" value={money(a.totals.revenue)} subline="INR · entire portfolio" icon="CreditCard" to="/ppq/analysis"/><StatCard label="Annual volume" value={new Intl.NumberFormat('en',{notation:'compact',maximumFractionDigits:1}).format(a.totals.qty)} subline="Across all products" icon="TrendingUp" to="/ppq/pareto"/><StatCard label="Process coverage" value={percent(a.rows.length?routed/a.rows.length*100:0)} subline={a.processes.length+' distinct processes'} icon="Workflow" dark to="/ppq/process-matrix"/></section>
  <div className="pq-stage-grid">{stages.map((s,i)=><Link key={s.path} to={s.path} className={'pq-stage'+(s.ready?' ready':'')}><div><span className="pq-kicker">0{i+1}</span><Icon name={s.ready?'CheckCircle2':'ArrowUpRight'} size={19}/></div><h3>{s.title}</h3><p>{s.detail}</p><span>{s.ready?'Data available':'Needs data'}</span></Link>)}</div>
  <div className="pq-two-col"><Panel title="Revenue concentration" subtitle="Annual sales value, ranked highest first"><ParetoChart rows={a.byRevenue} axis="value" limit={12} threshold={a.paretoThreshold}/></Panel><Panel title="Volume concentration" subtitle="Annual quantity, ranked highest first"><ParetoChart rows={a.byQty} axis="qty" limit={12} threshold={a.paretoThreshold}/></Panel></div>
  <Panel title="What your data shows" subtitle="Findings update when products, values or process routes change."><div className="pq-findings">{recommendations(a,[],study).map((r,i)=><div key={i}><span className="pq-finding-number">0{i+1}</span><div><h3>{r.title}</h3><p className="muted">{r.detail}</p></div></div>)}</div></Panel>
  <div className="pq-scope-card"><div><span className="pq-kicker">NEXT · MODULE 03</span><h2>Ready to identify value streams?</h2><p>{a.vsiRows.length} products go forward. Review routes and select a subset in the process matrix.</p></div><Link className="pq-button primary" to="/vsi/grouping">Continue to grouping <Icon name="ArrowRight" size={16}/></Link></div>
 </>;
}
export default function PPQAnalysis() {
 const {pathname}=useLocation(),{study}=usePPQ();
 const index=Math.max(0,ppqNavigation.findIndex(n=>n.path===pathname));
 const current=ppqNavigation[index];
 return <div className="pq-workbench">
  <PageHeading title={pathname==='/ppq'?'Product, Process & Quantity':current.label} description={'MODULE 02 · '+(ppqDescriptions[pathname]||ppqDescriptions['/ppq'])}/>
  <StudyBar/>
  {!study?<Panel><EmptyState title="Start a study for this organization" description="Choose New study above, then add or import the product portfolio."/></Panel>:
   <div className="pq-screen" key={study.id+pathname}>{pathname==='/ppq/products'?<Products/>:pathname==='/ppq/analysis'?<AnalysisScreen/>:pathname==='/ppq/pareto'?<Pareto/>:pathname==='/ppq/process-matrix'?<Matrix/>:<Overview/>}</div>}
  <nav className="risk-step-footer ppq-step-footer" aria-label="PPQ workflow">
   <Link to={index>0?ppqNavigation[index-1].path:'/services'}><Icon name="ArrowLeft" size={16}/><span>Previous<strong>{index>0?ppqNavigation[index-1].label:'All services'}</strong></span></Link>
   <Link to={index<ppqNavigation.length-1?ppqNavigation[index+1].path:'/vsi/grouping'}><span>Next<strong>{index<ppqNavigation.length-1?ppqNavigation[index+1].label:'Module 3 · Value Stream Identification'}</strong></span><Icon name="ArrowRight" size={16}/></Link>
  </nav>
 </div>;
}

