---
id: 01
titulo: DB + seed — despesasNeg e caixaAvulso
status: todo
expert: construtor
depende_de: —
---

## O que é
Criar as bases de dados da Etapa 25A no `DB` central: `DB.despesasNeg` (despesas do negócio) e `DB.caixaAvulso` (lançamentos manuais de caixa), com seed demo realista da Pizza e Cia BH espalhado por ~3 meses.

## Etapas
1. Em `js/01-core.js`, logo após `encomendas:[]` (linha ~490), adicionar `despesasNeg:[]` e `caixaAvulso:[]` com comentário `// Etapa 25A`.
2. No bloco de SEED (mesmo padrão das encomendas), popular `despesasNeg` com ~12 despesas demo: categorias **insumos · embalagem · aluguel · luz/água · marketing · taxas · outros**; misto de fixas (aluguel, luz) e variáveis (insumos); 2 recorrentes mensais, 1 parcelada (3/6 parcelas), algumas pagas e 2 "a pagar" com vencimento futuro.
3. Shape da despesa: `{id, desc, categoria, valor, tipo:'fixa'|'variavel', recorrencia:null|'mensal'|'semanal', parcelas:null|{atual,total}, pago:bool, vencimento:'YYYY-MM-DD', pagoEm:null|'YYYY-MM-DD', fornecedorId:null}`.
4. Popular `caixaAvulso` com 2-3 lançamentos: `{id, tipo:'entrada'|'saida', desc, valor, data}`.
5. Usar `offset(n)` e `nid()` como o seed existente (datas relativas, nunca hardcoded).

## ✅ Critério de aceite
- App abre sem erro no console; `DB.despesasNeg.length >= 12` e `DB.caixaAvulso.length >= 2` no console.
- Seed coerente: recorrentes/parceladas/a-pagar presentes; datas espalhadas por ~90 dias.

## 📂 Escopo
- **Mexe:** `js/01-core.js` (só bloco DB + SEED).
- **NÃO toca:** router, módulos existentes, CSS, index.html.
