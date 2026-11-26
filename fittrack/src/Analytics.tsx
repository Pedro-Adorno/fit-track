import {useState} from 'react'
import {format,addDays,differenceInCalendarDays,parseISO} from 'date-fns'
import {BarChart,Bar,LineChart,Line,XAxis,YAxis,Tooltip,ResponsiveContainer} from 'recharts'
import {PData} from './storage'
import {find,norm} from './exercises'
import {Empty,Info} from './ui'
const tip={background:'#171a18',border:'1px solid #262b28',borderRadius:10}
const PER:[string,number][]=[['7 dias',7],['30 dias',30],['3 meses',90],['6 meses',180],['12 meses',365],['Todo o histórico',0]]
export default function Analytics({d}:{d:PData}){
 const [per,setPer]=useState(30),[sel,setSel]=useState('')
 const from=per?format(addDays(new Date(),-per),'yyyy-MM-dd'):'0',ws=d.workouts.filter(w=>w.date>=from).sort((a,b)=>a.date.localeCompare(b.date))
 const stats:Record<string,{n:string;pts:{date:string;kg:number}[];vol:number;reps:number}>={}
 const gs:Record<string,{sets:number;days:Set<string>}>={},unk=new Set<string>()
 ws.forEach(w=>w.exs.forEach(e=>{const k=norm(e.name),s=(stats[k]??={n:e.name,pts:[],vol:0,reps:0}),top=Math.max(0,...e.sets.map(x=>x.kg))
  s.pts.push({date:w.date,kg:top});e.sets.forEach(x=>{s.vol+=x.kg*x.reps;s.reps=Math.max(s.reps,x.reps)})
  const ex=find(e.name,d.customEx);if(!ex){unk.add(e.name);return}
  const g=(gs[ex.group]??={sets:0,days:new Set()});g.sets+=e.sets.length;g.days.add(w.date)}))
 const span=per||Math.max(7,ws.length?differenceInCalendarDays(new Date(),parseISO(ws[0].date))+1:7),weeks=Math.max(1,span/7)
 const gdata=Object.entries(gs).map(([g,v])=>({g,s:+(v.sets/weeks).toFixed(1),f:+(v.days.size/weeks).toFixed(1)})).sort((a,b)=>b.s-a.s)
 const ex=Object.values(stats).sort((a,b)=>b.pts.length-a.pts.length),cur=stats[norm(sel)]??ex[0]
 const mx=cur?Math.max(...cur.pts.map(p=>p.kg)):0,first=cur?.pts[0]?.kg,last=cur?.pts[cur.pts.length-1]?.kg
 const pct=first&&last!==undefined?((last-first)/first*100):null
 const pr=ex.filter(e=>e.pts.length).map(e=>({n:e.n,kg:Math.max(...e.pts.map(p=>p.kg)),reps:e.reps})).sort((a,b)=>b.kg-a.kg).slice(0,5)
 return <section className="card"><div className="between"><b>Central de análise</b><select aria-label="Período da análise" style={{width:'auto'}} value={per} onChange={e=>setPer(+e.target.value)}>{PER.map(([l,v])=><option key={v} value={v}>{l}</option>)}</select></div>
  {!ex.length?<Empty title="Sem treinos no período" text="Registre treinos com séries para ver cargas, volume por grupo e recordes."/>:<>
  <p className="mut" style={{marginTop:12}}><b style={{color:'var(--txt)'}}>Evolução de carga por exercício</b></p>
  <select aria-label="Exercício" value={cur?.n} onChange={e=>setSel(e.target.value)}>{ex.map(e=><option key={e.n}>{e.n}</option>)}</select>
  {cur&&<><div className="grid3" style={{margin:'8px 0'}}><div className="card stat"><div className="big">{mx}<small> kg</small></div><div className="mut">carga máxima</div></div><div className="card stat"><div className="big">{last}<small> kg</small></div><div className="mut">última carga</div></div><div className="card stat"><div className="big">{pct===null?'—':(pct>=0?'+':'')+pct.toFixed(0)+'%'}</div><div className="mut">{cur.pts.length} sessões</div></div></div>
   {cur.pts.length>1?<div style={{height:140}}><ResponsiveContainer><LineChart data={cur.pts}><XAxis dataKey="date" hide/><YAxis hide domain={['auto','auto']}/><Tooltip contentStyle={tip} formatter={(v:number)=>[v+' kg','Carga máx.']}/><Line dataKey="kg" stroke="#b6f23a" strokeWidth={2}/></LineChart></ResponsiveContainer></div>:<p className="mut">Mais uma sessão deste exercício e o gráfico aparece.</p>}
   <p className="mut">Volume no período: {Math.round(cur.vol)} kg (séries × reps × carga). Só compare volumes do mesmo exercício.</p></>}
  <p className="mut" style={{marginTop:16}}><b style={{color:'var(--txt)'}}>Séries semanais por grupo muscular</b><Info t="Média de séries por semana no período, vinda dos seus registros. É um retrato do que você treinou, não um diagnóstico."/></p>
  {gdata.length?<div style={{height:Math.max(120,gdata.length*30)}}><ResponsiveContainer><BarChart data={gdata} layout="vertical"><XAxis type="number" hide/><YAxis type="category" dataKey="g" width={110} stroke="#8a948e" fontSize={12}/><Tooltip contentStyle={tip} formatter={(v:number,_n,p)=>[`${v} séries/sem · ${p.payload.f}x/sem`,'']}/><Bar dataKey="s" fill="#b6f23a" radius={[0,6,6,0]}/></BarChart></ResponsiveContainer></div>:<p className="mut">Nenhum exercício do período está na biblioteca.</p>}
  {unk.size>0&&<p className="mut">Sem grupo definido: {[...unk].slice(0,5).join(', ')}. Crie-os na Biblioteca para entrarem na análise.</p>}
  <p className="mut" style={{marginTop:16}}><b style={{color:'var(--txt)'}}>Recordes de carga</b></p>
  {pr.map(p=><div key={p.n} className="between"><span>{p.n}</span><span className="mut">{p.kg} kg · máx. {p.reps} reps</span></div>)}</>}</section>}
