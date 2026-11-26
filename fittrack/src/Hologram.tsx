import {useEffect,useRef} from 'react'
import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'
import {MeshoptDecoder} from 'three/examples/jsm/libs/meshopt_decoder.module.js'
import {matchRegion} from './muscleMap'
export type Status={state:'loading'|'ready'|'missing'|'fail';muscles:string[];meshes?:{n:string;r:string}[]}
type P={url:string;mode:'body'|'muscle';intensity:Record<string,number>;sel:string;view:'front'|'side'|'back';scale:[number,number,number];onSelect:(r:string)=>void;onStatus:(s:Status)=>void;rev?:number}
const mk=()=>new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,side:THREE.DoubleSide,
 uniforms:{uColor:{value:new THREE.Color(0x19d3ff)},uAlpha:{value:.16},uRim:{value:1.3},uTime:{value:0}},
 vertexShader:'varying vec3 vN;varying vec3 vV;varying float vY;void main(){vec4 mv=modelViewMatrix*vec4(position,1.);vN=normalize(normalMatrix*normal);vV=normalize(-mv.xyz);vY=(modelMatrix*vec4(position,1.)).y;gl_Position=projectionMatrix*mv;}',
 fragmentShader:'uniform vec3 uColor;uniform float uAlpha;uniform float uRim;uniform float uTime;varying vec3 vN;varying vec3 vV;varying float vY;void main(){float f=pow(1.-abs(dot(normalize(vN),normalize(vV))),2.);float s=.7+.3*sin(vY*80.-uTime*1.6);float a=(uAlpha+f*uRim*.5)*s;gl_FragColor=vec4(uColor*(.55+f*1.5),a);}'})
