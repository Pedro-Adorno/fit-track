// Uso: node scripts/optimize-model.mjs <entrada.glb> <saida.glb> [razao=0.2]
// Mantém só pele + músculos, preserva os nomes dos nós, simplifica a malha e comprime com meshopt.
// Dependências (apenas para este script): npm i -D @gltf-transform/core @gltf-transform/extensions @gltf-transform/functions meshoptimizer
import {NodeIO} from '@gltf-transform/core'
import {ALL_EXTENSIONS} from '@gltf-transform/extensions'
import {weld,simplify,prune,dedup,quantize,meshopt} from '@gltf-transform/functions'
import {MeshoptDecoder,MeshoptEncoder,MeshoptSimplifier} from 'meshoptimizer'
const [,,inp,out,r='0.2']=process.argv
if(!inp||!out){console.error('Uso: node scripts/optimize-model.mjs entrada.glb saida.glb [razao]');process.exit(1)}
await Promise.all([MeshoptDecoder.ready,MeshoptEncoder.ready,MeshoptSimplifier.ready])
const io=new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({'meshopt.decoder':MeshoptDecoder,'meshopt.encoder':MeshoptEncoder})
const doc=await io.read(inp),DROP=new Set(['skeleton','organs','vessels','nerves']),kill=[]
for(const scene of doc.getRoot().listScenes())scene.traverse(n=>{if(DROP.has((n.getName()||'').toLowerCase()))n.traverse(c=>kill.push(c))})
kill.forEach(n=>n.dispose())
const tris=()=>doc.getRoot().listMeshes().reduce((t,m)=>t+m.listPrimitives().reduce((a,p)=>a+(p.getIndices()?.getCount()??0)/3,0),0)
console.log('triângulos após remover sistemas:',Math.round(tris()))
await doc.transform(weld(),simplify({simplifier:MeshoptSimplifier,ratio:+r,error:0.01,lockBorder:false}),prune(),dedup(),quantize(),meshopt({encoder:MeshoptEncoder,level:'high'}))
console.log('triângulos finais:',Math.round(tris()));await io.write(out,doc)
const names=[];doc.getRoot().listNodes().forEach(n=>{if(n.getMesh())names.push(n.getName())});console.log('malhas preservadas ('+names.length+'):',names.join(', '))
