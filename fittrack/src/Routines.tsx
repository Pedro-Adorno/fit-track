import {useState} from 'react'
import {DB,Routine,uid} from './storage'
import {toast,Empty,ask} from './ui'
type Props={db:DB;setDB:(f:(p:DB)=>DB)=>void;onPick:(name:string,hint:string)=>void}
export default function Routines({db,setDB,onPick}:Props){
 const me=db.active,list=(db.routines??[]).filter(r=>r.owners.includes(me)),others=db.profiles.filter(p=>p.id!==me)
 const [n,setN]=useState(''),[mate,setMate]=useState(''),[open,setOpen]=useState('')
 const [en,setEn]=useState(''),[es,setEs]=useState('3'),[er,setEr]=useState('10'),[rs,setRs]=useState('60')
 const [code,setCode]=useState('')
 const pack=(r:Routine)=>JSON.stringify({type:'fittrack-routine',v:1,routine:{name:r.name,exs:r.exs.map(({name,sets,reps,rest})=>({name,sets,reps,rest}))}})
 const copy=(r:Routine)=>{if(!r.exs.length)return toast('Adicione exercícios antes de compartilhar.');navigator.clipboard?.writeText(pack(r)).then(()=>toast('Código copiado! Envie por mensagem.'),()=>toast('Não foi possível copiar. Use Baixar arquivo.'))}
 const file=(r:Routine)=>{if(!r.exs.length)return toast('Adicione exercícios antes de compartilhar.');const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([pack(r)],{type:'application/json'}));a.download=`rotina-${r.name.replace(/[^\w-]+/g,'_')}.json`;a.click();toast('Arquivo gerado.')}
 const imp=(txt:string)=>{try{const o=JSON.parse(txt.trim());const r=o?.routine;if(o?.type!=='fittrack-routine'||typeof r?.name!=='string'||!Array.isArray(r.exs)||!r.exs.length||r.exs.length>60)throw 0
  const exs=r.exs.map((e:any)=>{if(typeof e?.name!=='string'||!e.name.trim()||!(+e.sets>0)||!(+e.reps>0))throw 0;return{id:uid(),name:e.name.trim().slice(0,60),sets:Math.min(20,Math.round(+e.sets)),reps:Math.min(100,Math.round(+e.reps)),rest:Math.max(0,Math.min(600,Math.round(+e.rest)||0))}})
  upd(x=>[...x,{id:uid(),name:r.name.trim().slice(0,60)||'Rotina importada',owners:[me],exs}]);setCode('');toast(`Rotina “${r.name}” importada para você.`)}catch{toast('Código ou arquivo inválido. Peça para reenviar a rotina.')}}
 const upd=(fn:(r:Routine[])=>Routine[])=>setDB(p=>({...p,routines:fn(p.routines??[])}))
 const who=(r:Routine)=>r.owners.filter(o=>o!==me).map(o=>db.profiles.find(p=>p.id===o)?.name).filter(Boolean).join(', ')
 const create=()=>{if(!n.trim())return toast('Dê um nome à rotina (ex.: Treino A – Peito).')
  const r:Routine={id:uid(),name:n.trim(),owners:mate?[me,mate]:[me],exs:[]};upd(x=>[...x,r]);setOpen(r.id);setN('');setMate('');toast('Rotina criada. Adicione os exercícios.')}
 const addEx=(id:string)=>{if(!en.trim()||!(+es>0)||!(+er>0))return toast('Informe exercício, séries e repetições.')
  upd(x=>x.map(r=>r.id===id?{...r,exs:[...r.exs,{id:uid(),name:en.trim(),sets:+es,reps:+er,rest:+rs||0}]}:r));setEn('')}
 const solo=(r:Routine)=>{upd(x=>[...x.map(y=>y.id===r.id?{...y,owners:y.owners.filter(o=>o!==me)}:y),{...r,id:uid(),owners:[me]}]);toast('Cópia só sua criada. A outra pessoa mantém a rotina original.')}
 const del=(r:Routine)=>{const msg=r.owners.length>1?'Sair desta rotina compartilhada? A outra pessoa continua com ela.':'Excluir rotina?';ask(msg,()=>upd(x=>x.flatMap(y=>y.id!==r.id?[y]:y.owners.length>1?[{...y,owners:y.owners.filter(o=>o!==me)}]:[])),r.owners.length>1?'Sair':'Excluir')}
 return <div className="card"><h2>Minhas rotinas</h2>
  <p className="mut">Monte seus treinos uma vez e use-os ao registrar. Rotinas compartilhadas aparecem para as duas pessoas, mas cada uma registra suas próprias cargas.</p>
  {!list.length&&<Empty title="Nenhuma rotina ainda" text="Crie abaixo, por exemplo, “Treino A”."/>}
  {list.map(r=><div key={r.id} className="card sub"><div className="between"><b>{r.name}</b>{r.owners.length>1&&<span className="badge">Com {who(r)}</span>}</div>
   {r.exs.map(e=><div key={e.id} className="between"><button className="link" onClick={()=>{onPick(e.name,`Meta: ${e.sets}×${e.reps}${e.rest?` · descanso ${e.rest}s`:''}`);toast(`${e.name} selecionado abaixo.`)}}>{e.name}</button>
    <span className="mut">{e.sets}×{e.reps}{e.rest?` · ${e.rest}s`:''} <button className="link d" aria-label={`Remover ${e.name}`} onClick={()=>upd(x=>x.map(y=>y.id===r.id?{...y,exs:y.exs.filter(z=>z.id!==e.id)}:y))}>Remover</button></span></div>)}
   {!r.exs.length&&<p className="mut">Sem exercícios ainda.</p>}
   <div className="row wrap"><button onClick={()=>copy(r)}>Copiar código</button><button onClick={()=>file(r)}>Baixar arquivo</button></div>{open===r.id?<><input placeholder="Exercício" value={en} onChange={e=>setEn(e.target.value)}/>
    <div className="row"><input type="number" inputMode="numeric" aria-label="Séries" placeholder="Séries" value={es} onChange={e=>setEs(e.target.value)}/><input type="number" inputMode="numeric" aria-label="Repetições" placeholder="Reps" value={er} onChange={e=>setEr(e.target.value)}/><input type="number" inputMode="numeric" aria-label="Descanso em segundos" placeholder="Desc. (s)" value={rs} onChange={e=>setRs(e.target.value)}/></div>
    <div className="row"><button className="p" onClick={()=>addEx(r.id)}>Adicionar exercício</button><button onClick={()=>setOpen('')}>Fechar</button></div></>
   :<div className="row"><button onClick={()=>setOpen(r.id)}>Editar exercícios</button>{r.owners.length>1&&<button onClick={()=>solo(r)}>Personalizar só para mim</button>}<button className="d" onClick={()=>del(r)}>{r.owners.length>1?'Sair':'Excluir'}</button></div>}</div>)}
  <h2 style={{marginTop:16}}>Importar rotina de outra pessoa</h2><p className="mut">Cole o código ou escolha o arquivo recebido. Você ganha sua própria cópia: alterações de cada um não afetam o outro, e as cargas ficam só no seu histórico.</p>
  <textarea style={{width:'100%'}} rows={3} aria-label="Código da rotina" placeholder="Cole o código aqui" value={code} onChange={e=>setCode(e.target.value)}/>
  <div className="row wrap"><button className="p" onClick={()=>imp(code)}>Importar código</button><label><input type="file" accept=".json" hidden onChange={async e=>{const f=e.target.files?.[0];e.target.value='';if(f)imp(await f.text())}}/><span className="btnlike">Escolher arquivo</span></label></div>
  <h2 style={{marginTop:16}}>Nova rotina</h2><input placeholder="Nome da rotina" value={n} onChange={e=>setN(e.target.value)}/>
  {others.length>0&&<><select aria-label="Compartilhar com" value={mate} onChange={e=>setMate(e.target.value)}><option value="">Só eu</option>{others.map(p=><option key={p.id} value={p.id}>Compartilhar com {p.name}</option>)}</select>
   <p className="mut">Para treinar junto, crie outro perfil em Perfil e compartilhe a rotina com ele.</p></>}
  <button className="p" onClick={create}>Criar rotina</button></div>}
