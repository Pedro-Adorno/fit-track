import {useEffect,useState} from 'react'
import {format} from 'date-fns'
import {PData,Routine,RItem,uid,volume,pct} from './storage'
import {LIB,GROUPS,SAFETY,SAFE,LibEx} from './exercises'
import Illus,{poseOf} from './Illus'
type P={d:PData;up:(f:(x:PData)=>void)=>void}
type SSet={reps:string;kg:string;done:boolean}
type Sess={name:string;start:number;prev:number;items:{name:string;rest:number;last:string;sets:SSet[]}[]}
const all=(d:PData)=>[...LIB,...(d.custom??[])]
const lastOf=(d:PData,n:string)=>[...d.workouts].reverse().flatMap(w=>w.exs).find(e=>e.name.toLowerCase()===n.toLowerCase())
const num=(e:React.ChangeEvent<HTMLInputElement>)=>Math.max(0,+e.target.value||0)
export function TrainNav({show,sub,setSub,d,up,pid,ob}:P&{show:boolean;sub:string;setSub:(s:string)=>void;pid:string;ob?:Record<string,any>}){
 const SK='fittrack:sess:'+pid
 const [sess,setSess]=useState<Sess|null>(()=>{try{return JSON.parse(localStorage.getItem(SK)||'null')}catch{return null}});const [rest,setRest]=useState(0);const [rpe,setRpe]=useState('7');const [notes,setNotes]=useState('')
 useEffect(()=>{try{sess?localStorage.setItem(SK,JSON.stringify(sess)):localStorage.removeItem(SK)}catch{}},[sess])
 useEffect(()=>{if(rest<=0)return;const t=setTimeout(()=>setRest(rest-1),1000);return()=>clearTimeout(t)},[rest])
 const start=(r:Routine)=>{if(!r.items.length)return alert('Adicione exercícios à rotina.')
  const pw=[...d.workouts].reverse().find(w=>w.routine===r.name)
  setSess({name:r.name,start:Date.now(),prev:pw?volume(pw):0,items:r.items.map(it=>{const l=lastOf(d,it.name);const kg=l?String(l.sets[l.sets.length-1].kg):String(it.kg)
   return{name:it.name,rest:it.rest,last:l?l.sets.map(s=>`${s.reps}×${s.kg}kg`).join(' · '):'sem registro',sets:Array.from({length:it.sets},()=>({reps:String(it.reps),kg,done:false}))}})});setSub('sessao')}
 const ms=(f:(s:Sess)=>void)=>setSess(p=>{if(!p)return p;const n=structuredClone(p);f(n);return n})
 const finish=()=>{if(!sess)return;const exs=sess.items.map(it=>({name:it.name,sets:it.sets.filter(s=>s.done&&+s.reps>0).map(s=>({reps:+s.reps,kg:+s.kg||0}))})).filter(e=>e.sets.length)
  if(!exs.length)return alert('Conclua ao menos uma série (✓).')
  const w={id:uid(),date:format(new Date(),'yyyy-MM-dd'),exs,minutes:Math.max(1,Math.round((Date.now()-sess.start)/60000)),notes,rpe:+rpe,routine:sess.name};const v=volume(w)
  up(x=>{x.workouts.push(w)});alert(`Treino salvo! Volume ${v} kg`+(sess.prev?` (${pct(sess.prev,v).toFixed(0)}% vs último ${sess.name}).`:'.'));setSess(null);setNotes('');setRest(0);setSub('rotinas')}
 return <div style={{display:show?'block':'none'}}><div className="row" style={{flexWrap:'wrap'}}>{[['rotinas','Rotinas'],['sessao','Sessão'],['lib','Biblioteca'],['livre','Livre']].map(([k,l])=><button key={k} className={sub===k?'p':''} onClick={()=>setSub(k)}>{l}</button>)}</div>
  {sub==='rotinas'&&<Routines d={d} up={up} onStart={start} ob={ob}/>}
  {sub==='lib'&&<Library d={d} up={up}/>}
  {sub==='sessao'&&(!sess?<div className="card mut">Nenhuma sessão ativa. Inicie uma rotina na aba Rotinas.</div>:<div>
   <div className="card"><h2>{sess.name}</h2>{rest>0&&<div className="big">Descanso {rest}s <button onClick={()=>setRest(0)}>Pular</button></div>}</div>
   {sess.items.map((it,i)=><div key={i} className="card"><b>{it.name}</b><div className="mut">Última vez: {it.last}</div>
    {it.sets.map((s,j)=><div key={j} className="row" style={{alignItems:'center',opacity:s.done?.6:1}}><span style={{flex:'0 0 24px'}}>{j+1}</span>
     <input type="number" inputMode="numeric" value={s.reps} onChange={e=>ms(n=>{n.items[i].sets[j].reps=e.target.value})}/>
     <input type="number" inputMode="decimal" value={s.kg} onChange={e=>ms(n=>{n.items[i].sets[j].kg=e.target.value})}/>
     <button className={s.done?'p':''} style={{flex:'0 0 48px'}} onClick={()=>{ms(n=>{n.items[i].sets[j].done=!s.done});if(!s.done)setRest(it.rest)}}>✓</button></div>)}
    <div className="row"><button onClick={()=>ms(n=>{const l=n.items[i].sets;l.push({...l[l.length-1]??{reps:'10',kg:'0'},done:false})})}>+ série</button>
    <button className="d" onClick={()=>ms(n=>{n.items.splice(i,1)})}>Remover</button></div></div>)}
   <select value="" onChange={e=>{const x=all(d).find(l=>l.name===e.target.value);if(x)ms(n=>{n.items.push({name:x.name,rest:90,last:lastOf(d,x.name)?.sets.map(s=>`${s.reps}×${s.kg}kg`).join(' · ')??'sem registro',sets:Array.from({length:x.sets},()=>({reps:String(x.reps),kg:'0',done:false}))})})}}><option value="">+ Adicionar exercício ao treino…</option>{all(d).map(l=><option key={l.name}>{l.name}</option>)}</select>
   <div className="card"><div>Percepção de esforço (1–10)</div><select value={rpe} onChange={e=>setRpe(e.target.value)}>{[1,2,3,4,5,6,7,8,9,10].map(n=><option key={n}>{n}</option>)}</select>
    <input placeholder="Observações" value={notes} onChange={e=>setNotes(e.target.value)}/>
    <div className="row"><button className="p" onClick={finish}>Finalizar treino</button><button className="d" onClick={()=>confirm('Descartar sessão?')&&(setSess(null),setRest(0))}>Descartar</button></div></div></div>)}</div>}
