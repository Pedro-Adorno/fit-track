# FitTrack 2.0 — progresso
## Auditoria (resumo)
Stack: React 18 + TS + Vite + recharts + date-fns. Dados em localStorage (`fittrack:v1`, v:1, por perfil). Sem backend. Código em src/: App, Home, Routines, SplitCard, Progress, More, Extra, ui, splits, storage.
Já existia: perfis, treino livre, atividades (tipo/km/min), peso, metas, medidas, bem-estar, agenda, backup JSON simples.
Problemas: backup sem versão/data; atividades limitadas; sem biblioteca de exercícios; sem grupo muscular; treino não registrava a sessão da divisão.
## Etapa 4 (parcial) — FEITO
- splits.ts: Full Body, ABC, ABCD, ABCDE, ABCDEF, Upper/Lower, PPL, PPL+UL e Personalizada
- nextSession(): próxima sessão pendente a partir do último treino/pulo, sem depender do dia da semana e sem pular letra ao faltar (testado em Node: A B B C A)
- SplitCard (aba Treinar): Treinar hoje, iniciar, trocar sessão, pular, descansar, repetir último, vincular rotina a cada sessão
- Workout ganhou `session` e `at` (opcionais, compatível); PData ganhou `split` e `rests`
- Home usa a recomendação da divisão
## Etapas 4-5 e 8 (parcial) — FEITO nesta rodada
- exercises.ts: 35 exercícios base (grupo principal, secundários, equipamento) e 14 grupos musculares; Library.tsx: busca/filtro, criar exercício próprio (PData.customEx), autocomplete no registro
- Analytics.tsx (aba Evolução): carga por exercício (máx., última, % evolução, gráfico), períodos 7d–todo histórico, séries/semana e frequência por grupo (dados reais; volume não é misturado entre exercícios), recordes de carga
- Backup v2: envelope {app,format,exportedAt,db} com data no nome do arquivo; importação aceita v2 e formato antigo, valida e bloqueia versões futuras; confirmação já existente antes de substituir
- Football.tsx (Mais > Futebol): partida com só a data obrigatória (tipo, resultado, gols, assist., min, local, posição, nota, obs.), estatísticas (total, gols, assist., média, V/E/D, aproveitamento 3-1-0), gráfico mensal, histórico com exclusão confirmada; PData.matches
- summary.ts + SummaryCard: resumo ao salvar treino (duração, exercícios, séries, volume, recordes de carga, comparação com a sessão anterior; lógica testada em Node)
- Prefs.tsx (Perfil): tema claro/escuro e escolha dos blocos da tela inicial (localStorage, só neste aparelho)
- Logo: public/logo-symbol.svg, logo-dark.svg, logo-light.svg (linha ascendente com ponto de destino); símbolo usado como favicon. Ainda não aplicada no cabeçalho do app
- Others.tsx (Mais > Futebol, abaixo das partidas): Corrida, Caminhada, Ciclismo, Natação, Basquete, Vôlei, Funcional e esportes personalizados com métricas próprias; ritmo (min/km) e velocidade (km/h) calculados; resumo por esporte
- Calendar.tsx (Evolução): calendário mensal com pontos por tipo (treino, futebol, outras, descanso) e detalhe do dia
- Report.tsx (Evolução): relatório mensal (treinos, séries/volume, dias ativos, futebol, outros esportes, peso) exportável em HTML imprimível/PDF
- BodyMap.tsx (Evolução): mapa corporal em SVG 2D (frente/costas, não é 3D nem Three.js) com 9 regiões clicáveis e teclado, intensidade por séries/semana das últimas 4 semanas, detalhe por região (séries, frequência, exercícios e cargas máximas); rotula altura/peso como informado/registrado e deixa explícito que a silhueta é ilustrativa
- Projection.tsx (Evolução): projeção de peso em 1/3/6/12 meses só a partir da tendência registrada (regressão linear, exige 4+ pesos em 3+ semanas, limite de 1 kg/semana), sempre rotulada como simulação
- Logo (símbolo) aplicada no cabeçalho
- Photos.tsx + photos.ts (Evolução): diário de evolução com fotos (reduzidas a 900px, guardadas em IndexedDB por perfil, privadas), sensação 1-5 e observação; exportar/importar fotos em arquivo separado `fittrack-fotos` (não entram no backup principal)
- Timer de descanso automático ao concluir série (usa o descanso da rotina; senão 90s), com vibração e aviso ao terminar
- Checagem de tipos com stubs das bibliotecas externas: sem erros reais nos tipos do projeto (build verdadeiro ainda pendente)
- MÓDULO CORPORAL HOLOGRAMA (decisão de design): Hologram.tsx (three.js + GLTFLoader, material holográfico com fresnel/scanlines, rotação 360°, zoom por pinça, vistas frente/lado/costas, carregado sob demanda), muscleMap.ts (reconhece músculos pelo nome das malhas do GLB, EN/PT), regions.ts (séries/semana, frequência, volume, comparação 4 semanas × 4 anteriores, evolução de carga, tudo dos registros), Body3DPanel.tsx (seletor Corpo 3D | Análise muscular, legenda de intensidade, 10 regiões, projeções 1/3/6/12 meses como simulação rotulada, origem dos dados)
- Substituiu o mapa 2D e as formas geométricas anteriores (BodyMap.tsx, Body3D.tsx e Projection.tsx removidos)
- Personalização: altura informada ajusta proporção vertical; peso registrado/simulado ajusta largura via IMC (-10%/+12%), sempre rotulado como aproximação
- (superado pela seção Open Anatomy abaixo) NÃO existe GLB no pacote. Sem rede aqui não foi possível baixar/validar um modelo anatômico com músculos separados. Sem `public/models/body.glb` o app mostra aviso (não desenha substituto); requisitos em public/models/README.md
- NADA do 3D foi executado (three não instalado aqui): precisa de `npm i`, GLB real, ajuste de nomes em muscleMap.ts e teste em iPhone 11/15/15 Pro
- Rodada de ajustes (nomes + responsividade + UX/UI):
  - muscleMap.ts: palavras-chave ampliadas (nomes anatômicos em inglês/latim/português) e AJUSTE MANUAL: no modo Análise, malhas sem região aparecem num bloco "Ajustar nomes dos músculos do modelo" e podem ser associadas a um músculo (salvo em localStorage `ft-muscle-map`, aplicado na hora)
  - Hologram: altura do canvas responsiva (300–480px, até 72% da altura da tela), movimento reduzido respeitado (sem animação de varredura)
  - Painel: regiões e vistas em faixa rolável com alvos de toque de 44px, esqueleto de carregamento, rolagem automática ao detalhe ao tocar num músculo
  - CSS: breakpoints 320/360, tablet 600–899, paisagem baixa, hover só em dispositivos com mouse; viewport-fit=cover e theme-color
  - Não testado em dispositivos (sem rede/navegador aqui)
