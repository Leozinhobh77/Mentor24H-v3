---
id: 05
titulo: Fornecedor "Paguei" → saída no caixa + CSS .fin-* + polish
status: todo
expert: construtor → forge
depende_de: 04
---

## O que é
Fechar a integração com Fornecedores (caixa não pode mentir) e dar o acabamento visual Quiet Premium.

## Etapas
1. Em `js/negocio/10-clientes.js` (área de Fornecedores, onde mostra "quanto devo"): botão **"✓ Paguei"** → modal valor (default = dívida) → cria despesa em `DB.despesasNeg` (`categoria:'insumos'`, `fornecedorId`, `pago:true, pagoEm:hoje`) e abate a dívida do fornecedor pelo mecanismo existente. Aparece no Caixa automaticamente.
2. CSS `.fin-*` em `css/estilo.css` (fim do arquivo, comentário `/* ═══ FINANCEIRO (Etapa 25A) ═══ */`): tudo via tokens (`var(--s-*)`, `var(--income)`, `var(--expense)`, `var(--surface-*)`), zero hardcode.
3. Responsivo 360px: KPIs empilham, gráficos não estouram, abas viram scroll horizontal se preciso — **sem overflow e sem sobreposição**.
4. Tema claro E escuro conferidos.

## ✅ Critério de aceite
- "Paguei" no fornecedor reflete no Caixa e na aba Despesas na hora.
- 360px sem overflow horizontal; claro/escuro ok; zero cor hardcoded no CSS novo.

## 📂 Escopo
- **Mexe:** `js/negocio/10-clientes.js` (só área Fornecedores, aditivo) · `css/estilo.css` (só bloco novo `.fin-*`).
- **NÃO toca:** CRM/clientes, CSS existente de outros módulos.
