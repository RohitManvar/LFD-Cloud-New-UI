import {useMemo,useState} from 'react';
import {Link} from 'react-router-dom';
import {PageHeading,Panel,EmptyState} from '../components/UI';
import {usePPQ} from './State';
import {suggestFamilies} from './core/analysis.js';
import {Field,money,number,percent} from './Controls';
import {orgName} from './model';
import './ppq.css';
export default function VSIIntake() {
 const {study,analysis}=usePPQ();
 const [threshold,setThreshold]=useState(.6);
 const groups=useMemo(()=>suggestFamilies(analysis.vsiRows,threshold),[analysis,threshold]);
 return <div className="pq-workbench pq-intake">
  <PageHeading title="VSM grouping" description="MODULE 03 · Product scope carried forward from PPQ"/>
  {!study?<Panel><EmptyState title="Choose a PPQ study first"/><Link className="pq-button primary" to="/ppq">Open PPQ</Link></Panel>:<>
   <div className="pq-scope-card"><div><span className="pq-kicker">{orgName(study.org_id)}</span><h2>{study.name}</h2><p>{study.plant} · {study.fiscal_year}</p><p>{analysis.vsiRows.length} of {analysis.rows.length} products in scope · {analysis.rows.some(p=>p.vsi_selected)?'Explicit PPQ selection':'All products included'}</p></div><Link className="pq-button" to="/ppq/process-matrix">Edit product selection</Link></div>
   <Panel title="Group products with similar processes" subtitle="These groups use the current PPQ routes and selection. Missing routes stay ungrouped.">
    <div className="pq-toolbar"><Field label={'Process similarity · '+Math.round(threshold*100)+'%'}><input type="range" min=".1" max="1" step=".05" value={threshold} onChange={e=>setThreshold(Number(e.target.value))}/></Field><span>{groups.families.length} suggested groups · {groups.ungrouped.length} ungrouped</span></div>
    <div className="pq-group-grid">{groups.families.map(f=>{
     const members=analysis.vsiRows.filter(p=>f.member_ids.includes(p.product_id));
     const revenue=members.reduce((s,p)=>s+p.value,0),qty=members.reduce((s,p)=>s+p.qty,0);
     return <article className="pq-family" key={f.member_ids.join('|')}><span className="pq-kicker">{members.length} products · {percent(f.similarity*100)} cohesion</span><h2>{f.name}</h2><p>{number(qty)} annual qty · {money(revenue)} sales value</p><ul>{members.map(p=><li key={p.product_id}><strong>{p.name}</strong><small>{p.route.join(' → ')}</small></li>)}</ul></article>;
    })}</div>
    {!!groups.ungrouped.length&&<div className="pq-notice"><strong>Missing process routes</strong><p>{groups.ungrouped.map(p=>p.name).join(', ')}</p><Link className="pq-text-link" to="/ppq/process-matrix">Complete these routes →</Link></div>}
    {!analysis.vsiRows.length&&<EmptyState title="No products to group" description="Add product data in Module 2 to begin."/>}
   </Panel>
   <p className="muted">Live PPQ handoff preview. Module 3’s remaining draft screens will be refined separately.</p>
  </>}
 </div>;
}

