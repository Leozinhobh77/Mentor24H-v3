---
id: 30
titulo: Construir _mockups/mockup-financas.html (standalone, dados fake, lógica)
status: todo
modo: construtor
expert: frontend-dev
depende_de: [26, 27, 28, 29]
---

## 🖥️ HUD — COPIAR E IMPRIMIR ANTES DE EXECUTAR (não reescrever, não resumir)

```
┌─ Mentor24h-v3 · executor-20260613-001 ───────────────────┐
│ 🔄 RUN ▰▰▰▰▰▱ 5/6  ·  🔨 Construtor 1/1                   │
│ 🧠 Expert ativo: frontend-dev                             │
│ ⏳ AGORA:   Tarefa-30 · construir o protótipo            │
│ ✅ Aceite:  abre no navegador, console limpo, isolado     │
│ ⏭️ PRÓXIMA: Tarefa-31 · smoke + screenshots              │
└───────────────────────────────────────────────────────────┘
```

> ⚠️ Executor: imprima o bloco acima **literalmente** antes de começar. Ao concluir, reimprima com ✅ e barra avançada.

## O que é
Materializar as Tarefas 26–29 num **único arquivo HTML standalone**: `_mockups/mockup-financas.html`. Descartável, isolado, abre direto no navegador. **Não importa nada do app** e **não entra no index.html**.

## Etapas (ordem natural 1→n)
- [ ] 1. Criar a pasta `_mockups\` + `_mockups\README.md` (1 linha: "Protótipos visuais — descartáveis, não fazem parte do app.").
- [ ] 2. Criar `mockup-financas.html`: `<head>` com `<link rel="stylesheet" href="../css/estilo.css">` (read-only, herda tokens + classes) + `<style>` inline com as classes `.fin-resumo*` da Tarefa-26.
- [ ] 3. Helpers inline no `<script>`: `fmt(v)` (R$ pt-BR), `svg(nome,size)` mínimo (só os ícones usados: arrowup, arrowdown, alert, wallet, repeat), e a função `donut(items,size)` **copiada** de `js/02-ui.js` (não importar o arquivo).
- [ ] 4. **Dados fake** (array `CONTAS`, 8–10 itens variados cobrindo todos os buckets): vencidas (luz −R$142,90 / internet −R$99,90), vence hoje (aluguel −R$1.200), esta semana (freela +R$800 / cartão −R$540), próximas (academia −R$89,90 / reembolso +R$230 / streaming −R$39,90), pagas (água / venda usado). Campos: `{id, tipo:'pagar'|'receber', desc, valor, venc(ISO), cat, metodo, status:'pendente'|'paga', recorrente?}`.
- [ ] 5. Lógica: `diasAte(venc)` + `bucketDe(c)` (→ vencida/hoje/semana/proximas/paga); somas (a pagar, a receber, vencidas, saldo previsto = receber − pagar); donut [{receber,--income},{pagar,--expense}].
- [ ] 6. Render: bloco `fin-resumo` (hero + donut/barra + tira) → lista agrupada com subtotais → "Pagas" recolhida.
- [ ] 7. Interação (Tarefa-27): clique nos cards-filtro (exclusivo + toggle + estado ativo), collapse "Pagas", micro-fade ao filtrar. A11y da Tarefa-29 (aria-pressed, aria-expanded, teclado, ≥44px).
- [ ] 8. Responsivo: `@media(max-width:640px)` dentro do `<style>` inline → tira fica 3-col lado a lado, donut vira barra slim, sem overflow-x.
- [ ] 9. Abrir e conferir: console limpo, layout fiel, nada quebrado.

## ✅ Critério de aceite (self-check com evidência)
- [ ] `_mockups/mockup-financas.html` abre no navegador e renderiza a tela completa.
- [ ] Cards-filtro, collapse e fade funcionam.
- [ ] **Zero erro no console.**
- [ ] NÃO importa JS do app, NÃO entra no index.html, NÃO edita css/estilo.css (só `<link>`).
- [ ] Mobile 360px sem overflow horizontal; tira não empilha.

## 📂 Escopo
Mexe: cria `_mockups\README.md` + `_mockups\mockup-financas.html` · NÃO toca: `index.html`, `css\estilo.css`, `js\**`, `js\pessoal\03-contas.js`, dados/DB do app 🔒
