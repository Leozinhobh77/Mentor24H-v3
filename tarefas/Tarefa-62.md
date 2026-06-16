---
id: 62
titulo: Voz do card Mentor (Mês) — frase amarra deve→prazo→meta + toque humano + pool ampliado anti-repetição
status: todo
modo: construtor
expert: frontend-dev
depende_de: [61]
---

## 🖥️ HUD — COPIAR E IMPRIMIR ANTES DE EXECUTAR

```
┌─ Mentor24h-v3 · executor-20260615-005 ───────────────────┐
│ 🔄 RUN ▰▰░░░ 3/6  ·  🔨 Construtor 2/3                     │
│ 🧠 Expert ativo: frontend-dev                             │
│ ⏳ AGORA:   Tarefa-62 · Voz do card Mentor (Mês)          │
│ ✅ Aceite:  leigo entende; meta 1×; 3 tons, sem enjoar    │
│ ⏭️ PRÓXIMA: Tarefa-63 · Engenharia Mentor Semanal         │
└───────────────────────────────────────────────────────────┘
```

## O que é
A frase do Mentor do Mês (núcleo `fin-metadiaria`, `js/15-mentor.js` l.380-386) hoje não amarra os
números → leigo não entende. Reescrever pra **deixar claro** (deve → prazo → meta) e soar **humano**,
sem repetir o valor (que está no hero).

## Etapas
- [ ] 1. **Frase didática que amarra** — explicar a relação: "Você tem **R$ 10.000** a pagar e faltam
      **20 dias** — guarde a meta do dia e fecha tudo." (deve + prazo na frase; a **meta fica só no hero**).
- [ ] 2. **Toque humano por persona** — fechar com um tempero curto que muda por tom (parece gente real):
      sério (sóbrio) · descontraído (leve 👀) · motivador (energia 💪). Sem citar números.
- [ ] 3. **Pool ampliado** — ~5-6 variações por tom (hoje 2) usando `pick()` (anti-repetição já existe) →
      não enjoa. Plural/singular natural ("1 dia"/"N dias").
- [ ] 4. **Legenda do hero** — trocar "/dia" por **"por dia"** (mais claro) no card (`.fin-mentor-hero-leg`).
- [ ] 5. Garantir que a **meta aparece 1× só** (hero) — a frase referencia "a meta do dia", nunca repete o valor.

## ✅ Critério de aceite
- [ ] Uma pessoa que nunca viu o app entende: quanto deve, quantos dias faltam, quanto separar por dia.
- [ ] A frase muda por persona e soa humana; valor da meta aparece 1× (hero); legenda "por dia".
- [ ] Pool ampliado + anti-repetição (não repete a frase anterior); console 0.

## 📂 Escopo
Mexe: `js/15-mentor.js` (núcleo `fin-metadiaria`, pool) · `js/pessoal/03-contas.js` (legenda do hero, se necessário).
🔒 NÃO toca: outros núcleos/domínios do Mentor, cálculo da meta, outras telas.
