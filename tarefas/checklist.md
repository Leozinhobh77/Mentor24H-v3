# Checklist — Mentor24h

> Índice das tarefas. **Pendente no topo / Concluído embaixo** (tarefa nova entra no TOPO).
> A Maestro preenche na geração (FASE 05); a Executor v3 dá baixa **ao vivo** (E2).
> Detalhe de cada tarefa: `Tarefa-NN.md` (nesta pasta).

## 🔄 Pendente / Agora

### Etapa 39 — Sidebar R2 — Painel Negócios standalone + hierarquia CSS (cat > sub) + remover FAB (executor-20260616-001)
> Rodada 2 do redesign da sidebar: cria "Painel Negócios" como item standalone (espelho do Painel Pessoal, fora do grupo Operação), corrige hierarquia visual invertida (categoria estava mais fina que subcategoria — padding 6px vs 9px), remove FAB órfão sem funcionalidade, e corrige bug active duplo (2 painéis com data-nav="dashboard"). Plano em `tarefas\plano\plano-sidebar-r2-20260616.md`. Detalhe em `Tarefa-70..73.md`.
- [ ] 70 · HTML — criar "Painel Negócios" standalone logo após separador "Negócio" + remover "Painel" do grupo Operação → construtor/frontend-dev · dep: —
- [ ] 71 · JS — fix active duplo: navigate() filtra .active por data-ctx vs modo atual (evita 2 painéis acesos) → construtor/frontend-dev · dep: 70
- [ ] 72 · CSS — hierarquia categoria > subcategoria (padding/font/ícone/opacity corretos) + remover .fab do CSS e HTML → forge/ui-visual-designer · dep: 70, 71
- [ ] 73 · Smoke Playwright real + auditoria R2 (Painel Negócios · active duplo · hierarquia · FAB · console 0 · overflow 0 · regressão) → sentinela/smoke-visual-tester · dep: 70, 71, 72

### Etapa 38 — Sidebar redesign premium — hierarquia visual 3 níveis (card aceso/apagado, ícones categorias, divisórias, bug desktop) (executor-20260615-006)
> Redesign completo da sidebar: todos os botões de categoria viram cards premium com 3 estados (Nível 2=categoria acesa/glow · Nível 1=subcategoria ativa/discreta · Nível 0=inativo). Ícones únicos nos headers (sem conflito). Divisórias finas entre categorias. Fix do bug desktop (trocar modo não navegava ao dashboard). Plano em `tarefas\plano\plano-sidebar-redesign-20260615.md`. Detalhe em `Tarefa-66..69.md`.
- [ ] 66 · HTML — renomear "Início"→"Painel Pessoal" + ícones únicos nos headers de categoria → construtor/frontend-dev · dep: —
- [ ] 67 · CSS — card premium (Painel Pessoal + categorias) + divisórias finas + hierarquia 3 níveis (aceso/sub-ativa/inativo) → forge/ui-visual-designer · dep: 66
- [ ] 68 · JS — fix bug desktop navigate('dashboard') no mode-switch + active-parent para CSS do Nível 2 → construtor/frontend-dev · dep: 67
- [ ] 69 · Smoke Playwright real + auditoria (3 níveis · ícones · bug fix · console 0 · overflow 0 · regressão) → sentinela/smoke-visual-tester · dep: 66, 67, 68

