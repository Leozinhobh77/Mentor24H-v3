---
id: 43
titulo: Redesign do card-dashboard (direção A) — topo+hoje, totais, saldo-resultado, 3 chips, toggle Mês/Semana, barra ação 50/50
status: todo
modo: forge
expert: ui-visual-designer
depende_de: [41]
---

## 🖥️ HUD — COPIAR E IMPRIMIR ANTES DE EXECUTAR

```
┌─ Mentor24h-v3 · executor-20260615-001 ───────────────────┐
│ 🔄 RUN ▰▰░░░░░░ 3/8  ·  🎨 Forge 1/2                       │
│ 🧠 Expert ativo: ui-visual-designer                       │
│ ⏳ AGORA:   Tarefa-43 · Card-dashboard (A)                │
│ ✅ Aceite:  esboço A, tokens, sem overflow 360/1280       │
│ ⏭️ PRÓXIMA: Tarefa-44 · Modo Mês                          │
└───────────────────────────────────────────────────────────┘
```

## O que é
Reconstruir o bloco `.fin-resumo` (l.235-270) na **direção A (hero evoluído)** aprovada.
É só o **card principal** — a lista vem nas T44/T45.

## Esboço aprovado (referência visual)
```
‹  Junho 2026  ›                       ↩ hoje
   Total a Receber        Total a Pagar
     R$ 5.000,00            R$ 4.600,00
   ───────────────────────────────────────
              Saldo previsto
               R$ 400,00
   [ A RECEBER ] [ A PAGAR ] [ TODAS ]
        ╭ Mês ● ┆ Semana ╮
   [ 🔎 Filtros ]   [ + Nova conta ]
```

## Etapas
- [ ] 1. **Topo** — `‹ mês ›` (reusa `navMes`) + **↩ hoje** (volta `mesAtivo` ao mês corrente; aparece SÓ
      quando `mesAtivo !== mês atual`). Formatação elegante via tokens.
- [ ] 2. **Totais (previsão fixa)** — Total a Receber (esq.) e Total a Pagar (dir.) em 2 colunas, usando
      **`calcTotais()`** (T41). Abaixo, com divisória, o **Saldo previsto** como resultado/herói
      (verde se ≥0, vermelho se <0).
- [ ] 3. **3 chips-filtro** — A RECEBER / A PAGAR / TODAS. A Receber e A Pagar mostram o **pendente**
      (T41, `status!=='paga'`); TODAS mostra `N contas` e é o **default ativo**. Clique filtra a lista
      (estado `filtroCard`). Chip ativo destaca (preenche cor + leve elevação); `aria-pressed`.
- [ ] 4. **Toggle Mês/Semana** — segmented control; **lembra a última escolha** (estado `viewMode`,
      persistir em memória da sessão). Alterna o render da lista (T44 ↔ T45). `role=tab`/`aria-selected`.
- [ ] 5. **Barra de ação** — `Filtros` + `+ Nova conta` na mesma linha, **50/50 iguais e alinhados**
      (hoje Nova conta vai com `margin-left:auto`, l.275). Filtros = secundário (contorno), Nova conta = primário.
- [ ] 6. **Remover** a barra de proporção `.fin-prop-bar` (l.250-252).

## ✅ Critério de aceite
- [ ] Layout fiel ao esboço A; saldo é o resultado embaixo dos totais.
- [ ] ↩ hoje só aparece fora do mês atual e volta ao mês corrente.
- [ ] 3 chips com valores certos (pendente / N contas); TODAS default; ativo destaca.
- [ ] Toggle alterna e lembra a escolha; Filtros+Nova conta 50/50.
- [ ] `.fin-prop-bar` removida; 100% tokens; sem overflow 360 e 1280, claro+escuro; console 0.

## 📂 Escopo
Mexe: `js/pessoal/03-contas.js` (render do `.fin-resumo` + binds) · `css/estilo.css` (aditivo, `#contas-root` escopado).
🔒 NÃO toca: `.fin-card` do Negócio (estilo.css:1285), `Transacoes`, `js/negocio/*`.
