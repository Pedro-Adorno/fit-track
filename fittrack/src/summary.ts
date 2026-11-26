import {PData,Workout,volume} from './storage'
import {norm} from './exercises'
export type Summary={minutes:number;exercises:number;sets:number;volume:number;prs:{name:string;kg:number;prev:number}[];prevVol?:number;prevLabel?:string;session?:string}
// Resumo calculado só com registros reais: recorde = carga acima de qualquer registro anterior do mesmo exercício.
export function buildSummary(d:PData,w:Workout):Summary{
 const prs:Summary['prs']=[]
 w.exs.forEach(e=>{const kg=Math.max(0,...e.sets.map(s=>s.kg));if(!kg)return
  const prev=Math.max(0,...d.workouts.flatMap(o=>o.exs.filter(x=>norm(x.name)===norm(e.name)).flatMap(x=>x.sets.map(s=>s.kg))))
  const had=d.workouts.some(o=>o.exs.some(x=>norm(x.name)===norm(e.name)));if(had&&kg>prev)prs.push({name:e.name,kg,prev})})
 const before=[...d.workouts].sort((a,b)=>a.date.localeCompare(b.date)||(a.at??0)-(b.at??0))
 const ref=[...before].reverse().find(o=>w.session&&o.session===w.session)??before[before.length-1]
 return{minutes:w.minutes,exercises:w.exs.length,sets:w.exs.reduce((t,e)=>t+e.sets.length,0),volume:Math.round(volume(w)),prs,prevVol:ref?Math.round(volume(ref)):undefined,prevLabel:ref?(ref.session&&ref.session===w.session?`sessão ${ref.session} anterior`:'último treino'):undefined,session:w.session}}