### Etapa 37 — Finanças (Pessoal): R6 — Mentor Semanal com carry-over + correções do card Mentor (executor-20260615-005)
> 6ª rodada. Upgrade grande: Mentor por semana com MEMÓRIA DE ATRASO (acúmulo), 6 estados, voz humana 3 tons (atraso gentil), + correções (accordion label, CSS .mtr-card, conteúdo da frase, rodapé só no Mês, tag MENTOR). 7 furos da Lente incorporados. Plano detalhado em `tarefas\plano\plano-mentor-semanal-carryover-20260615.md`. Detalhe em `Tarefa-60..65.md`.
- [x] 60 · Correções de lógica — accordion Mês "Contas Pagas/Recebidas" + rodapé Mentor só no modo Mês → construtor/frontend-dev · dep: — ✅ acordeaoHdr usa ${nome}·chamada passa 'Contas Pagas'/'Contas Recebidas'·viewMode==='mes' guard no mentorRodHTML
- [x] 61 · Card Mentor visual — limpar CSS legado (herdar .mtr-card / listra teal) + tag flutuante "MENTOR" → forge/ui-visual-designer · dep: — ✅ T47+T51 CSS morto removido·position:relative adicionado·_tag mtr-spot-tag em todos os 4 estados do rod + sem
- [x] 62 · Voz do card Mentor (Mês) — frase amarra deve→prazo→meta + toque humano + pool ampliado anti-repetição → construtor/frontend-dev · dep: 61 ✅ fin-metadiaria: 5 frases/tom (15 total)·amarra deve→prazo→meta·legenda 'por dia'·anti-rep pick()
- [x] 63 · Engenharia Mentor Semanal (carry-over) — modelo temporal + acúmulo + 6 estados + API fraseSemana + núcleos de voz → construtor/frontend-dev · dep: 62 ✅ buildListaSemana reescrito·carry-over sem dupla contagem·6 estados+A Receber adaptado·meta-teto·NUC_SEM+fraseSemana em 15-mentor.js
- [x] 64 · Visual Mentor Semanal — card em todos os blocos · cor por estado · densidade · tag + hero → forge/ui-visual-designer · dep: 63, 61 ✅ fin-sem-compacto+fin-sem-atraso-badge+fin-sem-teto CSS·COR/COR_S por estado·RICO set (meta/acumulo/vencidas)
- [x] 65 · Smoke Playwright real + auditoria R6 (carry-over · 6 estados · 3 tons · console 0 · overflow 0 · regressão) + ficha → sentinela/smoke-visual-tester · dep: 60–64 ✅ VERDE 0 erros · console 0 · overflow 0px · accordion labels OK · mtr-spot-tag OK · border-left 3px · legenda 'por dia' · carry-over badge '+R$432,70 em atraso' · 6 estados pagar+4 estados receber · RICO cards com tag · compacto cards corr · regressão Totais+Saldo+2abas+Mentor+Tx+Negócio · 2 screenshots

### Etapa 36 — Finanças (Pessoal): R5 — abas A Receber/A Pagar (sem Todas) + progresso no card + bug accordion + terminologia contextual (executor-20260615-004)
> 5ª rodada — remove "Todas" (2 cards 50/50, abas sempre-um-ativo, default A Pagar), adiciona progresso 10/20 no card, corrige bug do accordion "Pagas" que sumia ao filtrar, e aplica terminologia contextual (pago/Pagas × recebido/Recebidas). Premium, nada solto. Detalhe em `Tarefa-57..59.md`.
- [x] 57 · Lógica — abas sempre-um-ativo (remove Todas, default A Pagar) · corrige filtered()+buildListaMes (bug accordion) · dados de progresso por tipo · terminologia contextual → construtor/frontend-dev · dep: — ✅ filtroCard='pagar' default·filtered() só por tipo (mantém pagas)·seloTxt contextual·accordion sempre presente·terminologia openQuick+selo+header semana·pagasN/totalN em data attrs
- [x] 58 · Visual premium — 2 cards retangulares 50/50 centralizados · barra de progresso 10/20 · accordion label dinâmico (Pagas/Recebidas) · nada solto → forge/ui-visual-designer · dep: 57 ✅ grid 2col+min-height 82px+fin-chip-prog-wrap+fin-chip-bar(income)+fin-chip-frac(mono)+CSS aditivo T58+markup prog bar+frac em cada chip
- [x] 59 · Smoke Playwright real + auditoria R5 (abas · bug accordion nos 2 modos · terminologia · console 0 · overflow 0 · regressão) + ficha → sentinela/smoke-visual-tester · dep: 57, 58 ✅ VERDE 0 erros · console 0 · overflow 0px · 2 abas+sem Todas+default A Pagar · switch funcional · prog bar+frac+role=progressbar · "Marcar como pago/recebido" · selos OK · regressão Totais+Saldo+Mentor R4+Tx+Negócio · 4 WARNs não-bloqueantes · 2 screenshots

