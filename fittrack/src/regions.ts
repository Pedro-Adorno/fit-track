import {format,addDays,differenceInCalendarDays,parseISO} from 'date-fns'
import {PData} from './storage'
import {find} from './exercises'
import {REGIONS} from './muscleMap'
export {REGIONS}
export const REG:Record<string,string[]>={Peito:['Peito'],Costas:['Costas','Lombar'],Ombros:['Ombros'],'Bíceps':['Bíceps'],'Tríceps':['Tríceps'],'Abdômen':['Abdômen'],'Quadríceps':['Quadríceps'],'Posterior de coxa':['Posterior de coxa'],'Glúteos':['Glúteos'],Panturrilhas:['Panturrilhas']}
const fmt=(n:number)=>format(addDays(new Date(),-n),'yyyy-MM-dd')
// Tudo vem dos treinos registrados: últimas 4 semanas x 4 semanas anteriores. Exercícios fora da biblioteca não entram.
export function regionStats(d:PData,reg:string){const gs=REG[reg],a=fmt(28),b=fmt(56)
 const calc=(from:string,to?:string)=>{const days=new Set<string>(),ex:Record<string,{max:number;pts:{date:string;kg:number}[]}>={};let sets=0,vol=0
  d.workouts.filter(w=>w.date>=from&&(!to||w.date<to)).sort((x,y)=>x.date.localeCompare(y.date)).forEach(w=>w.exs.forEach(e=>{const x=find(e.name,d.customEx);if(!x||!gs.includes(x.group))return
   sets+=e.sets.length;days.add(w.date);const top=Math.max(0,...e.sets.map(s=>s.kg));vol+=e.sets.reduce((t,s)=>t+s.kg*s.reps,0);const o=(ex[e.name]??={max:0,pts:[]});o.max=Math.max(o.max,top);o.pts.push({date:w.date,kg:top})}))
  return{sets:+(sets/4).toFixed(1),freq:+(days.size/4).toFixed(1),vol:Math.round(vol),ex}}
 const cur=calc(a),prev=calc(b,a),list=Object.entries(cur.ex).sort((x,y)=>y[1].pts.length-x[1].pts.length)
 return{...cur,prev:{sets:prev.sets,freq:prev.freq,vol:prev.vol},ex:list.map(([n,v])=>[n,v.max] as [string,number]),topName:list[0]?.[0],series:list[0]?.[1].pts??[]}}
export const intensity=(d:PData)=>{const s=REGIONS.map(r=>[r,regionStats(d,r).sets] as const),mx=Math.max(0,...s.map(x=>x[1]));return{mx,k:Object.fromEntries(s.map(([r,v])=>[r,mx?v/mx:0])) as Record<string,number>}}
export function weightTrend(d:PData){const ws=[...d.weights].sort((a,b)=>a.date.localeCompare(b.date));if(!ws.length)return{ok:false,n:0,span:0,perDay:0,first:0,last:0}
 const t0=parseISO(ws[0].date),p=ws.map(w=>({x:differenceInCalendarDays(parseISO(w.date),t0),y:w.kg})),span=p[p.length-1].x,n=p.length
 let perDay=0;if(n>=4&&span>=21){const mx=p.reduce((t,a)=>t+a.x,0)/n,my=p.reduce((t,a)=>t+a.y,0)/n,sxx=p.reduce((t,a)=>t+(a.x-mx)**2,0);perDay=sxx?p.reduce((t,a)=>t+(a.x-mx)*(a.y-my),0)/sxx:0}
 return{ok:n>=4&&span>=21,n,span,perDay,first:ws[0].kg,last:ws[ws.length-1].kg}}
export const weeklyFreq=(d:PData)=>new Set([...d.workouts,...d.acts].filter(x=>x.date>=fmt(28)).map(x=>x.date)).size/4
