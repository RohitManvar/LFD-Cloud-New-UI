import {useEffect,useId,useRef,type ReactNode} from 'react';
import Icon from '../components/Icon';
export function Button({children,onClick,primary=false,danger=false,disabled=false,type='button'}:{children:ReactNode;onClick?:()=>void;primary?:boolean;danger?:boolean;disabled?:boolean;type?:'button'|'submit'}) {
 return <button type={type} className={'pq-button'+(primary?' primary':'')+(danger?' danger':'')} disabled={disabled} onClick={onClick}>{children}</button>;
}
export function Modal({title,children,onClose}:{title:string;children:ReactNode;onClose:()=>void}) {
 const ref=useRef<HTMLDialogElement>(null),id=useId();
 useEffect(()=>{const d=ref.current;d?.showModal();return()=>d?.close();},[]);
 return <dialog ref={ref} className="pq-modal" aria-labelledby={id} onCancel={onClose} onClick={e=>{if(e.target===e.currentTarget){const r=e.currentTarget.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)onClose();}}}>
  <div className="pq-modal-head"><h2 id={id}>{title}</h2><button type="button" className="circle-button" aria-label="Close dialog" onClick={onClose}><Icon name="X" size={18}/></button></div>{children}
 </dialog>;
}
export function Confirm({title,detail,onConfirm,onClose}:{title:string;detail:string;onConfirm:()=>void;onClose:()=>void}) {
 return <Modal title={title} onClose={onClose}><p>{detail}</p><div className="pq-actions"><Button onClick={onClose}>Cancel</Button><Button danger onClick={()=>{onConfirm();onClose();}}>Confirm</Button></div></Modal>;
}
export function Field({label,children}:{label:string;children:ReactNode}) {return <label className="pq-field"><span>{label}</span>{children}</label>;}
export function Grade({value}:{value:string}) {return <span className={'pq-grade grade-'+value}>{value}</span>;}
export const number=(n:number)=>n.toLocaleString('en-IN',{maximumFractionDigits:2});
export const money=(n:number)=>new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',notation:'compact',maximumFractionDigits:1}).format(n);
export const percent=(n:number)=>n.toFixed(1)+'%';

