import Metrics from './Metrics';
import {useState} from 'react';
import {Link} from 'react-router-dom';
import {usePPQ} from './State';
import {Button,Confirm} from './Controls';
import {blankProduct,type Product} from './model';
import {Panel,EmptyState,SearchPill} from '../components/UI';
import Icon from '../components/Icon';
import ImportProducts from './ImportProducts';
import {downloadPPQTemplate} from './core/ppqTemplate.js';

export default function Products() {
 const {study,analysis,changeProducts}=usePPQ();
 const [query,setQuery]=useState(''),[limit,setLimit]=useState(100);
 const [importing,setImporting]=useState(false);
 const [confirm,setConfirm]=useState<{title:string;detail:string;action:()=>void}|null>(null);
 const [notice,setNotice]=useState(''),[busy,setBusy]=useState(false);
 if(!study)return null;
 const filtered=study.products.filter(p=>[p.name,p.code,p.group_name,p.features].some(v=>v.toLowerCase().includes(query.toLowerCase())));
 const update=(id:string,change:Partial<Product>)=>changeProducts(prev=>prev.map(p=>p.product_id===id?{...p,...change,committed:p.committed||!!change.name?.trim()}:p));
 async function template() {setBusy(true);setNotice('');try{await downloadPPQTemplate();setNotice('Template downloaded. Delete the six example rows before entering your products.');}catch{setNotice('The template could not be downloaded. Please try again.');}finally{setBusy(false);}}
 async function exportData() {
  setBusy(true);setNotice('');
  try{
   const XLSX=await import('@e965/xlsx');
   const wb=XLSX.utils.book_new();
   const data=[['Product Name','Product Code','Group','UOM','Annual Quantity','Annual Sales Value','Features','Processes','Notes','Selected for VSI'],...study!.products.filter(p=>p.name.trim()).map(p=>[p.name,p.code,p.group_name,p.uom,p.annual_qty,p.annual_value,p.features,p.processes.join(' > '),p.notes,p.vsi_selected?'Yes':'No'])];
   XLSX.utils.book_append_sheet(wb,XLSX.utils.aoa_to_sheet(data),'Product Data');
   XLSX.utils.book_append_sheet(wb,XLSX.utils.json_to_sheet(analysis.rows.map(p=>({Product:p.name,Code:p.code,Quantity:p.qty,'Volume %':p.qtyPct,'Volume rank':p.qtyRank,'Sales value':p.value,'Revenue %':p.revenuePct,'Revenue rank':p.revenueRank,Processes:p.processCount,ABC:p.abc}))),'Analysis');
   XLSX.writeFile(wb,'PPQ-products-and-analysis.xlsx');
   setNotice('Product data and current analysis downloaded.');
  }catch{setNotice('Export could not be completed. Please try again.');}finally{setBusy(false);}
 }
 return <><Metrics/>
  <Panel title="Product master" subtitle="Edit directly in the grid. Annual sales value is the total for the year, in INR." action={<span className="pq-count">{study.products.length} rows</span>}>
   <div className="pq-toolbar"><SearchPill value={query} onChange={v=>{setQuery(v);setLimit(100);}} placeholder="Search products, codes, groups…"/>
    <div className="pq-wrap"><Button disabled={busy} onClick={()=>void template()}><Icon name="Download" size={15}/>Template</Button><Button disabled={busy||!analysis.rows.length} onClick={()=>void exportData()}>Export Excel</Button><Button onClick={()=>setImporting(true)}><Icon name="Upload" size={15}/>Import</Button><Button primary onClick={()=>{changeProducts(p=>[blankProduct(),...p]);setQuery('');}}><Icon name="Plus" size={15}/>Add product</Button></div>
   </div>
   {notice&&<p role="status" className="pq-notice">{notice}</p>}
   {!study.products.length?<EmptyState title="Build your product master" description="Add your first product or import an Excel / CSV file to begin."/>:!filtered.length?<EmptyState/>:
    <div className="pq-table-scroll"><table className="pq-table pq-edit-table"><caption className="pq-sr-only">Editable product master. Scroll horizontally for all fields.</caption><thead><tr><th className="pq-sticky">Product name *</th><th>Code</th><th>Group</th><th>UOM</th><th>Annual quantity</th><th>Annual sales value · INR</th><th>Features</th><th>Processes</th><th>Remove</th></tr></thead>
     <tbody>{filtered.slice(0,limit).map((p,i)=><tr key={p.product_id}>
      {(['name','code','group_name','uom','annual_qty','annual_value','features'] as const).map(field=><td key={field} className={field==='name'?'pq-sticky':''}><input aria-label={field.replaceAll('_',' ')+' for '+(p.code||'row '+(i+1))} aria-invalid={field==='name'&&p.committed&&!p.name.trim()||undefined} type={field.startsWith('annual_')?'number':'text'} min={field.startsWith('annual_')?0:undefined} step="any" value={p[field]??''} placeholder={field==='name'?'Product name':field.startsWith('annual_')?'—':undefined} onChange={e=>update(p.product_id,{[field]:field.startsWith('annual_')?(e.target.value===''?null:e.target.valueAsNumber):e.target.value})}/></td>)}
      <td><Link className="pq-text-link" to="/ppq/process-matrix">{p.processes.length} steps →</Link></td>
      <td><button type="button" className="circle-button danger" aria-label={'Remove '+(p.name||'blank product')} onClick={()=>setConfirm({title:'Remove product?',detail:(p.name||'This blank row')+' will be removed from this study and its analysis.',action:()=>changeProducts(prev=>prev.filter(row=>row.product_id!==p.product_id))})}><Icon name="Trash2" size={15}/></button></td>
     </tr>)}</tbody>
    </table></div>}
   <div className="pq-table-footer"><span>{Math.min(limit,filtered.length)} of {filtered.length} matching rows · scroll across for all fields</span><div className="pq-wrap">{filtered.length>limit&&<Button onClick={()=>setLimit(n=>n+100)}>Show 100 more</Button>}<Button danger disabled={!study.products.length} onClick={()=>setConfirm({title:'Clear all products?',detail:'This removes every product, route and selection from the current local study.',action:()=>changeProducts(()=>[])})}>Clear all</Button></div></div>
  </Panel>
  {importing&&<ImportProducts onClose={()=>setImporting(false)}/>}
  {confirm&&<Confirm title={confirm.title} detail={confirm.detail} onConfirm={confirm.action} onClose={()=>setConfirm(null)}/>}
 </>;
}