- OPEN ANATOMY 3D (investigação + integração parcial):
  - Verificado no README do repositório: 2 GLB (≈7,6 e 8,1 MB, ~1M triângulos, meshopt), 147 estruturas, cada uma um nó nomeado pela chave do catálogo e agrupado por nó de sistema (skin, skeleton, muscles, organs, vessels, nerves); Y-up, metros; código MIT; modelos CC BY 4.0 (BodyParts3D, HuBMAP HRA, MakeHuman CC0); créditos obrigatórios
  - Integrado: GLTFLoader com MeshoptDecoder; só pele (casca holográfica) e músculos são exibidos, demais sistemas ocultos; seletor masculino/feminino (body-male.glb / body-female.glb); créditos CC BY no rodapé do módulo e em public/models/README.md
  - scripts/optimize-model.mjs: remove sistemas não usados, preserva nomes, simplifica (~150k tri) e comprime com meshopt; imprime triângulos e nomes de malha
  - NÃO FEITO/VERIFICADO (sem rede e sem os GLB aqui): download e otimização reais, tamanho final (meta ≤5 MB), lista real de nomes dos músculos (muscleMap.ts usa palavras-chave anatômicas; ajuste manual disponível no app), desempenho no iPhone 11, testes de render/seleção/responsividade. Viewer React do projeto (@react-three/fiber/drei) NÃO foi usado: o FitTrack usa three puro para manter o app leve e o material holográfico próprio
  - Alternativa MyoZen (CC BY-SA 4.0): não avaliada; só considerar se o Open Anatomy falhar (CC BY-SA exige compartilhar adaptações sob a mesma licença)
## PENDENTE (ordem sugerida)
1. Rodar `npm i && npm run build`, corrigir tipos, testar no celular (NADA foi executado: sem rede)
2. Execução do treino: lista de séries planejadas com marcação de concluída e botão de trocar exercício (hoje troca-se pelo campo de nome; timer e resumo já feitos)
3. Instruções/descrição dos exercícios, recordes de volume/reps/sequência, comparação entre períodos por grupo
4. Incluir fotos no backup único (hoje são arquivo separado)
7. Aplicar a logo no cabeçalho unidades de medida (kg/lb, cm/pol), gráficos com cores do tema claro
8. Obter GLB anatômico (músculos separados, licença ok, <5 MB), ajustar muscleMap.ts, validar visual/performance no iPhone; projeção usando medidas/% gordura quando houver
9. Playwright 320–1440px, relatório com gráficos/metas/recordes
