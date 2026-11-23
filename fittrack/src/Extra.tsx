import {useEffect,useState} from 'react'
import {format} from 'date-fns'
import {PData,Ob,uid,volume,pace} from './storage'
const GOALS=['Hipertrofia','Emagrecimento','Força','Condicionamento','Saúde']
const PARTS=['Abdômen','Peitoral','Braço','Antebraço','Cintura','Quadril','Coxa','Panturrilha']
const today=()=>format(new Date(),'yyyy-MM-dd')
export function Onboarding({name,onDone}:{name:string;onDone:(o:Ob)=>void}){
 const [step,setStep]=useState(0);const [age,setAge]=useState('');const [h,setH]=useState('');const [goal,setGoal]=useState(GOALS[0]);const [days,setDays]=useState('4')
 const ok=()=>{if(step===0&&(!(+age>0)||!(+h>0)))return alert('Informe idade e altura válidas.');step<2?setStep(step+1):onDone({age:+age,height:+h,goal,days:+days})}
 return <div className="card"><h2>Bem-vindo, {name}!</h2><div style={{background:'#0f1211',height:6,borderRadius:6}}><div style={{width:((step+1)/3*100)+'%',background:'#b6f23a',height:6,borderRadius:6}}/></div>
  <p className="mut">Etapa {step+1} de 3 — você pode editar depois recriando o perfil.</p>
  {step===0&&<><input type="number" placeholder="Idade" value={age} onChange={e=>setAge(e.target.value)}/><input type="number" placeholder="Altura (cm)" value={h} onChange={e=>setH(e.target.value)}/></>}
  {step===1&&<select value={goal} onChange={e=>setGoal(e.target.value)}>{GOALS.map(g=><option key={g}>{g}</option>)}</select>}
  {step===2&&<select value={days} onChange={e=>setDays(e.target.value)}>{[1,2,3,4,5,6,7].map(n=><option key={n} value={n}>{n} dias por semana</option>)}</select>}
  <div className="row">{step>0&&<button onClick={()=>setStep(step-1)}>Voltar</button>}<button className="p" onClick={ok}>{step<2?'Próximo':'Concluir'}</button></div></div>}
export function Timer(){
 const [s,setS]=useState(0)
 useEffect(()=>{if(s<=0)return;const t=setTimeout(()=>setS(s-1),1000);return()=>clearTimeout(t)},[s])
 return <div className="row" style={{marginTop:8,alignItems:'center'}}><b>Descanso: {s}s</b>{[60,90,120].map(n=><button key={n} onClick={()=>setS(n)}>{n}s</button>)}<button onClick={()=>setS(0)}>Parar</button></div>}
export function Extra({d,up}:{d:PData;up:(f:(x:PData)=>void)=>void}){
 const [part,setPart]=useState(PARTS[0]);const [cm,setCm]=useState('');const [sl,setSl]=useState('');const [mo,setMo]=useState('3');const [fa,setFa]=useState('3');const [f,setF]=useState('Todos')
 const ms=d.measures??[],wl=d.well??[]
 const wellIdx=(w:{sleep:number;mood:number;fatigue:number})=>Math.round(((Math.min(w.sleep,9)/9*100)+(w.mood*20)+((6-w.fatigue)*20))/3)
 const ev=[...d.workouts.map(x=>({date:x.date,t:'Treino',txt:`${x.exs.length} exercícios · volume ${volume(x)} kg`})),
  ...d.acts.map(x=>({date:x.date,t:x.kind,txt:`${x.minutes} min${x.km>0?` · ${x.km} km · ${pace(x.km,x.minutes).toFixed(1)} min/km`:''}`})),
  ...d.weights.map(x=>({date:x.date,t:'Peso',txt:`${x.kg} kg`})),...ms.map(x=>({date:x.date,t:'Medida',txt:`${x.part}: ${x.cm} cm`}))].sort((a,b)=>b.date.localeCompare(a.date))
 const types=['Todos',...Array.from(new Set(ev.map(e=>e.t)))]
 return <>
 <div className="card"><h2>Medidas corporais</h2><div className="row"><select value={part} onChange={e=>setPart(e.target.value)}>{PARTS.map(p=><option key={p}>{p}</option>)}</select>
  <input type="number" inputMode="decimal" placeholder="cm" value={cm} onChange={e=>setCm(e.target.value)}/></div>
  <button className="p" onClick={()=>{if(!(+cm>0))return alert('Medida inválida.');up(x=>{x.measures=[...(x.measures??[]),{id:uid(),date:today(),part,cm:+cm}]});setCm('')}}>Registrar</button>
  {PARTS.map(p=>{const l=ms.filter(m=>m.part===p);if(!l.length)return null;const a=l[0].cm,b=l[l.length-1].cm;return <div key={p} className="mut">{p}: {a} → {b} cm ({(b-a>=0?'+':'')+(b-a).toFixed(1)})</div>})}</div>
 <div className="card"><h2>Bem-estar</h2><div className="row"><input type="number" placeholder="Horas de sono" value={sl} onChange={e=>setSl(e.target.value)}/>
  <select value={mo} onChange={e=>setMo(e.target.value)}>{[1,2,3,4,5].map(n=><option key={n} value={n}>Humor {n}</option>)}</select>
  <select value={fa} onChange={e=>setFa(e.target.value)}>{[1,2,3,4,5].map(n=><option key={n} value={n}>Fadiga {n}</option>)}</select></div>
  <button className="p" onClick={()=>{if(!(+sl>0&&+sl<=24))return alert('Horas de sono inválidas.');up(x=>{x.well=[...(x.well??[]),{id:uid(),date:today(),sleep:+sl,mood:+mo,fatigue:+fa}]});setSl('')}}>Registrar</button>
  {wl.length>0&&<div className="mut">Último índice de bem-estar: {wellIdx(wl[wl.length-1])}/100 (cálculo simples dos seus registros, não é avaliação médica)</div>}</div>
 <div className="card"><h2>Linha do tempo</h2><select value={f} onChange={e=>setF(e.target.value)}>{types.map(t=><option key={t}>{t}</option>)}</select>
  {ev.filter(e=>f==='Todos'||e.t===f).slice(0,50).map((e,i)=><div key={i} className="mut">{e.date} · <b style={{color:'#fff'}}>{e.t}</b> · {e.txt}</div>)}
  {!ev.length&&<div className="mut">Nenhum registro ainda.</div>}</div></>}
