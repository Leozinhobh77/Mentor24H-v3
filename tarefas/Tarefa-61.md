---
id: 61
titulo: Card Mentor visual — limpar CSS legado (herdar .mtr-card / listra teal) + tag flutuante "MENTOR"
status: todo
modo: forge
expert: ui-visual-designer
depende_de: []
---

## 🖥️ HUD — COPIAR E IMPRIMIR ANTES DE EXECUTAR

```
┌─ Mentor24h-v3 · executor-20260615-005 ───────────────────┐
│ 🔄 RUN ▰░░░░ 2/6  ·  🎨 Forge 1/2                          │
│ 🧠 Expert ativo: ui-visual-designer                       │
│ ⏳ AGORA:   Tarefa-61 · Card Mentor visual                │
│ ✅ Aceite:  card = aba Mentor (listra teal) + tag MENTOR  │
│ ⏭️ PRÓXIMA: Tarefa-62 · Voz do card Mentor (Mês)          │
└───────────────────────────────────────────────────────────┘
```

## O que é
O card Mentor da Finança usa o markup `.mtr-card` (certo), mas **CSS legado de R3/R4** sobrescreve
e descaracteriza. Limpar pra herdar fielmente o card da aba Mentor + adicionar a tag "MENTOR".

## Etapas
- [ ] 1. **Limpar override** — `#contas-root .fin-mentor-rod` (estilo.css l.1695) força `background:surface-2`
      e `border:1px` → mata o `.mtr-card` real (que tem `background:surface-1` + **`border-left:3px solid var(--c)`**,
      a listra teal característica, l.319). Remover/neutralizar o que conflita pra o card **herdar o `.mtr-card`**
      (listra teal à esquerda, surface-1, hover). Remover regras **mortas** (`.ai`, `-frase`, `-inner`, `-hero`
      antigas, l.1696-1744) que não são mais usadas no markup atual.
- [ ] 2. **Tag flutuante "MENTOR"** — adicionar `.mtr-spot-tag` (estilo já existe, l.337: etiqueta teal uppercase
      na borda superior) no topo do card Mentor. Markup: incluir `<span class="mtr-spot-tag">Mentor</span>` no
      `.fin-mentor-rod` e no `.fin-mentor-sem`. Como `.mtr-card` é `position:relative`? garantir `position:relative`
      pra a tag ancorar (a tag é `position:absolute; top:-10px`).
- [ ] 3. Aplicar a **todos** os cards Mentor da Finança: rodapé do Mês (`fin-mentor-rod`) e blocos de Semana (`fin-mentor-sem`).
- [ ] 4. Validar estados (meta/futuro/passado/ok) — todos com a cara correta + tag.

## ✅ Critério de aceite
- [ ] Card Mentor visualmente **igual** aos cards da aba Mentor (listra teal à esquerda, surface-1, hover).
- [ ] Tag "MENTOR" no topo de todos os cards Mentor (rodapé + semana).
- [ ] Zero CSS morto remanescente; 100% tokens; sem overflow 360/1280, claro+escuro; console 0.

## 📂 Escopo
Mexe: `css/estilo.css` (`#contas-root .fin-mentor-*`, limpeza + tag) · `js/pessoal/03-contas.js` (incluir a tag no markup).
🔒 NÃO toca: `.mtr-*` da aba Mentor (só herda), outras telas, `.fin-card`(1285).