function Routines({d,up,onStart,ob}:P&{onStart:(r:Routine)=>void;ob?:Record<string,any>}){
 const rs=d.routines??[];const [name,setName]=useState('');const [sel,setSel]=useState('')
 const upR=(id:string,f:(r:Routine)=>void)=>up(x=>{const l=structuredClone(x.routines??[]);const r=l.find(y=>y.id===id);if(r)f(r);x.routines=l})
 const r=rs.find(x=>x.id===sel)
 if(r)return <div className="card"><button onClick={()=>setSel('')}>← Voltar</button><h2>{r.name}</h2>
  {r.items.map((it,i)=><div key={i} className="card"><b>{it.name}</b> <span className="mut">{it.group}</span>
   <div className="row">{(['sets','reps','kg','rest'] as const).map(k=><label key={k} className="mut">{{sets:'Séries',reps:'Reps',kg:'Carga kg',rest:'Desc. s'}[k]}<input type="number" value={it[k]} onChange={e=>upR(r.id,y=>{y.items[i][k]=num(e)})}/></label>)}</div>
   <div className="row"><button disabled={i===0} onClick={()=>upR(r.id,y=>{[y.items[i-1],y.items[i]]=[y.items[i],y.items[i-1]]})}>↑</button><button disabled={i===r.items.length-1} onClick={()=>upR(r.id,y=>{[y.items[i+1],y.items[i]]=[y.items[i],y.items[i+1]]})}>↓</button>
   <button className="d" onClick={()=>upR(r.id,y=>{y.items.splice(i,1)})}>Remover</button></div></div>)}
  <select value="" onChange={e=>{const x=all(d).find(l=>l.name===e.target.value);if(x)upR(r.id,y=>{y.items.push({name:x.name,group:x.group,sets:x.sets,reps:x.reps,kg:0,rest:90})})}}><option value="">+ Adicionar da biblioteca…</option>{all(d).map(l=><option key={l.name} value={l.name}>{l.group} — {l.name}</option>)}</select>
  <button className="p" style={{marginTop:8}} onClick={()=>onStart(r)}>Iniciar treino</button></div>
 return <div className="card"><h2>Rotinas</h2><button onClick={()=>{if(!ob)return alert('Faça a avaliação primeiro.');if(confirm('Criar rotinas sugeridas pela sua avaliação? São regras simples, não uma prescrição profissional.'))up(x=>{x.routines=[...(x.routines??[]),...suggest(ob,x)]})}}>Sugerir rotinas pela minha avaliação</button><div className="row"><input placeholder="Nome (ex.: Treino A — Peito)" value={name} onChange={e=>setName(e.target.value)}/>
  <button className="p" onClick={()=>{if(!name.trim())return alert('Informe um nome.');const id=uid();up(x=>{x.routines=[...(x.routines??[]),{id,name:name.trim(),items:[]}]});setName('');setSel(id)}}>Criar</button></div>
  {!rs.length&&<div className="mut">Crie rotinas (A, B, C, D…) e use-as na agenda semanal.</div>}
  {rs.map(x=><div key={x.id} className="card"><b>{x.name}</b> <span className="mut">{x.items.length} exercícios</span><div className="row" style={{flexWrap:'wrap'}}>
   <button className="p" onClick={()=>onStart(x)}>Iniciar</button><button onClick={()=>setSel(x.id)}>Editar</button>
   <button onClick={()=>up(y=>{y.routines=[...(y.routines??[]),{...structuredClone(x),id:uid(),name:x.name+' (cópia)'}]})}>Duplicar</button>
   <button className="d" onClick={()=>confirm('Excluir rotina?')&&up(y=>{y.routines=(y.routines??[]).filter(z=>z.id!==x.id)})}>Excluir</button></div></div>)}</div>}
