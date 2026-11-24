import {useState} from 'react'
import {format,subDays,parseISO,differenceInCalendarDays} from 'date-fns'
import {BarChart,Bar,LineChart,Line,XAxis,YAxis,Tooltip,ResponsiveContainer,CartesianGrid} from 'recharts'
import {PData,volume,pct} from './storage'
import {weekly,muscle} from './analytics'
const TT={contentStyle:{background:'#171a18',border:'1px solid #262b28'}}
const Ch=({h=200,children}:{h?:number;children:React.ReactElement})=><div style={{height:h}}><ResponsiveContainer>{children}</ResponsiveContainer></div>
const Empty=()=><div className="mut">Sem dados neste período.</div>
export default function Analytics({d}:{d:PData}){
 const f=(x:Date)=>format(x,'yyyy-MM-dd');const now=new Date()
 const [r,setR]=useState('30');const [cf,setCf]=useState(f(subDays(now,29)));const [ct,setCt]=useState(f(now));const [ex,setEx]=useState('');const [part,setPart]=useState('')
 const to=r==='c'?ct:f(now);const from=r==='c'?cf:f(subDays(now,+r-1))
 const L=Math.max(1,differenceInCalendarDays(parseISO(to),parseISO(from))+1);const pTo=f(subDays(parseISO(from),1)),pFrom=f(subDays(parseISO(from),L))
 const inR=(x:string)=>x>=from&&x<=to,inP=(x:string)=>x>=pFrom&&x<=pTo
 const ws=d.workouts.filter(w=>inR(w.date)),pw=d.workouts.filter(w=>inP(w.date));const acts=d.acts.filter(a=>inR(a.date)),pa=d.acts.filter(a=>inP(a.date))
 const vol=ws.reduce((a,w)=>a+volume(w),0),pv=pw.reduce((a,w)=>a+volume(w),0)
 const wts=[...d.weights].filter(x=>inR(x.date)).sort((a,b)=>a.date.localeCompare(b.date))
 const names=Array.from(new Set(d.workouts.flatMap(w=>w.exs.map(e=>e.name))));const exSel=ex||names[0]||''
 const load=d.workouts.filter(w=>inR(w.date)).map(w=>({date:w.date.slice(5),kg:Math.max(0,...w.exs.filter(e=>e.name===exSel).flatMap(e=>e.sets.map(s=>s.kg))),has:w.exs.some(e=>e.name===exSel)})).filter(x=>x.has)
 const parts=Array.from(new Set((d.measures??[]).map(m=>m.part)));const pSel=part||parts[0]||''
 const ms=(d.measures??[]).filter(m=>m.part===pSel&&inR(m.date)).sort((a,b)=>a.date.localeCompare(b.date)).map(m=>({date:m.date.slice(5),cm:m.cm}))
 const cmp=(l:string,a:number,b:number)=><div className="mut">{l}: {a} vs {b} no período anterior {b>0?`(${pct(b,a)>=0?'+':''}${pct(b,a).toFixed(0)}%)`:''}</div>
 return <div className="card"><h2>Análises</h2>
  <div className="row" style={{flexWrap:'wrap'}}>{[['7','7 dias'],['30','30 dias'],['90','90 dias'],['c','Personalizado']].map(([k,l])=><button key={k} className={r===k?'p':''} onClick={()=>setR(k)}>{l}</button>)}</div>
  {r==='c'&&<div className="row"><input type="date" value={cf} onChange={e=>setCf(e.target.value)}/><input type="date" value={ct} onChange={e=>setCt(e.target.value)}/></div>}
  <p className="mut">{from} a {to}. Valores calculados dos seus registros; relações entre números não provam causa.</p>
  <div className="grid"><div className="card"><div className="big">{ws.length}</div><div className="mut">Treinos</div></div><div className="card"><div className="big">{Math.round(vol)}</div><div className="mut">Volume (kg)</div></div></div>
  {cmp('Treinos',ws.length,pw.length)}{cmp('Volume',Math.round(vol),Math.round(pv))}{cmp('Atividades',acts.length,pa.length)}
  <h2>Volume semanal</h2>{ws.length?<Ch><BarChart data={weekly(ws,volume)}><CartesianGrid stroke="#262b28"/><XAxis dataKey="week" stroke="#8a948e" fontSize={11}/><YAxis stroke="#8a948e" fontSize={11}/><Tooltip {...TT}/><Bar dataKey="v" name="Volume (kg)" fill="#b6f23a"/></BarChart></Ch>:<Empty/>}
  <h2>Frequência semanal</h2>{ws.length+acts.length?<Ch h={160}><BarChart data={weekly([...ws,...acts],()=>1)}><XAxis dataKey="week" stroke="#8a948e" fontSize={11}/><YAxis allowDecimals={false} stroke="#8a948e" fontSize={11}/><Tooltip {...TT}/><Bar dataKey="v" name="Sessões" fill="#7bd3ea"/></BarChart></Ch>:<Empty/>}
  <h2>Séries por grupo muscular</h2>{ws.length?<Ch h={Math.max(140,muscle(d,ws).length*32)}><BarChart layout="vertical" data={muscle(d,ws)}><XAxis type="number" allowDecimals={false} stroke="#8a948e" fontSize={11}/><YAxis type="category" dataKey="g" width={90} stroke="#8a948e" fontSize={11}/><Tooltip {...TT}/><Bar dataKey="v" name="Séries" fill="#b6f23a"/></BarChart></Ch>:<Empty/>}
  <h2>Carga por exercício</h2>{names.length?<><select value={exSel} onChange={e=>setEx(e.target.value)}>{names.map(n=><option key={n}>{n}</option>)}</select>{load.length?<Ch><LineChart data={load}><CartesianGrid stroke="#262b28"/><XAxis dataKey="date" stroke="#8a948e" fontSize={11}/><YAxis stroke="#8a948e" fontSize={11}/><Tooltip {...TT}/><Line dataKey="kg" name="Carga máx. (kg)" stroke="#b6f23a" strokeWidth={2}/></LineChart></Ch>:<Empty/>}</>:<Empty/>}
  <h2>Peso no período</h2>{wts.length>1?<><div className="mut">{wts[0].kg} → {wts[wts.length-1].kg} kg ({pct(wts[0].kg,wts[wts.length-1].kg).toFixed(1)}%). Oscilações pontuais não indicam tendência.</div><Ch h={160}><LineChart data={wts}><XAxis dataKey="date" stroke="#8a948e" fontSize={11}/><YAxis domain={['auto','auto']} stroke="#8a948e" fontSize={11}/><Tooltip {...TT}/><Line dataKey="kg" stroke="#b6f23a" strokeWidth={2}/></LineChart></Ch></>:<div className="mut">Precisa de ao menos 2 registros no período.</div>}
  <h2>Medidas</h2>{parts.length?<><select value={pSel} onChange={e=>setPart(e.target.value)}>{parts.map(n=><option key={n}>{n}</option>)}</select>{ms.length>1?<Ch h={160}><LineChart data={ms}><XAxis dataKey="date" stroke="#8a948e" fontSize={11}/><YAxis domain={['auto','auto']} stroke="#8a948e" fontSize={11}/><Tooltip {...TT}/><Line dataKey="cm" name="cm" stroke="#7bd3ea" strokeWidth={2}/></LineChart></Ch>:<Empty/>}</>:<div className="mut">Registre medidas em Mais.</div>}</div>}
