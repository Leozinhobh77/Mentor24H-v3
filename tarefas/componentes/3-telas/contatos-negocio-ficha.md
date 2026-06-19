# Ficha do Cliente (Contatos Negócio) — padrão .ctf-*

> Origem: executor-20260618-004 (F2) · 2026-06-18 · só visual + reorganização (lógica intacta)

## O que é
`renderFicha(c)` em `js/negocio/10-clientes.js` migrada do layout antigo (`.bento`/`.card col-*`)
para o sistema visual `.ctf-*` (mesmo da ficha Pessoal), batendo com `_mockups/contatos-negocio-ficha-360.png`.

## Anatomia
- **.ctf-head** → botão Voltar (`.ctf-back`, `[data-back]`).
- **.ctf-hero** (centralizado mobile / 2-col desktop ≥720): `.ct-av` 74px + `.ctf-nm` + `.ctf-score` (selo RFM)
  + `.ctf-pills` [WhatsApp `.ctf-pill-wa` (wa.me) · Ligar `.ctf-pill` (tel:) · ⚡ Ações `.ctf-pill-acts` `[data-fpop]`].
- **Janelinha ⚡** = `popHTML(c)` (reusa markup `.ct-pop` da F1, com `data-fpop`/`data-fact` próprios pra não colidir
  com o handler delegado da lista). Fecha por clique-fora + ESC via `ensurePopListeners()` (flag `_popListeners`).
- **.ctf-cards** (grid 2-col ≥720):
  1. Caderneta (fiado): `.cad-val` (saldo, cor por estado) + `.cad-bar` (limite) + `Limite` `[data-editlim]` + `Cobrar no WhatsApp`.
  2. Resumo: `.fk-grid` 4 KPIs (Total gasto/Compras/Ticket/Última).
  3. Relacionamento: aniversário (`.ctf-kv`) + alerta RFM Sumido/Em risco + anotações (`.ctf-notetxt`).
  4. Extrato de compras (`.ctf-card--full`): `extratoRow(v)` (restilizado p/ `.ctf-ev-*`) + `Receber` `[data-receber]`.

## CSS criado (css/estilo.css)
`.ctf-pill-acts` · `#clientes-root .ctf-hero .ct-av` (74px) · `#clientes-root .ctf-hero .ct-pop` (ancoragem) ·
`.cad-lab/.cad-val/.cad-limrow/.cad-bar` · `.fk-grid/.fk/.fk-l/.fk-v` · `#clientes-root .ctf-card .ctf-notetxt`.
Zero cor hardcoded (tudo token). Reusou `.ctf-*` já existentes.

## Estados cobertos
Saldo>0 (warning) · estouro de limite (expense + alerta) · em dia (income) · sem aniversário · extrato vazio.

## Reusos intactos (não tocados)
metricas · rfm · diasAniv · limiteDe · waLink · fmt/fmtD · receberVenda · editarLimite · editarContatoNeg.

## Evidência
Smoke real Playwright 360/1280 (claro+escuro): 46/46 VERDE · console 0 · overflow 0.
`tarefas/screenshots/smoke-ct-neg-f2-{360,1280}.png` + `smoke-ct-neg-f2-pop-360.png`.
