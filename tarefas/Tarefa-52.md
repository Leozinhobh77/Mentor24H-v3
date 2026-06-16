---
id: 52
titulo: Accordion "Pagas" elegante — ✅ verde, contagem em chip, total verde/mono, seta giratória, cards concluídos
status: todo
modo: forge
expert: ui-visual-designer
depende_de: []
---

## 🖥️ HUD — COPIAR E IMPRIMIR ANTES DE EXECUTAR

```
┌─ Mentor24h-v3 · executor-20260615-002 ───────────────────┐
│ 🔄 RUN ▰▰▰░░ 4/5  ·  🎨 Forge 4/4                          │
│ 🧠 Expert ativo: ui-visual-designer                       │
│ ⏳ AGORA:   Tarefa-52 · Accordion "Pagas"                 │
│ ✅ Aceite:  bloco elegante, contagem+total formatados     │
│ ⏭️ PRÓXIMA: Tarefa-53 · Smoke + auditoria                 │
└───────────────────────────────────────────────────────────┘
```

## O que é
O accordion "Pagas" (`acordeaoHdr()` em `js/pessoal/03-contas.js` l.135-142, usa `.fin-grupo-toggle`/
`.fin-pagas-body`) está sem formatação ("campo solto, experiência 0"). Dar identidade de
**concluído/positivo** (verde income) e formatar contagem + total.

## Esboço aprovado
```
FECHADO:  ✅ Pagas   [3 contas]              R$ 1.230,00  ▾
ABERTO:   ✅ Pagas   [3 contas]              R$ 1.230,00  ▴
          ✓̶ ̶I̶n̶t̶e̶r̶n̶e̶t̶ ̶m̶a̶i̶o̶          Pago em 02/06  ✓   (opaco/riscado)
```

## Etapas
- [ ] 1. **Cabeçalho como bloco** (não "campo solto") — fundo/contorno sutil, hover/elevação leve.
- [ ] 2. **✅ + "Pagas" em verde** (`--income`), peso 700.
- [ ] 3. **Contagem em chip** arredondado (fundo `--income-soft`, texto `--income`): "3 contas".
- [ ] 4. **Total à direita** em verde/mono tabular (`--mono`, `--income`): "R$ 1.230,00".
- [ ] 5. **Seta ▾→▴** que **gira** ao abrir (`aria-expanded`), com transição suave.
- [ ] 6. **Cards concluídos** (quando aberto) — opacos (~55%), descrição **riscada**, ✓ verde, "Pago em DD/MM"
      (mantém o que a R2 já faz; só garante o capricho visual). Não entram nas somas dos grupos.

## ✅ Critério de aceite
- [ ] Cabeçalho "Pagas" vira bloco elegante: ✅ verde + contagem em chip + total verde/mono + seta giratória.
- [ ] Ao abrir, cards concluídos riscados/opacos com data de pagamento; seta gira.
- [ ] Tokens (`--income`/`--income-soft`/`--mono`); consistente com os outros grupos; console 0; sem overflow.

## 📂 Escopo
Mexe: `js/pessoal/03-contas.js` (`acordeaoHdr`/markup das pagas) · `css/estilo.css` (`#contas-root` Pagas, aditivo).
🔒 NÃO toca: lógica de quais contas são pagas, Transacoes, negocio, `.fin-card`(1285).
