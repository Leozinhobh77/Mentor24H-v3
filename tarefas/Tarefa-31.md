---
id: 31
titulo: Smoke real 360+1280 + edge cases + screenshots
status: todo
modo: sentinela
expert: smoke-visual-tester
depende_de: [30]
---

## 🖥️ HUD — COPIAR E IMPRIMIR ANTES DE EXECUTAR (não reescrever, não resumir)

```
┌─ Mentor24h-v3 · executor-20260613-001 ───────────────────┐
│ 🔄 RUN ▰▰▰▰▰▰ 6/6  ·  🛡️ Sentinela 1/1                   │
│ 🧠 Expert ativo: smoke-visual-tester                      │
│ ⏳ AGORA:   Tarefa-31 · smoke + edge + screenshots        │
│ ✅ Aceite:  VERDE — console 0 · overflow 0 + prints       │
│ ⏭️ PRÓXIMA: —fim—                                         │
└───────────────────────────────────────────────────────────┘
```

> ⚠️ Executor: imprima o bloco acima **literalmente** antes de começar. Ao concluir, reimprima com ✅ e barra avançada.

## O que é
Auditoria visual real (Playwright) do mockup, em mobile e desktop, com casos-limite, e **2 screenshots** pro Léo validar sem precisar abrir nada.

## Etapas (ordem natural 1→n)
- [ ] 1. Abrir `_mockups/mockup-financas.html` no Playwright (headless), viewport **360px** e **1280px**.
- [ ] 2. Assertar: **console = 0 erros**; **overflow horizontal = 0** (scrollWidth ≤ clientWidth); **sem sobreposição** dos elementos do resumo.
- [ ] 3. Conferir interação: clicar cada card-filtro filtra a lista; estado ativo aplica; collapse "Pagas" abre/fecha.
- [ ] 4. **Edge cases** (rodar com variações dos dados fake, sem quebrar): (a) 0 contas → "Tá tudo em dia ✨"; (b) só pagas → resumo zerado coerente; (c) valor gigante R$ 99.999,99 → não estoura layout; (d) saldo previsto negativo → hero em `--expense` (vermelho).
- [ ] 5. Salvar `_mockups/smoke-financas-360.png` e `_mockups/smoke-financas-1280.png`.
- [ ] 6. Veredito VERDE/VERMELHO no Relatório Final (E5) + anexar os caminhos dos screenshots.

## ✅ Critério de aceite (self-check com evidência)
- [ ] Console = 0 erros nos 2 viewports.
- [ ] Overflow horizontal = 0 em 360px e 1280px.
- [ ] Cards-filtro + collapse funcionam no teste.
- [ ] Edge cases não quebram o layout.
- [ ] 2 screenshots salvos em `_mockups\`.

## 📂 Escopo
Mexe: lê `_mockups\mockup-financas.html` (read-only) + grava `_mockups\smoke-financas-*.png` · NÃO toca: app, css, js, index.html 🔒
