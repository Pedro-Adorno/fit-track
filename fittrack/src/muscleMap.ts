// Regiões analisadas (ordem de exibição) e palavras-chave para reconhecer músculos pelo NOME das malhas do GLB.
export const REGIONS=['Peito','Costas','Ombros','Bíceps','Tríceps','Abdômen','Quadríceps','Posterior de coxa','Glúteos','Panturrilhas']
// A ordem importa: 'biceps_femoris' (posterior de coxa) precisa ser testado antes de 'biceps'.
const KEYS:Record<string,string[]>={'Posterior de coxa':['biceps_femoris','bicepsfemoris','hamstring','semitendinosus','semimembranosus','semitend','semimemb','hams','posterior_coxa'],
 'Quadríceps':['quadriceps','quadricep','quadr','rectus_femoris','rectusfemoris','vastus','coxa_anterior'],'Glúteos':['gluteus','glute','gluteo','butt'],
 Panturrilhas:['gastrocnemius','gastroc','soleus','calf','panturrilha'],Peito:['pectoralis','pectoral','pec_','chest','peito'],
 Ombros:['deltoid','deltoideus','delt_','shoulder','ombro'],'Tríceps':['triceps','tricep'],'Bíceps':['biceps_brachii','bicepsbrachii','biceps','bicep','brachialis'],
 Costas:['latissimus','lats_','trapezius','trapez','trap_','infraspinatus','teres','rhomboid','erector','spinae','dorsal','costas','back_'],
 'Abdômen':['rectus_abdominis','abdominis','abdom','oblique','obliq','abs_','six_pack']}
const OV='ft-muscle-map'
export const getOverrides=():Record<string,string>=>{try{return JSON.parse(localStorage.getItem(OV)||'{}')}catch{return{}}}
export const setOverride=(mesh:string,region:string)=>{const o=getOverrides();if(region)o[mesh]=region;else delete o[mesh];try{localStorage.setItem(OV,JSON.stringify(o))}catch{}}
// mesh = nome da malha (chave do ajuste manual); ctx = nome + pai, usado no reconhecimento automático.
export const matchRegion=(ctx:string,mesh=ctx)=>{const ov=getOverrides()[mesh];if(ov&&REGIONS.includes(ov))return ov
 const n=ctx.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[\s.\-:]+/g,'_')+'_'
 for(const r of Object.keys(KEYS))if(KEYS[r].some(k=>n.includes(k)))return r;return ''}
