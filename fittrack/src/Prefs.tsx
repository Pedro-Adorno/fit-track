import {useState} from 'react'
const W:[string,string][]=[['stats','Sequência, treinos e peso'],['week','Semana'],['peso','Gráfico de peso'],['metas','Metas']]
export const getHide=():string[]=>{try{return JSON.parse(localStorage.getItem('ft-hide')||'[]')}catch{return[]}}
export const applyTheme=()=>{try{document.documentElement.dataset.theme=localStorage.getItem('ft-theme')||'dark'}catch{}}
export default function Prefs(){
 const [theme,setTheme]=useState(()=>{try{return localStorage.getItem('ft-theme')||'dark'}catch{return'dark'}}),[hide,setHide]=useState(getHide)
 const t=(v:string)=>{setTheme(v);try{localStorage.setItem('ft-theme',v)}catch{}applyTheme()}
 const h=(k:string)=>{const n=hide.includes(k)?hide.filter(x=>x!==k):[...hide,k];setHide(n);try{localStorage.setItem('ft-hide',JSON.stringify(n))}catch{}}
 return <div className="card"><h2>Aparência e início</h2><label className="fld"><b>Tema</b><select value={theme} onChange={e=>t(e.target.value)}><option value="dark">Escuro</option><option value="light">Claro</option></select></label>
  <b>Mostrar na tela inicial</b>{W.map(([k,l])=><label key={k} className="between" style={{minHeight:44}}><span>{l}</span><input type="checkbox" style={{width:24,height:24,minHeight:0}} checked={!hide.includes(k)} onChange={()=>h(k)}/></label>)}
  <p className="mut">O treino de hoje sempre aparece. Estas preferências ficam só neste aparelho.</p></div>}
