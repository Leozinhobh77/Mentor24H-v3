---
id: 63
titulo: Engenharia Mentor Semanal (carry-over) — modelo temporal + acúmulo + 6 estados + API fraseSemana + núcleos de voz
status: todo
modo: construtor
expert: frontend-dev
depende_de: [62]
---

## 🖥️ HUD — COPIAR E IMPRIMIR ANTES DE EXECUTAR

```
┌─ Mentor24h-v3 · executor-20260615-005 ───────────────────┐
│ 🔄 RUN ▰▰▰░░ 4/6  ·  🔨 Construtor 3/3                     │
│ 🧠 Expert ativo: frontend-dev                             │
│ ⏳ AGORA:   Tarefa-63 · Mentor Semanal (carry-over)       │
│ ✅ Aceite:  acúmulo certo + 6 estados + voz humana        │
│ ⏭️ PRÓXIMA: Tarefa-64 · Visual Mentor Semanal             │
└───────────────────────────────────────────────────────────┘
```

## O que é
O coração da R6: o Mentor de **cada bloco de semana** (`buildListaSemana`, l.170-203) com **memória de
atraso (carry-over)**. Plano completo em `tarefas\plano\plano-mentor-semanal-carryover-20260615.md` (LER).
Esta tarefa é a **lógica + a voz**; o visual é a T64.

## Etapas
- [ ] 1. **Modelo temporal por bloco** — PASSADA (`domIso<hojeIso`) · ATUAL (`estaSemanaBool`) · FUTURA (`si>hojeIso`).
- [ ] 2. **Carry-over (sem dupla contagem!)** — `atrasado` = Σ contas a pagar pendentes vencidas de semanas
      **ANTERIORES** (domingo < hoje). **NÃO** incluir as da semana atual (elas são "programado"). `atrasadoN` = qtd.
      Só a **semana ATUAL** absorve: `totalAtual = programadoAtual + atrasado`; `meta = ceil(totalAtual/diasRestSem)`.
- [ ] 3. **Meses navegados** — `estaSemanaBool` só no mês corrente. Em mês ≠ atual: **sem absorção** —
      passado = Vencida/Fechada; futuro = Prévia.
- [ ] 4. **6 estados** (remover a trava `estaSemanaBool` da l.189; decidir o estado por bloco):
      🎯 Meta (atual, a pagar, sem atraso) · ⚠️ Acúmulo (atual, atraso>0) · ⏰ Vencidas (passada, pendente) ·
      ✓ Fechada (tudo pago) · 🍃 Suave (nada a pagar) · 🔮 Prévia (futura, a pagar).
- [ ] 5. **Vocabulário consistente** — usar **"Vencidas"/"em aberto"** (igual ao grupo do modo Mês), não inventar 3º termo.
- [ ] 6. **Tom anti-culpa (sensível)** — proibido "você deixou acumular/atrasou/falhou". Usar apoio/ação:
      "rolou pra essa semana", "vamos resolver", "dá pra recuperar". Pool atraso empático (herda `SENS`), 4-6 variações/tom.
- [ ] 7. **Meta-teto (borda)** — se `diasRestSem` pequeno e meta/dia inviável, trocar o número por mensagem
      ("foco no que der essa semana"). Guarda de zero.
- [ ] 8. **Modo A Receber (versão adaptada)** — SEM meta-diária-de-esforço. Estados: Previsto ("R$ X a receber
      essa semana") · Recebido ("tudo recebido 👏") · Em aberto/vencido ("R$ X que era pra ter entrado — vale cobrar") ·
      Suave. Foco em cobrar, não em meta diária.
- [ ] 9. **Voz** — novos núcleos em `15-mentor.js` (`fin-sem-meta`, `-acumulo`, `-vencidas`, `-fechada`, `-suave`,
      `-previa`; + variantes a-receber) + API **`Mentor.fraseSemana({estado,programado,atrasado,atrasadoN,total,dias,meta,tipo})`**
      escolhendo núcleo + tom + anti-repetição (`pick`). Não quebrar o `feed`/`return` do IIFE.
- [ ] 10. **Atualização dinâmica** — confiar no `render()` (recalcula a cada pay/del); as frases ajustam sozinhas.

## ✅ Critério de aceite
- [ ] Acúmulo correto (sem dupla contagem); só a semana atual absorve; meses navegados sem absorção.
- [ ] 6 estados disparam certo; vocabulário "Vencidas" consistente; tom de apoio (zero culpa).
- [ ] Pagar uma vencida atualiza a frase ("só 1 agora"); quitar tudo → "tudo em dia".
- [ ] A Receber com a versão adaptada (sem meta diária); meta-teto tratado; console 0.

## 📂 Escopo
Mexe: `js/pessoal/03-contas.js` (`buildListaSemana` — cálculo de estado/acúmulo) · `js/15-mentor.js` (núcleos + `fraseSemana`).
🔒 NÃO toca: outras telas, Transacoes, negocio, regras de outros domínios do Mentor.
