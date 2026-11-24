import {useState} from 'react';
import {organizations} from '../data/mock';
import {usePPQ} from './State';
import {Button,Confirm,Field,Modal} from './Controls';
import {uid,type Study} from './model';
import Icon from '../components/Icon';
export default function StudyBar() {
 const {store,study,setStore,updateStudy,save,status,error,recovery,acceptSample}=usePPQ();
 const [editing,setEditing]=useState<'new'|'edit'|null>(null),[deleting,setDeleting]=useState(false);
 return <>
  <section className="pq-study-bar" aria-label="Study controls">
   <Field label="Organization"><select value={store.orgId} onChange={e=>{const orgId=e.target.value;setStore(prev=>({...prev,orgId,activeId:prev.studies.find(s=>s.org_id===orgId)?.id||''}));}}>{organizations.map(o=><option key={o.org_id} value={o.org_id}>{o.name}</option>)}</select></Field>
   <Field label="PPQ study"><select value={study?.id||''} onChange={e=>setStore(prev=>({...prev,activeId:e.target.value}))}>{!study&&<option value="">No studies yet</option>}{store.studies.filter(s=>s.org_id===store.orgId).map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</select></Field>
   <div className="pq-wrap"><Button primary onClick={()=>setEditing('new')}><Icon name="Plus" size={15}/>New study</Button>{study&&<><Button onClick={()=>setEditing('edit')}>Edit</Button><button type="button" className="circle-button danger" aria-label="Delete current study" onClick={()=>setDeleting(true)}><Icon name="Trash2" size={16}/></button></>}</div>
  </section>
  <div className={'pq-save-line'+(error?' error':'')}><span role="status">{status}</span><div className="pq-wrap">{study&&<span>{study.plant||'Plant not set'} · {study.fiscal_year||'Period not set'}</span>}{recovery?<Button onClick={acceptSample}>Use sample data</Button>:<Button onClick={()=>save()}>Save now</Button>}</div></div>
  {editing&&<StudyEditor key={editing} study={editing==='edit'?study:undefined} onClose={()=>setEditing(null)} onSave={fields=>{
   if(editing==='edit')updateStudy(fields);
   else {const id=uid();setStore(prev=>({...prev,activeId:id,studies:[...prev.studies,{id,org_id:prev.orgId,currency:'INR',working_days:300,pareto_threshold:80,products:[],extraProcesses:[],...fields}]}));}
   setEditing(null);
  }}/>}
  {deleting&&study&&<Confirm title={'Delete '+study.name+'?'} detail="This removes the local study and all of its products. Other studies are kept." onClose={()=>setDeleting(false)} onConfirm={()=>setStore(prev=>{const studies=prev.studies.filter(s=>s.id!==study.id);return {...prev,studies,activeId:studies.find(s=>s.org_id===prev.orgId)?.id||''};})}/>}
 </>;
}
function StudyEditor({study,onClose,onSave}:{study?:Study;onClose:()=>void;onSave:(fields:Pick<Study,'name'|'fiscal_year'|'plant'|'description'>)=>void}) {
 const [fields,setFields]=useState({name:study?.name||'',fiscal_year:study?.fiscal_year||'',plant:study?.plant||'',description:study?.description||''});
 return <Modal title={study?'Edit study':'Create PPQ study'} onClose={onClose}><form onSubmit={e=>{e.preventDefault();if(fields.name.trim())onSave({...fields,name:fields.name.trim()});}}>
  <div className="pq-form-grid"><Field label="Study name *"><input autoFocus required value={fields.name} onChange={e=>setFields({...fields,name:e.target.value})}/></Field><Field label="Fiscal year / period"><input value={fields.fiscal_year} placeholder="FY 2026–27" onChange={e=>setFields({...fields,fiscal_year:e.target.value})}/></Field><Field label="Plant / location"><input value={fields.plant} onChange={e=>setFields({...fields,plant:e.target.value})}/></Field><Field label="Notes"><textarea value={fields.description} onChange={e=>setFields({...fields,description:e.target.value})}/></Field></div>
  <p className="muted">This study saves in this browser. New studies start with INR, 300 working days, and an 80% Pareto cut.</p>
  <div className="pq-actions"><Button onClick={onClose}>Cancel</Button><Button primary type="submit" disabled={!fields.name.trim()}>{study?'Save changes':'Create study'}</Button></div>
 </form></Modal>;
}

