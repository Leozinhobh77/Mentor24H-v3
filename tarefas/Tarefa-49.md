---
id: 49
titulo: Chips de filtro → cards quadrados (rótulo topo / valor base, 3 colunas iguais, ordem A Receber·A Pagar·Todas)
status: todo
modo: forge
expert: ui-visual-designer
depende_de: []
---

## 🖥️ HUD — COPIAR E IMPRIMIR ANTES DE EXECUTAR

```
┌─ Mentor24h-v3 · executor-20260615-002 ───────────────────┐
│ 🔄 RUN ░░░░░ 1/5  ·  🎨 Forge 1/4                          │
│ 🧠 Expert ativo: ui-visual-designer                       │
│ ⏳ AGORA:   Tarefa-49 · Chips → cards quadrados           │
│ ✅ Aceite:  3 cards iguais, rótulo topo/valor base        │
│ ⏭️ PRÓXIMA: Tarefa-50 · Toggle Mês/Semana                 │
└───────────────────────────────────────────────────────────┘
```

## O que é
Os filtros `A Receber / A Pagar / Todas` hoje são botões-pílula com rótulo+valor inline
(`js/pessoal/03-contas.js` l.305-309, `.fin-chips`/`.fin-chip`/`.fin-chip-n`). Transformar em
**3 cards quadrados** lado a lado, com **rótulo no topo** e **valor na base**.

## Esboço aprovado
```
╭──────────────╮  ╭──────────────╮  ╭──────────────╮
│  A RECEBER   │  │   A PAGAR    │  │    TODAS     │   ← rótulo (topo)
│  R$ 4.000    │  │  R$ 4.600    │  │  12 contas   │   ← valor (base)
╰──────────────╯  ╰──────────────╯  ╰──────────────╯
```

## Etapas
- [ ] 1. **Markup** — cada `.fin-chip` passa a ter 2 níveis: `.fin-chip-label` (topo) + `.fin-chip-val` (base).
      Manter `data-filtro`, `aria-pressed` e o clique = filtro (binds l.339 intactos).
- [ ] 2. **Ordem do esboço** — exibir **A Receber · A Pagar · Todas** (hoje está Todas·Receber·Pagar).
      **Todas** segue como **default ativo** (`filtroCard` vazio).
- [ ] 3. **Layout** — `.fin-chips` em grid de **3 colunas iguais** (largura ≈⅓), formato mais quadrado/encorpado
      (altura/padding maiores que pílula), gap consistente via tokens.
- [ ] 4. **Estado ativo** — card selecionado destaca (preenche cor + leve elevação/borda); A Receber tom income,
      A Pagar tom expense, Todas neutro. `aria-pressed` ok.
- [ ] 5. **Responsivo 360px** — os 3 seguem **na mesma linha**, encolhendo juntos sem overflow e sem cortar texto
      (valor pode reduzir 1 passo de fonte).

## ✅ Critério de aceite
- [ ] 3 cards quadrados, largura igual, mesma linha (inclusive 360px), rótulo topo / valor base.
- [ ] Ordem A Receber · A Pagar · Todas; Todas default ativo; clique filtra; ativo destaca.
- [ ] 100% tokens; sem overflow 1280 e 360, claro+escuro; console 0.

## 📂 Escopo
Mexe: `js/pessoal/03-contas.js` (markup dos chips + binds) · `css/estilo.css` (`#contas-root .fin-chip*`, aditivo).
🔒 NÃO toca: lógica de cálculo/pendente (T41 da R2), `.fin-card`(1285), Transacoes, negocio.
