import {usePPQ} from './State';
import {money,number} from './Controls';
export default function Metrics({matrix=false}:{matrix?:boolean}) {
 const {analysis:a}=usePPQ();
 const scope=a.vsiRows,mapped=scope.filter(p=>p.processCount>0).length;
 const entries=matrix?[
  ['Products routed',mapped+' / '+scope.length],['Processes in scope',number(new Set(scope.flatMap(p=>p.route)).size)],
  ['Average route length',(mapped?scope.reduce((s,p)=>s+p.processCount,0)/mapped:0).toFixed(1)+' steps'],['Going to VSI',number(scope.length)]
 ]:[['Products',number(a.rows.length)],['Annual quantity',number(a.totals.qty)],['Annual sales value',money(a.totals.revenue)],['With process routes',a.rows.filter(p=>p.processCount>0).length+' / '+a.rows.length]];
 return <dl className="pq-metric-strip">{entries.map(([label,value])=><div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>;
}

