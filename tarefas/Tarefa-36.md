---
id: 36
titulo: Navegação por mês (‹ mês ›) — recalcula semanas e reserva
status: todo
modo: construtor
expert: frontend-dev
depende_de: [35]
---

## 🖥️ HUD — COPIAR E IMPRIMIR ANTES DE EXECUTAR

```
┌─ Mentor24h-v3 · executor-20260614-001 ───────────────────┐
│ 🔄 RUN ░░░░░░░ 5/9  ·  🔨 Construtor 3/6                   │
│ 🧠 Expert ativo: frontend-dev                             │
│ ⏳ AGORA:   Tarefa-36 · Navegação por mês                 │
│ ✅ Aceite:  ‹ mês › filtra venc + recalcula semanas/reserva│
│ ⏭️ PRÓXIMA: Tarefa-37 · Tap = ação rápida                 │
└───────────────────────────────────────────────────────────┘
```

## O que é
Seletor de mês "‹ Junho ›" no topo do `fin-resumo`. Muda o mês corrente da tela; a lista,
as semanas, o Saldo previsto e a Reserva por dia recalculam para o mês escolhido.

## Etapas
- [ ] 1. Estado `mesAtivo` (YYYY-MM), default = mês de `HOJE`. Setas ‹ ›.
- [ ] 2. Filtrar `DB.contas` pelo `venc.slice(0,7) === mesAtivo` (ou critério equivalente).
- [ ] 3. Re-render: semanas do mês escolhido + Saldo + Reserva.
- [ ] 4. Reserva com "dias restantes" só no mês ATUAL; em outros meses, mostrar o ritmo cheio do mês (ou ocultar a contagem de dias-restantes). Definir e aplicar coerente.

## ✅ Critério de aceite
- [ ] Navegar entre meses mostra as contas certas e recalcula semanas/saldo/reserva.
- [ ] "Pra fechar o mês" não exibe "faltam N dias" enganoso em meses ≠ atual.
- [ ] Sem overflow 360; zero erro no console.

## 📂 Escopo
Mexe: `js/pessoal/03-contas.js` (estado mês + filtro + render) · NÃO toca: outros módulos 🔒
