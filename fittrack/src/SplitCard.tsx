import {useState} from 'react'
import {format} from 'date-fns'
import {PData,Routine} from './storage'
import {PRESETS,nextSession} from './splits'
import {toast,Info} from './ui'
type P={d:PData;up:(f:(x:PData)=>void)=>void;routines:Routine[];onStart:(label:string,rt?:Routine)=>void}
export default function SplitCard({d,up,routines,onStart}:P){
 const sp=d.split,today=format(new Date(),'yyyy-MM-dd'),rec=nextSession(d)
 const [edit,setEdit]=useState(!sp),[type,setType]=useState(sp?.type??'ABC'),[custom,setCustom]=useState(''),[pick,setPick]=useState('')
 const rest=!!d.rests?.includes(today)
 const cur=(pick&&sp?.sessions.find(s=>s.label===pick))||rec?.next
 const rt=cur?.routineId?routines.find(r=>r.id===cur.routineId):undefined
 const apply=()=>{const ss=type==='Personalizada'?custom.split(',').map(s=>s.trim()).filter(Boolean).slice(0,8).map(l=>({label:l.slice(0,20),focus:''})):PRESETS[type]
  if(!ss?.length)return toast('Digite os nomes das sessões separados por vírgula (ex.: Peito, Costas, Pernas).')
  up(x=>{const old=x.split?.sessions??[];x.split={type,sessions:ss.map(s=>({...s,routineId:old.find(o=>o.label===s.label)?.routineId})),skips:x.split?.skips??[]}});setEdit(false);setPick('');toast(`Divisão ${type} configurada.`)}
 const link=(label:string,id:string)=>up(x=>{const s=x.split?.sessions.find(y=>y.label===label);if(s)s.routineId=id||undefined})
 const skip=()=>{if(!cur)return;up(x=>{x.split!.skips=[...(x.split!.skips??[]),{date:today,session:cur.label,at:Date.now()}]});setPick('');toast(`Sessão ${cur.label} pulada. A próxima já está sugerida.`)}
 const setRest=(on:boolean)=>up(x=>{x.rests=on?[...(x.rests??[]),today]:(x.rests??[]).filter(r=>r!==today)})
 if(edit||!sp)return <div className="card"><h2>Divisão de treino</h2><p className="mut">Escolha como você divide a semana. O FitTrack sugere sempre a próxima sessão pendente, mesmo se você faltar um dia.</p>
  <select aria-label="Divisão" value={type} onChange={e=>setType(e.target.value)}>{[...Object.keys(PRESETS),'Personalizada'].map(k=><option key={k}>{k}</option>)}</select>
  {type==='Personalizada'?<input placeholder="Sessões separadas por vírgula" value={custom} onChange={e=>setCustom(e.target.value)}/>:<p className="mut">{PRESETS[type].map(s=>s.label+(s.focus?` — ${s.focus}`:'')).join(' · ')}</p>}
  {sp&&<><b>Vincular rotinas</b><p className="mut">Associe cada sessão a uma das suas rotinas para ver os exercícios.</p>{sp.sessions.map(s=><label key={s.label} className="fld"><span>{s.label}</span><select value={s.routineId??''} onChange={e=>link(s.label,e.target.value)}><option value="">Sem rotina</option>{routines.map(r=><option key={r.id} value={r.id}>{r.name}</option>)}</select></label>)}</>}
  <div className="row"><button className="p" onClick={apply}>{sp?'Aplicar divisão':'Salvar divisão'}</button>{sp&&<button onClick={()=>setEdit(false)}>Fechar</button>}</div></div>
 return <div className="card hero"><div className="between"><span className="eyebrow">Treinar hoje<Info t="Sugerimos a próxima sessão que ainda não foi feita na sua divisão, independente do dia da semana."/></span><button className="link" onClick={()=>setEdit(true)}>Divisão {sp.type}</button></div>
  {rest?<><h2>Hoje é descanso</h2><p className="mut">Dia de descanso registrado. Sua próxima sessão continua sendo {rec?.next.label}.</p><button onClick={()=>setRest(false)}>Desfazer descanso</button></>
  :cur?<><h2>{cur.label}{cur.focus?` · ${cur.focus}`:''}</h2><p className="mut">{pick?'Sessão escolhida por você.':rec?.last?`Última sessão feita: ${rec.last}.`:'Primeira sessão da divisão.'}</p>
   {rt?<ul className="exl">{rt.exs.map(e=><li key={e.id}><span>{e.name}</span><span className="mut">{e.sets}×{e.reps}</span></li>)}</ul>:<p className="mut">Sem rotina vinculada. Vincule uma em “Divisão {sp.type}” para listar os exercícios.</p>}
   <button className="p" style={{width:'100%'}} onClick={()=>onStart(cur.label,rt)}>Iniciar {cur.label}</button>
   <div className="row wrap"><select aria-label="Trocar sessão" value={pick} onChange={e=>setPick(e.target.value)}><option value="">Trocar sessão…</option>{sp.sessions.map(s=><option key={s.label} value={s.label}>{s.label}{s.focus?` — ${s.focus}`:''}</option>)}</select>
    {rec?.last&&<button onClick={()=>setPick(rec.last!)}>Repetir {rec.last}</button>}<button onClick={skip}>Pular</button><button onClick={()=>setRest(true)}>Descansar hoje</button></div></>:null}</div>}
