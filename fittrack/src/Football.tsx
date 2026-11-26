import {useState} from 'react'
import {format} from 'date-fns'
import {BarChart,Bar,XAxis,YAxis,Tooltip,ResponsiveContainer} from 'recharts'
import {PData,uid} from './storage'
import {toast,ask,Empty} from './ui'
const R:Record<string,string>={V:'Vitória',E:'Empate',D:'Derrota'}
export default function Football({d,up}:{d:PData;up:(f:(x:PData)=>void)=>void}){
 const ms=[...(d.matches??[])].sort((a,b)=>b.date.localeCompare(a.date))
 const [date,setDate]=useState(format(new Date(),'yyyy-MM-dd')),[kind,setKind]=useState('Pelada'),[res,setRes]=useState(''),[g,setG]=useState(''),[a,setA]=useState('')
 const [min,setMin]=useState(''),[place,setPlace]=useState(''),[pos,setPos]=useState(''),[rate,setRate]=useState(''),[obs,setObs]=useState('')
 const add=()=>{if(!date)return toast('Informe a data da partida.');if((g&&+g<0)||(a&&+a<0)||(rate&&(+rate<1||+rate>10)))return toast('Confira os números: gols e assistências não podem ser negativos e a nota vai de 1 a 10.')
  up(x=>{x.matches=[...(x.matches??[]),{id:uid(),date,kind,result:(res||undefined) as any,goals:+g||0,assists:+a||0,min:+min||undefined,place:place.trim()||undefined,pos:pos.trim()||undefined,rating:+rate||undefined,notes:obs.trim()||undefined}]});setG('');setA('');setRes('');setMin('');setPlace('');setObs('');setRate('');toast('Partida registrada.')}
 const n=ms.length,gols=ms.reduce((t,m)=>t+m.goals,0),ass=ms.reduce((t,m)=>t+m.assists,0),c=(r:string)=>ms.filter(m=>m.result===r).length,dec=c('V')+c('E')+c('D')
 const aprov=dec?Math.round((3*c('V')+c('E'))/(3*dec)*100):null
 const mon:Record<string,{m:string;gols:number;ass:number}>={};[...ms].reverse().forEach(m=>{const k=m.date.slice(0,7),o=(mon[k]??={m:k.slice(5)+'/'+k.slice(2,4),gols:0,ass:0});o.gols+=m.goals;o.ass+=m.assists})
 const St=(v:string|number,l:string)=><div className="card stat"><div className="big">{v}</div><div className="mut">{l}</div></div>
 return <><div className="card"><h2>Futebol</h2><p className="mut">Preencha só o que quiser: apenas a data é obrigatória.</p>
  <input type="date" aria-label="Data" value={date} onChange={e=>setDate(e.target.value)}/>
  <div className="row"><select aria-label="Tipo" value={kind} onChange={e=>setKind(e.target.value)}>{['Pelada','Amistoso','Competitivo'].map(k=><option key={k}>{k}</option>)}</select><select aria-label="Resultado" value={res} onChange={e=>setRes(e.target.value)}><option value="">Resultado (opcional)</option>{Object.entries(R).map(([k,v])=><option key={k} value={k}>{v}</option>)}</select></div>
  <div className="row"><input type="number" inputMode="numeric" placeholder="Gols" aria-label="Gols" value={g} onChange={e=>setG(e.target.value)}/><input type="number" inputMode="numeric" placeholder="Assist." aria-label="Assistências" value={a} onChange={e=>setA(e.target.value)}/><input type="number" inputMode="numeric" placeholder="Min" aria-label="Duração em minutos" value={min} onChange={e=>setMin(e.target.value)}/></div>
  <div className="row"><input placeholder="Local" value={place} onChange={e=>setPlace(e.target.value)}/><input placeholder="Posição" value={pos} onChange={e=>setPos(e.target.value)}/><input type="number" inputMode="numeric" placeholder="Nota 1-10" aria-label="Avaliação pessoal" value={rate} onChange={e=>setRate(e.target.value)}/></div>
  <input placeholder="Observações" value={obs} onChange={e=>setObs(e.target.value)}/><button className="p" style={{width:'100%'}} onClick={add}>Registrar partida</button></div>
  <div className="card"><b>Estatísticas</b>{n?<><div className="grid3" style={{margin:'8px 0'}}>{St(n,'partidas')}{St(gols,'gols')}{St(ass,'assistências')}</div>
   <p className="mut">Média: {(gols/n).toFixed(2)} gols por partida{dec?` · ${c('V')}V ${c('E')}E ${c('D')}D · aproveitamento ${aprov}%`:' · sem resultados registrados'}.</p>
   {Object.keys(mon).length>0&&<div style={{height:140}}><ResponsiveContainer><BarChart data={Object.values(mon)}><XAxis dataKey="m" stroke="#8a948e" fontSize={11}/><YAxis hide/><Tooltip contentStyle={{background:'#171a18',border:'1px solid #262b28',borderRadius:10}}/><Bar dataKey="gols" name="Gols" fill="#b6f23a" radius={[6,6,0,0]}/><Bar dataKey="ass" name="Assistências" fill="#4a5550" radius={[6,6,0,0]}/></BarChart></ResponsiveContainer></div>}</>
   :<Empty title="Nenhuma partida ainda" text="Registre sua primeira partida acima para ver gols, assistências e aproveitamento."/>}</div>
  {n>0&&<div className="card"><b>Histórico</b>{ms.map(m=><div key={m.id} className="between" style={{marginTop:8}}><span>{format(new Date(m.date+'T12:00:00'),'dd/MM')} · {m.kind}{m.result?` · ${R[m.result]}`:''}<span className="mut"> · {m.goals}G {m.assists}A{m.place?` · ${m.place}`:''}{m.rating?` · nota ${m.rating}`:''}</span></span><button className="link d" aria-label="Excluir partida" onClick={()=>ask('Excluir esta partida?',()=>up(x=>{x.matches=(x.matches??[]).filter(y=>y.id!==m.id)}),'Excluir')}>Excluir</button></div>)}</div>}</>}
