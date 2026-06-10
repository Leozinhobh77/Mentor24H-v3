# Lógica/Dados — Financeiro (DB.despesasNeg · DB.caixaAvulso · motor de caixa)

## 📌 Estado atual
- **`DB.despesasNeg`** (`01-core.js`, seed após fornecedores): `{id, desc, categoria, valor, tipo:'fixa'|'variavel', recorrencia:null|'mensal', parcelas:null|{atual,total}, pago, vencimento, pagoEm, fornecedorId, _recorrenteDe?}`. Seed: 13 despesas (~90 dias, 7 categorias, 2 recorrentes, 1 parcelada 3/6, 2 a-pagar).
- **`DB.caixaAvulso`**: `{id, tipo:'entrada'|'saida', desc, valor, data}`. Seed inclui **"Saldo inicial do caixa" R$ 5.000** (sem ele o caixa demo começava negativo).
- **Motor `eventosCaixa(ini,fim)`** (regime de caixa — quando o dinheiro mexe): ➕ vendas `pagamento!=='a_prazo'` na `v.data` · ➕ fiado `a_prazo` pago em `v.recebidoEm||v.data` · ➕ sinais de encomendas em `e.criadaEm||e.data` · ➖ despesas pagas em `d.pagoEm` · ± avulsos.
- **`projecao30()`**: saldo atual (tudo até hoje) + a-pagar futuras (atrasadas pesam no dia 1) + próximas instâncias das recorrentes (2 meses, com supressão por `_recorrenteDe`) + restantes de encomendas ativas com data futura. Retorna `{saldoAtual, vals[31], diaNeg}`.
- **Campos aditivos em outros módulos:** `v.recebidoEm` gravado no "Marcar como recebido" (`12-vendas.js:449`) · `criadaEm` no seed de encomendas · Fornecedor "✓ Paguei" (`10-clientes.js`) abate `DB.contas` pendentes (antigas primeiro) e cria despesa paga (`categoria:'insumos'`, `fornecedorId`).

## ⚠️ Cuidados (anti-regressão)
- Fiado demo sem `recebidoEm` usa `v.data` como fallback — não remover o fallback.
- Não duplicar instância de recorrente: sempre checar `_recorrenteDe` antes de criar/projetar.
- Despesa **não paga** NÃO entra no caixa (só na projeção). `vencimento` ≠ data de caixa; quem manda é `pagoEm`.

## 📜 Histórico
- **2026-06-10** (executor-20260610-002 · Etapa 25A): criado seed + motor + projeção + integrações (recebidoEm/criadaEm/Paguei). Validado com soma manual independente no smoke (538/2820/494,50).
