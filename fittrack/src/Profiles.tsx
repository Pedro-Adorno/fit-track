import {useState} from 'react'
import {DB} from './storage'
type A=Record<string,any>
type Q={id:string;label:string;t:'text'|'num'|'one'|'many';o?:string[];show?:(a:A)=>boolean;opt?:boolean}
export const AV=['🏋️','🏃','⚽','🚴','🏊','🧘','🔥','💪','🦍','🐺']
const has=(a:A,k:string,v:string)=>Array.isArray(a[k])?a[k].includes(v):a[k]===v
const any=(a:A,k:string,...v:string[])=>v.some(x=>has(a,k,x))
const OBJ=['Hipertrofia','Emagrecimento','Força','Resistência muscular','Condicionamento','Saúde e qualidade de vida']
const STEPS:{n:string;q:Q[]}[]=[
{n:'Informações pessoais',q:[{id:'idade',label:'Idade',t:'num'},{id:'altura',label:'Altura (cm)',t:'num'},{id:'peso',label:'Peso atual (kg)',t:'num'},{id:'pesoAlvo',label:'Peso desejado (kg)',t:'num',opt:true},{id:'sexo',label:'Sexo biológico (opcional, só para estimativas)',t:'one',o:['Masculino','Feminino','Prefiro não informar'],opt:true}]},
{n:'Objetivos',q:[{id:'objetivos',label:'Objetivos (vários)',t:'many',o:OBJ},{id:'principal',label:'Objetivo principal',t:'one',o:OBJ},
 {id:'regioes',label:'Regiões prioritárias',t:'many',o:['Peito','Costas','Ombros','Braços','Pernas','Glúteos','Abdômen'],show:a=>any(a,'objetivos','Hipertrofia','Força')||any(a,'principal','Hipertrofia','Força'),opt:true}]},
{n:'Experiência',q:[{id:'tempo',label:'Tempo de treino',t:'one',o:['Nunca treinei','Menos de 6 meses','6 meses a 2 anos','2 a 5 anos','Mais de 5 anos']},
 {id:'nivel',label:'Nível',t:'one',o:['Iniciante','Intermediário','Avançado']},{id:'freqAtual',label:'Frequência atual',t:'one',o:['Nenhuma','1–2 dias/sem','3–4 dias/sem','5+ dias/sem']},
 {id:'interrompeu',label:'Já ficou longos períodos sem treinar?',t:'one',o:['Sim','Não']},{id:'motivoInt',label:'Qual foi o motivo?',t:'text',opt:true,show:a=>a.interrompeu==='Sim'},
 {id:'dominados',label:'Exercícios que você domina',t:'many',o:['Agachamento','Supino','Terra','Remada','Desenvolvimento','Barra fixa'],opt:true,show:a=>!!a.nivel&&a.nivel!=='Iniciante'}]},
{n:'Disponibilidade',q:[{id:'dias',label:'Dias disponíveis',t:'many',o:['Seg','Ter','Qua','Qui','Sex','Sáb','Dom']},{id:'duracao',label:'Tempo por sessão',t:'one',o:['30 min','45 min','60 min','90 min ou mais']},
 {id:'horario',label:'Horário preferido',t:'one',o:['Manhã','Tarde','Noite']},{id:'local',label:'Onde treina',t:'one',o:['Academia','Casa','Ambos']},
 {id:'acadCompleta',label:'A academia é completa?',t:'one',o:['Sim','Não'],show:a=>any(a,'local','Academia','Ambos')},
 {id:'equip',label:'Equipamentos em casa',t:'many',o:['Halteres','Barra','Elásticos','Banco','Nenhum'],show:a=>any(a,'local','Casa','Ambos'),opt:true}]},
{n:'Condições físicas',q:[{id:'lesao',label:'Tem ou teve lesões?',t:'one',o:['Sim','Não']},{id:'lesaoDesc',label:'Quais lesões?',t:'text',show:a=>a.lesao==='Sim',opt:true},
 {id:'dores',label:'Sente dores frequentes?',t:'one',o:['Sim','Não']},{id:'doresDesc',label:'Onde?',t:'text',show:a=>a.dores==='Sim',opt:true},
 {id:'restricao',label:'Restrição médica ou orientação profissional (opcional)',t:'text',opt:true},{id:'evitar',label:'Exercícios a evitar (opcional)',t:'text',opt:true}]},
{n:'Preferências de treino',q:[{id:'favoritos',label:'Exercícios favoritos',t:'text',opt:true},{id:'naoGosta',label:'Exercícios que não gosta',t:'text',opt:true},
 {id:'intensidade',label:'Intensidade preferida',t:'one',o:['Leve','Moderada','Alta']},{id:'divisao',label:'Divisão preferida',t:'one',o:['ABC','ABCD','Full body','Upper/Lower','Sem preferência']},
 {id:'equipPref',label:'Prefere',t:'one',o:['Máquinas','Pesos livres','Ambos']}]},
{n:'Alimentação',q:[{id:'refeicoes',label:'Refeições por dia',t:'one',o:['2–3','4–5','6 ou mais']},{id:'dieta',label:'Padrão alimentar',t:'one',o:['Sem restrição','Vegetariano','Vegano','Low carb','Outro']},
 {id:'restAlim',label:'Quais restrições?',t:'text',show:a=>a.dieta==='Outro',opt:true},{id:'agua',label:'Consumo de água',t:'one',o:['< 1 L','1–2 L','2–3 L','3 L ou mais']},
 {id:'objNutri',label:'Objetivo nutricional',t:'one',o:['Manter','Perder gordura','Ganhar massa','Ainda não sei']}]},
{n:'Hábitos',q:[{id:'sono',label:'Horas de sono por noite',t:'num'},{id:'qualSono',label:'Qualidade do sono',t:'one',o:['Ruim','Regular','Boa']},
 {id:'atividadeDia',label:'Atividade fora do treino',t:'one',o:['Sedentário','Leve','Moderado','Ativo']},{id:'estresse',label:'Nível de estresse',t:'one',o:['Baixo','Médio','Alto']}]},
{n:'Esportes',q:[{id:'esportes',label:'Esportes que pratica',t:'many',o:['Futebol','Corrida','Caminhada','Ciclismo','Natação','Outros'],opt:true},
 {id:'futFreq',label:'Frequência de futebol',t:'one',o:['1x/sem','2x/sem','3x ou mais'],show:a=>has(a,'esportes','Futebol'),opt:true},
 {id:'corrDist',label:'Distância típica de corrida',t:'one',o:['< 3 km','3–5 km','5–10 km','10 km ou mais'],show:a=>has(a,'esportes','Corrida'),opt:true},
 {id:'outroEsp',label:'Quais outros esportes?',t:'text',show:a=>has(a,'esportes','Outros'),opt:true}]}]
