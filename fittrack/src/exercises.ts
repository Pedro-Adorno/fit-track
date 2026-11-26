export const GROUPS=['Peito','Costas','Ombros','Bíceps','Tríceps','Antebraço','Quadríceps','Posterior de coxa','Glúteos','Panturrilhas','Adutores','Abdutores','Abdômen','Lombar'] as const
export type Ex={name:string;group:string;sec:string[];equip:string}
const R=`Supino reto|Peito|Tríceps,Ombros|Barra
Supino inclinado|Peito|Ombros,Tríceps|Barra
Supino com halteres|Peito|Tríceps,Ombros|Halteres
Crucifixo|Peito|Ombros|Halteres
Crossover|Peito||Polia
Flexão de braço|Peito|Tríceps,Ombros|Peso corporal
Puxada frontal|Costas|Bíceps|Polia
Barra fixa|Costas|Bíceps|Peso corporal
Remada curvada|Costas|Bíceps,Lombar|Barra
Remada baixa|Costas|Bíceps|Polia
Remada unilateral|Costas|Bíceps|Halteres
Desenvolvimento|Ombros|Tríceps|Halteres
Elevação lateral|Ombros||Halteres
Elevação frontal|Ombros||Halteres
Crucifixo inverso|Ombros|Costas|Halteres
Rosca direta|Bíceps|Antebraço|Barra
Rosca alternada|Bíceps|Antebraço|Halteres
Rosca martelo|Bíceps|Antebraço|Halteres
Tríceps pulley|Tríceps||Polia
Tríceps testa|Tríceps||Barra
Tríceps francês|Tríceps||Halteres
Rosca de punho|Antebraço||Barra
Agachamento|Quadríceps|Glúteos,Posterior de coxa|Barra
Leg press|Quadríceps|Glúteos|Máquina
Cadeira extensora|Quadríceps||Máquina
Afundo|Quadríceps|Glúteos|Halteres
Mesa flexora|Posterior de coxa||Máquina
Stiff|Posterior de coxa|Glúteos,Lombar|Barra
Elevação pélvica|Glúteos|Posterior de coxa|Barra
Panturrilha em pé|Panturrilhas||Máquina
Panturrilha sentado|Panturrilhas||Máquina
Cadeira adutora|Adutores||Máquina
Cadeira abdutora|Abdutores|Glúteos|Máquina
Abdominal|Abdômen||Peso corporal
Prancha|Abdômen|Lombar|Peso corporal
Elevação de pernas|Abdômen||Peso corporal
Extensão lombar|Lombar|Glúteos|Banco`
export const BASE:Ex[]=R.split('\n').map(l=>{const [name,group,s,equip]=l.split('|');return{name,group,sec:s?s.split(','):[],equip}})
export const norm=(s:string)=>s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim()
export const allEx=(custom:Ex[]=[])=>[...custom,...BASE]
export const find=(name:string,custom:Ex[]=[])=>allEx(custom).find(e=>norm(e.name)===norm(name))