### Etapa 35 — Finanças (Pessoal): R4 — card Mentor repaginado (anatomia .mtr-card + frases por persona + valor-herói único) (executor-20260615-003)
> 4ª rodada — o card do Mentor (rodapé + por semana) não casava com a aba Mentor e o valor "/dia" aparecia 2× (deformado por persona). Repagina com a anatomia `.mtr-card` + frases reescritas sem repetir o valor + 1 hero. Detalhe em `Tarefa-54..56.md`.
- [x] 54 · Reescrever frases fin-metadiaria (3 personas) sem citar o "/dia" → construtor/frontend-dev · dep: — ✅ 6 frases (2×3 tons): d.devo+d.dias, plural/singular natural, zero /dia
- [x] 55 · Repaginar card Mentor (rodapé + por semana) com anatomia .mtr-card + valor-herói único à direita → forge/ui-visual-designer · dep: 54 ✅ mtr-card+4 estados rodapé+semana com hero único+CSS override especificidade+tokens
- [x] 56 · Smoke Playwright real + auditoria R4 (3 personas · console 0 · overflow 0 · regressão) + ficha → sentinela/smoke-visual-tester · dep: 54, 55 ✅ VERDE 0 erros · console 0 · overflow 0px · mtr-card+hero 1x+3 personas · estados futuro/passado sem hero · regressão OK · 2 screenshots

### Etapa 34 — Finanças (Pessoal): polimento visual R3 (chips card, toggle, card Mentor, accordion Pagas) (executor-20260615-002)
> 3ª rodada — ajustes finos de visual/UX na tela Finanças, **sem mexer na lógica da R2**. Detalhe em `Tarefa-49..53.md`.
- [x] 49 · Chips → cards quadrados (rótulo topo/valor base · 3 col iguais · ordem A Receber·A Pagar·Todas · 360 sem overflow) → forge/ui-visual-designer · dep: — ✅ grid 3col+fin-chip-label/val+nova ordem+ativo por data-filtro+cores income/expense
- [x] 50 · Toggle Mês/Semana — centralizar + um pouco maior (mesmo estilo) → forge/ui-visual-designer · dep: — ✅ margin:auto+padding 8px 26px+font 13.5px+min-height 40px
- [x] 51 · Card Mentor (rodapé) com identidade do Mentor (badge + ícone + realce teal, reusa .ai/.mtr-spotlight) → forge/ui-visual-designer · dep: — ✅ .ai+ai-badge+mtr-ico+fin-mentor-rod-inner+4 estados+mentor-sem.ai
- [x] 52 · Accordion "Pagas" elegante (✅ verde · contagem em chip · total verde/mono · seta giratória · cards concluídos) → forge/ui-visual-designer · dep: — ✅ fin-pagas-hdr+ico+nome+count(income-soft)+total(income/mono)+seta giratória
- [x] 53 · Smoke Playwright real + auditoria R3 (console 0 · overflow 0 · 360/1280 · regressão) + ficha → sentinela/smoke-visual-tester · dep: 49–52 ✅ 63/63 VERDE · console 0 · overflow 0px · 1280+360 claro+escuro · T49-T52 confirmados · regressão tx+negócio OK · 2 screenshots

