---
id: 54
titulo: Reescrever frases do Mentor de meta (fin-metadiaria, 3 personas) — sem citar o "/dia" (o card mostra o valor)
status: todo
modo: construtor
expert: frontend-dev
depende_de: []
---

## 🖥️ HUD — COPIAR E IMPRIMIR ANTES DE EXECUTAR

```
┌─ Mentor24h-v3 · executor-20260615-003 ───────────────────┐
│ 🔄 RUN ░░░ 1/3  ·  🔨 Construtor 1/1                       │
│ 🧠 Expert ativo: frontend-dev                             │
│ ⏳ AGORA:   Tarefa-54 · Frases fin-metadiaria             │
│ ✅ Aceite:  frase não repete o "/dia"; boa nas 3 personas │
│ ⏭️ PRÓXIMA: Tarefa-55 · Repaginar card Mentor             │
└───────────────────────────────────────────────────────────┘
```

## O que é
O núcleo `fin-metadiaria` (`js/15-mentor.js` l.380-386) hoje cita a meta no texto
("…meta de R$ 288/dia"). Como o card também mostra o valor-herói "R$ 288 /dia", o valor
aparece **2×** e formatado diferente por persona (o "estranho" que o Léo viu). Reescrever as
frases para falarem do **total devido + prazo** (motivação), **sem citar o valor/dia**.

## Slots disponíveis
`d.devo` (total a pagar pendente), `d.dias` (dias restantes), `d.meta` (R$/dia — NÃO usar mais no texto).

## Etapas
- [ ] 1. Reescrever as **2 variações × 3 tons** de `fin-metadiaria` sem `${fmt(d.meta)}/dia`. Referência:
      - **sério**: "Restam ${fmt(d.devo)} em contas este mês, com ${d.dias} ${d.dias===1?'dia':'dias'} pra fechar."
      - **descontraído**: "Falta ${fmt(d.devo)} pra zerar o mês e ${d.dias}d no relógio 👀"
      - **motivador**: "Foca e você zera os ${fmt(d.devo)} em ${d.dias} ${d.dias===1?'dia':'dias'}. Bora! 💪"
      (manter 2 variações por tom, anti-repetição via `pick`/`fraseDe`.)
- [ ] 2. Garantir naturalidade de plural/singular (`dia`/`dias`) e PT-BR fluido em cada tom.
- [ ] 3. `fraseMeta({devo,dias})` (l.786-788) segue calculando `meta` p/ compat, mas a frase não a exibe mais.

## ✅ Critério de aceite
- [ ] Nenhuma das 6 frases cita o valor "/dia".
- [ ] Frase fica boa e natural nas **3 personas** (sério/descontraído/motivador), singular e plural.
- [ ] `fraseMeta` segue funcionando (rodapé + por semana); console 0; nada quebra no feed do Mentor.

## 📂 Escopo
Mexe: `js/15-mentor.js` (núcleo `fin-metadiaria`, só os textos). 🔒 NÃO toca: outras regras/núcleos, cálculo de meta, demais domínios.