export function Welcome({onCreate,title='Criar perfil'}:{onCreate:(n:string,av:string)=>void;title?:string}){
 const [n,setN]=useState('');const [av,setAv]=useState(AV[0])
 return <div className="card"><h2>{title}</h2><input placeholder="Seu nome" value={n} onChange={e=>setN(e.target.value)}/>
  <div className="row" style={{flexWrap:'wrap'}}>{AV.map(x=><button key={x} className={av===x?'p':''} style={{flex:'0 0 44px'}} onClick={()=>setAv(x)}>{x}</button>)}</div>
  <button className="p" style={{marginTop:8}} onClick={()=>{if(!n.trim())return alert('Informe um nome.');onCreate(n.trim(),av);setN('')}}>Criar e começar avaliação</button></div>}
export function Assessment({name,init,onDone,onCancel}:{name:string;init?:A;onDone:(a:A)=>void;onCancel?:()=>void}){
 const [a,setA]=useState<A>(init??{});const [i,setI]=useState(0);const st=STEPS[i];const qs=st.q.filter(q=>!q.show||q.show(a))
 const set=(id:string,v:any)=>setA(p=>({...p,[id]:v}))
 const next=()=>{for(const q of qs){const v=a[q.id];if(q.opt||q.t==='many')continue;if(q.t==='num'?!(+v>0):q.t==='text'?!String(v??'').trim():!v)return alert('Responda: '+q.label)}
  if(i<STEPS.length-1)setI(i+1);else{const o:A={};STEPS.forEach(s=>s.q.forEach(q=>{if(!q.show||q.show(a))o[q.id]=a[q.id]}));onDone({...o,done:true})}}
 return <main><h1 className="logo">Avaliação de {name}</h1><div style={{background:'#0f1211',height:6,borderRadius:6}}><div style={{width:((i+1)/STEPS.length*100)+'%',background:'#b6f23a',height:6,borderRadius:6,transition:'width .3s'}}/></div>
  <p className="mut">Etapa {i+1} de {STEPS.length} — {st.n}. Sem diagnósticos: usamos suas respostas só para personalizar.</p>
  <div className="card">{qs.map(q=><div key={q.id} style={{marginBottom:12}}><div>{q.label}{q.opt&&<span className="mut"> (opcional)</span>}</div>
   {(q.t==='text'||q.t==='num')&&<input type={q.t==='num'?'number':'text'} inputMode={q.t==='num'?'decimal':undefined} value={a[q.id]??''} onChange={e=>set(q.id,e.target.value)}/>}
   {(q.t==='one'||q.t==='many')&&<div className="row" style={{flexWrap:'wrap'}}>{q.o!.map(o=>{const on=q.t==='one'?a[q.id]===o:(a[q.id]??[]).includes(o)
    return <button key={o} className={on?'p':''} style={{flex:'0 0 auto'}} onClick={()=>q.t==='one'?set(q.id,on&&q.opt?'':o):set(q.id,on?(a[q.id] as string[]).filter(x=>x!==o):[...(a[q.id]??[]),o])}>{o}</button>})}</div>}</div>)}</div>
  <div className="row">{i>0?<button onClick={()=>setI(i-1)}>Voltar</button>:onCancel&&<button onClick={onCancel}>Cancelar</button>}<button className="p" onClick={next}>{i<STEPS.length-1?'Próximo':'Concluir'}</button></div></main>}
