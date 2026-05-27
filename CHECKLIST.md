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
- [ ] **Etapa 10 — Produtos + Estoque** (cadastro, margem, alertas, movimentações)
- [ ] **Etapa 11 — Vendas** (carrinho → registrar → recibo → histórico)
- [ ] **Etapa 12 — Clientes + Fornecedores + Precificação**
- [ ] **Etapa 13 — Relatórios do negócio** (vendas por período, mais vendidos, receita x lucro x custo)

## Inteligência & Plataforma
- [ ] **Etapa 14 — Mentor** (assistente por leitura de dados: insights e alertas por regra, sem IA)
- [ ] **Etapa 15 — Plataforma** (command palette ⌘K, notificações, quick-add global, modos refinados)
- [ ] **Etapa 16 — Auth + Perfil/Config** (cadastro/login, perfil, preferências)
- [ ] **Etapa 17 — Supabase** (substituir mock por banco real, sync online-only)
- [ ] **Etapa 18 — PWA + polish** (manifest, instalável, estados de rede, revisão final)

---

## Nota de Arquitetura

> **Single-file por enquanto (decisão 2026-05-27):** continuar com `index.html` único até fechar todas as etapas do protótipo. Quando chegar na Etapa 17 (Supabase), **avisar Léo para separar em projeto real** com estrutura adequada (HTML + CSS + JS separados ou framework). O protótipo vira guia de referência de UX e dados.

---

*Atualizado a cada etapa. Última: Etapa 9B ✅ aprovada — 2026-05-27. Próxima: Etapa 10 (Produtos + Estoque).*
