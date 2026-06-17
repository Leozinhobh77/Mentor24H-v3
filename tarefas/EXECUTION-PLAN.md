# EXECUTION-PLAN - executor-20260617-001  (auto-gerado na FASE 01)

> Fonte unica: tarefas\checklist.md (secao deste ID). Regenerado a cada run pelo Initialize-ExecutorRun.
modo_execucao: sequencial - gerado: 2026-06-17 08:23
objetivo: Redesign tela Contatos

## Etapas
| # | Tarefa | Modo/Expert | Dep | Status |
|---|--------|-------------|-----|--------|
| 79 | Componentes-base (campo padrão · telefone intl BR · chip tags · badge score · pílula) | construtor/frontend-dev | — | todo |
| 80 | Os 6 modais padronizados (Novo/Editar · Excluir · Falei hoje · Próxima ação · Nova data · Registrar + chips canal) | construtor/frontend-dev | 79 | todo |
| 81 | Redesign da LISTA (KPIs enxutos · filtros · faixa reconectar · linha c/ score · estados) | forge/ui-visual-designer | 79 | todo |
| 82 | Redesign da FICHA (hero+score · ações em pílula · 4 cards compactados · bento responsivo) | forge/ui-visual-designer | 79 | todo |
| 83 | CSS premium (tokens · .ct-* upgrade · microinterações · touch 44px · overscroll · responsivo) | forge/design-system | 79, | todo |
| 84 | Smoke Playwright real + QA (regressão CRUD · máscaras · validações · estados · modo Negócio · 360/1280) | sentinela/smoke-visual-tester | 79, | todo |

## Ordem
79 -> 80 -> 81 -> 82 -> 83 -> 84   (sequencial)

## Gates
3 tentativas - grave/irreversivel/fora-escopo - decisao
