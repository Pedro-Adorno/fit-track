import {useState} from 'react'
import {format} from 'date-fns'
import {PData,uid} from './storage'
import {toast,ask,Empty} from './ui'
const BASE:Record<string,string[]>={Corrida:['Distância (km)','Duração (min)'],Caminhada:['Distância (km)','Duração (min)'],Ciclismo:['Distância (km)','Duração (min)'],'Natação':['Distância (m)','Duração (min)'],Basquete:['Pontos','Duração (min)'],'Vôlei':['Pontos','Duração (min)'],Funcional:['Duração (min)','Esforço (1-10)']}
const num=(m:Record<string,number>,k:string)=>{const e=Object.entries(m).find(([n])=>n.toLowerCase().startsWith(k));return e?e[1]:0}
export default function Others({d,up}:{d:PData;up:(f:(x:PData)=>void)=>void}){
 const mods={...BASE,...Object.fromEntries((d.mods??[]).map(m=>[m.name,m.metrics]))},names=Object.keys(mods)
 const [mod,setMod]=useState(names[0]),[date,setDate]=useState(format(new Date(),'yyyy-MM-dd')),[vals,setVals]=useState<Record<string,string>>({}),[obs,setObs]=useState(''),[nn,setNn]=useState(''),[nm,setNm]=useState('')
 const ms=mods[mod]??[],list=[...(d.sports??[])].sort((a,b)=>b.date.localeCompare(a.date))
 const add=()=>{const metrics:Record<string,number>={};ms.forEach(k=>{if(vals[k]!==''&&vals[k]!==undefined){if(!(+vals[k]>=0))return;metrics[k]=+vals[k]}})
  if(!date)return toast('Informe a data.');if(!Object.keys(metrics).length)return toast('Preencha pelo menos uma métrica.')
  up(x=>{x.sports=[...(x.sports??[]),{id:uid(),date,mod,metrics,notes:obs.trim()||undefined}]});setVals({});setObs('');toast(`${mod} registrada.`)}
 const create=()=>{const metrics=nm.split(',').map(s=>s.trim().slice(0,24)).filter(Boolean).slice(0,6);if(!nn.trim()||!metrics.length)return toast('Informe o nome do esporte e ao menos uma métrica (separe por vírgula).')
  if(names.some(n=>n.toLowerCase()===nn.trim().toLowerCase()))return toast('Este esporte já existe.')
  up(x=>{x.mods=[...(x.mods??[]),{name:nn.trim().slice(0,30),metrics}]});setMod(nn.trim());setNn('');setNm('');toast('Esporte criado.')}
 const extra=(s:{mod:string;metrics:Record<string,number>})=>{const km=num(s.metrics,'dist'),min=num(s.metrics,'dura');if(!km||!min||!['Corrida','Caminhada','Ciclismo'].includes(s.mod))return ''
  const p=min/km;return s.mod==='Ciclismo'?` · ${(km/(min/60)).toFixed(1)} km/h`:` · ${Math.floor(p)}:${String(Math.round((p%1)*60)).padStart(2,'0')} min/km`}
 const tot:Record<string,{n:number;m:Record<string,number>}>={};list.forEach(s=>{const t=(tot[s.mod]??={n:0,m:{}});t.n++;Object.entries(s.metrics).forEach(([k,v])=>t.m[k]=(t.m[k]??0)+v)})
 return <><div className="card"><h2>Outros esportes</h2><p className="mut">Cada esporte tem suas próprias métricas. Ritmo e velocidade são calculados quando há distância e duração.</p>
  <select aria-label="Esporte" value={mod} onChange={e=>{setMod(e.target.value);setVals({})}}>{names.map(n=><option key={n}>{n}</option>)}</select>
  <input type="date" aria-label="Data" value={date} onChange={e=>setDate(e.target.value)}/>
  <div className="row wrap">{ms.map(k=><input key={k} type="number" inputMode="decimal" placeholder={k} aria-label={k} value={vals[k]??''} onChange={e=>setVals({...vals,[k]:e.target.value})}/>)}</div>
  <input placeholder="Observações / local" value={obs} onChange={e=>setObs(e.target.value)}/><button className="p" style={{width:'100%'}} onClick={add}>Registrar {mod}</button>
  <h2 style={{marginTop:16}}>Novo esporte</h2><input placeholder="Nome (ex.: Tênis)" value={nn} onChange={e=>setNn(e.target.value)}/><input placeholder="Métricas separadas por vírgula (ex.: Sets, Duração (min))" value={nm} onChange={e=>setNm(e.target.value)}/><button onClick={create}>Criar esporte</button></div>
  <div className="card"><b>Resumo e histórico</b>{list.length?<>{Object.entries(tot).map(([k,t])=><p key={k} className="mut">{k}: {t.n} registro(s) · {Object.entries(t.m).map(([a,b])=>`${a} ${+b.toFixed(1)}`).join(' · ')}</p>)}
   {list.slice(0,30).map(s=><div key={s.id} className="between" style={{marginTop:8}}><span>{format(new Date(s.date+'T12:00:00'),'dd/MM')} · {s.mod}<span className="mut"> · {Object.entries(s.metrics).map(([k,v])=>`${v} ${k.replace(/\s*\(.*\)/,'').toLowerCase()}`).join(', ')}{extra(s)}{s.notes?` · ${s.notes}`:''}</span></span><button className="link d" aria-label="Excluir registro" onClick={()=>ask('Excluir este registro?',()=>up(x=>{x.sports=(x.sports??[]).filter(y=>y.id!==s.id)}),'Excluir')}>Excluir</button></div>)}</>
   :<Empty title="Nada registrado ainda" text="Registre uma corrida, caminhada, pedalada ou o esporte que você criar."/>}</div></>}
