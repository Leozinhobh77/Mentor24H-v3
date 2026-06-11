---
id: 10
titulo: CSS .fin-* (MEI/Metas) + polish responsivo + tema
status: todo
expert: forge
depende_de: 09
---

## O que é
Acabamento visual Quiet Premium das 2 abas novas (MEI e Metas), reusando o bloco `.fin-*` da 25A.

## Etapas
1. Estender o bloco `/* FINANCEIRO (Etapa 25A) */` no fim de `css/estilo.css` com as classes novas (`.fin-mei-*`, `.fin-meta-*`, `.fin-das-*`, `.fin-reserva-*`) — tudo via tokens (`var(--s-*)`, `var(--income/expense/warning)`, `var(--surface-*)`), zero hardcode.
2. Barra do limite MEI com faixas de cor por token; cards de DAS (12 meses) em grid que **empilha sem overflow** no 360px.
3. Pró-labore e Reserva: cards alinhados, botões sem sobreposição.
4. Responsivo 360px (4 abas no seg viram scroll horizontal se preciso) + tema claro E escuro conferidos.
5. Estados vazios em Metas/DAS.

## ✅ Critério de aceite
- 360px sem overflow horizontal nas 4 abas; claro/escuro ok; zero cor hardcoded no CSS novo; alinhamento e espaçamento consistentes com a 25A.

## 📂 Escopo
- **Mexe:** `css/estilo.css` (só estende o bloco `.fin-*`).
- **NÃO toca:** CSS de outros módulos, JS.
