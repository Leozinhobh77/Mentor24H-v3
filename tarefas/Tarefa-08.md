---
id: 08
titulo: Aba 🎯 Metas + Pró-labore (ponte PF/PJ) + Reserva
status: todo
expert: construtor
depende_de: 07
---

## O que é
4ª aba do `financeiro.js`: metas do negócio + o "salário do dono" (pró-labore com ponte pra vida pessoal) + reserva do negócio.

## Etapas
1. Botão `🎯 Metas` no `segBar()` (estado `aba='metas'`).
2. **Metas do negócio** (`DB.metasNeg`): cards com barra de progresso. Faturamento = soma vendas do mês (competência); Lucro = receita − custo (reusar cálculo do RelatoriosNeg) − despesas pagas do mês. CRUD: criar/editar/excluir meta (tipo, alvo, mês). Estado vazio.
3. **Pró-labore** ("salário do dono"): card mostrando valor mensal (`DB.negocioFin.proLaboreValor`), status do mês (retirado ✓ / em aberto), botão **"💸 Retirar pró-labore"** → registra em `DB.proLaboreReg` + lança **saída no Caixa** (via `DB.caixaAvulso`/despesa — usar o mesmo caminho que vira saída no motor da 25A) + ⭐ **PONTE PF/PJ**: cria transação pessoal `DB.transacoes.push({id:nid(),tipo:'entrada',descricao:'Pró-labore',valor,cat:'receita',metodo:'Transferência',data:hoje()})` — assim aparece como entrada nas Finanças pessoais. Toast explicando ("entrou R$ X na sua vida pessoal").
4. **Reserva do negócio** (`DB.reservaNeg`): card com saldo + botões Guardar / Resgatar (modal valor) → atualiza saldo e movimentos; guardar = saída no caixa, resgatar = entrada. Lista curta dos últimos movimentos.
5. Texto educativo curto: "Pró-labore separa o dinheiro da empresa do seu — saúde financeira pra PF e PJ."

## ✅ Critério de aceite
- Retirar pró-labore: aparece saída no Caixa E entrada nas Finanças pessoais (conferir no extrato pessoal); não duplica.
- Meta progride conforme vendas/lucro; reserva guarda/resgata e reflete no caixa.

## 📂 Escopo
- **Mexe:** `js/negocio/financeiro.js` · grava em `DB.transacoes` (ponte — aditivo).
- **NÃO toca:** módulo de Transações/Contas pessoais (só insere o registro), PDV.
