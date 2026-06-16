---
id: 34
titulo: Reserva por dia (nível MÊS) — sub-linha no fin-resumo
status: todo
modo: construtor
expert: frontend-dev
depende_de: [33]
---

## 🖥️ HUD — COPIAR E IMPRIMIR ANTES DE EXECUTAR

```
┌─ Mentor24h-v3 · executor-20260614-001 ───────────────────┐
│ 🔄 RUN ░░░░░░░ 3/9  ·  🔨 Construtor 1/6                   │
│ 🧠 Expert ativo: frontend-dev                             │
│ ⏳ AGORA:   Tarefa-34 · Reserva por dia (mês)             │
│ ✅ Aceite:  R$/dia = (a pagar+vencidas)/dias restantes    │
│ ⏭️ PRÓXIMA: Tarefa-35 · Ritmo semanal                     │
└───────────────────────────────────────────────────────────┘
```

## O que é
Adicionar a sub-linha "🎯 Pra fechar o mês: R$ X/dia · faltam N dias" dentro do `fin-resumo`,
logo abaixo do "Saldo previsto". É o ritmo macro de poupança.

## Etapas
- [ ] 1. Calcular `aPagarMes` = Σ contas a pagar PENDENTES do mês corrente + Σ VENCIDAS.
- [ ] 2. Calcular `diasRestantes` = dias de hoje até o último dia do mês (inclui hoje).
- [ ] 3. `porDia = aPagarMes / diasRestantes`. Renderizar formatado (`fmt`).
- [ ] 4. Edge: `diasRestantes <= 0` (último dia) → "vence hoje: R$ <total>" (sem dividir por zero).
- [ ] 5. Sem dívida (`aPagarMes == 0`) → "Tá tranquilo, nada a reservar ✨".

## ✅ Critério de aceite
- [ ] Devo 3000 / 30 dias → R$ 100/dia; devo 5000 / 20 dias → R$ 250/dia (confere com exemplos do Léo).
- [ ] Vencidas entram no total; pagas não.
- [ ] Sem divisão por zero; estado "tranquilo" aparece quando não há a pagar.
- [ ] zero erro no console.

## 📂 Escopo
Mexe: `js/pessoal/03-contas.js` (cálculo + render da sub-linha) · NÃO toca: lógica de outros módulos 🔒
