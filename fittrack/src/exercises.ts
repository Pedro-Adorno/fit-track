export type LibEx={name:string;group:string;sec:string;equip:string;instr:string;sets:number;reps:number;pose?:string;safety?:string;custom?:boolean}
export const GROUPS=['Peito','Costas','Ombros','Bíceps','Tríceps','Antebraço','Quadríceps','Posterior','Glúteos','Panturrilha','Abdômen','Corpo inteiro','Mobilidade']
export const SAFETY='Segurança: mantenha a coluna neutra, controle a descida, use uma carga que permita boa técnica e pare se sentir dor aguda. Em caso de lesão ou dúvida, siga seu profissional de saúde.'
const RAW=`Supino reto|Peito|Tríceps, Ombros|Barra|Deitado no banco, desça a barra até o peito e empurre até estender os cotovelos.|4|8
Supino inclinado|Peito|Ombros, Tríceps|Halteres|No banco inclinado, empurre os halteres para cima sem bater um no outro.|3|10
Crucifixo|Peito|Ombros|Halteres|Abra os braços com leve flexão dos cotovelos e feche contraindo o peitoral.|3|12
Flexão de braço|Peito|Tríceps, Ombros|Peso corporal|Corpo alinhado, desça o peito até perto do chão e empurre.|3|12
Puxada frontal|Costas|Bíceps|Polia|Puxe a barra até a altura do peito levando os cotovelos para baixo.|4|10
Remada curvada|Costas|Bíceps, Posterior|Barra|Tronco inclinado, puxe a barra em direção ao abdômen.|4|8
Remada baixa|Costas|Bíceps|Polia|Sentado, puxe o triângulo ao abdômen unindo as escápulas.|3|10
Barra fixa|Costas|Bíceps|Peso corporal|Pendurado, suba até o queixo passar da barra com controle.|3|6
Terra|Corpo inteiro|Costas, Glúteos, Posterior|Barra|Barra rente às pernas, estenda quadril e joelhos mantendo a coluna neutra.|3|5
Desenvolvimento|Ombros|Tríceps|Halteres|Empurre os halteres acima da cabeça sem arquear a lombar.|4|10
Elevação lateral|Ombros|—|Halteres|Eleve os braços até a altura dos ombros com leve flexão dos cotovelos.|3|12
Rosca direta|Bíceps|Antebraço|Barra|Cotovelos junto ao corpo, flexione e desça devagar.|3|10
Rosca martelo|Bíceps|Antebraço|Halteres|Pegada neutra, flexione os cotovelos alternando os braços.|3|12
Tríceps pulley|Tríceps|—|Polia|Cotovelos fixos ao lado do corpo, estenda os braços para baixo.|3|12
Tríceps testa|Tríceps|—|Barra W|Deitado, flexione apenas os cotovelos levando a barra à testa.|3|10
Agachamento livre|Quadríceps|Glúteos, Posterior|Barra|Pés na largura dos ombros, desça com a coluna neutra e suba empurrando o chão.|4|8
Leg press|Quadríceps|Glúteos|Máquina|Empurre a plataforma sem tirar o quadril do encosto.|4|10
Cadeira extensora|Quadríceps|—|Máquina|Estenda os joelhos contraindo o quadríceps e desça controlando.|3|12
Mesa flexora|Posterior|—|Máquina|Flexione os joelhos levando os calcanhares aos glúteos.|3|12
Stiff|Posterior|Glúteos, Costas|Barra|Joelhos levemente flexionados, leve o quadril para trás com a coluna neutra.|3|10
Afundo|Quadríceps|Glúteos|Halteres|Dê um passo à frente e desça até o joelho de trás quase tocar o chão.|3|10
Elevação pélvica|Glúteos|Posterior|Barra|Costas apoiadas no banco, eleve o quadril contraindo os glúteos.|4|10
Panturrilha em pé|Panturrilha|—|Máquina|Suba na ponta dos pés e desça alongando bem.|4|15
Abdominal crunch|Abdômen|—|Peso corporal|Eleve o tronco contraindo o abdômen, sem puxar o pescoço.|3|15
Elevação de pernas|Abdômen|—|Peso corporal|Deitado ou suspenso, eleve as pernas controlando a descida.|3|12
Prancha|Abdômen|Ombros|Peso corporal|Apoiado nos antebraços, mantenha o corpo alinhado (tempo em segundos).|3|30
Supino declinado|Peito|Tríceps, Ombros|Barra|No banco declinado, desça a barra até a parte baixa do peito e empurre.|3|10|bench
Crucifixo na polia|Peito|Ombros|Polia|Com cabos altos, una as mãos à frente do peito com leve flexão dos cotovelos.|3|12|bench
Peck deck|Peito|Ombros|Máquina|Sentado, una os braços à frente contraindo o peitoral e volte devagar.|3|12|bench
Supino na máquina|Peito|Tríceps|Máquina|Empurre as manoplas à frente sem tirar as costas do encosto.|3|10|bench
Pullover|Peito|Costas|Halteres|Deitado, leve o halter atrás da cabeça com os braços semi-estendidos e traga de volta.|3|12|bench
Remada unilateral|Costas|Bíceps|Halteres|Apoiado no banco, puxe o halter em direção ao quadril.|3|10|row
Remada cavalinho|Costas|Bíceps|Barra|Tronco inclinado, puxe a barra em direção ao abdômen com os cotovelos próximos.|3|10|row
Puxada supinada|Costas|Bíceps|Polia|Com as palmas voltadas para você, puxe a barra até o peito.|3|10|row
Pulldown braço reto|Costas|Tríceps|Polia|Braços quase estendidos, puxe a barra da altura da cabeça até as coxas.|3|12|row
Remada na máquina|Costas|Bíceps|Máquina|Peito apoiado, puxe as manoplas unindo as escápulas.|3|10|row
Encolhimento|Costas|Ombros|Halteres|Eleve os ombros em direção às orelhas e desça com controle.|3|12|press
Desenvolvimento militar|Ombros|Tríceps|Barra|Em pé, empurre a barra acima da cabeça mantendo o abdômen firme.|4|8|press
Elevação frontal|Ombros|—|Halteres|Eleve os halteres à frente até a altura dos ombros com controle.|3|12|press
Crucifixo inverso|Ombros|Costas|Halteres|Tronco inclinado, abra os braços contraindo a parte de trás dos ombros.|3|12|row
Face pull|Ombros|Costas|Polia|Puxe a corda em direção ao rosto abrindo os cotovelos.|3|15|row
Arnold press|Ombros|Tríceps|Halteres|Gire as palmas durante a subida dos halteres acima da cabeça.|3|10|press
Rosca concentrada|Bíceps|—|Halteres|Sentado, apoie o cotovelo na coxa e flexione o braço.|3|12|curl
Rosca scott|Bíceps|—|Barra W|Braços apoiados no banco scott, flexione e desça devagar.|3|10|curl
Rosca alternada|Bíceps|Antebraço|Halteres|Alterne os braços girando o punho durante a subida.|3|12|curl
Rosca na polia|Bíceps|—|Polia|Cotovelos junto ao corpo, flexione puxando o cabo.|3|12|curl
Tríceps francês|Tríceps|—|Halteres|Segure um halter atrás da cabeça e estenda os cotovelos.|3|10|curl
Tríceps corda|Tríceps|—|Polia|Estenda os braços abrindo a corda no final do movimento.|3|12|curl
Mergulho no banco|Tríceps|Ombros|Peso corporal|Mãos no banco atrás de você, desça flexionando os cotovelos e suba.|3|12|press
Supino fechado|Tríceps|Peito|Barra|Pegada estreita, desça a barra ao peito com os cotovelos próximos.|3|8|bench
Tríceps coice|Tríceps|—|Halteres|Tronco inclinado, estenda o cotovelo levando o halter para trás.|3|12|curl
Rosca de punho|Antebraço|—|Halteres|Antebraço apoiado, flexione o punho para cima e desça controlando.|3|15|curl
Rosca inversa|Antebraço|Bíceps|Barra|Pegada pronada, flexione os cotovelos mantendo os punhos neutros.|3|12|curl
Agachamento frontal|Quadríceps|Glúteos, Abdômen|Barra|Barra na frente dos ombros, desça com o tronco ereto.|3|8|squat
Agachamento búlgaro|Quadríceps|Glúteos|Halteres|Pé de trás apoiado no banco, desça controlando o joelho da frente.|3|10|squat
Hack machine|Quadríceps|Glúteos|Máquina|Costas apoiadas, desça flexionando os joelhos e empurre a plataforma.|3|10|squat
Agachamento goblet|Quadríceps|Glúteos|Halteres|Segure um halter junto ao peito e agache mantendo o tronco ereto.|3|12|squat
Avanço caminhando|Quadríceps|Glúteos|Halteres|Dê passos longos alternando as pernas e desça controlando o joelho.|3|12|squat
Cadeira flexora|Posterior|—|Máquina|Sentado, flexione os joelhos puxando o apoio para baixo.|3|12|hinge
Levantamento terra sumô|Posterior|Glúteos, Costas|Barra|Pés afastados e pegada estreita, estenda quadril e joelhos juntos.|3|6|hinge
Glúteo na polia|Glúteos|Posterior|Polia|Com a caneleira, estenda o quadril levando a perna para trás.|3|12|hinge
Abdução de quadril|Glúteos|—|Máquina|Sentado, abra as pernas contra a resistência e volte devagar.|3|15|squat
Agachamento sumô|Glúteos|Quadríceps|Halteres|Pés afastados e pontas para fora, desça com o tronco ereto.|3|12|squat
Ponte de glúteo|Glúteos|Posterior|Peso corporal|Deitado, eleve o quadril contraindo os glúteos e desça.|3|15|core
Panturrilha sentado|Panturrilha|—|Máquina|Sentado, suba os calcanhares e desça alongando.|4|15|squat
Panturrilha no leg press|Panturrilha|—|Máquina|Apoie a ponta dos pés na plataforma e empurre sem estender os joelhos.|4|15|squat
Abdominal na polia|Abdômen|—|Polia|Ajoelhado, flexione o tronco puxando o cabo em direção ao chão.|3|15|core
Russian twist|Abdômen|—|Peso corporal|Sentado com o tronco inclinado, gire para os lados.|3|20|core
Abdominal bicicleta|Abdômen|—|Peso corporal|Alterne cotovelo e joelho oposto em movimento controlado.|3|20|core
Prancha lateral|Abdômen|Ombros|Peso corporal|Apoiado de lado no antebraço, mantenha o corpo alinhado (segundos).|3|30|core
Burpee|Corpo inteiro|—|Peso corporal|Desça ao chão, volte e salte com os braços acima da cabeça.|3|10|squat
Kettlebell swing|Corpo inteiro|Glúteos, Posterior|Kettlebell|Empurre o quadril à frente para balançar o kettlebell até a altura do peito.|3|15|hinge
Farmer's walk|Corpo inteiro|Antebraço|Halteres|Caminhe segurando cargas pesadas com a postura ereta.|3|30|squat
Thruster|Corpo inteiro|Ombros, Quadríceps|Halteres|Agache e empurre os halteres acima da cabeça ao subir.|3|10|press
Mountain climber|Corpo inteiro|Abdômen|Peso corporal|Em posição de prancha, alterne os joelhos em direção ao peito.|3|30|core
Alongamento de posterior|Mobilidade|Posterior|Peso corporal|Estenda uma perna e incline o tronco até sentir alongar, sem dor.|2|30|hinge
Mobilidade de quadril 90/90|Mobilidade|Glúteos|Peso corporal|Sentado com as pernas a 90°, alterne a rotação do quadril.|2|10|core
Gato-camelo|Mobilidade|Costas|Peso corporal|Em quatro apoios, alterne arredondar e estender a coluna.|2|10|core
Alongamento de peitoral|Mobilidade|Ombros|Peso corporal|Apoie o antebraço na parede e gire o tronco para o lado oposto.|2|30|press
Rotação torácica|Mobilidade|Costas|Peso corporal|Em quatro apoios, leve uma mão à nuca e gire o tronco.|2|10|core`
export const LIB:LibEx[]=RAW.split('\n').map(l=>{const [name,group,sec,equip,instr,s,r,pose]=l.split('|');return{name,group,sec,equip,instr,sets:+s,reps:+r,...(pose?{pose}:{})}})
export const SAFE:Record<string,string>={Peito:'Segurança: use apoio ou ajudante em cargas altas e não deixe os ombros rolarem para frente.',Costas:'Segurança: mantenha a coluna neutra e evite puxar com impulso do tronco.',Ombros:'Segurança: não force acima da amplitude confortável e evite cargas que arqueiem a lombar.',Bíceps:'Segurança: evite balançar o tronco para ajudar a subir a carga.',Tríceps:'Segurança: mantenha os cotovelos estáveis e proteja o punho e o cotovelo.',Quadríceps:'Segurança: joelhos alinhados com os pés e coluna neutra; reduza a carga se o joelho incomodar.',Posterior:'Segurança: movimento vem do quadril, sem arredondar a lombar.',Glúteos:'Segurança: não hiperestenda a lombar no topo do movimento.','Corpo inteiro':'Segurança: aprenda a técnica com carga leve; costas neutras o tempo todo.',Panturrilha:'Segurança: suba e desça de forma controlada, sem ressalto.',Antebraço:'Segurança: use cargas leves e evite forçar os punhos além da amplitude confortável.',Mobilidade:'Segurança: alongue até sentir tensão leve, nunca dor, e respire sem prender o ar.',Abdômen:'Segurança: não puxe o pescoço e mantenha a lombar protegida.'}