export function ProfilesPanel({db,setDB,onCreate,onAssess}:{db:DB;setDB:(f:(p:DB)=>DB)=>void;onCreate:(n:string,av:string)=>void;onAssess:()=>void}){
 return <div className="card"><h2>Perfis</h2>{db.profiles.map(p=><div key={p.id} className="card"><div style={{fontSize:18}}>{p.avatar??'🙂'} <b>{p.name}</b>{p.id===db.active&&<span className="mut"> · ativo</span>}</div>
  <div className="row" style={{flexWrap:'wrap'}}><button onClick={()=>setDB(s=>({...s,active:p.id}))}>Selecionar</button>
  <button onClick={()=>{const n=prompt('Novo nome',p.name);if(n&&n.trim())setDB(s=>({...s,profiles:s.profiles.map(x=>x.id===p.id?{...x,name:n.trim()}:x)}))}}>Renomear</button>
  <select value={p.avatar??''} onChange={e=>setDB(s=>({...s,profiles:s.profiles.map(x=>x.id===p.id?{...x,avatar:e.target.value}:x)}))}><option value="">Avatar</option>{AV.map(x=><option key={x}>{x}</option>)}</select>
  {p.id===db.active&&<button onClick={onAssess}>Refazer avaliação</button>}
  <button className="d" onClick={()=>{if(confirm(`Excluir "${p.name}" e todos os seus dados?`))setDB(s=>{const n=structuredClone(s);n.profiles=n.profiles.filter(x=>x.id!==p.id);delete n.data[p.id];if(n.active===p.id)n.active=n.profiles[0]?.id??'';return n})}}>Excluir</button></div></div>)}
  <Welcome title="Novo perfil" onCreate={onCreate}/></div>}
