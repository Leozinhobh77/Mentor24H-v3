---
id: 17
titulo: Smoke Playwright — dashboard pessoal 3 zonas
status: todo
modo: sentinela
expert: smoke-visual-tester
depende_de: 16
---

## 🖥️ HUD — COPIAR E IMPRIMIR ANTES DE EXECUTAR

```
┌─ Mentor24h · executor-20260611-002 ──────────────────────────┐
│ 🔄 RUN ▰▰▰░░░░ 3/3  ·  🛡️ Sentinela 1/1                     │
│ 🧠 Expert ativo: smoke-visual-tester                          │
│ ⏳ AGORA:   Tarefa-17 · Smoke Playwright — dashboard 3 zonas │
│ ✅ Aceite:  10/10 asserts + console 0 erros + overflow 0px   │
│ ⏭️ PRÓXIMA: —fim—                                            │
└───────────────────────────────────────────────────────────────┘
```

> ⚠️ Executor: imprima o bloco acima **literalmente** antes de começar.
> Ao concluir: reimprima com ✅ — run encerrada.

## O que é
Validação completa com Playwright real: todos os novos componentes do dashboard pessoal,
console limpo, overflow 0px e tipografia mobile.

## Etapas
1. Abrir o app (file:// com servidor local ou Python http.server)
2. Navegar para o dashboard modo Pessoal
3. Rodar os 10 asserts abaixo

## 10 Asserts

| # | Assert | Como validar |
|---|--------|-------------|
| 1 | Console 0 erros | `page.on('console')` — capturar erros no load e após scroll |
| 2 | `.dash-ctx` no DOM | `page.locator('.dash-ctx').count() === 1` |
| 3 | `#day-ring` no DOM | `page.locator('#day-ring').isVisible()` |
| 4 | `.mentor-strip` tem `id="mtr-dash-pessoal"` | `page.locator('#mtr-dash-pessoal').count() === 1` |
| 5 | `.card-treino` no DOM | `page.locator('.card-treino').isVisible()` |
| 6 | `.card-cultura` no DOM com 3 `.cult-row` | `page.locator('.card-cultura .cult-row').count() === 3` |
| 7 | `.fab` visível | `page.locator('.fab').isVisible()` |
| 8 | Overflow 0px — desktop | `scrollWidth === clientWidth` em `document.body` a 1280px |
| 9 | Overflow 0px — mobile | idem a 360px viewport |
| 10 | Mobile font-size | `computedStyle('.ctx-chip').fontSize` ≥ 11px; `computedStyle('.nav-item').fontSize` ≥ 15px |

## ✅ Critério de aceite
- 10/10 asserts passam
- Console 0 erros (warnings são OK)
- Overflow 0px nos 2 viewports testados

## 📂 Escopo
**Mexe:** zero arquivos do projeto (só leitura + smoke)
**NÃO toca:** nenhum arquivo
