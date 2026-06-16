---
id: 64
titulo: Visual Mentor Semanal — card em todos os blocos, cor por estado, densidade (compacto vs rico), tag + hero
status: todo
modo: forge
expert: ui-visual-designer
depende_de: [63, 61]
---

## 🖥️ HUD — COPIAR E IMPRIMIR ANTES DE EXECUTAR

```
┌─ Mentor24h-v3 · executor-20260615-005 ───────────────────┐
│ 🔄 RUN ▰▰▰▰░ 5/6  ·  🎨 Forge 2/2                          │
│ 🧠 Expert ativo: ui-visual-designer                       │
│ ⏳ AGORA:   Tarefa-64 · Visual Mentor Semanal             │
│ ✅ Aceite:  cor por estado + densidade equilibrada        │
│ ⏭️ PRÓXIMA: Tarefa-65 · Smoke + auditoria R6              │
└───────────────────────────────────────────────────────────┘
```

## O que é
Vestir os 6 estados do Mentor Semanal (T63) com acabamento premium e **sem virar mar de alerta**.

## Etapas
- [ ] 1. **Card em todos os blocos** — cada bloco de semana mostra seu Mentar (anatomia `.mtr-card` herdada da T61).
- [ ] 2. **Cor por estado** (listra `--c`): 🎯 Meta = **teal** (brand) · ⚠️ Acúmulo / ⏰ Vencidas = **âmbar suave**
      (warning, **nunca vermelho gritante**) · ✓ Fechada / 🍃 Suave = **verde** (income) · 🔮 Prévia = **teal suave**.
- [ ] 3. **Densidade (anti mar-de-alerta)** — Suave/Prévia = Mentor **compacto** (1 linha leve, sem hero, tag discreta).
      Card **rico** (mtr-card + hero + tag MENTOR) só na semana **ATUAL** e nas **Vencidas**.
- [ ] 4. **Hero de meta** — só nos estados Meta/Acúmulo (R$ X "por dia"). No Acúmulo, deixar visível o "+R$ atrasado"
      (ex: badge/linha "inclui R$ 200 que rolou"). Meta-teto (T63): se inviável, mostra a mensagem em vez do número.
- [ ] 5. **Tag "MENTOR"** (T61) nos cards ricos; nos compactos, uma marca discreta (ícone) basta.
- [ ] 6. **Premium** — alinhamentos, tokens, nada solto; responsivo 360→1280 claro+escuro, sem overflow.

## ✅ Critério de aceite
- [ ] 6 estados com cor certa (âmbar suave no atraso, nunca vermelho); Suave/Prévia compactos, atual/vencidas ricos.
- [ ] Hero só em Meta/Acúmulo; no Acúmulo dá pra ver o valor que rolou; meta-teto tratado.
- [ ] Tela não vira "mar de alerta"; tokens; sem overflow 360/1280, claro+escuro; console 0.

## 📂 Escopo
Mexe: `js/pessoal/03-contas.js` (markup por estado no `buildListaSemana`) · `css/estilo.css` (`#contas-root`, estados/densidade).
🔒 NÃO toca: a lógica/voz da T63 (consome), outras telas, `.fin-card`(1285).
