# Tela — Financeiro (modo Negócio)

## 📌 Estado atual
- **Arquivo:** `js/negocio/financeiro.js` (IIFE `Financeiro`, expõe `{render, renderAba}`) · raiz `#financeiro-root`
- **4 abas** (`enc-seg fin-seg4`, scroll mobile): **💵 Caixa** (default) · **📑 Despesas** · **🏛️ MEI** · **🎯 Metas**. Estado da aba persiste entre navegações (module-level `aba`).
- **MEI:** barra de limite anual (faturamento por COMPETÊNCIA — data da venda, total cheio) · projeção de ritmo × 12 · DAS 12 meses (marca pago) · aviso DASN · config editável (modal).
- **Metas:** CRUD de metas de faturamento/lucro (`DB.metasNeg`) com barra de progresso · pró-labore ("salário do dono" — botão Retirar → saída Caixa + entrada `DB.transacoes` como ponte PF/PJ + Toast explicativo) · reserva do negócio (guardar/resgatar → `DB.caixaAvulso` e `DB.reservaNeg`).
- **Rotas virtuais:** `navigate('financeiro-mei|metas|caixa|despesas')` mapeiam para `financeiro` com `renderAba(tab)`.
- **Caixa:** seletor de período (Hoje/7d/30d/Mês/Custom, padrão RelatoriosNeg) · 4 KPIs (Entradas/Saídas/Saldo/A receber) · Saldo acumulado (`Charts.line`, parte do saldo real anterior ao período) · Projetado 30 dias com alerta "caixa fica negativo dia X" · botão "+ Lançamento" (avulso → `DB.caixaAvulso`) · Extrato com ícone por origem (venda/fiado/sinal/despesa/avulso).
- **Despesas:** seletor de mês ‹ › · 3 KPIs (Total/Pago/A pagar) + delta vs mês anterior (invertido: subir=vermelho) · donut por categoria + legenda · chips de filtro (padrão Salvos) · cards com badges fixa/variável · 🔁 mensal · parcela n/total · status pago/vence em Xd/atrasada · CRUD via `Modal.open` + "✓ Paguei".
- **Registro:** nav `index.html:66` · section `data-page="financeiro"` · script antes do 15-mentor · `TITLES`/`navigate()` em `01-core.js` · `NAVICON` em `15-mentor.js` (⌘K pega via TITLES).
- **Visibilidade:** herda do nav-group `data-ctx="negocio"` (invisível no modo Pessoal — mesmo mecanismo das Encomendas).
- **CSS:** bloco `/* ═══ FINANCEIRO (Etapa 25A) ═══ */` no fim de `estilo.css`, classes `.fin-*`, 100% tokens; `#fin-body .delta` (pílula escopada). Mobile <560px: `.fin-card` empilha.

## ⚠️ Cuidados (anti-regressão)
- `aba` persiste: testes/fluxos que voltam à tela podem cair em Despesas — clicar `[data-faba="caixa"]` antes de verificar o extrato.
- Recorrência é **on-render virtual** (id `v-<base>-<ym>`): não gravar virtuais no DB; pagar materializa com `_recorrenteDe` (suprime a virtual do mês).
- Categorias/cores: `CATS`/`CATCOR` no topo do módulo (tokens, donut usa `var(--*)`).

## 📜 Histórico
- **2026-06-10** (executor-20260610-002 · Etapa 25A): criada com as 2 abas completas. Smoke Playwright 31/31 (console 0, overflow 0 em 360px/desktop/dark, números conferidos contra o seed).
- **2026-06-10** (executor-20260610-003 · Etapa 25B): 2 abas novas (🏛️ MEI e 🎯 Metas). `segBar()` expandido para 4 botões com `.fin-seg4` (scroll mobile). Rotas virtuais `financeiro-mei/metas/caixa/despesas` no `navigate()`. Smoke Playwright 30/30.
