---
id: 24
titulo: Reinserir a mentor-strip #mtr-dash-pessoal no dashboard pessoal
status: todo
modo: construtor
expert: frontend-dev
depende_de: —
---

## O que é
Corrigir regressão (lição mural `licao-005`): o card "Mentor · seu dia" não aparece em nenhum dashboard porque o elemento `#mtr-dash-pessoal` sumiu do `index.html`. A função `pintaBriefingDash()` em `js/15-mentor.js:723` procura `#mtr-dash-pessoal` (+ negocio/hibrido) e faz **no-op silencioso** quando não acha. O CSS já existe (`.mentor-strip` linha 1347, `.card.ai .brf-spot` linha 367, `.ai-badge` linha 307) — falta só o HTML. Restaurar **apenas o pessoal** (Negócio/Híbrido foram removidos de propósito na Etapa 28).

## Etapas
1. **Backup/checkpoint** de `index.html`.
2. No pane pessoal do dashboard (`index.html` → `<section class="page show" data-page="dashboard">` :173 → `<section class="mode-pane show" data-pane="pessoal">` :176, dentro de `<div class="bento">`), na **ZONA 1** (após o HERO/Contas, antes ou logo após "Tarefas de hoje"), inserir:
   `<div class="card ai mentor-strip col-12" id="mtr-dash-pessoal"></div>`
   (classes `card ai` são necessárias: o briefing usa o seletor `.card.ai .brf-spot`.)
3. Não mexer em `js/15-mentor.js` — `pintaBriefingDash()` já é chamada no boot (:915) e preenche o card via `briefingHTML(Mentor.briefing('pessoal',3))`.
4. Abrir o app no modo Pessoal e confirmar que o card renderiza (spotlight + chips + "Ver tudo no Mentor").

## ✅ Critério de aceite
- `#mtr-dash-pessoal` presente no pane pessoal; card "Mentor · seu dia" renderiza com conteúdo.
- Botões do card navegam (data-go) pra tela Mentor / telas-alvo.
- Console 0 erros; sem overflow/sobreposição (1280 + 360px).
- Negócio e Híbrido **permanecem sem strip** (decisão da Etapa 28 respeitada).

## 📂 Escopo
- **Mexe:** `index.html` (pane pessoal do dashboard, Zona 1) — inserir 1 elemento.
- **NÃO toca:** panes Negócio/Híbrido, `js/15-mentor.js`, `css/estilo.css`, motor de regras.
