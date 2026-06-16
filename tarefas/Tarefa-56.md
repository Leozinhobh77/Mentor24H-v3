---
id: 56
titulo: Smoke visual real (Playwright) + auditoria R4 — card Mentor nas 3 personas, console 0, overflow 0, regressão
status: todo
modo: sentinela
expert: smoke-visual-tester
depende_de: [54, 55]
---

## 🖥️ HUD — COPIAR E IMPRIMIR ANTES DE EXECUTAR

```
┌─ Mentor24h-v3 · executor-20260615-003 ───────────────────┐
│ 🔄 RUN ▰▰░ 3/3  ·  🛡️ Sentinela 1/1                       │
│ 🧠 Expert ativo: smoke-visual-tester                      │
│ ⏳ AGORA:   Tarefa-56 · Smoke real + auditoria R4         │
│ ✅ Aceite:  tudo VERDE com evidência                      │
│ ⏭️ PRÓXIMA: — (fim do run)                                │
└───────────────────────────────────────────────────────────┘
```

## O que é
Provar a repaginação do card Mentor com **smoke Playwright REAL** (Python, instalado). Sem maquiar:
console 0, overflow 0px, evidência por asserção. Falha → reportar, não fechar.

## Etapas
- [ ] 1. Navegar `financas` (Pessoal); console **0 erro**; `#contas-root` montado.
- [ ] 2. **Card Mentor rodapé** — anatomia `.mtr-card` (ícone + título "Meta diária" + frase + hero único à direita).
      Assertar que o valor "/dia" aparece **uma vez só** (no hero, não na frase).
- [ ] 3. **3 personas** — alternar tom (sério/descontraído/motivador) e conferir que a frase muda, fica natural
      e **o valor não é repetido/deformado** em nenhuma.
- [ ] 4. **Mentor por semana** — mesma cara (mtr-card + hero da semana).
- [ ] 5. **Estados** — passado / futuro / tudo-pago renderizam sem hero, coerentes.
- [ ] 6. **Responsivo** — 360 e 1280, claro+escuro: overflow **0px**, sem sobreposição.
- [ ] 7. **Regressão** — restante da Finanças (R1–R3), aba Mentor, Transações e Negócio intactos.
- [ ] 8. Ficha do componente em `tarefas\componentes\` + 2 screenshots (360 + 1280).

## ✅ Critério de aceite
- [ ] Card Mentor com anatomia da aba Mentor; valor 1× só; bom nas 3 personas.
- [ ] Console **0**; overflow **0px** (1280+360, claro+escuro); sem regressão.
- [ ] Falha → reportar (não marcar pronto).

## 📂 Escopo
Mexe: `smoke-*.py` + `tarefas\componentes\` + screenshots. 🔒 Read-only no app.
