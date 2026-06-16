---
id: 59
titulo: Smoke visual real (Playwright) + auditoria R5 — abas, bug accordion, terminologia, console 0, overflow 0, regressão
status: todo
modo: sentinela
expert: smoke-visual-tester
depende_de: [57, 58]
---

## 🖥️ HUD — COPIAR E IMPRIMIR ANTES DE EXECUTAR

```
┌─ Mentor24h-v3 · executor-20260615-004 ───────────────────┐
│ 🔄 RUN ▰▰░ 3/3  ·  🛡️ Sentinela 1/1                       │
│ 🧠 Expert ativo: smoke-visual-tester                      │
│ ⏳ AGORA:   Tarefa-59 · Smoke real + auditoria R5         │
│ ✅ Aceite:  tudo VERDE com evidência                      │
│ ⏭️ PRÓXIMA: — (fim do run)                                │
└───────────────────────────────────────────────────────────┘
```

## O que é
Provar a R5 com **smoke Playwright REAL** (Python, instalado). Sem maquiar: console 0, overflow 0px,
evidência por asserção. Falha → reportar, não fechar.

## Etapas
- [ ] 1. Navegar `financas` (Pessoal); console **0 erro**; default = aba **A Pagar** ativa.
- [ ] 2. **2 cards 50/50** — só A Receber e A Pagar (sem "Todas"); largura igual; conteúdo centralizado; 1280 e **360** sem overflow.
- [ ] 3. **Abas sempre-um-ativo** — clicar A Receber ativa e desativa A Pagar (e vice-versa); a lista troca de tipo.
- [ ] 4. **Progresso** — barra + fração `pagasN/totalN` presente e coerente em cada card; `role=progressbar`.
- [ ] 5. **[BUG] Accordion** — na aba A Pagar aparece "✓ Pagas"; na aba A Receber aparece "✓ Recebidas",
      cada uma com as liquidadas do tipo. Testar nos modos **Mês e Semana**.
- [ ] 6. **Terminologia** — abrir quick-menu numa conta a receber → "Marcar como recebido"; numa a pagar → "Marcar como pago";
      selos "Pago em…/Recebido em…" conforme o tipo.
- [ ] 7. **Responsivo** — 360 e 1280, claro+escuro: overflow **0px**, sem sobreposição; nada solto.
- [ ] 8. **Regressão** — Totais/Saldo, Mentor (R4), modal, Transações e Negócio intactos.
- [ ] 9. Ficha do componente em `tarefas\componentes\` + 2 screenshots (360 + 1280).

## ✅ Critério de aceite
- [ ] 2 abas (sem Todas), default A Pagar; accordion correto por tipo nos 2 modos; terminologia certa.
- [ ] Progresso presente/acessível; console **0**; overflow **0px** (1280+360, claro+escuro); sem regressão.
- [ ] Falha → reportar (não marcar pronto).

## 📂 Escopo
Mexe: `smoke-*.py` + `tarefas\componentes\` + screenshots. 🔒 Read-only no app.
