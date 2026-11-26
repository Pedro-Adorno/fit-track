import {useState} from 'react'
import {format,startOfMonth,getDay,getDaysInMonth,addMonths} from 'date-fns'
import {ptBR} from 'date-fns/locale'
import {PData} from './storage'
const C={t:'#b6f23a',f:'#5aa9ff',o:'#ffb454',r:'#6b7570'}
export default function Calendar({d}:{d:PData}){
 const [m,setM]=useState(()=>startOfMonth(new Date())),[sel,setSel]=useState('')
 const key=format(m,'yyyy-MM'),n=getDaysInMonth(m),off=getDay(m)
 const ev=(date:string)=>({t:d.workouts.filter(x=>x.date===date).length,f:(d.matches??[]).filter(x=>x.date===date).length,o:d.acts.filter(x=>x.date===date).length+(d.sports??[]).filter(x=>x.date===date).length,r:d.rests?.includes(date)?1:0})
 const s=sel&&ev(sel)
 return <section className="card"><div className="between"><button className="link" aria-label="Mês anterior" onClick={()=>setM(addMonths(m,-1))}>‹</button><b style={{textTransform:'capitalize'}}>{format(m,"MMMM 'de' yyyy",{locale:ptBR})}</b><button className="link" aria-label="Próximo mês" onClick={()=>setM(addMonths(m,1))}>›</button></div>
  <div className="cal">{['D','S','T','Q','Q','S','S'].map((x,i)=><span key={i} className="mut">{x}</span>)}{Array.from({length:off}).map((_,i)=><i key={'e'+i}/>)}
   {Array.from({length:n},(_,i)=>{const date=`${key}-${String(i+1).padStart(2,'0')}`,e=ev(date);return <button key={date} className={sel===date?'on':''} aria-label={`Dia ${i+1}`} onClick={()=>setSel(date===sel?'':date)}>{i+1}<span>{(Object.keys(C) as (keyof typeof C)[]).filter(k=>e[k]).map(k=><b key={k} style={{background:C[k]}}/>)}</span></button>})}</div>
  <p className="mut"><b className="dot" style={{background:C.t}}/>Treino <b className="dot" style={{background:C.f}}/>Futebol <b className="dot" style={{background:C.o}}/>Outras atividades <b className="dot" style={{background:C.r}}/>Descanso</p>
  {s&&<p className="mut">{format(new Date(sel+'T12:00:00'),'dd/MM')}: {s.t} treino(s), {s.f} partida(s), {s.o} atividade(s){s.r?', descanso':''}.</p>}</section>}
