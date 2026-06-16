---
id: 16
titulo: CSS — novos componentes do dashboard pessoal
status: todo
modo: forge
expert: ui-visual-designer
depende_de: 15
---

## 🖥️ HUD — COPIAR E IMPRIMIR ANTES DE EXECUTAR

```
┌─ Mentor24h · executor-20260611-002 ──────────────────────────┐
│ 🔄 RUN ▰▰░░░░░ 2/3  ·  🎨 Forge 1/1                         │
│ 🧠 Expert ativo: ui-visual-designer                           │
│ ⏳ AGORA:   Tarefa-16 · CSS novos componentes dashboard       │
│ ✅ Aceite:  3 zonas estilizadas + anel + FAB + mobile OK      │
│ ⏭️ PRÓXIMA: Tarefa-17 · Smoke Playwright                     │
└───────────────────────────────────────────────────────────────┘
```

> ⚠️ Executor: imprima o bloco acima **literalmente** antes de começar.
> Ao concluir: reimprima com ✅ na linha AGORA e barra avançada (▰▰▰░░░░ 3/3).

## O que é
Adicionar os estilos CSS dos novos componentes do dashboard pessoal ao final de `css/estilo.css`.
ZERO edição de regras existentes — apenas APPEND.

## Pré-mapeamento (leitura obrigatória antes de tocar)
- `css/estilo.css` fim atual — adicionar APÓS a última linha
- Tokens disponíveis: `--brand`, `--brand-soft`, `--brand-text`, `--income`, `--income-soft`,
  `--warning`, `--warning-soft`, `--info`, `--info-soft`, `--expense`, `--expense-soft`,
  `--surface-1..3`, `--border`, `--text-1..4`, `--shadow-sm`, `--shadow-md`, `--r-sm..xl`,
  `--s-1..10`, `--ease`
- Classes existentes para REUSAR (não recriar): `.card`, `.card-head`, `.bento`, `.col-*`,
  `.hero`, `.hero-stats`, `.list`, `.row`, `.goal`, `.bar`, `.task`, `.habits`, `.habit`,
  `.mood-pick`, `.mood-week`, `.pill-row`

## Etapas

**Checkpoint BEFORE em css/estilo.css.**

Adicionar ao final do arquivo o bloco completo abaixo:

