import {useEffect,useState} from 'react'
import {LineChart,Line,XAxis,YAxis,Tooltip,ResponsiveContainer,CartesianGrid} from 'recharts'
import {format,isSameMonth,parseISO} from 'date-fns'
import More from './More'
import Home from './Home'
import Progress from './Progress'
import Routines from './Routines'
import {Icon,Toaster,toast,ask} from './ui'
import {Onboarding,Extra,Timer} from './Extra'
import {DB,Ex,load,save,uid,volume,pace,speed,pct,download,importFile,emptyData,fresh} from './storage'
const tabs=[['home','Início'],['train','Treinar'],['acts','Atividades'],['body','Evolução'],['more','Mais'],['cfg','Perfil']]
const today=()=>format(new Date(),'yyyy-MM-dd')
export default function App(){
 const [db,setDB]=useState<DB>(load);const [tab,setTab]=useState('home')
 useEffect(()=>save(db),[db])
 const d=db.data[db.active]
 const up=(fn:(x:typeof d)=>void)=>setDB(p=>{const n=structuredClone(p);fn(n.data[n.active]);return n})
 const [exs,setExs]=useState<Ex[]>([]);const [name,setName]=useState('');const [reps,setReps]=useState('');const [kg,setKg]=useState('')
 const [min,setMin]=useState('');const [notes,setNotes]=useState('')
 const [kind,setKind]=useState('Corrida');const [km,setKm]=useState('');const [am,setAm]=useState('')
 const [w,setW]=useState('');const [editOb,setEditOb]=useState(false);const [hint,setHint]=useState('')
 const last=name?[...d.workouts].reverse().flatMap(x=>x.exs).find(e=>e.name.toLowerCase()===name.toLowerCase()):undefined
 const addSet=()=>{const r=+reps,k=+kg;if(!name.trim()||!(r>0)||k<0||kg==='')return toast('Informe exercício, repetições e carga.')
  setExs(p=>{const n=structuredClone(p);let e=n.find(x=>x.name.toLowerCase()===name.trim().toLowerCase());if(!e){e={name:name.trim(),sets:[]};n.push(e)}e.sets.push({reps:r,kg:k});return n});setReps('')}
 const finish=()=>{if(!exs.length)return toast('Registre ao menos uma série.')
  up(x=>{x.workouts.push({id:uid(),date:today(),exs,minutes:+min||0,notes})});setExs([]);setMin('');setNotes('');setName('');toast('Treino salvo!')}
 const cur=db.profiles.find(p=>p.id===db.active);const mine=(db.routines??[]).filter(r=>r.owners.includes(db.active));const now=new Date();const mw=d.workouts.filter(x=>isSameMonth(parseISO(x.date),now))
 const wts=[...d.weights].sort((a,b)=>a.date.localeCompare(b.date))
 const mins=d.workouts.reduce((a,x)=>a+x.minutes,0)+d.acts.reduce((a,x)=>a+x.minutes,0)
 return <main>
  <div className="row" style={{alignItems:'center'}}><h1 className="logo" style={{flex:2}}>FitTrack</h1>
   <select value={db.active} onChange={e=>setDB({...db,active:e.target.value})}>{db.profiles.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select></div>
  {(!cur?.ob||editOb)&&<Onboarding name={cur!.name} initial={cur?.ob} onCancel={cur?.ob?()=>setEditOb(false):undefined} onDone={ob=>{setDB(p=>({...p,profiles:p.profiles.map(x=>x.id===p.active?{...x,ob}:x)}));setEditOb(false);if(cur?.ob)toast('Avaliação atualizada.')}}/>}
  
  {tab==='home'&&<Home d={d} go={setTab} routines={mine} mates={db.profiles.filter(p=>p.id!==db.active&&mine.some(r=>r.owners.includes(p.id))).map(p=>({name:p.name,next:db.data[p.id]?.plan?.[String(now.getDay())]}))} target={db.profiles.find(p=>p.id===db.active)?.ob?.days??0}/>}
  {tab==='train'&&<><Routines db={db} setDB={setDB} onPick={(n,h)=>{setName(n);setHint(h)}}/><div className="card"><h2>Registrar treino</h2>
   <input placeholder="Exercício (ex.: Supino reto)" value={name} onChange={e=>{setName(e.target.value);setHint('')}}/>
   {hint&&name&&<div className="mut">{hint}</div>}
   {last&&<div className="mut">Última vez: {last.sets.map(s=>`${s.reps}×${s.kg}kg`).join(' · ')}</div>}
   <div className="row"><input type="number" inputMode="numeric" placeholder="Reps" value={reps} onChange={e=>setReps(e.target.value)}/>
   <input type="number" inputMode="decimal" placeholder="Carga kg" value={kg} onChange={e=>setKg(e.target.value)}/></div>
   <button className="p" onClick={addSet}>Concluir série</button><Timer/>
   {exs.map(e=><div key={e.name} className="card"><b>{e.name}</b>{e.sets.map((s,i)=><div key={i} className="mut">Série {i+1} — {s.reps} reps — {s.kg} kg</div>)}</div>)}
   <input type="number" placeholder="Duração (min)" value={min} onChange={e=>setMin(e.target.value)}/>
   <input placeholder="Observações" value={notes} onChange={e=>setNotes(e.target.value)}/>
   <div className="row"><button className="p" onClick={finish}>Finalizar treino</button>
   <button className="d" onClick={()=>ask('Descartar treino em andamento?',()=>{setExs([])})}>Cancelar</button></div>
   <h2>Histórico</h2>{[...d.workouts].reverse().map(x=><div key={x.id} className="card">{x.date} · {x.exs.length} exercícios · volume {volume(x)} kg · {x.minutes} min
   <button className="d" style={{float:'right'}} onClick={()=>ask('Excluir treino?',()=>{up(y=>{y.workouts=y.workouts.filter(z=>z.id!==x.id)})})}>✕</button></div>)}</div></>}
  {tab==='acts'&&<div className="card"><h2>Atividades</h2>
   <select value={kind} onChange={e=>setKind(e.target.value)}>{['Corrida','Caminhada','Futebol','Ciclismo','Natação','Outra'].map(k=><option key={k}>{k}</option>)}</select>
   <div className="row"><input type="number" inputMode="decimal" placeholder="Distância km (opcional)" value={km} onChange={e=>setKm(e.target.value)}/>
   <input type="number" inputMode="numeric" placeholder="Minutos" value={am} onChange={e=>setAm(e.target.value)}/></div>
   <button className="p" onClick={()=>{if(!(+am>0))return toast('Informe a duração.');up(x=>{x.acts.push({id:uid(),date:today(),kind,km:+km||0,minutes:+am})});setKm('');setAm('')}}>Salvar atividade</button>
   {[...d.acts].reverse().map(a=><div key={a.id} className="card">{a.date} · {a.kind} · {a.minutes} min{a.km>0&&` · ${a.km} km · ${pace(a.km,a.minutes).toFixed(1)} min/km · ${speed(a.km,a.minutes).toFixed(1)} km/h`}
   <button className="d" style={{float:'right'}} onClick={()=>ask('Excluir atividade?',()=>{up(y=>{y.acts=y.acts.filter(z=>z.id!==a.id)})})}>✕</button></div>)}</div>}
  {tab==='body'&&<><div className="card"><h2>Evolução corporal</h2>
   <div className="row"><input type="number" inputMode="decimal" placeholder="Peso (kg)" value={w} onChange={e=>setW(e.target.value)}/>
   <button className="p" onClick={()=>{if(!(+w>0))return toast('Peso inválido.');up(x=>{x.weights.push({id:uid(),date:today(),kg:+w})});setW('')}}>Registrar</button></div>
   {wts.length>0?<><div className="mut">Inicial {wts[0].kg} kg → atual {wts[wts.length-1].kg} kg ({pct(wts[0].kg,wts[wts.length-1].kg).toFixed(1)}%)</div>
   <div style={{height:240}}><ResponsiveContainer><LineChart data={wts}><CartesianGrid stroke="#262b28"/><XAxis dataKey="date" stroke="#8a948e" fontSize={11}/><YAxis domain={['auto','auto']} stroke="#8a948e" fontSize={11}/><Tooltip contentStyle={{background:'#171a18',border:'1px solid #262b28'}}/><Line dataKey="kg" stroke="#b6f23a" strokeWidth={2}/></LineChart></ResponsiveContainer></div></>:<div className="mut">Sem registros ainda. Registre seu peso para ver o gráfico.</div>}</div><Progress d={d} target={cur?.ob?.days??0}/></>}
  {tab==='cfg'&&<><div className="card"><h2>Avaliação inicial</h2>{cur?.ob?<><p className="mut">{cur.ob.goal} · {cur.ob.days} dias/semana · {cur.ob.exp??'experiência não informada'} · {cur.ob.place??'local não informado'}</p>{cur.ob.limits&&<p className="mut">Limitações: {cur.ob.limits}</p>}<button onClick={()=>{setEditOb(true);window.scrollTo({top:0,behavior:'smooth'})}}>Atualizar respostas</button></>:<p className="mut">Responda o questionário no topo da tela.</p>}</div><div className="card"><h2>Perfis e dados</h2>
   <div className="row"><input id="np" placeholder="Nome do novo perfil"/><button className="p" onClick={()=>{const el=document.getElementById('np') as HTMLInputElement;if(!el.value.trim())return;const id=uid();setDB(p=>({...p,profiles:[...p.profiles,{id,name:el.value.trim()}],active:id,data:{...p.data,[id]:emptyData()}}));el.value=''}}>Criar</button></div>
   <div className="row"><button onClick={()=>download(db)}>Exportar backup</button>
   <label><input type="file" accept=".json" hidden onChange={async e=>{const f=e.target.files?.[0];if(!f)return;try{const nd=await importFile(f);ask('Restaurar substitui os dados atuais. Continuar?',()=>setDB(nd),'Restaurar')}catch(x:any){toast(x.message)}}}/><span style={{display:'block',textAlign:'center',padding:11,border:'1px solid #262b28',borderRadius:10}}>Importar backup</span></label></div>
   <button className="d" onClick={()=>{if(db.profiles.length<2)return toast('Mantenha ao menos um perfil.');ask('Excluir este perfil e todos os seus dados?',()=>setDB(p=>{const n=structuredClone(p);n.routines=(n.routines??[]).map(r=>({...r,owners:r.owners.filter(o=>o!==n.active)})).filter(r=>r.owners.length);n.profiles=n.profiles.filter(x=>x.id!==n.active);delete n.data[n.active];n.active=n.profiles[0].id;return n}),'Excluir')}}>Excluir perfil atual</button>
   <button className="d" onClick={()=>ask('Apagar TODOS os dados?',()=>{setDB(fresh())})}>Limpar tudo</button>
   <p className="mut">Os dados ficam apenas neste navegador e não sincronizam entre dispositivos. Use o backup para levar seus dados a outro aparelho.</p></div></>}
  {tab==='more'&&<><More d={d} up={up} names={mine.map(r=>r.name)}><Extra d={d} up={up}/></More></>}
  <nav>{tabs.map(([k,l])=><button key={k} className={tab===k?'on':''} onClick={()=>setTab(k)} aria-current={tab===k?'page':undefined}><Icon n={k}/>{l}</button>)}</nav><Toaster/>
 </main>}
