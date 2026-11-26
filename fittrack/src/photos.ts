export type Photo={id:string;pid:string;date:string;img:string;feel?:number;note?:string}
const open=()=>new Promise<IDBDatabase>((res,rej)=>{const r=indexedDB.open('fittrack-photos',1);r.onupgradeneeded=()=>r.result.createObjectStore('p',{keyPath:'id'});r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)})
const run=async<T,>(m:IDBTransactionMode,f:(s:IDBObjectStore)=>IDBRequest<T>)=>{const db=await open();return new Promise<T>((res,rej)=>{const q=f(db.transaction('p',m).objectStore('p'));q.onsuccess=()=>res(q.result);q.onerror=()=>rej(q.error)})}
export const listPhotos=(pid:string)=>run('readonly',s=>s.getAll() as IDBRequest<Photo[]>).then(a=>a.filter(p=>p.pid===pid).sort((x,y)=>y.date.localeCompare(x.date)))
export const putPhoto=(p:Photo)=>run('readwrite',s=>s.put(p))
export const delPhoto=(id:string)=>run('readwrite',s=>s.delete(id))
export const shrink=(f:File,max=900)=>new Promise<string>((res,rej)=>{const u=URL.createObjectURL(f),i=new Image();i.onload=()=>{const k=Math.min(1,max/Math.max(i.width,i.height)),c=document.createElement('canvas');c.width=Math.round(i.width*k);c.height=Math.round(i.height*k);c.getContext('2d')!.drawImage(i,0,0,c.width,c.height);URL.revokeObjectURL(u);res(c.toDataURL('image/jpeg',.8))};i.onerror=()=>rej(new Error('Imagem inválida'));i.src=u})
