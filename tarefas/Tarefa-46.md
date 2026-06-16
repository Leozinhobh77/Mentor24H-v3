---
id: 46
titulo: Cards de conta — lápis (affordance), selo recorrente ♻️, data de pagamento, cor semântica do valor
status: todo
modo: forge
expert: ui-visual-designer
depende_de: [44]
---

## 🖥️ HUD — COPIAR E IMPRIMIR ANTES DE EXECUTAR

```
┌─ Mentor24h-v3 · executor-20260615-001 ───────────────────┐
│ 🔄 RUN ▰▰▰▰▰░░░ 6/8  ·  🎨 Forge 2/2                       │
│ 🧠 Expert ativo: ui-visual-designer                       │
│ ⏳ AGORA:   Tarefa-46 · Cards de conta (visual)           │
│ ✅ Aceite:  lápis + ♻️ + data pgto + cor semântica        │
│ ⏭️ PRÓXIMA: Tarefa-47 · Mentor adaptativo                 │
└───────────────────────────────────────────────────────────┘
```

## O que é
Polir o `rowHTML(c)` (l.72-89) — cada card de conta fica mais legível e com affordances claras.
Card cresce **só o necessário** (não gigante).

## Etapas
- [ ] 1. **Lápis (affordance)** — ícone `svg('pencil')` discreto no card, **só visual** (sinaliza que dá
      pra editar). O clique continua no **card inteiro** (abre o quick-menu, l.184-188) — o lápis NÃO é o único alvo.
- [ ] 2. **Selo ♻️ recorrente** — marca visual quando `c.recorrente && c.recorrenteAtivo` (hoje há um `↺`
      tímido na l.78 — elevar para selo claro). Parcelado mantém o selo "i/18".
- [ ] 3. **Data de pagamento** — quando `status==='paga'`, mostrar "Pago em DD/MM" (de `c.pagoEm`, T41).
      Crescer o card o mínimo para caber.
- [ ] 4. **Cor semântica do valor** (tokens, zero hardcode):
      - a **receber** → `--income` (verde)
      - a pagar **vencida** → `--expense` (vermelho)
      - a pagar **vence hoje** → `--warning` (âmbar forte)
      - a pagar **a vencer** (futuro) → `--warning` em tom suave (pendência)
      - **paga** → cinza/opaco (estado concluído, T44)
- [ ] 5. Garantir canal duplo (cor + ícone/selo) para acessibilidade (não depender só de cor).

## ✅ Critério de aceite
- [ ] Lápis visível em cada card; clique segue funcionando no card todo (não só no lápis).
- [ ] ♻️ aparece em recorrentes ativas; "i/18" em parceladas.
- [ ] Pagas mostram "Pago em DD/MM"; card não fica gigante.
- [ ] Valor colore pela regra (via tokens); contraste AA; console 0; sem overflow.

## 📂 Escopo
Mexe: `js/pessoal/03-contas.js` (`rowHTML`) · `css/estilo.css` (cor/affordance, aditivo).
🔒 NÃO toca: `Transacoes`, `js/negocio/*`, `.fin-card` do Negócio.
