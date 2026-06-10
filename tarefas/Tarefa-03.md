---
id: 03
titulo: Aba Despesas — CRUD + recorrente/parcelada + donut + delta
status: todo
expert: construtor
depende_de: 02
---

## O que é
A aba **📑 Despesas** completa: gestão de despesas do negócio estilo Kyte (recorrentes E parceladas), com leitura visual por categoria.

## Etapas
1. Lista de despesas do mês (seletor de mês ‹ › como Contas pessoais): cards com desc, categoria (chip), valor, badge fixa/variável, badge recorrente 🔁 / parcela 3/6, status **pago** (verde) / **a pagar** (warning, com vencimento "vence em Xd" / "atrasada" vermelho).
2. KPIs topo (`.page-kpis`): Total do mês · Pago · A pagar · Δ vs mês anterior (verde se caiu, vermelho se subiu).
3. CRUD: modal add/editar (desc, categoria datalist, valor, tipo, recorrência, parcelas, vencimento, fornecedor opcional via `DB.fornecedores`); excluir com `Modal.confirm`; botão "✓ Paguei" no card → `pago=true, pagoEm=hoje` + Toast.
4. Recorrente: ao virar o mês a despesa reaparece em aberto (gerar instância do mês na leitura — sem job; calcular on-render como Contas pessoais fazem com recorrência — **estudar `js/pessoal/03-contas.js` e reusar a mesma técnica**).
5. Donut por categoria (Charts.donut, igual Relatórios) do mês selecionado.
6. Estado vazio amigável + filtro por categoria (chips com contador, padrão Salvos).

## ✅ Critério de aceite
- CRUD completo funciona; "Paguei" muda status na hora; recorrente reaparece no mês seguinte; parcelada mostra n/total.
- Donut bate com os valores; delta vs mês anterior correto; estado vazio ok.

## 📂 Escopo
- **Mexe:** `js/negocio/financeiro.js`.
- **NÃO toca:** `03-contas.js` (só LER a técnica de recorrência), outros módulos.
