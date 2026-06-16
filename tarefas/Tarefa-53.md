---
id: 53
titulo: Smoke visual real (Playwright) + auditoria da R3 — console 0, overflow 0, 360/1280 claro+escuro, regressão
status: todo
modo: sentinela
expert: smoke-visual-tester
depende_de: [49, 50, 51, 52]
---

## 🖥️ HUD — COPIAR E IMPRIMIR ANTES DE EXECUTAR

```
┌─ Mentor24h-v3 · executor-20260615-002 ───────────────────┐
│ 🔄 RUN ▰▰▰▰░ 5/5  ·  🛡️ Sentinela 1/1                     │
│ 🧠 Expert ativo: smoke-visual-tester                      │
│ ⏳ AGORA:   Tarefa-53 · Smoke real + auditoria R3         │
│ ✅ Aceite:  tudo VERDE com evidência                      │
│ ⏭️ PRÓXIMA: — (fim do run)                                │
└───────────────────────────────────────────────────────────┘
```

## O que é
Provar os 4 ajustes visuais da R3 com **smoke Playwright REAL** (Python, instalado). Sem maquiar:
console 0, overflow 0px, evidência por asserção. Reportar falha — não marcar pronto.

## Etapas
- [ ] 1. Navegar `financas` (Pessoal); console **0 erro**; `#contas-root` montado.
- [ ] 2. **T49** — 3 chips em cards quadrados na mesma linha (rótulo topo / valor base); ordem A Receber·A Pagar·Todas;
      Todas default ativo; clicar filtra; checar em 1280 e **360** (sem overflow/corte).
- [ ] 3. **T50** — toggle Mês/Semana centralizado e maior; alterna sem erro.
- [ ] 4. **T51** — card Mentor do rodapé com badge "Mentor" + realce teal; idem no Mentor por semana.
- [ ] 5. **T52** — accordion "Pagas" com ✅ verde + contagem em chip + total verde/mono + seta gira ao abrir;
      cards concluídos riscados/opacos com "Pago em DD/MM".
- [ ] 6. **Responsivo** — 360 e 1280, claro+escuro: overflow **0px**, sem sobreposição.
- [ ] 7. **Regressão** — aba Transações e modo Negócio intactos; lógica da R2 (totais/recorrência/Mentor) não quebrou.
- [ ] 8. Ficha do componente em `tarefas\componentes\` + 2 screenshots (360 + 1280).

## ✅ Critério de aceite
- [ ] Asserções **VERDES** com evidência; console **0**; overflow **0px** (1280+360, claro+escuro).
- [ ] Sem regressão no resto do app.
- [ ] Falha → reportar (não fechar como pronto).

## 📂 Escopo
Mexe: `smoke-*.py` + `tarefas\componentes\` + screenshots. 🔒 Read-only no app (audita, não corrige).
