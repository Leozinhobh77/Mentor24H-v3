---
id: 37
titulo: Tap na linha = ação rápida (marcar paga / editar / excluir)
status: todo
modo: construtor
expert: frontend-dev
depende_de: [33]
---

## 🖥️ HUD — COPIAR E IMPRIMIR ANTES DE EXECUTAR

```
┌─ Mentor24h-v3 · executor-20260614-001 ───────────────────┐
│ 🔄 RUN ░░░░░░░ 6/9  ·  🔨 Construtor 4/6                   │
│ 🧠 Expert ativo: frontend-dev                             │
│ ⏳ AGORA:   Tarefa-37 · Tap = ação rápida                 │
│ ✅ Aceite:  tocar a linha abre paga/editar/excluir        │
│ ⏭️ PRÓXIMA: Tarefa-38 · Filtros expansíveis               │
└───────────────────────────────────────────────────────────┘
```

## O que é
Tocar/clicar numa conta abre um menu rápido com Marcar paga / Editar / Excluir, reusando
`pay`/`form`/`del`. Bom no mobile, onde os botões da linha ficam mais escondidos. Mantém a linha limpa.

## Etapas
- [ ] 1. Bind de clique na `.lrow` (ignorando cliques diretos nos botões `.lacts` se mantidos).
- [ ] 2. Menu/sheet rápido reusando `Modal`/padrão existente: ações Paga (se pendente) / Editar / Excluir.
- [ ] 3. Excluir mantém confirmação destrutiva; Paga dispara o `pay` (que registra transação).
- [ ] 4. Alvos ≥44px; acessível por teclado (Enter/Espaço na linha).

## ✅ Critério de aceite
- [ ] Tocar a linha abre as 3 ações e cada uma funciona (reusa CRUD existente).
- [ ] Excluir pede confirmação; marcar paga atualiza saldo/semana na hora.
- [ ] zero erro no console.

## 📂 Escopo
Mexe: `js/pessoal/03-contas.js` (bind + menu rápido) · NÃO toca: lógica de `pay`/`del`/`form` (só reusa) 🔒
