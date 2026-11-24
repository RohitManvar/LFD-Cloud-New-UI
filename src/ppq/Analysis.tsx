import {useState} from 'react';
import Metrics from './Metrics';
import {downloadAnalysis} from './Export';
import {Panel,EmptyState,SearchPill} from '../components/UI';
import {usePPQ} from './State';
import {Button,Grade,number,percent} from './Controls';
import type {AnalysisRow} from './core/analysis.js';

const columns:{key:keyof AnalysisRow;label:string}[]=[
 {key:'name',label:'Product'},{key:'code',label:'Code'},{key:'qty',label:'Annual qty'},{key:'qtyPct',label:'Volume %'},
 {key:'qtyRank',label:'Volume rank'},{key:'value',label:'Sales value · INR'},{key:'revenuePct',label:'Revenue %'},
 {key:'revenueRank',label:'Revenue rank'},{key:'processCount',label:'Processes'},{key:'abc',label:'ABC'}
];
export default function AnalysisScreen() {
 const {analysis,study}=usePPQ();
 const [grade,setGrade]=useState('All'),[query,setQuery]=useState(''),[sort,setSort]=useState<keyof AnalysisRow>('value'),[asc,setAsc]=useState(false);
 const [limit,setLimit]=useState(100);
 const rows=analysis.rows.filter(p=>(grade==='All'||p.abc===grade)&&[p.name,p.code,p.group_name].some(v=>v.toLowerCase().includes(query.toLowerCase()))).sort((a,b)=>{
  const x=a[sort],y=b[sort];const c=typeof x==='number'&&typeof y==='number'?x-y:String(x).localeCompare(String(y));return asc?c:-c;
 });
 return <><Metrics/><Panel title="Every product, two perspectives" subtitle="Volume shows the work. Sales value shows the business contribution. ABC is based on cumulative revenue.">
  <div className="pq-toolbar"><div className="pq-segments" aria-label="Filter by revenue ABC class">{['All','A','B','C'].map(g=><button key={g} type="button" aria-pressed={grade===g} onClick={()=>{setGrade(g);setLimit(100);}}>{g==='All'?'All products':'Class '+g}<span>{g==='All'?analysis.rows.length:analysis.rows.filter(p=>p.abc===g).length}</span></button>)}</div><SearchPill value={query} onChange={q=>{setQuery(q);setLimit(100);}} placeholder="Find a product…"/></div>
  {!analysis.totals.revenue&&<p className="pq-notice">No sales value recorded. Revenue shares are 0%; add values in Product Data before interpreting revenue ABC. Volume rankings still work.</p>}
  {!rows.length?<EmptyState title={analysis.rows.length?'No matching products':'No product data yet'}/>:<div className="pq-table-scroll"><table className="pq-table"><thead><tr>{columns.map(c=><th key={c.key} aria-sort={sort===c.key?(asc?'ascending':'descending'):'none'}><button type="button" onClick={()=>{if(sort===c.key)setAsc(!asc);else{setSort(c.key);setAsc(['name','code','abc'].includes(c.key));}}}>{c.label} {sort===c.key?(asc?'↑':'↓'):'↕'}</button></th>)}</tr></thead><tbody>
   {rows.slice(0,limit).map(p=><tr key={p.product_id}><td><strong>{p.name}</strong><small>{p.group_name}</small></td><td className="mono">{p.code||'—'}</td><td>{number(p.qty)} <small>{p.uom}</small></td><td>{percent(p.qtyPct)}</td><td>#{p.qtyRank}</td><td>{number(p.value)}</td><td>{percent(p.revenuePct)}</td><td>#{p.revenueRank}</td><td>{p.processCount}</td><td><Grade value={p.abc}/></td></tr>)}
  </tbody><tfoot><tr><td colSpan={2}>Total · {rows.length} products</td><td>{number(rows.reduce((s,p)=>s+p.qty,0))}</td><td>{percent(rows.reduce((s,p)=>s+p.qtyPct,0))}</td><td></td><td>{number(rows.reduce((s,p)=>s+p.value,0))}</td><td>{percent(rows.reduce((s,p)=>s+p.revenuePct,0))}</td><td colSpan={3}></td></tr></tfoot></table></div>}
  <div className="pq-toolbar"><p className="muted">Ranks and percentages stay relative to the whole portfolio when filters change.</p><Button disabled={!rows.length} onClick={()=>downloadAnalysis(rows,study?.name||"PPQ")}>Export table as CSV</Button></div>
  <div className="pq-table-footer"><span>{rows.length} matching products · Class A ≤ {analysis.paretoThreshold}% · B ≤ 95% · C &gt; 95%</span>{rows.length>limit&&<Button onClick={()=>setLimit(n=>n+100)}>Show 100 more</Button>}</div>
 </Panel></>;
}


