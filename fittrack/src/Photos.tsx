import {useEffect,useState} from 'react'
import {format} from 'date-fns'
import {uid} from './storage'
import {Photo,listPhotos,putPhoto,delPhoto,shrink} from './photos'
import {toast,ask,Empty} from './ui'
export default function Photos({pid}:{pid:string}){
 const [ps,setPs]=useState<Photo[]>([]),[feel,setFeel]=useState(''),[note,setNote]=useState(''),[date,setDate]=useState(format(new Date(),'yyyy-MM-dd')),[err,setErr]=useState(false)
 const load=()=>listPhotos(pid).then(setPs).catch(()=>setErr(true))
 useEffect(()=>{load()},[pid])
 const add=async(f?:File)=>{if(!f)return;if(!f.type.startsWith('image/'))return toast('Escolha um arquivo de imagem.')
  try{await putPhoto({id:uid(),pid,date,img:await shrink(f),feel:+feel||undefined,note:note.trim()||undefined});setNote('');setFeel('');await load();toast('Foto salva só neste aparelho.')}catch{toast('Não foi possível salvar a foto neste navegador.')}}
 const exp=()=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify({app:'fittrack-photos',format:1,exportedAt:new Date().toISOString(),photos:ps})],{type:'application/json'}));a.download=`fittrack-fotos-${format(new Date(),'yyyy-MM-dd')}.json`;a.click()}
 const imp=async(f?:File)=>{if(!f)return;try{const o=JSON.parse(await f.text());if(o?.app!=='fittrack-photos'||!Array.isArray(o.photos))throw 0
  for(const p of o.photos){if(typeof p?.img==='string'&&p.img.startsWith('data:image/')&&typeof p.date==='string')await putPhoto({id:uid(),pid,date:p.date,img:p.img,feel:+p.feel||undefined,note:typeof p.note==='string'?p.note.slice(0,300):undefined})}
  await load();toast('Fotos importadas.')}catch{toast('Arquivo de fotos inválido.')}}
 return <section className="card"><b>Diário de evolução</b><p className="mut">Fotos ficam privadas, guardadas apenas no armazenamento deste navegador. Elas não vão no backup principal: use o arquivo de fotos abaixo.</p>
  <input type="date" aria-label="Data da foto" value={date} onChange={e=>setDate(e.target.value)}/>
  <div className="row"><select aria-label="Sensação de desempenho" value={feel} onChange={e=>setFeel(e.target.value)}><option value="">Sensação (opcional)</option>{[1,2,3,4,5].map(n=><option key={n} value={n}>{n} de 5</option>)}</select><input placeholder="Observação" value={note} onChange={e=>setNote(e.target.value)}/></div>
  <label><input type="file" accept="image/*" hidden onChange={e=>{const f=e.target.files?.[0];e.target.value='';add(f)}}/><span className="btnlike p">Adicionar foto</span></label>
  {err&&<p className="mut">Este navegador bloqueou o armazenamento de fotos (modo privado?).</p>}
  {ps.length?<div className="photos">{ps.map(p=><figure key={p.id}><img src={p.img} alt={`Foto de ${p.date}`} loading="lazy"/><figcaption className="mut">{format(new Date(p.date+'T12:00:00'),'dd/MM/yy')}{p.feel?` · ${p.feel}/5`:''}{p.note?` · ${p.note}`:''}<button className="link d" onClick={()=>ask('Excluir esta foto?',()=>{delPhoto(p.id).then(load)},'Excluir')}>Excluir</button></figcaption></figure>)}</div>:<Empty title="Sem fotos" text="Adicione uma foto para comparar sua evolução ao longo do tempo."/>}
  <div className="row wrap"><button onClick={exp} disabled={!ps.length}>Exportar fotos</button><label><input type="file" accept=".json" hidden onChange={e=>{const f=e.target.files?.[0];e.target.value='';imp(f)}}/><span className="btnlike">Importar fotos</span></label></div></section>}
