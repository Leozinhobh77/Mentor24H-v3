---
id: 19
titulo: Smoke Playwright — panes Híbrido e Negócio (9 asserts)
status: todo
modo: sentinela
expert: smoke-visual-tester
depende_de: 18
---

## 🖥️ HUD — COPIAR E IMPRIMIR ANTES DE EXECUTAR

```
┌─ Mentor24h · executor-20260611-003 ──────────────────────────┐
│ 🔄 RUN ▰▰░░░░░ 2/2  ·  🛡️ Sentinela 1/1                     │
│ 🧠 Expert ativo: smoke-visual-tester                          │
│ ⏳ AGORA:   Tarefa-19 · Smoke Playwright — Híbrido+Negócio   │
│ ✅ Aceite:  9/9 asserts + console 0 erros + overflow 0px     │
│ ⏭️ PRÓXIMA: —fim—                                            │
└───────────────────────────────────────────────────────────────┘
```

> ⚠️ Executor: imprima o bloco acima **literalmente** antes de começar.
> Ao concluir: reimprima com ✅ — run encerrada.

## O que é
Validação com Playwright real: confirmar que os mentor strips foram removidos sem quebrar nada, console limpo nos 3 modos e overflow 0px nos 2 novos panes.

## 9 Asserts

| # | Assert | Como validar |
|---|--------|-------------|
| 1 | Console 0 erros — modo Pessoal | `page.on('console')` capturar erros no load |
| 2 | Console 0 erros — modo Negócio | navegar para negócio, sem erros |
| 3 | Console 0 erros — modo Híbrido | navegar para híbrido, sem erros |
| 4 | `#mtr-dash-negocio` ausente do DOM | `page.locator('#mtr-dash-negocio').count() === 0` |
| 5 | `#mtr-dash-hibrido` ausente do DOM | `page.locator('#mtr-dash-hibrido').count() === 0` |
| 6 | Overflow 0px — Negócio desktop | `scrollWidth === clientWidth` em `document.body` a 1280px |
| 7 | Overflow 0px — Negócio mobile | idem a 360px |
| 8 | Overflow 0px — Híbrido desktop | `scrollWidth === clientWidth` a 1280px |
| 9 | Overflow 0px — Híbrido mobile | idem a 360px |

## ✅ Critério de aceite
- 9/9 asserts passam
- Console 0 erros nos 3 modos (warnings são OK)
- Overflow 0px nos 4 viewports testados

## 📂 Escopo
**Mexe:** zero arquivos do projeto (só leitura + smoke)
**NÃO toca:** nenhum arquivo
