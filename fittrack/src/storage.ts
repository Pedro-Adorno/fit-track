export type SetRec={reps:number;kg:number}
export type Ex={name:string;sets:SetRec[]}
export type Workout={id:string;date:string;exs:Ex[];minutes:number;notes:string}
export type Act={id:string;date:string;kind:string;km:number;minutes:number}
export type Weight={id:string;date:string;kg:number}
export type Goal={id:string;name:string;start:number;target:number;current:number;deadline:string}
export type PData={workouts:Workout[];acts:Act[];weights:Weight[];plan?:Record<string,string>;goals?:Goal[];measures?:{id:string;date:string;part:string;cm:number}[];well?:{id:string;date:string;sleep:number;mood:number;fatigue:number}[]}
export type Ob={age:number;height:number;goal:string;days:number}
export type Profile={id:string;name:string;ob?:Ob}
export type DB={v:1;profiles:Profile[];active:string;data:Record<string,PData>}
const KEY='fittrack:v1'
export const uid=()=>Math.random().toString(36).slice(2,10)
export const emptyData=():PData=>({workouts:[],acts:[],weights:[]})
export function fresh():DB{const id=uid();return{v:1,profiles:[{id,name:'Perfil 1'}],active:id,data:{[id]:emptyData()}}}
export function valid(x:any):x is DB{
 return x&&x.v===1&&Array.isArray(x.profiles)&&x.profiles.length>0&&typeof x.active==='string'&&x.data&&
 x.profiles.every((p:any)=>typeof p.id==='string'&&typeof p.name==='string'&&x.data[p.id]&&
 Array.isArray(x.data[p.id].workouts)&&Array.isArray(x.data[p.id].acts)&&Array.isArray(x.data[p.id].weights))}
export function load():DB{try{const r=localStorage.getItem(KEY);if(r){const d=JSON.parse(r);if(valid(d))return d}}catch{}return fresh()}
export function save(db:DB){try{localStorage.setItem(KEY,JSON.stringify(db))}catch{alert('Não foi possível salvar os dados.')}}
export const volume=(w:Workout)=>w.exs.reduce((a,e)=>a+e.sets.reduce((b,s)=>b+s.reps*s.kg,0),0)
export const pace=(km:number,min:number)=>km>0?min/km:0
export const speed=(km:number,min:number)=>min>0?km/(min/60):0
export const pct=(a:number,b:number)=>a?((b-a)/a)*100:0
export function download(db:DB){const b=new Blob([JSON.stringify(db,null,1)],{type:'application/json'});
 const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='fittrack-backup.json';a.click()}
export async function importFile(f:File):Promise<DB>{const d=JSON.parse(await f.text());if(!valid(d))throw new Error('Arquivo inválido');return d}
