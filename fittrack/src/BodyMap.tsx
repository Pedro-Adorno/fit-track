import {useState} from 'react'
import {format,addDays} from 'date-fns'
import {PData} from './storage'
import {find,norm} from './exercises'
import {Info} from './ui'
type Sh={r:string;t:'e'|'r';a:number[]}
const REG:Record<string,string[]>={Peito:['Peito'],Ombros:['Ombros'],'Braços':['Bíceps','Tríceps','Antebraço'],'Abdômen':['Abdômen'],'Quadríceps':['Quadríceps'],Costas:['Costas','Lombar'],'Glúteos':['Glúteos'],Posterior:['Posterior de coxa'],Panturrilhas:['Panturrilhas']}
const SB:Sh[]=[{r:'Ombros',t:'e',a:[62,100,17,12]},{r:'Ombros',t:'e',a:[138,100,17,12]},{r:'Peito',t:'e',a:[83,120,18,14]},{r:'Peito',t:'e',a:[117,120,18,14]},{r:'Abdômen',t:'r',a:[82,138,36,52]},{r:'Braços',t:'r',a:[42,114,15,72]},{r:'Braços',t:'r',a:[143,114,15,72]},{r:'Quadríceps',t:'r',a:[75,200,24,96]},{r:'Quadríceps',t:'r',a:[101,200,24,96]},{r:'Panturrilhas',t:'r',a:[77,304,19,76]},{r:'Panturrilhas',t:'r',a:[104,304,19,76]}]
const BK:Sh[]=[{r:'Ombros',t:'e',a:[62,100,17,12]},{r:'Ombros',t:'e',a:[138,100,17,12]},{r:'Costas',t:'r',a:[76,106,48,64]},{r:'Braços',t:'r',a:[42,114,15,72]},{r:'Braços',t:'r',a:[143,114,15,72]},{r:'Glúteos',t:'r',a:[76,172,48,30]},{r:'Posterior',t:'r',a:[75,206,24,90]},{r:'Posterior',t:'r',a:[101,206,24,90]},{r:'Panturrilhas',t:'r',a:[77,304,19,76]},{r:'Panturrilhas',t:'r',a:[104,304,19,76]}]
export default function BodyMap({d,height}:{d:PData;height?:number}){
 const [back,setBack]=useState(false),[sel,setSel]=useState('Peito')
 const from=format(addDays(new Date(),-28),'yyyy-MM-dd'),ws=d.workouts.filter(w=>w.date>=from)
 const stat=(reg:string)=>{const gs=REG[reg],days=new Set<string>(),ex:Record<string,number>={};let sets=0
  ws.forEach(w=>w.exs.forEach(e=>{const x=find(e.name,d.customEx);if(!x||!gs.includes(x.group))return;sets+=e.sets.length;days.add(w.date);ex[e.name]=Math.max(ex[e.name]??0,...e.sets.map(s=>s.kg))}))
  return{sets:+(sets/4).toFixed(1),freq:+(days.size/4).toFixed(1),ex:Object.entries(ex).sort((a,b)=>b[1]-a[1])}}
 const all=Object.keys(REG).map(r=>[r,stat(r)] as const),mx=Math.max(1,...all.map(([,s])=>s.sets)),cur=stat(sel),kg=[...d.weights].sort((a,b)=>a.date.localeCompare(b.date)).pop()?.kg
 const sh=back?BK:SB,I=(r:string)=>all.find(([k])=>k===r)![1].sets/mx
 return <section className="card"><div className="between"><b>Mapa corporal</b><button className="link" onClick={()=>setBack(!back)} aria-label="Girar modelo">{back?'Ver frente':'Ver costas'} ↻</button></div>
  <p className="mut">Toque numa região para ver seu treino das últimas 4 semanas. Quanto mais intensa a cor, mais séries.<Info t="É uma silhueta ilustrativa em 2D, igual para todos. Ela não é uma medição nem uma estimativa do seu corpo: serve para explorar os dados de treino."/></p>
  <svg viewBox="0 0 200 400" style={{width:'100%',maxHeight:360}} role="img" aria-label={back?'Vista traseira':'Vista frontal'}>
   <circle cx="100" cy="48" r="22" fill="none" stroke="var(--line)" strokeWidth="2"/><rect x="88" y="68" width="24" height="16" rx="6" fill="none" stroke="var(--line)" strokeWidth="2"/>
   {sh.map((s,i)=>{const [x,y,w,h]=s.a,p={fill:'var(--acc)',fillOpacity:.12+I(s.r)*.7,stroke:sel===s.r?'var(--txt)':'var(--line)',strokeWidth:sel===s.r?2.5:1.5,tabIndex:0,role:'button','aria-label':`${s.r}: ${stat(s.r).sets} séries por semana`,style:{cursor:'pointer'},onClick:()=>setSel(s.r),onKeyDown:(e:React.KeyboardEvent)=>{if(e.key==='Enter'||e.key===' ')setSel(s.r)}}
    return s.t==='e'?<ellipse key={i} cx={x} cy={y} rx={w} ry={h} {...p}/>:<rect key={i} x={x} y={y} width={w} height={h} rx={12} {...p}/>})}</svg>
  <div className="row wrap" style={{justifyContent:'center'}}>{(back?['Costas','Glúteos','Posterior','Ombros','Braços','Panturrilhas']:['Peito','Abdômen','Quadríceps','Ombros','Braços','Panturrilhas']).map(r=><button key={r} className={sel===r?'p':''} style={{minHeight:40,flex:'0 0 auto'}} onClick={()=>setSel(r)}>{r}</button>)}</div>
  <div className="card sub"><b>{sel}</b><p className="mut">{cur.sets} séries por semana · {cur.freq}x por semana (média de 4 semanas)</p>
   {cur.ex.length?cur.ex.map(([n,k])=><div key={n} className="between"><span>{n}</span><span className="mut">máx. {k} kg</span></div>):<p className="mut">Sem exercícios desta região nas últimas 4 semanas. Exercícios fora da biblioteca não entram.</p>}</div>
  <p className="mut">Dados do perfil: altura {height?`${height} cm (informada)`:'não informada'} · peso {kg?`${kg} kg (registrado)`:'não registrado'} · gordura corporal e massa muscular: não informadas.</p></section>}
