import { organizations, ppqProducts, ppqStudy } from '../data/mock';
import { normalizeProcess, processList } from './core/analysis.js';
import { ALIASES, FIELDS, norm, parseGrid, processesOf } from './core/importParse.js';

export interface Product {
 product_id:string; name:string; code:string; group_name:string; uom:string;
 annual_qty:number|null; annual_value:number|null; features:string; notes:string;
 processes:string[]; vsi_selected:boolean; committed:boolean;
}
export interface Study {
 id:string; org_id:string; name:string; fiscal_year:string; plant:string; description:string;
 currency:string; working_days:number; pareto_threshold:number; products:Product[]; extraProcesses:string[];
}
export interface Store { version:1; orgId:string; activeId:string; studies:Study[] }
export const STORAGE_KEY = 'lfd-preview-ppq-v1';
export const uid = () => crypto.randomUUID();
export function blankProduct():Product {
 return {product_id:uid(),name:'',code:'',group_name:'',uom:'',annual_qty:null,annual_value:null,features:'',notes:'',processes:[],vsi_selected:false,committed:false};
}
export function seedStore():Store {
 return {version:1,orgId:'org-sahyadri',activeId:ppqStudy.study_id,studies:[{
  id:ppqStudy.study_id, org_id:'org-sahyadri',name:ppqStudy.name,fiscal_year:ppqStudy.period,
  plant:ppqStudy.plant,description:'Sample portfolio for the Module 2 design preview.',
  currency:'INR',working_days:300,pareto_threshold:80,extraProcesses:[],
  products:ppqProducts.map(p=>({...blankProduct(),product_id:p.code,name:p.name,code:p.code,group_name:p.family_name,
   uom:'pcs',annual_qty:p.annual_qty,annual_value:p.revenue,processes:processList({processes:p.route}),committed:true}))
 }]};
}
export const orgName = (id:string) => organizations.find(o=>o.org_id===id)?.name || id;
export function validateStore(store:Store):string {
 for (const s of store.studies) {
  for (const p of s.products) {
   if(p.committed && !p.name.trim()) return 'Enter a name for the existing product or remove its row. Saving is paused.';
   for(const key of ['annual_qty','annual_value'] as const) {
    const value=p[key];
    if(value!==null && (!Number.isFinite(value)||value<0)) return 'Quantity and sales value must be zero or a positive number. Saving is paused.';
   }
  }
 }
 return '';
}
export function savableStore(store:Store):Store {
 return {...store,studies:store.studies.map(s=>({...s,products:s.products.filter(p=>p.name.trim()).map(p=>({...p,name:p.name.trim(),committed:true}))}))};
}
export function parseStore(raw:string):Store {
 const data=JSON.parse(raw);
 if(data?.version!==1 || !Array.isArray(data.studies)||typeof data.orgId!=='string'||typeof data.activeId!=='string') throw new Error('Invalid saved study');
 const ids=new Set<string>();
 for(const s of data.studies) {
  if(!s || typeof s.id!=='string'||ids.has(s.id) || !['org_id','name','plant','fiscal_year','description','currency'].every(k=>typeof s[k]==='string') ||
   !Array.isArray(s.products)||!Array.isArray(s.extraProcesses)||!s.extraProcesses.every((p:unknown)=>typeof p==='string')||
   !Number.isFinite(s.working_days)||!Number.isFinite(s.pareto_threshold)) throw new Error('Invalid saved study');
  ids.add(s.id);
  const productIds=new Set<string>();
  for(const p of s.products) {
   if(!p || !['product_id','name','code','group_name','uom','features','notes'].every(k=>typeof p[k]==='string') ||
    productIds.has(p.product_id)||!Array.isArray(p.processes)||!p.processes.every((r:unknown)=>typeof r==='string')||
    typeof p.vsi_selected!=='boolean'||typeof p.committed!=='boolean'||
    !['annual_qty','annual_value'].every(k=>p[k]===null || (typeof p[k]==='number' && Number.isFinite(p[k]) && p[k]>=0))) throw new Error('Invalid saved product');
   productIds.add(p.product_id);
  }
 }
 return data as Store;
}
export function importedProducts(rows:Record<string,unknown>[],mapping:Record<string,string>,processCols:string[]):Product[] {
 if(!mapping.name) throw new Error('Map Product Name before importing.');
 const used=Object.values(mapping).filter(Boolean);
 if(new Set(used).size!==used.length) throw new Error('Map each spreadsheet column to only one field.');
 const extras=processCols.filter(c=>!used.includes(c));
 return rows.flatMap((row,index)=>{
  const read=(key:string)=>mapping[key] ? String(row[mapping[key]]??'').trim() : '';
  if(!read('name')) return [];
  const amount=(key:string)=>{
   const v=read(key); if(!v) return null;
   const n=Number(v.replace(/[, ]/g,''));
   if(!Number.isFinite(n)||n<0) throw new Error('Row '+(index+1)+': '+key.replace('annual_','Annual ')+' must be a valid non-negative number.');
   return n;
  };
  return [{...blankProduct(),name:read('name'),code:read('code'),group_name:read('group_name'),uom:read('uom'),features:read('features'),
   annual_qty:amount('annual_qty'),annual_value:amount('annual_value'),committed:true,
   processes:processList({processes:processesOf(row,{mapping,processCols:extras}).map(normalizeProcess)})}];
 });
}
export function coverage(rows:{cumPct:number}[],threshold=80) {
 const index=rows.findIndex(r=>r.cumPct>=threshold);
 return index<0 ? {count:0,pct:0} : {count:index+1,pct:rows[index].cumPct};
}


// Recognized data headers take priority over tick inference. A quantity column
// containing only 0 / 1 must not become a process column.
export function parseImportGrid(grid:unknown[][]) {
 const result=parseGrid(grid);
 const mapping={...result.mapping};
 for(const field of FIELDS) {
  const exact=result.cols.find(c=>(ALIASES[field.key]||[]).includes(norm(c)));
  if(exact) {
   for(const key of Object.keys(mapping))if(key!==field.key&&mapping[key]===exact)delete mapping[key];
   mapping[field.key]=exact;
  }
 }
 const claimed=new Set(Object.values(mapping));
 return {...result,mapping,matrixCols:result.matrixCols.filter(c=>!claimed.has(c))};
}
