---
id: 12
titulo: Accordion JS + separador híbrido MutationObserver
status: todo
modo: construtor
expert: frontend-dev
depende_de: 11
---

## 🖥️ HUD — COPIAR E IMPRIMIR ANTES DE EXECUTAR

```
┌─ Mentor24h · executor-20260611-001 ──────────────────────────┐
│ 🔄 RUN ▰▰░░░░░ 2/4  ·  🔨 Construtor 2/2                    │
│ 🧠 Expert ativo: frontend-dev                                 │
│ ⏳ AGORA:   Tarefa-12 · Accordion JS + separador híbrido     │
│ ✅ Aceite:  accordion abre/fecha + separador só em híbrido   │
│ ⏭️ PRÓXIMA: Tarefa-13 · CSS premium sidebar                  │
└───────────────────────────────────────────────────────────────┘
```

> ⚠️ Executor: imprima o bloco acima **literalmente** antes de começar.
> Ao concluir: reimprima com ✅ na linha AGORA e barra avançada.

## O que é
Adicionar o JavaScript do accordion sidebar e lógica do separador híbrido em js/01-core.js,
SEM alterar nenhuma linha existente.

## Etapas
1. Fazer checkpoint BEFORE em js/01-core.js
2. Localizar linha 169 (fim do IIFE do bottom nav)
3. Inserir o bloco initSidebarAccordion() após a linha 169 (ver Prompt completo)
4. Testar: clicar em grupo → abre; clicar em outro → fecha o anterior
5. Testar: trocar modo → grupo do item ativo abre automaticamente
6. Testar: modo híbrido → separador .nav-mode-sep aparece

## ✅ Critério de aceite
- Accordion funciona: abre 1, fecha os outros
- Estado inicial: grupo da página ativa abre em 50ms
- Separador híbrido: visível só em modo híbrido
- navigate() e switchMode() continuam funcionando normalmente
- Console sem erros

## 📂 Escopo
**Mexe:** js/01-core.js (só ADICIONAR após linha 169, zero edição de código existente)
**NÃO toca:** index.html, CSS, outros arquivos JS
