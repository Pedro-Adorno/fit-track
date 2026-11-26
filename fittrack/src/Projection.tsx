import {differenceInCalendarDays,parseISO} from 'date-fns'
import {PData} from './storage'
import {Info} from './ui'
export default function Projection({d}:{d:PData}){
 const ws=[...d.weights].sort((a,b)=>a.date.localeCompare(b.date)),t0=ws.length?parseISO(ws[0].date):new Date()
 const pts=ws.map(w=>({x:differenceInCalendarDays(parseISO(w.date),t0),y:w.kg})),span=pts.length?pts[pts.length-1].x:0
 const ok=pts.length>=4&&span>=21
 let slope=0,last=pts.length?pts[pts.length-1].y:0
 if(ok){const n=pts.length,mx=pts.reduce((t,p)=>t+p.x,0)/n,my=pts.reduce((t,p)=>t+p.y,0)/n,sxx=pts.reduce((t,p)=>t+(p.x-mx)**2,0);slope=sxx?pts.reduce((t,p)=>t+(p.x-mx)*(p.y-my),0)/sxx:0}
 const cap=1/7,s=Math.max(-cap,Math.min(cap,slope)),capped=s!==slope
 const sc=[['1 mês',30],['3 meses',90],['6 meses',180],['12 meses',365]] as const
 return <section className="card"><div className="between"><b>Projeção de peso</b><Info t="Simulação ilustrativa: continua a tendência do seu próprio histórico de peso. Não considera alimentação, saúde ou mudanças de rotina, e não é previsão."/></div>
  {!ok?<p className="mut">Para simular, registre pelo menos 4 pesos ao longo de 3 semanas ou mais. Hoje: {pts.length} registro(s) em {span} dia(s).</p>:<>
   <p className="mut">Tendência registrada: {(slope*7>=0?'+':'')+(slope*7).toFixed(2)} kg por semana (a partir de {pts.length} registros). Se esse ritmo se mantivesse:</p>
   <div className="between" style={{marginTop:8}}><span>Agora</span><b>{last.toFixed(1)} kg</b></div>
   {sc.map(([l,dd])=><div key={l} className="between" style={{marginTop:8}}><span>Em {l}</span><b>{(last+s*dd).toFixed(1)} kg</b></div>)}
   {capped&&<p className="mut">A variação foi limitada a 1 kg por semana por segurança, porque a tendência registrada foi maior que isso.</p>}
   <p className="mut">Simulação ilustrativa, não é previsão nem recomendação de saúde. Peso sozinho não mostra o que muda no corpo.</p></>}</section>}