const POSES:[string,string][]=[['squat','Agachar / empurrar com as pernas'],['hinge','Dobrar o quadril'],['bench','Deitado, empurrar'],['press','Empurrar acima da cabeça'],['curl','Flexionar / estender o cotovelo'],['row','Puxar'],['core','Abdômen / chão']]
const EQ=['Barra','Barra W','Halteres','Polia','Máquina','Peso corporal','Kettlebell','Elástico','Outro']
const blank={name:'',group:GROUPS[0],sec:'',equip:'Halteres',instr:'',sets:'3',reps:'10',pose:'squat',safety:''}
function Library({d,up}:P){
 const [g,setG]=useState('Todos');const [q,setQ]=useState('');const [open,setOpen]=useState('');const [f,setF]=useState(blank);const [edit,setEdit]=useState<string|null>(null);const [form,setForm]=useState(false);const [rid,setRid]=useState('')
 const list=all(d).filter(x=>(g==='Todos'||x.group===g)&&x.name.toLowerCase().includes(q.toLowerCase()));const rs=d.routines??[]
 const fill=(x:LibEx,same:boolean)=>{setF({name:same?x.name:x.name+' (meu)',group:x.group,sec:x.sec,equip:x.equip,instr:x.instr,sets:String(x.sets),reps:String(x.reps),pose:poseOf(x),safety:x.safety??''});setEdit(same?x.name:null);setForm(true)}
 const save=()=>{const n=f.name.trim(),s=+f.sets,r=+f.reps
  if(!n)return alert('Informe o nome.');if(!(s>=1&&s<=20)||!(r>=1&&r<=600))return alert('Séries (1–20) e repetições (1–600) inválidas.')
  if(all(d).some(x=>x.name.toLowerCase()===n.toLowerCase()&&x.name!==edit))return alert('Já existe um exercício com esse nome.')
  const ex:LibEx={name:n,group:f.group,sec:f.sec.trim(),equip:f.equip,instr:f.instr.trim(),sets:s,reps:r,pose:f.pose,safety:f.safety.trim()||undefined,custom:true}
  up(x=>{const c=x.custom??[];x.custom=edit!==null?c.map(y=>y.name===edit?ex:y):[...c,ex];if(edit!==null&&edit!==n)x.routines=(x.routines??[]).map(r=>({...r,items:r.items.map(i=>i.name===edit?{...i,name:n,group:f.group}:i)}))})
  setF(blank);setEdit(null);setForm(false)}
 const addTo=(x:LibEx)=>{if(!rid)return alert('Escolha uma rotina.');up(y=>{const r=(y.routines??[]).find(z=>z.id===rid);if(r)r.items.push({name:x.name,group:x.group,sets:x.sets,reps:x.reps,kg:0,rest:90})});alert('Adicionado à rotina.')}
 const set=(k:keyof typeof blank)=>(e:{target:{value:string}})=>setF({...f,[k]:e.target.value})
 return <div className="card"><h2>Biblioteca ({all(d).length})</h2><input placeholder="Buscar exercício" value={q} onChange={e=>setQ(e.target.value)}/>
  <select value={g} onChange={e=>setG(e.target.value)}>{['Todos',...GROUPS].map(x=><option key={x}>{x}</option>)}</select>
  <button className="p" onClick={()=>{setF(blank);setEdit(null);setForm(!form)}}>{form?'Fechar formulário':'+ Novo exercício'}</button>
  {form&&<div className="card"><h2>{edit!==null?'Editar exercício':'Novo exercício'}</h2>
   <input placeholder="Nome" value={f.name} onChange={set('name')}/>
   <select value={f.group} onChange={set('group')}>{GROUPS.map(x=><option key={x}>{x}</option>)}</select>
   <input placeholder="Músculos secundários (ex.: Tríceps, Ombros)" value={f.sec} onChange={set('sec')}/>
   <select value={f.equip} onChange={set('equip')}>{EQ.map(x=><option key={x}>{x}</option>)}</select>
   <textarea style={{width:'100%'}} rows={3} placeholder="Instruções de execução" value={f.instr} onChange={set('instr')}/>
   <div className="row"><input type="number" placeholder="Séries" value={f.sets} onChange={set('sets')}/><input type="number" placeholder="Reps" value={f.reps} onChange={set('reps')}/></div>
   <select value={f.pose} onChange={set('pose')}>{POSES.map(([k,l])=><option key={k} value={k}>Desenho: {l}</option>)}</select>
   <input placeholder="Observações de segurança (opcional)" value={f.safety} onChange={set('safety')}/>
   <Illus ex={{name:f.name||'Novo',group:f.group,sec:'',equip:f.equip,instr:'',sets:3,reps:10,pose:f.pose}}/>
   {edit!==null&&<div className="mut">Renomear atualiza suas rotinas, mas não os treinos já registrados.</div>}
   <div className="row"><button className="p" onClick={save}>Salvar</button><button onClick={()=>{setForm(false);setEdit(null)}}>Cancelar</button></div></div>}
  {list.map((x:LibEx)=><div key={x.name} className="card" onClick={()=>setOpen(open===x.name?'':x.name)}><b>{x.name}</b> <span className="mut">{x.group} · {x.equip}{x.custom?' · meu':''}</span>
   {open===x.name&&<div className="mut" onClick={e=>e.stopPropagation()}><p>{x.instr||'Sem instruções.'}</p><p>Secundários: {x.sec||'—'} · Sugestão: {x.sets}×{x.reps}</p><Illus ex={x}/><p>{x.safety??SAFE[x.group]??SAFETY}</p><p>Ilustração esquemática; confirme a técnica com um profissional.</p>
    {rs.length>0&&<div className="row"><select value={rid} onChange={e=>setRid(e.target.value)}><option value="">Adicionar à rotina…</option>{rs.map(r=><option key={r.id} value={r.id}>{r.name}</option>)}</select><button onClick={()=>addTo(x)}>Adicionar</button></div>}
    <div className="row" style={{flexWrap:'wrap'}}><button onClick={()=>fill(x,false)}>Personalizar (criar cópia)</button>{x.custom&&<><button onClick={()=>fill(x,true)}>Editar</button>
     <button className="d" onClick={()=>confirm('Excluir exercício?')&&up(y=>{y.custom=(y.custom??[]).filter(z=>z.name!==x.name)})}>Excluir</button></>}</div></div>}</div>)}
  {!list.length&&<div className="mut">Nenhum exercício encontrado.</div>}</div>}

