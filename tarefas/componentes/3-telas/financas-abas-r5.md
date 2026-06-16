# Componente: Finanças Pessoal — Abas R5

**Run:** executor-20260615-004 · Etapa 36 · Tier M
**Data:** 2026-06-15
**Status:** ✅ APROVADO (Smoke VERDE 0 erros)

## O que é
Reorganização dos filtros da tela Finanças (Pessoal): de 3 chips (com "Todas") para **2 abas exclusivas**
(A Receber / A Pagar), sempre-um-ativo, default A Pagar. Cada aba exibe progresso de quitação (10/20).
Corrige o bug do accordion "Pagas" que sumia ao filtrar. Aplica terminologia contextual (pago × recebido).

## Anatomia (2 abas 50/50)
```
╭─────────────────────────────╮ ╭─────────────────────────────╮
│        A RECEBER            │ │         A PAGAR   [ATIVO]   │
│        R$ 4.000             │ │         R$ 4.600            │
│  ▓▓▓▓▓▓░░░░  0/2           │ │  ▓▓▓░░░░░░░  1/10          │
╰─────────────────────────────╯ ╰─────────────────────────────╯
```

## Arquivos tocados
- `js/pessoal/03-contas.js`:
  - `filtroCard` default = `'pagar'` (era `null`)
  - `filtered()` l.20-21: filtra só por tipo (mantém pagas)
  - `seloTxt()` l.83: terminologia contextual paga/recebida
  - `buildListaMes()` l.161: accordion sempre presente, label dinâmico (Pagas/Recebidas)
  - `buildListaSemana()`: header adaptativo por aba
  - `openQuick()`: "Marcar como pago/recebido" por tipo
  - Chips HTML: 2 abas + prog-bar + fração por chip
  - `pagasN`/`totalN` computados por tipo no render
- `css/estilo.css` (append T58): grid 2col, chip encorpado min-height:82px, `.fin-chip-prog-wrap/prog/bar/frac`

## Lógica
| Estado interno | Rótulo A Pagar | Rótulo A Receber |
|---|---|---|
| `status='paga'` + `pagoEm` | "Pago em DD/MM" | "Recebido em DD/MM" |
| `status='paga'` (sem data) | "Paga" | "Recebida" |
| Accordion | "✓ Pagas" | "✓ Recebidas" |
| Quick-menu | "Marcar como pago" | "Marcar como recebido" |

## CSS classes adicionadas (T58)
- `.fin-chip-prog-wrap` — wrapper barra + fração
- `.fin-chip-prog` — trilho neutro (role=progressbar)
- `.fin-chip-bar` — preenchimento income (sempre verde)
- `.fin-chip-frac` — fração mono N/M

## Smoke T59 (2026-06-15)
- Console: 0 erros (1280+360, claro+escuro) ✅
- Overflow: 0px em todos os combos ✅
- 2 abas (sem Todas) + default A Pagar ✅
- aria-pressed=true no ativo ✅
- Switch A Receber ↔ A Pagar funcional ✅
- Progresso: role=progressbar + aria + barra + fração (1/10 · 0/2) ✅
- Terminologia: "Marcar como pago/recebido" ✅ · selos "Pago em/Paga" ✅
- Regressão: Totais/Saldo ✅ · Mentor R4 ✅ · Transações ✅ · Negócio ✅
- Screenshots: `_smoke/smoke-r5-1280.png` + `_smoke/smoke-r5-360.png`

## Avisos não-bloqueantes
- `text-transform:uppercase` no `.fin-pagas-nome` (CSS R3) faz `inner_text()` retornar 'PAGAS' — correto no DOM
- Mock sem contas receber pagas / sem pagas na semana atual — accordion ausente é estado esperado
