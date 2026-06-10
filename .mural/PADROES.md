# PADRÕES APROVADOS — Mentor24h

> Append-only. Padrões de design/arquitetura aprovados pelo Léo. O Executor obedece; o Maestro lê antes de planejar.

<!-- Ex: "Stack: HTML/CSS/JS vanilla, zero build." / "Cor primária = teal." / "Clientes = view, não entidade." -->

- (2026-06-10) Design 'Quiet Premium' teal — tudo via tokens CSS (zero cor/spacing hardcoded); tema claro/escuro; responsivo sem overflow ate 360px

- (2026-06-10) Arquitetura modular: index.html + css/estilo.css + js/01-core.js (DB/rotas/modos) + js/15-mentor.js + modulos por dominio em js/pessoal/ e js/negocio/

- (2026-06-10) Reusar componentes existentes: Charts (donut/linha/barras), heatmap, .page-kpis/.kpi, seletor de periodo, cards padrao — nunca reinventar

- (2026-06-10) Dados: mock em memoria (DB.*) ate a Etapa 28 (Supabase, online-only); zero localStorage/offline

- (2026-06-10) Toda etapa fecha com smoke visual Playwright real (console limpo + sem overflow + mobile 360px) antes de marcar concluida

- (2026-06-10) WhatsApp sempre via wa.me (texto formatado padrao Leo); Mentor ganha regras novas a cada modulo (3 tons + trava de empatia)
