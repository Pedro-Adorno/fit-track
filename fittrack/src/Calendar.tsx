import {useState} from 'react'
import {addMonths,startOfMonth,getDaysInMonth,format} from 'date-fns'
import {PData,volume} from './storage'
import {planFor} from './analytics'
export default function Calendar({d}:{d:PData}){
 const [off,setOff]=useState(0);const [sel,setSel]=useState('');const b=addMonths(new Date(),off);const y=b.getFullYear(),m=b.getMonth()
 const pad=startOfMonth(b).getDay();const cells:(number|null)[]=[...Array(pad).fill(null),...Array.from({length:getDaysInMonth(b)},(_,i)=>i+1)]
 const key=(i:number)=>format(new Date(y,m,i),'yyyy-MM-dd')
 const sw=d.workouts.filter(w=>w.date===sel),sa=d.acts.filter(a=>a.date===sel),sp=d.weights.filter(w=>w.date===sel)
 return <div className="card"><div className="row" style={{alignItems:'center'}}><button onClick={()=>setOff(off-1)}>‹</button><b style={{textAlign:'center'}}>{format(b,'MM/yyyy')}</b><button onClick={()=>setOff(off+1)}>›</button></div>
  <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',gap:4,marginTop:8,textAlign:'center'}}>{['D','S','T','Q','Q','S','S'].map((x,i)=><span key={i} className="mut">{x}</span>)}
  {cells.map((c,i)=>{if(!c)return <span key={i}/>;const k=key(c);const w=d.workouts.some(x=>x.date===k),a=d.acts.some(x=>x.date===k),p=planFor(d,new Date(y,m,c))[String(new Date(y,m,c).getDay())]
   return <button key={i} onClick={()=>setSel(k)} style={{padding:2,borderColor:sel===k?'#b6f23a':undefined}}>{c}<div style={{fontSize:9,height:10}}><span style={{color:'#b6f23a'}}>{w?'●':''}</span><span style={{color:'#7bd3ea'}}>{a?'●':''}</span>{p&&p!=='Descanso'&&!w&&!a?<span className="mut">○</span>:''}</div></button>})}</div>
  <div className="mut">● treino · <span style={{color:'#7bd3ea'}}>●</span> atividade · ○ planejado e não feito</div>
  {sel&&<div className="card"><b>{sel}</b>{sw.map(w=><div key={w.id} className="mut">Treino {w.routine??''}: {w.exs.length} exercícios · {volume(w)} kg · {w.minutes} min{w.rpe?` · esforço ${w.rpe}`:''}</div>)}
   {sa.map(a=><div key={a.id} className="mut">{a.kind}: {a.minutes} min{a.km>0?` · ${a.km} km`:''}</div>)}{sp.map(p=><div key={p.id} className="mut">Peso: {p.kg} kg</div>)}
   {!sw.length&&!sa.length&&!sp.length&&<div className="mut">Sem registros. Planejado: {planFor(d,new Date(sel+'T12:00:00'))[String(new Date(sel+'T12:00:00').getDay())]||'—'}</div>}</div>}</div>}
