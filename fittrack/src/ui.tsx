import {useEffect,useState} from 'react'
const P:Record<string,string>={
home:'M3 11l9-8 9 8M5 10v10h5v-6h4v6h5V10',
train:'M6 7v10M3 9v6M18 7v10M21 9v6M6 12h12',
acts:'M3 12h4l3-8 4 16 3-8h4',
body:'M4 20V10M10 20V4M16 20v-7M22 20H2',
more:'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
cfg:'M12 12a4 4 0 100-8 4 4 0 000 8zM4 21a8 8 0 0116 0',
flame:'M12 3c1 4 5 6 5 11a5 5 0 01-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3-1-6 1-10z',
check:'M5 12l5 5 9-10',lock:'M6 11h12v9H6zM8 11V7a4 4 0 018 0v4'}
export const Icon=({n,s=22}:{n:string;s?:number})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={P[n]}/></svg>
export const Info=({t}:{t:string})=><button className="info" aria-label={'O que é isto? '+t} title={t} onClick={()=>toast(t)}>?</button>
export const toast=(m:string)=>window.dispatchEvent(new CustomEvent('ft-toast',{detail:m}))
export const ask=(msg:string,ok:()=>void,label='Confirmar')=>window.dispatchEvent(new CustomEvent('ft-ask',{detail:{msg,ok,label}}))
export function Toaster(){const [m,setM]=useState('');const [q,setQ]=useState<{msg:string;ok:()=>void;label:string}|null>(null)
 useEffect(()=>{const h=(e:Event)=>setQ((e as CustomEvent).detail),k=(e:KeyboardEvent)=>e.key==='Escape'&&setQ(null);window.addEventListener('ft-ask',h);window.addEventListener('keydown',k);return()=>{window.removeEventListener('ft-ask',h);window.removeEventListener('keydown',k)}},[])
 useEffect(()=>{let t:number;const h=(e:Event)=>{setM((e as CustomEvent).detail);clearTimeout(t);t=window.setTimeout(()=>setM(''),3200)}
  window.addEventListener('ft-toast',h);return()=>window.removeEventListener('ft-toast',h)},[])
 return <>{m&&<div className="toast" role="status" aria-live="polite">{m}</div>}{q&&<div className="scrim" onClick={()=>setQ(null)}><div className="sheet" role="alertdialog" aria-modal="true" aria-label={q.msg} onClick={e=>e.stopPropagation()}><b>{q.msg}</b><p className="mut">Esta ação não pode ser desfeita.</p><div className="row"><button autoFocus onClick={()=>setQ(null)}>Cancelar</button><button className="p" onClick={()=>{const f=q.ok;setQ(null);f()}}>{q.label}</button></div></div></div>}</>}
export const Empty=({title,text,action,onAction}:{title:string;text:string;action?:string;onAction?:()=>void})=>
 <div className="empty"><b>{title}</b><p className="mut">{text}</p>{action&&<button className="p" onClick={onAction}>{action}</button>}</div>
