---
id: 18
titulo: HTML — remover mentor strips + zone comments (Negócio e Híbrido)
status: todo
modo: construtor
expert: frontend-dev
depende_de: —
---

## 🖥️ HUD — COPIAR E IMPRIMIR ANTES DE EXECUTAR

```
┌─ Mentor24h · executor-20260611-003 ──────────────────────────┐
│ 🔄 RUN ▰░░░░░░ 1/2  ·  🔨 Construtor 1/1                    │
│ 🧠 Expert ativo: frontend-dev                                 │
│ ⏳ AGORA:   Tarefa-18 · HTML panes Híbrido e Negócio         │
│ ✅ Aceite:  mentor strips removidos + zone comments OK        │
│ ⏭️ PRÓXIMA: Tarefa-19 · Smoke Playwright                     │
└───────────────────────────────────────────────────────────────┘
```

> ⚠️ Executor: imprima o bloco acima **literalmente** antes de começar.
> Ao concluir: reimprima com ✅ na linha AGORA e barra avançada (▰▰░░░░░ 2/2).

## O que é
Limpeza cirúrgica de `index.html`: remover os cards mentor strip dos panes Negócio e Híbrido (mesmo padrão já aplicado ao Pessoal) e adicionar comentários de zona semânticos (Zona 1 / Zona 2) em ambos os panes. Zero CSS novo, zero JS novo, zero novos cards.

## Etapas

**Checkpoint BEFORE em index.html.**

### PANE NEGÓCIO (linhas 365-408)

1. **Remover as 2 linhas** do mentor strip (linha ~404-405):
```
          <!-- Mentor · seu dia (briefing real — Etapa 14) -->
          <div class="card ai col-12" id="mtr-dash-negocio"></div>
```

2. **Adicionar** `<!-- ── ZONA 1: Fold imediato ── -->` logo após `<div class="bento">` (antes do Hero vendas).

3. **Adicionar** `<!-- ── ZONA 2: Primeiro scroll ── -->` antes do card "Últimas vendas" (col-5).

### PANE HÍBRIDO (linhas 410-479)

4. **Remover as 2 linhas** do mentor strip (linha ~475-476):
```
          <!-- Mentor · seu dia (briefing real — Etapa 14) -->
          <div class="card ai col-12" id="mtr-dash-hibrido"></div>
```

5. **Adicionar** `<!-- ── ZONA 1: Fold imediato ── -->` logo após `<div class="bento">` (antes dos 2 heroes).

6. **Adicionar** `<!-- ── ZONA 2: Primeiro scroll ── -->` antes do card Metas (col-4).

## ✅ Critério de aceite
- `#mtr-dash-negocio` ausente do DOM
- `#mtr-dash-hibrido` ausente do DOM
- Zone comments visíveis em ambos os panes
- Zero erros no console

## 📂 Escopo
**Mexe:** index.html (linhas 365-408 e 410-479)
**NÃO toca:** linhas 1-364, linhas 480+, JS, CSS
