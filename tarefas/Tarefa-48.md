---
id: 48
titulo: Smoke visual real (Playwright) + auditoria — console 0, overflow 0, contraste, 360/1280, claro+escuro
status: todo
modo: sentinela
expert: smoke-visual-tester
depende_de: [41, 42, 43, 44, 45, 46, 47]
---

## 🖥️ HUD — COPIAR E IMPRIMIR ANTES DE EXECUTAR

```
┌─ Mentor24h-v3 · executor-20260615-001 ───────────────────┐
│ 🔄 RUN ▰▰▰▰▰▰▰░ 8/8  ·  🛡️ Sentinela 1/1                  │
│ 🧠 Expert ativo: smoke-visual-tester                      │
│ ⏳ AGORA:   Tarefa-48 · Smoke real + auditoria            │
│ ✅ Aceite:  tudo VERDE com evidência (console/overflow 0) │
│ ⏭️ PRÓXIMA: — (fim do run)                                │
└───────────────────────────────────────────────────────────┘
```

## O que é
Provar que a tela inteira funciona, com **smoke Playwright REAL** (Python, já instalado — ver
memória "Mentor24h Smoke Visual"). Sem maquiar: console 0, overflow 0, evidência por asserção.

## Etapas
- [ ] 1. **Render base** — abrir o app, navegar `financas` (modo Pessoal). Assertar `#contas-root` montado, console **0 erro**.
- [ ] 2. **Card-dashboard (T43)** — Totais + Saldo-resultado presentes; 3 chips (A Receber/A Pagar/Todas);
      ↩ hoje aparece/desaparece conforme o mês; clicar chip filtra; `.fin-prop-bar` ausente.
- [ ] 3. **Toggle Mês/Semana (T43)** — alterna e re-renderiza sem erro; lembra a escolha.
- [ ] 4. **Modo Mês (T44)** — 3 grupos com contagem+soma; accordion Pagas abre e mostra riscadas + data pgto.
- [ ] 5. **Modo Semana (T45)** — blocos por semana com resumo; "esta semana" destacada; Mentor por semana com meta.
- [ ] 6. **Modal (T42)** — Avulso/Recorrente/Parcelado exclusivos; parcelas ≤18; Observação; desativar recorrência.
- [ ] 7. **Cards (T46)** — lápis presente; ♻️ em recorrente; cor semântica do valor; clique no card todo abre menu.
- [ ] 8. **Mentor (T47)** — faixa do **topo ausente**; rodapé com meta diária; estados (mês atual/tudo pago).
- [ ] 9. **Responsivo** — 360 e 1280, tema claro e escuro: **overflow 0px**, sem sobreposição.
- [ ] 10. **Regressão** — aba Transações e modo Negócio **intactos**.
- [ ] 11. **Ficha do componente** em `tarefas\componentes\` + 2 screenshots (360 + 1280).

## ✅ Critério de aceite
- [ ] Todas as asserções **VERDES** com evidência (sem mascarar falha).
- [ ] Console **0 erro**; overflow **0px** em 1280 e 360, claro+escuro.
- [ ] Negócio + Transações sem regressão.
- [ ] Se algo falhar: **reportar** (não marcar como pronto).

## 📂 Escopo
Mexe: scripts de smoke (`smoke-*.py`) + `tarefas\componentes\` + screenshots. 🔒 Read-only no app (não corrige — reporta).
