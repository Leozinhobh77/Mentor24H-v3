---
id: 47
titulo: Mentor adaptativo — remover faixa do topo, criar Mentor de meta diária (rodapé + por semana) reusando o motor de voz
status: todo
modo: construtor
expert: frontend-dev
depende_de: [41, 44, 45]
---

## 🖥️ HUD — COPIAR E IMPRIMIR ANTES DE EXECUTAR

```
┌─ Mentor24h-v3 · executor-20260615-001 ───────────────────┐
│ 🔄 RUN ▰▰▰▰▰▰░░ 7/8  ·  🔨 Construtor 5/5                 │
│ 🧠 Expert ativo: frontend-dev                             │
│ ⏳ AGORA:   Tarefa-47 · Mentor adaptativo (meta diária)   │
│ ✅ Aceite:  topo removido; rodapé c/ meta; reusa voz      │
│ ⏭️ PRÓXIMA: Tarefa-48 · Smoke + auditoria                 │
└───────────────────────────────────────────────────────────┘
```

## O que é
Trocar o Mentor da tela: **sai do topo** (faixa de alertas) e **renasce no rodapé** como
**coach de meta diária** (e por semana, T45). Público-alvo: autônomo/MEI — transformar
"devo R$ 5.000" em "R$ 250/dia". **Reusa o motor de voz** de `js/15-mentor.js` (tom por persona,
anti-repetição) — NÃO criar voz paralela.

## Regra de ouro do Mentor (mês e semana)
**Sempre** citar: **quanto ainda deve** + **meta diária = total a pagar pendente ÷ dias restantes**.
- Mês → dias restantes do mês. Semana → dias restantes da semana (T45).

## Etapas
- [ ] 1. **Remover a faixa do topo** — o `mentor-strip` renderizado em `render()` (l.217-225,
      `Mentor.feed().filter(modulo==='Finanças')`). Mentor segue intacto no resto do app.
- [ ] 2. **Novo núcleo de frase** em `15-mentor.js` — adicionar id tipo `fin-metadiaria` ao `NUC`
      (3 tons: serio/descontraido/motivador, 2 variações cada) reusando `fraseDe`/`AB`/`FE`/`pick`
      (anti-repetição). Slots: total devido, dias restantes, meta/dia.
- [ ] 3. **API de meta** — expor uma função no `Mentor` (ex.: `Mentor.fraseMeta({devo, dias, contexto})`)
      que devolve a frase no tom atual, **sem** depender do feed/regras. Não quebrar o `return` do IIFE.
- [ ] 4. **Faixa Mentor rodapé (mês)** — compacta (não-gigante): frase por persona + **meta diária como
      número-herói** + micro-legenda. Calcular `meta = aPagarPendente ÷ diasRestantes` com **guarda de zero**.
- [ ] 5. **Estados adaptativos** — mês atual = meta; **passado** = retrospecto ("você fechou em X");
      **futuro** = prévia (sem meta); **tudo pago / nada a dever** = elogio ("mês fechado 👏"), sem número.
- [ ] 6. **Mentor por semana** (T45) consome a mesma API com `dias restantes da semana`.

## ✅ Critério de aceite
- [ ] Faixa do Mentor no **topo** da tela Finanças sumiu (resto do app intacto).
- [ ] Rodapé mostra frase no **tom da persona** + meta diária (número-herói).
- [ ] Frase muda por persona; usa o motor existente (sem voz duplicada).
- [ ] Estados passado/futuro/quitado adaptam corretamente; **nunca** divide por zero.
- [ ] Mentor por semana funciona com a meta da semana; console 0.

## 📂 Escopo
Mexe: `js/15-mentor.js` (núcleo + API, aditivo) · `js/pessoal/03-contas.js` (remove strip topo, renderiza rodapé).
🔒 NÃO toca: regras de outros domínios do Mentor, `js/negocio/*`, `Transacoes`.
