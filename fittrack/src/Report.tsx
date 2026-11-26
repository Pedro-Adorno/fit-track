import {useState} from 'react'
import {format,addMonths,startOfMonth} from 'date-fns'
import {ptBR} from 'date-fns/locale'
import {PData,volume} from './storage'
import {toast} from './ui'
export default function Report({d,name}:{d:PData;name:string}){
 const [off,setOff]=useState(0),m=addMonths(startOfMonth(new Date()),off),k=format(m,'yyyy-MM'),label=format(m,"MMMM 'de' yyyy",{locale:ptBR}),inM=(x:string)=>x.startsWith(k)
 const w=d.workouts.filter(x=>inM(x.date)),ma=(d.matches??[]).filter(x=>inM(x.date)),sp=(d.sports??[]).filter(x=>inM(x.date)),ac=d.acts.filter(x=>inM(x.date)),wt=d.weights.filter(x=>inM(x.date)).sort((a,b)=>a.date.localeCompare(b.date))
 const days=new Set([...w,...ma,...sp,...ac].map(x=>x.date)).size,vol=Math.round(w.reduce((t,x)=>t+volume(x),0)),sets=w.reduce((t,x)=>t+x.exs.reduce((a,e)=>a+e.sets.length,0),0)
 const rows:[string,string][]=[['Treinos',String(w.length)],['Séries / volume',`${sets} / ${vol} kg`],['Dias ativos',String(days)],['Partidas de futebol',`${ma.length} (${ma.reduce((t,x)=>t+x.goals,0)} gols, ${ma.reduce((t,x)=>t+x.assists,0)} assist.)`],['Outros esportes',String(sp.length+ac.length)],['Peso',wt.length?`${wt[0].kg} → ${wt[wt.length-1].kg} kg`:'sem registros']]
 const dl=()=>{const esc=(s:string)=>s.replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c] as string))
  const html=`<!doctype html><html lang="pt-BR"><meta charset="utf-8"><title>Relatório FitTrack ${k}</title><style>body{font:16px system-ui;max-width:640px;margin:32px auto;padding:0 16px;color:#111}td{padding:8px 12px;border-bottom:1px solid #ddd}h1{margin-bottom:4px}p{color:#555}</style><h1>Relatório de ${esc(label)}</h1><p>${esc(name)} · gerado em ${format(new Date(),'dd/MM/yyyy')} com dados registrados no FitTrack</p><table>${rows.map(([a,b])=>`<tr><td>${esc(a)}</td><td><b>${esc(b)}</b></td></tr>`).join('')}</table></html>`
  const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([html],{type:'text/html'}));a.download=`relatorio-fittrack-${k}.html`;a.click();toast('Relatório gerado. Abra o arquivo e use Imprimir > Salvar como PDF.')}
 return <section className="card"><div className="between"><button className="link" aria-label="Mês anterior" onClick={()=>setOff(off-1)}>‹</button><b style={{textTransform:'capitalize'}}>Relatório · {label}</b><button className="link" aria-label="Próximo mês" disabled={off>=0} onClick={()=>setOff(off+1)}>›</button></div>
  {rows.map(([a,b])=><div key={a} className="between" style={{marginTop:8}}><span className="mut">{a}</span><b>{b}</b></div>)}
  <button style={{marginTop:12,width:'100%'}} onClick={dl}>Exportar relatório</button></section>}
