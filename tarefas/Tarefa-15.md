---
id: 15
titulo: HTML — reestruturar dashboard pessoal em 3 zonas
status: todo
modo: construtor
expert: frontend-dev
depende_de: —
---

## 🖥️ HUD — COPIAR E IMPRIMIR ANTES DE EXECUTAR

```
┌─ Mentor24h · executor-20260611-002 ──────────────────────────┐
│ 🔄 RUN ▰░░░░░░ 1/3  ·  🔨 Construtor 1/1                    │
│ 🧠 Expert ativo: frontend-dev                                 │
│ ⏳ AGORA:   Tarefa-15 · HTML dashboard pessoal — 3 zonas     │
│ ✅ Aceite:  3 zonas no DOM + mtr-dash-pessoal preservado     │
│ ⏭️ PRÓXIMA: Tarefa-16 · CSS novos componentes                │
└───────────────────────────────────────────────────────────────┘
```

> ⚠️ Executor: imprima o bloco acima **literalmente** antes de começar.
> Ao concluir: reimprima com ✅ na linha AGORA e barra avançada (▰▰░░░░░ 2/3).

## O que é
Reestruturar o bloco `<section data-pane="pessoal">` do dashboard (index.html linhas 176-299)
em 3 zonas semânticas, adicionando novos cards sem quebrar nenhum módulo existente.

## Pré-mapeamento (leitura obrigatória antes de tocar)
- `index.html:140-168` — topbar com `id="greet-h"` (NÃO tocar — saudação já é dinâmica)
- `index.html:176-299` — pane pessoal (ESCOPO desta tarefa)
- `css/estilo.css:221` — `.bento` usa `repeat(12,1fr)` — usar `col-4`, `col-8`, `col-12`
- `js/15-mentor.js:723` — `pintaBriefingDash()` depende de `id="mtr-dash-pessoal"` (PRESERVAR)

## Etapas

**Checkpoint BEFORE em index.html.**

### ZONA 1 — Fold imediato (substituir conteúdo atual do bento)

1. **`.dash-ctx col-12`** — header contextual (NOVO) — primeiro filho do bento:
```html
<div class="dash-ctx col-12">
  <div class="dash-ctx-left">
    <div class="ctx-line">
      <span class="ctx-chip ctx-hab">🔥 <span id="ctx-hab-count">2</span> hábitos feitos</span>
      <span class="ctx-sep">·</span>
      <span class="ctx-chip ctx-bill" id="ctx-bill-alert">⚡ CEMIG vence hoje</span>
      <span class="ctx-sep">·</span>
      <span class="ctx-chip ctx-cult">📚 <span id="ctx-cult-txt">67% Atomic Habits</span></span>
    </div>
  </div>
  <div class="day-ring" id="day-ring">
    <svg viewBox="0 0 58 58" width="58" height="58">
      <circle class="dr-bg" cx="29" cy="29" r="24"/>
      <circle class="dr-fill" cx="29" cy="29" r="24" id="dr-fill-arc"/>
    </svg>
    <div class="dr-label">
      <span class="dr-pct" id="dr-pct">70%</span>
      <span class="dr-sub">hoje</span>
    </div>
  </div>
</div>
```

2. **`.mentor-strip col-12`** — Mentor compacto (MOVER de col-12 no rodapé para aqui):
```html
<div class="mentor-strip col-12" id="mtr-dash-pessoal"></div>
```
> ⚠️ O `id="mtr-dash-pessoal"` DEVE estar aqui — é onde `pintaBriefingDash()` injeta o conteúdo.

3. **Hero financeiro `col-8`** — MANTER estrutura atual, só reposicionar no DOM.

4. **Contas a vencer `col-4`** — MANTER estrutura atual.

5. **Tarefas `col-12`** — era `col-4`, expandir para `col-12` para dar mais espaço à lista.

### ZONA 2 — Primeiro scroll

6. **Hábitos `col-4`** — MANTER estrutura (`.habits` / `.habit`).