```css
/* ══════════════════════════════════════════════════════
   DASHBOARD PESSOAL — ETAPA 27 (novos componentes)
══════════════════════════════════════════════════════ */

/* ── HEADER CONTEXTUAL ── */
.dash-ctx{
  display:flex;align-items:center;justify-content:space-between;
  background:linear-gradient(135deg,var(--brand) 0%,#00B5A3 60%,#009E8E 100%);
  border-radius:var(--r-lg);padding:var(--s-5) var(--s-5);
  box-shadow:0 4px 20px rgba(0,168,150,.25);
  position:relative;overflow:hidden;
}
.dash-ctx::before{content:'';position:absolute;top:-30px;right:-20px;width:100px;height:100px;border-radius:50%;background:rgba(255,255,255,.08);}
.ctx-line{display:flex;flex-wrap:wrap;gap:var(--s-2);align-items:center;position:relative;z-index:1;}
.ctx-chip{font-size:12px;font-weight:600;color:rgba(255,255,255,.92);background:rgba(255,255,255,.15);padding:3px 10px;border-radius:var(--r-full);}
.ctx-sep{color:rgba(255,255,255,.4);font-size:12px;}

/* ── ANEL DO DIA ── */
.day-ring{width:56px;height:56px;position:relative;flex-shrink:0;}
.day-ring svg{transform:rotate(-90deg);}
.dr-bg{fill:none;stroke:rgba(255,255,255,.2);stroke-width:4;}
.dr-fill{fill:none;stroke:#fff;stroke-width:4;stroke-linecap:round;
  stroke-dasharray:150.8;stroke-dashoffset:45;
  animation:ring-in .8s var(--ease) forwards;}
@keyframes ring-in{from{stroke-dashoffset:150.8}to{stroke-dashoffset:45}}
.dr-label{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#fff;}
.dr-pct{font-size:13px;font-weight:800;line-height:1;}
.dr-sub{font-size:8px;opacity:.75;font-weight:700;text-transform:uppercase;letter-spacing:.04em;}

/* ── MENTOR STRIP ── */
.mentor-strip{
  background:var(--surface-1);border-radius:var(--r-lg);
  padding:var(--s-4) var(--s-4);box-shadow:var(--shadow-sm);
  border-left:3px solid var(--brand);
  min-height:20px;
}
/* conteúdo injetado por pintaBriefingDash() — não estilizar internamente aqui */

/* ── TREINO DO DIA ── */
.card-treino .treino-badge{
  font-size:10px;font-weight:700;padding:2px 9px;border-radius:var(--r-full);
  background:var(--income-soft);color:var(--income);margin-left:auto;
}
.card-treino .treino-ativ{font-size:14px;font-weight:700;color:var(--text-1);margin:var(--s-3) 0 var(--s-2);}
.treino-chips{display:flex;gap:var(--s-2);flex-wrap:wrap;margin-bottom:var(--s-3);}
.treino-chip{font-size:11px;font-weight:600;color:var(--text-3);background:var(--surface-2);padding:3px 9px;border-radius:var(--r-sm);}
.treino-progress{margin-bottom:var(--s-3);}
.treino-bar{height:5px;background:var(--surface-3);border-radius:var(--r-full);overflow:hidden;margin-bottom:5px;}
.treino-fill{height:100%;border-radius:var(--r-full);background:linear-gradient(90deg,var(--income),#34D399);transition:width .8s var(--ease);}
.treino-prog-txt{font-size:11px;color:var(--text-3);font-weight:600;}
.btn-treino{
  width:100%;padding:10px;border-radius:var(--r-md);border:none;cursor:pointer;
  background:var(--income-soft);color:var(--income);
  font-size:13px;font-weight:700;font-family:var(--font);
  display:flex;align-items:center;justify-content:center;gap:7px;
  transition:.16s var(--ease);
}
.btn-treino:hover{background:var(--income);color:#fff;}
.btn-treino svg{width:14px;height:14px;stroke-width:2.5;}

/* ── CARD CULTURA ── */
.card-cultura{background:var(--surface-1);border-radius:var(--r-lg);padding:var(--s-4);box-shadow:var(--shadow-sm);}
.cult-header{
  font-size:10px;font-weight:800;color:#8B5CF6;text-transform:uppercase;letter-spacing:.1em;
  margin-bottom:var(--s-4);display:flex;align-items:center;gap:var(--s-2);
}
.cult-header::after{content:'';flex:1;height:1px;background:rgba(139,92,246,.15);}
.cult-row{display:flex;align-items:center;gap:var(--s-3);padding:var(--s-3) 0;}
.cult-row:not(:last-child){border-bottom:1px solid var(--border);}
.cult-ico{width:34px;height:34px;border-radius:10px;display:grid;place-items:center;flex-shrink:0;}
.cult-ico svg{width:16px;height:16px;stroke-width:2;}
.cult-info{flex:1;min-width:0;}
.cult-type{font-size:9px;font-weight:700;color:var(--text-4);text-transform:uppercase;letter-spacing:.07em;}
.cult-name{font-size:13px;font-weight:700;color:var(--text-1);margin-top:1px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.cult-sub{font-size:11px;color:var(--text-3);margin-top:1px;}
.cult-right{text-align:right;flex-shrink:0;}
.cult-pct{font-size:13px;font-weight:800;color:var(--text-1);display:block;}
.cult-bar-wrap{width:48px;height:4px;background:var(--surface-3);border-radius:var(--r-full);overflow:hidden;margin-top:3px;}
.cult-bar{height:100%;border-radius:var(--r-full);transition:width .6s var(--ease);}
.cult-badge{display:inline-block;font-size:10px;font-weight:700;padding:3px 8px;border-radius:var(--r-full);}

/* ── FAB (botão flutuante) ── */
.fab{
  position:fixed;bottom:28px;right:24px;
  width:50px;height:50px;
  background:var(--brand);border-radius:50%;border:none;cursor:pointer;
  display:grid;place-items:center;
  box-shadow:0 4px 20px rgba(0,168,150,.45),0 2px 8px rgba(0,0,0,.12);
  transition:transform .15s var(--ease),box-shadow .15s var(--ease);
  z-index:200;
}
.fab:hover{transform:scale(1.1);box-shadow:0 6px 24px rgba(0,168,150,.55);}
.fab svg{width:20px;height:20px;stroke:#fff;fill:none;stroke-width:2.5;stroke-linecap:round;}

/* ── RESPONSIVO DASHBOARD ── */
@media(max-width:768px){
  .dash-ctx{flex-direction:column;align-items:flex-start;gap:var(--s-3);}
  .day-ring{position:absolute;top:var(--s-4);right:var(--s-4);}
  .fab{bottom:80px;right:16px;} /* evita sobreposição com bottom nav */
}
@media(max-width:560px){
  .ctx-chip{font-size:11px;}
  .cult-name{font-size:12px;}
  .treino-ativ{font-size:13px;}
}
```

## ✅ Critério de aceite
- `.dash-ctx` com gradiente teal visível
- `@keyframes ring-in` animando o anel ao carregar
- `.card-treino` com barra de progresso verde e botão
- `.card-cultura` com header roxo + 3 linhas (livro/série/estudos)
- `.fab` fixo visível, teal com sombra
- Zero overflow horizontal em 360px
- Tema escuro: tokens `--surface-*` e `--text-*` funcionando corretamente
- Zero erro no console

## 📂 Escopo
**Mexe:** css/estilo.css (APPEND ao final — zero edição de regras existentes)
**NÃO toca:** HTML, JS, outros arquivos CSS
