import {startOfWeek,format} from 'date-fns'
import {LineChart,Line,ResponsiveContainer} from 'recharts'
import {PData,volume,pct} from './storage'
import {activeDates,streak,planFor} from './analytics'
const DN=['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado']
export default function Dashboard({name,d,goTab,weekGoal}:{name:string;d:PData;goTab:(t:string)=>void;weekGoal?:number}){
 const now=new Date();const wk=format(startOfWeek(now,{weekStartsOn:1}),'yyyy-MM-dd');const h=now.getHours()
 const ds=activeDates(d);const wW=d.workouts.filter(w=>w.date>=wk),wA=d.acts.filter(a=>a.date>=wk)
 const mins=wW.reduce((a,w)=>a+w.minutes,0)+wA.reduce((a,x)=>a+x.minutes,0);const vol=wW.reduce((a,w)=>a+volume(w),0)
 const wts=[...d.weights].sort((a,b)=>a.date.localeCompare(b.date));const cur=wts[wts.length-1]
 const g=(d.goals??[])[0];const gp=g&&g.target!==g.start?Math.max(0,Math.min(100,(g.current-g.start)/(g.target-g.start)*100)):0
 const plan=planFor(d,now)[String(now.getDay())];const rem=d.reminder?.on&&format(now,'HH:mm')>=d.reminder.time&&!ds.has(format(now,'yyyy-MM-dd'))
 const ev=[...d.workouts.map(x=>({date:x.date,t:x.routine??'Treino',x:`${x.exs.length} exercícios · ${volume(x)} kg`})),...d.acts.map(x=>({date:x.date,t:x.kind,x:`${x.minutes} min`})),...d.weights.map(x=>({date:x.date,t:'Peso',x:`${x.kg} kg`}))].sort((a,b)=>b.date.localeCompare(a.date)).slice(0,5)
 const Stat=({v,l}:{v:string|number;l:string})=><div className="card"><div className="big">{v}</div><div className="mut">{l}</div></div>
 return <>
  <div className="card"><div className="mut">{DN[now.getDay()]}, {format(now,'dd/MM')}</div><h2>{h<12?'Bom dia':h<18?'Boa tarde':'Boa noite'}, {name}</h2>
   <div className="mut">Treino de hoje (sugestão): <b style={{color:'#b6f23a'}}>{plan||'não planejado'}</b></div>
   <div className="row" style={{marginTop:8}}><button className="p" onClick={()=>goTab('train')}>Treinar</button><button onClick={()=>goTab('more')}>Agenda</button><button onClick={()=>goTab('acts')}>Outra atividade</button></div></div>
  {rem&&<div className="card" style={{borderColor:'#b6f23a'}}>🔔 Você ainda não registrou nada hoje.</div>}
  <div className="grid"><Stat v={wW.length} l="Treinos na semana"/><Stat v={`${[...ds].filter(x=>x>=wk).length}${weekGoal?'/'+weekGoal:''}`} l={weekGoal?'Dias ativos / disponíveis':'Dias ativos na semana'}/>
   <Stat v={`${mins} min`} l="Tempo na semana"/><Stat v={`${streak(ds)} d`} l="Sequência de dias ativos"/></div>
  <div className="card"><div className="mut">Volume da semana: {vol} kg</div></div>
  <div className="card"><b>Peso</b>{cur?<><div className="big">{cur.kg} kg</div>{wts.length>1&&<div className="mut">{pct(wts[0].kg,cur.kg).toFixed(1)}% desde o 1º registro ({wts.length} registros)</div>}
   {wts.length>1&&<div style={{height:60}}><ResponsiveContainer><LineChart data={wts}><Line dataKey="kg" stroke="#b6f23a" dot={false} strokeWidth={2}/></LineChart></ResponsiveContainer></div>}</>:<div className="mut">Sem registros de peso.</div>}</div>
  <div className="card"><b>Meta principal</b>{g?<><div className="mut">{g.name}: {g.current} (alvo {g.target})</div><div style={{background:'#0f1211',borderRadius:8,height:8,margin:'8px 0'}}><div style={{width:gp+'%',background:'#b6f23a',height:8,borderRadius:8}}/></div><div className="mut">{Math.round(gp)}%</div></>:<div className="mut">Nenhuma meta. Crie em Mais.</div>}</div>
  <div className="card"><b>Atividades recentes</b>{ev.length?ev.map((e,i)=><div key={i} className="mut">{e.date} · <span style={{color:'#fff'}}>{e.t}</span> · {e.x}</div>):<div className="mut">Nada registrado ainda.</div>}</div></>}
