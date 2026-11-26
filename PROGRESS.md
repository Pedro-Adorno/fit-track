# FitTrack — progresso
## Auditoria
Stack: React 18 + TS + Vite + recharts + date-fns; dados em localStorage (`fittrack:v1`), sem backend. ~216 linhas, 3 telas concentram tudo (App/More/Extra).
Problemas: alert()/confirm() nativos; sem ícones (emoji 🏆/🔒); aba "Mais" mistura agenda/metas/insights/conquistas; treino sem rotinas (só exercício livre); onboarding sem edição posterior; sem treino compartilhado real (só importa divisão semanal); nav de 6 abas apertada em 320px.
## Feito (rodada 1)
- Design system base em styles.css (tokens, espaçamento, cards, botões, foco, reduced-motion)
- ui.tsx: Icon (SVG inline), Toast, Empty state
- Home.tsx: dashboard (treino de hoje, semana, sequência, treinos no mês, peso, metas)
- Nav: barra inferior (mobile) / sidebar (≥900px); alert() → toast
- Dados existentes preservados (storage.ts intocado no formato)
## Feito (rodada 2)
- Routines.tsx: rotinas (nome, exercícios com séries/reps/descanso), compartilhadas entre perfis; cada perfil registra suas próprias cargas; "Personalizar só para mim" cria cópia; "Sair" não afeta o outro
- Escolher exercício da rotina preenche o registro com a meta; db.routines é opcional (compatível com backups antigos)
- Excluir perfil remove-o das rotinas
## Feito (rodada 3)
- Compartilhar rotina entre dispositivos: Copiar código / Baixar arquivo (JSON `fittrack-routine` v1) e Importar por código ou arquivo; validação e limites; importação cria cópia independente (sem dados pessoais, sem cargas)
## Feito (rodada 4)
- Agenda semanal lista as rotinas do perfil; card Hoje mostra os exercícios da rotina planejada
- Emojis das conquistas trocados por ícones
## Feito (rodada 5)
- Avaliação inicial em 4 etapas com barra de progresso (role=progressbar), 'por que perguntamos' em cada campo, validação, campos novos (experiência, local, limitações; opcionais p/ compatibilidade)
- Editável depois em Perfil > Atualizar respostas (respostas pré-preenchidas, cancelar)
## Feito (rodada 6 - final desta sessão)
- Progress.tsx na aba Evolução: comparação de períodos (7/30/90 dias), consistência de 8 semanas vs meta, gráfico de medidas por parte do corpo
- Modal de confirmação (ask) em bottom sheet no mobile, Esc fecha; substitui confirm() em treinos, atividades, metas e limpar tudo
- Sintaxe de todos os arquivos verificada (transpile TS). Build/Vite/Playwright NÃO executados (sem rede)
## Feito (rodada 7)
- Todos os confirm() nativos trocados pelo modal (restaurar backup, excluir perfil, sair/excluir rotina)
- Tooltips (?) nos indicadores do dashboard (toque mostra a explicação)
- Card 'Hoje com quem treina junto' (perfis que dividem rotina com você e o plano deles para hoje)
## Feito (rodada 8)
- Aba Mais dividida em seções (Agenda / Metas / Conquistas) com controle segmentado acessível (role=tab)
- Texto do estado vazio de medidas corrigido
## Feito (rodada 9)
- Medidas e bem-estar movidos para a seção Medidas da aba Mais
## Falta
- Rodar `npm i && npm run build`, corrigir erros de tipo e testar no celular real (nada foi executado: sem rede; só sintaxe verificada)
- Playwright 320/375/390/430/768/1024/1440px e fluxos principais
- Revisão de contraste e tamanho de texto em tela real; benchmarking com pesquisa
