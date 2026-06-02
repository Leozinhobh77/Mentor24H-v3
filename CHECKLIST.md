# ✅ CHECKLIST — Mentor24h v3

**Stack:** Vanilla JS + CSS (single-file SPA, abre com duplo-clique) · **Dados:** mock em memória → Supabase depois · **Design:** "Quiet Premium" (aprovado)

**Fluxo:** Claude faz 1 etapa → Léo testa → Claude dá baixa aqui → Léo aprova → próxima etapa.

---

## Fundação
- [x] **Fase 0 — Design system + Dashboard âncora** (tokens, tema claro/escuro, responsivo, modos Pessoal/Híbrido/Negócio, Mentor, Humor) ✅
- [x] **Etapa 1 — Fundação navegável** — roteamento SPA: menu lateral e bottom-nav trocam de tela; título dinâmico; placeholders dos módulos ✅ aprovado por Léo

## Finanças
- [x] **Etapa 2 — Contas** (a pagar/receber, filtros, status, recorrente, parcelada, marcar paga, add/editar/excluir) ✅ aprovado por Léo
- [x] **Etapa 3 — Transações** (extrato por data, KPIs, filtros, adicionar + integração conta→transação) ✅ aprovado por Léo
- [x] **Etapa 4 — Metas** (caixinhas, depositar/sacar, calculadora de ritmo) ✅ aprovado por Léo
- [x] **Etapa 4.1 — Categorias + Relatórios** (gráficos reais: donut, linha, barras) ✅ aprovado por Léo

## Produtividade & Vida
- [x] **Etapa 5 — Tarefas / Kanban** (board drag & drop, prioridades, subtarefas) ✅ aprovado por Léo
- [x] **Etapa 6 — Agenda** (calendário, eventos, lembretes, datas importantes) ✅ aprovado por Léo
- [x] **Etapa 7A — Saúde / Medicamentos** (cadastro rico + status ativo/pausado/encerrado, qtd por horário, hora real do tomado, dose atrasada, duração do tratamento, adesão hoje+7d, histórico navegável dia a dia) ✅ aprovado por Léo
- [x] **Etapa 7B — Médicos + Humor** (lista de médicos + mood tracker com histórico e nota) ✅ aprovado por Léo
- [x] **Etapa 8A — Hábitos** (sim/não + quantidade, streak+recorde, meta semanal, heatmap, lembrete) ✅ aprovado por Léo
- [x] **Etapa 8B — Métricas pessoais** (peso/pressão/glicose + métrica customizável, gráfico de evolução) ✅ aprovado por Léo
- [x] **Etapa 9A — Contatos / Lista** (avatar, tags, contexto duplo, favoritos, busca/filtro, ações rápidas WhatsApp/ligar/email, aniversários) ✅ aprovado por Léo
- [x] **Etapa 9B — Contatos / Ficha rica** (manter-contato/reconexão, timeline de interações, datas importantes) ✅ aprovado por Léo

## Negócio
- [x] **Etapa 10 — Produtos + Estoque** (cadastro, margem, alertas, movimentações, precificação simplificada) ✅
- [x] **Etapa 11 — Vendas** (PDV com carrinho, item avulso, desconto, pagamento, recibo WhatsApp, histórico com "a prazo" e receber) ✅
- [x] **Etapa 12 — Clientes + Fornecedores + Precificação** (CRM/caderneta sobre contatos+vendas, RFM por regra, fiado com receber total/parcial, limite de crédito + alerta no PDV, win-back/aniversário, cobrança WhatsApp; fornecedores com "quanto devo" e lista de reposição; aba de precificação markup×margem com embalagem/frete/taxa) ✅
- [x] **Etapa 13 — Relatórios do negócio** (período selector 5 opções; KPIs: receita/nVendas/ticket/lucro/margem; gráfico receita×custo×lucro; top 8 vendidos com badges ABC; pagamentos breakdown; lucro por categoria; ABC classification visual) ✅

## Inteligência & Plataforma
- [x] **Etapa 14 — Mentor** ✅ (assistente por leitura de dados: insights e alertas por regra, sem IA)
  - [x] **14A — Motor de regras + feed** ✅ (17 gatilhos / 4 domínios, resumo do dia, filtro por modo, cap top-8, ação 1-clique, badge de críticos, dispensar; frases neutras isoladas em `fraseDe()`)
  - [x] **14B — A Voz do Mentor** ✅ (3 tons 🤝/😎/💪, frase modular ab×núcleo×fecho, anti-repetição, toggle no topo, slots contextuais, **trava de empatia** nos ids sensíveis/saúde — substituiu `fraseDe()`)
  - [x] **14C — Briefing no dashboard** ✅ (os 3 cards `.card.ai` "Mentor · seu dia" agora consomem o motor real via `Mentor.briefing(ctx)`: spotlight + contagem + resto, por contexto/modo, herdando tom e empatia; removido o mock de IA conversacional da Fase 0)
