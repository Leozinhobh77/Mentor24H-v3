---
id: 51
titulo: Card Mentor (rodapé) com identidade do Mentor — badge + ícone + realce teal (reusa .ai/.ai-badge/.mtr-spotlight)
status: todo
modo: forge
expert: ui-visual-designer
depende_de: []
---

## 🖥️ HUD — COPIAR E IMPRIMIR ANTES DE EXECUTAR

```
┌─ Mentor24h-v3 · executor-20260615-002 ───────────────────┐
│ 🔄 RUN ▰▰░░░ 3/5  ·  🎨 Forge 3/4                          │
│ 🧠 Expert ativo: ui-visual-designer                       │
│ ⏳ AGORA:   Tarefa-51 · Card Mentor (rodapé)              │
│ ✅ Aceite:  identidade Mentor (badge+ícone+realce teal)   │
│ ⏭️ PRÓXIMA: Tarefa-52 · Accordion "Pagas"                 │
└───────────────────────────────────────────────────────────┘
```

## O que é
A faixa Mentor do rodapé (`.fin-mentor-rod`, `js/pessoal/03-contas.js` l.262-276) está genérica
("card simples"). Vesti-la com a **identidade visual do Mentor** que já existe no app, pra ficar
claro que são **dicas do Mentor** e ganhar destaque. **Reusar**, não criar do zero:
`.ai`/`.ai-badge` (l.306-310 do CSS) e o destaque do `.mtr-spotlight` (l.333-337).

## Esboço aprovado
```
  ╭─────────────────────────────────────────────╮
  │ ╭───╮  🧭 MENTOR  ·  tom: Parceiro            │  ← badge + ícone
  │ │🧭 │  "Léo, faltam 20 dias e há R$ 5.000 em  │
  │ ╰───╯   aberto — dá pra fechar no azul. 💪"   │
  │        🎯 Meta diária       R$ 250,00 / dia   │  ← número-herói
  ╰─────────────────────────────────────────────╯
     ▲ realce teal + leve sombra
```

## Etapas
- [ ] 1. **Badge "🧭 Mentor"** no topo do card (reusar `.ai-badge` — ícone + texto, fundo `--brand-soft`, cor `--brand-text`).
      **Só o badge** (não usar badge + tag flutuante juntos — evita redundância).
- [ ] 2. **Ícone do Mentor** num quadradinho teal (estilo `.mtr-ico`) à esquerda da frase, se couber bem.
- [ ] 3. **Realce/destaque** — aplicar o tratamento do `.ai`/`.mtr-spotlight`: fundo gradiente `--brand-soft`,
      borda teal, leve sombra. Sai do "card simples".
- [ ] 4. **Manter** a frase por persona (`fin-mentor-rod-frase`) + a **meta diária herói** (`fin-mentor-rod-hero`)
      e os 4 estados (meta atual / passado / futuro / tudo-pago, l.262-276) — só reveste, não muda a lógica.
- [ ] 5. Aplicar a mesma identidade ao **Mentor por semana** (T45/`buildListaSemana`, l.186-187) para consistência.

## ✅ Critério de aceite
- [ ] Card do Mentor tem badge "🧭 Mentor" + ícone + realce teal — claramente "é o Mentor".
- [ ] Reusa classes existentes (`.ai`/`.ai-badge`/`.mtr-*`), não cria estilo do zero; só badge (sem tag dupla).
- [ ] Frase + meta-herói + 4 estados preservados; Mentor por semana com a mesma cara.
- [ ] Tokens; sem overflow 360/1280, claro+escuro; console 0.

## 📂 Escopo
Mexe: `js/pessoal/03-contas.js` (markup `fin-mentor-rod` + mentor por semana) · `css/estilo.css` (aditivo, reusa identidade).
🔒 NÃO toca: a lógica de meta/estados (T47 da R2), regras do Mentor, Transacoes, negocio.