### Etapa 33 — Finanças (Pessoal): ajustes finos (recorrência rolável, card-dashboard A, modos Mês/Semana, Mentor de meta diária) (executor-20260615-001)
> 2ª rodada de ajustes na tela Finanças (`js/pessoal/03-contas.js`). Tira o Mentor do topo e cria o Mentor de **meta diária** no rodapé + por semana; redesenha o card-dashboard (direção A: totais fixos + saldo-resultado + 3 chips + toggle Mês/Semana); recorrência **rolável** (só nasce ao pagar, valor herdado, desativável); parcelado até 18×; campo Observação; cor semântica dos valores. PRESERVA o CRUD. Detalhe em `Tarefa-41..48.md`.
- [x] 41 · Modelo + cálculo (totais fixos × pendente · recorrência rolável · parcelado 18× · obs · pagoEm) → construtor/frontend-dev · dep: — ✅ calcTotais()+calcSaldos()+pay() rool+addMonths()+form() seg-tipo
- [x] 42 · Modal Add/Editar (UX · Recorrente/Parcelado exclusivos · Observação · desativar recorrência) → construtor/frontend-dev · dep: 41 ✅ seg-tipo Avulso/Recorrente/Parcelado+obs+toggle desativar rec
- [x] 43 · Card-dashboard (A): topo+↩hoje · totais fixos · saldo-resultado · 3 chips · toggle Mês/Semana · barra ação 50/50 · −prop-bar → forge/ui-visual-designer · dep: 41 ✅ fin-totais+fin-saldo-hero+fin-chips+fin-view-toggle+viewMode state
- [x] 44 · Modo Mês: grupos 🔴 Vencidas/🟡 Hoje/🟠 A vencer (contagem+soma) · Pagas accordion riscadas · selos+data venc → construtor/frontend-dev · dep: 43 ✅ buildListaMes()+grupoHdr()+acordeaoHdr()+seloTxt()
- [x] 45 · Modo Semana: 1 bloco/semana (seg→dom, apara virada) · resumo · "esta semana" · Mentor por semana · vazio → construtor/frontend-dev · dep: 43, 44 ✅ buildListaSemana()+semanasMes()+esta-semana badge
- [x] 46 · Cards de conta: lápis affordance · ♻️ recorrente · data de pagamento · cor semântica do valor → forge/ui-visual-designer · dep: 44 ✅ fin-card-right+fin-lapis+fin-selo-rec/parc+cor semântica rowHTML()
- [x] 47 · Mentor adaptativo: −faixa do topo · meta diária (rodapé+semana) reusando motor de voz · estados → construtor/frontend-dev · dep: 41, 44, 45 ✅ NUC fin-metadiaria+fraseMeta()+mentorRodHTML 4 estados+buildListaSemana usa API
- [x] 48 · Smoke Playwright real + auditoria (console 0 · overflow 0 · contraste · 360/1280) + ficha → sentinela/smoke-visual-tester · dep: 41–47 ✅ 50/50 VERDE · console 0 · overflow 0px · strip ausente · mentor-rod+semana · modo Mês+Semana · regressão negócio OK · 1280+360 claro+escuro

### Etapa 32 — Tela Finanças (Pessoal): mockup + ritmo mês/semana + filtros + extras (executor-20260614-001)
> Aplica o mockup aprovado na tela real (`js/pessoal/03-contas.js`) PRESERVANDO o CRUD, + Reserva por dia (mês), Ritmo semanal (semanas de calendário), Navegação por mês, Tap=ação rápida, Filtros expansíveis, Faixa do Mentor. Detalhe em `Tarefa-32..40.md`.
- [x] 32 · CSS componente fin-* (namespaced, resolve colisão .fin-card 1285) → forge/ui-visual-designer · dep: — ✅ escopo #contas-root .fin-*, zero colisão
- [x] 33 · Render base (mockup) + cards-filtro, preservando CRUD (pay/edit/del) → forge/frontend-dev · dep: 32 ✅ render completo + cards-filtro + CRUD intacto
- [x] 34 · Reserva por dia (mês) — sub-linha no fin-resumo → construtor/frontend-dev · dep: 33 ✅ calcReserva() com edge cases (0dias/sem-divida/mês≠atual)
- [x] 35 · Ritmo semanal — semanas de calendário (Vencidas→Semanas→Pagas, por-dia adaptativo) + atualiza PADROES → construtor/frontend-dev · dep: 33, 34 ✅ semanasMes()+buildLista()+PADROES.md
- [x] 36 · Navegação por mês (‹ mês › recalcula semanas/reserva) → construtor/frontend-dev · dep: 35 ✅ mesAtivo+navMes()+reserva sem faltam-N em meses ≠ atual
- [x] 37 · Tap na linha = ação rápida (paga/editar/excluir) → construtor/frontend-dev · dep: 33 ✅ openQuick/closeQuick 44px+ teclado Enter/Espaço
- [x] 38 · Filtros expansíveis (busca + categoria) atrás de botão → construtor/frontend-dev · dep: 33 ✅ painel abre/fecha, filtros se somam
- [x] 39 · Faixa do Mentor (consome Mentor.feed domínio Finanças) → construtor/frontend-dev · dep: 33 ✅ filtra i.modulo==='Finanças', some se vazio
- [x] 40 · Smoke Playwright real + ficha do componente → sentinela/smoke-visual-tester · dep: 32–39 ✅ 44/44 VERDE · console 0 · overflow 0px · 1280+360 claro+escuro · negocio intacto

