import {startOfWeek,format,parseISO,subDays} from 'date-fns'
import {PData,Workout} from './storage'
import {LIB} from './exercises'
export const groupOf=(d:PData,n:string)=>[...LIB,...(d.custom??[])].find(x=>x.name.toLowerCase()===n.toLowerCase())?.group??'Outros'
export function weekly<T extends {date:string}>(items:T[],val:(t:T)=>number){const m:Record<string,number>={};items.forEach(i=>{const k=format(startOfWeek(parseISO(i.date),{weekStartsOn:1}),'yyyy-MM-dd');m[k]=(m[k]??0)+val(i)})
 return Object.keys(m).sort().map(k=>({week:format(parseISO(k),'dd/MM'),v:Math.round(m[k])}))}
export const activeDates=(d:PData)=>new Set([...d.workouts.map(x=>x.date),...d.acts.map(x=>x.date)])
export function streak(s:Set<string>){let n=0,x=new Date();if(!s.has(format(x,'yyyy-MM-dd')))x=subDays(x,1);while(s.has(format(x,'yyyy-MM-dd'))){n++;x=subDays(x,1)}return n}
export function muscle(d:PData,ws:Workout[]){const m:Record<string,number>={};ws.forEach(w=>w.exs.forEach(e=>{const g=groupOf(d,e.name);m[g]=(m[g]??0)+e.sets.length}))
 return Object.entries(m).map(([g,v])=>({g,v})).sort((a,b)=>b.v-a.v)}
export const planFor=(d:PData,date:Date):Record<string,string>=>d.weekPlans?.[format(startOfWeek(date,{weekStartsOn:1}),'yyyy-MM-dd')]??d.plan??{}
