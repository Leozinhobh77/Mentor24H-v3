---
id: 22
titulo: Implementar render por modo + agrupamento + "+N" expansível + persistir dispensar
status: todo
modo: construtor
expert: frontend-dev
depende_de: 21
---

## O que é
Implementar o redesign aprovado (Tarefa-21) em código, **só na camada de apresentação** da tela Mentor. Reescrever/estender `render()` e `cardHTML()` em `js/15-mentor.js` e os estilos `.mtr-*` em `css/estilo.css`. **O motor de regras, `filtraModo`, `rodarRegras`, `briefing`, e toda a VOZ (`fraseDe`/NUC/AB/FE/HUMOR) permanecem intactos.**

## Etapas
1. **Backup/checkpoint** de `js/15-mentor.js` e `css/estilo.css` antes de mexer.
2. Em `js/15-mentor.js` → `render()` (linha ~652): montar o **novo layout por modo** — ler `data-mode` (já usado em `filtraModo`) e renderizar a anatomia da spec (spotlight + grupos + "+N" expansível) conforme o modo ativo (pessoal/negocio/hibrido).
3. **Agrupar o feed** por domínio (`i.modulo`) e/ou severidade (`i.severidade`), reusando `SEV`/`SEVD`. Manter `CAP`/spotlight; transformar o "+N avisos" hoje estático (linha ~680) em **bloco expansível** (clicar revela o resto).
4. **Persistir dispensar/resolvido**: hoje `dispensados` é um `Set` só de sessão (linha 3). Persistir por chave simples (localStorage `mentor.dispensados` ou no DB), reidratando no load. Aditivo — não muda a assinatura pública (`render`,`contarCriticos`,`briefing`,`feed`).
5. CSS: estender `.mtr-*` (linhas ~313–333) com as classes novas da spec; **só tokens**; responsivo 768/560/360 sem overflow/sobreposição.
6. Reaplicar handlers (`data-tom`, `data-go`, `data-x`, novo expandir) e chamar `updateMentorBadge()` ao fim, como hoje.

## ✅ Critério de aceite
- Os **3 modos** renderizam layouts distintos conforme a spec; troca de modo (Alt+1/2/3 e mode-switch) atualiza a tela.
- Feed agrupado + "+N" expande/recolhe; dispensar **persiste** entre reloads.
- Console **0 erros**; **0 overflow**; nada sobreposto (desktop + 360px).
- Motor/voz/briefing do dashboard inalterados; `pintaBriefingDash` segue funcionando.

## 📂 Escopo
- **Mexe:** `js/15-mentor.js` (`render` ~652, `cardHTML` ~641, `dispensados` linha 3, init); `css/estilo.css` (bloco `.mtr-*` ~313–333, adições).
- **NÃO toca:** array `REGRAS` (~395–618), `rodarRegras`/`filtraModo`/`briefing`/`contarCriticos`, `fraseDe`/`NUC`/`AB`/`FE`/`HUMOR`, command palette ⌘K, notificações/quick-add, `index.html` (só usa `#mentor-root` em :553), módulos de finanças/saúde/negócio.
