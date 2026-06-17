# EXECUTION-PLAN - executor-20260616-001  (auto-gerado na FASE 01)

> Fonte unica: tarefas\checklist.md (secao deste ID). Regenerado a cada run pelo Initialize-ExecutorRun.
modo_execucao: sequencial - gerado: 2026-06-16 07:35
objetivo: Sidebar R2 — Painel Negócios standalone + hierarquia CSS

## Etapas
| # | Tarefa | Modo/Expert | Dep | Status |
|---|--------|-------------|-----|--------|
| 70 | HTML — criar "Painel Negócios" standalone logo após separador "Negócio" + remover "Painel" do grupo Operação | construtor/frontend-dev | — | todo |
| 71 | JS — fix active duplo: navigate() filtra .active por data-ctx vs modo atual (evita 2 painéis acesos) | construtor/frontend-dev | 70 | todo |
| 72 | CSS — hierarquia categoria > subcategoria (padding/font/ícone/opacity corretos) + remover .fab do CSS e HTML | forge/ui-visual-designer | 70, | todo |
| 73 | Smoke Playwright real + auditoria R2 (Painel Negócios · active duplo · hierarquia · FAB · console 0 · overflow 0 · regressão) | sentinela/smoke-visual-tester | 70, | todo |

## Ordem
70 -> 71 -> 72 -> 73   (sequencial)

## Gates
3 tentativas - grave/irreversivel/fora-escopo - decisao