const LOW=new THREE.Color(0x2146ff),MID=new THREE.Color(0x19d3ff),HIGH=new THREE.Color(0x7dffb0),HOT=new THREE.Color(0xffffff)
export default function Hologram({url,mode,intensity,sel,view,scale,onSelect,onStatus,rev=0}:P){
 const box=useRef<HTMLDivElement>(null),S=useRef<any>({}),cb=useRef({onSelect,onStatus});cb.current={onSelect,onStatus}
 useEffect(()=>{const el=box.current;if(!el)return;let raf=0,dead=false,ro:ResizeObserver|undefined,cleanup=()=>{}
  ;(async()=>{try{const h=await fetch(url,{method:'HEAD'});if(dead)return;if(!h.ok||(h.headers.get('content-type')||'').includes('html'))return cb.current.onStatus({state:'missing',muscles:[]})}catch{return cb.current.onStatus({state:'missing',muscles:[]})}
   try{const H=()=>Math.round(Math.max(300,Math.min(480,(el.clientWidth||300)*1.2,innerHeight*.72))),w=el.clientWidth||300,hh=H(),rm=matchMedia('(prefers-reduced-motion: reduce)').matches,r=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'high-performance'});r.setPixelRatio(Math.min(devicePixelRatio||1,1.75));r.setSize(w,hh);el.style.height=hh+'px';el.appendChild(r.domElement);r.domElement.style.touchAction='none'
    const sc=new THREE.Scene(),cam=new THREE.PerspectiveCamera(32,w/hh,.1,60);cam.position.set(0,1.0,4.2)
    const ct=new OrbitControls(cam,r.domElement);ct.target.set(0,.95,0);ct.enablePan=false;ct.enableDamping=true;ct.minDistance=1.8;ct.maxDistance=6;ct.autoRotate=false
    const grp=new THREE.Group();sc.add(grp);const meshes:THREE.Mesh[]=[]
    const gltf=await new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).loadAsync(url);if(dead){r.dispose();return}
    const root=gltf.scene,bb=new THREE.Box3().setFromObject(root),sz=bb.getSize(new THREE.Vector3()),k=1.8/(sz.y||1);root.scale.setScalar(k);const b2=new THREE.Box3().setFromObject(root),c=b2.getCenter(new THREE.Vector3());root.position.set(-c.x,-b2.min.y,-c.z);grp.add(root)
    const found=new Set<string>()
    root.traverse(o=>{const m=o as THREE.Mesh;if(!m.isMesh)return;const sys=((n:THREE.Object3D|null)=>{while(n){const k=n.name.toLowerCase();if(['skin','skeleton','muscles','organs','vessels','nerves'].includes(k))return k;n=n.parent}return ''})(m);if(sys&&sys!=='skin'&&sys!=='muscles'){m.visible=false;return};m.material=mk();m.userData.skin=sys==='skin';m.userData.n=m.name||m.parent?.name||'(sem nome)';m.userData.c=m.name+' '+(m.parent?.name??'');m.userData.r=m.userData.skin?'':matchRegion(m.userData.c,m.userData.n);if(m.userData.r)found.add(m.userData.r);meshes.push(m)})
    S.current={cam,ct,grp,meshes,r,sc};cb.current.onStatus({state:'ready',muscles:[...found],meshes:meshes.filter(m=>!m.userData.skin).map(m=>({n:m.userData.n,r:m.userData.r}))})
    const ray=new THREE.Raycaster(),v=new THREE.Vector2();let dn=[0,0]
    r.domElement.addEventListener('pointerdown',e=>{dn=[e.clientX,e.clientY]})
    r.domElement.addEventListener('pointerup',e=>{if(S.current.mode!=='muscle'||Math.hypot(e.clientX-dn[0],e.clientY-dn[1])>6)return;const b=r.domElement.getBoundingClientRect();v.set(((e.clientX-b.left)/b.width)*2-1,-((e.clientY-b.top)/b.height)*2+1);ray.setFromCamera(v,cam);const hit=ray.intersectObjects(meshes.filter(m=>m.userData.r))[0];if(hit)cb.current.onSelect(hit.object.userData.r)})
    const t0=performance.now();const loop=()=>{raf=requestAnimationFrame(loop);if(document.hidden)return;const t=rm?0:(performance.now()-t0)/1000;meshes.forEach(m=>(m.material as THREE.ShaderMaterial).uniforms.uTime.value=t);ct.update();r.render(sc,cam)};loop()
    ro=new ResizeObserver(()=>{const nw=el.clientWidth||300,nh=H();el.style.height=nh+'px';r.setSize(nw,nh);cam.aspect=nw/nh;cam.updateProjectionMatrix()});ro.observe(el)
    cleanup=()=>{cancelAnimationFrame(raf);ro?.disconnect();ct.dispose();meshes.forEach(m=>{m.geometry.dispose();(m.material as THREE.Material).dispose()});r.dispose();r.domElement.remove()}
   }catch{if(!dead)cb.current.onStatus({state:'fail',muscles:[]})}})()
  return()=>{dead=true;cleanup()}},[url])
 useEffect(()=>{const s=S.current;if(!s.meshes)return;s.mode=mode
  s.meshes.forEach((m:THREE.Mesh)=>{const u=(m.material as THREE.ShaderMaterial).uniforms,reg=m.userData.r as string
   if(m.userData.skin){u.uColor.value.copy(MID);u.uAlpha.value=mode==='body'?.1:.025;u.uRim.value=mode==='body'?1.6:.5;return}
   if(mode==='body'||!reg){u.uColor.value.copy(mode==='body'?MID:LOW);u.uAlpha.value=mode==='body'?.16:.05;u.uRim.value=mode==='body'?1.3:.6;return}
   const k=intensity[reg]??0;const col=k<.5?LOW.clone().lerp(MID,k*2):MID.clone().lerp(HIGH,(k-.5)*2);if(reg===sel)col.lerp(HOT,.6)
   u.uColor.value.copy(col);u.uAlpha.value=.18+k*.5+(reg===sel?.25:0);u.uRim.value=reg===sel?2.4:1})},[mode,intensity,sel])
 useEffect(()=>{const s=S.current;if(!s.meshes)return;const f=new Set<string>();s.meshes.forEach((m:THREE.Mesh)=>{m.userData.r=m.userData.skin?'':matchRegion(m.userData.c,m.userData.n);if(m.userData.r)f.add(m.userData.r)});cb.current.onStatus({state:'ready',muscles:[...f],meshes:s.meshes.filter((m:THREE.Mesh)=>!m.userData.skin).map((m:THREE.Mesh)=>({n:m.userData.n,r:m.userData.r}))})},[rev])
 useEffect(()=>{const s=S.current;if(s.grp)s.grp.scale.set(scale[0],scale[1],scale[2])},[scale])
 useEffect(()=>{const s=S.current;if(!s.cam)return;const d=s.cam.position.distanceTo(s.ct.target)||4.2,p=view==='front'?[0,0,d]:view==='back'?[0,0,-d]:[d,0,0];s.cam.position.set(p[0],.95,p[2]);s.ct.update()},[view])
 return <div ref={box} className="holo" style={{width:'100%',minHeight:300}} role="img" aria-label="Corpo humano holográfico 3D. Arraste para girar, use pinça para ampliar."/>}
