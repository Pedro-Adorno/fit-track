import {format,addDays,startOfWeek,parseISO,differenceInCalendarDays,isSameMonth} from 'date-fns'
import {AreaChart,Area,XAxis,YAxis,Tooltip,ResponsiveContainer} from 'recharts'
import {PData,Routine} from './storage'
import {Icon,Empty,Info} from './ui'
const D=['D','S','T','Q','Q','S','S']
export default function Home({d,go,target,routines=[],mates=[]}:{d:PData;go:(t:string)=>void;target:number;routines?:Routine[];mates?:{name:string;next?:string}[]}){
 const now=new Date(),fmt=(x:Date)=>format(x,'yyyy-MM-dd')
 const done=new Set([...d.workouts.map(x=>x.date),...d.acts.map(x=>x.date)])
 const plan=d.plan??{},next=plan[String(now.getDay())],rt=routines.find(r=>r.name===next)
 let streak=0;for(let i=done.has(fmt(now))?0:1;done.has(fmt(addDays(now,-i)));i++)streak++
 const ws=startOfWeek(now),wk=Array.from({length:7},(_,i)=>addDays(ws,i))
 const wkDone=wk.filter(x=>done.has(fmt(x))).length
 const wts=[...d.weights].sort((a,b)=>a.date.localeCompare(b.date))
 const delta=wts.length>1?wts[wts.length-1].kg-wts[0].kg:null
 const month=d.workouts.filter(x=>isSameMonth(parseISO(x.date),now)).length
 const goals=(d.goals??[]).slice(0,3)
 const prog=(g:{start:number;target:number;current:number})=>g.target===g.start?0:Math.max(0,Math.min(100,(g.current-g.start)/(g.target-g.start)*100))
 const lastDay=[...done].sort().pop()
 return <div className="dash">
  <section className="card hero"><span className="eyebrow">Hoje · {format(now,'dd/MM')}</span>
   {next&&next!=='Descanso'?<><h2>{next}</h2><p className="mut">Planejado na sua agenda semanal.</p>{rt&&(rt.exs.length?<ul className="exl">{rt.exs.map(e=><li key={e.id}><span>{e.name}</span><span className="mut">{e.sets}×{e.reps}</span></li>)}</ul>:<p className="mut">Esta rotina ainda não tem exercícios.</p>)}<button className="p" onClick={()=>go('train')}>Iniciar treino</button></>
   :next==='Descanso'?<><h2>Dia de descanso</h2><p className="mut">Recuperar também é treinar. Se quiser, registre um treino extra.</p><button onClick={()=>go('train')}>Registrar treino mesmo assim</button></>
   :<Empty title="Nenhum treino planejado para hoje" text="Monte sua semana na Agenda para ver aqui seu próximo treino." action="Abrir agenda" onAction={()=>go('more')}/>}</section>
  {mates.length>0&&<section className="card"><b>Hoje com quem treina junto</b>{mates.map(m=><div key={m.name} className="between" style={{marginTop:8}}><span>{m.name}</span><span className="mut">{m.next??'Sem plano hoje'}</span></div>)}</section>}
  <section className="card"><div className="between"><b>Esta semana</b><span className="mut">{wkDone} de {target||'?'} dias</span></div>
   <div className="week">{wk.map((x,i)=><div key={i} className={'day'+(done.has(fmt(x))?' ok':'')+(fmt(x)===fmt(now)?' now':'')}><span>{D[i]}</span><i>{done.has(fmt(x))?<Icon n="check" s={16}/>:null}</i></div>)}</div>
   <div className="bar"><div style={{width:Math.min(100,target?wkDone/target*100:0)+'%'}}/></div>
   <p className="mut">{target?'Meta de frequência definida no seu perfil.':'Defina sua frequência semanal na avaliação inicial.'}</p></section>
  <div className="grid3">
   <div className="card stat"><Info t="Dias seguidos com treino ou atividade registrados. Se hoje ainda não houver registro, a sequência de ontem continua valendo."/><Icon n="flame"/><div className="big">{streak}</div><div className="mut">dias seguidos{lastDay&&streak===0?` · último ${differenceInCalendarDays(now,parseISO(lastDay))}d atrás`:''}</div></div>
   <div className="card stat"><Info t="Quantidade de treinos registrados neste mês."/><Icon n="train"/><div className="big">{month}</div><div className="mut">treinos no mês</div></div>
   <div className="card stat"><Info t="Último peso registrado e a variação desde o primeiro registro."/><Icon n="body"/><div className="big">{wts.length?wts[wts.length-1].kg:'—'}<small> kg</small></div><div className="mut">{delta===null?'peso atual':(delta>=0?'+':'')+delta.toFixed(1)+' kg desde o início'}</div></div></div>
  <section className="card"><div className="between"><b>Peso</b><button className="link" onClick={()=>go('body')}>Ver evolução</button></div>
   {wts.length>1?<div style={{height:150}}><ResponsiveContainer><AreaChart data={wts}><XAxis dataKey="date" hide/><YAxis domain={['auto','auto']} hide/><Tooltip contentStyle={{background:'#171a18',border:'1px solid #262b28',borderRadius:10}} formatter={(v:number)=>[v+' kg','Peso']}/><Area dataKey="kg" stroke="#b6f23a" strokeWidth={2} fill="#b6f23a22"/></AreaChart></ResponsiveContainer></div>
   :<Empty title="Gráfico indisponível" text="Registre pelo menos dois pesos em datas diferentes para ver sua curva." action="Registrar peso" onAction={()=>go('body')}/>}</section>
  <section className="card"><div className="between"><b>Metas</b><button className="link" onClick={()=>go('more')}>Gerenciar</button></div>
   {goals.length?goals.map(g=><div key={g.id} className="goal"><div className="between"><span>{g.name}</span><span className="mut">{Math.round(prog(g))}%</span></div><div className="bar"><div style={{width:prog(g)+'%'}}/></div></div>)
   :<Empty title="Sem metas ainda" text="Metas dão direção ao treino. Crie a primeira em Mais." action="Criar meta" onAction={()=>go('more')}/>}</section></div>}
