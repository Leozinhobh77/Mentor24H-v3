---
id: 04
titulo: Aba Caixa — motor entradas−saídas + acumulado + projetado 30d
status: todo
expert: construtor
depende_de: 03
---

## O que é
A aba **💵 Caixa**: o coração da etapa. Agrega TUDO que já existe (só leitura) num fluxo de caixa por **regime de caixa** (conta quando o dinheiro entra/sai de verdade), com saldo acumulado e projeção 30 dias (estilo Conta Azul).

## Etapas
1. **Motor `eventosCaixa(ini,fim)`** — monta a linha do tempo de eventos:
   - ➕ Vendas à vista/cartão/pix: `DB.vendas` com `pagamento!=='a_prazo'` na `v.data`.
   - ➕ Fiado recebido: vendas `a_prazo` quando marcadas recebidas — **hoje não há data do recebimento**: em `js/negocio/12-vendas.js` (~linha 447, "Marcar como recebido?"), gravar aditivamente `v.recebidoEm=hoje`. Vendas demo já "pagas" sem `recebidoEm`: usar `v.data` como fallback.
   - ➕ Sinais de encomendas: `e.sinal` na data de criação (se não houver campo de criação, adicionar `criadaEm` no seed — aditivo; fallback `e.data`).
   - ➖ Despesas com `pagoEm` (Tarefa-03) na data do pagamento.
   - ± `DB.caixaAvulso` na data.
2. KPIs do período (seletor padrão Hoje/7d/30d/Mês/Custom — reusar o de RelatoriosNeg): **Entradas · Saídas · Saldo do período · 💰 A receber** (fiado pendente + restantes de encomendas ativas, linha informativa).
3. **Saldo acumulado**: `Charts.line` dia a dia no período.
4. **Projetado 30 dias**: linha futura = saldo atual + (despesas recorrentes/a-pagar programadas ➖) + (restantes de encomendas com data futura ➕). Card "📅 Próximos 30 dias" com alerta visual se a linha cruza o zero ("seu caixa fica negativo dia X").
5. Lançamento avulso: botão "+ Lançamento" (entrada/saída, desc, valor, data) → `DB.caixaAvulso`.
6. Extrato do período: lista cronológica dos eventos com ícone por origem (venda/fiado/sinal/despesa/avulso), cores `var(--income)`/`var(--expense)`.

## ✅ Critério de aceite
- Números batem: somar na mão 2-3 dias do seed e conferir com a tela.
- Projeção mostra os compromissos futuros; alerta de negativo aparece quando aplicável no seed.
- Mexida em `12-vendas.js` é só a linha do `recebidoEm` (aditiva, zero refactor).

## 📂 Escopo
- **Mexe:** `js/negocio/financeiro.js` · `js/negocio/12-vendas.js` (1 linha aditiva ~447) · `js/01-core.js` (campo `criadaEm` no seed de encomendas, se faltar).
- **NÃO toca:** PDV/fluxo de venda, RelatoriosNeg, Encomendas UI.
