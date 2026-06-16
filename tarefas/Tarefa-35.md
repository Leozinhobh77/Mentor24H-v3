---
id: 35
titulo: Ritmo semanal — agrupar lista por semanas de calendário (substitui buckets)
status: todo
modo: construtor
expert: frontend-dev
depende_de: [33, 34]
---

## 🖥️ HUD — COPIAR E IMPRIMIR ANTES DE EXECUTAR

```
┌─ Mentor24h-v3 · executor-20260614-001 ───────────────────┐
│ 🔄 RUN ░░░░░░░ 4/9  ·  🔨 Construtor 2/6                   │
│ 🧠 Expert ativo: frontend-dev                             │
│ ⏳ AGORA:   Tarefa-35 · Ritmo semanal (semanas calendário)│
│ ✅ Aceite:  Vencidas→Semanas(+/dia)→Pagas; denom adaptativo│
│ ⏭️ PRÓXIMA: Tarefa-36 · Navegação por mês                 │
└───────────────────────────────────────────────────────────┘
```

## O que é
Trocar o agrupamento da lista: em vez dos buckets (hoje/esta semana/próximas), agrupar por
**semanas de calendário** (segunda→domingo reais). Nova ordem:
1. 🔴 **VENCIDAS** (vermelho, topo, fora do fluxo das semanas)
2. **Semana 1..N** do mês (seg–dom; 1ª/última parciais; 4–6 divisórias) — cada header com
   "Semana N · DD–DD mês" + chip (qtd) + subtotal a pagar + pílula "≈ R$ Y/dia".
3. ▸ **Pagas** (recolhível, rodapé).

DENOMINADOR ADAPTATIVO da pílula:
- semana **futura** → subtotal ÷ dias do segmento da semana dentro do mês (dias cheios);
- semana **atual** → subtotal ÷ dias restantes até o domingo (inclui hoje) + marca "ESTA SEMANA · faltam X dias";
- semana **passada** → sem pílula de ritmo.

## Etapas
- [ ] 1. Função que fatia o mês em semanas de calendário (seg–dom), com recortes parciais na 1ª/última.
- [ ] 2. Distribuir contas pendentes nas semanas pelo `venc`; vencidas vão ao grupo Vencidas (não às semanas).
- [ ] 3. Por semana: subtotal a pagar + cálculo do por-dia adaptativo (futura/atual/passada).
- [ ] 4. Render dos headers (range de datas, chip, subtotal, pílula) + destaque "ESTA SEMANA".
- [ ] 5. Manter grupo Pagas recolhível no rodapé (reusa o collapse do mockup).
- [ ] 6. Ao terminar: `Add-Padroes` registrando "Finanças Pessoal: lista agrupada por semanas de calendário (Vencidas→Semanas→Pagas), por-dia adaptativo — evolui o padrão 2026-06-13".

## ✅ Critério de aceite
- [ ] Mês de 31 dias gera as semanas certas (1ª/última parciais); semana cheia 700 → R$ 100/dia; atual 500 / 5 dias → R$ 100/dia.
- [ ] Vencidas sempre no topo, fora das semanas; Pagas recolhida embaixo.
- [ ] `.mural/PADROES.md` atualizado. Sem overflow 360. zero erro no console.

## 📂 Escopo
Mexe: `js/pessoal/03-contas.js` (agrupamento/lista) + `.mural/PADROES.md` (append) · NÃO toca: buckets do Negócio, `Transacoes` 🔒
