---
id: 07
titulo: Aba 🏛️ MEI — faturamento vs limite + projeção + DAS + DASN
status: todo
expert: construtor
depende_de: 06
---

## O que é
3ª aba do `financeiro.js`: o painel de obrigações do MEI (estilo MaisMEI/Qipu), com monitor do limite anual e controle do DAS.

## ⚠️ Sutileza técnica (não confundir com a aba Caixa)
**MEI conta por FATURAMENTO (regime de COMPETÊNCIA)** — soma `DB.vendas` pela **data da venda**, valor **total cheio** (à vista + a prazo, recebido ou não). Isso é DIFERENTE da aba Caixa (regime de caixa). Deixar claro no código com comentário.

## Etapas
1. Adicionar botão `🏛️ MEI` no `segBar()` do financeiro.js (estado `aba='mei'`).
2. **Monitor do limite anual**: barra de progresso faturamento do ano (jan→dez) vs `DB.negocioFin.meiLimite`. Faixas: 🟢 <70% · 🟡 70-100% · 🔴 >100% (+ aviso da regra dos 20%: até R$ 97.200 desenquadra ano seguinte, acima retroage). KPIs: faturado no ano · disponível · % usado.
3. **Projeção de ritmo**: média mensal × 12 → "nesse ritmo você fecha o ano em R$ X" com alerta se projeta estourar o limite.
4. **Controle do DAS**: lista dos 12 meses do ano com status pago/em aberto (lê `DB.dasPagos`), valor `DB.negocioFin.dasValor`, vencimento dia `dasDia`. Botão "✓ Paguei o DAS" no mês → marca pago. Destaque do mês atual (vence em Xd / atrasado vermelho).
5. **Lembrete DASN**: card informativo "Declaração anual (DASN-SIMEI) até 31/05".
6. **Config editável** (engrenagem): editar limite, valor do DAS, dia, dia do pró-labore — grava em `DB.negocioFin`.
7. Reusar `.page-kpis`, barras e Charts existentes.

## ✅ Critério de aceite
- Faturamento bate com soma manual de `DB.vendas` do ano (total cheio).
- Faixas de cor corretas; projeção coerente; DAS marca pago e reflete; config salva.

## 📂 Escopo
- **Mexe:** `js/negocio/financeiro.js`.
- **NÃO toca:** aba Caixa/Despesas (só compartilha helpers), PDV.
