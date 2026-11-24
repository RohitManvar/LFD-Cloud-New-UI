import {useState} from 'react';
import {Panel,EmptyState,StatCard} from '../components/UI';
import {usePPQ} from './State';
import {Field,Grade,money,number,percent} from './Controls';
import {coverage} from './model';
import type {ParetoRow} from './core/analysis.js';
export function ParetoChart({rows,axis,limit=20,threshold=80}:{rows:ParetoRow[];axis:'value'|'qty';limit?:number;threshold?:number}) {
 const shown=rows.slice(0,limit),max=Math.max(...rows.map(r=>r[axis]),0);
 if(!shown.length||max===0)return <EmptyState title={'No '+(axis==='value'?'sales values':'quantities')+' recorded'} description="Add data in Product Data to draw this chart."/>;
 const width=Math.max(580,shown.length*44+90),left=64,right=45,top=24,bottom=205,plot=width-left-right,step=plot/shown.length;
 const points=shown.map((p,i)=>(left+(i+.5)*step)+','+(bottom-p.cumPct/100*(bottom-top))).join(' ');
 return <>
  <div className="pq-chart-scroll"><svg viewBox={'0 0 '+width+' 270'} style={{minWidth:width}} role="img" aria-label={(axis==='value'?'Revenue':'Volume')+' Pareto: bars show annual totals, purple line shows cumulative share.'}>
   {[0,25,50,75,100].map(n=><g key={n}><line x1={left} x2={width-right} y1={bottom-n/100*(bottom-top)} y2={bottom-n/100*(bottom-top)} stroke="var(--border)" strokeDasharray="3 5"/><text x={width-right+8} y={bottom-n/100*(bottom-top)+4} fontSize="10" fill="var(--muted)">{n}%</text><text x={left-8} y={bottom-n/100*(bottom-top)+4} fontSize="10" textAnchor="end" fill="var(--muted)">{axis==='value'?money(max*n/100):new Intl.NumberFormat('en',{notation:'compact'}).format(max*n/100)}</text></g>)}
   <line x1={left} x2={width-right} y1={bottom-threshold/100*(bottom-top)} y2={bottom-threshold/100*(bottom-top)} stroke="var(--ppq-accent)" strokeDasharray="6 4"/>
   {shown.map((p,i)=><g key={p.product_id} tabIndex={0} aria-label={p.name+': '+number(p[axis])+', cumulative '+percent(p.cumPct)+', class '+p.abc}>
    <title>{p.name+' · '+number(p[axis])+' · cumulative '+percent(p.cumPct)+' · '+p.abc}</title>
    <rect x={left+i*step+step*.16} y={bottom-p[axis]/max*(bottom-top)} width={step*.68} height={p[axis]/max*(bottom-top)} rx="4" fill={axis==='value'?'#2a78d6':'#eb6834'}/>
    <text transform={'translate('+(left+(i+.5)*step)+','+(bottom+15)+') rotate(-35)'} textAnchor="end" fontSize="10" fill="var(--muted)">{p.code||'#'+(i+1)}</text>
   </g>)}
   <polyline points={points} fill="none" stroke="#7c3aed" strokeWidth="2.5"/>
   {shown.map((p,i)=><circle key={p.product_id} cx={left+(i+.5)*step} cy={bottom-p.cumPct/100*(bottom-top)} r="3" fill="#7c3aed"/>)}
  </svg></div>
  <div className="pq-chart-legend"><span><i style={{background:axis==='value'?'#2a78d6':'#eb6834'}}/>Annual {axis==='value'?'sales value':'quantity'}</span><span><i style={{background:'#7c3aed'}}/>Cumulative %</span><span>Dashed line: {threshold}% cut</span></div>
  <p className="muted">Showing {shown.length} of {rows.length} products. Shares use the complete portfolio.</p>
 </>;
}
function VitalTable({rows,axis}:{rows:ParetoRow[];axis:'value'|'qty'}) {
 const vital=rows.filter(p=>p.abc==='A');
 return <Panel title={'Class A · '+(axis==='value'?'revenue':'volume')} subtitle={vital.length+' products inside the cumulative cut'}>
  {!vital.length?<EmptyState title="No products inside this cut" description="The first product may already cross the threshold. Review the chart and coverage metrics."/>:
  <div className="pq-table-scroll"><table className="pq-table"><thead><tr><th>Product</th><th>{axis==='value'?'Sales value · INR':'Annual qty'}</th><th>Share</th><th>Cumulative</th><th>ABC</th></tr></thead><tbody>{vital.map(p=><tr key={p.product_id}><td>{p.name}<small>{p.code}</small></td><td>{number(p[axis])}</td><td>{percent(axis==='value'?p.revenuePct:p.qtyPct)}</td><td>{percent(p.cumPct)}</td><td><Grade value={p.abc}/></td></tr>)}</tbody></table></div>}
 </Panel>;
}
export default function Pareto() {
 const {analysis:a}=usePPQ(),[limit,setLimit]=useState(20);
 const rev=coverage(a.byRevenue,a.paretoThreshold),qty=coverage(a.byQty,a.paretoThreshold);
 const volumeA=new Set(a.byQty.filter(p=>p.abc==='A').map(p=>p.product_id));
 const both=a.byRevenue.filter(p=>p.abc==='A'&&volumeA.has(p.product_id));
 return <>
  <section className="stats-grid pq-stats"><StatCard label="Revenue coverage" value={rev.count} subline={'products cover '+percent(rev.pct)} icon="CreditCard"/><StatCard label="Volume coverage" value={qty.count} subline={'products cover '+percent(qty.pct)} icon="Package"/><StatCard label="Lead on both axes" value={a.totals.revenue>0&&a.totals.qty>0?both.length:0} subline="Class A on revenue and volume" icon="Target"/><StatCard label="Pareto cut" value={a.paretoThreshold+'%'} subline="Class B ends at 95%" dark icon="BarChart3"/></section>
  <div className="pq-section-heading"><p className="muted">Coverage includes the product crossing the cut. Class A follows the main app rule: cumulative share must be at or below the cut.</p><Field label="Products per chart"><select value={limit} onChange={e=>setLimit(Number(e.target.value))}><option value={10}>Top 10</option><option value={20}>Top 20</option><option value={50}>Top 50</option><option value={1000000}>All products</option></select></Field></div>
  <div className="pq-two-col"><Panel title="Revenue Pareto" subtitle="Where the sales value is concentrated"><ParetoChart rows={a.byRevenue} axis="value" limit={limit} threshold={a.paretoThreshold}/></Panel><Panel title="Volume Pareto" subtitle="Where the production volume is concentrated"><ParetoChart rows={a.byQty} axis="qty" limit={limit} threshold={a.paretoThreshold}/></Panel></div>
  <div className="pq-two-col">{a.totals.revenue>0&&<VitalTable rows={a.byRevenue} axis="value"/>}{a.totals.qty>0&&<VitalTable rows={a.byQty} axis="qty"/>}</div>
 </>;
}