- [x] **Etapa 15 — Plataforma** ✅ (command palette ⌘K, notificações, quick-add global, modos refinados + hotfix cliques)
  - [x] **15A — Command Palette ⌘K** ✅ (Search & Act sem IA: ⌘K/Ctrl+K + clique na busca; índice IR PARA + AÇÕES criar; busca fuzzy nos DBs com contexto rico; act inline — Marcar paga/Editar/WhatsApp/Ver no estoque; estado vazio recentes+sugeridos por modo; calculadora inline segura; navegação 100% teclado ↑↓/↵/⇥/esc)
  - [x] **15B — Plataforma completa** ✅ (Central de Notificações: sino com badge de não-lidas + shake em críticos, painel agrupado por severidade, marcar lida/todas; Quick-add global botão +: 6 entidades → form direto; Modos refinados: cross-fade, atalhos Alt+1/2/3, persiste na sessão; Housekeeping: `.chip`/`.ai-cta` removidos do CSS; `Mentor.feed()` exposto)
  - [x] **Hotfix 01/06** ✅ (CSS `.cmdk-back[hidden]{display:none}` — overlay não bloqueia cliques quando hidden)
## Aprendizado & Lazer (Pessoal)
- [x] **Etapa 16 — Estudos** ✅ (modo Pessoal — acompanhar estudos com timer, metas, stats e Mentor) — 2026-06-01
  - [x] **Matérias/cursos** — cadastro com nome, cor, meta de horas/semana e prova/D-Day opcional
  - [x] **Cronômetro / Pomodoro** — escolhe a matéria, dá play, e ao parar registra a sessão (Pomodoro 25/5 + Livre)
  - [x] **Registro manual** — lançar tempo estudado sem usar o timer ("estudei 1h de Mat")
  - [x] **Meta semanal por matéria** (barra de progresso) + **KPIs no topo** (hoje / semana / streak / próxima prova)
  - [x] **Stats reaproveitando componentes** — donut (horas por matéria), barras (últimos 7 dias), heatmap de consistência (igual Hábitos), streak 🔥
  - [x] **Histórico de sessões** — o que estudou, quando e por quanto tempo
  - [x] **Mentor — regras novas de Estudos** — prova chegando + pouco estudo · sem estudar há N dias · bateu a meta da semana 🎉
  - [x] **Dados**: matérias + sessões (em memória → Supabase na Etapa 20)
  - *Fora do escopo (no Backlog): flashcards/SRS, ranking social*
- [x] **Etapa 17 — Leitura / Livros** ✅ (modo Pessoal — estante, progresso, hábito de leitura, stats e Mentor) — 2026-06-01
  - [x] **Estante**: Quero ler · Lendo · Lido · Abandonei (abas/filtro)
  - [x] **Livro**: título, autor, capa (cor+inicial, sem internet), total de páginas, gênero
  - [x] **Progresso**: marcar página atual ("parei na 180") → barra + %
  - [x] **Registrar leitura**: por páginas e/ou tempo (timer Pomodoro/Livre, igual Estudos) → alimenta streak
  - [x] **Nota (meia-estrela) + resenha curta** ao terminar
  - [x] **Meta anual** ("ler N livros no ano") com progresso
  - [x] **Stats reaproveitando componentes**: donut (gênero), barras (páginas/7 dias), heatmap de consistência, streak 🔥
  - [x] **Mentor — regras novas de Leitura**: livro parado há N dias · faltam X livros pra meta do ano · N dias sem ler
  - [x] **Dados**: livros + sessões de leitura (em memória → Supabase na Etapa 20)
  - *Fora do escopo (no Backlog): fóruns/clubes de leitura, resenhas públicas, recomendações sociais*
- [x] **Etapa 18 — Séries** ✅ (modo Pessoal — listas, progresso por episódio, stats e Mentor) — 2026-06-01
  - [x] **Listas**: Quero assistir · Assistindo · Concluído · Abandonei (abas/filtro)
  - [x] **Série**: título, capa (cor+inicial), gênero, plataforma (onde assiste), nº de episódios
  - [x] **Progresso por episódio**: "parei na T2E5" → marcar ep visto, barra (vistos/total), próximo ep em destaque
  - [x] **Registrar maratona**: marcar X episódios vistos hoje → alimenta streak
  - [x] **Nota (meia-estrela) + resenha** ao concluir
  - [x] **Stats reaproveitando componentes**: donut (gênero), barras (eps/7 dias), heatmap, streak 🔥
  - [x] **Mentor — regras novas de Séries**: série parada há N dias · X séries em "quero assistir" · N dias sem assistir
  - [x] **Dados**: séries + sessões (eps vistos por dia) (em memória → Supabase na Etapa 20)
  - *Fora do escopo (no Backlog): auto-scrobble/integração streaming, calendário de estreias, comunidade/resenhas públicas*

