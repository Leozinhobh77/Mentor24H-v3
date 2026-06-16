# EXECUTION-PLAN - executor-20260615-006  (auto-gerado na FASE 01)

> Fonte unica: tarefas\checklist.md (secao deste ID). Regenerado a cada run pelo Initialize-ExecutorRun.
modo_execucao: sequencial - gerado: 2026-06-15 19:57
objetivo: Sidebar redesign premium — hierarquia visual 3 níveis

## Etapas
| # | Tarefa | Modo/Expert | Dep | Status |
|---|--------|-------------|-----|--------|
| 66 | HTML — renomear "Início"→"Painel Pessoal" + ícones únicos nos headers de categoria | construtor/frontend-dev | — | todo |
| 67 | CSS — card premium (Painel Pessoal + categorias) + divisórias finas + hierarquia 3 níveis (aceso/sub-ativa/inativo) | forge/ui-visual-designer | 66 | todo |
| 68 | JS — fix bug desktop navigate('dashboard') no mode-switch + active-parent para CSS do Nível 2 | construtor/frontend-dev | 67 | todo |
| 69 | Smoke Playwright real + auditoria (3 níveis · ícones · bug fix · console 0 · overflow 0 · regressão) | sentinela/smoke-visual-tester | 66, | todo |

## Ordem
66 -> 67 -> 68 -> 69   (sequencial)

## Gates
3 tentativas - grave/irreversivel/fora-escopo - decisao
