# Checklist — Mentor24h

> Índice das tarefas. **Pendente no topo / Concluído embaixo** (tarefa nova entra no TOPO).
> A Maestro preenche na geração (FASE 05); a Executor v3 dá baixa **ao vivo** (E2).
> Detalhe de cada tarefa: `Tarefa-NN.md` (nesta pasta).

## 🔄 Pendente / Agora

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