## Corpo & Movimento (Pessoal)
- [x] **Etapa 19 — Treinos** ✅ (modo Pessoal — controle universal de treino/esporte: planos, frequência, evolução e Mentor) — 2026-06-01
  - [x] **Planos de treino (A/B/C…)**: criar/editar, lista de exercícios por plano (séries/reps/carga); serve p/ qualquer modalidade
  - [x] **Agenda semanal**: atribuir planos aos dias (seg/qui=A, ter/sex=B…), flexível; "treino de hoje" em destaque
  - [x] **Executar plano do dia**: marcar exercícios/séries feitos → registra a sessão (registro rápido)
  - [x] **Registrar treino avulso**: modalidade (musculação/corrida/luta/dança/outro) com campos adaptáveis (carga/reps · distância/tempo/ritmo · duração/intensidade/notas)
  - [x] **Frequência**: dias da semana + presença → calendário/heatmap + streak + meta semanal
  - [x] **Medições corporais**: peso, % gordura, circunferências (braço/peito/cintura/quadril/perna) com tendência
  - [x] **Motor de evolução & comparação**: linha no tempo (Charts.line); comparar período atual×anterior (7d/30d/mês/3m); delta colorido (🟢 sobe / 🔴 cai); detecção de platô; PRs/recordes
  - [x] **Stats**: donut (modalidade), heatmap (presença), streak, linha (evolução); seletor de período (reusa Relatórios negócio)
  - [x] **Mentor — regras novas de Treinos**: plano de hoje · meta semanal · PR batido · platô (volume travado) · N dias sem treinar (5 regras; aparecem no feed/abaixo do cap top-8 da 14A)
  - [x] **Dados**: planos + sessões + medições (com data; demo espalhada por ~3 meses) — em memória → Supabase na Etapa 22
  - [x] **Modalidades editáveis** (add/remove + 3 tipos de registro força/distância/duração + variedade demo de esportes: natação, dança, yoga, crossfit, ciclismo…) ✅ — 2026-06-02 (ajuste; data-driven via DB.treinoModalidades, gerenciador com chips por tipo, guarda ao remover modalidade com sessões/planos)
  - [x] **Medições: histórico + comparar datas + gráfico de evolução; "+ nova modalidade" visível nos seletores** ✅ — 2026-06-02 (ajuste; tendência rápida Δ anterior/30d, comparador A×B com delta colorido, Charts.line por medida, editar/excluir registro, fix do `.card-h` (botão alinhado), atalho "+" no avulso e no plano)
  - *Fora do escopo (no Backlog): fotos de progresso, GPS/mapa de corrida, smartwatch/Strava, desafios sociais*
- [ ] **Etapa 20 — (2ª ideia pessoal)** 🔧 *Léo vai detalhar*

## Graduação para produto
- [ ] **Etapa 21 — Auth + Perfil/Config** (cadastro/login, perfil, preferências)
- [ ] **Etapa 22 — Supabase** (substituir mock por banco real, sync online-only)
- [ ] **Etapa 23 — PWA + polish** (manifest, instalável, estados de rede, revisão final)

## 💡 Backlog / Futuro (ideias parqueadas — não esquecer)
- [ ] **Flashcards + revisão espaçada (SRS)** — cartões pergunta→resposta com reagendamento em intervalos crescentes (1d/3d/7d/15d…), estilo Anki. Liga-se a **Estudos (Etapa 16)**. Dá pra fazer local/vanilla; vira etapa própria quando o Léo quiser.
- [ ] **Ranking social de estudos** — comparar horas/consistência com outros usuários (estilo YPT). ⛔ Depende de multiusuário → só **pós-Supabase (Etapa 22)**.
- [ ] **Comunidade de leitura** — fóruns/clubes de leitura, resenhas públicas, recomendações sociais (estilo Fable/PageBound/Goodreads social). ⛔ Multiusuário → **pós-Supabase (Etapa 22)**.
- [ ] **Séries — auto-scrobble + calendário de estreias** — logar automático do streaming (estilo Trakt/Simkl) e datas de novos episódios (via API tipo TMDB). ⛔ Precisa APIs externas/online → **pós-Supabase (Etapa 22)**.
- [ ] **Comunidade de séries** — resenhas públicas / recomendações sociais (estilo Serializd/TV Time). ⛔ Multiusuário → **pós-Supabase (Etapa 22)**.
- [ ] **Treinos — extras** — fotos de progresso, GPS/mapa de corrida, integração smartwatch/Strava, desafios sociais. ⛔ Precisa armazenamento real/API/multiusuário → **pós-Supabase (Etapa 22)**.

---

## Nota de Arquitetura

> **Single-file por enquanto (decisão 2026-05-27):** continuar com `index.html` único até fechar todas as etapas do protótipo. Quando chegar na Etapa 22 (Supabase), **avisar Léo para separar em projeto real** com estrutura adequada (HTML + CSS + JS separados ou framework). O protótipo vira guia de referência de UX e dados.

---

*Atualizado a cada etapa. Última: Etapa 19 (Treinos) ✅ — 2026-06-01 (Treinos no modo Pessoal: planos A/B/C + agenda semanal, executar/avulso por modalidade, frequência heatmap+streak, medições, motor de evolução & comparação de períodos com linha/delta colorido/platô/PR, donut modalidade, 5 regras do Mentor, ícone dumbbell). Próxima: Etapa 20 (2ª ideia pessoal) — 🔧 Léo vai detalhar.*
