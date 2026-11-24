import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { computeAnalysis } from './core/analysis.js';
import { STORAGE_KEY, parseStore, savableStore, seedStore, validateStore, type Store, type Study, type Product } from './model';

function load() {
 try { const raw=localStorage.getItem(STORAGE_KEY); return {store:raw ? parseStore(raw):seedStore(),warning:''}; }
 catch { return {store:seedStore(),warning:'Saved PPQ data could not be read. The sample is shown; saving is paused until you choose Use sample data.'}; }
}
function usePPQState() {
 const [initial]=useState(load);
 const [store,setStore]=useState<Store>(initial.store);
 const [recovery,setRecovery]=useState(initial.warning);
 const [status,setStatus]=useState('Saving locally…');
 const [storageError,setStorageError]=useState('');
 const lastSaved=useRef('');
 const validation=validateStore(store);
 const study=store.studies.find(s=>s.id===store.activeId && s.org_id===store.orgId);
 const save=useCallback(()=>{
  if(recovery || validation) return false;
  try { localStorage.setItem(STORAGE_KEY,JSON.stringify(savableStore(store)));lastSaved.current=JSON.stringify(store);setStorageError('');setStatus('Saved in this browser');return true; }
  catch {setStorageError('Unable to save in this browser. Your changes are still on this page; export your products before closing.');return false;}
 },[store,validation,recovery]);
 useEffect(()=>{
  if(validation||recovery) return;
  setStatus('Saving locally…');
  const timer=window.setTimeout(save,650);return ()=>clearTimeout(timer);
 },[save,validation,recovery]);
 useEffect(()=>{
  const guard=(e:BeforeUnloadEvent)=>{if(lastSaved.current!==JSON.stringify(store)){e.preventDefault();e.returnValue='';}};
  window.addEventListener('beforeunload',guard);return ()=>window.removeEventListener('beforeunload',guard);
 },[store]);
 const updateStudy=(change:Partial<Study>)=>setStore(prev=>({...prev,studies:prev.studies.map(s=>s.id===prev.activeId?{...s,...change}:s)}));
 const changeProducts=(fn:(products:Product[])=>Product[])=>setStore(prev=>({...prev,studies:prev.studies.map(s=>s.id===prev.activeId?{...s,products:fn(s.products)}:s)}));
 const analysis=useMemo(()=>computeAnalysis(study?.products.filter(p=>p.name.trim())||[],{paretoThreshold:study?.pareto_threshold??80}),[study]);
 return {store,study,analysis,setStore,updateStudy,changeProducts,save,status:validation||recovery||storageError||status,
  error:!!(validation||recovery||storageError),recovery,acceptSample:()=>setRecovery('')};
}
type PPQState=ReturnType<typeof usePPQState>;
const Context=createContext<PPQState|null>(null);
export function PPQProvider({children}:{children:ReactNode}) {return <Context.Provider value={usePPQState()}>{children}</Context.Provider>;}
export function usePPQ() {const ctx=useContext(Context);if(!ctx)throw new Error('PPQ provider missing');return ctx;}

