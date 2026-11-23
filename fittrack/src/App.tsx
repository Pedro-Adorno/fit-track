import {useEffect,useState} from 'react'
import {LineChart,Line,XAxis,YAxis,Tooltip,ResponsiveContainer,CartesianGrid} from 'recharts'
import {format,isSameMonth,parseISO} from 'date-fns'
import More from './More'
import Dashboard from './Dashboard'
import Analytics from './Analytics'
import Photos from './Photos'
import Calendar from './Calendar'
import {TrainNav} from './Train'
import {Extra,Timer,ActSummary,Reminder} from './Extra'
import {Welcome,Assessment,ProfilesPanel,AV} from './Profiles'
import {DB,Ex,load,save,uid,volume,pace,speed,pct,download,importFile,emptyData,fresh} from './storage'
const ICONS:Record<string,string>={home:'M3 11l9-8 9 8v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z',train:'M6.5 6.5v11M17.5 6.5v11M3 9v6M21 9v6M6.5 12h11',acts:'M22 12h-4l-3 9L9 3l-3 9H2',body:'M23 6l-9.5 9.5-5-5L1 18M17 6h6v6',more:'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',cfg:'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z'}
const tabs=[['home','Início'],['train','Treinar'],['acts','Atividades'],['body','Evolução'],['more','Mais'],['cfg','Perfil']]
const today=()=>format(new Date(),'yyyy-MM-dd')
export default function App(){
 const [db,setDB]=useState<DB>(load);const [tab,setTab]=useState('home')
 useEffect(()=>save(db),[db])
 const d=db.data[db.active]??emptyData();const prof=db.profiles.find(p=>p.id===db.active);const [assess,setAssess]=useState(false);const [tsub,setTsub]=useState('rotinas')
 const up=(fn:(x:typeof d)=>void)=>setDB(p=>{const n=structuredClone(p);fn(n.data[n.active]);return n})
 const [exs,setExs]=useState<Ex[]>([]);const [name,setName]=useState('');const [reps,setReps]=useState('');const [kg,setKg]=useState('')
 const [min,setMin]=useState('');const [notes,setNotes]=useState('')
 const [kind,setKind]=useState('Corrida');const [km,setKm]=useState('');const [am,setAm]=useState('')
 const [w,setW]=useState('')
 const last=name?[...d.workouts].reverse().flatMap(x=>x.exs).find(e=>e.name.toLowerCase()===name.toLowerCase()):undefined
 const addSet=()=>{const r=+reps,k=+kg;if(!name.trim()||!(r>0)||k<0||kg==='')return alert('Informe exercício, repetições e carga.')
  setExs(p=>{const n=structuredClone(p);let e=n.find(x=>x.name.toLowerCase()===name.trim().toLowerCase());if(!e){e={name:name.trim(),sets:[]};n.push(e)}e.sets.push({reps:r,kg:k});return n});setReps('')}
 const finish=()=>{if(!exs.length)return alert('Registre ao menos uma série.')
  up(x=>{x.workouts.push({id:uid(),date:today(),exs,minutes:+min||0,notes})});setExs([]);setMin('');setNotes('');setName('');alert('Treino salvo!')}
 const now=new Date();const mw=d.workouts.filter(x=>isSameMonth(parseISO(x.date),now))
 const wts=[...d.weights].sort((a,b)=>a.date.localeCompare(b.date))
 const mins=d.workouts.reduce((a,x)=>a+x.minutes,0)+d.acts.reduce((a,x)=>a+x.minutes,0)
const createProfile=(name:string,avatar:string)=>{const id=uid();setDB(p=>({...p,profiles:[...p.profiles,{id,name,avatar}],active:id,data:{...p.data,[id]:emptyData()}}));setAssess(false)}
 const finishAssess=(ob:Record<string,any>)=>{setDB(p=>{const n=structuredClone(p);const pr=n.profiles.find(x=>x.id===n.active);if(!pr)return n;pr.ob=ob;const x=n.data[n.active];const pe=+ob.peso,al=+ob.pesoAlvo
  if(pe>0&&!x.weights.length)x.weights.push({id:uid(),date:today(),kg:pe});if(pe>0&&al>0&&!(x.goals?.length))x.goals=[{id:uid(),name:'Peso alvo',start:pe,target:al,current:pe,deadline:''}];return n});setAssess(false)}
 if(!prof)return <main><h1 className="logo">FitTrack</h1><div className="mut">Seu treinamento. Sua evolução. Seus resultados.</div><Welcome onCreate={createProfile}/></main>
 if(!prof.ob||assess)return <Assessment name={prof.name} init={prof.ob} onDone={finishAssess} onCancel={prof.ob?()=>setAssess(false):undefined}/>
 return <main>
  <div className="row" style={{alignItems:'center'}}><h1 className="logo" style={{flex:2}}>FitTrack</h1>
   <select value={db.active} onChange={e=>setDB({...db,active:e.target.value})}>{db.profiles.map(p=><option key={p.id} value={p.id}>{(p.avatar??'🙂')+' '+p.name}</option>)}</select></div>
  <div className="mut">Seu treinamento. Sua evolução. Seus resultados.</div>
  {tab==='home'&&<Dashboard name={prof.name} d={d} goTab={setTab} weekGoal={Array.isArray(prof.ob?.dias)?prof.ob.dias.length:undefined}/>}
  <TrainNav key={db.active} pid={db.active} ob={prof.ob} show={tab==='train'} sub={tsub} setSub={setTsub} d={d} up={up}/>
  {tab==='train'&&tsub==='livre'&&<div className="card"><h2>Registrar treino (livre)</h2>
   <input placeholder="Exercício (ex.: Supino reto)" value={name} onChange={e=>setName(e.target.value)}/>
   {last&&<div className="mut">Última vez: {last.sets.map(s=>`${s.reps}×${s.kg}kg`).join(' · ')}</div>}
   <div className="row"><input type="number" inputMode="numeric" placeholder="Reps" value={reps} onChange={e=>setReps(e.target.value)}/>
   <input type="number" inputMode="decimal" placeholder="Carga kg" value={kg} onChange={e=>setKg(e.target.value)}/></div>
   <button className="p" onClick={addSet}>Concluir série</button><Timer/>
   {exs.map(e=><div key={e.name} className="card"><b>{e.name}</b>{e.sets.map((s,i)=><div key={i} className="mut">Série {i+1} — {s.reps} reps — {s.kg} kg</div>)}</div>)}
   <input type="number" placeholder="Duração (min)" value={min} onChange={e=>setMin(e.target.value)}/>
   <input placeholder="Observações" value={notes} onChange={e=>setNotes(e.target.value)}/>
   <div className="row"><button className="p" onClick={finish}>Finalizar treino</button>
   <button className="d" onClick={()=>confirm('Descartar treino em andamento?')&&setExs([])}>Cancelar</button></div>
   <h2>Histórico</h2>{[...d.workouts].reverse().map(x=><div key={x.id} className="card">{x.date} · {x.exs.length} exercícios · volume {volume(x)} kg · {x.minutes} min
   <button className="d" style={{float:'right'}} onClick={()=>confirm('Excluir treino?')&&up(y=>{y.workouts=y.workouts.filter(z=>z.id!==x.id)})}>✕</button></div>)}</div>}
  {tab==='acts'&&<div className="card"><h2>Atividades</h2>
   <select value={kind} onChange={e=>setKind(e.target.value)}>{['Corrida','Caminhada','Futebol','Ciclismo','Natação','Alongamento','Mobilidade','Outra'].map(k=><option key={k}>{k}</option>)}</select>
   <div className="row"><input type="number" inputMode="decimal" placeholder="Distância km (opcional)" value={km} onChange={e=>setKm(e.target.value)}/>
   <input type="number" inputMode="numeric" placeholder="Minutos" value={am} onChange={e=>setAm(e.target.value)}/></div>
   <button className="p" onClick={()=>{if(!(+am>0))return alert('Informe a duração.');up(x=>{x.acts.push({id:uid(),date:today(),kind,km:+km||0,minutes:+am})});setKm('');setAm('')}}>Salvar atividade</button>
   {[...d.acts].reverse().map(a=><div key={a.id} className="card">{a.date} · {a.kind} · {a.minutes} min{a.km>0&&` · ${a.km} km · ${pace(a.km,a.minutes).toFixed(1)} min/km · ${speed(a.km,a.minutes).toFixed(1)} km/h`}
   <button className="d" style={{float:'right'}} onClick={()=>confirm('Excluir atividade?')&&up(y=>{y.acts=y.acts.filter(z=>z.id!==a.id)})}>✕</button></div>)}</div>}
  {tab==='body'&&<div className="card"><h2>Evolução corporal</h2>
   <div className="row"><input type="number" inputMode="decimal" placeholder="Peso (kg)" value={w} onChange={e=>setW(e.target.value)}/>
   <button className="p" onClick={()=>{if(!(+w>0))return alert('Peso inválido.');up(x=>{x.weights.push({id:uid(),date:today(),kg:+w})});setW('')}}>Registrar</button></div>
   {wts.length>0?<><div className="mut">Inicial {wts[0].kg} kg → atual {wts[wts.length-1].kg} kg ({pct(wts[0].kg,wts[wts.length-1].kg).toFixed(1)}%)</div>
   <div style={{height:240}}><ResponsiveContainer><LineChart data={wts}><CartesianGrid stroke="#262b28"/><XAxis dataKey="date" stroke="#8a948e" fontSize={11}/><YAxis domain={['auto','auto']} stroke="#8a948e" fontSize={11}/><Tooltip contentStyle={{background:'#171a18',border:'1px solid #262b28'}}/><Line dataKey="kg" stroke="#b6f23a" strokeWidth={2}/></LineChart></ResponsiveContainer></div></>:<div className="mut">Sem registros ainda. Registre seu peso para ver o gráfico.</div>}</div>}
  {tab==='acts'&&<ActSummary d={d}/>}
  {tab==='body'&&<><Analytics d={d}/><Photos pid={db.active}/></>}
  {tab==='cfg'&&<div className="card"><h2>Perfis e dados</h2>
   <ProfilesPanel db={db} setDB={setDB} onCreate={createProfile} onAssess={()=>setAssess(true)}/>
   <div className="row"><button onClick={()=>download(db)}>Exportar backup</button>
   <label><input type="file" accept=".json" hidden onChange={async e=>{const f=e.target.files?.[0];if(!f)return;try{if(confirm('Restaurar substitui os dados atuais. Continuar?'))setDB(await importFile(f))}catch(x:any){alert(x.message)}}}/><span style={{display:'block',textAlign:'center',padding:11,border:'1px solid #262b28',borderRadius:10}}>Importar backup</span></label></div>
   <button className="d" onClick={()=>confirm('Apagar TODOS os dados?')&&setDB(fresh())}>Limpar tudo</button>
   <p className="mut">Os dados ficam apenas neste navegador e não sincronizam entre dispositivos. Use o backup para levar seus dados a outro aparelho.</p></div>}
  {tab==='more'&&<><Calendar d={d}/><More d={d} up={up}/><Extra d={d} up={up}/><Reminder d={d} up={up}/></>}
  <nav>{tabs.map(([k,l])=><button key={k} className={tab===k?'on':''} onClick={()=>setTab(k)} aria-label={l}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={ICONS[k]}/></svg><span>{l}</span></button>)}</nav>
 </main>}
