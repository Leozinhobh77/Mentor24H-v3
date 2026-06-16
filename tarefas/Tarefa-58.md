---
id: 58
titulo: Visual premium — 2 cards retangulares 50/50 centralizados, barra de progresso 10/20, accordion com label dinâmico
status: todo
modo: forge
expert: ui-visual-designer
depende_de: [57]
---

## 🖥️ HUD — COPIAR E IMPRIMIR ANTES DE EXECUTAR

```
┌─ Mentor24h-v3 · executor-20260615-004 ───────────────────┐
│ 🔄 RUN ▰░░ 2/3  ·  🎨 Forge 1/1                            │
│ 🧠 Expert ativo: ui-visual-designer                       │
│ ⏳ AGORA:   Tarefa-58 · Visual premium dos cards          │
│ ✅ Aceite:  2 cards 50/50 centralizados + barra 10/20     │
│ ⏭️ PRÓXIMA: Tarefa-59 · Smoke + auditoria                 │
└───────────────────────────────────────────────────────────┘
```

## O que é
Vestir a nova estrutura (T57) com acabamento **premium, nada solto**, fiel ao app. Os antigos
3 chips (`.fin-chips`/`.fin-chip`) viram **2 cards retangulares 50/50** com progresso.

## Esboço aprovado
```
╭─────────────────────────────╮ ╭─────────────────────────────╮
│          A RECEBER          │ │          A PAGAR            │
│          R$ 4.000           │ │          R$ 4.600           │
│       ▓▓▓▓▓▓░░░░ 5/8         │ │       ▓▓▓▓▓░░░░░ 10/20       │
╰─────────────────────────────╯ ╰─────────────────────────────╯
        (½ esquerda)                    (½ direita)
```

## Etapas
- [ ] 1. **2 cards 50/50** — grid de 2 colunas iguais, um da esquerda ao centro, outro do centro à direita,
      mesma linha (inclusive 360px), formato retangular encorpado.
- [ ] 2. **Conteúdo centralizado** — rótulo (topo) + valor (base) **centrados no eixo horizontal**, com respiro
      vertical equilibrado (harmonia). Aba ativa destaca (preenche cor + elevação); A Receber tom income, A Pagar tom expense.
- [ ] 3. **Barra de progresso** — fina, abaixo do valor, preenche em **verde** (income = avanço), trilho neutro,
      com a **fração `pagasN/totalN`** (T57) ao lado/abaixo. `role="progressbar"` + `aria` ("10 de 20 pagas").
      Cantos arredondados, transição suave. Sem competir com o valor-herói.
- [ ] 4. **Accordion com label dinâmico** — "✓ Pagas" / "✓ Recebidas" (vem da T57) mantendo o estilo elegante
      da R3 (✅ verde + contagem em chip + total verde/mono + seta giratória). Verificar que nada ficou solto.
- [ ] 5. **Polimento premium** — alinhamentos perfeitos, espaçamentos via tokens, zero texto/botão/cor solta,
      consistente com o resto do app (Quiet Premium teal). Responsivo 360→1280, claro+escuro, sem overflow.

## ✅ Critério de aceite
- [ ] 2 cards 50/50 na mesma linha (inclusive 360), conteúdo centralizado e harmonioso.
- [ ] Barra de progresso elegante com fração 10/20, verde, acessível.
- [ ] Accordion com label certo (Pagas/Recebidas) e acabamento premium.
- [ ] Nada solto; 100% tokens; sem overflow 1280/360, claro+escuro; console 0.

## 📂 Escopo
Mexe: `js/pessoal/03-contas.js` (markup dos cards + barra) · `css/estilo.css` (`#contas-root`, aditivo).
🔒 NÃO toca: lógica da T57 (consome os dados), Totais/Saldo, Mentor, Transacoes, negocio, `.fin-card`(1285).
