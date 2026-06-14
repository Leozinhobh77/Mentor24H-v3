# Ficha — Tela Finanças Pessoal v2 (Redesign)
> executor-20260614-001 · 2026-06-14

## Arquivos tocados
- `js/pessoal/03-contas.js` — IIFE Contas reescrita (l.1–109)
- `css/estilo.css` — bloco `#contas-root .fin-*` appendado ao final
- `.mural/PADROES.md` — padrão de semanas de calendário anotado

## O que faz
- `fin-resumo`: hero Saldo previsto + donut (desktop) / barra (mobile) + tira 3-em-linha cards-filtro
- `calcReserva()`: sub-linha "Pra fechar o mês: R$/dia" com edge cases (0 dias / sem dívida / mês ≠ atual)
- `semanasMes(ym)`: fatia o mês em semanas seg–dom com segmentos parciais; denominador adaptativo (futura/atual/passada)
- `navMes(delta)`: estado `mesAtivo` filtra contas por `venc.slice(0,7)`; reserva sem "faltam N dias" em meses ≠ atual
- `openQuick/closeQuick`: menu rápido ao tap na linha (44px+, teclado Enter/Espaço); reutiliza pay/form/del
- filtros expansíveis: busca + categoria se somam a filtroCard + mesAtivo
- faixa Mentor: `Mentor.feed().filter(i => i.modulo === 'Finanças')`, some se vazio

## CSS — estratégia anti-colisão
Escopo `#contas-root .fin-*` — evita conflito com `.fin-card` l.1285 (Financeiro do Negócio).
Classes novas: `.fin-resumo`, `.fin-nav-mes`, `.fin-hero*`, `.fin-reserva`, `.fin-donut-wrap`, `.fin-prop-bar*`, `.fin-tira`, `.fin-card`, `.fin-card-icon/label/val`, `.fin-grupo*`, `.fin-semana-pill`, `.fin-semana-badge`, `.fin-pagas-body`, `.fin-empty`, `.fin-quick-menu`, `.fin-quick-overlay`, `.fin-filtros*`

## Smoke (T40)
44/44 OK · console 0 · overflow 0px (1280/360, claro/escuro)
1 aviso: `.fin-lista .fin-card` do negócio não encontrado via seletor no smoke (rota negócio sem seed no contexto)

## Cuidados anti-regressão
- `Transacoes` (l.111+) permanece **intocado**
- `.fin-card` l.1285 (`css/estilo.css`) não sobrescrito — escopo garante isolamento
- `js/15-mentor.js` — nenhuma regra alterada, apenas consumido via `Mentor.feed()`
- `pay/del/form` preservados com mesma assinatura — outros módulos que chamem `Contas.pay/form` continuam funcionando