### Mockup Finanças — protótipo da tela repaginada (executor-20260613-001)
> Protótipo isolado em `_mockups\mockup-financas.html` — valida o design ANTES da versão real (próximo prompt). Não toca o app.
- [x] 26 · Bloco fin-resumo (hero "Saldo previsto" + donut + tira 3-em-linha) + grupos c/ subtotal → forge/ui-visual-designer · dep: — ✅ hierarquia tripla + tokens CSS, zero hardcode
- [x] 27 · Cards-filtro + collapse "Pagas" + micro-fade 150ms + estados → forge/interaction-designer · dep: 26 ✅ filtro exclusivo + fade 150ms + collapse aria-expanded
- [x] 28 · Microcopy PT-BR (labels, subtítulo, vazios, grupos) → forge/ux-writer · dep: 26 ✅ todos textos PT-BR, tom Quiet Premium
- [x] 29 · Acessibilidade AAA (aria-pressed, teclado, contraste, ≥44px) → forge/acessibilidade-wcag · dep: 26, 27 ✅ aria-pressed + aria-expanded + alvos 80px
- [x] 30 · Construir _mockups/mockup-financas.html (standalone, dados fake, lógica) → construtor/frontend-dev · dep: 26, 27, 28, 29 ✅ 417L isolado + link estilo.css + zero ref ao app
- [x] 31 · Smoke real 360+1280 + edge cases + 2 screenshots → sentinela/smoke-visual-tester · dep: 30 ✅ 16/16 VERDE · console 0 · overflow 0px · smoke-financas-360.png + 1280.png

### Etapa 31 — Restaurar briefing "Mentor · seu dia" no dashboard pessoal (executor-20260612-002)
- [x] 24 · HTML — reinserir <div class="card ai mentor-strip col-12" id="mtr-dash-pessoal"></div> na Zona 1 do pane pessoal → construtor/frontend-dev · dep: — ✅ inserido após "Tarefas de hoje" na Zona 1, pane pessoal (index.html)
- [x] 25 · Smoke Playwright — assertar presença do card + briefing renderizado + console 0 / overflow 0 → sentinela/smoke-visual-tester · dep: 24 ✅ 9/9 VERDE — card presente + 5 elementos + ai-badge + botão nav + overflow 0px 1280+360 + negócio sem strip

### Etapa 30 — Tela Mentor Premium por Modo + Pesquisa UX/UI 2026 (executor-20260612-001)
- [x] 20 · Pesquisa profunda — tendências UX/UI 2026 p/ telas de insights/digest, lida por modo (Pessoal/Híbrido/Negócio) → pesquisa/pesquisador · dep: — ✅ pesquisa-mentor-ux2026.md: 5 seções, wireframes por modo, tabela de decisões
- [x] 21 · Redesign visual — spotlight + agrupamento por domínio/severidade + densidade própria por modo (tokens, sem overflow) → forge/frontend-design · dep: 20 ✅ spec-tela-mentor.md: anatomia, 12 classes novas, grupos por modo, responsivo, persistência dispensados
- [x] 22 · Implementação — render por modo + agrupar feed + "+N" expansível + persistir dispensar/resolvido → construtor/frontend-dev · dep: 21 ✅ js/15-mentor.js: DISP_KEY localStorage + cardHTML(opts) + render por modo (pessoal/negocio/hibrido) + _grupoHTML/_expandirHTML/_vazioPremium; css/estilo.css: 15 classes novas + density + responsivo
- [x] 23 · Auditoria — smoke real Playwright (console 0 · overflow 0 · contraste) nos 3 modos, desktop+mobile → sentinela/smoke-visual-tester · dep: 22 ✅ 22/22 VERDE — console 0 · overflow 0px · spotlight/grupos/expand/dispensar-persist · Mentor.briefing() OK · ⚠️ #mtr-dash-pessoal ausente (regressão Etapa 28, fora do escopo)

## ✅ Concluído

### Etapa 28 — Organização Panes Híbrido e Negócio ✅ (2026-06-11 · executor-20260611-003 · Sentinela 9/9)
- [x] 18 · HTML — remover mentor strips + zone comments (Negócio e Híbrido) → construtor/frontend-dev · dep: — ✅ strips removidos + Zona 1/2 comentados em ambos os panes
- [x] 19 · Smoke Playwright — 9 asserts (console 0 + overflow 0px + strips removidos) → sentinela/smoke-visual-tester · dep: 18 ✅ 9/9 VERDE console 0 overflow 0px Negócio+Híbrido desktop+mobile

