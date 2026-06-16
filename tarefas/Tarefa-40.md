---
id: 40
titulo: Smoke Playwright real + ficha do componente
status: todo
modo: sentinela
expert: smoke-visual-tester
depende_de: [32, 33, 34, 35, 36, 37, 38, 39]
---

## 🖥️ HUD — COPIAR E IMPRIMIR ANTES DE EXECUTAR

```
┌─ Mentor24h-v3 · executor-20260614-001 ───────────────────┐
│ 🔄 RUN ███████ 9/9  ·  🛡️ Sentinela 1/1                   │
│ 🧠 Expert ativo: smoke-visual-tester (+ documentador)     │
│ ⏳ AGORA:   Tarefa-40 · Smoke real + ficha                │
│ ✅ Aceite:  console 0 · overflow 0 · fluxos VERDE         │
│ ⏭️ PRÓXIMA: —fim—                                          │
└───────────────────────────────────────────────────────────┘
```

## O que é
Smoke visual REAL (Python Playwright) da tela Finanças repaginada + ficha de componente
(anti-regressão) e baixa no checklist.

## Etapas
- [ ] 1. Smoke 1280 + 360, tema claro e escuro: console 0 erros, overflow 0px.
- [ ] 2. Assertar: Saldo previsto + Reserva por dia; semanas de calendário (Vencidas→Semanas→Pagas) com subtotal e pílula "/dia"; "ESTA SEMANA" marcada.
- [ ] 3. Assertar CRUD: nova conta (recorrência/parcelas), marcar paga, editar, excluir; tap na linha abre ações.
- [ ] 4. Assertar navegação por mês (recalcula), filtros expansíveis (busca+categoria), faixa do Mentor (aparece com vencida / some sem).
- [ ] 5. Verificar tela do Negócio (Financeiro) INTACTA — `.fin-card`(1285) não afetada.
- [ ] 6. Ficha em `tarefas/componentes/3-telas/` (tela, cuidados anti-regressão, histórico) + `componentes/_index.md`. Commit. Baixa no `checklist.md`.

## ✅ Critério de aceite
- [ ] Smoke VERDE (console 0 · overflow 0px desktop+360+dark) com screenshots.
- [ ] Todos os fluxos (ritmo mês/semana, CRUD, mês, filtros, mentor) passam.
- [ ] Financeiro do Negócio não regrediu.

## 📂 Escopo
Mexe: script de smoke + screenshots + ficha em `tarefas/componentes/` + `checklist.md` · NÃO toca: código de app além do necessário p/ teste 🔒
