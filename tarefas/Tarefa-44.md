---
id: 44
titulo: Modo Mês — grupos Vencidas/Hoje/A vencer (contagem+soma), Pagas accordion riscadas, selos+data de vencimento
status: todo
modo: construtor
expert: frontend-dev
depende_de: [43]
---

## 🖥️ HUD — COPIAR E IMPRIMIR ANTES DE EXECUTAR

```
┌─ Mentor24h-v3 · executor-20260615-001 ───────────────────┐
│ 🔄 RUN ▰▰▰░░░░░ 4/8  ·  🔨 Construtor 3/5                 │
│ 🧠 Expert ativo: frontend-dev (🎨 forge nos grupos)       │
│ ⏳ AGORA:   Tarefa-44 · Modo Mês                          │
│ ✅ Aceite:  3 grupos c/ contagem+soma; pagas riscadas     │
│ ⏭️ PRÓXIMA: Tarefa-45 · Modo Semana                       │
└───────────────────────────────────────────────────────────┘
```

## O que é
O render da lista quando o toggle (T43) está em **Mês**. Reorganiza `buildLista()` (l.92-165):
hoje agrupa por semanas — no modo **Mês** agrupa por **urgência**.

## Etapas
- [ ] 1. **3 grupos por urgência**, cada um com cabeçalho `nome · N · R$ soma`:
      **🔴 Vencidas** (venc < hoje, pendentes) → **🟡 Vence hoje** → **🟠 A vencer** (futuras, crescente por dia).
      Vencidas e Hoje **sempre no topo**; A vencer ordenada crescente por data.
- [ ] 2. **Selos do card** (enriquecer `venceTxt`/`rowHTML`): "Venceu há X dias" · "Vence hoje" ·
      "Vence em Xd · DD/MM". Para conta **a receber**, usar copy de entrada: **"a receber hoje"** /
      "recebe em Xd · DD/MM" (não "vence").
- [ ] 3. **Accordion Pagas** no fim (reusa `fin-grupo-toggle`/`fin-pagas-body`, l.147-157): cabeçalho
      `✓ Pagas (N) · R$ soma — Mostrar ▾`, oculto por padrão. Itens em estado **concluído**: opacos (~55%),
      descrição **riscada**, ✓, e **data de pagamento** visível (`c.pagoEm`, T41/T46). Não entram nas somas dos grupos.
- [ ] 4. **Estado vazio** premium quando o mês/filtro não tem contas.

## ✅ Critério de aceite
- [ ] 3 grupos com cabeçalho (nome · contagem · soma); vencidas+hoje no topo, a vencer crescente.
- [ ] Selos corretos por urgência; "a receber hoje" para entradas.
- [ ] Pagas ocultas por padrão; ao expandir, riscadas/opacas + data de pagamento; fora das somas.
- [ ] Filtro dos chips (T43) afeta a lista; console 0; sem overflow.

## 📂 Escopo
Mexe: `js/pessoal/03-contas.js` (`buildLista`, `rowHTML`, `venceTxt` local se houver) · `css/estilo.css` (estado pago/riscado).
🔒 NÃO toca: `Transacoes`, `js/negocio/*`.
