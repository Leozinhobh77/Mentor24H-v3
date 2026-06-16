---
id: 39
titulo: Faixa do Mentor no topo da tela Finanças (consome Mentor.feed)
status: todo
modo: construtor
expert: frontend-dev
depende_de: [33]
---

## 🖥️ HUD — COPIAR E IMPRIMIR ANTES DE EXECUTAR

```
┌─ Mentor24h-v3 · executor-20260614-001 ───────────────────┐
│ 🔄 RUN ░░░░░░░ 8/9  ·  🔨 Construtor 6/6                   │
│ 🧠 Expert ativo: frontend-dev                             │
│ ⏳ AGORA:   Tarefa-39 · Faixa do Mentor                   │
│ ✅ Aceite:  insights dominio Finanças no topo; some se 0  │
│ ⏭️ PRÓXIMA: Tarefa-40 · Smoke + ficha                     │
└───────────────────────────────────────────────────────────┘
```

## O que é
Faixa do Mentor no topo da página `financas`, reusando o componente mentor-strip, mostrando os
insights de `Mentor.feed()` com `dominio === 'Finanças'` (ex.: contas vencidas / a vencer).
**Apenas consome — não cria nem edita regra** em `15-mentor.js`.

## Etapas
- [ ] 1. Em `Contas.render()`, obter `Mentor.feed().filter(i => i.dominio === 'Finanças')`.
- [ ] 2. Renderizar a faixa (reusar visual mentor-strip já existente) acima do `fin-resumo`.
- [ ] 3. Ação do insight (ex.: "Ver contas") navega/realça conforme já definido no insight.
- [ ] 4. Faixa some quando não há insight de Finanças (sem placeholder vazio).

## ✅ Critério de aceite
- [ ] Com conta vencida/a vencer, a faixa aparece com o insight certo; sem nenhum, some.
- [ ] Nenhuma regra de `15-mentor.js` foi alterada.
- [ ] Sem overflow 360; zero erro no console.

## 📂 Escopo
Mexe: `js/pessoal/03-contas.js` (consumir + render da faixa) · NÃO toca: regras de `js/15-mentor.js` 🔒
