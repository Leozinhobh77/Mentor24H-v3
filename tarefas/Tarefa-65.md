---
id: 65
titulo: Smoke visual real (Playwright) + auditoria R6 — carry-over, 6 estados, 3 tons, console 0, overflow 0, regressão
status: todo
modo: sentinela
expert: smoke-visual-tester
depende_de: [60, 61, 62, 63, 64]
---

## 🖥️ HUD — COPIAR E IMPRIMIR ANTES DE EXECUTAR

```
┌─ Mentor24h-v3 · executor-20260615-005 ───────────────────┐
│ 🔄 RUN ▰▰▰▰▰ 6/6  ·  🛡️ Sentinela 1/1                     │
│ 🧠 Expert ativo: smoke-visual-tester                      │
│ ⏳ AGORA:   Tarefa-65 · Smoke real + auditoria R6         │
│ ✅ Aceite:  tudo VERDE com evidência                      │
│ ⏭️ PRÓXIMA: — (fim do run)                                │
└───────────────────────────────────────────────────────────┘
```

## O que é
Provar a R6 com **smoke Playwright REAL** (Python, instalado). Sem maquiar: console 0, overflow 0px,
evidência por asserção. Carry-over é lógica → testar com cenários montados. Falha → reportar.

## Etapas
- [ ] 1. Navegar `financas` (Pessoal); console **0 erro**.
- [ ] 2. **T60** — modo Mês: aba A Pagar → accordion "Contas Pagas"; aba A Receber → "Contas Recebidas".
      Modo Semana: rodapé Mentor **ausente** (só os por-semana).
- [ ] 3. **T61** — card Mentor com listra teal (igual aba Mentor) + tag "MENTOR"; zero estilo legado.
- [ ] 4. **T62** — frase do Mentor (Mês) amarra deve→prazo→meta; meta 1× (hero); legenda "por dia"; muda por tom.
- [ ] 5. **T63/T64 carry-over** — montar cenário: Semana 1 com contas a pagar não pagas (passada) → bloco "Vencidas";
      semana atual mostra **Acúmulo** (programado + atrasado, sem dupla contagem) com meta recalculada;
      pagar 1 vencida → frase atualiza; quitar tudo → "tudo em dia". Estados Suave/Prévia/Fechada conforme dados.
- [ ] 6. **3 tons** — alternar sério/descontraído/motivador: frases mudam, naturais, **sem vocabulário de culpa**.
- [ ] 7. **Cor/densidade** — atraso em âmbar suave (não vermelho); Suave/Prévia compactos; atual/Vencidas ricos. Sem "mar de alerta".
- [ ] 8. **A Receber/Semana** — versão adaptada (sem meta diária; foco em cobrar).
- [ ] 9. **Responsivo** — 360 e 1280, claro+escuro: overflow **0px**, sem sobreposição.
- [ ] 10. **Regressão** — Totais/Saldo, modo Mês, modal, aba Mentor, Transações, Negócio, **outras telas** intactos.
- [ ] 11. Ficha do componente + 2 screenshots (360 + 1280).

## ✅ Critério de aceite
- [ ] Carry-over correto (sem dupla contagem; só semana atual absorve); 6 estados; atualização ao pagar.
- [ ] Tom de apoio (zero culpa); cor âmbar suave; densidade equilibrada; A Receber adaptado.
- [ ] Console **0**; overflow **0px** (1280+360, claro+escuro); sem regressão (inclui outras telas).
- [ ] Falha → reportar (não marcar pronto).

## 📂 Escopo
Mexe: `smoke-*.py` + `tarefas\componentes\` + screenshots. 🔒 Read-only no app.