function suggest(ob:Record<string,any>,d:PData):Routine[]{
 const avoid=String(ob.evitar??'').toLowerCase().split(/[,;]/).map(s=>s.trim()).filter(Boolean);const home=ob.local==='Casa'
 const pool=[...LIB,...(d.custom??[])].filter(l=>!avoid.some(a=>l.name.toLowerCase().includes(a))&&(!home||['Peso corporal','Halteres'].includes(l.equip)))
 const obj=String(ob.principal??'');let [s,r]=obj==='Força'?[5,5]:/Resist|Emag|Condic/.test(obj)?[3,15]:[4,10];if(ob.nivel==='Iniciante')s=Math.min(s,3)
 const mk=(name:string,gs:string[],per:number):Routine=>({id:uid(),name,items:gs.flatMap(g=>pool.filter(l=>l.group===g).slice(0,per)).map(l=>({name:l.name,group:l.group,sets:s,reps:r,kg:0,rest:obj==='Força'?150:90}))})
 const dv=ob.divisao;const nd=Array.isArray(ob.dias)?ob.dias.length:3
 if(dv==='Full body'||(dv==='Sem preferência'&&nd<=2))return [mk('Full body',['Peito','Costas','Quadríceps','Ombros','Abdômen'],1)]
 if(dv==='Upper/Lower')return [mk('Upper',['Peito','Costas','Ombros','Bíceps','Tríceps'],1),mk('Lower',['Quadríceps','Posterior','Glúteos','Panturrilha'],1)]
 const abc=[mk('Treino A — Peito e Tríceps',['Peito','Tríceps'],2),mk('Treino B — Costas e Bíceps',['Costas','Bíceps'],2),mk('Treino C — Pernas',['Quadríceps','Posterior','Glúteos','Panturrilha'],1)]
 return dv==='ABCD'?[...abc,mk('Treino D — Ombros e Abdômen',['Ombros','Abdômen'],2)]:abc}
