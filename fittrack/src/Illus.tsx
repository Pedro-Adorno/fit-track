import {LibEx} from './exercises'
const HI:Record<string,string>={Peito:'t',Costas:'t',Abdômen:'t','Corpo inteiro':'t',Ombros:'a',Bíceps:'a',Tríceps:'a',Quadríceps:'l',Posterior:'l',Glúteos:'l',Panturrilha:'l'}
const INK='#1b1f1d',W='#ffffff',HL='#b6f23a',GR='#6b756f'
const P:Record<string,number[][]>={
 squat:[[50,12,50,24,58,30,66,28,50,52,50,72,50,92],[52,30,50,42,60,48,66,44,40,62,62,66,52,92]],
 hinge:[[50,12,50,24,50,38,50,52,50,52,50,72,50,92],[78,36,70,40,72,54,72,66,44,50,46,72,46,92]],
 press:[[50,12,50,24,56,36,52,24,50,52,50,72,50,92],[50,12,50,24,52,14,50,4,50,52,50,72,50,92]],
 curl:[[50,12,50,24,50,38,50,50,50,52,50,72,50,92],[50,12,50,24,52,38,62,26,50,52,50,72,50,92]],
 row:[[74,34,66,38,68,52,68,66,42,50,46,72,46,92],[74,34,66,38,52,46,60,52,42,50,46,72,46,92]],
 bench:[[10,60,22,60,32,66,24,60,60,60,78,48,84,70],[10,60,22,60,22,45,22,32,60,60,78,48,84,70]],
 core:[[14,70,24,70,34,66,30,64,52,70,68,50,84,70],[22,56,30,60,38,58,34,56,52,70,68,50,84,70]]}
const pose=(n:string)=>/agach|leg press|afundo|extensora|panturrilha/.test(n)?'squat':/terra|stiff|pélvica|flexora/.test(n)?'hinge':/supino|crucifixo|flexão/.test(n)?'bench':/desenvolv|lateral/.test(n)?'press':/rosca|tríceps/.test(n)?'curl':/puxada|remada|barra fixa/.test(n)?'row':'core'
const Seg=({pts,w,c}:{pts:string;w:number;c:string})=><><polyline points={pts} stroke={INK} strokeWidth={w+3}/><polyline points={pts} stroke={c} strokeWidth={w}/></>
const Fig=({f,ox,hi,equip,k}:{f:number[];ox:number;hi?:string;equip:string;k:string})=>{const p=(i:number)=>`${f[i*2]+ox},${f[i*2+1]}`;const hx=f[6]+ox,hy=f[7]
 const col=(s:string)=>hi===s?HL:W
 return <g strokeLinecap="round" strokeLinejoin="round" fill="none" filter="url(#rough)">
  {k==='bench'?<rect x={14+ox} y={66} width={58} height={6} fill="#c9c2b2" stroke={INK} strokeWidth="1.5"/>:k==='core'?<line x1={6+ox} y1={76} x2={98+ox} y2={76} stroke={GR} strokeWidth="4"/>:<line x1={4+ox} y1={95} x2={100+ox} y2={95} stroke={INK} strokeWidth="1.5"/>}
  <Seg pts={`${p(4)} ${p(5)} ${p(6)}`} w={10} c={col('l')}/><line x1={f[12]+ox} y1={f[13]} x2={f[12]+ox+9} y2={f[13]} stroke={INK} strokeWidth="5"/>
  <Seg pts={`${p(1)} ${p(4)}`} w={13} c={col('t')}/>
  <circle cx={f[0]+ox} cy={f[1]} r="8" fill={W} stroke={INK} strokeWidth="2"/>
  <Seg pts={`${p(1)} ${p(2)} ${p(3)}`} w={8} c={col('a')}/>
  {/Barra/.test(equip)&&<><circle cx={hx} cy={hy} r="10" stroke={GR} strokeWidth="3"/><circle cx={hx} cy={hy} r="2.5" fill={GR}/></>}
  {/Halter/.test(equip)&&<rect x={hx-8} y={hy-3} width="16" height="6" rx="2" fill={GR} stroke={INK} strokeWidth="1"/>}
  {/Polia/.test(equip)&&<line x1={hx} y1={hy} x2={hx} y2={0} stroke={GR} strokeWidth="1.5" strokeDasharray="3 3"/>}
  {/Máquina/.test(equip)&&<rect x={hx-6} y={hy-6} width="12" height="12" rx="3" stroke={GR} strokeWidth="2.5"/>}</g>}
export const poseOf=(ex:LibEx)=>ex.pose&&P[ex.pose]?ex.pose:pose(ex.name.toLowerCase())
export default function Illus({ex}:{ex:LibEx}){const k=poseOf(ex);const [a,b]=P[k];const hi=HI[ex.group]
 return <svg viewBox="0 0 220 108" style={{width:'100%',maxWidth:340,background:'#f4f1ea',borderRadius:10}} role="img" aria-label={`Desenho do exercício ${ex.name}`}>
  <defs><filter id="rough" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency=".04" numOctaves="2" seed="4" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="2.2"/></filter></defs>
  <Fig f={a} ox={0} hi={hi} equip={ex.equip} k={k}/><Fig f={b} ox={110} hi={hi} equip={ex.equip} k={k}/>
  <text x="38" y="106" fill="#5b645f" fontSize="8">Início</text><text x="155" y="106" fill="#5b645f" fontSize="8">Fim</text><text x="2" y="9" fill="#5b645f" fontSize="7">Verde = região trabalhada</text></svg>}
