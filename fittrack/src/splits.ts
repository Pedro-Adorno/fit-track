import {PData} from './storage'
const S=(l:string,f:string)=>({label:l,focus:f})
export const PRESETS:Record<string,{label:string;focus:string}[]>={
 'Full Body':[S('Full Body','Corpo inteiro')],
 'ABC':[S('A','Peito, ombro e tríceps'),S('B','Costas e bíceps'),S('C','Pernas e abdômen')],
 'ABCD':[S('A','Peito e tríceps'),S('B','Costas e bíceps'),S('C','Pernas'),S('D','Ombros e abdômen')],
 'ABCDE':[S('A','Peito'),S('B','Costas'),S('C','Pernas'),S('D','Ombros'),S('E','Braços')],
 'ABCDEF':[S('A','Peito'),S('B','Costas'),S('C','Quadríceps e panturrilhas'),S('D','Ombros'),S('E','Braços'),S('F','Posterior e glúteos')],
 'Upper/Lower':[S('Upper','Parte superior'),S('Lower','Parte inferior')],
 'Push/Pull/Legs':[S('Push','Peito, ombro e tríceps'),S('Pull','Costas e bíceps'),S('Legs','Pernas')],
 'PPL + Upper/Lower':[S('Push','Peito, ombro e tríceps'),S('Pull','Costas e bíceps'),S('Legs','Pernas'),S('Upper','Parte superior'),S('Lower','Parte inferior')]}
// Próxima sessão pendente: continua a sequência a partir do último treino/pulo registrado,
// sem depender do dia da semana e sem pular letras quando o usuário falta.
export function nextSession(d:PData){const sp=d.split;if(!sp?.sessions.length)return null
 const ev=[...d.workouts.filter(w=>w.session).map(w=>({at:w.at??0,date:w.date,s:w.session as string})),...(sp.skips??[]).map(k=>({at:k.at,date:k.date,s:k.session}))]
  .sort((a,b)=>a.date.localeCompare(b.date)||a.at-b.at)
 const last=ev[ev.length-1],i=last?sp.sessions.findIndex(x=>x.label===last.s):-1
 return{next:sp.sessions[(i+1)%sp.sessions.length],last:last?.s}}
