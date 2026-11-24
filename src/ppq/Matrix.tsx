import Metrics from './Metrics';
import {useEffect,useState} from 'react';
import {Link} from 'react-router-dom';
import {usePPQ} from './State';
import {Button,Confirm,Field,Grade,number,percent} from './Controls';
import {EmptyState,Panel,SearchPill} from '../components/UI';
import {normalizeProcess,processList} from './core/analysis.js';
import Icon from '../components/Icon';
const suggestions=['CUTTING','SHEARING','PUNCHING','BENDING','WELDING','MACHINING','DRILLING','GRINDING','ASSEMBLY','PAINTING','COATING','TESTING','INSPECTION','PACKING'];
const initialFilters={pick:'all',abc:'all',route:'all',group:'all',through:'all',sort:'list'};
function RouteInput({value,label,onSave}:{value:string[];label:string;onSave:(route:string[])=>void}) {
 const [text,setText]=useState(value.join(' > '));
 useEffect(()=>setText(value.join(' > ')),[value]);
 function commit() {const route=processList({processes:text.split(/->|=>|[>;,|\n]+/)});onSave(route);setText(route.join(' > '));}
 return <input className="pq-route-input" aria-label={'Process route for '+label} value={text} placeholder="CUTTING > WELDING > PACKING" onChange={e=>setText(e.target.value)} onBlur={commit} onKeyDown={e=>{if(e.key==='Enter')e.currentTarget.blur();}}/>;
}
export default function Matrix() {
 const {study,analysis:a,changeProducts,updateStudy}=usePPQ();
 const [view,setView]=useState('matrix'),[query,setQuery]=useState(''),[filters,setFilters]=useState(initialFilters),[limit,setLimit]=useState(100),[newProcess,setNewProcess]=useState('');
 const [confirm,setConfirm]=useState<{title:string;detail:string;action:()=>void}|null>(null);
 useEffect(()=>setLimit(100),[query,filters]);
 if(!study)return null;
 const columns=[...new Set([...a.processes,...study.extraProcesses])];
 const groups=[...new Set(a.rows.map(p=>p.group_name).filter(Boolean))].sort();
 const picked=a.rows.filter(p=>p.vsi_selected).length;
 const scope=a.vsiRows,mapped=scope.filter(p=>p.processCount>0).length;
 const filtered=a.rows.filter(p=>{
  return [p.name,p.code,p.group_name].some(v=>v.toLowerCase().includes(query.toLowerCase()))&&
   (filters.pick==='all'||(filters.pick==='picked'?p.vsi_selected:!p.vsi_selected))&&
   (filters.abc==='all'||p.abc===filters.abc)&&
   (filters.route==='all'||(filters.route==='mapped'?p.route.length>0:p.route.length===0))&&
   (filters.group==='all'||p.group_name===filters.group)&&
   (filters.through==='all'||p.route.includes(filters.through));
 }).sort((x,y)=>filters.sort==='revenue'?y.value-x.value:filters.sort==='qty'?y.qty-x.qty:0);
 const visible=filtered.slice(0,limit);
 const shownIds=new Set(filtered.map(p=>p.product_id));
 const allPicked=filtered.length>0&&filtered.every(p=>p.vsi_selected);
 const changeFilter=(k:keyof typeof initialFilters,v:string)=>setFilters(prev=>({...prev,[k]:v}));
 const pickFiltered=(checked:boolean)=>changeProducts(prev=>prev.map(p=>shownIds.has(p.product_id)?{...p,vsi_selected:checked}:p));
 const addProcess=(text:string)=>{const p=normalizeProcess(text);if(p&&!columns.includes(p))updateStudy({extraProcesses:[...study.extraProcesses,p]});setNewProcess('');};
 const setRoute=(id:string,processes:string[])=>updateStudy({extraProcesses:columns,products:study.products.map(p=>p.product_id===id?{...p,processes}:p)});
 return <>
  <div className="pq-scope-card"><div><span className="pq-kicker">CONTINUE TO MODULE 03</span><h2>{scope.length} products in the VSI scope</h2><p>{picked?picked+' explicitly selected':'No selection — all products included'} · {mapped} of {scope.length} with routes · {percent(scope.length?mapped/scope.length*100:0)} ready</p></div><Link className="pq-button primary" to="/vsi/grouping">Review grouping <Icon name="ArrowRight" size={16}/></Link></div>
  <Metrics matrix/><Panel title="Product × process" subtitle="Tick cells in route order. The number in each cell is its position in the route." action={<div className="pq-segments">{['matrix','routes'].map(v=><button key={v} type="button" aria-pressed={view===v} onClick={()=>setView(v)}>{v==='matrix'?'Matrix':'Route text'}</button>)}</div>}>
   <div className="pq-toolbar"><SearchPill value={query} onChange={setQuery} placeholder="Search name, code or group…"/><form className="pq-wrap" onSubmit={e=>{e.preventDefault();addProcess(newProcess);}}><input className="pq-process-input" value={newProcess} onChange={e=>setNewProcess(e.target.value)} aria-label="New process name" placeholder="Add a process column"/><Button type="submit" disabled={!newProcess.trim()}>Add process</Button></form></div>
   {columns.length<6&&<div className="pq-wrap pq-suggestions"><span className="muted">Quick add:</span>{suggestions.filter(p=>!columns.includes(p)).slice(0,8).map(p=><button type="button" key={p} onClick={()=>addProcess(p)}>+ {p}</button>)}</div>}
   <div className="pq-filters">
    <Field label="Selection"><select value={filters.pick} onChange={e=>changeFilter('pick',e.target.value)}><option value="all">All products</option><option value="picked">Selected</option><option value="unpicked">Not selected</option></select></Field>
    <Field label="Revenue ABC"><select value={filters.abc} onChange={e=>changeFilter('abc',e.target.value)}><option value="all">All classes</option>{['A','B','C'].map(g=><option key={g}>{g}</option>)}</select></Field>
    <Field label="Route"><select value={filters.route} onChange={e=>changeFilter('route',e.target.value)}><option value="all">All routes</option><option value="mapped">With a route</option><option value="missing">Missing route</option></select></Field>
    <Field label="Group"><select value={filters.group} onChange={e=>changeFilter('group',e.target.value)}><option value="all">All groups</option>{groups.map(g=><option key={g}>{g}</option>)}</select></Field>
    <Field label="Through process"><select value={filters.through} onChange={e=>changeFilter('through',e.target.value)}><option value="all">Any process</option>{columns.map(c=><option key={c}>{c}</option>)}</select></Field>
    <Field label="Sort by"><select value={filters.sort} onChange={e=>changeFilter('sort',e.target.value)}><option value="list">Product order</option><option value="revenue">Highest revenue</option><option value="qty">Highest quantity</option></select></Field>
   </div>
   <div className="pq-toolbar"><span className="muted">{filtered.length} matching · {picked} selected · {columns.length} processes</span><div className="pq-wrap"><Button onClick={()=>{setQuery('');setFilters(initialFilters);}}>Reset filters</Button><Button disabled={!filtered.length} onClick={()=>pickFiltered(true)}>Select all {filtered.length} matching</Button><Button disabled={!picked} onClick={()=>setConfirm({title:'Clear product selection?',detail:'With no products selected, all products go forward to Module 3.',action:()=>changeProducts(prev=>prev.map(p=>({...p,vsi_selected:false})))})}>Clear selection</Button></div></div>
   {!filtered.length?<EmptyState title={a.rows.length?'No matching products':'Add product data first'}/>:<div className="pq-table-scroll"><table className="pq-table pq-matrix-table"><thead><tr>
    <th className="pq-sticky"><div className="pq-wrap"><input type="checkbox" aria-label="Select all matching products" checked={allPicked} ref={el=>{if(el)el.indeterminate=!allPicked&&filtered.some(p=>p.vsi_selected);}} onChange={e=>pickFiltered(e.target.checked)}/>Product / VSI selection</div></th><th>ABC</th><th>Annual qty</th>
    {view==='matrix'?columns.map(c=><th key={c}><span>{c}</span><button className="pq-remove-process" type="button" aria-label={'Remove process '+c} onClick={()=>setConfirm({title:'Remove '+c+'?',detail:'This column and its step will be removed from every product route in this study.',action:()=>{updateStudy({extraProcesses:study.extraProcesses.filter(p=>p!==c),products:study.products.map(p=>({...p,processes:p.processes.filter(proc=>proc!==c)}))});if(filters.through===c)changeFilter('through','all');}})}>×</button></th>):<th>Ordered process route · separate steps with &gt;</th>}
    <th>Steps</th></tr></thead><tbody>{visible.map(p=><tr key={p.product_id}><td className="pq-sticky"><label className="pq-product-pick"><input type="checkbox" aria-label={'Select '+p.name+' for VSI'} checked={p.vsi_selected} onChange={e=>changeProducts(prev=>prev.map(r=>r.product_id===p.product_id?{...r,vsi_selected:e.target.checked}:r))}/><span><strong>{p.name}</strong><small>{p.code||'No code'} · {p.group_name||'No group'}</small></span></label></td><td><Grade value={p.abc}/></td><td>{number(p.qty)}</td>
     {view==='matrix'?columns.map(c=>{const order=p.route.indexOf(c);return <td key={c} className="pq-matrix-cell"><button type="button" aria-label={c+' for '+p.name+(order>=0?' · step '+(order+1):'')} aria-pressed={order>=0} onClick={()=>setRoute(p.product_id,order>=0?p.route.filter(r=>r!==c):[...p.route,c])}>{order>=0?order+1:'+'}</button></td>}):<td><RouteInput value={p.processes} label={p.name} onSave={r=>setRoute(p.product_id,r)}/></td>}
     <td>{p.processCount}</td></tr>)}</tbody></table></div>}
   <div className="pq-table-footer"><span>{visible.length} of {filtered.length} matching products · routes save automatically</span>{filtered.length>limit&&<div className="pq-wrap"><Button onClick={()=>setLimit(n=>n+100)}>Show 100 more</Button><Button onClick={()=>setLimit(filtered.length)}>Show all</Button></div>}</div>
   {scope.length>mapped&&<p className="pq-notice">{scope.length-mapped} products in the VSI scope have no route. They will remain ungrouped until you add processes.</p>}
  </Panel>
  {confirm&&<Confirm title={confirm.title} detail={confirm.detail} onConfirm={confirm.action} onClose={()=>setConfirm(null)}/>}
 </>;
}



