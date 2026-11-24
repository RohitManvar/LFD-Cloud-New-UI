import {useMemo,useState} from 'react';
import {usePPQ} from './State';
import {Button,Field,Modal,number} from './Controls';
import {FIELDS,NON_PROCESS,norm,type ParsedGrid} from './core/importParse.js';
import {importedProducts,parseImportGrid} from './model';

export default function ImportProducts({onClose}:{onClose:()=>void}) {
 const {changeProducts}=usePPQ();
 const [workbook,setWorkbook]=useState<import('@e965/xlsx').WorkBook|null>(null);
 const [sheet,setSheet]=useState('');
 const [parsed,setParsed]=useState<ParsedGrid|null>(null);
 const [mapping,setMapping]=useState<Record<string,string>>({});
 const [processCols,setProcessCols]=useState<string[]>([]);
 const [fileName,setFileName]=useState('');
 const [busy,setBusy]=useState(false);
 const [error,setError]=useState('');
 const [dragging,setDragging]=useState(false);
 async function chooseSheet(wb:import('@e965/xlsx').WorkBook,name:string) {
  setSheet(name);setError('');setParsed(null);
  try {
   const XLSX=await import('@e965/xlsx');
   const result=parseImportGrid(XLSX.utils.sheet_to_json<unknown[]>(wb.Sheets[name],{header:1,blankrows:false,defval:''}));
   setParsed(result);setMapping(result.mapping);setProcessCols(result.matrixCols);
  } catch(e) {setError(e instanceof Error?e.message:'Could not read this worksheet.');}
 }
 async function read(file:File) {
  setBusy(true);setError('');setParsed(null);setWorkbook(null);setFileName(file.name);
  try {
   const XLSX=await import('@e965/xlsx');
   const wb=XLSX.read(await file.arrayBuffer(),{type:'array'});
   if(!wb.SheetNames.length)throw new Error('No readable worksheet found.');
   setWorkbook(wb);await chooseSheet(wb,wb.SheetNames[0]);
  } catch(e) {setError(e instanceof Error?e.message:'Unable to read the file. Choose an Excel or CSV file.');}
  finally{setBusy(false);}
 }
 const preview=useMemo(()=>{
  if(!parsed) return {rows:[],error:''};
  try{return {rows:importedProducts(parsed.dataRows,mapping,parsed.cols.filter(c=>processCols.includes(c))),error:''};}
  catch(e){return {rows:[],error:e instanceof Error?e.message:'Review your column mapping.'};}
 },[parsed,mapping,processCols]);
 const spare=parsed?.cols.filter(c=>!Object.values(mapping).includes(c)&&!NON_PROCESS.includes(norm(c)))||[];
 return <Modal title="Import product data" onClose={onClose}>
  <p className="muted">Upload a product list, route-per-column sheet, or process matrix. Review the mapping before appending rows to this study.</p>
  <label className={'pq-dropzone'+(dragging?' dragging':'')} onDragOver={e=>{e.preventDefault();setDragging(true);}} onDragLeave={()=>setDragging(false)} onDrop={e=>{e.preventDefault();setDragging(false);if(!busy&&e.dataTransfer.files[0])void read(e.dataTransfer.files[0]);}}>
   <strong>{busy?'Reading file…':fileName||'Drop an Excel or CSV file here'}</strong><span>or choose a file · .xlsx, .xls, .csv</span>
   <input type="file" accept=".xlsx,.xls,.csv" disabled={busy} aria-label="Import Excel or CSV" onChange={e=>{if(e.target.files?.[0])void read(e.target.files[0]);e.target.value='';}}/>
  </label>
  {workbook && <Field label="Worksheet"><select value={sheet} onChange={e=>void chooseSheet(workbook,e.target.value)}>{workbook.SheetNames.map(s=><option key={s}>{s}</option>)}</select></Field>}
  {(error||preview.error) && <p role="alert" className="pq-notice error">{error||preview.error}</p>}
  {parsed && <>
   <div className="pq-form-grid">{FIELDS.map(f=><Field key={f.key} label={f.label+(f.required?' *':'')}><select value={mapping[f.key]||''} onChange={e=>setMapping(prev=>({...prev,[f.key]:e.target.value}))}>
    <option value="">Not mapped</option>{parsed.cols.map(c=><option key={c}>{c}</option>)}
   </select></Field>)}</div>
   <fieldset className="pq-process-picks"><legend>Additional process columns</legend><p className="muted">Ticked cells use the column heading; text cells use the process name in the cell.</p>
    <div className="pq-wrap">{spare.map(c=><label key={c}><input type="checkbox" checked={processCols.includes(c)} onChange={e=>setProcessCols(prev=>e.target.checked?[...prev,c]:prev.filter(p=>p!==c))}/>{c}</label>)}</div>
   </fieldset>
   <div className="pq-section-heading"><h3>Preview · first 5 products</h3><span className="muted">{preview.rows.length} ready · {parsed.dataRows.length-preview.rows.length} skipped or invalid</span></div>
   <div className="pq-table-scroll"><table className="pq-table"><thead><tr><th>Product</th><th>Quantity</th><th>Sales value</th><th>Process route</th></tr></thead>
    <tbody>{preview.rows.slice(0,5).map(p=><tr key={p.product_id}><td>{p.name}<small>{p.code}</small></td><td>{p.annual_qty===null?'—':number(p.annual_qty)}</td><td>{p.annual_value===null?'—':number(p.annual_value)}</td><td>{p.processes.join(' → ')||'No route'}</td></tr>)}</tbody>
   </table></div>
   <p className="muted">Blank product names are skipped. Existing rows are kept; repeated products are appended as separate rows. Blank amounts remain blank and zero stays zero.</p>
  </>}
  <div className="pq-actions"><Button onClick={onClose}>Cancel</Button><Button primary disabled={busy||!!preview.error||!preview.rows.length} onClick={()=>{changeProducts(prev=>[...prev,...preview.rows]);onClose();}}>Append {preview.rows.length||''} products</Button></div>
 </Modal>;
}



