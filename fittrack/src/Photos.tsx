import {useEffect,useState} from 'react'
import {format} from 'date-fns'
type Ph={id:string;pid:string;date:string;url:string}
const open=()=>new Promise<IDBDatabase>((res,rej)=>{const r=indexedDB.open('fittrack-photos',1);r.onupgradeneeded=()=>r.result.createObjectStore('p',{keyPath:'id'});r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)})
async function run<T>(mode:IDBTransactionMode,f:(s:IDBObjectStore)=>IDBRequest<T>):Promise<T>{const db=await open();return new Promise<T>((res,rej)=>{const r=f(db.transaction('p',mode).objectStore('p'));r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)})}
const shrink=(f:File)=>new Promise<string>((res,rej)=>{const fr=new FileReader();fr.onerror=()=>rej(fr.error);fr.onload=()=>{const im=new Image();im.onerror=()=>rej(new Error('img'));im.onload=()=>{const k=Math.min(1,640/Math.max(im.width,im.height));const c=document.createElement('canvas');c.width=im.width*k;c.height=im.height*k;c.getContext('2d')!.drawImage(im,0,0,c.width,c.height);res(c.toDataURL('image/jpeg',.7))};im.src=String(fr.result)};fr.readAsDataURL(f)})
export default function Photos({pid}:{pid:string}){
 const [l,setL]=useState<Ph[]>([]);const [sel,setSel]=useState<string[]>([])
 const load=()=>run<Ph[]>('readonly',s=>s.getAll() as IDBRequest<Ph[]>).then(a=>setL(a.filter(x=>x.pid===pid).sort((x,y)=>y.date.localeCompare(x.date)))).catch(()=>alert('Não foi possível ler as fotos.'))
 useEffect(()=>{setSel([]);load()},[pid])
 const add=async(f?:File)=>{if(!f)return;try{const url=await shrink(f);await run('readwrite',s=>s.put({id:Math.random().toString(36).slice(2),pid,date:format(new Date(),'yyyy-MM-dd'),url}));load()}catch{alert('Não foi possível salvar a foto.')}}
 const cmp=l.filter(x=>sel.includes(x.id))
 return <div className="card"><h2>Fotos de progresso</h2><div className="mut">Ficam só neste navegador (não entram no backup JSON). Toque em duas para comparar.</div>
  <label><input type="file" accept="image/*" hidden onChange={e=>{add(e.target.files?.[0]);e.target.value=''}}/><span style={{display:'block',textAlign:'center',padding:11,border:'1px solid #262b28',borderRadius:10,margin:'8px 0'}}>+ Adicionar foto</span></label>
  {cmp.length===2&&<div className="row">{cmp.map(p=><div key={p.id}><img src={p.url} style={{width:'100%',borderRadius:8}}/><div className="mut">{p.date}</div></div>)}</div>}
  <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:6,marginTop:8}}>{l.map(p=><div key={p.id}><img src={p.url} onClick={()=>setSel(s=>s.includes(p.id)?s.filter(x=>x!==p.id):[...s,p.id].slice(-2))} style={{width:'100%',aspectRatio:'1',objectFit:'cover',borderRadius:8,outline:sel.includes(p.id)?'2px solid #b6f23a':'none'}}/>
   <div className="mut" style={{fontSize:11}}>{p.date} <span onClick={()=>confirm('Excluir foto?')&&run('readwrite',s=>s.delete(p.id)).then(load)}>✕</span></div></div>)}</div>
  {!l.length&&<div className="mut">Nenhuma foto ainda.</div>}</div>}
