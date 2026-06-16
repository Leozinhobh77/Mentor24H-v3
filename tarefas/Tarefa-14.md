---
id: 14
titulo: Smoke Playwright — 3 modos + accordion + overflow + mobile
status: todo
modo: sentinela
expert: smoke-visual-tester
depende_de: 13
---

## 🖥️ HUD — COPIAR E IMPRIMIR ANTES DE EXECUTAR

```
┌─ Mentor24h · executor-20260611-001 ──────────────────────────┐
│ 🔄 RUN ▰▰▰▰░░░ 4/4  ·  🛡️ Sentinela 1/1                     │
│ 🧠 Expert ativo: smoke-visual-tester                          │
│ ⏳ AGORA:   Tarefa-14 · Smoke Playwright — 3 modos           │
│ ✅ Aceite:  12/12 asserts + console 0 erros + overflow 0px   │
│ ⏭️ PRÓXIMA: —fim—                                            │
└───────────────────────────────────────────────────────────────┘
```

> ⚠️ Executor: imprima o bloco acima **literalmente** antes de começar.
> Ao concluir: reimprima com ✅ na linha AGORA — run encerrada.

## O que é
Validação completa com Playwright real: console, overflow, accordion, modos e mobile.

## Etapas
1. Abrir o app (file:// ou servidor local)
2. Console: 0 erros no load e após interações
3. Overflow 0px: desktop, 360px, tema escuro
4. Accordion:
   - Clicar DINHEIRO → abre
   - Clicar CONEXÕES → abre CONEXÕES e fecha DINHEIRO automaticamente
   - Clicar CONEXÕES novamente → fecha
5. Modo Pessoal: ver 4 grupos pessoal; não ver grupos negócio
6. Modo Negócio: ver 3 grupos negócio; não ver grupos pessoal
7. Modo Híbrido: ver todos os grupos + separador "Negócio" visível
8. Item ativo: class .active presente + box-shadow teal visível
9. Início standalone: visível e navegável (clica → vai ao dashboard)
10. badge-estoque: id="badge-estoque" no DOM ✓
11. badge-mentor: id="badge-mentor" no DOM ✓
12. Mobile 360px: computedStyle(.nav-item).fontSize ≥ 15px; computedStyle(.field).fontSize = 16px

## ✅ Critério de aceite
- 12/12 asserts passam
- Console 0 erros
- Overflow 0px nos 3 viewports testados

## 📂 Escopo
**Mexe:** zero arquivos (só leitura + smoke)
**NÃO toca:** nenhum arquivo do projeto
