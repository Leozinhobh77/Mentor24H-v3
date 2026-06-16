---
id: 11
titulo: HTML sidebar — 4 grupos pessoal + 3 negócio + separador híbrido
status: todo
modo: construtor
expert: frontend-dev
depende_de: —
---

## 🖥️ HUD — COPIAR E IMPRIMIR ANTES DE EXECUTAR

```
┌─ Mentor24h · executor-20260611-001 ──────────────────────────┐
│ 🔄 RUN ▰░░░░░░ 1/4  ·  🔨 Construtor 1/2                    │
│ 🧠 Expert ativo: frontend-dev                                 │
│ ⏳ AGORA:   Tarefa-11 · HTML sidebar — 4 grupos + separador  │
│ ✅ Aceite:  data-nav preservados + badges no DOM ✓           │
│ ⏭️ PRÓXIMA: Tarefa-12 · Accordion JS MutationObserver        │
└───────────────────────────────────────────────────────────────┘
```

> ⚠️ Executor: imprima o bloco acima **literalmente** antes de começar.
> Ao concluir: reimprima com ✅ na linha AGORA e barra avançada (▰▰░░░░░ 1/4 → ▰▰░░░░░).

## O que é
Reestruturar o bloco de nav do sidebar (index.html:35–73) com a nova organização semântica
e a estrutura HTML necessária para o accordion.

## Etapas
1. Fazer checkpoint BEFORE em index.html
2. Substituir linhas 35–73 pela nova estrutura (ver Prompt completo)
3. Grupos pessoal: CONEXÕES · DINHEIRO · ROTINA · CULTURA
4. Grupos negócio: OPERAÇÃO · GESTÃO · RESULTADO
5. Standalone Início (data-nav="dashboard", data-ctx="pessoal", sem grupo)
6. Separador híbrido .nav-mode-sep (display:none inicial)
7. Assistente estático (sem chevron, sem accordion)
8. Verificar no browser: grupos aparecem, itens têm data-nav corretos

## ✅ Critério de aceite
- Todos os data-nav preservados (navigate() funciona)
- Todos os data-ctx preservados (switchMode() funciona)
- badge-estoque e badge-mentor com IDs corretos no DOM
- Estrutura .nav-group-header / .nav-items presente em todos os grupos accordion

## 📂 Escopo
**Mexe:** index.html (linhas 35–73 apenas)
**NÃO toca:** JS, CSS, qualquer linha fora de 35–73
