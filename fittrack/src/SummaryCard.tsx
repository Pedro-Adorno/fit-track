import {Summary} from './summary'
import {Icon} from './ui'
export default function SummaryCard({s,onClose}:{s:Summary;onClose:()=>void}){
 const diff=s.prevVol?((s.volume-s.prevVol)/s.prevVol*100):null
 return <div className="card hero" role="status"><span className="eyebrow">Treino concluído{s.session?` · ${s.session}`:''}</span><h2><Icon n="check" s={20}/> Bom trabalho!</h2>
  <div className="grid3" style={{margin:'8px 0'}}><div className="card stat"><div className="big">{s.minutes||'—'}</div><div className="mut">min</div></div><div className="card stat"><div className="big">{s.sets}</div><div className="mut">séries · {s.exercises} exerc.</div></div><div className="card stat"><div className="big">{s.volume}</div><div className="mut">kg de volume</div></div></div>
  {diff!==null?<p className="mut">Volume {diff>=0?'+':''}{diff.toFixed(0)}% em relação ao {s.prevLabel} ({s.prevVol} kg).</p>:<p className="mut">Primeiro treino registrado: sem comparação ainda.</p>}
  {s.prs.length>0?<><b>Recordes pessoais</b>{s.prs.map(p=><div key={p.name} className="between"><span>{p.name}</span><span style={{color:'var(--acc)'}}>{p.kg} kg <span className="mut">(antes {p.prev})</span></span></div>)}</>:<p className="mut">Nenhum recorde de carga desta vez.</p>}
  <button style={{marginTop:12,width:'100%'}} onClick={onClose}>Fechar resumo</button></div>}
