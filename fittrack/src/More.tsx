import {useState} from 'react'
import {format,parseISO,differenceInDays,subDays,isSameMonth,subMonths,startOfWeek,addDays} from 'date-fns'
import {PData,uid,volume,pct} from './storage'
const DAYS=['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado']
const OPTS=['','Treino A','Treino B','Treino C','Treino D','Futebol','Corrida','Cardio','Descanso']
type P={d:PData;up:(f:(x:PData)=>void)=>void}
const dates=(d:PData)=>new Set([...d.workouts.map(x=>x.date),...d.acts.map(x=>x.date)])
export default function More({d,up}:P){
 const plan=d.plan??{};const goals=d.goals??[];const [gn,setGn]=useState('');const [gs,setGs]=useState('');const [gt,setGt]=useState('');const [gd,setGd]=useState('')
 const [code,setCode]=useState('');const now=new Date();const done=dates(d)
 const todayPlan=plan[String(now.getDay())]||'Sem planejamento'
 // aderência: dias planejados (não descanso) da semana até hoje
 const ws=startOfWeek(now);let planned=0,ok=0
 for(let i=0;i<=now.getDay();i++){const dt=addDays(ws,i);const p=plan[String(dt.getDay())];if(p&&p!=='Descanso'){planned++;if(done.has(format(dt,'yyyy-MM-dd')))ok++}}
 const importPlan=(txt:string)=>{try{const o=JSON.parse(txt);if(o?.type!=='fittrack-plan'||typeof o.plan!=='object')throw 0
  const np:Record<string,string>={};for(let i=0;i<7;i++)if(typeof o.plan[i]==='string')np[i]=o.plan[i].slice(0,40)
  up(x=>{x.plan=np});alert('Plano importado!')}catch{alert('Plano inválido.')}}
 const exp=JSON.stringify({type:'fittrack-plan',v:1,plan})
 // insights (apenas com dados suficientes)
 const ins:string[]=[]
 const ws2=[...d.weights].sort((a,b)=>a.date.localeCompare(b.date))
 if(ws2.length>=3){const diff=ws2[ws2.length-1].kg-ws2[0].kg;ins.push(`Peso: ${diff>=0?'+':''}${diff.toFixed(1)} kg desde o primeiro registro (${pct(ws2[0].kg,ws2[ws2.length-1].kg).toFixed(1)}%). Calculado.`)}
 const cur=d.workouts.filter(x=>isSameMonth(parseISO(x.date),now)).length,prev=d.workouts.filter(x=>isSameMonth(parseISO(x.date),subMonths(now,1))).length
 if(cur+prev>0)ins.push(`Treinos: ${cur} neste mês vs ${prev} no anterior. Calculado.`)
 const all=[...done].sort();if(all.length&&differenceInDays(now,parseISO(all[all.length-1]))>=14)ins.push('Você está há 14 dias ou mais sem registrar atividades.')
 const by:Record<string,number[]>={};d.workouts.forEach(w=>w.exs.forEach(e=>{(by[e.name.toLowerCase()]??=[]).push(Math.max(...e.sets.map(s=>s.kg)))}))
 Object.entries(by).forEach(([n,v])=>{if(v.length>=2&&v[0]>0)ins.push(`Carga máxima em "${n}": ${pct(v[0],v[v.length-1]).toFixed(0)}% desde o primeiro registro. Calculado.`)})
 const r30=d.workouts.filter(x=>differenceInDays(now,parseISO(x.date))<30).reduce((a,w)=>a+volume(w),0)
 const p30=d.workouts.filter(x=>{const n=differenceInDays(now,parseISO(x.date));return n>=30&&n<60}).reduce((a,w)=>a+volume(w),0)
 if(r30&&p30)ins.push(`Volume dos últimos 30 dias: ${pct(p30,r30).toFixed(0)}% vs 30 dias anteriores. Calculado.`)
 // conquistas
 const nw=d.workouts.length,run=d.acts.filter(a=>a.kind==='Corrida')
 const ach=[['Primeiro treino',nw>=1],['5 treinos',nw>=5],['10 treinos',nw>=10],['30 treinos',nw>=30],['Primeira corrida',run.length>=1],['Primeiros 5 km',run.some(a=>a.km>=5)],['Primeira meta alcançada',goals.some(g=>prog(g)>=100)]] as [string,boolean][]
 function prog(g:{start:number;target:number;current:number}){return g.target===g.start?0:Math.max(0,Math.min(100,((g.current-g.start)/(g.target-g.start))*100))}
 return <>
 <div className="card"><h2>Agenda semanal</h2><div className="mut">Hoje ({DAYS[now.getDay()]}): <b style={{color:'#b6f23a'}}>{todayPlan}</b> — é só uma sugestão. O histórico guarda o que você realmente fez.</div>
  {DAYS.map((n,i)=><div key={i} className="row" style={{alignItems:'center'}}><span>{n}</span><select value={plan[i]??''} onChange={e=>up(x=>{x.plan={...(x.plan??{}),[i]:e.target.value}})}>{OPTS.map(o=><option key={o} value={o}>{o||'—'}</option>)}</select></div>)}
  <div className="mut">Aderência da semana: {planned?`${ok}/${planned} (${Math.round(ok/planned*100)}%)`:'sem dias planejados'}</div></div>
 <div className="card"><h2>Plano em grupo</h2><div className="mut">Compartilha somente a divisão semanal, nunca dados pessoais.</div>
  <div className="row"><button onClick={()=>navigator.clipboard?.writeText(exp).then(()=>alert('Código copiado!'),()=>alert('Não foi possível copiar.'))}>Copiar código</button>
  <button onClick={()=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([exp],{type:'application/json'}));a.download='plano-fittrack.json';a.click()}}>Baixar arquivo</button></div>
  <textarea style={{width:'100%'}} placeholder="Cole o código do plano de um amigo" value={code} onChange={e=>setCode(e.target.value)}/>
  <button className="p" onClick={()=>importPlan(code)}>Importar plano</button></div>
 <div className="card"><h2>Metas</h2>
  <input placeholder="Nome (ex.: Peso 75 kg)" value={gn} onChange={e=>setGn(e.target.value)}/>
  <div className="row"><input type="number" placeholder="Inicial" value={gs} onChange={e=>setGs(e.target.value)}/><input type="number" placeholder="Alvo" value={gt} onChange={e=>setGt(e.target.value)}/></div>
  <input type="date" value={gd} onChange={e=>setGd(e.target.value)}/>
  <button className="p" onClick={()=>{if(!gn.trim()||gs===''||gt==='')return alert('Preencha nome, inicial e alvo.');up(x=>{x.goals=[...(x.goals??[]),{id:uid(),name:gn.trim(),start:+gs,target:+gt,current:+gs,deadline:gd}]});setGn('');setGs('');setGt('');setGd('')}}>Criar meta</button>
  {goals.map(g=><div key={g.id} className="card"><b>{g.name}</b> <span className="mut">prazo {g.deadline||'—'} · {g.start}→{g.target}</span>
   <div style={{background:'#0f1211',borderRadius:8,height:8,margin:'8px 0'}}><div style={{width:prog(g)+'%',background:'#b6f23a',height:8,borderRadius:8}}/></div>
   <div className="row"><input type="number" defaultValue={g.current} onBlur={e=>up(x=>{x.goals=(x.goals??[]).map(y=>y.id===g.id?{...y,current:+e.target.value}:y)})}/>
   <button className="d" onClick={()=>confirm('Excluir meta?')&&up(x=>{x.goals=(x.goals??[]).filter(y=>y.id!==g.id)})}>Excluir</button></div>
   <div className="mut">{Math.round(prog(g))}% · {prog(g)>=100?'Concluída':'Em andamento'}</div></div>)}</div>
 <div className="card"><h2>Insights FitTrack</h2>{ins.length?ins.map((t,i)=><p key={i}>• {t}</p>):<div className="mut">Registre mais treinos e pesos para gerar insights confiáveis.</div>}</div>
 <div className="card"><h2>Conquistas</h2>{ach.map(([n,u])=><div key={n} style={{opacity:u?1:.4}}>{u?'🏆':'🔒'} {n}</div>)}</div></>}
