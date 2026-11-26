import {useState} from 'react'
import {format,addDays,startOfWeek} from 'date-fns'
import {BarChart,Bar,LineChart,Line,XAxis,YAxis,Tooltip,Cell,ResponsiveContainer} from 'recharts'
import {PData} from './storage'
import {Empty} from './ui'
const tip={background:'#171a18',border:'1px solid #262b28',borderRadius:10}
export default function Progress({d,target}:{d:PData;target:number}){
 const [per,setPer]=useState(30),[part,setPart]=useState('')
 const now=new Date(),f=(x:Date)=>format(x,'yyyy-MM-dd')
 const s1=f(addDays(now,-per)),s0=f(addDays(now,-2*per)),inR=(x:string,a:string,b?:string)=>x>a&&(!b||x<=b)
 const cmp=(a:string,b?:string)=>{const w=d.workouts.filter(x=>inR(x.date,a,b)),ac=d.acts.filter(x=>inR(x.date,a,b)),ws=d.weights.filter(x=>inR(x.date,a,b))
  return{w:w.length,a:ac.length,days:new Set([...w,...ac].map(x=>x.date)).size,kg:ws.length?ws.reduce((t,x)=>t+x.kg,0)/ws.length:null}}
 const cur=cmp(s1),prev=cmp(s0,s1)
 const dl=(a:number,b:number)=>a===b?'igual':(a>b?'+':'')+(a-b)
 const wk=Array.from({length:8},(_,i)=>{const st=startOfWeek(addDays(now,-7*(7-i))),a=f(addDays(st,-1)),b=f(addDays(st,6))
  return{l:format(st,'dd/MM'),n:new Set([...d.workouts,...d.acts].filter(x=>inR(x.date,a,b)).map(x=>x.date)).size}})
 const ms=d.measures??[],parts=Array.from(new Set(ms.map(m=>m.part))),sel=part||parts[0]
 const mdata=ms.filter(m=>m.part===sel).sort((a,b)=>a.date.localeCompare(b.date))
 const row=(l:string,c:string|number,p:string|number,dd:string)=><tr><td>{l}</td><td>{c}</td><td className="mut">{p}</td><td>{dd}</td></tr>
 return <>
  <section className="card"><div className="between"><b>Comparar períodos</b><select aria-label="Período" style={{width:'auto'}} value={per} onChange={e=>setPer(+e.target.value)}><option value={7}>7 dias</option><option value={30}>30 dias</option><option value={90}>90 dias</option></select></div>
   <p className="mut">Os últimos {per} dias contra os {per} dias anteriores.</p>
   <div style={{overflowX:'auto'}}><table className="cmp"><thead><tr><th></th><th>Agora</th><th>Antes</th><th>Variação</th></tr></thead><tbody>
    {row('Treinos',cur.w,prev.w,dl(cur.w,prev.w))}{row('Atividades',cur.a,prev.a,dl(cur.a,prev.a))}{row('Dias ativos',cur.days,prev.days,dl(cur.days,prev.days))}
    {row('Peso médio',cur.kg?cur.kg.toFixed(1)+' kg':'—',prev.kg?prev.kg.toFixed(1)+' kg':'—',cur.kg&&prev.kg?(cur.kg-prev.kg>0?'+':'')+(cur.kg-prev.kg).toFixed(1)+' kg':'—')}</tbody></table></div></section>
  <section className="card"><b>Consistência (8 semanas)</b><p className="mut">Dias ativos por semana{target?`. Verde: meta de ${target} dias atingida.`:'.'}</p>
   <div style={{height:150}}><ResponsiveContainer><BarChart data={wk}><XAxis dataKey="l" stroke="#8a948e" fontSize={11}/><YAxis hide domain={[0,7]}/><Tooltip contentStyle={tip} formatter={(v:number)=>[v+' dias','Ativos']}/><Bar dataKey="n" radius={[6,6,0,0]}>{wk.map((x,i)=><Cell key={i} fill={target&&x.n>=target?'#b6f23a':'#4a5550'}/>)}</Bar></BarChart></ResponsiveContainer></div></section>
  <section className="card"><b>Medidas</b>
   {parts.length?<><select aria-label="Parte do corpo" value={sel} onChange={e=>setPart(e.target.value)}>{parts.map(p=><option key={p}>{p}</option>)}</select>
    {mdata.length>1?<><p className="mut">{mdata[0].cm} cm → {mdata[mdata.length-1].cm} cm ({(mdata[mdata.length-1].cm-mdata[0].cm>0?'+':'')+(mdata[mdata.length-1].cm-mdata[0].cm).toFixed(1)} cm)</p>
     <div style={{height:150}}><ResponsiveContainer><LineChart data={mdata}><XAxis dataKey="date" hide/><YAxis hide domain={['auto','auto']}/><Tooltip contentStyle={tip} formatter={(v:number)=>[v+' cm',sel]}/><Line dataKey="cm" stroke="#b6f23a" strokeWidth={2}/></LineChart></ResponsiveContainer></div></>
    :<p className="mut">Registre ao menos duas medidas desta parte para ver a evolução.</p>}</>
   :<Empty title="Nenhuma medida registrada" text="Registre medidas (braço, cintura…) na aba Mais (seção Medidas) para acompanhar aqui."/>}</section></>}