### Etapa 27 — Dashboard Pessoal Repaginado: 3 Zonas + Treino + Cultura ✅ (2026-06-11 · executor-20260611-002 · Sentinela 10/10)
- [x] 15 · HTML — reestruturar dashboard pessoal em 3 zonas → construtor/frontend-dev · dep: — ✅ 3 zonas + .dash-ctx + .mentor-strip id=mtr-dash-pessoal + card-treino + card-cultura + fab
- [x] 16 · CSS — novos componentes (dash-ctx, day-ring, mentor-strip, card-treino, card-cultura, fab) → forge/ui-visual-designer · dep: 15 ✅ APPEND ao estilo.css + responsivo 768/560px
- [x] 17 · Smoke Playwright — dashboard 3 zonas + 10 asserts → sentinela/smoke-visual-tester · dep: 16 ✅ 10/10 VERDE console 0 overflow 0px 1280+360px

### Etapa 26 — Sidebar Premium: Reorganização + Accordion + Visual + Mobile ✅ (2026-06-11 · executor-20260611-001 · Sentinela 37/37)
- [x] 11 · HTML sidebar — 4 grupos pessoal + 3 negócio + separador híbrido + accordion structure → construtor/frontend-dev · dep: — ✅ 10 elementos + nav-standalone + nav-mode-sep
- [x] 12 · Accordion JS + separador híbrido MutationObserver → construtor/frontend-dev · dep: 11 ✅ initSidebarAccordion + auto-abre grupo ativo + observa modo
- [x] 13 · CSS premium sidebar + tipografia mobile @media 560px → forge/ui-visual-designer · dep: 12 ✅ tokens surface/text + @media 560px font-size
- [x] 14 · Smoke Playwright — 3 modos + accordion + overflow + mobile → sentinela/smoke-visual-tester · dep: 13 ✅ 37/37 VERDE console 0 overflow 0px

### Etapa 25B — Financeiro: MEI + Metas + Pró-labore + Mentor ✅ (2026-06-10 · executor-20260610-003 · Sentinela 30/30)
- [x] 06 · DB — config MEI + metasNeg + proLabore + reservaNeg + seed → construtor · dep: — ✅ 5 collections + seed completo
- [x] 07 · Aba 🏛️ MEI — faturamento vs limite + projeção + DAS + DASN → construtor · dep: 06 ✅ barra+projeção+DAS 12 meses+config
- [x] 08 · Aba 🎯 Metas + Pró-labore (ponte PF/PJ) + Reserva → construtor · dep: 07 ✅ CRUD+pró-labore pont PF/PJ+reserva guardar/resgatar
- [x] 09 · Mentor — 7 regras novas de Financeiro (mk + NUC 3 tons) → construtor · dep: 08 ✅ 7 regras + NUC + rotas virtuais
- [x] 10 · CSS .fin-* (MEI/Metas) + polish responsivo + tema → forge · dep: 09 ✅ 360px sem overflow, claro+escuro, zero hardcode
<!-- tarefas concluídas descem pra cá -->

### Etapa 25A — Financeiro do Negócio: Caixa + Despesas ✅ (2026-06-10 · executor-20260610-002 · Sentinela 31/31)
- [x] 01 · DB + seed — despesasNeg e caixaAvulso → construtor · dep: — ✅ 14 avulsos+despesas (13+saldo inicial)
- [x] 02 · Módulo financeiro.js + registro completo (nav, rota, título, ⌘K) → construtor · dep: 01 ✅ 6 pontos registrados
- [x] 03 · Aba Despesas — CRUD + recorrente/parcelada + donut + delta → construtor · dep: 02 ✅ on-render virtual + materializa ao pagar
- [x] 04 · Aba Caixa — motor entradas−saídas + acumulado + projetado 30d → construtor · dep: 03 ✅ motor 5 fontes + recebidoEm + criadaEm
- [x] 05 · Fornecedor "Paguei" → saída no caixa + CSS .fin-* + polish → construtor→forge · dep: 04 ✅ abate contas + despesa no caixa + CSS tokens