7. **Treino do dia `col-8`** — NOVO card:
```html
<div class="card card-treino col-8">
  <div class="card-head">
    <div class="ico" style="background:var(--income-soft);color:var(--income)">{i:dumbbell}</div>
    <h3>Treino de hoje</h3>
    <span class="treino-badge">Ativo</span>
  </div>
  <div class="treino-ativ">💪 Peito + Tríceps</div>
  <div class="treino-chips">
    <span class="treino-chip">4 exercícios</span>
    <span class="treino-chip">45 min estimado</span>
  </div>
  <div class="treino-progress">
    <div class="treino-bar"><div class="treino-fill" style="width:65%"></div></div>
    <span class="treino-prog-txt">3 / 4 exercícios · 65%</span>
  </div>
  <button class="btn-treino" data-nav="treinos">{i:play} Continuar treino</button>
</div>
```

8. **Humor `col-4`** — MANTER estrutura `.mood-pick` + `.mood-week`.

9. **Agenda `col-8`** — MANTER estrutura `.list` + `.row`.

### ZONA 3 — Segundo scroll

10. **Card CULTURA `col-12`** — NOVO:
```html
<div class="card card-cultura col-12">
  <div class="cult-header">Cultura &amp; Aprendizado</div>
  <!-- Leitura -->
  <div class="cult-row">
    <div class="cult-ico" style="background:var(--warning-soft)">{i:book}</div>
    <div class="cult-info">
      <div class="cult-type">Leitura</div>
      <div class="cult-name" id="cult-livro-nome">Atomic Habits</div>
      <div class="cult-sub" id="cult-livro-sub">Cap. 8 de 12</div>
    </div>
    <div class="cult-right">
      <span class="cult-pct" id="cult-livro-pct">67%</span>
      <div class="cult-bar-wrap"><div class="cult-bar" id="cult-livro-bar" style="width:67%;background:var(--warning)"></div></div>
    </div>
  </div>
  <!-- Série -->
  <div class="cult-row">
    <div class="cult-ico" style="background:var(--info-soft)">{i:tv}</div>
    <div class="cult-info">
      <div class="cult-type">Série</div>
      <div class="cult-name" id="cult-serie-nome">The Bear</div>
      <div class="cult-sub" id="cult-serie-sub">Próximo: S02E05</div>
    </div>
    <div class="cult-right">
      <span class="cult-badge" id="cult-serie-ep" style="background:var(--info-soft);color:var(--info)">S02E04</span>
    </div>
  </div>
  <!-- Estudos -->
  <div class="cult-row">
    <div class="cult-ico" style="background:rgba(139,92,246,.12)">{i:star}</div>
    <div class="cult-info">
      <div class="cult-type">Estudos</div>
      <div class="cult-name" id="cult-estudo-nome">React Avançado</div>
      <div class="cult-sub" id="cult-estudo-sub">Aula 9 de 20</div>
    </div>
    <div class="cult-right">
      <span class="cult-pct" id="cult-estudo-pct">45%</span>
      <div class="cult-bar-wrap"><div class="cult-bar" id="cult-estudo-bar" style="width:45%;background:#8B5CF6"></div></div>
    </div>
  </div>
</div>
```

11. **Saúde `col-4`** — MANTER estrutura `.pill-row`.

12. **Metas `col-8`** — MANTER estrutura `.goal` (era `col-4`, expandir para `col-8`).

13. **FAB** — NOVO, fora do `.bento`, antes do fechamento de `</section>` do pane:
```html
<button class="fab" id="fab-main" title="Ação rápida">{i:plus}</button>
```

## ✅ Critério de aceite
- `.dash-ctx` no DOM com `.ctx-line` e `#day-ring`
- `.mentor-strip` com `id="mtr-dash-pessoal"` ✓ (preservado)
- Card treino `.card-treino` no DOM
- Card cultura `.card-cultura` no DOM com 3 linhas (livro, série, estudos)
- `.fab` no DOM
- Hero financeiro e Contas a vencer mantidos sem alteração de conteúdo
- Zero erros no console após carga

## 📂 Escopo
**Mexe:** index.html (linhas 176-299 — pane pessoal APENAS)
**NÃO toca:** linhas 1-175 (topbar, sidebar), linhas 300+ (negócio, híbrido), JS, CSS
