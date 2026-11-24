import type {AnalysisRow} from './core/analysis.js';
// Quote CSV cells and neutralize spreadsheet formula prefixes in text fields.
export function analysisCsv(rows:AnalysisRow[]) {
 const header=['Product','Code','Group','UOM','Annual Qty','Volume %','Volume Rank','Annual Value','Revenue %','Revenue Rank','Processes','Class'];
 const cell=(value:unknown)=>{let text=String(value??'');if(typeof value==='string'&&/^[\s]*[=+@-]/.test(text))text="'"+text;return '"'+text.replaceAll('"','""')+'"';};
 return [header,...rows.map(r=>[r.name,r.code,r.group_name,r.uom,r.qty,Number(r.qtyPct.toFixed(2)),r.qtyRank,r.value,Number(r.revenuePct.toFixed(2)),r.revenueRank,r.route.join(' > '),r.abc])].map(row=>row.map(cell).join(',')).join('\r\n');
}
export function downloadAnalysis(rows:AnalysisRow[],name:string) {
 const url=URL.createObjectURL(new Blob(['\uFEFF'+analysisCsv(rows)],{type:'text/csv;charset=utf-8;'}));
 const link=document.createElement('a');link.href=url;link.download=(name.replace(/[^\w-]+/g,'_')||'ppq')+'_product_analysis.csv';document.body.appendChild(link);link.click();link.remove();
 setTimeout(()=>URL.revokeObjectURL(url),1000);
}

