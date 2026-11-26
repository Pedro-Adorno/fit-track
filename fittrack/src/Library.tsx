import {useState} from 'react'
import {PData} from './storage'
import {GROUPS,allEx,find} from './exercises'
import {toast,Empty} from './ui'
export default function Library({d,up,onPick}:{d:PData;up:(f:(x:PData)=>void)=>void;onPick:(n:string)=>void}){
 const [g,setG]=useState(''),[q,setQ]=useState(''),[n,setN]=useState(''),[ng,setNg]=useState<string>(GROUPS[0]),[eq,setEq]=useState('')
 const all=allEx(d.customEx),list=all.filter(e=>(!g||e.group===g)&&e.name.toLowerCase().includes(q.toLowerCase()))
 const add=()=>{if(!n.trim())return toast('Dê um nome ao exercício.');if(find(n,d.customEx))return toast('Este exercício já existe na biblioteca.')
  up(x=>{x.customEx=[...(x.customEx??[]),{name:n.trim().slice(0,50),group:ng,sec:[],equip:eq.trim().slice(0,30)||'—'}]});setN('');setEq('');toast('Exercício criado.')}
 return <div className="card"><datalist id="exlib">{all.map(e=><option key={e.name} value={e.name}/>)}</datalist>
  <h2>Biblioteca de exercícios</h2><p className="mut">Toque num exercício para usá-lo no registro. O grupo muscular alimenta suas análises.</p>
  <div className="row"><select aria-label="Grupo" value={g} onChange={e=>setG(e.target.value)}><option value="">Todos os grupos</option>{GROUPS.map(x=><option key={x}>{x}</option>)}</select><input placeholder="Buscar" aria-label="Buscar exercício" value={q} onChange={e=>setQ(e.target.value)}/></div>
  <div style={{maxHeight:240,overflowY:'auto'}}>{list.length?list.map(e=><div key={e.name} className="between"><button className="link" onClick={()=>{onPick(e.name);toast(`${e.name} selecionado.`)}}>{e.name}</button><span className="mut">{e.group} · {e.equip}</span></div>):<Empty title="Nada encontrado" text="Crie o exercício abaixo."/>}</div>
  <h2 style={{marginTop:16}}>Criar exercício</h2><input placeholder="Nome" value={n} onChange={e=>setN(e.target.value)}/>
  <div className="row"><select aria-label="Grupo principal" value={ng} onChange={e=>setNg(e.target.value)}>{GROUPS.map(x=><option key={x}>{x}</option>)}</select><input placeholder="Equipamento" value={eq} onChange={e=>setEq(e.target.value)}/></div>
  <button className="p" onClick={add}>Adicionar à biblioteca</button></div>}
