---
id: 33
titulo: Render base da tela (mockup) + cards-filtro, preservando o CRUD
status: todo
modo: forge
expert: frontend-dev
depende_de: [32]
---

## 🖥️ HUD — COPIAR E IMPRIMIR ANTES DE EXECUTAR

```
┌─ Mentor24h-v3 · executor-20260614-001 ───────────────────┐
│ 🔄 RUN ░░░░░░░ 2/9  ·  🎨 Forge 2/2                        │
│ 🧠 Expert ativo: frontend-dev                             │
│ ⏳ AGORA:   Tarefa-33 · Render base + cards-filtro        │
│ ✅ Aceite:  layout do mockup com pay/edit/del preservados │
│ ⏭️ PRÓXIMA: Tarefa-34 · Reserva por dia (mês)             │
└───────────────────────────────────────────────────────────┘
```

## O que é
Reescrever `Contas.render()` (em `js/pessoal/03-contas.js`) para o layout do mockup aprovado:
bloco `fin-resumo` com "Saldo previsto" (receber − pagar em aberto) + donut (desktop) / barra (mobile)
+ tira de cards-filtro **A pagar / A receber / Vencidas** (toggle exclusivo). A lista usa `.lrow`
real **com as ações na linha** (`.lacts`: marcar paga / editar / excluir). **Preservar 100% do CRUD**
existente (`pay`, `del`, `form` com recorrência/parcelas).

## Etapas
- [ ] 1. Substituir o cabeçalho atual (`.page-kpis` + `.toolbar` antiga) pelo `fin-resumo` (hero + donut/barra + cards-filtro).
- [ ] 2. Cards-filtro clicáveis: estado `ativo` + `aria-pressed`; toggle exclusivo (re-clique limpa).
- [ ] 3. Reusar `donut()` de `02-ui.js` (não recriar).
- [ ] 4. Lista: manter `.lrow` com ícone+cor de categoria (CATS), descrição, valor, e botões `pay`/`form`/`del` em `.lacts`.
- [ ] 5. Estados vazios por filtro (microcopy PT-BR, tom Quiet Premium). Botão "Nova conta" preservado.

## ✅ Critério de aceite
- [ ] CRUD completo funciona: criar (com recorrência/parcelas), marcar paga, editar, excluir (com confirmação).
- [ ] Cards-filtro filtram corretamente; Saldo previsto = receber − pagar (em aberto).
- [ ] Visual fiel ao mockup; sem overflow 1280/360; zero erro no console.

## 📂 Escopo
Mexe: `js/pessoal/03-contas.js` (IIFE `Contas`, `render()` e auxiliares de lista) · NÃO toca: módulo `Transacoes` (l.111+), `donut()` em 02-ui.js (só reusa) 🔒
