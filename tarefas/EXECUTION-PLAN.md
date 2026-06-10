# EXECUTION-PLAN — executor-20260610-002 · Etapa 25A Financeiro

> Gerado pelo orquestrador (FASE 02). Ordem + dependências + expert por etapa.

| # | Tarefa | Expert (ROUTING) | Dep | Status |
|---|--------|------------------|-----|--------|
| 01 | DB + seed despesasNeg/caixaAvulso | construtor/frontend-dev | — | todo |
| 02 | financeiro.js + registro nav/rota/⌘K | construtor/frontend-dev | 01 | todo |
| 03 | Aba Despesas (CRUD+recorrência+donut+delta) | construtor/frontend-dev | 02 | todo |
| 04 | Aba Caixa (motor+acumulado+projetado 30d) | construtor/frontend-dev | 03 | todo |
| 05 | Fornecedor "Paguei" + CSS .fin-* | construtor/frontend-dev → forge/ui-visual-designer | 04 | todo |
| F | Polish Quiet Premium (tokens·360px·claro/escuro) | forge/ui-visual-designer | 05 | todo |
| S | Smoke visual real Playwright | sentinela/smoke-visual-tester | F | todo |
| D | componentes\ + histórico | documentador/technical-writer | S | todo |

Retry: 3x por problema · gate se grave/decisão · contador no próprio plano.
