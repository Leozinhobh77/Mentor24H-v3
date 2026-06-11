# Checklist — Mentor24h

> Índice das tarefas. **Pendente no topo / Concluído embaixo** (tarefa nova entra no TOPO).
> A Maestro preenche na geração (FASE 05); a Executor v3 dá baixa **ao vivo** (E2).
> Detalhe de cada tarefa: `Tarefa-NN.md` (nesta pasta).

## 🔄 Pendente / Agora

### Etapa 25B — Financeiro: MEI + Metas + Pró-labore + Mentor (executor-20260610-003)
- [ ] 06 · DB — config MEI + metasNeg + proLabore + reservaNeg + seed → construtor · dep: —
- [ ] 07 · Aba 🏛️ MEI — faturamento vs limite + projeção + DAS + DASN → construtor · dep: 06
- [ ] 08 · Aba 🎯 Metas + Pró-labore (ponte PF/PJ) + Reserva → construtor · dep: 07
- [ ] 09 · Mentor — 7 regras novas de Financeiro (mk + NUC 3 tons) → construtor · dep: 08
- [ ] 10 · CSS .fin-* (MEI/Metas) + polish responsivo + tema → forge · dep: 09

## ✅ Concluído
<!-- tarefas concluídas descem pra cá -->

### Etapa 25A — Financeiro do Negócio: Caixa + Despesas ✅ (2026-06-10 · executor-20260610-002 · Sentinela 31/31)
- [x] 01 · DB + seed — despesasNeg e caixaAvulso → construtor · dep: — ✅ 14 avulsos+despesas (13+saldo inicial)
- [x] 02 · Módulo financeiro.js + registro completo (nav, rota, título, ⌘K) → construtor · dep: 01 ✅ 6 pontos registrados
- [x] 03 · Aba Despesas — CRUD + recorrente/parcelada + donut + delta → construtor · dep: 02 ✅ on-render virtual + materializa ao pagar
- [x] 04 · Aba Caixa — motor entradas−saídas + acumulado + projetado 30d → construtor · dep: 03 ✅ motor 5 fontes + recebidoEm + criadaEm
- [x] 05 · Fornecedor "Paguei" → saída no caixa + CSS .fin-* + polish → construtor→forge · dep: 04 ✅ abate contas + despesa no caixa + CSS tokens
