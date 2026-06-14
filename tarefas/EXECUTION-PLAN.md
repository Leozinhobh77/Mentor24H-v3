# EXECUTION-PLAN - executor-20260614-001  (auto-gerado na FASE 01)

> Fonte unica: tarefas\checklist.md (secao deste ID). Regenerado a cada run pelo Initialize-ExecutorRun.
modo_execucao: sequencial - gerado: 2026-06-14 11:51
objetivo: Tela Finanças

## Etapas
| # | Tarefa | Modo/Expert | Dep | Status |
|---|--------|-------------|-----|--------|
| 32 | CSS componente fin-* (namespaced, resolve colisão .fin-card 1285) | forge/ui-visual-designer | — | todo |
| 33 | Render base (mockup) + cards-filtro, preservando CRUD (pay/edit/del) | forge/frontend-dev | 32 | todo |
| 34 | Reserva por dia (mês) — sub-linha no fin-resumo | construtor/frontend-dev | 33 | todo |
| 35 | Ritmo semanal — semanas de calendário (Vencidas→Semanas→Pagas, por-dia adaptativo) + atualiza PADROES | construtor/frontend-dev | 33, | todo |
| 36 | Navegação por mês (‹ mês › recalcula semanas/reserva) | construtor/frontend-dev | 35 | todo |
| 37 | Tap na linha = ação rápida (paga/editar/excluir) | construtor/frontend-dev | 33 | todo |
| 38 | Filtros expansíveis (busca + categoria) atrás de botão | construtor/frontend-dev | 33 | todo |
| 39 | Faixa do Mentor (consome Mentor.feed domínio Finanças) | construtor/frontend-dev | 33 | todo |
| 40 | Smoke Playwright real + ficha do componente | sentinela/smoke-visual-tester | 32–39 | todo |

## Ordem
32 -> 33 -> 34 -> 35 -> 36 -> 37 -> 38 -> 39 -> 40   (sequencial)

## Gates
3 tentativas - grave/irreversivel/fora-escopo - decisao
