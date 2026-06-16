# Componente: Card Mentor Finanças R4

**Run:** executor-20260615-003 · Etapa 35 · Tier S
**Data:** 2026-06-15
**Status:** ✅ APROVADO (Smoke VERDE 0 erros)

## O que é
Card do Mentor na tela Finanças (Pessoal) — rodapé + por semana — repaginado com a anatomia `.mtr-card` da aba Mentor. Remove a duplicação do valor `/dia` (antes aparecia na frase E no hero).

## Anatomia (estado meta)
```
╭──────────────────────────────────────────────────────╮
│ ╭───╮  Meta diária                    ╭────────────╮ │
│ │ ✦ │  "Foca e você zera os R$3.456   │ R$ 288,00  │ │
│ ╰───╯   em 12 dias. Bora! 💪"          │    /dia    │ │
│          .mtr-t + .mtr-s (frase T54)   ╰────────────╯ │
╰──────────────────────────────────────────────────────╯
```

## Arquivos tocados
- `js/15-mentor.js` l.380-387 — NUC `fin-metadiaria` reescrito (6 frases 2×3 tons)
- `js/pessoal/03-contas.js` l.185-190 — `fin-mentor-sem` com `.mtr-card`
- `js/pessoal/03-contas.js` l.262-280 — `fin-mentor-rod` com `.mtr-card` (4 estados)
- `css/estilo.css` — append: override especificidade + `.fin-mentor-hero-val/leg`

## Classes CSS usadas
- `.mtr-card` (reutilizado da aba Mentor)
- `.mtr-ico` / `.mtr-main` / `.mtr-t` / `.mtr-s` / `.mtr-side`
- `.fin-mentor-hero-side` / `.fin-mentor-hero-val` / `.fin-mentor-hero-leg` (novo, mínimo)

## Estados
| Estado | Classe extra | Hero | Cor |
|---|---|---|---|
| Meta ativa | — | ✅ R$/dia | brand/teal |
| Mês futuro | `.fin-mentor-futuro` | ❌ | brand/teal opac.65 |
| Mês passado | `.fin-mentor-passado` | ❌ | brand/teal opac.65 |
| Tudo pago | `.fin-mentor-ok` | ❌ | income/green |

## Frases (T54) — NUC `fin-metadiaria`
Usa `d.devo` (total pendente) + `d.dias` (dias restantes). **Zero citação de `/dia` no texto.**
- sério[2]: "Restam {valor} em contas este mês, com N dia(s) pra fechar." / "{valor} em aberto — N dia(s) para quitar o mês."
- descontraído[2]: "Falta {valor} pra zerar o mês e Nd no relógio 👀" / "{valor} ainda pra fechar — Nd no relógio. Bora lá?"
- motivador[2]: "Foca e você zera os {valor} em N dia(s). Bora! 💪" / "{valor} a fechar em N dia(s). Você consegue! 🎯"

## Smoke T56 (2026-06-15)
- Console: 0 erros (1280+360, claro+escuro)
- Overflow: 0px em todos os combos
- Anatomia: `.mtr-card` + `.mtr-ico` + `.mtr-t`="Meta diária" + `.mtr-s` sem /dia ✅
- Hero: R$ 288,00 + /dia (1× só) ✅
- 3 frases distintas por persona, nenhuma com /dia ✅
- Estados futuro+passado: presentes sem hero ✅
- Regressão: aba Mentor + Transações + Negócio console 0 + overflow 0 ✅
- Screenshots: `_smoke/smoke-r4-1280.png` + `_smoke/smoke-r4-360.png`
